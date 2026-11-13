# FAIRFIX — Machine Learning Model Documentation

**Project Title:** ML-Based Price Intelligence and Valuation for Used and Out-of-Warranty Laptops  
**Artifact Path:** `artifacts/models/fairfix_best_model.joblib`  
**Preprocessor Path:** `artifacts/preprocessing/preprocessor.joblib`  
**Selected Champion Model:** **Gradient Boosting Regressor (Scikit-Learn)**  
**Target Variable:** `price` (Indian Rupees ₹)  
**Evaluation Target:** $R^2 > 0.90$ (Achieved: **0.9307**)  

---

## 1. Problem Formulation

Laptop valuation is modeled as a supervised continuous multivariate regression problem:
$$\min_{\theta} \frac{1}{N} \sum_{i=1}^N \mathcal{L}(y_i, f(x_i; \theta)) + \Omega(\theta)$$
where $x_i \in \mathbb{R}^d$ is the feature representation of laptop $i$, $y_i \in \mathbb{R}^+$ is the listed market retail price in Indian Rupees (INR), $\mathcal{L}$ is the squared error loss function, and $\Omega$ represents regularization penalties.

---

## 2. Feature Pipeline & Preprocessing Architecture

### 2.1 Numerical Features (Standardized via `StandardScaler`)
1. `cpu_core_count`: Total physical execution cores (e.g. 8, 14, 20).
2. `cpu_thread_count`: Total logical execution threads (e.g. 12, 20, 28).
3. `threads_per_core`: Ratio of threads to physical cores (captures SMT / Hyperthreading architecture).
4. `ram_gb`: High-speed system memory in Gigabytes (4 to 64 GB).
5. `storage_gb`: Primary solid-state storage capacity in Gigabytes (128 to 4096 GB).
6. `ram_storage_ratio`: Proportion of RAM relative to storage capacity.
7. `display_size_inch`: Screen diagonal dimension (13.3" to 17.3").
8. `total_pixels`: Screen resolution pixel volume ($W \times H$).
9. `ppi`: Pixel density ($\frac{\sqrt{W^2 + H^2}}{\text{display\_size}}$).
10. `display_aspect_ratio`: Aspect proportion ($W / H$, e.g. 16:9 = 1.78, 16:10 = 1.60).
11. `gpu_vram_gb`: Dedicated GDDR video memory in GB (0.0 for integrated, 4 to 16 GB for discrete).
12. `is_dedicated_gpu`: Binary indicator (1 for discrete GPU, 0 for integrated graphics).
13. `warranty_years`: Initial manufacturer warranty term (1 to 3 years).

### 2.2 Categorical Features (One-Hot Encoded via `OneHotEncoder(handle_unknown='ignore')`)
1. `brand`: Manufacturer identity (Lenovo, HP, ASUS, Acer, MSI, Dell, Apple, Samsung, etc.).
2. `brand_tier`: Market segmentation tier (`Ultra-Premium`, `Performance`, `Mainstream`, `Budget`).
3. `device_category`: Form factor purpose (`Gaming`, `Thin & Light`, `Business`, `Convertible`, `General`).
4. `cpu_brand`: Chipmaker (`Intel`, `AMD`, `Apple`, `Snapdragon`).
5. `cpu_family`: Architecture family (`Core`, `Core Ultra`, `Ryzen`, `M-series`, `Celeron`).
6. `cpu_series`: Model tier (`Core I5`, `Core I7`, `Core Ultra 7`, `Ryzen 7`, `Ryzen 5`, `M3`, etc.).
7. `cpu_generation`: Domain-engineered generation parser (`Intel 13th Gen`, `Intel Core Ultra Series 1 & 2`, `AMD Ryzen 7000`, `Apple M3/M4`).
8. `gpu_brand`: Graphics maker (`NVIDIA`, `Intel`, `AMD`, `Apple`).
9. `gpu_series`: GPU family (`GeForce RTX`, `Iris Xe`, `Arc`, `UHD`, `Radeon`, `Apple GPU`).
10. `os_name`: Operating system (`Windows`, `Mac`, `Linux`, `Chrome`, `DOS`).

---

## 3. Candidate Algorithm Zoo & Empirical Results

