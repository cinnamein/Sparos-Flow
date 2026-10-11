from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
import app.modules.account.model  # noqa: F401
import app.modules.checklist.model  # noqa: F401
import app.modules.inventory.model  # noqa: F401
from app.modules.order.router import router as order_router
from app.modules.inventory.router import router as inventory_router
from app.modules.expiry.router import router as expiry_router
from app.modules.account.router import router as account_router
from app.modules.checklist.router import router as checklist_router
from app.modules.notification.router import router as notification_router
from app.modules.ai.router import router as ai_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(
    title="Spharos FLOW API",
    description="이마트24 매장 운영 시스템 백엔드",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.APP_ENV == "development" else [],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_V1 = "/api/v1"

app.include_router(order_router, prefix=API_V1)
app.include_router(inventory_router, prefix=API_V1)
app.include_router(expiry_router, prefix=API_V1)
app.include_router(account_router, prefix=API_V1)
app.include_router(checklist_router, prefix=API_V1)
app.include_router(notification_router, prefix=API_V1)
app.include_router(ai_router, prefix=API_V1)


@app.get("/health")
async def root_health():
    return {"service": "spharos-flow", "status": "ok"}
