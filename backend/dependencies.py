from contextlib import contextmanager
from typing import Generator
from sqlalchemy.orm import Session as DbSession

from database import SessionLocal
from features.repositories.unit_of_work import UnitOfWork


@contextmanager
def get_db_session() -> Generator[DbSession, None, None]:
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@contextmanager
def get_uow() -> Generator[UnitOfWork, None, None]:
    session = SessionLocal()
    try:
        uow = UnitOfWork(session)
        yield uow
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()