from sqlmodel import Session
from features.repositories.base_repository import BaseRepository
from features.ingredients.models import Ingrediente


class IngredienteRepository(BaseRepository[Ingrediente]):
    def __init__(self, session: Session):
        super().__init__(session, Ingrediente)