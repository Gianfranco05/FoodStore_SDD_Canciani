from sqlmodel import Session
from features.repositories.base_repository import BaseRepository
from features.auth.models import Usuario


class UsuarioRepository(BaseRepository[Usuario]):
    def __init__(self, session: Session):
        super().__init__(session, Usuario)

    def get_by_email(self, email: str) -> Usuario | None:
        return self._session.query(self._model).filter(self._model.email == email).first()