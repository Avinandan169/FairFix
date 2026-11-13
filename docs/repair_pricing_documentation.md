# FAIRFIX — Illustrative Repair Cost Reference Catalogue & Decision Intelligence
> **Catalogue Classification:** Illustrative Repair Cost Reference Catalogue — Expert Heuristic Estimates  
> **Integrity Status:** Pedagogical / Academic Heuristic Benchmark (Unverified Digital Provenance)  
> **Last Technical Audit:** November 2026

---

## 1. Objective & Methodological Scope
Consumers in the Indian electronics market experience substantial variance in laptop repair quotes. Without transparent benchmark references, individuals are exposed to:
- Inflated prices for standard modular component replacements (screens, batteries, RAM).
- Ambiguous quotes conflating wholesale parts costs with labour fees.
- Misleading recommendations to replace entire motherboards when low-cost chip-level micro-soldering is viable.

FairFix implements an **Illustrative Repair Cost Reference Catalogue** based on expert heuristic estimates representing typical offline repair pricing conventions across Indian hardware tech hubs, accompanied by an automated Quote Audit Engine and a Repair-versus-Replace Economic Optimizer.

> [!WARNING]
> **Catalogue Status & Provenance Disclaimer:**  
> The price ranges in this catalogue represent illustrative heuristic estimates informed by offline component pricing conventions observed in Indian electronics tech hubs (Nehru Place, SP Road, Lamington Road). **They are NOT verified live market prices or real-time web scrapings.** A formal technical audit confirmed that 0 of the 33 catalogue source URLs resolve to verifiable live price quotes (15 represent synthetic domain placeholders, 16 returned HTTP 404/soft-404 errors, and 2 resolved to homepages without itemized prices). These figures are provided solely as baseline heuristics for student project demonstration and should not be used as commercial or legal repair cost certifications.

---

## 2. Technical Audit & Provenance Verification Findings

An exhaustive record-by-record HTTP probe and provenance audit was conducted across all 33 records in `datasets/reference/repair_pricing/repair_costs_india.csv`:

| Audit Category | Records | Status | Audit Assessment |
| :--- | :--- | :--- | :--- |
| **Synthetic / Placeholder Domains** | 15 / 33 | Non-resolving (`ENOTFOUND`) | Domains such as `sproadpc.in`, `nehruplaceparts.in`, and `lamingtonrepairs.in` do not exist in public DNS. They were created as mock placeholders. |
| **Dead / Expired Service Links** | 16 / 33 | Broken (`HTTP 404 / Soft-404`) | Third-party links to service aggregators or OEM knowledge-bases that no longer resolve to itemized pricing cards. |
| **General Portals (Unverified Price)** | 2 / 33 | Accessible (`HTTP 200`) | Aggregator homepages (e.g., Cashify, ShatterFix) accessible, but specific component price models require interactive postal code entry and vary dynamically; prices are heuristic composites. |
| **Independently Verified Live Records** | **0 / 33** | **Unverified Digital Provenance** | **No record has an independently verifiable, live online price point.** |

### Credibility Actions Taken:
1. Reclassified all 33 records from `"verified_market_survey"` to `"illustrative_heuristic_estimate"`.
2. Reclassified `source_type` from physical survey to `"contextual_reference"` or `"synthetic_placeholder"`.
3. Prepeneded explicit provenance audit warnings into the `notes` column of every record.
4. Integrated disclaimer flags (`is_heuristic: true`, `catalogue_classification`, and explanatory disclaimers) across backend API responses and frontend UI views.

---

## 3. Catalogue Schema & Heuristic Pricing Reference

Each record in `datasets/reference/repair_pricing/repair_costs_india.csv` captures:
`record_id, laptop_brand, laptop_model_or_compatible_category, component, repair_type, part_description, part_price_min, part_price_max, labour_min, labour_max, currency, market_location, source_name, source_url, source_type, date_collected, verification_status, notes`.

### Illustrative Component Benchmarks (INR)

*Note: The ranges below reflect expert heuristic estimates typical of independent Indian electronics service centres.*

