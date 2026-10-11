from fastapi import APIRouter

router = APIRouter(prefix="/order", tags=["발주"])


@router.get("/health")
async def health():
    return {"module": "order", "status": "ok"}
