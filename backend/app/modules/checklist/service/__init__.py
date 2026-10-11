from datetime import date

from sqlalchemy import select, update, insert
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.modules.checklist.model import Checklist


async def get_checklists_by_store_and_date(
    db: AsyncSession, store_id: int, work_date: date
) -> list[Checklist]:
    result = await db.execute(
        select(Checklist)
        .options(selectinload(Checklist.assigned_user))
        .where(Checklist.store_id == store_id, Checklist.work_date == work_date)
        .order_by(Checklist.due_time)
    )
    return list(result.scalars().all())


async def bulk_update_completion(
    db: AsyncSession, store_id: int, items: list[dict]
) -> None:
    for item in items:
        await db.execute(
            update(Checklist)
            .where(Checklist.id == item["id"], Checklist.store_id == store_id)
            .values(is_completed=item["is_completed"])
        )
    await db.commit()


async def create_checklist(
    db: AsyncSession,
    store_id: int,
    user_id: int,
    title: str,
    work_date: date,
    due_time=None,
) -> Checklist:
    result = await db.execute(
        insert(Checklist)
        .values(
            store_id=store_id,
            assigned_user_id=user_id,
            title=title,
            work_date=work_date,
            due_time=due_time,
            is_completed=False,
        )
        .returning(Checklist)
    )
    await db.commit()
    row = result.scalars().one()
    await db.refresh(row, ["assigned_user"])
    return row
