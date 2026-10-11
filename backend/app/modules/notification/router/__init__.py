from fastapi import APIRouter

router = APIRouter(prefix="/notification", tags=["알림"])


@router.get("/health")
async def health():
    return {"module": "notification", "status": "ok"}
