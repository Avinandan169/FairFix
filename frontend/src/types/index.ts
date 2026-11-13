export interface ConditionInput {
  is_used: boolean;
  age_months: number;
  battery_health_percentage: number;
  cosmetic_condition: string;
  screen_condition: string;
  has_active_warranty: boolean;
}

export interface LaptopSpecsInput {
  brand: string;
  model: string;
  device_category: string;
  cpu_brand: string;
  cpu_family: string;
  cpu_series: string;
  cpu_model: string;
  cpu_core_count: number;
  cpu_thread_count: number;
  ram_gb: number;
  storage_gb: number;
  display_size_inch: number;
  display_width_px: number;
  display_height_px: number;
  gpu_brand: string;
  gpu_series: string;
  gpu_model: string;
  gpu_type: string;
  gpu_vram_gb: number;
  os_name: string;
  warranty_years: number;
  asking_price_inr?: number;
  condition?: ConditionInput;
}

export interface FeatureDriver {
  feature: string;
  shap_value: number;
  direction: 'increases_price' | 'decreases_price';
}

export interface DealAssessment {
  asking_price_inr: number;
  difference_inr: number;
  difference_percentage: number;
  verdict: 'GREAT_DEAL' | 'FAIR_PRICE' | 'SLIGHTLY_OVERPRICED' | 'SIGNIFICANTLY_OVERPRICED';
  verdict_label: string;
  badge_color: 'emerald' | 'blue' | 'amber' | 'red';
}

export interface UsedValuationInfo {
  is_used: boolean;
  depreciation_percentage: number;
  adjusted_valuation_inr: number;
  breakdown: {
    age_depreciation_pct: number;
    battery_penalty_pct: number;
    cosmetic_penalty_pct: number;
    screen_penalty_pct: number;
    warranty_bonus_pct: number;
  };
  disclaimer: string;
}

export interface ValuationResponse {
  valuation_inr: number;
  new_price_baseline_inr: number;
  price_range_low_inr: number;
  price_range_high_inr: number;
  model_name: string;
  model_r2_score: number;
  used_valuation?: UsedValuationInfo | null;
  deal_assessment?: DealAssessment | null;
  key_drivers: FeatureDriver[];
  data_provenance_note: string;
}

export interface ModelComparisonRow {
  model_name: string;
  test_r2: number;
  test_mae_inr: number;
  test_rmse_inr: number;
  test_mape_pct: number;
  cv_r2_mean: number;
  cv_r2_std: number;
  cv_mae_mean: number;
  group_cv_r2_mean: number;
  group_cv_mae_mean: number;
  is_best: boolean;
}

export interface PriceTierMetric {
  tier_name: string;
  count: number;
  percentage_of_test_set: number;
  mae_inr: number;
  r2_score: number;
  mape_percentage: number;
}

export interface FeatureImportanceItem {
  feature: string;
  importance: number;
  percentage: number;
  method: string;
}

export interface PredictionScatterPoint {
  index: number;
  actual_inr: number;
  predicted_inr: number;
  residual_inr: number;
  error_percentage: number;
}

export interface ModelMetricsResponse {
  evaluation_summary: {
    selected_model: string;
    dataset_name: string;
    dataset_samples: number;
    train_samples: number;
    test_samples: number;
    target_variable: string;
    r2_target_met: boolean;
    metrics: {
      r2_score: number;
      mae_inr: number;
      rmse_inr: number;
      median_ae_inr: number;
      mape_percentage: number;
      max_error_inr: number;
      sample_count: number;
    };
    cross_validation: {
      r2_mean: number;
      r2_std: number;
      mae_mean: number;
    };
    group_cross_validation: {
      r2_mean: number;
      r2_std: number;
      mae_mean: number;
    };
    price_tier_performance: PriceTierMetric[];
  };
  model_comparison: {
    comparison_table: ModelComparisonRow[];
    best_model_name: string;
    key_takeaways: string[];
  };
  feature_importances: FeatureImportanceItem[];
  shap_summary: {
    status: string;
    top_shap_features: Array<{ feature: string; impact_inr: number }>;
  };
  test_prediction_points: PredictionScatterPoint[];
  dataset_overview: {
    compatibility_matrix: any;
    inspected_count: number;
  };
}

