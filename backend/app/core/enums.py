import enum

class NotificationType(str, enum.Enum):
    LIKE = "like"
    FOLLOW = "follow"

