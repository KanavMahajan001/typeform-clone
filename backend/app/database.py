import os

from sqlalchemy import create_engine, event
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy.pool import StaticPool

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./typeform.db")
IN_MEMORY = DATABASE_URL in ("sqlite://", "sqlite:///:memory:")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool if IN_MEMORY else None,
)
SessionLocal = sessionmaker(engine, autoflush=False, expire_on_commit=False)


@event.listens_for(engine, "connect")
def enable_foreign_keys(connection, _):
    connection.execute("PRAGMA foreign_keys=ON")


class Base(DeclarativeBase):
    pass


def get_db():
    with SessionLocal() as db:
        yield db
