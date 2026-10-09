import hashlib
import hmac
import secrets

SALT_BYTES = 16
ITERATIONS = 200_000


def hash_password(password: str) -> str:
    salt = secrets.token_hex(SALT_BYTES)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), ITERATIONS).hex()
    return f"{salt}${digest}"


def verify_password(password: str, stored: str) -> bool:
    salt, digest = stored.split("$", 1)
    candidate = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), ITERATIONS).hex()
    return hmac.compare_digest(candidate, digest)


def new_token() -> str:
    return secrets.token_urlsafe(32)
