from fastapi import APIRouter

router = APIRouter(prefix="/checklist", tags=["체크리스트"])


@router.get("/health")
async def health():
    return {"module": "checklist", "status": "ok"}
