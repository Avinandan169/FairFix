"""
Hyperparameter Tuning Module for FAIRFIX.

Performs systematic grid/random search over candidate hyperparameter configurations
to optimize out-of-fold generalization (R2 / MAE) without test set contamination.
"""

from sklearn.model_selection import GridSearchCV
from sklearn.pipeline import Pipeline
from ml.data.preprocess import build_preprocessor_pipeline
from ml.models.random_forest import create_random_forest_regressor
from ml.models.gradient_boosting import create_gradient_boosting_regressor
from ml.models.xgboost_model import create_xgboost_regressor


def tune_gradient_boosting(X_train, y_train, cv=5):
    """Tunes Gradient Boosting Regressor parameters on the training set."""
    print("[Tuning] Running grid search for Gradient Boosting...")
    pipe = Pipeline([
        ('prep', build_preprocessor_pipeline()),
        ('model', create_gradient_boosting_regressor(random_state=42))
    ])

    param_grid = {
        'model__n_estimators': [150, 250],
        'model__learning_rate': [0.04, 0.08],
        'model__max_depth': [4, 5, 6],
        'model__subsample': [0.8, 0.9]
    }

    grid = GridSearchCV(pipe, param_grid, cv=cv, scoring='r2', n_jobs=-1, verbose=1)
    grid.fit(X_train, y_train)
    print(f"[Tuning] Best GBR R2: {grid.best_score_:.4f} with params: {grid.best_params_}")
    return grid.best_estimator_, grid.best_params_, grid.best_score_


def tune_xgboost(X_train, y_train, cv=5):
    """Tunes XGBoost Regressor parameters on the training set."""
    print("[Tuning] Running grid search for XGBoost...")
    pipe = Pipeline([
        ('prep', build_preprocessor_pipeline()),
        ('model', create_xgboost_regressor(random_state=42))
    ])

    param_grid = {
        'model__n_estimators': [150, 250],
        'model__learning_rate': [0.04, 0.08],
        'model__max_depth': [4, 5, 6],
        'model__colsample_bytree': [0.8, 0.9]
    }

    grid = GridSearchCV(pipe, param_grid, cv=cv, scoring='r2', n_jobs=-1, verbose=1)
    grid.fit(X_train, y_train)
    print(f"[Tuning] Best XGBoost R2: {grid.best_score_:.4f} with params: {grid.best_params_}")
    return grid.best_estimator_, grid.best_params_, grid.best_score_


def tune_random_forest(X_train, y_train, cv=5):
    """Tunes Random Forest Regressor parameters on the training set."""
    print("[Tuning] Running grid search for Random Forest...")
    pipe = Pipeline([
        ('prep', build_preprocessor_pipeline()),
        ('model', create_random_forest_regressor(random_state=42))
    ])

    param_grid = {
        'model__n_estimators': [150, 250],
        'model__max_depth': [12, 16],
        'model__min_samples_split': [2, 4],
        'model__min_samples_leaf': [1, 2]
    }

    grid = GridSearchCV(pipe, param_grid, cv=cv, scoring='r2', n_jobs=-1, verbose=1)
    grid.fit(X_train, y_train)
    print(f"[Tuning] Best RF R2: {grid.best_score_:.4f} with params: {grid.best_params_}")
    return grid.best_estimator_, grid.best_params_, grid.best_score_
