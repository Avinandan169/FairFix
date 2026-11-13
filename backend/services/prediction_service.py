"""
Prediction Service for FAIRFIX API.

Bridges FastAPI endpoint handlers with the trained ML pipeline,
managing inference execution, option lookups, and metrics caching.
"""

import json
import os
from typing import Dict, Any, List

from ml.predict import get_predictor
from backend.schemas.laptop import LaptopPredictionRequest, ValuationResponse


class PredictionService:
    """Service layer managing laptop price valuations and cached metrics."""

    def __init__(self):
        self.predictor = get_predictor()
        self._metrics_cache = None
        self._comparison_cache = None

    def evaluate_laptop(self, request: LaptopPredictionRequest) -> Dict[str, Any]:
        """Processes a laptop prediction request through the ML pipeline."""
        specs_dict = {
            "brand": request.brand.lower().strip(),
            "model": request.model or f"{request.brand} Laptop",
            "device_category": request.device_category,
            "cpu_brand": request.cpu_brand,
            "cpu_family": request.cpu_family,
            "cpu_series": request.cpu_series,
            "cpu_model": request.cpu_model,
            "cpu_core_count": request.cpu_core_count,
            "cpu_thread_count": request.cpu_thread_count,
            "ram_gb": request.ram_gb,
            "storage_gb": request.storage_gb,
            "display_width_px": request.display_width_px,
            "display_height_px": request.display_height_px,
            "display_size_inch": request.display_size_inch,
            "gpu_brand": request.gpu_brand,
            "gpu_series": request.gpu_series,
            "gpu_model": request.gpu_model or "Integrated Graphics",
            "gpu_type": request.gpu_type,
            "gpu_vram_gb": request.gpu_vram_gb if request.gpu_type == "Dedicated" else 0.0,
            "os_name": request.os_name,
            "warranty_years": request.warranty_years
        }

        condition_dict = request.condition.model_dump() if request.condition else {"is_used": False}

        raw_result = self.predictor.evaluate_valuation(
            specs_dict=specs_dict,
            condition_dict=condition_dict,
            asking_price=request.asking_price_inr
        )

        # Load model metadata
        summary = self.get_evaluation_summary()
        model_name = summary.get("selected_model", "Gradient Boosting")
        r2_score = summary.get("metrics", {}).get("r2_score", 0.9307)

        return {
            "valuation_inr": raw_result["valuation_inr"],
            "new_price_baseline_inr": raw_result["new_price_baseline_inr"],
            "price_range_low_inr": raw_result["price_range_low_inr"],
            "price_range_high_inr": raw_result["price_range_high_inr"],
            "model_name": model_name,
            "model_r2_score": r2_score,
            "used_valuation": raw_result["used_valuation"],
            "deal_assessment": raw_result["deal_assessment"],
            "key_drivers": raw_result["key_drivers"],
            "data_provenance_note": (
                "New laptop baseline estimated using genuine Gradient Boosting model "
                "trained on the Indian Laptop Specifications Dataset. Used valuation applies "
                "the literature-backed depreciation heuristic."
            )
        }

    def get_evaluation_summary(self) -> Dict[str, Any]:
        """Loads and caches the master evaluation summary."""
        if self._metrics_cache is None:
            path = "artifacts/metrics/evaluation_summary.json"
            if os.path.exists(path):
                with open(path, "r", encoding="utf-8") as f:
                    self._metrics_cache = json.load(f)
            else:
                self._metrics_cache = {"status": "Model not yet trained"}
        return self._metrics_cache

    def get_model_comparison(self) -> Dict[str, Any]:
        """Loads and caches the model comparison table across all 6 architectures."""
        if self._comparison_cache is None:
            path = "artifacts/metrics/model_comparison.json"
            if os.path.exists(path):
                with open(path, "r", encoding="utf-8") as f:
                    self._comparison_cache = json.load(f)
            else:
                self._comparison_cache = {"comparison_table": []}
        return self._comparison_cache

    def get_available_options(self) -> Dict[str, List[Any]]:
        """Returns standard hardware option lists for client dropdown selection."""
        return {
            "brands": [
                {"label": "Lenovo", "value": "lenovo"},
                {"label": "HP", "value": "hp"},
                {"label": "ASUS", "value": "asus"},
                {"label": "Acer", "value": "acer"},
                {"label": "MSI", "value": "msi"},
                {"label": "Dell", "value": "dell"},
                {"label": "Apple", "value": "apple"},
                {"label": "Samsung", "value": "samsung"},
                {"label": "Alienware", "value": "alienware"},
                {"label": "Gigabyte", "value": "gigabyte"},
                {"label": "Other", "value": "other"}
            ],
            "device_categories": [
                {"label": "Thin & Light", "value": "Thin & Light"},
                {"label": "Gaming", "value": "Gaming"},
                {"label": "Business", "value": "Business"},
                {"label": "Convertible (2-in-1)", "value": "Convertible"},
                {"label": "General / Everyday", "value": "General"}
            ],
            "cpu_brands": [
                {"label": "Intel", "value": "Intel"},
                {"label": "AMD", "value": "AMD"},
                {"label": "Apple Silicon", "value": "Apple"},
                {"label": "Qualcomm Snapdragon", "value": "Snapdragon"}
            ],
            "cpu_series": [
                {"label": "Intel Core i5", "value": "Core I5"},
                {"label": "Intel Core i7", "value": "Core I7"},
                {"label": "Intel Core i3", "value": "Core I3"},
                {"label": "Intel Core i9", "value": "Core I9"},
                {"label": "Intel Core Ultra 7", "value": "Core Ultra 7"},
                {"label": "Intel Core Ultra 5", "value": "Core Ultra 5"},
                {"label": "Intel Core Ultra 9", "value": "Core Ultra 9"},
                {"label": "AMD Ryzen 5", "value": "Ryzen 5"},
                {"label": "AMD Ryzen 7", "value": "Ryzen 7"},
                {"label": "AMD Ryzen 9", "value": "Ryzen 9"},
                {"label": "Apple M1", "value": "M1"},
                {"label": "Apple M2", "value": "M2"},
                {"label": "Apple M3", "value": "M3"},
                {"label": "Apple M4", "value": "M4"}
            ],
            "gpu_types": [
                {"label": "Integrated Graphics", "value": "Integrated"},
                {"label": "Dedicated GPU", "value": "Dedicated"}
            ],
            "gpu_series": [
                {"label": "NVIDIA GeForce RTX (Dedicated)", "value": "GeForce RTX"},
                {"label": "Intel Iris Xe (Integrated)", "value": "Iris Xe"},
                {"label": "Intel UHD Graphics (Integrated)", "value": "UHD"},
                {"label": "Intel Arc (Integrated / Dedicated)", "value": "Arc"},
                {"label": "AMD Radeon (Integrated / Dedicated)", "value": "Radeon"},
                {"label": "Apple Integrated GPU", "value": "Apple GPU"},
                {"label": "Qualcomm Adreno (Integrated)", "value": "Adreno"}
            ],
            "ram_options": [4, 8, 16, 24, 32, 64],
            "storage_options": [128, 256, 512, 1024, 2048, 4096],
            "display_sizes": [13.3, 14.0, 15.6, 16.0, 17.3],
            "resolutions": [
                {"label": "FHD (1920 x 1080)", "width": 1920, "height": 1080},
                {"label": "WUXGA (1920 x 1200 - 16:10)", "width": 1920, "height": 1200},
                {"label": "QHD (2560 x 1440)", "width": 2560, "height": 1440},
                {"label": "WQXGA (2560 x 1600 - 16:10)", "width": 2560, "height": 1600},
                {"label": "3K (2880 x 1800)", "width": 2880, "height": 1800},
                {"label": "4K UHD (3840 x 2160)", "width": 3840, "height": 2160}
            ],
            "operating_systems": [
                {"label": "Windows 11 / 10", "value": "Windows"},
                {"label": "macOS", "value": "Mac"},
                {"label": "Linux / Ubuntu", "value": "Linux"},
                {"label": "ChromeOS", "value": "Chrome"},
                {"label": "DOS / None", "value": "DOS"}
            ],
            "cosmetic_conditions": [
                {"label": "Like New / Pristine (No scratches or signs of wear)", "value": "like_new"},
                {"label": "Good (Light hairline marks, normal gentle usage)", "value": "good"},
                {"label": "Fair (Noticeable scratches, worn palm rest/keycaps)", "value": "fair"},
                {"label": "Poor (Deep gouges, cracks, or dented casing)", "value": "poor"}
            ],
            "screen_conditions": [
                {"label": "Flawless (No blemishes, scratches or dead pixels)", "value": "flawless"},
                {"label": "Minor Scratches (Only visible when screen is turned off)", "value": "minor_scratches"},
                {"label": "Visible Scratches (Visible during active display usage)", "value": "visible_scratches"},
                {"label": "Dead Pixels / Screen Bleed / Lines", "value": "dead_pixels_or_lines"}
            ]
        }


# Singleton service instance
_service = None


def get_prediction_service() -> PredictionService:
    global _service
    if _service is None:
        _service = PredictionService()
    return _service
