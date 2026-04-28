from sqlmodel import Session
from features.repositories.base_repository import BaseRepository
from features.auth.models import Rol


class RolRepository(BaseRepository[Rol]):
    def __init__(self, session: Session):
        super().__init__(session, Rol)