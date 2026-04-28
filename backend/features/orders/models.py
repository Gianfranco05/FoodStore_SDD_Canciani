from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime

class EstadoPedido(SQLModel, table=True):
    __tablename__ = "estados_pedido"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(max_length=50)
    descripcion: Optional[str] = Field(default=None, max_length=500)
    orden: int = Field(default=0)
    
    historial: List["HistorialEstadoPedido"] = Relationship(back_populates="estado")

class Pedido(SQLModel, table=True):
    __tablename__ = "pedidos"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuarios.id")
    direccion_entrega_id: int = Field(foreign_key="direcciones_entrega.id")
    estado_id: int = Field(foreign_key="estados_pedido.id")
    subtotal: float = Field(ge=0)
    costo_envio: float = Field(ge=0, default=0)
    total: float = Field(ge=0)
    notas: Optional[str] = None
    fecha_pedido: datetime = Field(default_factory=datetime.utcnow)
    fecha_entrega_estimada: Optional[datetime] = None
    
    historial_estados: List["HistorialEstadoPedido"] = Relationship(back_populates="pedido")

class HistorialEstadoPedido(SQLModel, table=True):
    __tablename__ = "historial_estado_pedido"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    pedido_id: int = Field(foreign_key="pedidos.id")
    estado_id: int = Field(foreign_key="estados_pedido.id")
    fecha_cambio: datetime = Field(default_factory=datetime.utcnow)
    notas: Optional[str] = Field(default=None, max_length=1000)
    
    pedido: "Pedido" = Relationship(back_populates="historial_estados")
    estado: "EstadoPedido" = Relationship(back_populates="historial")