"""
Linear Regression and Regularized Ridge Baseline Models for FAIRFIX.

Purpose:
- Establish a rigorous linear reference baseline.
- Assess whether laptop prices scale linearly with capacity (RAM, storage, cores).
- Evaluate L2 regularization (Ridge) to mitigate multicollinearity between core counts,
  thread counts, and memory bandwidth.

Evaluation characteristics:
- Fast training and high parameter interpretability.
- Cannot capture nonlinear interactions (e.g. dedicated GPU paired with high-end CPU).
"""

from sklearn.linear_model import LinearRegression, Ridge


def create_linear_regression(fit_intercept: bool = True):
    """Initializes an Ordinary Least Squares (OLS) Linear Regression model."""
    return LinearRegression(fit_intercept=fit_intercept)


def create_ridge_regression(alpha: float = 5.0, random_state: int = 42):
    """
    Initializes a Ridge Regression model with L2 regularization
    to penalize excessively large feature weights caused by collinearity.
    """
    return Ridge(alpha=alpha, random_state=random_state)
