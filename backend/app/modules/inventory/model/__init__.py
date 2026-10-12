from sqlalchemy import BigInteger, Date, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    barcode: Mapped[str] = mapped_column(String(13), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    price: Mapped[int] = mapped_column(Integer, nullable=False)


class InventoryCheck(Base):
    __tablename__ = "inventory_checks"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    store_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("stores.id"), nullable=False)
    product_name: Mapped[str] = mapped_column(String(200), nullable=False)
    sku: Mapped[str] = mapped_column(String(20), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    category_label: Mapped[str] = mapped_column(String(100), nullable=False)
    pos_stock: Mapped[int] = mapped_column(Integer, nullable=False)
    work_date: Mapped[str] = mapped_column(Date, nullable=False)

    store: Mapped["Store"] = relationship()
