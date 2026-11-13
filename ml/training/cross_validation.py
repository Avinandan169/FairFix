"""
Cross-Validation Module for FAIRFIX.

Executes both:
1. Standard 5-Fold Stratified/Random Cross-Validation (KFold)
2. Strict Group-Aware Cross-Validation (GroupKFold) grouped by laptop model family

Grouped validation strictly prevents identical or sister laptop configurations
(e.g. Lenovo Legion Pro 5 variants) from appearing in both train and validation folds,
providing a realistic evaluation of performance on entirely novel laptop designs.
"""

import numpy as np
import pandas as pd
from sklearn.model_selection import KFold, GroupKFold
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error


def run_kfold_cv(pipeline_builder, X: pd.DataFrame, y: pd.Series, n_splits: int = 5, random_state: int = 42) -> dict:
    """Runs standard K-Fold cross validation and calculates R2, MAE, and RMSE across folds."""
    kf = KFold(n_splits=n_splits, shuffle=True, random_state=random_state)
    r2_scores = []
    mae_scores = []
    rmse_scores = []

    for fold, (train_idx, val_idx) in enumerate(kf.split(X, y)):
        X_train_f, X_val_f = X.iloc[train_idx], X.iloc[val_idx]
        y_train_f, y_val_f = y.iloc[train_idx], y.iloc[val_idx]

        pipe = pipeline_builder()
        pipe.fit(X_train_f, y_train_f)
        preds = pipe.predict(X_val_f)

        r2_scores.append(float(r2_score(y_val_f, preds)))
        mae_scores.append(float(mean_absolute_error(y_val_f, preds)))
        rmse_scores.append(float(np.sqrt(mean_squared_error(y_val_f, preds))))

    return {
        "n_splits": n_splits,
        "type": "Standard K-Fold",
        "r2_mean": round(float(np.mean(r2_scores)), 4),
        "r2_std": round(float(np.std(r2_scores)), 4),
        "mae_mean": round(float(np.mean(mae_scores)), 2),
        "mae_std": round(float(np.std(mae_scores)), 2),
        "rmse_mean": round(float(np.mean(rmse_scores)), 2),
        "rmse_std": round(float(np.std(rmse_scores)), 2),
        "fold_r2": [round(x, 4) for x in r2_scores]
    }


def run_grouped_kfold_cv(pipeline_builder, X: pd.DataFrame, y: pd.Series, groups: pd.Series, n_splits: int = 5) -> dict:
    """Runs GroupKFold cross validation grouped by product model series to measure generalization on unseen chassis."""
    gkf = GroupKFold(n_splits=n_splits)
    r2_scores = []
    mae_scores = []
    rmse_scores = []

    for fold, (train_idx, val_idx) in enumerate(gkf.split(X, y, groups=groups)):
        X_train_f, X_val_f = X.iloc[train_idx], X.iloc[val_idx]
        y_train_f, y_val_f = y.iloc[train_idx], y.iloc[val_idx]

        pipe = pipeline_builder()
        pipe.fit(X_train_f, y_train_f)
        preds = pipe.predict(X_val_f)

        r2_scores.append(float(r2_score(y_val_f, preds)))
        mae_scores.append(float(mean_absolute_error(y_val_f, preds)))
        rmse_scores.append(float(np.sqrt(mean_squared_error(y_val_f, preds))))

    return {
        "n_splits": n_splits,
        "type": "GroupKFold (Model Series Grouping)",
        "r2_mean": round(float(np.mean(r2_scores)), 4),
        "r2_std": round(float(np.std(r2_scores)), 4),
        "mae_mean": round(float(np.mean(mae_scores)), 2),
        "mae_std": round(float(np.std(mae_scores)), 2),
        "rmse_mean": round(float(np.mean(rmse_scores)), 2),
        "rmse_std": round(float(np.std(rmse_scores)), 2),
        "fold_r2": [round(x, 4) for x in r2_scores]
    }