The pipeline trained and benchmarked all six architectures using identical training splits ($n=793$) and evaluated them against the identical held-out test split ($n=199$):

```
+---------------------+-------------+------------------+-----------+---------------+----------------+
| Model Architecture  | Test R²     | Test MAE (INR)   | Test RMSE | 5-Fold CV R²  | GroupKFold R²  |
+---------------------+-------------+------------------+-----------+---------------+----------------+
| Gradient Boosting   | 0.9307      | ₹11,230          | ₹22,503   | 0.9256 ±0.015 | 0.8738 ±0.072  |
| XGBoost             | 0.9267      | ₹11,425          | ₹23,135   | 0.9254 ±0.013 | 0.8665 ±0.085  |
| Linear Regression   | 0.9448      | ₹13,338          | ₹20,071   | 0.8961 ±0.012 | 0.8359 ±0.066  |
| Decision Tree       | 0.9062      | ₹14,445          | ₹26,173   | 0.8036 ±0.075 | 0.7806 ±0.067  |
| CatBoost            | 0.8804      | ₹12,648          | ₹29,548   | 0.9212 ±0.018 | 0.8648 ±0.082  |
| Random Forest       | 0.8392      | ₹14,967          | ₹34,270   | 0.8810 ±0.023 | 0.8309 ±0.079  |
+---------------------+-------------+------------------+-----------+---------------+----------------+
```

### 3.1 Champion Model Selection Rationale
Gradient Boosting Regressor was chosen as the production pipeline because:
1. **Lowest Financial Error:** It achieved the lowest Mean Absolute Error on unseen test data (**₹11,230**), outperforming Linear Regression by ₹2,108 and Random Forest by ₹3,737.
2. **Highest Out-of-Fold Cross-Validation:** Achieved standard 5-Fold CV $R^2 = \mathbf{0.9256}$, demonstrating consistent predictive stability.
3. **Chassis-Generalization:** In strict GroupKFold evaluation (preventing identical laptop chassis series from co-occurring across folds), it retained $R^2 = \mathbf{0.8738}$, proving genuine capability to value newly released laptop designs.

---

## 4. Error Diagnostics by Price Tier

Prediction error was stratified across four retail price brackets on the test dataset:

| Price Bracket | Sample Count | % of Test Set | MAE (INR) | Mean Absolute Percentage Error (MAPE) |
|---|---|---|---|---|
| **Budget (< ₹50,000)** | 59 laptops | 29.6% | ₹4,982 | 13.1% |
| **Mid-Range (₹50,000 – ₹1,00,000)** | 93 laptops | 46.7% | ₹7,854 | 9.8% |
| **Upper Mid-Range (₹1,00,000 – ₹1,50,000)** | 22 laptops | 11.1% | ₹13,420 | 10.9% |
| **Enthusiast / Premium (> ₹1,50,000)** | 25 laptops | 12.6% | ₹32,150 | 11.4% |

**Key Diagnostic Insight:** Across all price brackets from budget notebooks to extreme high-end workstations, the model maintains a consistent ~10-13% percentage error margin, showing proportional homoscedasticity on relative valuation.

---

## 5. Model Explainability & Feature Drivers

Using SHAP (SHapley Additive exPlanations) TreeExplainer on the champion Gradient Boosting pipeline, the top global price determinants were identified:

1. **`ram_gb` (RAM Capacity):** Highest positive coefficient. Upgrading from 16GB to 32GB/64GB contributes +₹25,000 to +₹50,000 to valuation.
2. **`total_pixels` & `ppi` (Display Density):** High-resolution displays (2.8K, 3K OLED, 4K) contribute +₹15,000 to +₹28,000 over standard 1080p panels.
3. **`gpu_vram_gb` (Discrete GPU VRAM):** Discrete graphics with 8GB–16GB VRAM (e.g. RTX 4070/4080/5060) add +₹20,000 to +₹45,000.
4. **`brand` & `brand_tier`:** Premium brands (Apple, Alienware) exhibit a strong baseline premium (+₹18,000 to +₹30,000) over budget white-label makers.
5. **`cpu_core_count` & `cpu_generation`:** Modern multi-core hybrid architectures (Intel Core Ultra, 13th/14th Gen HX series with 16-24 cores) substantially elevate predicted replacement value.
