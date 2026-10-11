from pydantic import BaseModel
from datetime import date, time


class ChecklistItem(BaseModel):
    id: int
    title: str
    work_date: date
    due_time: time | None
    is_completed: bool
    assigned_user_name: str | None

    model_config = {"from_attributes": True}


class ChecklistCreateRequest(BaseModel):
    title: str
    work_date: date | None = None
    due_time: time | None = None


class ChecklistUpdateRequest(BaseModel):
    items: list[dict]  # [{"id": 1, "is_completed": true}, ...]
