from typing import Optional, List
from sqlmodel import Session, select
from features.repositories.base_repository import BaseRepository
from features.payments.models import Pago


class PagoRepository(BaseRepository[Pago]):
    def __init__(self, session: Session):
        super().__init__(session, Pago)

    def get_by_pedido(self, pedido_id: int) -> List[Pago]:
        """Retorna todos los pagos de un pedido, ordenados por creación descendente."""
        statement = (
            select(Pago)
            .where(Pago.pedido_id == pedido_id)
            .order_by(Pago.created_at.desc())
        )
        return list(self._session.exec(statement).all())

    def get_ultimo_by_pedido(self, pedido_id: int) -> Optional[Pago]:
        """Retorna el pago más reciente de un pedido."""
        pagos = self.get_by_pedido(pedido_id)
        return pagos[0] if pagos else None

    def get_by_idempotency_key(self, key: str) -> Optional[Pago]:
        """Busca un pago por su idempotency_key (unique)."""
        statement = select(Pago).where(Pago.idempotency_key == key)
        return self._session.exec(statement).first()
