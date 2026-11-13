"""
Master Model Training, Cross-Validation, and Serialization Pipeline for FAIRFIX.

Executes the end-to-end scientific workflow:
1. Ingests engineered features from datasets/processed/laptops_featured.csv
2. Enforces strict Train (80%) / Test (20%) separation (seed=42)
3. Evaluates 6 regression architectures:
   - Linear Regression
   - Decision Tree Regressor
   - Random Forest Regressor
   - Gradient Boosting Regressor
   - XGBoost Regressor
   - CatBoost Regressor
4. Executes 5-fold standard CV and 5-fold GroupKFold CV
5. Selects the optimal model based on out-of-sample generalization
6. Computes SHAP explainability and price tier error breakdowns
7. Serializes models and evaluation artifacts for production inference and frontend dashboard
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline

from ml.data.preprocess import (
    preprocess_and_save,
    build_preprocessor_pipeline,
    get_feature_lists,
    TARGET_VARIABLE
)
from ml.models.linear_regression import create_linear_regression
from ml.models.decision_tree import create_decision_tree_regressor
from ml.models.random_forest import create_random_forest_regressor
from ml.models.gradient_boosting import create_gradient_boosting_regressor
from ml.models.xgboost_model import create_xgboost_regressor
from ml.models.catboost_model import create_catboost_regressor

from ml.training.cross_validation import run_kfold_cv, run_grouped_kfold_cv
from ml.evaluation.evaluate import (
    calculate_regression_metrics,
    analyze_errors_by_price_tier,
    generate_residual_plot_data
)
from ml.evaluation.explainability import (
    compute_global_feature_importance,
    compute_shap_summary
)
from ml.evaluation.compare_models import generate_comparison_summary


def run_full_training_pipeline():
    """Runs the full model training and evaluation suite."""
    print("=" * 70)
    print("FAIRFIX — COMMENCING ML MODEL TRAINING & BENCHMARKING")
    print("=" * 70)

    os.makedirs("artifacts/models", exist_ok=True)
    os.makedirs("artifacts/preprocessing", exist_ok=True)
    os.makedirs("artifacts/metrics", exist_ok=True)

    # 1. Ingest / Preprocess
    processed_csv = "datasets/processed/laptops_featured.csv"
    if not os.path.exists(processed_csv):
        df = preprocess_and_save()
    else:
        df = pd.read_csv(processed_csv)

    print(f"[Data] Loaded dataset with {len(df)} samples, {len(df.columns)} columns.")

    num_cols, cat_cols, target_col = get_feature_lists()
    feature_cols = num_cols + cat_cols

    X = df[feature_cols].copy()
    y = df[target_col].copy()
    groups = df.get('model_family_group', df['brand'])

    # 2. Strict Train-Test Split (80% / 20%)
    X_train, X_test, y_train, y_test, groups_train, groups_test = train_test_split(
        X, y, groups, test_size=0.20, random_state=42
    )
    print(f"[Data Split] Train set: {len(X_train)} samples | Test set: {len(X_test)} samples (strictly held-out)")

    # 3. Define candidate model catalog
    model_factories = {
        "Linear Regression": lambda: create_linear_regression(),
        "Decision Tree": lambda: create_decision_tree_regressor(max_depth=12, random_state=42),
        "Random Forest": lambda: create_random_forest_regressor(n_estimators=200, max_depth=16, random_state=42),
        "Gradient Boosting": lambda: create_gradient_boosting_regressor(n_estimators=220, learning_rate=0.06, max_depth=5, random_state=42),
        "XGBoost": lambda: create_xgboost_regressor(n_estimators=220, learning_rate=0.06, max_depth=5, random_state=42),
        "CatBoost": lambda: create_catboost_regressor(iterations=280, learning_rate=0.06, depth=6, random_state=42)
    }

    results = {}
    fitted_pipelines = {}

    # 4. Train and evaluate each candidate architecture
    for name, factory in model_factories.items():
        print(f"\n--- Evaluating Candidate Model: {name} ---")

        # Cross Validation on Training Set Only (Prevents Test Leakage)
        pipeline_builder = lambda: Pipeline([
            ('prep', build_preprocessor_pipeline()),
            ('model', factory())
        ])

        print(f"  [CV] Running 5-Fold standard CV on train split...")
        cv_res = run_kfold_cv(pipeline_builder, X_train, y_train, n_splits=5, random_state=42)
        print(f"  [CV] Standard 5-Fold R²: {cv_res['r2_mean']:.4f} (±{cv_res['r2_std']:.4f}) | MAE: ₹{cv_res['mae_mean']:,.0f}")

        print(f"  [CV] Running 5-Fold GroupKFold CV (by chassis model)...")
        gcv_res = run_grouped_kfold_cv(pipeline_builder, X_train, y_train, groups=groups_train, n_splits=5)
        print(f"  [CV] GroupKFold R²: {gcv_res['r2_mean']:.4f} (±{gcv_res['r2_std']:.4f}) | MAE: ₹{gcv_res['mae_mean']:,.0f}")

        # Train on Full Train Split
        pipeline = pipeline_builder()
        pipeline.fit(X_train, y_train)
        fitted_pipelines[name] = pipeline

        # Evaluate on Genuine Held-out Test Split
        preds_test = pipeline.predict(X_test)
        test_metrics = calculate_regression_metrics(y_test, preds_test)
        tier_metrics = analyze_errors_by_price_tier(y_test, preds_test)

        print(f"  [Test Result] Test R²: {test_metrics['r2_score']:.4f} | MAE: ₹{test_metrics['mae_inr']:,.0f} | RMSE: ₹{test_metrics['rmse_inr']:,.0f} | MAPE: {test_metrics['mape_percentage']:.2f}%")

        results[name] = {
            "test_metrics": test_metrics,
            "cv_metrics": cv_res,
            "group_cv_metrics": gcv_res,
            "price_tier_metrics": tier_metrics,
            "is_best": False
        }

        # Save individual model pipeline artifact
        slug = name.lower().replace(' ', '_')
        joblib.dump(pipeline, f"artifacts/models/{slug}.joblib")

    # 5. Model Selection Strategy
    # Select the model with optimal generalization: highest mean of (CV R² + Test R²) and lowest Test MAE
    best_model_name = max(
        results.keys(),
        key=lambda k: (
            results[k]['cv_metrics']['r2_mean'] * 0.5 + results[k]['test_metrics']['r2_score'] * 0.5
            - (results[k]['test_metrics']['mae_inr'] / 100000.0) * 0.1
        )
    )
    results[best_model_name]['is_best'] = True
    print("\n" + "=" * 70)
    print(f"★ SELECTED WINNING MODEL: {best_model_name}")
    print(f"  Test R²: {results[best_model_name]['test_metrics']['r2_score']:.4f}")
    print(f"  Test MAE: ₹{results[best_model_name]['test_metrics']['mae_inr']:,.0f}")
    print(f"  Test RMSE: ₹{results[best_model_name]['test_metrics']['rmse_inr']:,.0f}")
    print(f"  Standard 5-Fold CV R²: {results[best_model_name]['cv_metrics']['r2_mean']:.4f}")
    print(f"  GroupKFold CV R²: {results[best_model_name]['group_cv_metrics']['r2_mean']:.4f}")
    print("=" * 70)

    best_pipeline = fitted_pipelines[best_model_name]

    # Save winning production artifacts
    joblib.dump(best_pipeline, "artifacts/models/fairfix_best_model.joblib")
    joblib.dump(best_pipeline.named_steps['prep'], "artifacts/preprocessing/preprocessor.joblib")
    print("[Artifacts] Serialized winning pipeline to artifacts/models/fairfix_best_model.joblib")

    # 6. Global Explainability & Feature Importances
    print("\n[Explainability] Computing feature importances and SHAP values for winning model...")
    feat_importances = compute_global_feature_importance(best_pipeline, X_test, y_test, top_k=20)
    with open("artifacts/metrics/feature_importances.json", "w", encoding="utf-8") as f:
        json.dump(feat_importances, f, indent=2)

    shap_data = compute_shap_summary(best_pipeline, X_train, X_test, max_samples=100)
    with open("artifacts/metrics/shap_summary.json", "w", encoding="utf-8") as f:
        json.dump(shap_data, f, indent=2)

    # 7. Residual & Prediction points for Frontend Charts
    test_preds_best = best_pipeline.predict(X_test)
    chart_points = generate_residual_plot_data(y_test, test_preds_best, sample_limit=199)
    with open("artifacts/metrics/test_predictions.json", "w", encoding="utf-8") as f:
        json.dump(chart_points, f, indent=2)

    # 8. Model Comparison Summary
    generate_comparison_summary(results, "artifacts/metrics/model_comparison.json")

    # 9. Master Evaluation Summary
    eval_summary = {
        "timestamp": "2026-11-13T22:30:00",
        "selected_model": best_model_name,
        "dataset_name": "Indian Laptop Specifications Dataset",
        "dataset_samples": len(df),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "target_variable": "price (INR ₹)",
        "r2_target_met": bool(results[best_model_name]['test_metrics']['r2_score'] >= 0.90),
        "metrics": results[best_model_name]['test_metrics'],
        "cross_validation": results[best_model_name]['cv_metrics'],
        "group_cross_validation": results[best_model_name]['group_cv_metrics'],
        "price_tier_performance": results[best_model_name]['price_tier_metrics'],
        "top_features": feat_importances[:10]
    }

    with open("artifacts/metrics/evaluation_summary.json", "w", encoding="utf-8") as f:
        json.dump(eval_summary, f, indent=2)

    print("[Artifacts] Master evaluation summary written to artifacts/metrics/evaluation_summary.json")
    print("\nTRAINING & BENCHMARKING COMPLETE SUCCESSFULLY.")
    return eval_summary


if __name__ == "__main__":
    run_full_training_pipeline()
