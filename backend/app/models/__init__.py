from ..db.database import Base

# Import all models here for Alembic to detect them
from .user import User

__all__ = ["Base", "User"]

