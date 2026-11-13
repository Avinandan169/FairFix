"""
FastAPI Routes for Laptop Price Prediction and Option Lookups.
"""

from fastapi import APIRouter, HTTPException, Depends
from backend.schemas.laptop import LaptopPredictionRequest, ValuationResponse
from backend.services.prediction_service import get_prediction_service, PredictionService

router = APIRouter(prefix="", tags=["Valuation & Prediction"])


@router.post("/predict", response_model=ValuationResponse, summary="Estimate laptop market valuation")
async def predict_laptop_price(
    request: LaptopPredictionRequest,
    service: PredictionService = Depends(get_prediction_service)
):
    """
    Evaluates hardware specifications and optional condition parameters
    to calculate a fair market price estimate in INR.
    """
    try:
        result = service.evaluate_laptop(request)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error evaluating laptop specifications: {str(e)}"
        )


@router.get("/options", summary="Get dropdown option lists")
async def get_options(service: PredictionService = Depends(get_prediction_service)):
    """Returns valid choices for brand, cpu, gpu, and condition categories."""
    return service.get_available_options()
