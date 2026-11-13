"""
FastAPI Router for FairFix Repair Intelligence, Fault Diagnosis, and Decision Support.
"""

import os
import json
from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from backend.schemas.diagnosis import (
    DiagnosisRequest,
    DiagnosisResponse,
    RepairPricingEstimateRequest,
    RepairPricingEstimateResponse,
    QuoteEvaluationRequest,
    QuoteEvaluationResponse,
    RepairDecisionRequest,
    RepairDecisionResponse
)
from ml.diagnosis.predict import get_diagnosis_engine
from backend.services.repair_pricing_service import get_repair_pricing_service
from backend.services.quote_evaluation_service import get_quote_evaluation_service
from backend.services.repair_decision_service import get_repair_decision_service

router = APIRouter(prefix="/repair", tags=["Repair Intelligence"])
diagnosis_router = APIRouter(prefix="/diagnosis", tags=["Repair Diagnosis"])

DIAGNOSIS_METRICS_PATH = "artifacts/metrics/diagnosis_metrics.json"


@diagnosis_router.post("/predict", response_model=DiagnosisResponse)
def diagnose_laptop_symptoms(request: DiagnosisRequest):
    """Diagnoses laptop hardware/software fault from natural language symptom text."""
    try:
        engine = get_diagnosis_engine()
        result = engine.diagnose(request.symptom_description, brand=request.brand)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Diagnostic inference error: {str(e)}")


@diagnosis_router.get("/metrics")
def get_diagnosis_model_metrics():
    """Retrieves diagnostic classifier test metrics, confusion matrix, and model comparisons."""
    if not os.path.exists(DIAGNOSIS_METRICS_PATH):
        raise HTTPException(status_code=404, detail="Diagnosis metrics artifact not found.")
    try:
        with open(DIAGNOSIS_METRICS_PATH, "r") as f:
            return json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read diagnosis metrics: {str(e)}")


@router.get("/pricing/options")
def get_pricing_catalogue_options():
    """Returns available components, brands, and repair types from benchmark catalogue."""
    service = get_repair_pricing_service()
    return service.get_options()


@router.get("/pricing")
def get_repair_pricing_catalogue(component: Optional[str] = Query(None)):
    """Returns repair price benchmark records for Indian markets."""
    service = get_repair_pricing_service()
    if component:
        return service.get_records_by_component(component)
    return service.get_all_records()


@router.post("/estimate", response_model=RepairPricingEstimateResponse)
def estimate_repair_cost(request: RepairPricingEstimateRequest):
    """Calculates benchmark cost range (parts + labour) for a component repair."""
    service = get_repair_pricing_service()
    estimate = service.estimate_cost(
        component=request.component,
        repair_type=request.repair_type,
        brand=request.brand,
        record_id=request.record_id
    )
    return estimate


@router.post("/evaluate-quote", response_model=QuoteEvaluationResponse)
def evaluate_technician_quote(request: QuoteEvaluationRequest):
    """Evaluates a technician quote against independent Indian market benchmarks."""
    service = get_quote_evaluation_service()
    result = service.evaluate_quote(
        quoted_price=request.quoted_price,
        component=request.component,
        repair_type=request.repair_type,
        brand=request.brand,
        record_id=request.record_id
    )
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("message", "Evaluation failed."))
    return result


@router.post("/decision", response_model=RepairDecisionResponse)
def evaluate_repair_versus_replace(request: RepairDecisionRequest):
    """Calculates Repair Cost Ratio and returns economically justified Repair vs Replace recommendation."""
    service = get_repair_decision_service()
    result = service.analyze_decision(
        repair_cost=request.repair_cost,
        device_market_value=request.device_market_value,
        laptop_specs=request.laptop_specs,
        device_age_years=request.device_age_years,
        device_condition=request.device_condition,
        component=request.component
    )
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error", "Decision analysis failed."))
    return result
