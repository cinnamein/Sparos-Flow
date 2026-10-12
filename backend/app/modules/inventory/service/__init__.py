from datetime import date

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.inventory.model import InventoryCheck


async def get_inventory_checks_by_store_and_date(
    db: AsyncSession, store_id: int, work_date: date
) -> list[InventoryCheck]:
    result = await db.execute(
        select(InventoryCheck)
        .where(InventoryCheck.store_id == store_id, InventoryCheck.work_date == work_date)
        .order_by(InventoryCheck.category, InventoryCheck.id)
    )
    return list(result.scalars().all())