// Repair Intelligence Types
export interface AlternativeFault {
  fault_type: string;
  confidence_score: number;
  confidence_percentage: number;
}

export interface DiagnosisResponse {
  status: 'CONFIDENT_DIAGNOSIS' | 'LOW_CONFIDENCE' | 'INSUFFICIENT_INPUT';
  is_confident: boolean;
  primary_fault: string | null;
  confidence_score: number;
  confidence_percentage: number;
  alternatives: AlternativeFault[];
  influential_keywords: string[];
  suggested_checks: string[];
  input_symptom: string;
  disclaimer: string;
}

export interface CostRange {
  min: number;
  max: number;
}

export interface RepairPricingRecord {
  record_id: string;
  laptop_brand: string;
  laptop_model_or_compatible_category: string;
  component: string;
  repair_type: string;
  part_description: string;
  part_price_min: number;
  part_price_max: number;
  labour_min: number;
  labour_max: number;
  currency: string;
  market_location: string;
  source_name: string;
  source_url: string;
  source_type: string;
  date_collected: string;
  verification_status: string;
  notes: string;
}

export interface RepairPricingEstimate {
  found: boolean;
  component?: string;
  currency?: string;
  part_cost_range?: CostRange;
  labour_cost_range?: CostRange;
  total_estimated_range?: CostRange;
  representative_matches?: RepairPricingRecord[];
  primary_source?: string;
  market_location?: string;
  message?: string;
}

export interface QuoteEvaluationResponse {
  success: boolean;
  quoted_price?: number;
  verdict?: 'BELOW_REFERENCE' | 'FAIR_AND_COMPETITIVE' | 'SLIGHTLY_ABOVE_REFERENCE' | 'SIGNIFICANTLY_ABOVE_REFERENCE';
  verdict_label?: string;
  badge_color?: 'emerald' | 'amber' | 'orange' | 'rose';
  benchmark_range?: { min: number; max: number; midpoint: number };
  variance?: { difference_inr: number; percentage: number };
  parts_benchmark?: CostRange;
  labour_benchmark?: CostRange;
  market_location?: string;
  primary_source?: string;
  explanation?: string;
  suggested_questions?: string[];
  message?: string;
}

export interface RepairDecisionResponse {
  success: boolean;
  verdict?: 'REPAIR_RECOMMENDED' | 'BORDERLINE_EVALUATE' | 'BORDERLINE_LEAN_REPLACE' | 'REPLACEMENT_RECOMMENDED';
  verdict_label?: string;
  badge_color?: 'emerald' | 'amber' | 'orange' | 'rose';
  repair_cost_ratio?: number;
  repair_cost_ratio_pct?: number;
  economic_summary?: string;
  decision_factors?: string[];
  financial_breakdown?: {
    repair_cost_inr: number;
    device_market_value_inr: number;
    repair_cost_ratio_pct: number;
    net_equity_after_repair_inr: number;
    device_age_years?: number;
    device_condition?: string;
  };
  valuation_source?: string;
  error?: string;
}

export interface DiagnosisMetricsResponse {
  model_name: string;
  pipeline_version: string;
  dataset_name: string;
  total_samples: number;
  train_samples: number;
  test_samples: number;
  num_classes: number;
  classes: string[];
  model_comparison: Record<string, {
    cv_macro_f1_mean: number;
    cv_macro_f1_std: number;
    cv_accuracy_mean: number;
  }>;
  test_metrics: {
    accuracy: number;
    macro_f1: number;
    weighted_f1: number;
    macro_precision: number;
    macro_recall: number;
  };
  per_class_metrics: Record<string, {
    precision: number;
    recall: number;
    f1_score: number;
    support: number;
  }>;
  confusion_matrix: number[][];
  top_keywords_per_class: Record<string, string[]>;
}
