from pydantic import BaseModel

class LikeBase(BaseModel):
    user_id: int
    post_id: int

class LikeCreate(LikeBase):
    pass

class LikeResponse(LikeBase):
    id: int

    class Config:
        from_attributes = True

