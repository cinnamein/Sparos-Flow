from datetime import date

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.expiry.model import ExpiryItem


async def get_expiry_items_by_store_and_date(
    db: AsyncSession, store_id: int, target_date: date
) -> list[ExpiryItem]:
    result = await db.execute(
        select(ExpiryItem)
        .where(ExpiryItem.store_id == store_id, ExpiryItem.expiry_date == target_date)
        .order_by(ExpiryItem.expiry_time)
    )
    return list(result.scalars().all())
