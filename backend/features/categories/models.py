from sqlmodel import SQLModel, Field
from typing import Optional

class Categoria(SQLModel, table=True):
    __tablename__ = "categorias"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(max_length=100)
    descripcion: Optional[str] = Field(default=None, max_length=500)
    slug: str = Field(max_length=100, unique=True, index=True)
    imagen_url: Optional[str] = Field(default=None, max_length=500)
    activo: bool = Field(default=True)
    padre_id: Optional[int] = Field(default=None, foreign_key="categorias.id")