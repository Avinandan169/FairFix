"""
Random Forest Regressor Model for FAIRFIX.

Purpose:
- Ensemble bagging method that averages multiple de-correlated decision trees.
- Significantly reduces prediction variance compared to a single decision tree.
- Captures intricate non-linear relationships across specifications.
- Serves as the primary literature benchmark (e.g. Gupta et al. 2025, Turkolmez et al. 2024).

Evaluation characteristics:
- Highly robust against outliers and noisy tabular features.
- Provides intrinsic Gini/variance-reduction feature importance scores.
"""

from sklearn.ensemble import RandomForestRegressor


def create_random_forest_regressor(n_estimators: int = 200,
                                   max_depth: int = 15,
                                   min_samples_split: int = 4,
                                   min_samples_leaf: int = 2,
                                   max_features: str = 'sqrt',
                                   random_state: int = 42,
                                   n_jobs: int = -1):
    """Initializes an ensemble Random Forest Regressor."""
    return RandomForestRegressor(
        n_estimators=n_estimators,
        max_depth=max_depth,
        min_samples_split=min_samples_split,
        min_samples_leaf=min_samples_leaf,
        max_features=max_features,
        random_state=random_state,
        n_jobs=n_jobs
    )
