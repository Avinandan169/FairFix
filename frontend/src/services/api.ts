import {
  LaptopSpecsInput,
  ValuationResponse,
  ModelMetricsResponse,
  DiagnosisResponse,
  RepairPricingEstimate,
  QuoteEvaluationResponse,
  RepairDecisionResponse,
  DiagnosisMetricsResponse,
  RepairPricingRecord
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function predictValuation(specs: LaptopSpecsInput): Promise<ValuationResponse> {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(specs),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API Error (${response.status}): ${errText}`);
  }

  return response.json();
}

export async function getModelMetrics(): Promise<ModelMetricsResponse> {
  const response = await fetch(`${API_BASE_URL}/model-metrics`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch model metrics (${response.status})`);
  }

  return response.json();
}

export async function getDropdownOptions() {
  const response = await fetch(`${API_BASE_URL}/options`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch dropdown options (${response.status})`);
  }

  return response.json();
}

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (res.ok) return await res.json();
    return null;
  } catch {
    return null;
  }
}

// Repair Intelligence API Endpoints
export async function predictDiagnosis(
  symptom_description: string,
  brand?: string,
  model?: string
): Promise<DiagnosisResponse> {
  const response = await fetch(`${API_BASE_URL}/diagnosis/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ symptom_description, brand, model }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Diagnosis error (${response.status}): ${err}`);
  }

  return response.json();
}

export async function getDiagnosisMetrics(): Promise<DiagnosisMetricsResponse> {
  const response = await fetch(`${API_BASE_URL}/diagnosis/metrics`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch diagnosis metrics (${response.status})`);
  }

  return response.json();
}

export async function getRepairPricingOptions(): Promise<{
  components: string[];
  repair_types: string[];
  brands: string[];
}> {
  const response = await fetch(`${API_BASE_URL}/repair/pricing/options`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch pricing options (${response.status})`);
  }

  return response.json();
}

export async function getRepairPricing(component?: string): Promise<RepairPricingRecord[]> {
  const url = component
    ? `${API_BASE_URL}/repair/pricing?component=${encodeURIComponent(component)}`
    : `${API_BASE_URL}/repair/pricing`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch repair pricing catalogue (${response.status})`);
  }

  return response.json();
}

export async function estimateRepairCost(
  component: string,
  repair_type?: string,
  brand?: string,
  record_id?: string
): Promise<RepairPricingEstimate> {
  const response = await fetch(`${API_BASE_URL}/repair/estimate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ component, repair_type, brand, record_id }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Repair estimate error (${response.status}): ${err}`);
  }

  return response.json();
}

export async function evaluateTechnicianQuote(
  quoted_price: number,
  component: string,
  repair_type?: string,
  brand?: string,
  record_id?: string
): Promise<QuoteEvaluationResponse> {
  const response = await fetch(`${API_BASE_URL}/repair/evaluate-quote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quoted_price, component, repair_type, brand, record_id }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Quote evaluation error (${response.status}): ${err}`);
  }

  return response.json();
}

export async function evaluateRepairDecision(payload: {
  repair_cost: number;
  device_market_value?: number;
  laptop_specs?: any;
  device_age_years?: number;
  device_condition?: string;
  component?: string;
}): Promise<RepairDecisionResponse> {
  const response = await fetch(`${API_BASE_URL}/repair/decision`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Decision analysis error (${response.status}): ${err}`);
  }

  return response.json();
}
