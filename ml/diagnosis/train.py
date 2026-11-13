"""
Machine Learning Training Pipeline for Laptop Fault Diagnosis.

Dataset: Open Repair Alliance (ORA) CompCat Cleaned Records (2,404 samples, 17 classes).
Models Evaluated:
- Multinomial Naive Bayes
- Logistic Regression (Balanced)
- Linear Support Vector Classifier (LinearSVC)
- Calibrated LinearSVC (Platt / Isotonic Calibration)
- Random Forest Classifier

Exports:
- artifacts/models/fault_classifier.joblib (Trained pipeline: TF-IDF + Calibrated Classifier)
- artifacts/metrics/diagnosis_metrics.json (Comprehensive evaluation telemetry)
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix,
)

DATA_PATH = "datasets/processed/repair/laptop_faults_cleaned.csv"
MODEL_OUTPUT_PATH = "artifacts/models/fault_classifier.joblib"
METRICS_OUTPUT_PATH = "artifacts/metrics/diagnosis_metrics.json"


def train_and_evaluate_diagnosis():
    print("=" * 70)
    print("FAIRFIX ML — LAPTOP FAULT DIAGNOSIS MODEL TRAINING")
    print("=" * 70)

    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Processed dataset not found at {DATA_PATH}. Run preprocess.py first.")

    df = pd.read_csv(DATA_PATH)
    print(f"Loaded dataset: {len(df)} samples across {df['fault_type'].nunique()} fault categories.")

    X = df["problem_description"].astype(str)
    y = df["fault_type"].astype(str)

    # 80/20 Stratified Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"Train samples: {len(X_train)} | Test samples: {len(X_test)}")

    # Model Candidate Definitions
    candidates = {
        "Multinomial_NB": Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), max_features=4000, sublinear_tf=True, stop_words="english", min_df=2)),
            ("clf", MultinomialNB(alpha=0.2))
        ]),
        "Logistic_Regression": Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), max_features=4000, sublinear_tf=True, stop_words="english", min_df=2)),
            ("clf", LogisticRegression(C=1.5, max_iter=1000, class_weight="balanced", random_state=42))
        ]),
        "Linear_SVC": Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), max_features=4000, sublinear_tf=True, stop_words="english", min_df=2)),
            ("clf", LinearSVC(C=1.0, class_weight="balanced", random_state=42))
        ]),
        "Calibrated_Linear_SVC": Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), max_features=4000, sublinear_tf=True, stop_words="english", min_df=2)),
            ("clf", CalibratedClassifierCV(
                estimator=LinearSVC(C=1.0, class_weight="balanced", random_state=42),
                method="sigmoid",
                cv=3
            ))
        ]),
        "Random_Forest": Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), max_features=4000, sublinear_tf=True, stop_words="english", min_df=2)),
            ("clf", RandomForestClassifier(n_estimators=150, max_depth=25, class_weight="balanced", random_state=42))
        ])
    }

    # Cross-validation comparison
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    comparison_results = {}
    print("\n--- 5-Fold Stratified Cross-Validation on Training Set ---")

    for name, pipeline in candidates.items():
        macro_f1_scores = cross_val_score(pipeline, X_train, y_train, cv=cv, scoring="f1_macro", n_jobs=-1)
        acc_scores = cross_val_score(pipeline, X_train, y_train, cv=cv, scoring="accuracy", n_jobs=-1)
        mean_macro = float(np.mean(macro_f1_scores))
        std_macro = float(np.std(macro_f1_scores))
        mean_acc = float(np.mean(acc_scores))

        comparison_results[name] = {
            "cv_macro_f1_mean": round(mean_macro, 4),
            "cv_macro_f1_std": round(std_macro, 4),
            "cv_accuracy_mean": round(mean_acc, 4)
        }
        print(f"{name:<25}: CV Macro F1 = {mean_macro:.4f} (+/- {std_macro:.4f}) | CV Acc = {mean_acc:.4f}")

    # Select Winning Model (Calibrated Linear SVC for optimal calibrated probabilities & high F1)
    best_candidate_name = "Calibrated_Linear_SVC"
    best_pipeline = candidates[best_candidate_name]

    print(f"\nFitting winning model: {best_candidate_name} on entire training split...")
    best_pipeline.fit(X_train, y_train)

    # Test Set Predictions & Evaluation
    y_pred = best_pipeline.predict(X_test)
    y_proba = best_pipeline.predict_proba(X_test)

    test_acc = accuracy_score(y_test, y_pred)
    macro_f1 = f1_score(y_test, y_pred, average="macro", zero_division=0)
    weighted_f1 = f1_score(y_test, y_pred, average="weighted", zero_division=0)
    macro_precision = precision_score(y_test, y_pred, average="macro", zero_division=0)
    macro_recall = recall_score(y_test, y_pred, average="macro", zero_division=0)

    print("\n--- Held-Out Test Set Performance (20% Split) ---")
    print(f"Accuracy:         {test_acc:.4f} ({test_acc * 100:.2f}%)")
    print(f"Macro F1:         {macro_f1:.4f}")
    print(f"Weighted F1:      {weighted_f1:.4f}")
    print(f"Macro Precision:  {macro_precision:.4f}")
    print(f"Macro Recall:     {macro_recall:.4f}")

    unique_classes = sorted(list(best_pipeline.classes_))
    clf_report = classification_report(y_test, y_pred, output_dict=True, zero_division=0)
    cm = confusion_matrix(y_test, y_pred, labels=unique_classes)

    # Per-class summary
    per_class_metrics = {}
    for cls in unique_classes:
        if cls in clf_report:
            per_class_metrics[cls] = {
                "precision": round(float(clf_report[cls]["precision"]), 4),
                "recall": round(float(clf_report[cls]["recall"]), 4),
                "f1_score": round(float(clf_report[cls]["f1-score"]), 4),
                "support": int(clf_report[cls]["support"])
            }

    # Extract Top Indicative Keywords per class using LinearSVC coefficients from an uncalibrated counterpart
    aux_svc = LinearSVC(C=1.0, class_weight="balanced", random_state=42)
    tfidf = best_pipeline.named_steps["tfidf"]
    X_train_tfidf = tfidf.transform(X_train)
    aux_svc.fit(X_train_tfidf, y_train)

    feature_names = np.array(tfidf.get_feature_names_out())
    top_keywords_per_class = {}
    for idx, cls in enumerate(aux_svc.classes_):
        top_indices = aux_svc.coef_[idx].argsort()[-8:][::-1]
        top_keywords_per_class[cls] = feature_names[top_indices].tolist()

    # Save model artifact
    os.makedirs(os.path.dirname(MODEL_OUTPUT_PATH), exist_ok=True)
    joblib.dump(best_pipeline, MODEL_OUTPUT_PATH)
    print(f"\nModel artifact serialized to: {MODEL_OUTPUT_PATH}")

    # Build Comprehensive Metrics Record
    metrics_payload = {
        "model_name": "Calibrated Linear SVC (TF-IDF)",
        "pipeline_version": "1.0.0",
        "dataset_name": "Open Repair Alliance (CompCat Laptops)",
        "total_samples": len(df),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "num_classes": len(unique_classes),
        "classes": unique_classes,
        "model_comparison": comparison_results,
        "test_metrics": {
            "accuracy": round(float(test_acc), 4),
            "macro_f1": round(float(macro_f1), 4),
            "weighted_f1": round(float(weighted_f1), 4),
            "macro_precision": round(float(macro_precision), 4),
            "macro_recall": round(float(macro_recall), 4)
        },
        "per_class_metrics": per_class_metrics,
        "confusion_matrix": cm.tolist(),
        "top_keywords_per_class": top_keywords_per_class
    }

    os.makedirs(os.path.dirname(METRICS_OUTPUT_PATH), exist_ok=True)
    with open(METRICS_OUTPUT_PATH, "w") as f:
        json.dump(metrics_payload, f, indent=2)
    print(f"Metrics payload serialized to: {METRICS_OUTPUT_PATH}")
    print("=" * 70)


if __name__ == "__main__":
    train_and_evaluate_diagnosis()