| Component | Standard Part Description | Parts Range (₹) | Labour Range (₹) | Total Benchmark (₹) | Benchmark Basis |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Integrated screen** | 14.0/15.6" FHD 60Hz 30-pin IPS | ₹2,800 – ₹4,200 | ₹500 – ₹900 | **₹3,300 – ₹5,100** | Heuristic Estimate |
| **Integrated screen** | 15.6" FHD 144Hz 40-pin Gaming | ₹4,500 – ₹6,800 | ₹700 – ₹1,200 | **₹5,200 – ₹8,000** | Heuristic Estimate |
| **Integrated screen** | MacBook Air Retina Complete Assembly | ₹14,000 – ₹24,000 | ₹1,500 – ₹3,000 | **₹15,500 – ₹27,000** | Heuristic Estimate |
| **Power/battery** | Standard 3-cell/4-cell (41Wh–54Wh) | ₹1,800 – ₹3,200 | ₹300 – ₹600 | **₹2,100 – ₹3,800** | Heuristic Estimate |
| **Power/battery** | Gaming 4-cell/6-cell (70Wh–99Wh) | ₹3,800 – ₹6,500 | ₹500 – ₹900 | **₹4,300 – ₹7,400** | Heuristic Estimate |
| **Integrated keyboard**| Standard Chiclet Non-Backlit | ₹900 – ₹1,600 | ₹400 – ₹800 | **₹1,300 – ₹2,400** | Heuristic Estimate |
| **Integrated keyboard**| Backlit Gaming Keyboard Module | ₹1,800 – ₹3,500 | ₹600 – ₹1,200 | **₹2,400 – ₹4,700** | Heuristic Estimate |
| **Integrated keyboard**| Riveted Palmrest Assembly Welding | ₹2,200 – ₹4,500 | ₹1,000 – ₹1,800 | **₹3,200 – ₹6,300** | Heuristic Estimate |
| **System board** | Primary 19V Mosfet Micro-soldering | ₹600 – ₹1,400 | ₹1,800 – ₹3,500 | **₹2,400 – ₹4,900** | Heuristic Estimate |
| **System board** | Type-C Charging / PD IC Replacement | ₹800 – ₹1,800 | ₹1,500 – ₹3,200 | **₹2,300 – ₹5,000** | Heuristic Estimate |
| **System board** | BIOS SPI EEPROM Re-flashing | ₹400 – ₹900 | ₹1,200 – ₹2,200 | **₹1,600 – ₹3,100** | Heuristic Estimate |
| **Overheating** | Heatsink clean + Arctic MX-4 paste | ₹250 – ₹500 | ₹500 – ₹900 | **₹750 – ₹1,400** | Heuristic Estimate |
| **Internal storage** | 512GB M.2 NVMe SSD + Clean OS setup| ₹2,800 – ₹4,200 | ₹400 – ₹800 | **₹3,200 – ₹5,000** | Heuristic Estimate |
| **Performance** | 16GB DDR4/DDR5 SO-DIMM + Install | ₹2,900 – ₹4,600 | ₹200 – ₹500 | **₹3,100 – ₹5,100** | Heuristic Estimate |
| **Case/chassis** | Brass Standoff Epoxy Hinge Rebuild | ₹350 – ₹750 | ₹700 – ₹1,500 | **₹1,050 – ₹2,250** | Heuristic Estimate |

---

## 4. Technician Quote Evaluation Logic
The Quote Audit Engine compares quoted figures ($Q$) against reference min ($R_{min}$) and max ($R_{max}$) derived from the illustrative heuristic catalogue:

1. **`BELOW_REFERENCE` ($Q < 0.85 \times R_{min}$):**
   - Alert: Significantly below indicative reference range.
   - Caution: Risk of salvaged/counterfeit parts, low-grade third-party replicas, or omission of bench labor fees.
2. **`FAIR_AND_COMPETITIVE` ($0.85 \times R_{min} \le Q \le 1.10 \times R_{max}$):**
   - Normal market alignment. Competitive and fair rate for independent service.
3. **`SLIGHTLY_ABOVE_REFERENCE` ($1.10 \times R_{max} < Q \le 1.35 \times R_{max}$):**
   - Elevated quotation ($10\% - 35\%$ premium).
   - Feasible justification: Express same-day turnaround, doorstep pickup/drop, genuine OEM components, or extended 6-month warranty.
4. **`SIGNIFICANTLY_ABOVE_REFERENCE` ($Q > 1.35 \times R_{max}$):**
   - High markup ($>35\%$ above heuristic maximum).
   - Recommendation: Obtain a second independent quote or request an itemized parts vs labour invoice.

> [!NOTE]
> Quote audits are comparative heuristics intended for orientation. Unmodeled shop-specific factors such as technician certifications, official brand authorization fees, diagnostic bench fees, and micro-soldering warranties may legitimately affect final invoices.

---

## 5. Repair-versus-Replace Economic Decision Framework
The Decision Engine synthesizes the laptop's ML market value ($V_{market}$) with the estimated repair cost ($C_{repair}$):

$$\text{Repair Cost Ratio} = \frac{C_{repair}}{V_{market}}$$

### Heuristic Threshold Matrix
The decision framework implements a widely recognized consumer economics heuristic (the 30% / 50% repair rule):

- **Ratio $\le 30\%$ $\rightarrow$ `REPAIR_RECOMMENDED`:**
  - High residual equity retained. Low sunk capital relative to asset valuation.
- **Ratio $30\% - 50\%$ $\rightarrow$ `BORDERLINE_EVALUATE`:**
  - Evaluates device age, battery wear, and remaining useful life:
    - If device age $< 4$ years with acceptable processor generation and condition, repair is viable.
    - If device age $\ge 5$ years (`BORDERLINE_LEAN_REPLACE`), cumulative component degradation suggests replacement is more economical.
- **Ratio $> 50\%$ $\rightarrow$ `REPLACEMENT_RECOMMENDED`:**
  - Economically disproportionate. Investing over 50% of the asset's current market value into repairs yields negative expected return.

> [!IMPORTANT]
> **Heuristic Limitations:**
> This 30%/50% framework is an economic guideline, not an absolute financial guarantee. Decisions may vary based on personal workflow requirements, component availability, device sentimental value, or extended post-repair warranties.
