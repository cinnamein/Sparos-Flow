from sqlalchemy import BigInteger, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Product(Base):
    __tablename__ = "product"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    barcode: Mapped[str] = mapped_column(String(13), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    price: Mapped[int] = mapped_column(Integer, nullable=False)
