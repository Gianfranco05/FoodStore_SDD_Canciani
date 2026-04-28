from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext

from features.auth.models import Usuario
from features.auth.dependencies import get_current_user
from core.security import create_access_token, verify_password, get_password_hash

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    nombre: str
    telefono: str | None = None


@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Endpoint de login - buscar usuario por email y verificar contraseña."""
    # TODO: Implementar con base de datos real
    # Por ahora retornamos token de prueba
    raise HTTPException(status_code=501, detail="Login aún no implementado con BD")


@router.post("/register", response_model=dict)
async def register(request: RegisterRequest):
    """Endpoint de registro de nuevos usuarios."""
    # TODO: Implementar con base de datos real
    raise HTTPException(status_code=501, detail="Registro aún no implementado con BD")


@router.get("/me")
async def me(current_user: Usuario = Depends(get_current_user)):
    """Obtener información del usuario actual."""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "nombre": current_user.nombre,
        "telefono": current_user.telefono,
    }