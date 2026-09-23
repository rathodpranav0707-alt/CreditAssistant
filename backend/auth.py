"""
auth.py — Password hashing utilities.

Uses the direct `bcrypt` library for secure, industry-standard password hashing.
Plaintext passwords are NEVER stored anywhere in this application.
"""

import bcrypt


def hash_password(plain_password: str) -> str:
    """
    Hash a plaintext password using bcrypt.
    Bcrypt has a 72-byte limit, so we truncate at 72 bytes.
    Returns a hashed string safe to store in the database.
    """
    pwd_bytes = plain_password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Check if a plaintext password matches a stored bcrypt hash.
    Returns True if they match, False otherwise.
    """
    try:
        pwd_bytes = plain_password.encode('utf-8')[:72]
        hashed_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(pwd_bytes, hashed_bytes)
    except Exception:
        return False
