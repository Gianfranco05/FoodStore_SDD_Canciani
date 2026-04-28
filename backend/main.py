from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError as PydanticValidationError
from sqlalchemy.exc import SQLAlchemyError

from core import (
    http_exception_handler,
    not_found_exception_handler,
    unauthorized_exception_handler,
    forbidden_exception_handler,
    validation_exception_handler,
    pydantic_validation_exception_handler,
    sqlalchemy_exception_handler,
    general_exception_handler,
    NotFoundException,
    UnauthorizedException,
    ForbiddenException,
)

def create_app() -> FastAPI:
    app = FastAPI(
        title="FoodStore API",
        description="API para sistema de pedidos de comida",
        version="0.1.0",
    )
    
    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Exception handlers (RFC 7807 format)
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(PydanticValidationError, pydantic_validation_exception_handler)
    app.add_exception_handler(NotFoundException, not_found_exception_handler)
    app.add_exception_handler(UnauthorizedException, unauthorized_exception_handler)
    app.add_exception_handler(ForbiddenException, forbidden_exception_handler)
    app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler)
    
    @app.get("/health")
    async def health_check():
        return {"status": "healthy", "version": "0.1.0"}
    
    # Incluir routers de features
    from features.auth import router as auth_router
    app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
    
    # Registrar endpoint de prueba en la raíz para verificar conexión
    @app.get("/api/v1/test")
    async def test_connection():
        return {
            "status": "ok",
            "message": "Frontend conectado correctamente al backend",
            "data": {"roles_disponibles": 4}
        }
    
    return app

app = create_app()