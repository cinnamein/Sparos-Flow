from pydantic import BaseModel
from datetime import date, time


class ExpiryItemResponse(BaseModel):
    id: int
    product_name: str
    expiry_date: date
    expiry_time: time
    quantity: int

    model_config = {"from_attributes": True}
