from fastapi import APIRouter

router = APIRouter(prefix="/inventory", tags=["재고"])


@router.get("/health")
async def health():
    return {"module": "inventory", "status": "ok"}
