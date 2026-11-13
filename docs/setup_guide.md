# FAIRFIX — Complete Setup & Reproducibility Guide

Follow this guide to set up the FAIRFIX environment from scratch, execute model training and cross-validation, run the backend API, and start the Next.js frontend.

---

## 1. System Prerequisites

- **Operating System:** macOS (Apple Silicon or Intel), Linux (Ubuntu 22.04+), or Windows 11 (WSL2 recommended).
- **Python:** Version 3.10 or 3.11 (Python 3.11 recommended).
- **Node.js:** Version 18.18 or higher (Node 20+ recommended).
- **Package Managers:** `pip` and `npm`.

### macOS Specific Prerequisite (for XGBoost OpenMP runtime)
On macOS, XGBoost requires `libomp`:
```bash
brew install libomp
```

---

## 2. Python Virtual Environment Setup

1. Clone or navigate to the project root:
   ```bash
   cd /path/to/FAIRFIX
   ```

2. Create and activate a dedicated Python 3.11 virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   # On Windows (cmd): .venv\Scripts\activate
   # On Windows (PowerShell): .venv\Scripts\Activate.ps1
   ```

3. Upgrade `pip` and install ML & Backend dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

---

## 3. Dataset Acquisition & Inspection

1. Inspect candidate datasets and generate compatibility documentation:
   ```bash
   PYTHONPATH=. python ml/data/inspect_datasets.py
   ```
   *Outputs:*
   - `artifacts/metrics/dataset_inspection_report.json`
   - `docs/dataset_documentation.md`

2. Run the dataset merge compatibility analysis:
   ```bash
   PYTHONPATH=. python ml/data/merge_datasets.py
   ```
   *Outputs:*
   - `artifacts/metrics/merge_compatibility_analysis.json`

---

## 4. Feature Engineering & Model Training Pipeline

1. Execute the preprocessing pipeline:
   ```bash
   PYTHONPATH=. python ml/data/preprocess.py
   ```
   *Outputs:*
   - `datasets/processed/laptops_featured.csv` (992 rows, 36 engineered features)

2. Train all 6 regression algorithms, run standard 5-Fold and GroupKFold cross-validation, and generate artifacts:
   ```bash
   PYTHONPATH=. python ml/training/train.py
   ```
   *Execution Details:*
   - 80% Train Split ($n=793$) / 20% Test Split ($n=199$, strictly held out, random seed 42).
   - Trains Linear Regression, Decision Tree, Random Forest, Gradient Boosting, XGBoost, CatBoost.
   - Saves production models to `artifacts/models/`.
   - Saves metrics to `artifacts/metrics/model_comparison.json` and `artifacts/metrics/evaluation_summary.json`.

---

## 5. Running Automated Tests

Run the comprehensive pytest suite verifying API endpoints, Pydantic validation, used depreciation formulas, and model inference:
```bash
PYTHONPATH=. pytest tests/test_api.py -v
```
All tests should pass (`6 passed`).

---

## 6. Running the Backend API

Launch the FastAPI production server on port 8000:
```bash
source .venv/bin/activate
PYTHONPATH=. uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

- Verify health check:
  ```bash
  curl http://localhost:8000/health
  ```
- Interactive API Documentation:
  Open `http://localhost:8000/docs` in your browser.

---

## 7. Running the Next.js Frontend

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Build the production application:
   ```bash
   npm run build
   ```

4. Start the Next.js application:
   - For production mode:
     ```bash
     npm start -p 3000
     ```
   - For development mode:
     ```bash
     npm run dev
     ```

Open `http://localhost:3000` in your browser.

---

## 8. Directory Artifacts Checklist

Before university submission or viva evaluation, confirm the presence of these generated artifacts:
- `artifacts/models/fairfix_best_model.joblib` (Champion Gradient Boosting pipeline)
- `artifacts/preprocessing/preprocessor.joblib` (Fitted ColumnTransformer)
- `artifacts/metrics/model_comparison.json` (6-model benchmark comparison)
- `artifacts/metrics/evaluation_summary.json` (Detailed test & CV summary)
- `artifacts/metrics/feature_importances.json` (Global MDI tree importance)
- `artifacts/metrics/shap_summary.json` (Mean absolute SHAP rupee impacts)
- `artifacts/metrics/test_predictions.json` (Actual vs Predicted test scatter points)
