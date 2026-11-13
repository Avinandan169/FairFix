# FAIRFIX

> **ML-Based Price Intelligence and Valuation for Used and Out-of-Warranty Laptops**  
> *B.Tech Computer Science and Engineering Capstone Project*  
> **Status:** Fully Trained, Evaluated, and Reproducible ML Platform with Full-Stack Web Application  

[![Python](https://img.shields.io/badge/Python-3.11-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-1.0.0-009688.svg)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![Test R²](https://img.shields.io/badge/Test_R²-0.9307-success.svg)](#4-empirical-machine-learning-benchmark)
[![Test MAE](https://img.shields.io/badge/Test_MAE-₹11,230-cyan.svg)](#4-empirical-machine-learning-benchmark)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 1. Project Overview & Problem Statement

Consumers purchasing used or out-of-warranty laptops face severe information asymmetry. Unlike automobiles or commodities, laptop valuation involves complex, interacting factors:
- **Processor architecture & generation** (Intel Core Ultra, 13th/14th Gen hybrid cores vs older monolithic cores)
- **Discrete graphics series & dedicated VRAM** (RTX 40/50 series vs integrated Iris Xe/UHD)
- **Memory & high-speed storage capacities** (RAM bandwidth, NVMe SSD sizing)
- **Display specifications** (Screen size, pixel density PPI, aspect ratio)
- **Physical condition & elapsed age** (Battery wear, cosmetic scuffs, screen scratches)
- **Current retail market conditions in India (INR ₹)**

**FAIRFIX** provides a research-backed, machine learning platform that:
1. Estimates a laptop's fair new retail replacement value using modern Indian market listings.
2. Applies an econometric, literature-backed depreciation heuristic for second-hand wear (Türkolmez et al. 2024).
3. Compares a seller's asking price against the fair valuation to flag **Great Deals**, **Fair Prices**, or **Overpriced Listings**.
4. Provides transparent feature explainability using **SHAP (SHapley Additive exPlanations)** to show the exact rupee impact of every component.

---

## 2. Key Methodological Contributions

- **Strict Academic Integrity (No Fabricated Metrics):** All evaluation metrics are generated from genuinely trained models on held-out test splits.
- **Explicit Separation of New vs Used Models:** Public training datasets contain new retail listing prices. FairFix strictly separates new retail price prediction from used-device depreciation, explicitly labeling condition adjustments as an **Experimental Literature Heuristic**.
- **Chassis Anti-Leakage Defense (`GroupKFold`):** In addition to standard 5-Fold cross-validation ($R^2 = 0.9256$), we evaluate via GroupKFold by product chassis line ($R^2 = 0.8738$), proving that sister laptop configurations never leak into validation folds.
- **Anti-Merge Discipline:** Incompatible foreign datasets (EUR, USD) from older hardware generations (2017) were not naively merged with the 2024 Indian market dataset, preventing artificial purchasing power parity (PPP) and temporal distortion.

---

## 3. System Architecture

```
FAIRFIX/
│
├── frontend/                     # Next.js 15, React 19, TypeScript, Tailwind CSS
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx          # Landing experience & interactive preset simulations
│   │   │   ├── valuation/        # Studio for custom spec & condition valuation
│   │   │   ├── dashboard/        # Telemetry dashboard with actual evaluation metrics
│   │   │   └── methodology/      # Academic methodology and literature documentation
│   │   ├── components/           # Navbar, Footer, and UI components
│   │   ├── services/             # API client connecting to FastAPI
│   │   └── types/                # TypeScript interface contracts
│   └── package.json
│
├── backend/                      # Production FastAPI asynchronous application
│   ├── main.py                   # App entrypoint, CORS, and /health endpoint
│   ├── routes/
│   │   ├── prediction.py         # POST /predict and GET /options
│   │   └── metrics.py            # GET /model-metrics (telemetry)
│   ├── schemas/
│   │   └── laptop.py             # Pydantic input/output schemas
│   ├── services/
│   │   └── prediction_service.py # Model loader, cache, and inference orchestrator
│   └── requirements.txt
│
├── ml/                           # Modular Machine Learning Pipeline
│   ├── data/
│   │   ├── inspect_datasets.py   # Dataset inspection & schema analysis
│   │   ├── merge_datasets.py     # Merge feasibility & compatibility experiment
│   │   └── preprocess.py         # Pipeline builder & data cleaner
│   ├── features/
│   │   └── feature_engineering.py# CPU generation parser, PPI, brand tiers
│   ├── models/
│   │   ├── linear_regression.py  # Linear & Ridge baseline
│   │   ├── decision_tree.py      # Decision Tree baseline
│   │   ├── random_forest.py      # Random Forest regressor
│   │   ├── gradient_boosting.py  # Scikit-Learn Gradient Boosting (Champion)
│   │   ├── xgboost_model.py      # Regularized XGBoost regressor
│   │   └── catboost_model.py     # CatBoost regressor
│   ├── training/
│   │   ├── train.py              # Master training, cross-validation & artifact serialization
│   │   ├── cross_validation.py   # KFold & GroupKFold validation suites
│   │   └── hyperparameter_tuning.py # Grid search tuning modules
│   ├── evaluation/
│   │   ├── evaluate.py           # Regression metrics, price tier errors, residuals
│   │   ├── compare_models.py     # Consolidated benchmark generator
│   │   └── explainability.py     # Global MDI importance & local SHAP tree values
│   └── predict.py                # Standalone valuation engine & used depreciation
│
├── datasets/
│   ├── raw/                      # Downloaded source datasets
│   │   ├── indian_laptop_specs/  # Primary Indian dataset (abhinavflac)
│   │   ├── ehtishamsadiq/        # Kaggle uncleaned dataset
│   │   ├── muhammetvarl/         # Kaggle European benchmark (EUR)
│   │   └── nabihazahid/          # Kaggle scraped dataset (USD)
│   └── processed/
│       └── laptops_featured.csv  # 992 rows, 36 engineered features
│
├── artifacts/
│   ├── models/                   # Serialized joblib models (fairfix_best_model.joblib)
│   ├── preprocessing/            # Serialized ColumnTransformer preprocessor
│   └── metrics/                  # JSON reports (model_comparison.json, evaluation_summary.json)
│
├── notebooks/
│   └── exploratory_analysis.ipynb# Interactive Jupyter exploratory notebook
│
├── docs/
│   ├── architecture.md           # Deep architectural specification & sequence diagrams
│   ├── dataset_documentation.md  # Detailed inspection & compatibility analysis
│   ├── model_documentation.md    # Algorithm formulations & price-tier error diagnostics
│   ├── api_documentation.md      # REST API schemas & request/response samples
│   ├── research_comparison.md    # Literature review (Turkolmez, Kuchkorov, Gupta)
│   └── setup_guide.md            # Comprehensive installation and execution guide
│
├── tests/
│   └── test_api.py               # Automated pytest suite (6 integration tests)
├── README.md
└── .gitignore
```

---

## 4. Empirical Machine Learning Benchmark

All six regression architectures were trained on the identical 80% training split ($n=793$) and evaluated on the identical held-out 20% test split ($n=199$, `random_state=42`):

| Algorithm | Test R² | Test MAE (INR) | Test RMSE (INR) | Test MAPE | 5-Fold CV R² | GroupKFold R² | Target Met? | Status |
|---|---|---|---|---|---|---|---|---|
| **Gradient Boosting** | **0.9307** | **₹11,230** | **₹22,503** | **10.05%** | **0.9256 (±0.015)** | **0.8738 (±0.072)** | **YES (0.9307)** | ★ **SELECTED CHAMPION** |
| **XGBoost** | 0.9267 | ₹11,425 | ₹23,135 | 10.41% | 0.9254 (±0.013) | 0.8665 (±0.085) | **YES (0.9267)** | Runner-Up |
| **Linear Regression** | 0.9448 | ₹13,338 | ₹20,071 | 17.51% | 0.8961 (±0.012) | 0.8359 (±0.066) | **YES (0.9448)** | Baseline Reference |
| **Decision Tree** | 0.9062 | ₹14,445 | ₹26,173 | 13.75% | 0.8036 (±0.075) | 0.7806 (±0.067) | **YES (0.9062)** | Baseline |
| **CatBoost** | 0.8804 | ₹12,648 | ₹29,548 | 11.40% | 0.9212 (±0.018) | 0.8648 (±0.082) | Close (0.8804) | Evaluated |
| **Random Forest** | 0.8392 | ₹14,967 | ₹34,270 | 13.41% | 0.8810 (±0.023) | 0.8309 (±0.079) | Below Target | Literature Benchmark |

### Why Gradient Boosting Won:
1. **Lowest Financial Error:** Test MAE is **₹11,230**, beating Linear Regression by ₹2,108 and Random Forest by ₹3,737 per laptop.
2. **Highest Cross-Validation Stability:** Achieved the highest 5-Fold Cross-Validation score (**$R^2 = 0.9256$**) with out-of-fold MAE of only ₹9,919.
3. **Resilience to Chassis Leakage:** Under strict GroupKFold cross-validation (withholding entire product chassis families like *Legion Pro 5* or *ZenBook 14*), it maintained **$R^2 = 0.8738$**, demonstrating robust generalization to newly released laptop form-factors.

---

## 5. Research Comparison (Summary)

Detailed literature review is available in [`docs/research_comparison.md`](docs/research_comparison.md):

1. **Türkolmez et al. (2024)** (*Information Systems Frontiers*):
   - Investigated remanufacturing life cycles across 1,500 new and 874 refurbished European laptop records.
   - Formulated the exponential wear curve used in FairFix's second-hand depreciation layer.
2. **Kuchkorov et al. (2024)** (*IEEE ICISCT*):
   - Demonstrated that tree ensembles outperform linear regressions on retail laptop specifications.
3. **Gupta, Jain, & Singh (2025)** (*IJSAT*):
   - Benchmarked 9 regression algorithms on 1,300 benchmark laptops, reporting Random Forest superiority on older datasets.

---

## 6. Quick Start & Execution

### 6.1 Setup Python Virtual Environment & Install Dependencies
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```
*(On macOS, ensure `brew install libomp` has been run for XGBoost).*

### 6.2 Run Full Training Pipeline (Reproduce Model & Metrics)
```bash
PYTHONPATH=. python ml/training/train.py
```

### 6.3 Run Automated Integration Tests
```bash
PYTHONPATH=. pytest tests/test_api.py -v
```

### 6.4 Launch the Backend API
```bash
source .venv/bin/activate
PYTHONPATH=. uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
Interactive API Docs: `http://localhost:8000/docs`

### 6.5 Launch the Next.js Frontend
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 7. License & Academic Attribution

This software is developed for academic evaluation under the MIT License. All source code, trained weights, and benchmark telemetry are fully open-source and reproducible.
