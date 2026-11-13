# FAIRFIX — Comprehensive Dataset Documentation & Compatibility Analysis

## 1. Executive Summary

For FairFix, price prediction integrity is paramount. In this investigation, six candidate datasets were examined across international retail, Indian e-commerce, Kaggle benchmarks, and peer-reviewed remanufacturing literature.

### Key Architectural Decision:
- **Primary Training Dataset:** **Indian Laptop Specifications Dataset** (`abhinavflac/laptops-specs-dataset`). It contains 992 high-fidelity records of current-generation laptop specifications sold in India, priced in Indian Rupees (INR ₹), with 27 rich hardware features.
- **Secondary Validation Datasets:** Kept **strictly separate** for cross-dataset evaluation and benchmarking rather than being naively merged.
- **Strict Anti-Leakage Policy:** Incompatible currencies (EUR, USD) and different generational eras (2017 vs 2024) are not blended directly into the training corpus, avoiding cross-market target noise.

---

## 2. Dataset Compatibility Matrix

| Dataset Name | Source | Rows | Cols | Currency | Market | Price Type | Classification |
|---|---|---|---|---|---|---|---|
| Indian Laptop Specifications Dataset (Cleaned) | [https://github.com/abhinavfl...](https://github.com/abhinavflac/laptops-specs-dataset) | 992 | 27 | INR (₹) | India (Flipkart / Amazon ... | New retail listed price | **Primary candidate for Indian market price prediction** |
| Indian Laptop Specifications Dataset (Raw Scraped) | [https://github.com/abhinavfl...](https://github.com/abhinavflac/laptops-specs-dataset) | 1011 | 11 | INR (₹) | India... | New retail listed price | **Raw source verification and validation** |
| Laptop Price Prediction Dataset (Uncleaned) | [https://www.kaggle.com/datas...](https://www.kaggle.com/datasets/ehtishamsadiq/uncleaned-laptop-price-dataset) | 1303 | 12 | INR (Estimated converted from EUR ~2017 rate) | Global / European resale/... | Retail asking price | **Suitable for external validation experiment** |
| Laptop Price Benchmark Dataset | [https://www.kaggle.com/datas...](https://www.kaggle.com/datasets/muhammetvarl/laptop-price) | 1303 | 13 | EUR (€) | European retail listings ... | New retail listed price in Euros | **External benchmark dataset** |
| Laptop Details Dataset (Engineered Scraped) | [https://www.kaggle.com/datas...](https://www.kaggle.com/datasets/nabihazahid/laptop-details-dataset) | 1563 | 21 | USD ($) | Global / North American r... | Retail listed price in USD | **Suitable for external feature validation and cross-market reference** |
| Best Buy Laptop Pricing Dataset | [https://platform.stratascrat...](https://platform.stratascratch.com/data-projects/laptop-price-prediction) | ~1,200 | N/A | USD ($) | United States (Best Buy R... | buynow_price (New Retail) | **Useful only for research/reference (inaccessible directly via open raw link)** |
| Remanufactured Laptops Research Dataset (Turkolmez et al. 2024) | [https://doi.org/10.1007/s107...](https://doi.org/10.1007/s10796-024-10515-9) | 1,500 new listings + 874 remanufactured listings | N/A | EUR (€) / GBP (£) | European Circular Economy... | New component price vs Remanufactured resale price | **Used as the authoritative methodology reference for used-laptop depreciation heuristics** |

---

## 3. Deep-Dive Inspection per Dataset

### Indian Laptop Specifications Dataset (Cleaned)
- **Source URL:** https://github.com/abhinavflac/laptops-specs-dataset
- **File Path:** `datasets/raw/indian_laptop_specs/laptops_cleaned.csv`
- **Shape:** 992 rows, 27 columns
- **Duplicate Rows:** 0
- **Overall Missing Values:** 2289 cells (8.55%)
- **Currency & Market:** INR (₹) | India (Flipkart / Amazon / Smartprix e-commerce)
- **Data Licence:** MIT License (Permissive Open Source)
- **Target Variable:** `price`

**Target Price Statistics:**
- Count: 992
- Mean: 87,741.27
- Std Dev: 68,578.31
- Min: 12,490.00
- 25th Percentile: 45,912.50
- Median (50th): 67,990.00
- 75th Percentile: 99,240.00
- Max: 605,990.00

**Key Feature Columns & Null Proportions:**
| Column Name | Data Type | Null Count | Null % | Unique Values |
|---|---|---|---|---|
| `brand` | `str` | 0 | 0.0% | 19 |
| `model` | `str` | 0 | 0.0% | 992 |
| `device_category` | `str` | 0 | 0.0% | 5 |
| `price` | `int64` | 0 | 0.0% | 559 |
| `rating` | `int64` | 0 | 0.0% | 61 |
| `cpu_brand` | `str` | 0 | 0.0% | 4 |
| `cpu_family` | `str` | 0 | 0.0% | 7 |
| `cpu_series` | `str` | 0 | 0.0% | 24 |
| `cpu_model` | `str` | 0 | 0.0% | 119 |
| `cpu_suffix` | `str` | 131 | 13.21% | 11 |
| `cpu_core_count` | `int64` | 0 | 0.0% | 11 |
| `cpu_thread_count` | `int64` | 0 | 0.0% | 14 |
| ... (15 more columns) | ... | ... | ... | ... |

### Indian Laptop Specifications Dataset (Raw Scraped)
- **Source URL:** https://github.com/abhinavflac/laptops-specs-dataset
- **File Path:** `datasets/raw/indian_laptop_specs/laptops_raw.csv`
- **Shape:** 1011 rows, 11 columns
- **Duplicate Rows:** 2
- **Overall Missing Values:** 56 cells (0.5%)
- **Currency & Market:** INR (₹) | India
- **Data Licence:** MIT License
- **Target Variable:** `price`

**Target Price Statistics:**
- Count: 1,011
- Mean: 86,893.93
- Std Dev: 68,338.50
- Min: 10,999.00
- 25th Percentile: 44,926.00
- Median (50th): 67,499.00
- 75th Percentile: 98,453.00
- Max: 605,990.00

**Key Feature Columns & Null Proportions:**
| Column Name | Data Type | Null Count | Null % | Unique Values |
|---|---|---|---|---|
| `model` | `str` | 0 | 0.0% | 1009 |
| `price` | `str` | 0 | 0.0% | 567 |
| `rating` | `float64` | 1 | 0.1% | 67 |
| `processor` | `str` | 8 | 0.79% | 158 |
| `cores` | `str` | 23 | 2.27% | 48 |
| `ram` | `str` | 3 | 0.3% | 49 |
| `storage` | `str` | 4 | 0.4% | 11 |
| `display` | `str` | 0 | 0.0% | 77 |
| `graphics` | `str` | 10 | 0.99% | 121 |
| `os` | `str` | 3 | 0.3% | 11 |
| `warranty` | `str` | 4 | 0.4% | 3 |

### Laptop Price Prediction Dataset (Uncleaned)
- **Source URL:** https://www.kaggle.com/datasets/ehtishamsadiq/uncleaned-laptop-price-dataset
- **File Path:** `datasets/raw/ehtishamsadiq/laptopData.csv`
- **Shape:** 1303 rows, 12 columns
- **Duplicate Rows:** 29
- **Overall Missing Values:** 360 cells (2.3%)
- **Currency & Market:** INR (Estimated converted from EUR ~2017 rate) | Global / European resale/e-commerce mirror
- **Data Licence:** Database Contents License (DbCL) / Kaggle Open Data
- **Target Variable:** `Price`

**Target Price Statistics:**
- Count: 1,273
- Mean: 59,955.81
- Std Dev: 37,332.25
- Min: 9,270.72
- 25th Percentile: 31,914.72
- Median (50th): 52,161.12
- 75th Percentile: 79,333.39
- Max: 324,954.72

**Key Feature Columns & Null Proportions:**
| Column Name | Data Type | Null Count | Null % | Unique Values |
|---|---|---|---|---|
| `Unnamed: 0` | `float64` | 30 | 2.3% | 1273 |
| `Company` | `str` | 30 | 2.3% | 19 |
| `TypeName` | `str` | 30 | 2.3% | 6 |
| `Inches` | `str` | 30 | 2.3% | 25 |
| `ScreenResolution` | `str` | 30 | 2.3% | 40 |
| `Cpu` | `str` | 30 | 2.3% | 118 |
| `Ram` | `str` | 30 | 2.3% | 10 |
| `Memory` | `str` | 30 | 2.3% | 40 |
| `Gpu` | `str` | 30 | 2.3% | 110 |
| `OpSys` | `str` | 30 | 2.3% | 9 |
| `Weight` | `str` | 30 | 2.3% | 189 |
| `Price` | `float64` | 30 | 2.3% | 777 |

### Laptop Price Benchmark Dataset
- **Source URL:** https://www.kaggle.com/datasets/muhammetvarl/laptop-price
- **File Path:** `datasets/raw/muhammetvarl/laptop_price.csv`
- **Shape:** 1303 rows, 13 columns
- **Duplicate Rows:** 0
- **Overall Missing Values:** 0 cells (0.0%)
- **Currency & Market:** EUR (€) | European retail listings (2017-2018)
- **Data Licence:** CC0: Public Domain
- **Target Variable:** `Price_euros`

**Target Price Statistics:**
- Count: 1,303
- Mean: 1,123.69
- Std Dev: 699.01
- Min: 174.00
- 25th Percentile: 599.00
- Median (50th): 977.00
- 75th Percentile: 1,487.88
- Max: 6,099.00

**Key Feature Columns & Null Proportions:**
| Column Name | Data Type | Null Count | Null % | Unique Values |
|---|---|---|---|---|
| `laptop_ID` | `int64` | 0 | 0.0% | 1303 |
| `Company` | `str` | 0 | 0.0% | 19 |
| `Product` | `str` | 0 | 0.0% | 618 |
| `TypeName` | `str` | 0 | 0.0% | 6 |
| `Inches` | `float64` | 0 | 0.0% | 18 |
| `ScreenResolution` | `str` | 0 | 0.0% | 40 |
| `Cpu` | `str` | 0 | 0.0% | 118 |
| `Ram` | `str` | 0 | 0.0% | 9 |
| `Memory` | `str` | 0 | 0.0% | 39 |
| `Gpu` | `str` | 0 | 0.0% | 110 |
| `OpSys` | `str` | 0 | 0.0% | 9 |
| `Weight` | `str` | 0 | 0.0% | 179 |
| ... (1 more columns) | ... | ... | ... | ... |

### Laptop Details Dataset (Engineered Scraped)
- **Source URL:** https://www.kaggle.com/datasets/nabihazahid/laptop-details-dataset
- **File Path:** `datasets/raw/nabihazahid/laptop_scrap_data.csv`
- **Shape:** 1563 rows, 21 columns
- **Duplicate Rows:** 2
- **Overall Missing Values:** 63 cells (0.19%)
- **Currency & Market:** USD ($) | Global / North American retail e-commerce
- **Data Licence:** CC0: Public Domain
- **Target Variable:** `Price`

**Target Price Statistics:**
- Count: 1,560
- Mean: 1,947.01
- Std Dev: 693.18
- Min: 305.99
- 25th Percentile: 1,496.80
- Median (50th): 1,807.80
- 75th Percentile: 2,227.80
- Max: 7,488.80

**Key Feature Columns & Null Proportions:**
| Column Name | Data Type | Null Count | Null % | Unique Values |
|---|---|---|---|---|
| `Company` | `str` | 3 | 0.19% | 18 |
| `TypeName` | `str` | 3 | 0.19% | 455 |
| `Inches` | `float64` | 3 | 0.19% | 26 |
| `ScreenResolution` | `str` | 3 | 0.19% | 29 |
| `Cpu` | `str` | 3 | 0.19% | 230 |
| `Gpu` | `str` | 3 | 0.19% | 134 |
| `OpSys` | `str` | 3 | 0.19% | 3 |
| `TouchScreen` | `float64` | 3 | 0.19% | 2 |
| `Ips` | `float64` | 3 | 0.19% | 2 |
| `X_res` | `float64` | 3 | 0.19% | 17 |
| `Y_res` | `float64` | 3 | 0.19% | 24 |
| `ppi` | `float64` | 3 | 0.19% | 60 |
| ... (9 more columns) | ... | ... | ... | ... |

---

## 4. Why Incompatible Datasets Were NOT Merged

1. **Currency & Purchasing Power Parity (PPP):**
   - Converting EUR (€) or USD ($) to INR using spot exchange rates creates false pricing signals. For instance, Indian consumer electronics carry an 18% Goods & Services Tax (GST) plus basic customs duty, making a €1,000 laptop retail for ₹1,10,000 to ₹1,25,000 in India, whereas nominal spot conversion would suggest ~₹90,000.
2. **Temporal Discrepancy:**
   - The Kaggle `muhammetvarl/laptop-price` dataset originates from 2017-2018 (featuring 7th/8th Gen Intel Core and GTX 10-series GPUs). The primary Indian dataset features 2023-2025 hardware (Intel Core Ultra, 13th/14th Gen, RTX 40/50 series). Merging them causes catastrophic feature collision (e.g. an i7 from 2017 with 4 cores priced differently than a 14th gen i7 with 20 cores).
3. **Data Leakage and Duplicate Risk:**
   - Dataset 2 (`ehtishamsadiq`) is a degraded mirror of Dataset 3 (`muhammetvarl`). Merging them causes cross-contamination of duplicated entries into train and test splits.

## 5. Used Laptop Valuation Strategy

As documented in **Turkolmez et al. (2024)** (*Machine Learning Algorithms for Pricing End-of-Life Remanufactured Laptops*), reliable used pricing requires actual remanufacturer cost data. Because open datasets do not provide genuine second-hand transaction history, **FairFix establishes an explicit separation**:
- **ML Regression Model:** Estimates the true current new retail market replacement value $V_{new}$.
- **Used-Device Valuation Layer:** Applies an empirically grounded, literature-backed depreciation heuristic $V_{used} = V_{new} \cdot (1 - \delta_{age}) \cdot (1 - \delta_{condition}) \cdot (1 - \delta_{battery}) \cdot (1 + \beta_{warranty})$, labeled clearly as an **Experimental Heuristic** in the UI and API.
