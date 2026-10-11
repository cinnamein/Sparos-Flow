from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.security.auth import get_current_user
from app.modules.expiry.schema import ExpiryItemResponse
from app.modules.expiry.service import get_expiry_items_by_store_and_date

router = APIRouter(prefix="/expiry", tags=["소비기한"])


@router.get("/", response_model=list[ExpiryItemResponse])
async def list_expiry_items(
    expiry_date: date = Query(default_factory=date.today),
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    store_id = int(user["tenant_id"])
    return await get_expiry_items_by_store_and_date(db, store_id, expiry_date)
