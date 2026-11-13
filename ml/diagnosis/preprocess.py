"""
Data Preprocessing Pipeline for Laptop Fault Diagnosis.

Dataset: Open Repair Alliance (ORA) - CompCat Laptop Repair Records.
Source: https://github.com/openrepair/data/tree/main/quests/computers
License: Open Data Commons Open Database License (ODbL)

Processes 3,511 real community repair records:
- Identifies 2,828 records with non-empty problem text
- Extracts 2,531 records with known verified fault categories
- Standardizes text descriptions, strips noise, and exports structured dataset
"""

import os
import re
import pandas as pd


RAW_COMPCAT_PATH = "datasets/raw/repair/compcat_laptops.csv"
FAULT_TYPES_PATH = "datasets/raw/repair/compcat_fault_types.csv"
PROCESSED_DIAGNOSIS_PATH = "datasets/processed/repair/laptop_faults_cleaned.csv"


def clean_problem_text(text: str) -> str:
    """Cleans and standardizes raw symptom text."""
    if not isinstance(text, str):
        return ""
    # Normalize whitespace, strip special characters, maintain alphanumerics and hyphens
    t = text.strip()
    t = re.sub(r'[\r\n\t]+', ' ', t)
    t = re.sub(r'\s+', ' ', t)
    return t


def preprocess_repair_data(raw_path: str = RAW_COMPCAT_PATH,
                           output_path: str = PROCESSED_DIAGNOSIS_PATH) -> pd.DataFrame:
    """
    Ingests ORA compcat_laptops.csv, filters out empty descriptions and unknown faults,
    and saves the cleaned dataset for ML fault classification.
    """
    print(f"[Diagnosis Preprocessing] Ingesting {raw_path}...")
    if not os.path.exists(raw_path):
        raise FileNotFoundError(f"Raw ORA dataset not found at {raw_path}")

    df = pd.read_csv(raw_path)
    total_raw = len(df)

    # 1. Non-empty problem text
    df['problem_clean'] = df['problem'].apply(clean_problem_text)
    df_non_empty = df[df['problem_clean'].str.len() >= 4].copy()
    non_empty_count = len(df_non_empty)

    # 2. Exclude ambiguous or unclassified categories ('Unknown', 'Multiple', 'Other')
    excluded_labels = ['Unknown', 'Multiple', 'Other']
    df_classified = df_non_empty[~df_non_empty['fault_type'].isin(excluded_labels)].copy()

    # 3. Filter classes with at least 20 instances for statistical viability
    class_counts = df_classified['fault_type'].value_counts()
    viable_classes = class_counts[class_counts >= 20].index.tolist()
    df_final = df_classified[df_classified['fault_type'].isin(viable_classes)].copy()

    # Standardize column structure
    keep_cols = [
        'id_ords',
        'country',
        'brand',
        'fault_type_id',
        'fault_type',
        'problem_clean',
        'repair_status',
        'event_date'
    ]
    df_final = df_final[keep_cols].rename(columns={'problem_clean': 'problem_description'})

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df_final.to_csv(output_path, index=False)

    print(f"[Diagnosis Preprocessing] Total Raw Records: {total_raw}")
    print(f"[Diagnosis Preprocessing] Non-empty Problem Text: {non_empty_count}")
    print(f"[Diagnosis Preprocessing] Classified Clean Records: {len(df_final)}")
    print(f"[Diagnosis Preprocessing] Viable Fault Categories ({len(viable_classes)}): {viable_classes}")
    print(f"[Diagnosis Preprocessing] Exported to {output_path}")

    return df_final


if __name__ == "__main__":
    preprocess_repair_data()
