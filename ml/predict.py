"""
Inference and Valuation Engine for FAIRFIX.

Performs:
1. Production prediction using the serialized optimal ML pipeline
2. Input validation and fallback imputation
3. Condition-based Used Laptop Depreciation Heuristic (grounded in Turkolmez et al. 2024 methodology)
4. Deal Assessment (comparing asking price with fair market value)
5. Local explainability for why the laptop was valued at this price
"""

import os
import joblib
import numpy as np
import pandas as pd

from ml.data.preprocess import (
    NUMERICAL_FEATURES,
    CATEGORICAL_FEATURES,
    get_feature_lists
)
from ml.features.feature_engineering import apply_feature_engineering
from ml.evaluation.explainability import explain_single_prediction


DEFAULT_MODEL_PATH = "artifacts/models/fairfix_best_model.joblib"


class FairFixPredictor:
    """Predictor and valuation service for laptop price intelligence."""

    def __init__(self, model_path: str = DEFAULT_MODEL_PATH):
        self.model_path = model_path
        self.pipeline = None
        self._load_model()

    def _load_model(self):
        """Loads serialized model pipeline from disk."""
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(
                f"Trained model not found at '{self.model_path}'. "
                "Please run `python ml/training/train.py` first."
            )
        self.pipeline = joblib.load(self.model_path)

    def predict_new_price(self, specs_dict: dict) -> dict:
        """
        Estimates the baseline new retail price in INR for a laptop given its specifications.
        Returns predicted price, confidence interval, and influencing features.
        """
        # Convert dictionary to DataFrame
        df_input = pd.DataFrame([specs_dict])

        # Apply domain feature engineering
        df_featured = apply_feature_engineering(df_input)

        # Ensure all expected columns exist
        for col in NUMERICAL_FEATURES:
            if col not in df_featured.columns:
                df_featured[col] = 0.0
            else:
                df_featured[col] = pd.to_numeric(df_featured[col], errors='coerce').fillna(0.0)

        for col in CATEGORICAL_FEATURES:
            if col not in df_featured.columns:
                df_featured[col] = 'Unknown'
            else:
                df_featured[col] = df_featured[col].fillna('Unknown').astype(str)

        X = df_featured[NUMERICAL_FEATURES + CATEGORICAL_FEATURES]

        # Generate base prediction
        base_pred = float(self.pipeline.predict(X)[0])
        # Laptop prices cannot be below minimum realistic threshold
        predicted_price = max(base_pred, 12000.0)

        # Standard error margin based on test RMSE (~15-18%)
        error_margin = predicted_price * 0.08
        price_low = max(10000.0, round(predicted_price - error_margin, -2))
        price_high = round(predicted_price + error_margin, -2)

        # Generate local explainability
        explanations = explain_single_prediction(self.pipeline, X)

        return {
            "predicted_price_inr": round(predicted_price, -2),
            "price_range_low_inr": price_low,
            "price_range_high_inr": price_high,
            "key_drivers": explanations
        }

    def evaluate_valuation(self, specs_dict: dict, condition_dict: dict = None, asking_price: float = None) -> dict:
        """
        Full valuation combining:
        1. ML baseline new price
        2. Used laptop condition & depreciation adjustment (if applicable)
        3. Asking price comparison & deal assessment
        """
        new_price_info = self.predict_new_price(specs_dict)
        base_new_price = new_price_info["predicted_price_inr"]

        used_valuation_info = None
        final_valuation = base_new_price

        # Check if used-laptop condition parameters were supplied
        if condition_dict and condition_dict.get("is_used", False):
            used_valuation_info = self._calculate_used_depreciation(base_new_price, condition_dict)
            final_valuation = used_valuation_info["adjusted_valuation_inr"]

        # Deal Assessment if asking price is provided
        deal_assessment = None
        if asking_price is not None and asking_price > 0:
            diff_inr = round(asking_price - final_valuation, 2)
            pct_diff = round((diff_inr / final_valuation) * 100.0, 2)

            if pct_diff <= -12.0:
                verdict = "GREAT_DEAL"
                verdict_label = "Great Deal — Below Estimated Market Value"
                badge_color = "emerald"
            elif -12.0 < pct_diff <= 7.0:
                verdict = "FAIR_PRICE"
                verdict_label = "Fair Price — Within Expected Market Range"
                badge_color = "blue"
            elif 7.0 < pct_diff <= 20.0:
                verdict = "SLIGHTLY_OVERPRICED"
                verdict_label = "Slightly Overpriced"
                badge_color = "amber"
            else:
                verdict = "SIGNIFICANTLY_OVERPRICED"
                verdict_label = "Significantly Overpriced"
                badge_color = "red"

            deal_assessment = {
                "asking_price_inr": asking_price,
                "difference_inr": diff_inr,
                "difference_percentage": pct_diff,
                "verdict": verdict,
                "verdict_label": verdict_label,
                "badge_color": badge_color
            }

        return {
            "valuation_inr": round(final_valuation, -2),
            "new_price_baseline_inr": base_new_price,
            "price_range_low_inr": new_price_info["price_range_low_inr"] if not used_valuation_info else round(final_valuation * 0.92, -2),
            "price_range_high_inr": new_price_info["price_range_high_inr"] if not used_valuation_info else round(final_valuation * 1.08, -2),
            "used_valuation": used_valuation_info,
            "deal_assessment": deal_assessment,
            "key_drivers": new_price_info["key_drivers"]
        }

    def _calculate_used_depreciation(self, base_price: float, condition: dict) -> dict:
        """
        Calculates depreciation using the remanufacturing methodology framework
        derived from Turkolmez et al. (2024).

        Explicitly marked as an Experimental Heuristic because no open transaction-level
        used laptop dataset exists for empirical parameter fitting.
        """
        age_months = int(condition.get("age_months", 0))
        battery_health = float(condition.get("battery_health_percentage", 100.0))
        cosmetic = str(condition.get("cosmetic_condition", "Good")).lower()
        screen_cond = str(condition.get("screen_condition", "Flawless")).lower()
        has_warranty = bool(condition.get("has_active_warranty", False))

        # 1. Age-based depreciation curve:
        # Standard tech hardware depreciation: ~20% Year 1, ~15% Year 2, ~12% Year 3
        # Exponential curve: D_age = 1 - (1 - rate)^(months/12)
        annual_depr_rate = 0.22
        years = age_months / 12.0
        age_factor = 1.0 - (1.0 - annual_depr_rate) ** years
        age_factor = min(age_factor, 0.75) # Cap max age depreciation at 75%

        # 2. Battery health penalty:
        # If battery is below 80%, degradation accelerates
        if battery_health >= 85:
            battery_penalty = 0.0
        elif battery_health >= 70:
            battery_penalty = 0.06
        elif battery_health >= 50:
            battery_penalty = 0.12
        else:
            battery_penalty = 0.20

        # 3. Cosmetic condition deduction:
        cosmetic_penalties = {
            "like_new": 0.02,
            "good": 0.07,
            "fair": 0.16,
            "poor": 0.28
        }
        cosmetic_penalty = cosmetic_penalties.get(cosmetic, 0.07)

        # 4. Screen condition deduction:
        screen_penalties = {
            "flawless": 0.0,
            "minor_scratches": 0.05,
            "visible_scratches": 0.12,
            "dead_pixels_or_lines": 0.25
        }
        screen_penalty = screen_penalties.get(screen_cond, 0.0)

        # 5. Warranty bonus:
        warranty_bonus = 0.06 if has_warranty else 0.0

        total_deduction_pct = min(0.85, (age_factor + battery_penalty + cosmetic_penalty + screen_penalty - warranty_bonus))
        depreciated_price = base_price * (1.0 - total_deduction_pct)

        return {
            "is_used": True,
            "depreciation_percentage": round(total_deduction_pct * 100.0, 1),
            "adjusted_valuation_inr": round(depreciated_price, -2),
            "breakdown": {
                "age_depreciation_pct": round(age_factor * 100.0, 1),
                "battery_penalty_pct": round(battery_penalty * 100.0, 1),
                "cosmetic_penalty_pct": round(cosmetic_penalty * 100.0, 1),
                "screen_penalty_pct": round(screen_penalty * 100.0, 1),
                "warranty_bonus_pct": round(warranty_bonus * 100.0, 1)
            },
            "disclaimer": (
                "EXPERIMENTAL HEURISTIC: Used-device depreciation is calculated using "
                "the literature-backed remanufacturing methodology framework (Turkolmez et al. 2024). "
                "It is clearly distinct from the machine-learned new retail baseline."
            )
        }


# Global predictor instance
_predictor = None


def get_predictor():
    """Singleton getter for the FairFixPredictor instance."""
    global _predictor
    if _predictor is None:
        _predictor = FairFixPredictor()
    return _predictor
