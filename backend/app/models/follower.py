from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint, CheckConstraint
from ..db.database import Base

class Follower(Base):
    __tablename__ = "followers"

    id = Column(Integer, primary_key=True, index=True)
    follower_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    followed_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    __table_args__ = (
        UniqueConstraint('follower_id', 'followed_id', name='_follower_followed_uc'),
        CheckConstraint('follower_id != followed_id', name='_chk_no_self_follow'),
    )

    def __repr__(self):
        return f"<Follower {self.id}>"

