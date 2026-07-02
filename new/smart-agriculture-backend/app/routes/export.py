from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
import pickle
import pandas as pd
import os
import time

from app.routes.models import record_request

router = APIRouter()
models_dir = os.path.abspath(
   os.path.join(os.path.dirname(__file__), "..", "..", "models", "export_models")
)
try:
   with open(os.path.join(models_dir, "eu_eligible_model.pkl"), "rb") as f:
       eu_model = pickle.load(f)
   with open(os.path.join(models_dir, "gulf_eligible_model.pkl"), "rb") as f:
       gulf_model = pickle.load(f)
   with open(os.path.join(models_dir, "local_eligible_model.pkl"), "rb") as f:
       local_model = pickle.load(f)
   with open(os.path.join(models_dir, "label_encoders.pkl"), "rb") as f:
       le_dict = pickle.load(f)
   with open(os.path.join(models_dir, "feature_cols.pkl"), "rb") as f:
       feature_cols = pickle.load(f)
   print("✅ Export models loaded!")
except Exception as e:
   eu_model = gulf_model = local_model = le_dict = feature_cols = None
   print(f"❌ Failed to load export models: {e}")

# Used ONLY as a fallback to pre-fill values the user didn't provide.
# These are no longer used to silently override what the user actually sent.
GRADE_FALLBACK = {
    "A": {"moisture": 12, "defect_rate": 3, "pesticide_level": 1.5, "sugar_content": 14,
          "size_uniformity": 90, "color_score": 9, "shelf_life_days": 21,
          "temperature_storage": 6, "ph_level": 6.5,
          "packaging_type": "carton", "certification": "GlobalGAP", "season": "spring"},
    "B": {"moisture": 16, "defect_rate": 10, "pesticide_level": 3, "sugar_content": 11,
          "size_uniformity": 75, "color_score": 7, "shelf_life_days": 14,
          "temperature_storage": 10, "ph_level": 6.2,
          "packaging_type": "plastic_crate", "certification": "none", "season": "summer"},
    "C": {"moisture": 20, "defect_rate": 20, "pesticide_level": 8, "sugar_content": 9,
          "size_uniformity": 52, "color_score": 3, "shelf_life_days": 5,
          "temperature_storage": 15, "ph_level": 5.5,
          "packaging_type": "bulk", "certification": "none", "season": "summer"},
}


class ExportRequest(BaseModel):
    crop_type: str
    grade: str
    weight_kg: float
    region: str

    # Real quality features. Optional so older frontend calls don't break,
    # but if they are not sent we fall back to a grade-based estimate
    # (clearly weaker — the UI should always send these now).
    moisture: Optional[float] = Field(None, ge=0, le=100)
    defect_rate: Optional[float] = Field(None, ge=0, le=100)
    pesticide_level: Optional[float] = Field(None, ge=0)
    sugar_content: Optional[float] = Field(None, ge=0)
    size_uniformity: Optional[float] = Field(None, ge=0, le=100)
    color_score: Optional[float] = Field(None, ge=0, le=10)
    shelf_life_days: Optional[float] = Field(None, ge=0)
    temperature_storage: Optional[float] = None
    ph_level: Optional[float] = Field(None, ge=0, le=14)
    packaging_type: Optional[str] = None
    certification: Optional[str] = None
    season: Optional[str] = None


def encode_feature(col, value):
    try:
        return int(le_dict[col].transform([value])[0])
    except ValueError:
        print(f"⚠️ Unknown value '{value}' for '{col}', using 0")
        return 0


@router.post("/predict")
async def predict_export(data: ExportRequest):
    if eu_model is None:
        record_request("export", 0, success=False)
        raise HTTPException(status_code=503, detail="الموديلز غير متاحة حالياً")
    start = time.time()
    try:
        fallback = GRADE_FALLBACK.get(data.grade, GRADE_FALLBACK["B"])

        def pick(field_name):
            value = getattr(data, field_name)
            return value if value is not None else fallback[field_name]

        row = {
            "crop_type_enc": encode_feature("crop_type", data.crop_type),
            "grade_enc": encode_feature("grade", data.grade),
            "weight_kg": data.weight_kg,
            "region_enc": encode_feature("region", data.region),
            "moisture": pick("moisture"),
            "defect_rate": pick("defect_rate"),
            "pesticide_level": pick("pesticide_level"),
            "sugar_content": pick("sugar_content"),
            "size_uniformity": pick("size_uniformity"),
            "color_score": pick("color_score"),
            "shelf_life_days": pick("shelf_life_days"),
            "season_enc": encode_feature("season", pick("season")),
            "packaging_type_enc": encode_feature("packaging_type", pick("packaging_type")),
            "certification_enc": encode_feature("certification", pick("certification")),
            "temperature_storage": pick("temperature_storage"),
            "ph_level": pick("ph_level"),
        }

        X = pd.DataFrame([{col: row[col] for col in feature_cols}], columns=feature_cols)

        eu_pred = int(eu_model.predict(X)[0])
        gulf_pred = int(gulf_model.predict(X)[0])
        local_pred = int(local_model.predict(X)[0])
        eu_prob = float(eu_model.predict_proba(X)[0][1]) * 100
        gulf_prob = float(gulf_model.predict_proba(X)[0][1]) * 100
        local_prob = float(local_model.predict_proba(X)[0][1]) * 100

        # NOTE: the previous version forced eu_pred/gulf_pred/local_pred based
        # purely on `grade` here, which threw away the model's actual output
        # and made every other input meaningless. That override has been
        # removed - the model's prediction (based on the real quality
        # features above) is now what actually drives the result.

        print(f"EU: {eu_pred} ({eu_prob:.1f}%) | Gulf: {gulf_pred} ({gulf_prob:.1f}%) | Local: {local_pred} ({local_prob:.1f}%)")
        latency_ms = (time.time() - start) * 1000
        record_request("export", latency_ms, success=True)
        return {
            "eu": {"eligible": bool(eu_pred), "confidence": round(eu_prob, 1),
                   "reason": "المحصول مطابق لمعايير الاتحاد الأوروبي" if eu_pred else "المحصول لا يستوفي معايير الاتحاد الأوروبي"},
            "gulf": {"eligible": bool(gulf_pred), "confidence": round(gulf_prob, 1),
                     "reason": "المحصول مطابق لمعايير الخليج" if gulf_pred else "المحصول لا يستوفي معايير الخليج"},
            "local": {"eligible": bool(local_pred), "confidence": round(local_prob, 1),
                      "reason": "المحصول مناسب للسوق المحلي" if local_pred else "المحصول غير مناسب للسوق المحلي"},
        }
    except Exception as e:
        latency_ms = (time.time() - start) * 1000
        record_request("export", latency_ms, success=False)
        raise HTTPException(status_code=500, detail=f"خطأ في التحليل: {str(e)}")