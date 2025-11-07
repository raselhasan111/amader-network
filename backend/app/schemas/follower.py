from pydantic import BaseModel

class FollowerBase(BaseModel):
    follower_id: int
    followed_id: int

class FollowerCreate(FollowerBase):
    pass

class FollowerResponse(FollowerBase):
    id: int

    class Config:
        from_attributes = True

