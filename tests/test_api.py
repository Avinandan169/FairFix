"""
Unit and Integration Tests for FAIRFIX API and Prediction Pipeline.
"""

import pytest
from fastapi.testclient import TestClient
from backend.main import app


client = TestClient(app)


def test_health_check():
    """Verify /health endpoint returns healthy status and model telemetry."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "loaded_model" in data
    assert data["model_r2_score"] > 0.85


def test_get_options():
    """Verify /options returns standard hardware dropdown choices."""
    response = client.get("/options")
    assert response.status_code == 200
    data = response.json()
    assert "brands" in data
    assert "cpu_series" in data
    assert "gpu_series" in data
    assert len(data["brands"]) >= 8


def test_model_metrics():
    """Verify /model-metrics returns genuine saved experiment data."""
    response = client.get("/model-metrics")
    assert response.status_code == 200
    data = response.json()
    assert "evaluation_summary" in data
    assert "model_comparison" in data
    assert "feature_importances" in data
    assert data["evaluation_summary"]["r2_target_met"] is True


def test_predict_new_laptop():
    """Verify /predict returns valid INR valuation and feature contributions."""
    payload = {
        "brand": "asus",
        "model": "ASUS TUF Gaming A15",
        "device_category": "Gaming",
        "cpu_brand": "AMD",
        "cpu_family": "Ryzen",
        "cpu_series": "Ryzen 7",
        "cpu_model": "7735HS",
        "cpu_core_count": 8,
        "cpu_thread_count": 16,
        "ram_gb": 16,
        "storage_gb": 512,
        "display_width_px": 1920,
        "display_height_px": 1080,
        "display_size_inch": 15.6,
        "gpu_brand": "NVIDIA",
        "gpu_series": "GeForce RTX",
        "gpu_model": "RTX 4050",
        "gpu_vram_gb": 6.0,
        "gpu_type": "Dedicated",
        "os_name": "Windows",
        "warranty_years": 1,
        "asking_price_inr": 78000.0
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["valuation_inr"] > 40000.0
    assert data["deal_assessment"] is not None
    assert "verdict" in data["deal_assessment"]
    assert len(data["key_drivers"]) > 0


def test_predict_used_laptop():
    """Verify /predict applies depreciation when condition parameters are provided."""
    payload = {
        "brand": "hp",
        "model": "HP Pavilion 14",
        "device_category": "Thin & Light",
        "cpu_brand": "Intel",
        "cpu_family": "Core",
        "cpu_series": "Core I5",
        "cpu_model": "1335U",
        "cpu_core_count": 10,
        "cpu_thread_count": 12,
        "ram_gb": 16,
        "storage_gb": 512,
        "display_width_px": 1920,
        "display_height_px": 1080,
        "display_size_inch": 14.0,
        "gpu_brand": "Intel",
        "gpu_series": "Iris Xe",
        "gpu_model": "Iris Xe Graphics",
        "gpu_vram_gb": 0.0,
        "gpu_type": "Integrated",
        "os_name": "Windows",
        "warranty_years": 1,
        "asking_price_inr": 35000.0,
        "condition": {
            "is_used": True,
            "age_months": 20,
            "battery_health_percentage": 75.0,
            "cosmetic_condition": "fair",
            "screen_condition": "minor_scratches",
            "has_active_warranty": False
        }
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["used_valuation"] is not None
    assert data["used_valuation"]["is_used"] is True
    assert data["used_valuation"]["depreciation_percentage"] > 25.0
    # Used valuation should be less than new price baseline
    assert data["valuation_inr"] < data["new_price_baseline_inr"]


def test_predict_invalid_input():
    """Verify /predict returns 422 validation error when essential fields are invalid."""
    payload = {
        "brand": "dell",
        "cpu_core_count": 0  # Invalid: ge=2
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 422
