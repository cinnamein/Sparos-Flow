from pydantic import BaseModel


class LoginRequest(BaseModel):
    employee_id: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    name: str
    role: str
    store_name: str
