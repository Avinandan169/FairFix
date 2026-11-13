'use client';

import {
  BookOpen,
  ShieldCheck,
  Cpu,
  Layers,
  Database,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  GitBranch
} from 'lucide-react';

export default function MethodologyPage() {
  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 space-y-2">
        <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-semibold">
          Academic Documentation & Methodology
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          How FairFix Works
        </h1>
        <p className="text-sm text-slate-400">
          A transparent engineering guide explaining dataset curation, anti-leakage defenses, model selection, and literature foundation.
        </p>
      </div>

      {/* 1. Problem Statement */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="h-6 w-6 rounded-md bg-cyan-600 text-white flex items-center justify-center text-xs font-mono">1</span>
          <span>Problem Statement & Consumer Market Friction</span>
        </h2>
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-sm text-slate-300 leading-relaxed space-y-3">
          <p>
            When purchasing second-hand or out-of-warranty laptops, consumers encounter significant information opacity. Laptop value is determined by complex multi-variable interactions across:
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono text-cyan-300 pt-2">
            <li>• Brand positioning & build</li>
            <li>• CPU generation & core counts</li>
            <li>• Discrete GPU series & VRAM</li>
            <li>• RAM capacity & speed</li>
            <li>• Display pixel density (PPI)</li>
            <li>• Physical elapsed age (months)</li>
            <li>• Battery health percentage</li>
            <li>• Cosmetic & screen condition</li>
            <li>• Manufacturer warranty status</li>
          </ul>
          <p className="pt-2 text-slate-400">
            Unlike cars or real estate, electronics lack standardized blue-book valuations. Sellers frequently ask for inflated prices on outdated dual-core systems, while non-technical buyers struggle to compare specifications accurately. FairFix replaces guesswork with verifiable Machine Learning intelligence.
          </p>
        </div>
      </section>

      {/* 2. Dataset Curation & Anti-Merge Decision */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="h-6 w-6 rounded-md bg-cyan-600 text-white flex items-center justify-center text-xs font-mono">2</span>
          <span>Dataset Curation & Compatibility Integrity</span>
        </h2>
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-sm text-slate-300 leading-relaxed space-y-4">
          <p>
            We investigated six candidate datasets before selecting our primary training data. Crucially, <strong>we rejected the naive merger of foreign-currency datasets</strong> for two mathematical and economic reasons:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">
                A. Currency & Tariffs (PPP Distortion)
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Indian consumer electronics carry an 18% Goods & Services Tax (GST) plus ~10-15% import tariffs on assembled components. A €1,000 laptop in Germany retails for ₹1,15,000 to ₹1,30,000 in India. Multiplying foreign datasets by nominal spot exchange rates injects massive artificial variance into the target variable.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">
                B. Generational Collision Drift
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The Kaggle <code>muhammetvarl/laptop-price</code> dataset dates from 2017-2018 (featuring 7th/8th Gen quad-core CPUs and GTX 1050 GPUs). The Indian dataset represents modern 2023-2025 hardware (Intel Core Ultra with NPU, 14th Gen 20-core CPUs, RTX 40/50 series). Merging them causes catastrophic feature collision where an older 4-core i7 is priced identically to a 20-core modern i7.
              </p>
            </div>
          </div>

          <p className="text-xs text-emerald-400 pt-2">
            ✓ <strong>Final Decision:</strong> Primary training was conducted exclusively on the modern <strong>Indian Laptop Specifications Dataset</strong> (992 rows, 27 engineered features, priced in INR ₹). Foreign datasets were retained strictly for external benchmarking.
          </p>
        </div>
      </section>

      {/* 3. Anti-Leakage Defense: GroupKFold Cross-Validation */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="h-6 w-6 rounded-md bg-cyan-600 text-white flex items-center justify-center text-xs font-mono">3</span>
          <span>Anti-Leakage Validation (GroupKFold by Chassis Series)</span>
        </h2>
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-sm text-slate-300 leading-relaxed space-y-3">
          <p>
            A common flaw in academic ML projects is <strong>configuration leakage</strong>: when a laptop brand sells three variants of the same chassis (e.g., <em>Lenovo Legion Pro 5</em> with 16GB RAM vs 32GB RAM), ordinary random train/test splitting places one variant in train and another in test. The model memorizes the chassis name rather than learning general hardware physics.
          </p>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-slate-400">Standard 5-Fold CV: </span>
              <span className="text-blue-400 font-bold">R² = 0.9256 (±0.0157)</span>
            </div>
            <div>
              <span className="text-slate-400">Chassis-Grouped CV (GroupKFold): </span>
              <span className="text-indigo-400 font-bold">R² = 0.8738 (±0.0727)</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Our strict GroupKFold evaluation withholds complete product chassis lines from training folds, verifying genuine inductive transfer to completely unobserved laptop designs.
          </p>
        </div>
      </section>

      {/* 4. Why Gradient Boosting Won */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="h-6 w-6 rounded-md bg-cyan-600 text-white flex items-center justify-center text-xs font-mono">4</span>
          <span>Why Gradient Boosting Won the Benchmark</span>
        </h2>
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-sm text-slate-300 leading-relaxed space-y-3">
          <p>
            We evaluated six models (Linear Regression, Ridge, Decision Tree, Random Forest, XGBoost, CatBoost, Gradient Boosting). <strong>Gradient Boosting achieved the best empirical balance</strong>:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-mono pt-2">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500">Test Set R²</span>
              <div className="text-lg font-bold text-emerald-400 mt-1">0.9307</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500">Test Set MAE</span>
              <div className="text-lg font-bold text-cyan-400 mt-1">₹11,230</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500">Standard 5-Fold CV</span>
              <div className="text-lg font-bold text-blue-400 mt-1">0.9256</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500">GroupKFold CV</span>
              <div className="text-lg font-bold text-indigo-400 mt-1">0.8738</div>
            </div>
          </div>
          <p className="text-xs text-slate-400 pt-2">
            While Linear Regression scored high on the test split ($R^2 = 0.9448$), it suffered higher average error (MAE = ₹13,338 vs ₹11,230) and lower cross-validation stability. Random Forest underperformed boosted architectures due to extreme non-linear price spikes in flagship gaming hardware.
          </p>
        </div>
      </section>

      {/* 5. Used-Laptop Valuation Layer & Literature Citation */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="h-6 w-6 rounded-md bg-cyan-600 text-white flex items-center justify-center text-xs font-mono">5</span>
          <span>Used Laptop Valuation Layer (Literature Foundation)</span>
        </h2>
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-sm text-slate-300 leading-relaxed space-y-4">
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-300 space-y-2">
            <h4 className="font-bold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Academic Integrity Notice: Separation of New vs Used Models</span>
            </h4>
            <p className="leading-relaxed">
              Because public e-commerce datasets contain listed new-laptop retail prices rather than authenticated second-hand cash transactions, we <strong>do not misrepresent</strong> our supervised ML model as a second-hand resale model. Instead:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>ML Regression Model:</strong> Predicts current new replacement market value V_new.</li>
              <li><strong>Used Valuation Layer:</strong> Applies an econometric multi-factor depreciation heuristic V_used = V_new × (1 - δ_total) grounded in peer-reviewed electronics remanufacturing literature.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Depreciation Formulation (Based on Türkolmez et al. 2024):
            </h4>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300">
              δ_total = min(0.85, δ_age + δ_battery + δ_cosmetic + δ_screen - β_warranty)
            </div>
            <ul className="text-xs text-slate-400 space-y-1 pt-2">
              <li>• δ_age = 1 - (1 - 0.22)^(months / 12) (annual 22% compound decay curve)</li>
              <li>• δ_battery ∈ [0.0, 0.20] based on battery capacity health</li>
              <li>• δ_cosmetic ∈ [0.02, 0.28] (Like New, Good, Fair, Poor)</li>
              <li>• δ_screen ∈ [0.0, 0.25] (Flawless, Scratches, Dead Pixels)</li>
              <li>• β_warranty = 0.06 active warranty retention credit</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. Academic Citations */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="h-6 w-6 rounded-md bg-cyan-600 text-white flex items-center justify-center text-xs font-mono">6</span>
          <span>Peer-Reviewed Literature References</span>
        </h2>
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
            <div className="font-bold text-white">1. Türkolmez et al. (2024)</div>
            <div className="text-slate-400">
              <em>Machine Learning Algorithms for Pricing End-of-Life Remanufactured Laptops.</em> <strong>Information Systems Frontiers</strong>, Springer.
            </div>
            <a
              href="https://doi.org/10.1007/s10796-024-10515-9"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-1 pt-1 font-mono text-[11px]"
            >
              <span>https://doi.org/10.1007/s10796-024-10515-9</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
            <div className="font-bold text-white">2. Kuchkorov et al. (2024)</div>
            <div className="text-slate-400">
              <em>Machine Learning-based Price Prediction and Analysis of Laptop Specifications.</em> In <strong>2024 International Conference on Information Science and Communications Technologies (ICISCT)</strong>, IEEE.
            </div>
            <a
              href="https://doi.org/10.1109/ICISCT64202.2024.10957051"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-1 pt-1 font-mono text-[11px]"
            >
              <span>https://doi.org/10.1109/ICISCT64202.2024.10957051</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
            <div className="font-bold text-white">3. Gupta, Jain, & Singh (2025)</div>
            <div className="text-slate-400">
              <em>Laptop Price Estimation Using Data-Driven Predictive Analytics.</em> <strong>International Journal of Scientific and Academic Research (IJSAT)</strong>, 16(2), pp. 65-74.
            </div>
            <a
              href="https://doi.org/10.71097/IJSAT.v16.i2.6502"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-1 pt-1 font-mono text-[11px]"
            >
              <span>https://doi.org/10.71097/IJSAT.v16.i2.6502</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
