from sqlmodel import Session
from features.repositories.base_repository import BaseRepository
from features.products.models import Producto


class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session):
        super().__init__(session, Producto)

    def get_by_nombre(self, nombre: str) -> Producto | None:
        return self._session.query(self._model).filter(self._model.nombre == nombre).first()