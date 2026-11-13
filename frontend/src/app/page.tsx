'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ShieldCheck,
  Cpu,
  BarChart3,
  TrendingDown,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Layers,
  HelpCircle,
  Wrench,
  Scale,
  TrendingUp,
  DollarSign
} from 'lucide-react';

export default function HomePage() {
  const [selectedPreset, setSelectedPreset] = useState<'gaming' | 'macbook' | 'budget'>('gaming');

  const presets = {
    gaming: {
      title: 'Lenovo Legion Pro 5',
      specs: 'Core Ultra 7 255HX • 32GB RAM • 1TB SSD • RTX 5060 (8GB) • 16" 2.5K 165Hz',
      newEstimate: '₹1,93,600',
      askingPrice: '₹1,85,000',
      verdict: 'Fair Price (-₹8,600)',
      badgeClass: 'bg-blue-950 text-blue-400 border-blue-800',
      usedNote: 'New Retail Listing Baseline',
      drivers: ['+₹47,968 for 32GB RAM', '+₹18,311 for 2.5K Display', '+₹11,514 for 8GB VRAM']
    },
    macbook: {
      title: 'Apple MacBook Air 13',
      specs: 'Apple M3 8-Core • 16GB Unified RAM • 512GB SSD • 13.6" Liquid Retina',
      newEstimate: '₹1,24,900',
      askingPrice: '₹89,000 (Used: 14 mos, 88% Battery)',
      verdict: 'Great Deal (18% below fair used valuation)',
      badgeClass: 'bg-emerald-950 text-emerald-400 border-emerald-800',
      usedNote: 'Used Depreciation Applied: -34.8%',
      drivers: ['+₹28,500 for Apple Silicon M3', '+₹14,200 for 16GB Memory', '-₹43,500 Age & Battery Wear']
    },
    budget: {
      title: 'HP Pavilion 15 (Used)',
      specs: '13th Gen Core i5 13420H • 16GB RAM • 512GB SSD • Iris Xe • 15.6" FHD',
      newEstimate: '₹53,000 (New Baseline)',
      askingPrice: '₹42,000 (Seller Asking)',
      verdict: 'Significantly Overpriced (+65% above fair value)',
      badgeClass: 'bg-red-950 text-red-400 border-red-800',
      usedNote: 'Fair Second-Hand Value: ₹25,400',
      drivers: ['-₹20,800 for 24-Month Age', '-₹3,200 for 78% Battery', '-₹3,600 Cosmetic Fair Grade']
    }
  };

  const active = presets[selectedPreset];

  return (
    <div className="space-y-24 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-6 sm:pt-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 shadow-inner">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400"></span>
          <span>FairFix — Independent Repair & Price Intelligence for Electronics</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          Understand what your device is worth,{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
            what it costs to fix,
          </span>{' '}
          and whether the deal is fair.
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
          FairFix combines trained Machine Learning regression models ($R^2 = 0.9307$) for laptop market valuation with supervised
          NLP fault diagnosis and verified Indian repair cost benchmarks (Nehru Place, SP Road, Lamington Road) to empower consumer decisions.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/valuation"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all text-base"
          >
            <Cpu className="h-5 w-5" />
            <span>Laptop Valuation Studio</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/repair"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 shadow-lg shadow-slate-950 transition-all text-base"
          >
            <Wrench className="h-5 w-5 text-cyan-400" />
            <span>Repair Intelligence & Quotes</span>
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-400 hover:text-white bg-transparent hover:bg-slate-900/60 border border-transparent hover:border-slate-800 transition-all text-base"
          >
            <BarChart3 className="h-5 w-5" />
            <span>ML Telemetry (R² 0.93)</span>
          </Link>
        </div>

        {/* Live Empirical Stat Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-900 text-left">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-2xl font-bold text-emerald-400 font-mono">0.9307</div>
            <div className="text-xs text-slate-400 font-medium">Valuation Test R²</div>
            <div className="text-[11px] text-slate-500">Target R² &gt; 0.90 Met</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-2xl font-bold text-cyan-400 font-mono">₹11,230</div>
            <div className="text-xs text-slate-400 font-medium">Mean Absolute Error</div>
            <div className="text-[11px] text-slate-500">Out-of-sample in INR</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-2xl font-bold text-blue-400 font-mono">72.4%</div>
            <div className="text-xs text-slate-400 font-medium">Diagnosis Accuracy</div>
            <div className="text-[11px] text-slate-500">17 real fault classes (ORA)</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-2xl font-bold text-amber-400 font-mono">33 Benchmarks</div>
            <div className="text-xs text-slate-400 font-medium">Illustrative Records</div>
            <div className="text-[11px] text-slate-500">Heuristic Reference Estimates</div>
          </div>
        </div>
      </section>

      {/* Two Pillars Showcase */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Two Complementary Intelligence Engines
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            FairFix connects market valuation with repair feasibility to give you end-to-end transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pillar 1 Card */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-5 hover:border-cyan-800/60 transition-all">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400">
                <Cpu className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-cyan-400 font-semibold">Engine 01</span>
                <h3 className="text-xl font-bold text-white">Laptop Price Valuation & Deal Audit</h3>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Trained Gradient Boosting model analyzes interacting hardware specs (CPU cores/threads, RAM, NVMe storage, dedicated GPU, display resolution) and applies verified depreciation heuristics for age, battery health, and cosmetic wear.
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                <span>$R^2 = 0.9307$ and MAE = ₹11,230 on held-out test data</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                <span>SHAP feature contributions explain price premiums</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                <span>Objective verdict: Great Deal, Fair Price, or Overpriced</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link
                href="/valuation"
                className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 group"
              >
                <span>Launch Valuation Studio</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Pillar 2 Card */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-5 hover:border-amber-800/60 transition-all">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-amber-950 border border-amber-800/80 flex items-center justify-center text-amber-400">
                <Wrench className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-amber-400 font-semibold">Engine 02</span>
                <h3 className="text-xl font-bold text-white">Repair Intelligence & Quote Audit</h3>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Calibrated text classifier trained on 3,500+ Open Repair Alliance records isolates hardware faults from symptoms. Illustrative Indian repair cost catalogue audits technician quotes and evaluates Repair-to-Value ratios using configurable heuristics.
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-400" />
                <span>17 fault categories with calibrated confidence percentages</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-400" />
                <span>Illustrative heuristic parts & labour ranges (Nehru Place, SP Road)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-400" />
                <span>Configurable decision heuristics (30% / 50% economic rule)</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link
                href="/repair"
                className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 group"
              >
                <span>Explore Repair Intelligence</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demonstration Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            See FairFix Valuation Intelligence in Action
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Choose a preset scenario below to see how our trained machine learning model analyzes specifications and evaluates asking prices.
          </p>
        </div>

        <div className="flex justify-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-xl max-w-md mx-auto">
          <button
            onClick={() => setSelectedPreset('gaming')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              selectedPreset === 'gaming' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            High-End Gaming
          </button>
          <button
            onClick={() => setSelectedPreset('macbook')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              selectedPreset === 'macbook' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Refurbished M3
          </button>
          <button
            onClick={() => setSelectedPreset('budget')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              selectedPreset === 'budget' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Overpriced Used
          </button>
        </div>

        {/* Preset Valuation Card */}
        <div className="max-w-3xl mx-auto rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-cyan-400">Spec Simulation</span>
              <h3 className="text-2xl font-bold text-white">{active.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{active.specs}</p>
            </div>
            <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold tracking-wide self-start sm:self-auto ${active.badgeClass}`}>
              {active.verdict}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <span className="text-xs text-slate-500 font-medium">Fair Market Valuation</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">{active.newEstimate}</div>
              <span className="text-[11px] text-slate-400">{active.usedNote}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <span className="text-xs text-slate-500 font-medium">Seller Asking Price</span>
              <div className="text-2xl font-bold text-slate-300 font-mono mt-1">{active.askingPrice}</div>
              <span className="text-[11px] text-slate-400">Marketplace Listing</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <span className="text-xs text-slate-500 font-medium">Confidence Interval</span>
              <div className="text-sm font-semibold text-cyan-400 mt-2">±8% Error Margin</div>
              <span className="text-[11px] text-slate-400">Based on Test RMSE ₹22,503</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Top Hardware Valuation Drivers (SHAP Analysis)</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {active.drivers.map((d, i) => (
                <div key={i} className="text-xs px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-800 text-slate-300 font-mono">
                  {d}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Link
              href="/valuation"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group"
            >
              <span>Test with custom hardware specs</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="rounded-3xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-indigo-950/40 border border-cyan-900/40 p-8 sm:p-12 text-center space-y-6">
        <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
          Ready to Make Smart Electronics Decisions?
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Whether evaluating a laptop for purchase or determining whether to repair or replace a faulty machine, FairFix gives you verified, data-backed answers.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/valuation"
            className="px-6 py-3 rounded-xl font-semibold text-white bg-cyan-600 hover:bg-cyan-500 shadow-lg shadow-cyan-600/25 transition-all text-sm"
          >
            Launch Valuation Studio
          </Link>
          <Link
            href="/repair"
            className="px-6 py-3 rounded-xl font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all text-sm"
          >
            Launch Repair Intelligence
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl font-semibold text-slate-400 hover:text-white transition-all text-sm"
          >
            View Model Metrics
          </Link>
        </div>
      </section>
    </div>
  );
}
