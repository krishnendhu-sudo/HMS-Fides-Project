from fastapi import Depends, HTTPException, status
from models import UserType, User
from auth import get_current_active_user

def require_role(allowed_roles: list[UserType]):
    """Decorator to require specific roles"""
    def role_checker(current_user: User = Depends(get_current_active_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Required roles: {[r.value for r in allowed_roles]}"
            )
        return current_user
    return role_checker

def check_company_access(resource_company_id: int):
    """Verify user belongs to the same company as the resource"""
    def company_checker(current_user: User = Depends(get_current_active_user)):
        if current_user.company_id != resource_company_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: You can only access resources from your company"
            )
        return current_user
    return company_checker
