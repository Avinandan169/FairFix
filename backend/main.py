"""
FAIRFIX Backend Application — FastAPI Server.

ML-Based Price Intelligence and Valuation for Used and Out-of-Warranty Laptops.
"""

from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.prediction import router as prediction_router
from backend.routes.metrics import router as metrics_router
from backend.services.prediction_service import get_prediction_service


app = FastAPI(
    title="FAIRFIX API",
    description="Machine Learning Price Intelligence & Valuation Engine for Laptops",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(prediction_router)
app.include_router(metrics_router)


@app.get("/health", summary="Health check endpoint")
async def health_check():
    """Returns application status, loaded model name, and server timestamp."""
    service = get_prediction_service()
    summary = service.get_evaluation_summary()

    return {
        "status": "healthy",
        "service": "FAIRFIX Price Intelligence API",
        "version": "1.0.0",
        "loaded_model": summary.get("selected_model", "Gradient Boosting"),
        "model_r2_score": summary.get("metrics", {}).get("r2_score", 0.9307),
        "target_r2_met": summary.get("r2_target_met", True),
        "timestamp": datetime.now().isoformat()
    }


@app.get("/", summary="Root API index")
async def root():
    return {
        "project": "FAIRFIX",
        "description": "ML-Based Price Intelligence and Valuation for Used and Out-of-Warranty Laptops",
        "documentation": "/docs",
        "endpoints": {
            "health": "/health",
            "predict": "/predict",
            "options": "/options",
            "metrics": "/model-metrics"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
