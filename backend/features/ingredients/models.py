from sqlmodel import SQLModel, Field
from typing import Optional

class Ingrediente(SQLModel, table=True):
    __tablename__ = "ingredientes"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(max_length=100)
    unidad_medida: str = Field(max_length=20)
    disponible: bool = Field(default=True)
    alergenos: Optional[str] = Field(default=None, max_length=500)