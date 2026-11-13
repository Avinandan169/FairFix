"""
Decision Tree Regressor Model for FAIRFIX.

Purpose:
- Capture nonlinear feature thresholds (e.g. price jump between 16GB and 32GB RAM).
- Provide a clear, tree-structured interpretable baseline.
- Understand step-wise decision rules in hardware pricing.

Evaluation characteristics:
- Vulnerable to high variance and overfitting if unrestricted.
- Constrained with max_depth and min_samples_leaf for generalization.
"""

from sklearn.tree import DecisionTreeRegressor


def create_decision_tree_regressor(max_depth: int = 10,
                                    min_samples_split: int = 5,
                                    min_samples_leaf: int = 2,
                                    random_state: int = 42):
    """
    Initializes a single Decision Tree Regressor constrained
    to avoid leaf-level overfitting.
    """
    return DecisionTreeRegressor(
        max_depth=max_depth,
        min_samples_split=min_samples_split,
        min_samples_leaf=min_samples_leaf,
        random_state=random_state
    )
