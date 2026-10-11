from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.modules.account.model import User


async def get_user_by_employee_id(db: AsyncSession, employee_id: str) -> User | None:
    result = await db.execute(
        select(User).options(selectinload(User.store)).where(User.employee_id == employee_id)
    )
    return result.scalar_one_or_none()
