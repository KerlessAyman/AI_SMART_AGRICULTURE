from fastapi import APIRouter, UploadFile, File, HTTPException
import numpy as np
from PIL import Image
import io
import os
import time
import onnxruntime as ort
from app.routes.models import record_request

router = APIRouter()
CLASS_NAMES = [
   "Apple___Apple_scab",
   "Apple___Black_rot",
   "Apple___Cedar_apple_rust",
   "Apple___healthy",
   "Blueberry___healthy",
   "Cherry_(including_sour)___Powdery_mildew",
   "Cherry_(including_sour)___healthy",
   "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
   "Corn_(maize)___Common_rust_",
   "Corn_(maize)___Northern_Leaf_Blight",
   "Corn_(maize)___healthy",
   "Grape___Black_rot",
   "Grape___Esca_(Black_Measles)",
   "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
   "Grape___healthy",
   "Orange___Haunglongbing_(Citrus_greening)",
   "Peach___Bacterial_spot",
   "Peach___healthy",
   "Pepper,_bell___Bacterial_spot",
   "Pepper,_bell___healthy",
   "Potato___Early_blight",
   "Potato___Late_blight",
   "Potato___healthy",
   "Raspberry___healthy",
   "Soybean___healthy",
   "Squash___Powdery_mildew",
   "Strawberry___Leaf_scorch",
   "Strawberry___healthy",
   "Tomato___Bacterial_spot",
   "Tomato___Early_blight",
   "Tomato___Late_blight",
   "Tomato___Leaf_Mold",
   "Tomato___Septoria_leaf_spot",
   "Tomato___Spider_mites Two-spotted_spider_mite",
   "Tomato___Target_Spot",
   "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
   "Tomato___Tomato_mosaic_virus",
   "Tomato___healthy",
]
RECOMMENDATIONS = {
   "healthy": "النبات بصحة جيدة، استمر في العناية المعتادة.",
   "Apple_scab": "استخدم مبيدات فطرية تحتوي على الكبريت أو النحاس.",
   "Black_rot": "أزل الأجزاء المصابة وعالج بمبيد فطري نحاسي.",
   "Cedar_apple_rust": "رش مبيد فطري وقائي في موسم الربيع.",
   "Powdery_mildew": "رش بمحلول بيكربونات الصوديوم أو مبيد فطري.",
   "Cercospora": "استخدم مبيد فطري وتجنب الري فوق الأوراق.",
   "Common_rust": "رش مبيد فطري وتأكد من التهوية الجيدة.",
   "Northern_Leaf_Blight": "استخدم أصناف مقاومة ورش مبيد فطري.",
   "Esca": "أزل الأجزاء المصابة وعالج الجروح بمعجون نحاسي.",
   "Leaf_blight": "رش مبيد فطري نحاسي وأزل الأوراق المصابة.",
   "Haunglongbing": "لا يوجد علاج، أزل النبات المصاب لمنع الانتشار.",
   "Bacterial_spot": "رش مبيد بكتيري نحاسي وتجنب الري فوق الأوراق.",
   "Early_blight": "رش مبيد فطري وأزل الأوراق السفلية المصابة.",
   "Late_blight": "رش مبيد فطري فوري واحرص على التهوية.",
   "Leaf_Mold": "حسّن التهوية وقلل الرطوبة، رش مبيد فطري.",
   "Septoria": "أزل الأوراق المصابة ورش مبيد فطري.",
   "Spider_mites": "رش مبيد حشري مخصص للعناكب أو زيت النيم.",
   "Target_Spot": "رش مبيد فطري وأزل الأوراق المصابة.",
   "Yellow_Leaf_Curl_Virus": "اقضِ على الذباب الأبيض الناقل واستخدم أصناف مقاومة.",
   "mosaic_virus": "لا يوجد علاج، أزل النبات المصاب وعقّم الأدوات.",
   "Leaf_scorch": "قلل الإجهاد المائي وتجنب التسميد الزائد.",
}
def get_recommendation(class_name: str) -> str:
   if "healthy" in class_name.lower():
       return RECOMMENDATIONS["healthy"]
   for key, rec in RECOMMENDATIONS.items():
       if key.lower() in class_name.lower():
           return rec
   return "راجع متخصص زراعي للتشخيص الدقيق."
session = None
try:
   model_path = os.path.abspath(
       os.path.join(os.path.dirname(__file__), "..", "..", "models", "disease_model_v2.onnx")
   )
   session = ort.InferenceSession(model_path)
   print("✅ Disease ONNX model loaded!")
except Exception as e:
   print(f"❌ Failed to load disease model: {e}")
@router.post("/predict")
async def predict_disease(image: UploadFile = File(...)):
   if session is None:
       record_request("disease", 0, success=False)
       raise HTTPException(status_code=503, detail="الموديل مش موجود")
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
       print("Top 5 predictions:", np.argsort(preds[0])[-5:][::-1])
       print("Top 5 values:", np.sort(preds[0])[-5:][::-1])
       print("class_idx:", int(np.argmax(preds[0])))
       class_idx = int(np.argmax(preds[0]))
       confidence = float(np.max(preds[0]))
       class_name = CLASS_NAMES[class_idx]
       plant, disease = class_name.split("___") if "___" in class_name else (class_name, "unknown")
       latency_ms = (time.monotonic() - t_start) * 1000
       record_request("disease", latency_ms, success=True)
       return {
           "disease": class_name,
           "plant": plant.replace("_", " "),
           "disease_name": disease.replace("_", " "),
           "confidence": round(confidence * 100, 2),
           "recommendation": get_recommendation(class_name),
           "is_healthy": "healthy" in class_name.lower(),
       }
   except Exception as e:
       latency_ms = (time.monotonic() - t_start) * 1000
       record_request("disease", latency_ms, success=False)
       raise HTTPException(status_code=500, detail=f"خطأ في معالجة الصورة: {str(e)}")
