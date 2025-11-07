from pydantic import EmailStr
from sqlalchemy.orm import Session
from typing import Optional

from ..models.user import User
from ..schemas.user import UserCreate


def get_user_by_email(db: Session, email: EmailStr) -> Optional[User]:
    """Get user by email"""
    return db.query(User).filter_by(email=email).first()


def get_user_by_google_id(db: Session, google_id: str) -> Optional[User]:
    """Get user by Google ID"""
    return db.query(User).filter_by(google_id=google_id).first()


def create_user(db: Session, user_data: UserCreate) -> User:
    """Create a new user"""
    db_user = User(
        email=user_data.email,
        name=user_data.name,
        picture=user_data.picture,
        google_id=user_data.google_id,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_or_create_user(db: Session, user_data: UserCreate) -> tuple[User, bool]:
    """
    Get existing user or create new one
    Returns: (user, created) where created is True if user was just created
    """
    # Try to find by email
    user = get_user_by_email(db, user_data.email)
    if user:
        return user, False

    # Create new user
    user = create_user(db, user_data)
    return user, True
