from fastapi import APIRouter

router = APIRouter()

@router.get("/test")
async def test_connection():
    """Endpoint de prueba para verificar conexión frontend-backend."""
    return {
        "status": "ok",
        "message": "Frontend conectado correctamente al backend",
        "data": {"roles_disponibles": 4}
    }