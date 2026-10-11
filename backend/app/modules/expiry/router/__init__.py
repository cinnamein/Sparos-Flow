from fastapi import APIRouter

router = APIRouter(prefix="/expiry", tags=["소비기한"])


@router.get("/health")
async def health():
    return {"module": "expiry", "status": "ok"}
