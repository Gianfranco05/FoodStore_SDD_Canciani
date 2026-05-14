from fastapi import Depends
from sqlmodel import Session
from features.payments.service import PaymentService
from features.repositories.unit_of_work import UnitOfWork
from dependencies import get_db_session


def _get_uow(session: Session = Depends(get_db_session)) -> UnitOfWork:
    return UnitOfWork(session)


def get_payment_service(
    uow: UnitOfWork = Depends(_get_uow),
    session: Session = Depends(get_db_session),
) -> PaymentService:
    return PaymentService(uow, session)
