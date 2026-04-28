from sqlmodel import Session
from features.repositories.base_repository import BaseRepository
from features.orders.models import Pedido


class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session: Session):
        super().__init__(session, Pedido)

    def get_by_usuario(self, usuario_id: int) -> list[Pedido]:
        return self._session.query(self._model).filter(self._model.usuario_id == usuario_id).all()