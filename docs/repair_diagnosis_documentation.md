# FAIRFIX — Machine Learning Repair Diagnosis & Fault Classification

## 1. Research Overview & Problem Context
Laptop faults frequently present as ambiguous physical symptoms to non-technical consumers (e.g., "laptop turns on but screen is black", "battery drops from 80% to dead in minutes", "shuts down during video games"). Without technical diagnostic equipment (multimeters, bench power supplies, oscilloscope analysis), consumers are vulnerable to inaccurate quotes, misdiagnosed root causes, or unnecessary full-motherboard replacements.

FairFix introduces an empirical, supervised Machine Learning Fault Classification engine trained on real-world community repair telemetry to isolate candidate failure categories from natural language symptom text.

---

## 2. Dataset Provenance & Ingestion
- **Dataset:** Open Repair Alliance (ORA) — CompCat Laptops (`compcat_laptops.csv` & `compcat_fault_types.csv`).
- **Primary Source:** https://github.com/openrepair/data/tree/main/quests/computers
- **License:** Open Data Commons Open Database License (ODbL).
- **Total Ingested Records:** 3,511 real community repair events recorded across international repair cafes and community electronics workshops.

### Data Cleaning & Preprocessing Pipeline
1. **Text Extraction:** Ingested raw fixer descriptions (`problem` column), normalized whitespace, stripped carriage returns and non-printable control characters.
2. **Missingness Filtering:** Filtered out empty or sub-sentence entries ($< 4$ characters), retaining 2,743 descriptive fault records.
3. **Ambiguity Exclusion:** Excluded non-actionable meta-labels (`'Unknown'`, `'Multiple'`, `'Other'`).
4. **Class Support Thresholding:** Retained fault categories with $\ge 20$ empirical instances for statistical viability, yielding **2,404 clean, verified repair records across 17 distinct fault categories**.

### Empirical Class Distribution
| Rank | Fault Category | Sample Count | Primary Physical Subsystem |
| :--- | :--- | :--- | :--- |
| 1 | **Performance** | 398 | CPU/RAM utilization, background processes, throttling |
| 2 | **Power/battery** | 316 | Li-ion degradation, DC jack, charging circuitry |
| 3 | **Configuration** | 295 | BIOS settings, driver misconfiguration, display scaling |
| 4 | **Integrated screen** | 257 | LCD panel, eDP flex cable, backlight inverter |
| 5 | **Internal storage** | 184 | NVMe/SATA SSD health, bad sectors, corruption |
| 6 | **Operating system** | 177 | Bootloader, Windows/Linux system file corruption |
| 7 | **Boot** | 171 | POST failure, BIOS boot sequence, CMOS battery |
| 8 | **Ports/slots/connectors** | 127 | USB, Type-C PD, HDMI, headphone jack fractures |
| 9 | **Overheating** | 107 | Dried thermal paste, fan bearing wear, heatsink clogging |
| 10 | **Integrated keyboard** | 106 | Membrane/switch failure, flex ribbon corrosion |
| 11 | **Case/chassis** | 75 | Broken hinge mount standoffs, cracked top cover |
| 12 | **System board** | 72 | Shorted 19V Mosfets, buck controllers, damaged PCB |
| 13 | **Internal damage** | 59 | Physical drops, internal structural impact fractures |
| 14 | **Virus/malware** | 57 | Adware, cryptominers, browser hijackers |
| 15 | **Integrated media component**| 27 | Webcam, stereo microphone, internal speakers |
| 16 | **Integrated pointing device** | 25 | Trackpad sensor, haptic clicker, ribbon cable |
| 17 | **Integrated optical drive** | 23 | DVD-RW laser diode, eject mechanism |

---

## 3. NLP Feature Engineering & Model Selection
- **Feature Extraction:** Sublinear Term Frequency-Inverse Document Frequency (`TfidfVectorizer`).
  - N-gram range: $(1, 2)$ capturing unigrams ("battery", "flicker") and informative bigrams ("black screen", "dies immediately", "liquid spill").
  - Stop words: Standard English stopword list.
  - Vocabulary size: 4,000 features with minimum document frequency $\text{min\_df} = 2$.
- **Validation Strategy:** 80/20 Stratified Train/Test Split (1,923 training samples, 481 held-out test samples).
- **Candidate Architecture Comparison (5-Fold Stratified Cross-Validation on Training Split):**

| Model Candidate | 5-Fold CV Macro F1 | CV Macro F1 Std | 5-Fold CV Accuracy | Probability Calibration |
| :--- | :--- | :--- | :--- | :--- |
| **Calibrated Linear SVC** | **0.6696** | **±0.0260** | **72.28%** | **Sigmoid Platt Scaling (3-Fold)** |
| Linear SVC (Uncalibrated) | 0.6609 | ±0.0222 | 71.50% | None (Raw Decision Margin) |
| Logistic Regression (Balanced)| 0.6560 | ±0.0180 | 70.26% | Natural Softmax |
| Random Forest (150 Trees) | 0.6352 | ±0.0200 | 64.80% | Ensemble Frequency |
| Multinomial Naive Bayes | 0.5012 | ±0.0153 | 65.11% | Multinomial Likelihood |

---

## 4. Held-Out Test Set Performance (481 Unseen Samples)
- **Overall Accuracy:** **72.35%** (vs random chance baseline of $1/17 \approx 5.88\%$).
- **Macro F1 Score:** **0.6836**
- **Weighted F1 Score:** **0.7237**
- **Macro Precision:** **0.7359**
- **Macro Recall:** **0.6655**

### Per-Category Performance Breakdown
| Fault Category | Precision | Recall | F1-Score | Held-Out Support |
| :--- | :--- | :--- | :--- | :--- |
| **Integrated screen** | **91.7%** | **84.6%** | **0.880** | 52 |
| **Integrated keyboard** | 68.0% | 81.0% | 0.739 | 21 |
| **Boot** | 74.3% | 76.5% | 0.754 | 34 |
| **Power/battery** | 80.6% | 79.4% | 0.800 | 63 |
| **Overheating** | 88.2% | 71.4% | 0.789 | 21 |
| **Internal storage** | 77.4% | 64.9% | 0.706 | 37 |
| **Ports/slots/connectors** | 78.9% | 60.0% | 0.682 | 25 |
| **Case/chassis** | 69.2% | 60.0% | 0.643 | 15 |
| **Virus/malware** | 72.7% | 72.7% | 0.727 | 11 |
| **Operating system** | 58.1% | 51.4% | 0.545 | 35 |
| **Performance** | 67.5% | 67.5% | 0.675 | 80 |
| **System board** | 54.5% | 42.9% | 0.480 | 14 |

---

## 5. Confidence Thresholding & Limitations
1. **Confidence Gating:** Any inference yielding $< 35\%$ confidence automatically flags `status: "LOW_CONFIDENCE"`, signaling that reported symptoms overlap between multiple potential root causes.
2. **Input Validation:** Descriptions $< 5$ characters return `INSUFFICIENT_INPUT` with prompts for more specific symptom details.
3. **Hardware Limitation Disclaimer:** FairFix explicitly clarifies that text-based NLP classification serves as preliminary triage; it cannot detect physical short circuits, liquid damage corrosion, or intermittent signal noise that require multimeter inspection.
