"""
Feature Engineering Module for FAIRFIX.

Extracts domain-driven hardware features for laptop price intelligence:
- CPU Generation and Architecture classification (Intel Core Ultra, 12th-14th Gen, AMD Ryzen 5000-9000, Apple M-Series)
- Display density (PPI), total pixel count, and aspect ratio
- GPU categorization (Dedicated vs Integrated, VRAM allocation, GPU tier)
- Brand market positioning tiers
- Model grouping identifier for strict grouped cross-validation
"""

import re
import numpy as np
import pandas as pd


def parse_cpu_generation(row: pd.Series) -> str:
    """Parses CPU generation or architectural family from brand, family, series, and model."""
    cpu_brand = str(row.get('cpu_brand', '')).strip()
    cpu_fam = str(row.get('cpu_family', '')).strip()
    cpu_ser = str(row.get('cpu_series', '')).strip()
    cpu_mod = str(row.get('cpu_model', '')).strip()

    if cpu_brand == 'Apple':
        for m in ['M4', 'M3', 'M2', 'M1']:
            if m in cpu_mod or m in cpu_ser:
                return f'Apple {m}'
        return 'Apple Silicon'

    if 'Ultra' in cpu_fam or 'Ultra' in cpu_ser:
        if cpu_mod.startswith('2'):
            return 'Intel Core Ultra Series 2'
        return 'Intel Core Ultra Series 1'

    if cpu_brand == 'AMD':
        m = re.search(r'(\d)\d{3}', cpu_mod)
        if m:
            return f'AMD Ryzen {m.group(1)}000'
        return 'AMD Ryzen Other'

    if cpu_brand == 'Intel':
        m = re.match(r'^(\d+)', cpu_mod)
        if m:
            digits = m.group(1)
            if len(digits) == 5:
                return f'Intel {digits[:2]}th Gen'
            elif len(digits) == 4:
                prefix = digits[:2]
                if prefix in ['10', '11', '12', '13', '14']:
                    return f'Intel {prefix}th Gen'
                else:
                    return f'Intel {digits[0]}th Gen'
            elif len(digits) == 3:
                return f'Intel Core Series {digits[0]}'
        return 'Intel Celeron/Pentium/Other'

    return 'Other / ARM'


def assign_brand_tier(brand: str) -> str:
    """Categorizes laptop manufacturers into market positioning segments."""
    brand_lower = str(brand).strip().lower()
    if brand_lower in ['apple', 'alienware']:
        return 'Ultra-Premium'
    elif brand_lower in ['msi', 'asus', 'samsung']:
        return 'Performance'
    elif brand_lower in ['lenovo', 'hp', 'dell', 'acer', 'gigabyte']:
        return 'Mainstream'
    else:
        return 'Budget / Entry'


def extract_model_family(row: pd.Series) -> str:
    """Extracts base product model family to prevent configuration leakage during grouped CV."""
    brand = str(row.get('brand', '')).strip().lower()
    model = str(row.get('model', '')).strip()
    words = model.split()
    base_name = '_'.join(words[:3]) if len(words) >= 3 else model
    return f"{brand}_{base_name}".lower()


def apply_feature_engineering(df: pd.DataFrame) -> pd.DataFrame:
    """
    Applies comprehensive feature transformations to the laptop dataset.
    Returns a new DataFrame with engineered attributes.
    """
    df = df.copy()

    # 1. Clean categorical text
    str_cols = ['brand', 'device_category', 'cpu_brand', 'cpu_family', 'cpu_series', 'gpu_brand', 'gpu_series', 'os_name']
    for col in str_cols:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip()

    # 2. GPU handling
    if 'gpu_vram_gb' in df.columns:
        df['gpu_vram_gb'] = pd.to_numeric(df['gpu_vram_gb'], errors='coerce').fillna(0.0)
    else:
        df['gpu_vram_gb'] = 0.0

    if 'gpu_type' in df.columns:
        df['gpu_type'] = df['gpu_type'].fillna('Integrated').replace({'nan': 'Integrated'})
        df['is_dedicated_gpu'] = (df['gpu_type'].str.lower() == 'dedicated').astype(int)
    else:
        df['is_dedicated_gpu'] = 0

    if 'gpu_brand' in df.columns:
        df['gpu_brand'] = df['gpu_brand'].fillna('Integrated').replace({'nan': 'Integrated'})
    if 'gpu_series' in df.columns:
        df['gpu_series'] = df['gpu_series'].fillna('Integrated').replace({'nan': 'Integrated'})

    # 3. Display feature engineering
    if 'display_width_px' in df.columns and 'display_height_px' in df.columns:
        w = pd.to_numeric(df['display_width_px'], errors='coerce').fillna(1920)
        h = pd.to_numeric(df['display_height_px'], errors='coerce').fillna(1080)
        diag = pd.to_numeric(df.get('display_size_inch', 15.6), errors='coerce').fillna(15.6)
        # Avoid division by zero
        diag = np.where(diag <= 0, 15.6, diag)

        df['total_pixels'] = w * h
        df['ppi'] = np.sqrt(w**2 + h**2) / diag
        df['display_aspect_ratio'] = np.round(w / np.where(h <= 0, 1080, h), 2)
    else:
        df['total_pixels'] = 1920 * 1080
        df['ppi'] = 141.2
        df['display_aspect_ratio'] = 1.78

    # 4. CPU Generation extraction
    df['cpu_generation'] = df.apply(parse_cpu_generation, axis=1)

    # 5. Core structure features
    core_cnt = pd.to_numeric(df.get('cpu_core_count', 8), errors='coerce').fillna(8)
    thread_cnt = pd.to_numeric(df.get('cpu_thread_count', 8), errors='coerce').fillna(8)
    df['threads_per_core'] = np.round(thread_cnt / np.where(core_cnt <= 0, 1, core_cnt), 2)

    # 6. Memory & Storage ratios
    ram = pd.to_numeric(df.get('ram_gb', 16), errors='coerce').fillna(16)
    storage = pd.to_numeric(df.get('storage_gb', 512), errors='coerce').fillna(512)
    df['ram_storage_ratio'] = np.round(ram / np.where(storage <= 0, 512, storage), 4)

    # 7. Brand Tier
    df['brand_tier'] = df['brand'].apply(assign_brand_tier)

    # 8. Model family grouping (used strictly for leak-free GroupKFold CV)
    df['model_family_group'] = df.apply(extract_model_family, axis=1)

    return df
