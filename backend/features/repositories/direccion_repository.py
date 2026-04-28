from sqlmodel import Session
from features.repositories.base_repository import BaseRepository
from features.addresses.models import DireccionEntrega


class DireccionRepository(BaseRepository[DireccionEntrega]):
    def __init__(self, session: Session):
        super().__init__(session, DireccionEntrega)

    def get_by_usuario(self, usuario_id: int) -> list[DireccionEntrega]:
        return self._session.query(self._model).filter(self._model.usuario_id == usuario_id).all()