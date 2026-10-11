from sqlalchemy import BigInteger, Boolean, Date, ForeignKey, String, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Schedule(Base):
    __tablename__ = "schedules"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("users.id"), nullable=False)
    work_date: Mapped[str] = mapped_column(Date, nullable=False)
    start_time: Mapped[str] = mapped_column(Time, nullable=False)
    end_time: Mapped[str] = mapped_column(Time, nullable=False)

    user: Mapped["User"] = relationship(back_populates="schedules")


class Checklist(Base):
    __tablename__ = "checklists"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    store_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("stores.id"), nullable=False)
    assigned_user_id: Mapped[int | None] = mapped_column(BigInteger, ForeignKey("users.id"), nullable=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    work_date: Mapped[str] = mapped_column(Date, nullable=False)
    due_time: Mapped[str | None] = mapped_column(Time, nullable=True)
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    store: Mapped["Store"] = relationship()
    assigned_user: Mapped["User | None"] = relationship()
