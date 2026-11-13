# FAIRFIX

> **Independent Repair & Price Intelligence for Electronics**  
> *B.Tech Computer Science and Engineering Project*  
> **Central Product Promise:** *"Understand what your device is worth, what it might cost to fix, and whether the deal is actually fair."*  
> **Status:** Fully Trained ML Valuation Pipeline + Supervised NLP Fault Classifier + Illustrative Heuristic Pricing Catalogue + Full-Stack Next.js 15 Interface  

[![Python](https://img.shields.io/badge/Python-3.11-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-1.1.0-009688.svg)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![Valuation R²](https://img.shields.io/badge/Valuation_Test_R²-0.9307-success.svg)](#4-empirical-machine-learning-benchmark)
[![Diagnosis Accuracy](https://img.shields.io/badge/Diagnosis_Accuracy-72.35%25_(Test)_|_72.50%25_(GroupKFold)-cyan.svg)](#5-repair-intelligence--fault-diagnosis-telemetry)
[![Pricing Catalogue](https://img.shields.io/badge/Pricing_Catalogue-Heuristic_Reference_(33_Records)-amber.svg)](#6-indian-repair-cost-intelligence)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 1. Project Overview & Problem Statement

Consumers purchasing used or out-of-warranty laptops face severe information asymmetry regarding both price and repairability:
1. **Valuation Uncertainty:** Laptop price depends on complex, interacting factors (CPU family/cores, dedicated GPU VRAM, RAM, NVMe speed, PPI, display quality, physical wear, and battery wear).
2. **Diagnostic Uncertainty:** When a laptop malfunctions, consumers lack technical knowledge and bench diagnostic instrumentation, making them vulnerable to misdiagnosis or unnecessary board replacements.
3. **Repair Cost Opacity:** Hardware repair quotations in India vary wildly across unauthorized independent shops, official service centres, and major tech hubs (Nehru Place, SP Road, Lamington Road).
4. **Repair-vs-Replace Dilemma:** Consumers struggle to determine whether investing ₹5,000–₹15,000 into repairing an aging device is economically rational or a sunk-cost trap.

**FAIRFIX** provides a unified, research-backed software platform that delivers:
- **Laptop Valuation:** Estimates retail baseline and depreciated market value using genuine Gradient Boosting regression ($R^2 = 0.9307$, $\text{MAE} = \text{₹}11,230$) with literature-backed econometric depreciation heuristics (Türkolmez et al. 2024).
- **Repair Diagnosis:** Predicts candidate hardware/software root causes using a Calibrated Linear SVC NLP classifier trained on 2,404 curated Open Repair Alliance records across 17 empirical categories.
- **Repair Cost Intelligence:** Queries an illustrative heuristic reference catalogue of Indian parts and labour price ranges in INR, accompanied by clear provenance disclaimers.
- **Quote Evaluation:** Audits technician quotes against heuristic reference benchmarks, calculating rupee variance and percentage markup.
- **Repair-versus-Replace Decision Support:** Analyzes the Repair-to-Value ratio using configurable 30% / 50% economic thresholds to provide actionable financial recommendations.

---

## 2. Key Methodological Contributions

- **Strict Academic Integrity (No Fabricated Metrics):** All evaluation metrics are generated from genuinely trained models on held-out test splits and verified via reproducible audit scripts.
- **Explicit Separation of New vs Used Models:** Public training datasets contain new retail listing prices. FairFix strictly separates new retail price prediction from used-device depreciation, explicitly labeling condition adjustments as an **Experimental Literature Heuristic**.
- **Chassis Anti-Leakage Defense (`GroupKFold`):** In addition to standard 5-Fold cross-validation ($R^2 = 0.9256$), we evaluate via GroupKFold by product chassis line ($R^2 = 0.8738$), proving that sister laptop configurations never leak into validation folds.
- **NLP Diagnostic Leakage & Robustness Audit:** The fault classification engine is evaluated across three complementary perspectives: the standard held-out test set (72.35% Acc, 0.6836 Macro F1), an exact-duplicate-free subset (67.50% Acc, 0.6456 Macro F1), and a 5-Fold semantic cluster `GroupKFold` cross-validation (72.50% ± 1.8% Acc, 0.6797 ± 0.014 Macro F1) across 1,991 disjoint symptom clusters.
- **Transparent Pricing Provenance:** The 33-record repair pricing catalogue is explicitly classified as an *Illustrative Repair Cost Reference Catalogue — Expert Heuristic Estimates*. A full audit showed 0/33 URLs independently verified (15 synthetic domain placeholders, 16 expired links, 2 unverified aggregators); all endpoints and UI views include prominent provenance disclaimers.
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
PYTHONPATH=. pytest tests/ -v
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
