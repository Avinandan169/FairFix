"""
Model Evaluation and Error Diagnostics Module for FAIRFIX.

Calculates comprehensive regression metrics:
- Coefficient of Determination (R²)
- Mean Absolute Error (MAE) in INR
- Root Mean Squared Error (RMSE) in INR
- Mean Absolute Percentage Error (MAPE)
- Price tier error stratification (<50k, 50k-100k, 100k-150k, >150k)
- Residual analysis (Actual vs Predicted, Residual distributions)
"""

import numpy as np
import pandas as pd
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error, median_absolute_error


def calculate_regression_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> dict:
    """Calculates all key regression metrics between actual and predicted target values."""
    y_true = np.array(y_true, dtype=float)
    y_pred = np.array(y_pred, dtype=float)

    residuals = y_true - y_pred
    abs_pct_errors = np.abs(residuals) / np.maximum(y_true, 1.0) * 100.0

    r2 = float(r2_score(y_true, y_pred))
    mae = float(mean_absolute_error(y_true, y_pred))
    rmse = float(np.sqrt(mean_squared_error(y_true, y_pred)))
    med_ae = float(median_absolute_error(y_true, y_pred))
    mape = float(np.mean(abs_pct_errors))

    return {
        "r2_score": round(r2, 4),
        "mae_inr": round(mae, 2),
        "rmse_inr": round(rmse, 2),
        "median_ae_inr": round(med_ae, 2),
        "mape_percentage": round(mape, 2),
        "max_error_inr": round(float(np.max(np.abs(residuals))), 2),
        "sample_count": int(len(y_true))
    }


def analyze_errors_by_price_tier(y_true: np.ndarray, y_pred: np.ndarray) -> list:
    """Stratifies prediction error by consumer price brackets."""
    y_true = np.array(y_true, dtype=float)
    y_pred = np.array(y_pred, dtype=float)

    tiers = [
        {"name": "Budget (< ₹50,000)", "min": 0, "max": 50000},
        {"name": "Mid-Range (₹50,000 - ₹1,00,000)", "min": 50000, "max": 100000},
        {"name": "Upper Mid-Range (₹1,00,000 - ₹1,50,000)", "min": 100000, "max": 150000},
        {"name": "Enthusiast / Premium (> ₹1,50,000)", "min": 150000, "max": 10000000}
    ]

    tier_results = []
    for t in tiers:
        mask = (y_true >= t["min"]) & (y_true < t["max"])
        cnt = int(np.sum(mask))
        if cnt > 0:
            sub_true = y_true[mask]
            sub_pred = y_pred[mask]
            sub_mae = float(mean_absolute_error(sub_true, sub_pred))
            sub_r2 = float(r2_score(sub_true, sub_pred)) if cnt > 1 and np.var(sub_true) > 0 else 0.0
            sub_mape = float(np.mean(np.abs(sub_true - sub_pred) / sub_true * 100.0))
            tier_results.append({
                "tier_name": t["name"],
                "count": cnt,
                "percentage_of_test_set": round((cnt / len(y_true)) * 100, 1),
                "mae_inr": round(sub_mae, 2),
                "r2_score": round(sub_r2, 4),
                "mape_percentage": round(sub_mape, 2)
            })

    return tier_results


def generate_residual_plot_data(y_true: np.ndarray, y_pred: np.ndarray, sample_limit: int = 150) -> list:
    """Generates downsampled actual vs predicted data points for client-side rendering."""
    y_true = np.array(y_true, dtype=float)
    y_pred = np.array(y_pred, dtype=float)
    indices = np.arange(len(y_true))

    if len(indices) > sample_limit:
        np.random.seed(42)
        indices = np.random.choice(indices, size=sample_limit, replace=False)

    points = []
    for idx in sorted(indices):
        act = float(y_true[idx])
        pred = float(y_pred[idx])
        res = act - pred
        points.append({
            "index": int(idx),
            "actual_inr": round(act, 2),
            "predicted_inr": round(pred, 2),
            "residual_inr": round(res, 2),
            "error_percentage": round(abs(res) / max(act, 1.0) * 100.0, 2)
        })

    return points
