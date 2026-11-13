"""
Pydantic Schemas for Repair Intelligence, Diagnosis, Pricing, and Decision Support.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class DiagnosisRequest(BaseModel):
    symptom_description: str = Field(..., min_length=1, description="Natural language description of laptop issue")
    brand: Optional[str] = Field(None, description="Optional laptop manufacturer name")
    model: Optional[str] = Field(None, description="Optional model name")


class AlternativeFault(BaseModel):
    fault_type: str
    confidence_score: float
    confidence_percentage: float


class DiagnosisResponse(BaseModel):
    status: str
    is_confident: bool
    primary_fault: Optional[str]
    confidence_score: float
    confidence_percentage: float
    alternatives: List[AlternativeFault]
    influential_keywords: List[str]
    suggested_checks: List[str]
    input_symptom: str
    disclaimer: str


class RepairCostRange(BaseModel):
    min: int
    max: int


class RepairPricingEstimateRequest(BaseModel):
    component: str = Field(..., description="Faulty hardware component (e.g. Integrated screen, Power/battery)")
    repair_type: Optional[str] = Field(None, description="Replacement, Chip-level Repair, Servicing, Upgrade")
    brand: Optional[str] = Field(None, description="Laptop brand filter")
    record_id: Optional[str] = Field(None, description="Specific catalogue record ID")


class RepairPricingEstimateResponse(BaseModel):
    found: bool
    component: Optional[str] = None
    currency: Optional[str] = "INR"
    is_heuristic: Optional[bool] = True
    catalogue_classification: Optional[str] = None
    part_cost_range: Optional[RepairCostRange] = None
    labour_cost_range: Optional[RepairCostRange] = None
    total_estimated_range: Optional[RepairCostRange] = None
    representative_matches: Optional[List[Dict[str, Any]]] = None
    primary_source: Optional[str] = None
    market_location: Optional[str] = None
    disclaimer: Optional[str] = None
    message: Optional[str] = None


class QuoteEvaluationRequest(BaseModel):
    quoted_price: float = Field(..., gt=0, description="Technician quote in INR")
    component: str = Field(..., description="Component being repaired")
    repair_type: Optional[str] = Field(None, description="Type of repair")
    brand: Optional[str] = Field(None, description="Laptop brand")
    record_id: Optional[str] = Field(None, description="Catalogue record ID")


class QuoteEvaluationResponse(BaseModel):
    success: bool
    quoted_price: Optional[int] = None
    verdict: Optional[str] = None
    verdict_label: Optional[str] = None
    badge_color: Optional[str] = None
    benchmark_range: Optional[Dict[str, int]] = None
    variance: Optional[Dict[str, Any]] = None
    parts_benchmark: Optional[Dict[str, int]] = None
    labour_benchmark: Optional[Dict[str, int]] = None
    market_location: Optional[str] = None
    primary_source: Optional[str] = None
    explanation: Optional[str] = None
    suggested_questions: Optional[List[str]] = None
    is_heuristic: Optional[bool] = True
    disclaimer: Optional[str] = None
    message: Optional[str] = None


class RepairDecisionRequest(BaseModel):
    repair_cost: float = Field(..., gt=0, description="Estimated or technician-quoted repair cost in INR")
    device_market_value: Optional[float] = Field(None, gt=0, description="Laptop current market value in INR")
    laptop_specs: Optional[Dict[str, Any]] = Field(None, description="Specifications to predict market value on-the-fly")
    device_age_years: Optional[float] = Field(None, ge=0, le=15, description="Device age in years")
    device_condition: Optional[str] = Field("Good", description="Physical condition of laptop")
    component: Optional[str] = Field(None, description="Faulty component")


class RepairDecisionResponse(BaseModel):
    success: bool
    verdict: Optional[str] = None
    verdict_label: Optional[str] = None
    badge_color: Optional[str] = None
    repair_cost_ratio: Optional[float] = None
    repair_cost_ratio_pct: Optional[float] = None
    threshold_basis: Optional[str] = None
    is_heuristic: Optional[bool] = True
    economic_summary: Optional[str] = None
    decision_factors: Optional[List[str]] = None
    financial_breakdown: Optional[Dict[str, Any]] = None
    valuation_source: Optional[str] = None
    disclaimer: Optional[str] = None
    error: Optional[str] = None
