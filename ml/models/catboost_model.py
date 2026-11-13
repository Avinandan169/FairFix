"""
CatBoost Regressor Model for FAIRFIX.

Purpose:
- Advanced gradient boosting library with proprietary target-statistics encoding for categorical features.
- Implements ordered boosting to eliminate prediction shift and target leakage.
- Utilizes oblivious (symmetric) decision trees to provide fast inference speed and regularization.

Evaluation characteristics:
- Handles high-cardinality categorical features (CPU families, GPU series, brands) seamlessly.
- Reduces manual one-hot encoding dimensional explosion.
"""

from catboost import CatBoostRegressor


def create_catboost_regressor(iterations: int = 300,
                              learning_rate: float = 0.05,
                              depth: int = 6,
                              l2_leaf_reg: float = 3.0,
                              random_state: int = 42,
                              verbose: int = 0):
    """Initializes a CatBoost Regressor."""
    return CatBoostRegressor(
        iterations=iterations,
        learning_rate=learning_rate,
        depth=depth,
        l2_leaf_reg=l2_leaf_reg,
        random_state=random_state,
        verbose=verbose
    )
