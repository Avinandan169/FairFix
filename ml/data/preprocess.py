"""
Data Preprocessing Pipeline for FAIRFIX.

Handles:
- Data ingestion from raw source datasets
- Null value imputation following physical hardware principles
- Execution of feature engineering pipeline
- Export of processed tabular data for reproducible ML training
- Construction of Scikit-Learn ColumnTransformer preprocessor
"""

import os
import joblib
import pandas as pd
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

from ml.features.feature_engineering import apply_feature_engineering


NUMERICAL_FEATURES = [
    'cpu_core_count',
    'cpu_thread_count',
    'threads_per_core',
    'ram_gb',
    'storage_gb',
    'ram_storage_ratio',
    'display_size_inch',
    'total_pixels',
    'ppi',
    'display_aspect_ratio',
    'gpu_vram_gb',
    'is_dedicated_gpu',
    'warranty_years'
]

CATEGORICAL_FEATURES = [
    'brand',
    'brand_tier',
    'device_category',
    'cpu_brand',
    'cpu_family',
    'cpu_series',
    'cpu_generation',
    'gpu_brand',
    'gpu_series',
    'os_name'
]

TARGET_VARIABLE = 'price'


def get_feature_lists():
    """Returns the lists of numerical and categorical feature column names."""
    return NUMERICAL_FEATURES.copy(), CATEGORICAL_FEATURES.copy(), TARGET_VARIABLE


def build_preprocessor_pipeline():
    """
    Constructs a ColumnTransformer that scales numerical variables
    and one-hot encodes categorical variables.
    """
    return ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), NUMERICAL_FEATURES),
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), CATEGORICAL_FEATURES)
        ],
        remainder='drop'
    )


def preprocess_and_save(raw_path: str = "datasets/raw/indian_laptop_specs/laptops_cleaned.csv",
                        output_path: str = "datasets/processed/laptops_featured.csv") -> pd.DataFrame:
    """
    Reads the raw cleaned laptop specs, applies feature engineering,
    validates the processed structure, and writes to disk.
    """
    print(f"[Preprocessing] Ingesting dataset from {raw_path}...")
    if not os.path.exists(raw_path):
        raise FileNotFoundError(f"Source dataset not found at {raw_path}")

    df_raw = pd.read_csv(raw_path)
    print(f"[Preprocessing] Raw dataset shape: {df_raw.shape}")

    # Feature Engineering
    df_featured = apply_feature_engineering(df_raw)

    # Validate target variable
    if TARGET_VARIABLE not in df_featured.columns:
        raise ValueError(f"Target column '{TARGET_VARIABLE}' missing from dataset.")

    df_featured[TARGET_VARIABLE] = pd.to_numeric(df_featured[TARGET_VARIABLE], errors='coerce')
    df_featured = df_featured.dropna(subset=[TARGET_VARIABLE]).copy()

    # Fill any remaining NaNs in features
    for col in NUMERICAL_FEATURES:
        if col in df_featured.columns:
            median_val = df_featured[col].median()
            df_featured[col] = df_featured[col].fillna(median_val)
        else:
            df_featured[col] = 0.0

    for col in CATEGORICAL_FEATURES:
        if col in df_featured.columns:
            df_featured[col] = df_featured[col].fillna('Unknown').astype(str)
        else:
            df_featured[col] = 'Unknown'

    # Save processed dataset
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df_featured.to_csv(output_path, index=False)
    print(f"[Preprocessing] Engineered dataset written to {output_path} (Shape: {df_featured.shape})")

    return df_featured


if __name__ == "__main__":
    preprocess_and_save()
