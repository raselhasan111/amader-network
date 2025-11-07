from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from ..core.enums import NotificationType

class NotificationBase(BaseModel):
    user_id: int
    type: NotificationType
    reference_id: int

class NotificationCreate(NotificationBase):
    pass

class NotificationResponse(NotificationBase):
    id: int
    is_read: bool
    created_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True

