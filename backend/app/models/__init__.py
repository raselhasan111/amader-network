from ..db.database import Base

# Import all models here for Alembic to detect them
from .user import User
from .post import Post
from .like import Like
from .follower import Follower
from .notification import Notification

__all__ = ["Base", "User", "Post", "Like", "Follower", "Notification"]
