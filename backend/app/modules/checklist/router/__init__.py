from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.security.auth import get_current_user
from app.modules.checklist.schema import ChecklistItem, ChecklistCreateRequest, ChecklistUpdateRequest
from app.modules.checklist.service import get_checklists_by_store_and_date, bulk_update_completion, create_checklist, delete_checklist

router = APIRouter(prefix="/checklist", tags=["체크리스트"])


@router.get("/", response_model=list[ChecklistItem])
async def list_checklists(
    work_date: date = Query(default_factory=date.today),
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    store_id = int(user["tenant_id"])
    rows = await get_checklists_by_store_and_date(db, store_id, work_date)
    return [
        ChecklistItem(
            id=r.id,
            title=r.title,
            work_date=r.work_date,
            due_time=r.due_time,
            is_completed=r.is_completed,
            assigned_user_name=r.assigned_user.name if r.assigned_user else None,
        )
        for r in rows
    ]


@router.post("/", response_model=ChecklistItem)
async def add_checklist(
    body: ChecklistCreateRequest,
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    store_id = int(user["tenant_id"])
    user_id = int(user["user_id"])
    work_date = body.work_date or date.today()
    row = await create_checklist(db, store_id, user_id, body.title, work_date, body.due_time)
    return ChecklistItem(
        id=row.id,
        title=row.title,
        work_date=row.work_date,
        due_time=row.due_time,
        is_completed=row.is_completed,
        assigned_user_name=row.assigned_user.name if row.assigned_user else None,
    )


@router.patch("/")
async def update_checklists(
    body: ChecklistUpdateRequest,
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    store_id = int(user["tenant_id"])
    await bulk_update_completion(db, store_id, body.items)
    return {"status": "ok"}


@router.delete("/{checklist_id}")
async def remove_checklist(
    checklist_id: int,
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    store_id = int(user["tenant_id"])
    await delete_checklist(db, store_id, checklist_id)
    return {"status": "ok"}
