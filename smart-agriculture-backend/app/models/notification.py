from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from app.database.connection import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    type = Column(String, default="report")  # disease, export, environment, report, system, marketplace, compliance, user_management
    title = Column(String, nullable=False)
    title_en = Column(String, nullable=True)
    message = Column(Text, nullable=False)
    message_en = Column(Text, nullable=True)
    action_url = Column(String, nullable=True)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())