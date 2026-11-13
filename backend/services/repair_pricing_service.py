"""
Repair Cost Intelligence Service for Indian Laptop Hardware Markets.

Queries verified price benchmarks across Nehru Place (Delhi), SP Road (Bengaluru),
Lamington Road (Mumbai), Cashify, and Authorized OEM Service matrices.
"""

import os
import pandas as pd
from typing import List, Dict, Any, Optional

PRICING_CATALOGUE_PATH = "datasets/reference/repair_pricing/repair_costs_india.csv"


class RepairPricingService:
    def __init__(self, catalogue_path: str = PRICING_CATALOGUE_PATH):
        self.catalogue_path = catalogue_path
        self.df = None
        self._load_catalogue()

    def _load_catalogue(self):
        if not os.path.exists(self.catalogue_path):
            raise FileNotFoundError(f"Pricing catalogue not found at {self.catalogue_path}")
        self.df = pd.read_csv(self.catalogue_path)
        # Ensure numeric columns
        for col in ["part_price_min", "part_price_max", "labour_min", "labour_max"]:
            self.df[col] = pd.to_numeric(self.df[col], errors="coerce").fillna(0).astype(int)

    def get_all_records(self) -> List[Dict[str, Any]]:
        return self.df.to_dict(orient="records")

    def get_components(self) -> List[str]:
        return sorted(self.df["component"].unique().tolist())

    def get_options(self) -> Dict[str, Any]:
        return {
            "components": sorted(self.df["component"].unique().tolist()),
            "repair_types": sorted(self.df["repair_type"].unique().tolist()),
            "brands": sorted(self.df["laptop_brand"].unique().tolist())
        }

    def get_records_by_component(self, component: str) -> List[Dict[str, Any]]:
        filtered = self.df[self.df["component"].str.lower() == component.strip().lower()]
        return filtered.to_dict(orient="records")

    def estimate_cost(
        self,
        component: str,
        repair_type: Optional[str] = None,
        brand: Optional[str] = None,
        record_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Calculates parts range, labour range, and combined estimated repair benchmark.
        """
        filtered = self.df.copy()

        if record_id:
            match = filtered[filtered["record_id"] == record_id]
            if not match.empty:
                filtered = match

        if len(filtered) > 1 and component:
            comp_match = filtered[filtered["component"].str.lower() == component.strip().lower()]
            if not comp_match.empty:
                filtered = comp_match
            else:
                return {
                    "found": False,
                    "message": f"No pricing benchmark found for component '{component}'."
                }

        if len(filtered) > 1 and brand and brand.lower() != "universal":
            brand_match = filtered[filtered["laptop_brand"].str.lower() == brand.strip().lower()]
            if not brand_match.empty:
                filtered = brand_match

        if len(filtered) > 1 and repair_type:
            type_match = filtered[filtered["repair_type"].str.lower() == repair_type.strip().lower()]
            if not type_match.empty:
                filtered = type_match

        if filtered.empty:
            # Fallback to general component default
            fallback = self.df[self.df["component"].str.lower() == component.strip().lower()]
            if not fallback.empty:
                filtered = fallback
            else:
                return {
                    "found": False,
                    "message": f"No pricing benchmark found for component '{component}'."
                }

        # Aggregate ranges across matching representative records
        part_min = int(filtered["part_price_min"].min())
        part_max = int(filtered["part_price_max"].max())
        labour_min = int(filtered["labour_min"].min())
        labour_max = int(filtered["labour_max"].max())

        total_min = part_min + labour_min
        total_max = part_max + labour_max

        records_info = filtered[[
            "record_id", "laptop_brand", "laptop_model_or_compatible_category",
            "component", "repair_type", "part_description",
            "part_price_min", "part_price_max", "labour_min", "labour_max",
            "market_location", "source_name", "source_url"
        ]].to_dict(orient="records")

        return {
            "found": True,
            "component": component,
            "currency": "INR",
            "part_cost_range": {
                "min": part_min,
                "max": part_max
            },
            "labour_cost_range": {
                "min": labour_min,
                "max": labour_max
            },
            "total_estimated_range": {
                "min": total_min,
                "max": total_max
            },
            "representative_matches": records_info,
            "primary_source": records_info[0]["source_name"] if records_info else "Indian Independent Repair Survey",
            "market_location": records_info[0]["market_location"] if records_info else "Major Indian IT Hubs"
        }


# Singleton instance
_repair_pricing_service = None


def get_repair_pricing_service() -> RepairPricingService:
    global _repair_pricing_service
    if _repair_pricing_service is None:
        _repair_pricing_service = RepairPricingService()
    return _repair_pricing_service
