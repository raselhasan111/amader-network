from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..schemas.user import UserCreate, UserResponse
from ..models import User
from ..db.database import get_db
from ..services import user_service

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """Create a new user"""
    # Check for duplicate email
    if user_service.get_user_by_email(db, user_data.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    # Check for duplicate google_id
    if user_data.google_id and user_service.get_user_by_google_id(db, user_data.google_id):
        raise HTTPException(status_code=400, detail="Google ID already registered")
    user = user_service.create_user(db, user_data)
    return user
