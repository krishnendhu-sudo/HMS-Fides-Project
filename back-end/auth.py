from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status, Header
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from database import get_db
import models

# Security settings
SECRET_KEY = "SECRET_KEY"  # ⚠️ Replace with a secure random key in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 40000  # 7 days

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# -------------------------------
# Password utilities
# -------------------------------
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str):
    return pwd_context.hash(password)

# -------------------------------
# Token creation
# -------------------------------
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# -------------------------------
# Current user (Swagger-friendly)
# -------------------------------
def get_current_user(
    authorization: str = Header(..., description="Paste your JWT token as: Bearer <token>"),
    db: Session = Depends(get_db)
):
    """
    Decode and validate JWT token manually from the Authorization header.
    Works in Swagger UI without using OAuth2PasswordBearer.
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format. Expected 'Bearer <token>'."
        )

    token = authorization.split(" ")[1]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        company_id = payload.get("company_id")

        if email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    # Identify user based on role
    if role == "super_admin":
        user = db.query(models.SuperAdmin).filter(models.SuperAdmin.email == email).first()
    else:
        user = db.query(models.User).filter(models.User.email == email).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # Attach role and company info
    user.user_type = role
    user.company_id = company_id
    return user
