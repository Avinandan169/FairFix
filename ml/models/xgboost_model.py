"""
XGBoost Regressor Model for FAIRFIX.

Purpose:
- State-of-the-art scalable gradient boosted decision trees (GBDT).
- Employs second-order Taylor expansion of the loss function.
- Incorporates explicit L1 (alpha) and L2 (lambda) regularization on leaf weights
  to prevent overfitting on tabular electronics datasets.

Evaluation characteristics:
- Exceptional performance on heterogeneous tabular data.
- Efficient gradient-based optimization with column subsampling.
"""

import xgboost as xgb


def create_xgboost_regressor(n_estimators: int = 250,
                             learning_rate: float = 0.05,
                             max_depth: int = 5,
                             subsample: float = 0.85,
                             colsample_bytree: float = 0.8,
                             reg_alpha: float = 0.1,
                             reg_lambda: float = 1.0,
                             random_state: int = 42,
                             n_jobs: int = -1):
    """Initializes an optimized XGBoost Regressor."""
    return xgb.XGBRegressor(
        n_estimators=n_estimators,
        learning_rate=learning_rate,
        max_depth=max_depth,
        subsample=subsample,
        colsample_bytree=colsample_bytree,
        reg_alpha=reg_alpha,
        reg_lambda=reg_lambda,
        random_state=random_state,
        n_jobs=n_jobs
    )
