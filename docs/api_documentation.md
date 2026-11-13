# FAIRFIX — RESTful API Documentation

**Application:** FAIRFIX Price Intelligence Engine  
**Framework:** Python 3.11 with FastAPI  
**Default Host & Port:** `http://localhost:8000`  
**Interactive Swagger UI:** `http://localhost:8000/docs`  
**OpenAPI Specification:** `http://localhost:8000/openapi.json`  

---

## 1. Endpoints Summary

| Method | Endpoint | Description | Response Model |
|---|---|---|---|
| `GET` | `/health` | Server operational status, loaded model slug, and $R^2$ | Status JSON |
| `GET` | `/options` | Dropdown dictionaries for brands, CPUs, GPUs, and conditions | Options JSON |
| `GET` | `/model-metrics` | Authentic empirical metrics, comparison table, SHAP values, and scatter points | Telemetry JSON |
| `POST` | `/predict` | Evaluates hardware specifications and optional used condition to compute valuation | `ValuationResponse` |

---

## 2. Endpoint Specifications

### 2.1 Health Check (`GET /health`)
Verifies service health, active model identifier, and verified out-of-sample $R^2$ score.

**Sample Request:**
```bash
curl -X GET http://localhost:8000/health
```

**Sample Response (`200 OK`):**
```json
{
  "status": "healthy",
  "service": "FAIRFIX Price Intelligence API",
  "version": "1.0.0",
  "loaded_model": "Gradient Boosting",
  "model_r2_score": 0.9307,
  "target_r2_met": true,
  "timestamp": "2026-11-13T22:30:00"
}
```

---

### 2.2 Dropdown Options (`GET /options`)
Supplies pre-filtered lists of valid brands, processor families, GPU architectures, and condition grades to populate client-side dropdown menus.

**Sample Request:**
```bash
curl -X GET http://localhost:8000/options
```

---

### 2.3 Model Telemetry & Metrics (`GET /model-metrics`)
Supplies all empirical training artifacts for the interactive Performance Dashboard.

**Response Fields:**
- `evaluation_summary`: Overall test metrics ($R^2$, MAE, RMSE, MAPE), 5-Fold standard CV metrics, and Chassis-Grouped GroupKFold metrics.
- `model_comparison`: Benchmark table comparing all 6 candidate algorithms (Linear Regression, Decision Tree, Random Forest, Gradient Boosting, XGBoost, CatBoost).
- `feature_importances`: Ranked tree impurity importance (MDI) scores.
- `shap_summary`: Mean absolute SHAP values expressing the rupee-impact of hardware features.
- `test_prediction_points`: Actual vs Predicted scatter points from the held-out test split.

---

### 2.4 Laptop Valuation & Prediction (`POST /predict`)
Processes specifications and optional used condition to calculate fair market price, confidence intervals, deal assessment, and local SHAP feature drivers.

**Request Schema (`LaptopPredictionRequest`):**
```json
{
  "brand": "lenovo",
  "model": "Lenovo Legion Pro 5",
  "device_category": "Gaming",
  "cpu_brand": "Intel",
  "cpu_family": "Core Ultra",
  "cpu_series": "Core Ultra 7",
  "cpu_model": "255HX",
  "cpu_core_count": 20,
  "cpu_thread_count": 20,
  "ram_gb": 32,
  "storage_gb": 1024,
  "display_width_px": 2560,
  "display_height_px": 1600,
  "display_size_inch": 16.0,
  "gpu_brand": "NVIDIA",
  "gpu_series": "GeForce RTX",
  "gpu_model": "RTX 5060",
  "gpu_type": "Dedicated",
  "gpu_vram_gb": 8.0,
  "os_name": "Windows",
  "warranty_years": 1,
  "asking_price_inr": 185000.0,
  "condition": {
    "is_used": false
  }
}
```

**Response Schema (`ValuationResponse`):**
```json
{
  "valuation_inr": 193600.0,
  "new_price_baseline_inr": 193600.0,
  "price_range_low_inr": 178100.0,
  "price_range_high_inr": 209100.0,
  "model_name": "Gradient Boosting",
  "model_r2_score": 0.9307,
  "used_valuation": null,
  "deal_assessment": {
    "asking_price_inr": 185000.0,
    "difference_inr": -8600.0,
    "difference_percentage": -4.44,
    "verdict": "FAIR_PRICE",
    "verdict_label": "Fair Price — Within Expected Market Range",
    "badge_color": "blue"
  },
  "key_drivers": [
    {
      "feature": "ram_gb",
      "shap_value": 47968.79,
      "direction": "increases_price"
    },
    {
      "feature": "total_pixels",
      "shap_value": 18311.72,
      "direction": "increases_price"
    },
    {
      "feature": "gpu_vram_gb",
      "shap_value": 11514.85,
      "direction": "increases_price"
    }
  ],
  "data_provenance_note": "New laptop baseline estimated using genuine Gradient Boosting model trained on the Indian Laptop Specifications Dataset."
}
```

#### Second-Hand Valuation Request Example:
To value a used or out-of-warranty laptop, populate the `condition` object:
```json
{
  "brand": "hp",
  "model": "HP Pavilion 15",
  "device_category": "Thin & Light",
  "cpu_brand": "Intel",
  "cpu_family": "Core",
  "cpu_series": "Core I5",
  "cpu_model": "13420H",
  "cpu_core_count": 8,
  "cpu_thread_count": 12,
  "ram_gb": 16,
  "storage_gb": 512,
  "display_width_px": 1920,
  "display_height_px": 1080,
  "display_size_inch": 15.6,
  "gpu_brand": "Intel",
  "gpu_series": "UHD",
  "gpu_model": "UHD Graphics",
  "gpu_type": "Integrated",
  "gpu_vram_gb": 0.0,
  "os_name": "Windows",
  "warranty_years": 1,
  "asking_price_inr": 42000.0,
  "condition": {
    "is_used": true,
    "age_months": 24,
    "battery_health_percentage": 78.0,
    "cosmetic_condition": "fair",
    "screen_condition": "flawless",
    "has_active_warranty": false
  }
}
```

**Used Valuation Response Section:**
```json
{
  "valuation_inr": 25400.0,
  "new_price_baseline_inr": 53000.0,
  "used_valuation": {
    "is_used": true,
    "depreciation_percentage": 52.2,
    "adjusted_valuation_inr": 25400.0,
    "breakdown": {
      "age_depreciation_pct": 39.2,
      "battery_penalty_pct": 6.0,
      "cosmetic_penalty_pct": 7.0,
      "screen_penalty_pct": 0.0,
      "warranty_bonus_pct": 0.0
    },
    "disclaimer": "EXPERIMENTAL HEURISTIC: Grounded in Turkolmez et al. (2024) remanufacturing methodology framework."
  },
  "deal_assessment": {
    "asking_price_inr": 42000.0,
    "difference_inr": 16600.0,
    "difference_percentage": 65.35,
    "verdict": "SIGNIFICANTLY_OVERPRICED",
    "verdict_label": "Significantly Overpriced",
    "badge_color": "red"
  }
}
```

---

## 3. Error Handling

The API returns standard HTTP status codes:
- `200 OK`: Request succeeded.
- `422 Unprocessable Entity`: Input validation failure (e.g. `cpu_core_count < 2` or negative numbers). Returns detailed JSON validation error array.
- `500 Internal Server Error`: Server-side inference error with diagnostic message.
