"""
FastAPI Routes for Model Metrics and Evaluation Telemetry.
"""

import json
import os
from fastapi import APIRouter, Depends
from backend.services.prediction_service import get_prediction_service, PredictionService

router = APIRouter(prefix="", tags=["Model Telemetry"])


@router.get("/model-metrics", summary="Get model performance and benchmark metrics")
async def get_model_metrics(service: PredictionService = Depends(get_prediction_service)):
    """
    Returns authentic empirical evaluation metrics saved from training:
    - R2, MAE, RMSE across all 6 candidate algorithms
    - 5-Fold standard and GroupKFold cross-validation results
    - Price tier error distributions
    - Top global feature importances and SHAP values
    - Actual vs Predicted test data points for interactive charts
    """
    summary = service.get_evaluation_summary()
    comparison = service.get_model_comparison()

    # Load feature importances
    feat_imp = []
    if os.path.exists("artifacts/metrics/feature_importances.json"):
        with open("artifacts/metrics/feature_importances.json", "r", encoding="utf-8") as f:
            feat_imp = json.load(f)

    # Load SHAP summary
    shap_summary = {}
    if os.path.exists("artifacts/metrics/shap_summary.json"):
        with open("artifacts/metrics/shap_summary.json", "r", encoding="utf-8") as f:
            shap_summary = json.load(f)

    # Load test prediction scatter data
    test_points = []
    if os.path.exists("artifacts/metrics/test_predictions.json"):
        with open("artifacts/metrics/test_predictions.json", "r", encoding="utf-8") as f:
            test_points = json.load(f)

    # Load dataset report overview
    dataset_overview = {}
    if os.path.exists("artifacts/metrics/dataset_inspection_report.json"):
        with open("artifacts/metrics/dataset_inspection_report.json", "r", encoding="utf-8") as f:
            d_rep = json.load(f)
            dataset_overview = {
                "compatibility_matrix": d_rep.get("compatibility_matrix", {}),
                "inspected_count": len(d_rep.get("inspected_datasets", []))
            }

    return {
        "evaluation_summary": summary,
        "model_comparison": comparison,
        "feature_importances": feat_imp,
        "shap_summary": shap_summary,
        "test_prediction_points": test_points,
        "dataset_overview": dataset_overview
    }
