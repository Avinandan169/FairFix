# FAIRFIX — Indian Laptop Repair Pricing & Decision Intelligence

## 1. Objective & Methodological Basis
Consumers in the Indian electronics market experience substantial variance in laptop repair quotes. Without transparent benchmark references, individuals are exposed to:
- Inflated prices for standard modular component replacements (screens, batteries, RAM).
- Ambiguous quotes conflating wholesale parts costs with labour fees.
- Misleading recommendations to replace entire motherboards when low-cost chip-level micro-soldering is viable.

FairFix implements an empirical, verifiable pricing catalogue curated from primary hardware tech hubs across India, accompanied by an automated Quote Audit Engine and a Repair-versus-Replace Economic Optimizer.

---

## 2. Pricing Data Provenance & Structure
The benchmark repository (`datasets/reference/repair_pricing/repair_costs_india.csv`) records 33 verified price benchmarks spanning:
- **Major Hardware Hubs:**
  - Nehru Place (New Delhi) — India's largest wholesale IT hardware district.
  - SP Road / Sadar Patrappa Road (Bengaluru) — Core electronics and spares hub.
  - Lamington Road (Mumbai) — Western India spares and BGA rework centre.
- **Service Chains & Authorized Matrices:**
  - Cashify Repair & ShatterFix published rate cards.
  - Authorized OEM Out-of-Warranty Service Matrices (Dell, HP, Lenovo, Apple).

### Catalogue Schema
Each record captures:
`record_id, laptop_brand, laptop_model_or_compatible_category, component, repair_type, part_description, part_price_min, part_price_max, labour_min, labour_max, currency, market_location, source_name, source_url, source_type, date_collected, verification_status, notes`.

---

## 3. Component Benchmark Summary (INR)

| Component | Standard Part Description | Parts Range (₹) | Labour Range (₹) | Total Benchmark (₹) |
| :--- | :--- | :--- | :--- | :--- |
| **Integrated screen** | 14.0/15.6" FHD 60Hz 30-pin IPS | ₹2,800 – ₹4,200 | ₹500 – ₹900 | **₹3,300 – ₹5,100** |
| **Integrated screen** | 15.6" FHD 144Hz 40-pin Gaming | ₹4,500 – ₹6,800 | ₹700 – ₹1,200 | **₹5,200 – ₹8,000** |
| **Integrated screen** | MacBook Air Retina Complete Assembly | ₹14,000 – ₹24,000 | ₹1,500 – ₹3,000 | **₹15,500 – ₹27,000** |
| **Power/battery** | Standard 3-cell/4-cell (41Wh–54Wh) | ₹1,800 – ₹3,200 | ₹300 – ₹600 | **₹2,100 – ₹3,800** |
| **Power/battery** | Gaming 4-cell/6-cell (70Wh–99Wh) | ₹3,800 – ₹6,500 | ₹500 – ₹900 | **₹4,300 – ₹7,400** |
| **Integrated keyboard**| Standard Chiclet Non-Backlit | ₹900 – ₹1,600 | ₹400 – ₹800 | **₹1,300 – ₹2,400** |
| **Integrated keyboard**| Backlit Gaming Keyboard Module | ₹1,800 – ₹3,500 | ₹600 – ₹1,200 | **₹2,400 – ₹4,700** |
| **Integrated keyboard**| Riveted Palmrest Assembly Welding | ₹2,200 – ₹4,500 | ₹1,000 – ₹1,800 | **₹3,200 – ₹6,300** |
| **System board** | Primary 19V Mosfet Micro-soldering | ₹600 – ₹1,400 | ₹1,800 – ₹3,500 | **₹2,400 – ₹4,900** |
| **System board** | Type-C Charging / PD IC Replacement | ₹800 – ₹1,800 | ₹1,500 – ₹3,200 | **₹2,300 – ₹5,000** |
| **System board** | BIOS SPI EEPROM Re-flashing | ₹400 – ₹900 | ₹1,200 – ₹2,200 | **₹1,600 – ₹3,100** |
| **Overheating** | Heatsink clean + Arctic MX-4 paste | ₹250 – ₹500 | ₹500 – ₹900 | **₹750 – ₹1,400** |
| **Internal storage** | 512GB M.2 NVMe SSD + Clean OS setup| ₹2,800 – ₹4,200 | ₹400 – ₹800 | **₹3,200 – ₹5,000** |
| **Performance** | 16GB DDR4/DDR5 SO-DIMM + Install | ₹2,900 – ₹4,600 | ₹200 – ₹500 | **₹3,100 – ₹5,100** |
| **Case/chassis** | Brass Standoff Epoxy Hinge Rebuild | ₹350 – ₹750 | ₹700 – ₹1,500 | **₹1,050 – ₹2,250** |

---

## 4. Technician Quote Evaluation Logic
The Quote Audit Engine compares quoted figures ($Q$) against reference min ($R_{min}$) and max ($R_{max}$):

1. **`BELOW_REFERENCE` ($Q < 0.85 \times R_{min}$):**
   - Alert: Suspiciously low pricing.
   - Caution: Risk of salvaged/counterfeit parts, low-grade third-party replicas, or omission of bench labor fees.
2. **`FAIR_AND_COMPETITIVE` ($0.85 \times R_{min} \le Q \le 1.10 \times R_{max}$):**
   - Normal market alignment. Competitive and fair rate for independent service.
3. **`SLIGHTLY_ABOVE_REFERENCE` ($1.10 \times R_{max} < Q \le 1.35 \times R_{max}$):**
   - Elevated quotation ($10\% - 35\%$ premium).
   - Feasible justification: Express same-day turnaround, doorstep pickup/drop, genuine OEM components, or extended 6-month warranty.
4. **`SIGNIFICANTLY_ABOVE_REFERENCE` ($Q > 1.35 \times R_{max}$):**
   - High markup ($>35\%$ above market maximum).
   - Recommendation: Obtain a second independent quote or request an itemized parts vs labour invoice.

---

## 5. Repair-versus-Replace Economic Decision Framework
The Decision Engine synthesizes the laptop's ML market value ($V_{market}$) with the estimated repair cost ($C_{repair}$):

$$\text{Repair Cost Ratio} = \frac{C_{repair}}{V_{market}}$$

### Decision Matrix
- **Ratio $\le 30\%$ $\rightarrow$ `REPAIR_RECOMMENDED`:**
  - High residual equity retained. Low sunk capital.
- **Ratio $30\% - 50\%$ $\rightarrow$ `BORDERLINE_EVALUATE`:**
  - Evaluate device age and overall condition:
    - If device age $< 4$ years with healthy battery and acceptable processor performance, repair is justifiable.
    - If device age $\ge 5$ years (`BORDERLINE_LEAN_REPLACE`), cumulative degradation of other components indicates poor ROI.
- **Ratio $> 50\%$ $\rightarrow$ `REPLACEMENT_RECOMMENDED`:**
  - Economically disproportionate. Investing more than half of the machine's value into repairs yields negative expected return.
