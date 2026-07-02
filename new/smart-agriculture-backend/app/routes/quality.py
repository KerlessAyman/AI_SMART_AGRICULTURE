from fastapi import APIRouter, UploadFile, File, HTTPException
import numpy as np
from PIL import Image
import io
import os
import time
import onnxruntime as ort
from app.routes.models import record_request

router = APIRouter()
CLASS_NAMES = ["A", "C"]
GRADE_DETAILS = {
   "A": {
       "ar": "المحصول طازج وممتاز، مناسب للتصدير والبيع المباشر.",
       "color": "green",
       "label": "طازج ✅"
   },
   "C": {
       "ar": "المحصول غير طازج، غير مناسب للتصدير.",
       "color": "red",
       "label": "غير طازج ❌"
   }
}
session = None
try:
   model_path = os.path.abspath(
       os.path.join(os.path.dirname(__file__), "..", "..", "models", "quality_model_v2.onnx")
   )
   session = ort.InferenceSession(model_path)
   print("✅ Quality ONNX model loaded!")
except Exception as e:
   print(f"❌ Failed to load quality model: {e}")
@router.post("/predict")
async def predict_quality(image: UploadFile = File(...)):
   if session is None:
       record_request("quality", 0, success=False)
       raise HTTPException(status_code=503, detail="الموديل غير متاح حالياً")
   t_start = time.monotonic()
   try:
       contents = await image.read()
       img = Image.open(io.BytesIO(contents)).convert("RGB")
       img = img.resize((224, 224))
       img_array = np.array(img, dtype=np.float32)
       img_array = np.expand_dims(img_array, axis=0)
       img_array[..., 0] -= 103.939
       img_array[..., 1] -= 116.779
       img_array[..., 2] -= 123.68
       input_name = session.get_inputs()[0].name
       preds = session.run(None, {input_name: img_array})[0]
       print("Top predictions:", preds[0])
       class_idx = int(np.argmax(preds[0]))
       confidence = float(np.max(preds[0]))
       grade = CLASS_NAMES[class_idx]
       details = GRADE_DETAILS[grade]
       latency_ms = (time.monotonic() - t_start) * 1000
       record_request("quality", latency_ms, success=True)
       return {
           "grade": grade,
           "label": details["label"],
           "confidence": round(confidence * 100, 2),
           "details": details["ar"],
           "is_fresh": grade == "A",
       }
   except Exception as e:
       latency_ms = (time.monotonic() - t_start) * 1000
       record_request("quality", latency_ms, success=False)
       raise HTTPException(status_code=500, detail=f"خطأ في معالجة الصورة: {str(e)}")