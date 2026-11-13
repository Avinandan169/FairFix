"""
Pydantic Schemas for FAIRFIX API.

Defines strict type validation, field constraints, and descriptive defaults
for laptop hardware attributes, condition parameters, and valuation results.
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class ConditionInput(BaseModel):
    """Parameters defining physical and operational condition of a second-hand laptop."""
    is_used: bool = Field(default=False, description="Whether the device is used / out-of-warranty")
    age_months: int = Field(default=0, ge=0, le=120, description="Device age in elapsed months")
    battery_health_percentage: float = Field(default=100.0, ge=10.0, le=100.0, description="Reported battery capacity %")
    cosmetic_condition: str = Field(default="Good", description="Chassis cosmetic grade: like_new, good, fair, poor")
    screen_condition: str = Field(default="Flawless", description="Display panel condition: flawless, minor_scratches, visible_scratches, dead_pixels_or_lines")
    has_active_warranty: bool = Field(default=False, description="Whether manufacturer or extended warranty is active")


class LaptopPredictionRequest(BaseModel):
    """Specification payload for price valuation."""
    brand: str = Field(default="lenovo", description="Manufacturer brand name (e.g. lenovo, asus, hp, dell, apple)")
    model: Optional[str] = Field(default="Lenovo IdeaPad Slim 3", description="Laptop product model name")
    device_category: str = Field(default="Thin & Light", description="Product category: Gaming, Thin & Light, Business, General, Convertible")
    
    cpu_brand: str = Field(default="Intel", description="CPU manufacturer: Intel, AMD, Apple, Snapdragon")
    cpu_family: str = Field(default="Core", description="CPU family (e.g. Core, Core Ultra, Ryzen, M-series)")
    cpu_series: str = Field(default="Core I5", description="CPU series (e.g. Core I5, Core I7, Core Ultra 7, Ryzen 7)")
    cpu_model: str = Field(default="13420H", description="Exact CPU model number (e.g. 13420H, 255HX, 7735HS, M3)")
    cpu_core_count: int = Field(default=8, ge=2, le=32, description="Total physical CPU cores")
    cpu_thread_count: int = Field(default=12, ge=2, le=64, description="Total logical CPU threads")
    
    ram_gb: int = Field(default=16, ge=4, le=128, description="System RAM in Gigabytes")
    storage_gb: int = Field(default=512, ge=64, le=8192, description="Internal storage in Gigabytes")
    
    display_size_inch: float = Field(default=15.6, ge=10.0, le=20.0, description="Display diagonal size in inches")
    display_width_px: int = Field(default=1920, ge=1280, le=5120, description="Display horizontal resolution in pixels")
    display_height_px: int = Field(default=1080, ge=720, le=3840, description="Display vertical resolution in pixels")
    
    gpu_brand: str = Field(default="Intel", description="GPU manufacturer: NVIDIA, Intel, AMD, Apple")
    gpu_series: str = Field(default="UHD", description="GPU family: GeForce RTX, Iris Xe, Arc, UHD, Radeon, Apple GPU")
    gpu_model: Optional[str] = Field(default="UHD Graphics", description="GPU model descriptor")
    gpu_type: str = Field(default="Integrated", description="GPU architecture: Integrated or Dedicated")
    gpu_vram_gb: float = Field(default=0.0, ge=0.0, le=24.0, description="Dedicated GPU video memory in GB")
    
    os_name: str = Field(default="Windows", description="Operating System: Windows, Mac, Linux, Chrome, Ubuntu, DOS")
    warranty_years: int = Field(default=1, ge=0, le=5, description="Initial warranty coverage in years")
    
    asking_price_inr: Optional[float] = Field(default=None, ge=1000.0, description="Seller's asking price in INR for deal assessment")
    condition: Optional[ConditionInput] = Field(default_factory=ConditionInput, description="Optional used-device parameters")


class FeatureDriver(BaseModel):
    """Individual specification impact on prediction."""
    feature: str
    shap_value: float
    direction: str


class DealAssessment(BaseModel):
    """Comparative analysis against seller asking price."""
    asking_price_inr: float
    difference_inr: float
    difference_percentage: float
    verdict: str
    verdict_label: str
    badge_color: str


class UsedValuationInfo(BaseModel):
    """Depreciation breakdown for used hardware."""
    is_used: bool
    depreciation_percentage: float
    adjusted_valuation_inr: float
    breakdown: Dict[str, float]
    disclaimer: str


class ValuationResponse(BaseModel):
    """Complete valuation result payload returned by the FairFix API."""
    valuation_inr: float
    new_price_baseline_inr: float
    price_range_low_inr: float
    price_range_high_inr: float
    model_name: str
    model_r2_score: float
    used_valuation: Optional[UsedValuationInfo] = None
    deal_assessment: Optional[DealAssessment] = None
    key_drivers: List[FeatureDriver]
    data_provenance_note: str
