"""
app/routes/models.py

Real-time AI model metrics endpoint.
Tracks request counts and latency using in-memory counters that are
incremented by the disease and quality prediction routes.
"""

from fastapi import APIRouter
import time

router = APIRouter()

# ── Shared in-memory stats (imported & mutated by disease.py / quality.py) ──
model_stats: dict = {
    "disease": {
        "requests": 0,
        "total_latency_ms": 0.0,
        "errors": 0,
        "last_request_ts": None,
    },
    "quality": {
        "requests": 0,
        "total_latency_ms": 0.0,
        "errors": 0,
        "last_request_ts": None,
    },
    "export": {
        "requests": 0,
        "total_latency_ms": 0.0,
        "errors": 0,
        "last_request_ts": None,
    },
}

# Static model metadata (version, training date, thresholds)
MODEL_META = {
    "disease": {
        "id": "m1",
        "nameAr": "كشف أمراض المحاصيل",
        "nameEn": "Crop Disease Detection",
        "version": "YOLOv9-Agri v3.2",
        "lastTrained": "يونيو 10, 2026",
        "lastTrainedEn": "Jun 10, 2026",
        "accuracy": 97.4,            # validated on test set — fixed
        "degraded_threshold": 90.0,  # alert if accuracy drops below this
    },
    "quality": {
        "id": "m2",
        "nameAr": "تحليل جودة المحصول",
        "nameEn": "Crop Quality Analysis",
        "version": "QualityNet v2.1",
        "lastTrained": "مايو 28, 2026",
        "lastTrainedEn": "May 28, 2026",
        "accuracy": 96.1,
        "degraded_threshold": 90.0,
    },
    "export": {
        "id": "m3",
        "nameAr": "أهلية التصدير",
        "nameEn": "Export Eligibility",
        "version": "ExportEligibility v1.0",
        "lastTrained": "يونيو 30, 2026",
        "lastTrainedEn": "Jun 30, 2026",
        "accuracy": 94.0,
        "degraded_threshold": 90.0,
    },
}


def record_request(model_key: str, latency_ms: float, success: bool = True):
    """Call this from predict endpoints to record a request."""
    s = model_stats.get(model_key)
    if s is None:
        return
    s["requests"] += 1
    s["total_latency_ms"] += latency_ms
    s["last_request_ts"] = time.time()
    if not success:
        s["errors"] += 1


def _build_model_response(key: str) -> dict:
    meta = MODEL_META[key]
    stats = model_stats[key]

    reqs = stats["requests"]
    avg_latency = (
        round(stats["total_latency_ms"] / reqs, 1) if reqs > 0 else 0.0
    )

    # Derive live status from error rate and avg latency
    error_rate = (stats["errors"] / reqs * 100) if reqs > 0 else 0.0
    if error_rate > 20 or (reqs > 0 and avg_latency > 2000):
        status = "degraded"
    else:
        status = "online"

    return {
        "id": meta["id"],
        "nameAr": meta["nameAr"],
        "nameEn": meta["nameEn"],
        "version": meta["version"],
        "lastTrained": meta["lastTrained"],
        "lastTrainedEn": meta["lastTrainedEn"],
        "accuracy": meta["accuracy"],   # validated accuracy (fixed)
        "requests": reqs,               # LIVE — real API call count
        "avgLatency": avg_latency,      # LIVE — real average ms
        "status": status,               # LIVE — derived from error rate
        "errors": stats["errors"],
        "errorRate": round(error_rate, 1),
    }


@router.get("/stats")
def get_model_stats():
    """Return live stats for all real AI models."""
    return {
        "models": [
            _build_model_response("disease"),
            _build_model_response("quality"),
            _build_model_response("export"),
        ]
    }


@router.post("/reset/{model_key}")
def reset_model_stats(model_key: str):
    """Reset counters for a specific model (admin action)."""
    if model_key not in model_stats:
        return {"error": "Unknown model key"}
    model_stats[model_key] = {
        "requests": 0,
        "total_latency_ms": 0.0,
        "errors": 0,
        "last_request_ts": None,
    }
    return {"status": "reset", "model": model_key}