from sqlmodel import Session
from features.repositories.base_repository import BaseRepository
from features.categories.models import Categoria


class CategoriaRepository(BaseRepository[Categoria]):
    def __init__(self, session: Session):
        super().__init__(session, Categoria)

    def get_by_slug(self, slug: str) -> Categoria | None:
        return self._session.query(self._model).filter(self._model.slug == slug).first()