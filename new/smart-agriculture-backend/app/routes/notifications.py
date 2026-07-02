from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from app.database.connection import get_db
from app.models.notification import Notification

router = APIRouter()

class NotificationCreate(BaseModel):
    user_id: Optional[int] = None
    type: str = "report"
    title: str
    title_en: Optional[str] = None
    message: str
    message_en: Optional[str] = None
    action_url: Optional[str] = None

@router.get("/", response_model=List[dict])
def get_notifications(db: Session = Depends(get_db)):
    notifications = db.query(Notification).order_by(Notification.created_at.desc()).all()
    return [
        {
            "id": str(n.id),
            "type": n.type,
            "title": n.title,
            "titleEn": n.title_en,
            "message": n.message,
            "messageEn": n.message_en,
            "actionUrl": n.action_url,
            "read": n.read,
            "timestamp": n.created_at,
        }
        for n in notifications
    ]

@router.post("/")
def create_notification(data: NotificationCreate, db: Session = Depends(get_db)):
    notification = Notification(
        user_id=data.user_id,
        type=data.type,
        title=data.title,
        title_en=data.title_en,
        message=data.message,
        message_en=data.message_en,
        action_url=data.action_url,
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return {
        "id": str(notification.id),
        "type": notification.type,
        "title": notification.title,
        "titleEn": notification.title_en,
        "message": notification.message,
        "messageEn": notification.message_en,
        "actionUrl": notification.action_url,
        "read": notification.read,
        "timestamp": notification.created_at,
    }

@router.post("/{notification_id}/read")
def mark_as_read(notification_id: int, db: Session = Depends(get_db)):
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if notification:
        notification.read = True
        db.commit()
    return {"status": "ok"}

@router.delete("/{notification_id}")
def delete_notification(notification_id: int, db: Session = Depends(get_db)):
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if notification:
        db.delete(notification)
        db.commit()
    return {"status": "ok"}