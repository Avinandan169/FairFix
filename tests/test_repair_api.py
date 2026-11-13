"""
Unit and Integration Tests for FairFix Repair Intelligence and Fault Diagnosis APIs.
"""

import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_diagnosis_screen_symptom():
    """Verify diagnosis correctly classifies display issues with high confidence."""
    payload = {
        "symptom_description": "Laptop screen is completely black when turned on, backlight not working, but external HDMI monitor displays desktop properly"
    }
    response = client.post("/diagnosis/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "CONFIDENT_DIAGNOSIS"
    assert data["primary_fault"] == "Integrated screen"
    assert data["confidence_percentage"] >= 35.0
    assert len(data["suggested_checks"]) >= 2
    assert "disclaimer" in data


def test_diagnosis_battery_symptom():
    """Verify diagnosis correctly classifies battery/power failure."""
    payload = {
        "symptom_description": "Battery dies immediately within 10 minutes of unplugging charger, battery health report shows high degradation"
    }
    response = client.post("/diagnosis/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "CONFIDENT_DIAGNOSIS"
    assert data["primary_fault"] == "Power/battery"
    assert data["confidence_percentage"] >= 35.0


def test_diagnosis_insufficient_input():
    """Verify short or ambiguous symptoms trigger safe insufficient/low confidence status."""
    payload = {
        "symptom_description": "bad"
    }
    response = client.post("/diagnosis/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "INSUFFICIENT_INPUT"
    assert data["is_confident"] is False
    assert data["primary_fault"] is None


def test_diagnosis_metrics_endpoint():
    """Verify /diagnosis/metrics returns verified evaluation telemetry."""
    response = client.get("/diagnosis/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "test_metrics" in data
    assert data["test_metrics"]["accuracy"] > 0.65
    assert data["test_metrics"]["macro_f1"] > 0.60
    assert "classes" in data
    assert len(data["classes"]) == 17
    assert "confusion_matrix" in data


def test_repair_pricing_options():
    """Verify /repair/pricing/options provides available dropdown selections."""
    response = client.get("/repair/pricing/options")
    assert response.status_code == 200
    data = response.json()
    assert "components" in data
    assert "Integrated screen" in data["components"]
    assert "Power/battery" in data["components"]
    assert "System board" in data["components"]


def test_repair_pricing_list():
    """Verify /repair/pricing returns benchmark records."""
    response = client.get("/repair/pricing")
    assert response.status_code == 200
    records = response.json()
    assert isinstance(records, list)
    assert len(records) >= 20
    first = records[0]
    assert "record_id" in first
    assert "part_price_min" in first
    assert "labour_min" in first


def test_repair_cost_estimate():
    """Verify /repair/estimate returns parts, labour, and combined range in INR."""
    payload = {
        "component": "Integrated screen",
        "repair_type": "Replacement"
    }
    response = client.post("/repair/estimate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["found"] is True
    assert data["part_cost_range"]["min"] > 0
    assert data["labour_cost_range"]["min"] > 0
    assert data["total_estimated_range"]["min"] >= (
        data["part_cost_range"]["min"] + data["labour_cost_range"]["min"]
    )


def test_evaluate_quote_fair():
    """Verify technician quote inside market range is classified as FAIR_AND_COMPETITIVE."""
    payload = {
        "quoted_price": 4200.0,
        "component": "Integrated screen"
    }
    response = client.post("/repair/evaluate-quote", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["verdict"] == "FAIR_AND_COMPETITIVE"
    assert len(data["suggested_questions"]) >= 2


def test_evaluate_quote_significantly_above():
    """Verify inflated quote is classified as SIGNIFICANTLY_ABOVE_REFERENCE."""
    payload = {
        "quoted_price": 45000.0,
        "component": "Integrated keyboard"
    }
    response = client.post("/repair/evaluate-quote", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["verdict"] == "SIGNIFICANTLY_ABOVE_REFERENCE"
    assert data["variance"]["percentage"] > 35.0


def test_evaluate_quote_below_reference():
    """Verify abnormally cheap quote triggers caution and BELOW_REFERENCE verdict."""
    payload = {
        "quoted_price": 800.0,
        "component": "Integrated screen"
    }
    response = client.post("/repair/evaluate-quote", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["verdict"] == "BELOW_REFERENCE"


def test_repair_decision_repair_recommended():
    """Verify high-value machine with minor repair yields REPAIR_RECOMMENDED."""
    payload = {
        "repair_cost": 3500.0,
        "device_market_value": 65000.0,
        "device_age_years": 1.5,
        "device_condition": "Good"
    }
    response = client.post("/repair/decision", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["verdict"] == "REPAIR_RECOMMENDED"
    assert data["repair_cost_ratio_pct"] <= 30.0


def test_repair_decision_replace_recommended():
    """Verify low-value aging machine with expensive repair yields REPLACEMENT_RECOMMENDED."""
    payload = {
        "repair_cost": 18000.0,
        "device_market_value": 22000.0,
        "device_age_years": 5.5,
        "device_condition": "Fair"
    }
    response = client.post("/repair/decision", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["verdict"] == "REPLACEMENT_RECOMMENDED"
    assert data["repair_cost_ratio_pct"] > 50.0


def test_repair_decision_with_laptop_specs():
    """Verify /repair/decision seamlessly invokes ML valuation engine if specs provided."""
    payload = {
        "repair_cost": 4500.0,
        "laptop_specs": {
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
            "warranty_years": 1
        },
        "device_age_years": 1.0
    }
    response = client.post("/repair/decision", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["financial_breakdown"]["device_market_value_inr"] > 35000
    assert data["verdict"] == "REPAIR_RECOMMENDED"
