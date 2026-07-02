from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class IoTRequest(BaseModel):
    temperature: float
    humidity: float
    soil_moisture: float

@router.post("/predict")
async def predict_iot(data: IoTRequest):
    # TODO: ربط مع iot_model.pkl
    return {
        "status": "healthy",
        "plant_condition": "النبات في حالة جيدة",
        "risks": [],
        "recommendation": "الظروف البيئية مناسبة للنمو"
    }