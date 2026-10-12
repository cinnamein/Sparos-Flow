from sqlalchemy import BigInteger, Date, ForeignKey, Integer, String, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class ExpiryItem(Base):
    __tablename__ = "expiry_items"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    store_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("stores.id"), nullable=False)
    product_name: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    expiry_date: Mapped[str] = mapped_column(Date, nullable=False)
    expiry_time: Mapped[str] = mapped_column(Time, nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)

    store: Mapped["Store"] = relationship()
