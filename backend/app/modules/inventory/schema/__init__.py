from pydantic import BaseModel
from datetime import date


class InventoryCheckItem(BaseModel):
    id: int
    product_name: str
    sku: str
    category: str
    category_label: str
    pos_stock: int

    model_config = {"from_attributes": True}
