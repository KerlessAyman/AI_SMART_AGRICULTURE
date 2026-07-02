from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User
from app.models.notification import Notification
from app.routes.auth import get_current_user

router = APIRouter()

@router.get("/stats")
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    total_users = db.query(User).count()
    total_notifications = db.query(Notification).count()
    unread_notifications = db.query(Notification).filter(Notification.read == False).count()

    return {
        "total_users": total_users,
        "total_notifications": total_notifications,
        "unread_notifications": unread_notifications,
        "role": current_user.role,
        "name": current_user.name,
        "recent_activity": [
            {
                "type": "disease",
                "title": "تحليل مرض نبات",
                "description": "تم تحليل صورة نبات الطماطم",
                "timestamp": "منذ ساعة"
            },
            {
                "type": "quality",
                "title": "تقييم جودة",
                "description": "تم تقييم جودة محصول البرتقال - Grade A",
                "timestamp": "منذ 3 ساعات"
            },
            {
                "type": "export",
                "title": "توصية تصدير",
                "description": "المحصول مؤهل للتصدير للاتحاد الأوروبي",
                "timestamp": "منذ 5 ساعات"
            }
        ]
    }