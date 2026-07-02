import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from app.core.config import settings

async def send_reset_email(email: str, reset_token: str):
    reset_link = f"http://localhost:5173/reset-password?token={reset_token}"
    
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "إعادة تعيين كلمة المرور - Smart Agriculture"
    msg["From"] = settings.MAIL_USERNAME
    msg["To"] = email
    
    html = f"""
    <div dir="rtl" style="font-family: Arial; padding: 20px;">
        <h2 style="color: #10b981;">🌱 Smart Agriculture System</h2>
        <p>تلقينا طلب إعادة تعيين كلمة المرور لحسابك.</p>
        <p>اضغط على الرابط التالي لإعادة التعيين:</p>
        <a href="{reset_link}" 
           style="background: #10b981; color: white; padding: 12px 24px; 
                  border-radius: 8px; text-decoration: none; display: inline-block; margin: 16px 0;">
            إعادة تعيين كلمة المرور
        </a>
        <p style="color: #666;">الرابط صالح لمدة 30 دقيقة فقط.</p>
        <p style="color: #666;">لو مش أنت اللي طلبت ده، تجاهل الإيميل ده.</p>
    </div>
    """
    
    msg.attach(MIMEText(html, "html"))
    
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(settings.MAIL_USERNAME, settings.MAIL_PASSWORD)
        server.sendmail(settings.MAIL_USERNAME, email, msg.as_string())