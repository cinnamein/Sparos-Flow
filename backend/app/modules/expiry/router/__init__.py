from datetime import date

from fastapi import APIRouter, Depends, Query, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.security.auth import get_current_user
from app.modules.expiry.model import ExpiryItem
from app.modules.expiry.schema import ExpiryItemResponse
from app.modules.expiry.service import (
    get_expiry_items_by_store_and_date,
    get_all_expiry_items_by_store,
)

router = APIRouter(prefix="/expiry", tags=["소비기한"])


@router.get("/", response_model=list[ExpiryItemResponse])
async def list_expiry_items(
    expiry_date: date = Query(default_factory=date.today),
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    store_id = int(user["tenant_id"])
    return await get_expiry_items_by_store_and_date(db, store_id, expiry_date)


@router.get("/all", response_model=list[ExpiryItemResponse])
async def list_all_expiry_items(
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    store_id = int(user["tenant_id"])
    return await get_all_expiry_items_by_store(db, store_id)


class ExpiryQuantityUpdate(BaseModel):
    quantity: int


@router.patch("/{item_id}", response_model=ExpiryItemResponse)
async def update_expiry_quantity(
    item_id: int,
    body: ExpiryQuantityUpdate,
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    store_id = int(user["tenant_id"])
    item = await db.get(ExpiryItem, item_id)
    if not item or item.store_id != store_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="항목을 찾을 수 없습니다")
    item.quantity = body.quantity
    await db.commit()
    await db.refresh(item)
    return item
