from fastapi import Depends, HTTPException, status
from models import User, UserType
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# ⚠️ Temporary dummy user (replace later with real JWT logic)
def get_current_user() -> User:
    dummy_user = User(
        id=1,
        name="John",
        email="admin@example.com",
        phone="1234567890",
        user_type=UserType.super_admin,
        is_active=True,
        company_id=None
    )
    return dummy_user


# ✅ Super Admin only
def require_super_admin(user: User = Depends(get_current_user)) -> User:
    if user.user_type != UserType.super_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: SuperAdmin privileges required."
        )
    return user


# ✅ Admin and above (Admin or SuperAdmin)
def require_admin(user: User = Depends(get_current_user)) -> User:
    if user.user_type not in [UserType.Admin, UserType.super_admin]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Admin or higher privileges required."
        )
    return user


# ✅ Doctor only
def require_doctor(user: User = Depends(get_current_user)) -> User:
    if user.user_type != UserType.Doctor:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Doctor privileges required."
        )
    return user


# ✅ Active user check (any logged-in user)
def require_active_user(user: User = Depends(get_current_user)) -> User:
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive."
        )
    return user
