from sqlmodel import Session
from features.repositories.base_repository import BaseRepository
from features.payments.models import FormaPago


class FormaPagoRepository(BaseRepository[FormaPago]):
    def __init__(self, session: Session):
        super().__init__(session, FormaPago)