from fastapi import APIRouter

router = APIRouter(prefix="/ai", tags=["AI"])


@router.get("/health")
async def health():
    return {"module": "ai", "status": "ok"}
