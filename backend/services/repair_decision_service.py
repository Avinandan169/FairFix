"""
Repair-versus-Replace Decision Support Service.

Synthesizes ML-based laptop market valuation with repair cost benchmarks
to deliver objective, mathematically justified repair-or-replace recommendations.
"""

from typing import Dict, Any, Optional
from backend.services.prediction_service import PredictionService
from backend.schemas.laptop import LaptopPredictionRequest


class RepairDecisionService:
    def __init__(self):
        self._prediction_service = None

    @property
    def prediction_service(self) -> PredictionService:
        if self._prediction_service is None:
            self._prediction_service = PredictionService()
        return self._prediction_service

    def analyze_decision(
        self,
        repair_cost: float,
        device_market_value: Optional[float] = None,
        laptop_specs: Optional[Dict[str, Any]] = None,
        device_age_years: Optional[float] = None,
        device_condition: Optional[str] = "Good",
        component: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Determines whether repairing or replacing the device is economically viable.
        """
        valuation_details = {}

        # 1. Resolve device market value
        if laptop_specs:
            try:
                # Convert dict to LaptopPredictionRequest
                req = LaptopPredictionRequest(**laptop_specs)
                val_res = self.prediction_service.evaluate_laptop(req)
                device_market_value = float(val_res.get("valuation_inr") or val_res.get("valuation", {}).get("estimated_value_inr", 0))
                valuation_details = val_res
            except Exception as e:
                # If conversion fails and device_market_value is not provided
                if not device_market_value:
                    return {
                        "success": False,
                        "error": f"Failed to compute laptop market valuation: {str(e)}"
                    }

        if not device_market_value or device_market_value <= 0:
            return {
                "success": False,
                "error": "Valid device market value or laptop specification payload required."
            }

        cost = float(repair_cost)
        market_val = float(device_market_value)

        # 2. Compute Repair Cost Ratio
        repair_ratio = cost / market_val
        repair_ratio_pct = round(repair_ratio * 100, 1)

        # 3. Decision Matrix
        # Heuristic rules:
        # <= 30%: Repair strongly recommended
        # 30% - 50%: Borderline (age, condition, and battery play a decisive role)
        # > 50%: Replacement recommended
        age = float(device_age_years) if device_age_years is not None else 2.5

        if repair_ratio <= 0.30:
            verdict = "REPAIR_RECOMMENDED"
            verdict_label = "Repair Recommended"
            badge_color = "emerald"
            summary = (
                f"Repairing this laptop is economically prudent. The repair cost of ₹{int(cost):,} represents "
                f"only {repair_ratio_pct}% of the machine's current fair market value (₹{int(market_val):,}). "
                f"You preserve significant residual value at a fraction of replacement cost."
            )
            key_factors = [
                f"Repair cost is low relative to device worth ({repair_ratio_pct}% vs 30% threshold).",
                f"Device retains substantial residual equity (₹{int(market_val - cost):,} net retained value).",
                "Extending laptop lifespan avoids electronic waste and substantial new purchase outlay."
            ]

        elif repair_ratio <= 0.50:
            # Check age factor
            if age >= 5.0:
                verdict = "BORDERLINE_LEAN_REPLACE"
                verdict_label = "Borderline — Lean Toward Replacement"
                badge_color = "orange"
                summary = (
                    f"The repair cost of ₹{int(cost):,} is {repair_ratio_pct}% of device value. Because the laptop "
                    f"is ~{age} years old, future component degradations (e.g. battery, thermal wear, OS compatibility) "
                    f"make substantial repair investments risky."
                )
                key_factors = [
                    f"Repair cost is substantial ({repair_ratio_pct}% of machine value).",
                    f"Device age ({age} years) approaches end-of-support and platform obsolescence.",
                    "Consider liquidating the device for parts and putting repair funds toward a modern system."
                ]
            else:
                verdict = "BORDERLINE_EVALUATE"
                verdict_label = "Borderline — Evaluate Device Condition"
                badge_color = "amber"
                summary = (
                    f"The repair cost of ₹{int(cost):,} represents {repair_ratio_pct}% of the laptop's value (₹{int(market_val):,}). "
                    f"Proceed with repair only if other major subsystems (battery health, display, and keyboard) are in good condition."
                )
                key_factors = [
                    f"Moderate repair-to-value ratio ({repair_ratio_pct}%).",
                    "If CPU and display satisfy your daily workflow, repair is viable.",
                    "If battery requires simultaneous replacement, overall cost will likely exceed 50% threshold."
                ]

        else:
            verdict = "REPLACEMENT_RECOMMENDED"
            verdict_label = "Replacement Recommended"
            badge_color = "rose"
            summary = (
                f"We recommend against proceeding with this repair. At ₹{int(cost):,}, the repair amounts to "
                f"{repair_ratio_pct}% of the entire laptop's market value (₹{int(market_val):,}). Investing "
                f"this amount into an aging machine offers poor financial return."
            )
            key_factors = [
                f"Repair cost is disproportionate ({repair_ratio_pct}% > 50% economic viability limit).",
                f"Sunk repair cost nearly matches what the machine is worth on the open market.",
                "Better strategy: Sell the current unit for spare parts and direct repair funds toward a replacement laptop."
            ]

        financial_comparison = {
            "repair_cost_inr": int(cost),
            "device_market_value_inr": int(market_val),
            "repair_cost_ratio_pct": repair_ratio_pct,
            "net_equity_after_repair_inr": max(0, int(market_val - cost)),
            "device_age_years": age,
            "device_condition": device_condition
        }

        return {
            "success": True,
            "verdict": verdict,
            "verdict_label": verdict_label,
            "badge_color": badge_color,
            "repair_cost_ratio": round(repair_ratio, 4),
            "repair_cost_ratio_pct": repair_ratio_pct,
            "economic_summary": summary,
            "decision_factors": key_factors,
            "financial_breakdown": financial_comparison,
            "valuation_source": "FairFix ML Valuation Pipeline" if laptop_specs else "User-Provided Market Value"
        }


# Singleton instance
_repair_decision_service = None


def get_repair_decision_service() -> RepairDecisionService:
    global _repair_decision_service
    if _repair_decision_service is None:
        _repair_decision_service = RepairDecisionService()
    return _repair_decision_service
