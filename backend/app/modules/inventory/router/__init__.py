from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.security.auth import get_current_user
from app.modules.inventory.schema import InventoryCheckItem
from app.modules.inventory.service import get_inventory_checks_by_store_and_date

router = APIRouter(prefix="/inventory", tags=["재고"])


@router.get("/checks", response_model=list[InventoryCheckItem])
async def list_inventory_checks(
    work_date: date = Query(default_factory=date.today),
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    store_id = int(user["tenant_id"])
    return await get_inventory_checks_by_store_and_date(db, store_id, work_date)
