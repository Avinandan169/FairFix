'use client';

import Link from 'next/link';
import {
  BookOpen,
  Laptop,
  Wrench,
  Scale,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  ArrowRight,
  Info
} from 'lucide-react';

export default function MethodologyPage() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="border-b border-slate-200/80 pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <BookOpen className="h-3.5 w-3.5 text-slate-700" />
          <span>Technical Reference &amp; Academic Methodology</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          How FairFix Works
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          An engineering guide documenting dataset curation, machine learning model architectures, anti-leakage cross-validation, and consumer economics heuristics.
        </p>
      </div>

      {/* 1. System Architecture & Dual Engine Overview */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs font-bold">1</span>
          <h2 className="text-lg font-bold text-slate-900">Dual Engine Architecture</h2>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
          <p>
            FairFix separates device valuation from repair intelligence into two modular, independent engines, synthesized by an economic decision layer:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block">Engine 01: Valuation</span>
              <p className="text-xs text-slate-600">
                Supervised regression pipeline predicting new replacement price baselines in INR, adjusted via peer-reviewed econometric depreciation curves (Türkolmez et al. 2024).
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block">Engine 02: Repair &amp; Quote Audit</span>
              <p className="text-xs text-slate-600">
                Supervised NLP symptom classifier (Calibrated Linear SVC) predicting failure categories from natural language, paired with an illustrative heuristic pricing catalogue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Laptop Valuation: Methodology & Model Selection */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs font-bold">2</span>
          <h2 className="text-lg font-bold text-slate-900">Valuation: Dataset Curation &amp; Model Benchmark</h2>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            Primary training was conducted on the <strong>Indian Laptop Specifications Dataset</strong> (992 rows, 27 engineered features, priced in INR ₹). Foreign datasets (EUR, USD) were not merged to prevent Purchasing Power Parity (PPP) distortion and generational feature collisions.
          </p>

          {/* Regression Candidates Comparison Table */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
              Regression Architecture Benchmark (80/20 Train/Test Split)
            </span>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Algorithm</th>
                    <th className="py-2.5 px-3">Test R²</th>
                    <th className="py-2.5 px-3">Test MAE (₹)</th>
                    <th className="py-2.5 px-3">5-Fold CV R²</th>
                    <th className="py-2.5 px-3">GroupKFold R²</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr className="bg-slate-50/50 font-medium text-slate-900">
                    <td className="py-2.5 px-3 font-bold">Gradient Boosting Regressor</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">0.9307</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">₹11,230</td>
                    <td className="py-2.5 px-3">0.9256</td>
                    <td className="py-2.5 px-3">0.8738</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">★ Champion</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3">XGBoost Regressor</td>
                    <td className="py-2.5 px-3">0.9267</td>
                    <td className="py-2.5 px-3">₹11,425</td>
                    <td className="py-2.5 px-3">0.9254</td>
                    <td className="py-2.5 px-3">0.8665</td>
                    <td className="py-2.5 px-3 text-slate-500">Runner-Up</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3">Linear Regression</td>
                    <td className="py-2.5 px-3">0.9448</td>
                    <td className="py-2.5 px-3">₹13,338</td>
                    <td className="py-2.5 px-3">0.8961</td>
                    <td className="py-2.5 px-3">0.8359</td>
                    <td className="py-2.5 px-3 text-slate-500">Baseline</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3">CatBoost Regressor</td>
                    <td className="py-2.5 px-3">0.8804</td>
                    <td className="py-2.5 px-3">₹12,648</td>
                    <td className="py-2.5 px-3">0.9212</td>
                    <td className="py-2.5 px-3">0.8648</td>
                    <td className="py-2.5 px-3 text-slate-500">Evaluated</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3">Random Forest Regressor</td>
                    <td className="py-2.5 px-3">0.8392</td>
                    <td className="py-2.5 px-3">₹14,967</td>
                    <td className="py-2.5 px-3">0.8810</td>
                    <td className="py-2.5 px-3">0.8309</td>
                    <td className="py-2.5 px-3 text-slate-500">Evaluated</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3">Decision Tree Regressor</td>
                    <td className="py-2.5 px-3">0.9062</td>
                    <td className="py-2.5 px-3">₹14,445</td>
                    <td className="py-2.5 px-3">0.8036</td>
                    <td className="py-2.5 px-3">0.7806</td>
                    <td className="py-2.5 px-3 text-slate-500">Baseline</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
            <span className="font-bold text-slate-900">Why Gradient Boosting Was Selected:</span>
            <p>
              Gradient Boosting achieved the lowest mean absolute financial error (₹11,230 per laptop), the highest cross-validation stability (0.9256), and demonstrated strong resilience to chassis leakage under strict <code>GroupKFold</code> validation (0.8738).
            </p>
          </div>
        </div>
      </section>

      {/* 3. Second-Hand Depreciation Formulation */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs font-bold">3</span>
          <h2 className="text-lg font-bold text-slate-900">Second-Hand Valuation &amp; Depreciation Heuristics</h2>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Info className="h-4 w-4 text-slate-600 shrink-0" />
              <span>Academic Integrity: Separation of New vs Used Models</span>
            </span>
            <p>
              E-commerce datasets contain listed new retail prices, not authenticated second-hand cash transactions. FairFix strictly separates new retail price prediction from used-device depreciation:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li><strong>ML Regression:</strong> Predicts current new replacement market value (V_new).</li>
              <li><strong>Used Valuation Layer:</strong> Applies an econometric multi-factor depreciation heuristic grounded in peer-reviewed electronics remanufacturing literature (Türkolmez et al. 2024).</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
            <span className="font-bold text-slate-900 uppercase tracking-wider block">
              Depreciation Model Formulation:
            </span>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200 font-mono text-[11px] text-slate-800">
              δ_total = min(0.85, δ_age + δ_battery + δ_cosmetic + δ_screen - β_warranty)
            </div>
            <ul className="space-y-1 text-slate-600 pt-1 text-[11px]">
              <li>• δ_age = 1 - (1 - 0.22)^(months / 12) (annual 22% compound decay curve)</li>
              <li>• δ_battery ∈ [0.0, 0.20] based on Li-ion battery capacity percentage</li>
              <li>• δ_cosmetic ∈ [0.02, 0.28] for casing wear (Like New, Good, Fair, Poor)</li>
              <li>• δ_screen ∈ [0.0, 0.25] for panel scratch and pixel condition</li>
              <li>• β_warranty = 0.06 active manufacturer warranty retention credit</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. ML Fault Diagnosis: Architecture & Robustness */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs font-bold">4</span>
          <h2 className="text-lg font-bold text-slate-900">Fault Diagnosis: NLP Classifier &amp; Leakage Audit</h2>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            Trained on <strong>2,404 curated community repair records</strong> from the Open Repair Alliance (CompCat) across 17 empirical failure categories. Features are extracted via sublinear TF-IDF (1, 2 n-grams, min_df=2, 4,000 features).
          </p>

          {/* Classifier Comparison Table */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
              Classifier Candidates Benchmark (5-Fold Stratified Cross-Validation)
            </span>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Model Candidate</th>
                    <th className="py-2.5 px-3">CV Macro F1</th>
                    <th className="py-2.5 px-3">CV Accuracy</th>
                    <th className="py-2.5 px-3">Calibration Method</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr className="bg-slate-50/50 font-medium text-slate-900">
                    <td className="py-2.5 px-3 font-bold">Calibrated Linear SVC</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">0.6696 (±0.026)</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">72.28%</td>
                    <td className="py-2.5 px-3">Sigmoid Platt Scaling</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">★ Selected</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3">Linear SVC (Uncalibrated)</td>
                    <td className="py-2.5 px-3">0.6609 (±0.022)</td>
                    <td className="py-2.5 px-3">71.50%</td>
                    <td className="py-2.5 px-3">None (Raw Margin)</td>
                    <td className="py-2.5 px-3 text-slate-500">Evaluated</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3">Logistic Regression (Balanced)</td>
                    <td className="py-2.5 px-3">0.6560 (±0.018)</td>
                    <td className="py-2.5 px-3">70.26%</td>
                    <td className="py-2.5 px-3">Natural Softmax</td>
                    <td className="py-2.5 px-3 text-slate-500">Evaluated</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3">Random Forest (150 Trees)</td>
                    <td className="py-2.5 px-3">0.6352 (±0.020)</td>
                    <td className="py-2.5 px-3">64.80%</td>
                    <td className="py-2.5 px-3">Ensemble Frequency</td>
                    <td className="py-2.5 px-3 text-slate-500">Evaluated</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3">Multinomial Naive Bayes</td>
                    <td className="py-2.5 px-3">0.5012 (±0.015)</td>
                    <td className="py-2.5 px-3">65.11%</td>
                    <td className="py-2.5 px-3">Multinomial Likelihood</td>
                    <td className="py-2.5 px-3 text-slate-500">Baseline</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Tri-Angle Leakage Audit Matrix */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
              Data Science Leakage Audit &amp; Generalization Robustness Matrix
            </span>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Evaluation Scope</th>
                    <th className="py-2.5 px-3">Samples</th>
                    <th className="py-2.5 px-3">Accuracy</th>
                    <th className="py-2.5 px-3">Macro F1</th>
                    <th className="py-2.5 px-3">Methodological Significance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-slate-900">1. Standard Held-Out Test Split</td>
                    <td className="py-2.5 px-3 font-mono">481</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">72.35%</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">0.6836</td>
                    <td className="py-2.5 px-3 text-slate-500">Primary unseen held-out test partition</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-slate-900">2. Novel Text Subset (Exact Duplicates Out)</td>
                    <td className="py-2.5 px-3 font-mono">400</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">67.50%</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">0.6456</td>
                    <td className="py-2.5 px-3 text-slate-500">Filters 81 instances whose exact string appeared in training</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="py-2.5 px-3 font-medium text-slate-900">3. Semantic Cluster GroupKFold (5-Fold)</td>
                    <td className="py-2.5 px-3 font-mono">2,404 (1,991 clusters)</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-700">72.50% (±1.8%)</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-700">0.6797 (±0.014)</td>
                    <td className="py-2.5 px-3 text-slate-700">Zero verbatim or near-duplicate leakage across folds</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Repair Pricing Catalogue Provenance */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs font-bold">5</span>
          <h2 className="text-lg font-bold text-slate-900">Repair Pricing Catalogue Provenance &amp; Disclaimers</h2>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            The 33-record repair pricing catalogue represents typical component and labour price ranges across Indian electronics tech hubs (Nehru Place, SP Road, Lamington Road).
          </p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <span className="font-bold text-slate-900">Technical Audit Finding:</span>
            <p className="text-slate-600">
              A formal HTTP probe audit established that 0 of the 33 URLs resolve to independently verified live price feeds (15 represent placeholder domains, 16 return 404/soft-404 errors, and 2 resolve to aggregate portals without itemized prices).
            </p>
            <p className="text-slate-800 font-medium pt-1">
              ✓ <strong>Classification:</strong> Formally classified as an <em>Illustrative Repair Cost Reference Catalogue — Expert Heuristic Estimates</em>. All pricing and quote evaluation endpoints include explicit provenance disclaimers.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Literature References */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs font-bold">6</span>
          <h2 className="text-lg font-bold text-slate-900">Peer-Reviewed Literature References</h2>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm text-xs space-y-1">
            <span className="font-bold text-slate-900">1. Türkolmez et al. (2024)</span>
            <p className="text-slate-600">
              <em>Machine Learning Algorithms for Pricing End-of-Life Remanufactured Laptops.</em> <strong>Information Systems Frontiers</strong>, Springer.
            </p>
            <a
              href="https://doi.org/10.1007/s10796-024-10515-9"
              target="_blank"
              rel="noreferrer"
              className="text-slate-500 hover:text-slate-900 flex items-center gap-1 pt-1 font-mono text-[11px]"
            >
              <span>https://doi.org/10.1007/s10796-024-10515-9</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm text-xs space-y-1">
            <span className="font-bold text-slate-900">2. Kuchkorov et al. (2024)</span>
            <p className="text-slate-600">
              <em>Machine Learning-based Price Prediction and Analysis of Laptop Specifications.</em> In <strong>2024 International Conference on Information Science and Communications Technologies (ICISCT)</strong>, IEEE.
            </p>
            <a
              href="https://doi.org/10.1109/ICISCT64202.2024.10957051"
              target="_blank"
              rel="noreferrer"
              className="text-slate-500 hover:text-slate-900 flex items-center gap-1 pt-1 font-mono text-[11px]"
            >
              <span>https://doi.org/10.1109/ICISCT64202.2024.10957051</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm text-xs space-y-1">
            <span className="font-bold text-slate-900">3. Gupta, Jain, &amp; Singh (2025)</span>
            <p className="text-slate-600">
              <em>Laptop Price Estimation Using Data-Driven Predictive Analytics.</em> <strong>International Journal of Scientific and Academic Research (IJSAT)</strong>, 16(2), pp. 65-74.
            </p>
            <a
              href="https://doi.org/10.71097/IJSAT.v16.i2.6502"
              target="_blank"
              rel="noreferrer"
              className="text-slate-500 hover:text-slate-900 flex items-center gap-1 pt-1 font-mono text-[11px]"
            >
              <span>https://doi.org/10.71097/IJSAT.v16.i2.6502</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </section>

      {/* Link to Full Model Performance Dashboard */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-900">Need interactive model telemetry &amp; residual charts?</h4>
          <p className="text-xs text-slate-600">
            Inspect live SHAP tree feature importances, price tier error distributions, and diagnostic calibration plots.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 shadow-sm transition-colors shrink-0"
        >
          <BarChart3 className="h-3.5 w-3.5" />
          <span>Open Model Telemetry</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}