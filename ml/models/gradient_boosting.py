"""
Gradient Boosting Regressor Model for FAIRFIX.

Purpose:
- Traditional forward stagewise gradient boosting algorithm from Scikit-Learn.
- Sequentially fits regression trees to negative gradients of pseudo-residuals.
- Serves as the canonical ensemble benchmark between bagging (Random Forest)
  and modern accelerated gradient boosting libraries (XGBoost, CatBoost).
"""

from sklearn.ensemble import GradientBoostingRegressor


def create_gradient_boosting_regressor(n_estimators: int = 200,
                                       learning_rate: float = 0.06,
                                       max_depth: int = 5,
                                       min_samples_split: int = 4,
                                       min_samples_leaf: int = 2,
                                       subsample: float = 0.85,
                                       random_state: int = 42):
    """Initializes a Scikit-Learn Gradient Boosting Regressor."""
    return GradientBoostingRegressor(
        n_estimators=n_estimators,
        learning_rate=learning_rate,
        max_depth=max_depth,
        min_samples_split=min_samples_split,
        min_samples_leaf=min_samples_leaf,
        subsample=subsample,
        random_state=random_state
    )
