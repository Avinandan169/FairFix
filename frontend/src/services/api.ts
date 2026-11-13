import {
  LaptopSpecsInput,
  ValuationResponse,
  ModelMetricsResponse
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
