from fastapi import APIRouter

router = APIRouter(prefix="/account", tags=["계정·권한"])


@router.get("/health")
async def health():
    return {"module": "account", "status": "ok"}
