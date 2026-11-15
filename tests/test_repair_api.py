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


def test_repair_estimate_unknown_component():
    """Verify /repair/estimate returns found: False when component is not in catalogue."""
    payload = {
        "component": "Nonexistent Hardware Part",
        "repair_type": "Replacement"
    }
    response = client.post("/repair/estimate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["found"] is False
    assert "No pricing benchmark found" in data["message"]


def test_repair_decision_invalid_inputs():
    """Verify /repair/decision rejects non-positive market value or repair cost."""
    # Zero market value
    res_zero = client.post("/repair/decision", json={"repair_cost": 3000, "device_market_value": 0})
    assert res_zero.status_code == 422

    # Negative repair cost
    res_neg = client.post("/repair/decision", json={"repair_cost": -500, "device_market_value": 40000})
    assert res_neg.status_code == 422

    # Missing both market value and specs
    res_missing = client.post("/repair/decision", json={"repair_cost": 3000})
    assert res_missing.status_code == 400
    assert "Valid device market value or laptop specification payload required" in res_missing.json()["detail"]


# =====================================================================
# Tests for Other Possible Factors Dynamic Symptom-Grounded Scoring
# =====================================================================

def test_possible_factors_dual_symptom():
    """Verify dual-symptom input grounds secondary factor with evidence and high relevance."""
    payload = {
        "symptom_description": "Battery draining quickly and overheating"
    }
    response = client.post("/diagnosis/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["primary_fault"] == "Power/battery"
    assert len(data["alternatives"]) >= 1

    overheat = next((alt for alt in data["alternatives"] if alt["fault_type"] == "Overheating"), None)
    assert overheat is not None, "Overheating should be identified as a secondary contributing factor"
    assert overheat["relevance_score"] >= 55
    assert overheat["relevance_level"] == "High"
    assert "overheating" in [s.lower() for s in overheat["matched_symptoms"]]
    assert overheat["is_heuristic"] is True
    assert "thermal" in overheat["explanation"].lower() or "cooling" in overheat["explanation"].lower()

    # Verify unrelated categories with no symptom evidence are not injected
    unrelated_faults = [alt["fault_type"] for alt in data["alternatives"]]
    assert "Operating system" not in unrelated_faults
    assert "Configuration" not in unrelated_faults


def test_possible_factors_compound_keyboard_ports():
    """Verify compound input captures the secondary physical subsystem accurately."""
    payload = {
        "symptom_description": "Keyboard not responding and USB ports failing"
    }
    response = client.post("/diagnosis/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["primary_fault"] in ["Ports/slots/connectors", "Integrated keyboard"]

    secondary_fault = "Integrated keyboard" if data["primary_fault"] == "Ports/slots/connectors" else "Ports/slots/connectors"
    matched_alt = next((alt for alt in data["alternatives"] if alt["fault_type"] == secondary_fault), None)
    assert matched_alt is not None
    assert matched_alt["relevance_score"] >= 50
    assert matched_alt["matched_symptoms"] is not None and len(matched_alt["matched_symptoms"]) > 0


def test_possible_factors_isolated_symptom_empty():
    """Verify single isolated physical symptom does not produce spurious background factors."""
    payload = {
        "symptom_description": "My laptop screen has a big crack across the glass"
    }
    response = client.post("/diagnosis/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["primary_fault"] == "Integrated screen"
    # Secondary alternatives should be empty because there is zero evidence for OS/Config/Battery
    assert len(data["alternatives"]) == 0


def test_possible_factors_insufficient_input():
    """Verify ambiguous or minimal input returns empty alternatives list."""
    payload = {
        "symptom_description": "bad"
    }
    response = client.post("/diagnosis/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "INSUFFICIENT_INPUT"
    assert data["alternatives"] == []


def test_possible_factors_determinism():
    """Verify scoring and ranking are strictly deterministic for identical inputs."""
    payload = {
        "symptom_description": "Laptop running slowly and frequent freezing"
    }
    res1 = client.post("/diagnosis/predict", json=payload).json()
    res2 = client.post("/diagnosis/predict", json=payload).json()

    assert res1["primary_fault"] == res2["primary_fault"]
    assert len(res1["alternatives"]) == len(res2["alternatives"])
    for a1, a2 in zip(res1["alternatives"], res2["alternatives"]):
        assert a1["fault_type"] == a2["fault_type"]
        assert a1["relevance_score"] == a2["relevance_score"]
        assert a1["relevance_level"] == a2["relevance_level"]
        assert a1["matched_symptoms"] == a2["matched_symptoms"]

