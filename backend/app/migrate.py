from sqlalchemy import Engine, inspect, text

from .auth import hash_password
from .seed import DEMO_PASSWORD


def migrate(engine: Engine) -> None:
    columns = {column["name"] for column in inspect(engine).get_columns("users")}
    if "password_hash" in columns:
        return
    with engine.begin() as connection:
        connection.execute(text("ALTER TABLE users ADD COLUMN password_hash VARCHAR(255)"))
        connection.execute(text("UPDATE users SET password_hash = :hash"), {"hash": hash_password(DEMO_PASSWORD)})
