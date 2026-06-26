import os
from datetime import datetime, timedelta
import jwt
import bcrypt

# JWT signature settings for local sessions
JWT_SECRET = os.getenv("JWT_SECRET", "super-secret-key-for-iqiss-insight-jwt-development")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = int(os.getenv("JWT_EXPIRE_DAYS", "7"))  # IQISS Insight local session duration


def hash_password(password: str) -> str:
    """
    Hashes a plain text password using bcrypt with a random salt.
    """
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain text password against a stored bcrypt hash.
    """
    if not hashed_password:
        return False
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

def create_jwt_token(user_id: int, roles: list[str]) -> tuple[str, datetime]:
    """
    Generates a locally signed JWT token.
    Returns the token as string and its expiration datetime object.
    """
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    payload = {
        "sub": str(user_id),
        "roles": roles,
        "exp": expire
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token, expire

def decode_jwt_token(token: str) -> dict | None:
    """
    Decodes and cryptographically validates the JWT.
    Returns the payload dictionary if valid, otherwise None.
    """
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None
