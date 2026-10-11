from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.security.auth import verify_password, create_access_token
from app.modules.account.schema import LoginRequest, LoginResponse
from app.modules.account.service import get_user_by_employee_id

router = APIRouter(prefix="/account", tags=["계정·권한"])


@router.post("/login", response_model=LoginResponse)
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    user = await get_user_by_employee_id(db, body.employee_id)
    if not user or not verify_password(body.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="사번 또는 비밀번호가 올바르지 않습니다",
        )
    token = create_access_token({
        "sub": str(user.id),
        "tenant_id": str(user.store_id),
        "role": user.role.value,
    })
    return LoginResponse(
        access_token=token,
        name=user.name,
        role=user.role.value,
        store_name=user.store.name,
    )
