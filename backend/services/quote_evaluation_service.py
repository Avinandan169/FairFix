"""
Technician Quote Evaluation Service.

Compares technician quotes objectively against independent Indian market benchmarks,
calculates rupee variance and percentage markup/discount, and generates neutral,
actionable questions for consumers.
"""

from typing import Dict, Any, Optional
from backend.services.repair_pricing_service import get_repair_pricing_service


class QuoteEvaluationService:
    def __init__(self):
        self.pricing_service = get_repair_pricing_service()

    def evaluate_quote(
        self,
        quoted_price: float,
        component: str,
        repair_type: Optional[str] = None,
        brand: Optional[str] = None,
        record_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Evaluates a technician quote against the reference market benchmark.
        """
        benchmark = self.pricing_service.estimate_cost(
            component=component,
            repair_type=repair_type,
            brand=brand,
            record_id=record_id
        )

        if not benchmark.get("found"):
            return {
                "success": False,
                "message": benchmark.get("message", "Benchmark unavailable.")
            }

        ref_min = benchmark["total_estimated_range"]["min"]
        ref_max = benchmark["total_estimated_range"]["max"]
        ref_mid = (ref_min + ref_max) / 2.0

        quote = float(quoted_price)

        # Categorize quote against benchmark
        if quote < ref_min * 0.85:
            verdict = "BELOW_REFERENCE"
            verdict_label = "Below Market Reference"
            badge_color = "amber"
            diff = quote - ref_min
            percent_diff = round(((quote - ref_min) / ref_min) * 100, 1)
            explanation = (
                f"The quote of ₹{int(quote):,} is {abs(percent_diff)}% lower than typical Indian market minimum "
                f"(₹{ref_min:,}). While attractive, significantly discounted rates can indicate refurbished, "
                f"salvaged, or B-grade aftermarket parts, or hidden labour/diagnostic fees."
            )
            technician_questions = [
                "Is the quoted part brand new or salvaged from another machine?",
                "Does this price include both the physical component and technician bench labour?",
                "What written warranty duration (e.g. 30, 90, or 180 days) is provided on the replacement?",
                "Will you provide the old damaged part back upon completion?"
            ]

        elif quote <= ref_max * 1.10:
            verdict = "FAIR_AND_COMPETITIVE"
            verdict_label = "Fair & Competitive"
            badge_color = "emerald"
            diff = quote - ref_mid
            percent_diff = round(((quote - ref_mid) / ref_mid) * 100, 1)
            explanation = (
                f"The quote of ₹{int(quote):,} is within the standard market reference range "
                f"(₹{ref_min:,} – ₹{ref_max:,}) for {component}. This represents a competitive "
                f"and reasonable rate for reputable independent repair centres."
            )
            technician_questions = [
                "What is the warranty coverage duration on this specific part and labour?",
                "Are you using an OEM-grade panel/battery/component with matching original specifications?",
                "What is the estimated turnaround time for testing and delivery?"
            ]

        elif quote <= ref_max * 1.35:
            verdict = "SLIGHTLY_ABOVE_REFERENCE"
            verdict_label = "Slightly Above Reference"
            badge_color = "orange"
            diff = quote - ref_max
            percent_diff = round(((quote - ref_max) / ref_max) * 100, 1)
            explanation = (
                f"The quote of ₹{int(quote):,} is ₹{int(diff):,} ({percent_diff}%) above the typical market "
                f"maximum (₹{ref_max:,}). This premium may be justifiable if the provider offers doorstep "
                f"service, same-day turnaround, authorized OEM original parts, or an extended 6+ month warranty."
            )
            technician_questions = [
                "Could you provide an itemized breakdown of part cost versus technician labour charges?",
                "Does this higher quote include an extended warranty or guaranteed genuine OEM part?",
                "Is diagnostic testing or doorstep collection included in this price?"
            ]

        else:
            verdict = "SIGNIFICANTLY_ABOVE_REFERENCE"
            verdict_label = "Significantly Above Reference"
            badge_color = "rose"
            diff = quote - ref_max
            percent_diff = round(((quote - ref_max) / ref_max) * 100, 1)
            explanation = (
                f"The quote of ₹{int(quote):,} is ₹{int(diff):,} ({percent_diff}%) higher than standard market "
                f"reference maximum (₹{ref_max:,}). A second opinion from an alternate independent repair centre "
                f"or hub (e.g. Nehru Place, SP Road) is strongly advised before proceeding."
            )
            technician_questions = [
                "Can you provide a formal itemized quotation detailing part part-number and labour hours?",
                "Why does the quote substantially exceed independent market benchmarks?",
                "Are other ancillary components being replaced alongside the primary part?",
                "What is the cancellation or bench inspection fee if I decide not to proceed with repair?"
            ]

        return {
            "success": True,
            "quoted_price": int(quote),
            "verdict": verdict,
            "verdict_label": verdict_label,
            "badge_color": badge_color,
            "benchmark_range": {
                "min": ref_min,
                "max": ref_max,
                "midpoint": int(ref_mid)
            },
            "variance": {
                "difference_inr": int(diff),
                "percentage": percent_diff
            },
            "parts_benchmark": benchmark["part_cost_range"],
            "labour_benchmark": benchmark["labour_cost_range"],
            "market_location": benchmark["market_location"],
            "primary_source": benchmark["primary_source"],
            "explanation": explanation,
            "suggested_questions": technician_questions,
            "is_heuristic": True,
            "disclaimer": (
                "Quote evaluation compares technician pricing against an illustrative heuristic benchmark. "
                "It serves as a consumer negotiation and awareness guide, not as an authoritative or legally binding commercial appraisal."
            )
        }


# Singleton instance
_quote_evaluation_service = None


def get_quote_evaluation_service() -> QuoteEvaluationService:
    global _quote_evaluation_service
    if _quote_evaluation_service is None:
        _quote_evaluation_service = QuoteEvaluationService()
    return _quote_evaluation_service
