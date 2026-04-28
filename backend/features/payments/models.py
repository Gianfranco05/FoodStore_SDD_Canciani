from sqlmodel import SQLModel, Field
from typing import Optional

class FormaPago(SQLModel, table=True):
    __tablename__ = "formas_pago"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(max_length=50)
    descripcion: Optional[str] = Field(default=None, max_length=500)
    icono: Optional[str] = Field(default=None, max_length=255)
    activo: bool = Field(default=True)