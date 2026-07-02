from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.connection import engine, Base
from app.routes import auth, disease, quality, export, iot, notifications, dashboard
from app.routes import models  


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart Agriculture API",
    description="AI-powered Smart Agriculture & Export Intelligence System",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # ✅ Fixed: was [""] (empty string), which blocked all origins
    allow_methods=["*"],      # ✅ Fixed: was [""] (empty string), which blocked all methods
    allow_headers=["*"],
)


app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(disease.router, prefix="/disease", tags=["Disease Detection"])
app.include_router(quality.router, prefix="/quality", tags=["Quality Assessment"])
app.include_router(export.router, prefix="/export", tags=["Export Intelligence"])
app.include_router(iot.router, prefix="/iot", tags=["IoT Environment"])
app.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(models.router, prefix="/models", tags=["AI Model Stats"])

@app.get("/")
def root():
    return {"status": "Smart Agriculture API is running 🌱"}

@app.get("/health")
def health():
    return {"status": "healthy", "version": "1.0.0"}