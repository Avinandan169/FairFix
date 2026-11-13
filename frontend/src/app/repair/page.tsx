'use client';

import React, { useState, useEffect } from 'react';
import {
  Wrench,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  Search,
  DollarSign,
  Scale,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  predictDiagnosis,
  getRepairPricingOptions,
  estimateRepairCost,
  evaluateTechnicianQuote,
  evaluateRepairDecision
} from '@/services/api';
import {
  DiagnosisResponse,
  RepairPricingEstimate,
  QuoteEvaluationResponse,
  RepairDecisionResponse
} from '@/types';

// Preset symptom queries for instant demo testing
const SYMPTOM_PRESETS = [
  {
    label: 'Battery Draining Rapidly',
    query: 'Battery drains within 15 minutes of unplugging and fails to hold charge beyond 30%',
    brand: 'dell'
  },
  {
    label: 'Black Display / Fan Spins',
    query: 'Laptop screen is completely blank on boot, fans spin loudly, external HDMI monitor works fine',
    brand: 'asus'
  },
  {
    label: 'Liquid Spill on Keyboard',
    query: 'Liquid spilled over keyboard, spacebar, enter, and top row keys are totally unresponsive',
    brand: 'lenovo'
  },
  {
    label: 'Overheating & Thermal Shutdown',
    query: 'Laptop gets burning hot near vents and shuts down abruptly after 10 minutes of heavy gaming',
    brand: 'hp'
  },
  {
    label: 'Dead / No Power (Motherboard)',
    query: 'Completely dead laptop, no charging light indicator when plugged in, will not power on at all',
    brand: 'acer'
  }
];

export default function RepairIntelligencePage() {
  // Step 1: Diagnosis State
  const [symptomText, setSymptomText] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResponse | null>(null);
  const [diagnosisError, setDiagnosisError] = useState<string | null>(null);

  // Step 2: Pricing Benchmark State
  const [pricingOptions, setPricingOptions] = useState<{
    components: string[];
    repair_types: string[];
    brands: string[];
  }>({ components: [], repair_types: [], brands: [] });
  const [selectedComponent, setSelectedComponent] = useState<string>('Integrated screen');
  const [selectedRepairType, setSelectedRepairType] = useState<string>('');
  const [isEstimating, setIsEstimating] = useState(false);
  const [pricingEstimate, setPricingEstimate] = useState<RepairPricingEstimate | null>(null);
  const [pricingError, setPricingError] = useState<string | null>(null);

  // Step 3: Quote Evaluator State
  const [quotedPrice, setQuotedPrice] = useState<string>('3800');
  const [isEvaluatingQuote, setIsEvaluatingQuote] = useState(false);
  const [quoteResult, setQuoteResult] = useState<QuoteEvaluationResponse | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  // Step 4: Repair vs Replace Decision State
  const [decisionRepairCost, setDecisionRepairCost] = useState<string>('4500');
  const [decisionLaptopValue, setDecisionLaptopValue] = useState<string>('38000');
  const [decisionAgeYears, setDecisionAgeYears] = useState<number>(2.5);
  const [decisionCondition, setDecisionCondition] = useState<string>('Good');
  const [isDeciding, setIsDeciding] = useState(false);
  const [decisionResult, setDecisionResult] = useState<RepairDecisionResponse | null>(null);
  const [decisionError, setDecisionError] = useState<string | null>(null);

  // Load pricing options on mount
  useEffect(() => {
    async function loadOptions() {
      try {
        const opts = await getRepairPricingOptions();
        setPricingOptions(opts);
        if (opts.components.length > 0 && !selectedComponent) {
          setSelectedComponent(opts.components[0]);
        }
      } catch (err) {
        console.error('Failed to load repair pricing options', err);
      }
    }
    loadOptions();
  }, []);

  // Handler: Run Fault Diagnosis
  async function handleDiagnose(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!symptomText.trim()) return;

    setIsDiagnosing(true);
    setDiagnosisError(null);
    try {
      const res = await predictDiagnosis(symptomText, selectedBrand || undefined);
      setDiagnosisResult(res);

      // Auto-suggest component for Step 2 if confident
      if (res.is_confident && res.primary_fault) {
        setSelectedComponent(res.primary_fault);
      }
    } catch (err: any) {
      setDiagnosisError(err.message || 'Failed to analyze symptoms');
    } finally {
      setIsDiagnosing(false);
    }
  }

  // Handler: Estimate Repair Cost Benchmark
  async function handleEstimateCost() {
    if (!selectedComponent) return;

    setIsEstimating(true);
    setPricingError(null);
    try {
      const res = await estimateRepairCost(
        selectedComponent,
        selectedRepairType || undefined,
        selectedBrand || undefined
      );
      setPricingEstimate(res);

      // Pre-fill quote evaluator and decision calculator with benchmark mid-point
      if (res.found && res.total_estimated_range) {
        const mid = Math.round((res.total_estimated_range.min + res.total_estimated_range.max) / 2);
        setQuotedPrice(String(mid));
        setDecisionRepairCost(String(mid));
      }
    } catch (err: any) {
      setPricingError(err.message || 'Failed to estimate repair cost');
    } finally {
      setIsEstimating(false);
    }
  }

  // Handler: Evaluate Quote
  async function handleEvaluateQuote(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const val = parseFloat(quotedPrice);
    if (isNaN(val) || val <= 0) return;

    setIsEvaluatingQuote(true);
    setQuoteError(null);
    try {
      const res = await evaluateTechnicianQuote(
        val,
        selectedComponent,
        selectedRepairType || undefined,
        selectedBrand || undefined
      );
      setQuoteResult(res);
      setDecisionRepairCost(String(val));
    } catch (err: any) {
      setQuoteError(err.message || 'Failed to evaluate quote');
    } finally {
      setIsEvaluatingQuote(false);
    }
  }

  // Handler: Evaluate Repair vs Replace Decision
  async function handleDecisionAnalysis(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const cost = parseFloat(decisionRepairCost);
    const value = parseFloat(decisionLaptopValue);
    if (isNaN(cost) || cost <= 0 || isNaN(value) || value <= 0) return;

    setIsDeciding(true);
    setDecisionError(null);
    try {
      const res = await evaluateRepairDecision({
        repair_cost: cost,
        device_market_value: value,
        device_age_years: decisionAgeYears,
        device_condition: decisionCondition,
        component: selectedComponent
      });
      setDecisionResult(res);
    } catch (err: any) {
      setDecisionError(err.message || 'Failed to compute repair-versus-replace recommendation');
    } finally {
      setIsDeciding(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Header */}
      <div className="relative border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/50 text-xs font-semibold text-cyan-400 mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                Supervised NLP Diagnosis + Indian Market Pricing Intelligence
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Repair Intelligence & Valuation Hub
              </h1>
              <p className="mt-2 text-base text-slate-400 max-w-3xl">
                Diagnose laptop faults using real-world community repair telemetry, inspect verified Indian parts and labour
                benchmarks (Nehru Place, SP Road, Lamington Road), evaluate technician quotes, and determine whether repairing
                or replacing is economically sound.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                <span className="block text-xl font-bold text-cyan-400">3,511</span>
                <span className="text-[11px] text-slate-400">Repair Records</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                <span className="block text-xl font-bold text-emerald-400">72.4%</span>
                <span className="text-[11px] text-slate-400">Diagnosis Accuracy</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                <span className="block text-xl font-bold text-amber-400">33</span>
                <span className="text-[11px] text-slate-400">Verified Benchmarks</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-Stage Workflow */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        {/* ========================================================================= */}
        {/* STAGE 1: ML-BASED FAULT DIAGNOSIS */}
        {/* ========================================================================= */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 lg:p-8 backdrop-blur-sm shadow-xl">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  1. ML Laptop Fault Diagnosis
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                    Open Repair Alliance Model
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Enter symptoms or choose a common failure pattern to run our calibrated text classifier.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleDiagnose} className="mt-6 space-y-4">
            {/* Symptom Preset Buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Quick Test Presets (Click to Load):
              </label>
              <div className="flex flex-wrap gap-2">
                {SYMPTOM_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSymptomText(preset.query);
                      setSelectedBrand(preset.brand);
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:bg-slate-700 hover:text-white transition-all flex items-center gap-1.5"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Symptom Description */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Describe Problem Symptoms in Plain English:
                </label>
                <textarea
                  rows={3}
                  value={symptomText}
                  onChange={(e) => setSymptomText(e.target.value)}
                  placeholder="e.g., Screen flickers when moving the laptop lid, occasionally goes completely dark but external HDMI display works fine..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Brand (Optional):
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-100 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="">Universal / Any</option>
                  <option value="dell">Dell</option>
                  <option value="hp">HP</option>
                  <option value="lenovo">Lenovo</option>
                  <option value="asus">ASUS</option>
                  <option value="acer">Acer</option>
                  <option value="apple">Apple</option>
                  <option value="msi">MSI</option>
                </select>

                <button
                  type="submit"
                  disabled={isDiagnosing || !symptomText.trim()}
                  className="mt-3.5 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all"
                >
                  {isDiagnosing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Classifying...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      Diagnose Fault
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {diagnosisError && (
            <div className="mt-4 p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs">
              {diagnosisError}
            </div>
          )}

          {/* Diagnosis Results Card */}
          {diagnosisResult && (
            <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Primary Fault & Confidence */}
              <div className="lg:col-span-1 p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Predicted Primary Fault
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                      diagnosisResult.is_confident
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border-amber-800'
                    }`}
                  >
                    {diagnosisResult.status === 'CONFIDENT_DIAGNOSIS' ? 'Confident Match' : 'Low Confidence'}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {diagnosisResult.primary_fault || 'Ambiguous Symptoms'}
                  </h3>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Model Probability</span>
                      <span className="font-semibold text-cyan-400">
                        {diagnosisResult.confidence_percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(10, diagnosisResult.confidence_percentage))}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Influential Symptom Keywords */}
                {diagnosisResult.influential_keywords.length > 0 && (
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Detected Symptom Keywords:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {diagnosisResult.influential_keywords.map((kw, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 font-mono">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Alternative Categories */}
                {diagnosisResult.alternatives.length > 0 && (
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Alternative Likelihoods:
                    </span>
                    <div className="space-y-1.5">
                      {diagnosisResult.alternatives.map((alt, i) => (
                        <div key={i} className="flex items-center justify-between text-xs text-slate-300">
                          <span>{alt.fault_type}</span>
                          <span className="font-mono text-slate-400">{alt.confidence_percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Button: Push to Step 2 */}
                {diagnosisResult.primary_fault && (
                  <button
                    onClick={() => {
                      setSelectedComponent(diagnosisResult.primary_fault!);
                      handleEstimateCost();
                    }}
                    className="w-full mt-2 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-800 text-xs font-semibold transition-colors"
                  >
                    <span>Check Pricing for {diagnosisResult.primary_fault}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Physical Checks & Triage Guide */}
              <div className="lg:col-span-2 p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Recommended Hardware Triage Checks Before Incurring Repair Costs:
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
                    {diagnosisResult.suggested_checks.map((check, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                        <span>{check}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-900 text-[11px] text-slate-400 italic">
                  <strong>Notice: </strong> {diagnosisResult.disclaimer}
                </div>
              </div>
            </div>
          )}
        </section>


        {/* ========================================================================= */}
        {/* STAGE 2: REPAIR COST INTELLIGENCE BENCHMARK */}
        {/* ========================================================================= */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 lg:p-8 backdrop-blur-sm shadow-xl">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  2. Indian Repair Cost Intelligence
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                    Nehru Place / SP Road / Cashify
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Inspect verified benchmark ranges for genuine parts and independent technician labour in INR.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Component / Subsystem:
              </label>
              <select
                value={selectedComponent}
                onChange={(e) => setSelectedComponent(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              >
                {pricingOptions.components.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Repair Type:
              </label>
              <select
                value={selectedRepairType}
                onChange={(e) => setSelectedRepairType(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              >
                <option value="">All / Any Repair Type</option>
                {pricingOptions.repair_types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Brand Filter:
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              >
                <option value="">Universal / All Brands</option>
                <option value="Universal">Universal (Standard)</option>
                <option value="Apple">Apple MacBook</option>
                <option value="Dell">Dell</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleEstimateCost}
                disabled={isEstimating}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all"
              >
                {isEstimating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Querying...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Inspect Benchmark
                  </>
                )}
              </button>
            </div>
          </div>

          {pricingError && (
            <div className="mt-4 p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs">
              {pricingError}
            </div>
          )}

          {/* Pricing Benchmark Display */}
          {pricingEstimate && pricingEstimate.found && (
            <div className="mt-6 pt-6 border-t border-slate-800 space-y-6">
              {/* 3 Metric Cards: Part Range, Labour Range, Total Range */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Physical Part Cost
                  </span>
                  <div className="mt-2 text-2xl font-extrabold text-cyan-400">
                    ₹{pricingEstimate.part_cost_range?.min.toLocaleString('en-IN')} – ₹{pricingEstimate.part_cost_range?.max.toLocaleString('en-IN')}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">Wholesale component replacement cost</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Technician Labour Range
                  </span>
                  <div className="mt-2 text-2xl font-extrabold text-amber-400">
                    ₹{pricingEstimate.labour_cost_range?.min.toLocaleString('en-IN')} – ₹{pricingEstimate.labour_cost_range?.max.toLocaleString('en-IN')}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">Bench labor & testing charges</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-900/60 shadow-lg shadow-emerald-950/20">
                  <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                    Total Estimated Benchmark
                  </span>
                  <div className="mt-2 text-2xl font-extrabold text-emerald-400">
                    ₹{pricingEstimate.total_estimated_range?.min.toLocaleString('en-IN')} – ₹{pricingEstimate.total_estimated_range?.max.toLocaleString('en-IN')}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">Expected fair consumer invoice range</p>
                </div>
              </div>

              {/* Representative Catalogue Records Table */}
              {pricingEstimate.representative_matches && pricingEstimate.representative_matches.length > 0 && (
                <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950">
                  <div className="p-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">
                      Representative Market Survey Records ({pricingEstimate.representative_matches.length})
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Location: {pricingEstimate.market_location}
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/40 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                        <tr>
                          <th className="p-3">ID</th>
                          <th className="p-3">Category / Model</th>
                          <th className="p-3">Part Description</th>
                          <th className="p-3">Parts (₹)</th>
                          <th className="p-3">Labour (₹)</th>
                          <th className="p-3">Source & Location</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {pricingEstimate.representative_matches.map((item) => (
                          <tr key={item.record_id} className="hover:bg-slate-900/50">
                            <td className="p-3 font-mono text-cyan-400">{item.record_id}</td>
                            <td className="p-3 font-medium text-slate-200">{item.laptop_model_or_compatible_category}</td>
                            <td className="p-3 text-slate-300 max-w-xs">{item.part_description}</td>
                            <td className="p-3 text-cyan-300 font-semibold">
                              ₹{item.part_price_min} – ₹{item.part_price_max}
                            </td>
                            <td className="p-3 text-amber-300 font-semibold">
                              ₹{item.labour_min} – ₹{item.labour_max}
                            </td>
                            <td className="p-3 text-slate-400">
                              <div>{item.source_name}</div>
                              <div className="text-[10px] text-slate-500">{item.market_location}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>


        {/* ========================================================================= */}
        {/* STAGE 3: TECHNICIAN QUOTE EVALUATOR */}
        {/* ========================================================================= */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 lg:p-8 backdrop-blur-sm shadow-xl">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  3. Technician Quote Evaluator
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                    Transparent Markup Audit
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Compare any technician quotation against independent market rates to uncover overpricing or suspicious discounts.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleEvaluateQuote} className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Technician Quoted Price (₹ INR):
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm font-semibold">₹</span>
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={quotedPrice}
                  onChange={(e) => setQuotedPrice(e.target.value)}
                  placeholder="e.g. 4500"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-8 pr-4 py-2.5 text-sm text-slate-100 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Selected Component:
              </label>
              <input
                type="text"
                disabled
                value={selectedComponent}
                className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2.5 text-sm text-slate-400 cursor-not-allowed"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={isEvaluatingQuote || !quotedPrice}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 shadow-lg shadow-purple-500/20 disabled:opacity-50 transition-all"
              >
                {isEvaluatingQuote ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Auditing...
                  </>
                ) : (
                  <>
                    <Scale className="h-4 w-4" />
                    Evaluate Quotation
                  </>
                )}
              </button>
            </div>
          </form>

          {quoteError && (
            <div className="mt-4 p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs">
              {quoteError}
            </div>
          )}

          {/* Quote Evaluation Result */}
          {quoteResult && quoteResult.success && (
            <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Verdict Card */}
              <div className="lg:col-span-1 p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Quote Audit Verdict
                </span>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm px-3 py-1 rounded-full font-bold border ${
                      quoteResult.verdict === 'FAIR_AND_COMPETITIVE'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : quoteResult.verdict === 'BELOW_REFERENCE'
                        ? 'bg-amber-950 text-amber-400 border-amber-800'
                        : quoteResult.verdict === 'SLIGHTLY_ABOVE_REFERENCE'
                        ? 'bg-orange-950 text-orange-400 border-orange-800'
                        : 'bg-rose-950 text-rose-400 border-rose-800'
                    }`}
                  >
                    {quoteResult.verdict_label}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Quoted Amount:</span>
                    <span className="font-bold text-white">₹{quoteResult.quoted_price?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Benchmark Reference:</span>
                    <span className="font-mono text-cyan-400">
                      ₹{quoteResult.benchmark_range?.min.toLocaleString('en-IN')} – ₹{quoteResult.benchmark_range?.max.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Variance vs Market:</span>
                    <span
                      className={`font-mono font-bold ${
                        (quoteResult.variance?.percentage ?? 0) > 15
                          ? 'text-rose-400'
                          : (quoteResult.variance?.percentage ?? 0) < -15
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {(quoteResult.variance?.percentage ?? 0) >= 0 ? '+' : ''}
                      {quoteResult.variance?.percentage}%
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-900 pt-3">
                  {quoteResult.explanation}
                </p>
              </div>

              {/* Questions Checklist */}
              <div className="lg:col-span-2 p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                    <Info className="h-4 w-4 text-purple-400" />
                    Essential Questions to Ask the Technician Before Approving:
                  </h4>
                  <div className="space-y-2.5">
                    {quoteResult.suggested_questions?.map((q, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-200">
                        <span className="font-mono text-purple-400 font-bold">{idx + 1}.</span>
                        <span>{q}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-xs text-slate-400">
                  <span>Benchmark Reference: {quoteResult.primary_source}</span>
                  <button
                    onClick={() => {
                      if (quoteResult.quoted_price) {
                        setDecisionRepairCost(String(quoteResult.quoted_price));
                      }
                    }}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                  >
                    <span>Use in Repair vs Replace Analysis</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>


        {/* ========================================================================= */}
        {/* STAGE 4: REPAIR-VERSUS-REPLACE DECISION ENGINE */}
        {/* ========================================================================= */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 lg:p-8 backdrop-blur-sm shadow-xl">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  4. Repair-versus-Replace Decision Engine
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Economic ROI Optimizer
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Synthesize the ML laptop market valuation with repair costs to compute the Repair-to-Value ratio and get an objective decision.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleDecisionAnalysis} className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Estimated Repair Cost (₹):
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm font-semibold">₹</span>
                <input
                  type="number"
                  min="500"
                  step="100"
                  value={decisionRepairCost}
                  onChange={(e) => setDecisionRepairCost(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-8 pr-4 py-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Laptop Market Value (₹):
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm font-semibold">₹</span>
                <input
                  type="number"
                  min="2000"
                  step="500"
                  value={decisionLaptopValue}
                  onChange={(e) => setDecisionLaptopValue(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-8 pr-4 py-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Device Age: {decisionAgeYears} Years
              </label>
              <input
                type="range"
                min="0.5"
                max="8"
                step="0.5"
                value={decisionAgeYears}
                onChange={(e) => setDecisionAgeYears(parseFloat(e.target.value))}
                className="w-full h-2 mt-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Device Condition:
              </label>
              <select
                value={decisionCondition}
                onChange={(e) => setDecisionCondition(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Excellent">Excellent (Minor cosmetic signs)</option>
                <option value="Good">Good (Normal wear)</option>
                <option value="Fair">Fair (Noticeable scratches/scuffs)</option>
                <option value="Heavy Wear">Heavy Wear / Damaged Casing</option>
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-4">
              <button
                type="submit"
                disabled={isDeciding || !decisionRepairCost || !decisionLaptopValue}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all"
              >
                {isDeciding ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Computing Decision...
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4" />
                    Compute Repair vs Replace Economic Recommendation
                  </>
                )}
              </button>
            </div>
          </form>

          {decisionError && (
            <div className="mt-4 p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs">
              {decisionError}
            </div>
          )}

          {/* Decision Results Card */}
          {decisionResult && decisionResult.success && (
            <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Verdict & Ratio Card */}
              <div className="lg:col-span-1 p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Financial Recommendation
                </span>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-base px-3.5 py-1.5 rounded-full font-extrabold border ${
                      decisionResult.verdict === 'REPAIR_RECOMMENDED'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : decisionResult.verdict === 'BORDERLINE_EVALUATE'
                        ? 'bg-amber-950 text-amber-400 border-amber-800'
                        : 'bg-rose-950 text-rose-400 border-rose-800'
                    }`}
                  >
                    {decisionResult.verdict_label}
                  </span>
                </div>

                {/* Repair Cost Ratio Gauge */}
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Repair-to-Value Ratio</span>
                    <span className="font-bold font-mono text-cyan-400">
                      {decisionResult.repair_cost_ratio_pct}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden flex">
                    {/* Safe repair zone <= 30% */}
                    <div
                      className={`h-3 ${
                        (decisionResult.repair_cost_ratio_pct ?? 0) <= 30
                          ? 'bg-emerald-500'
                          : (decisionResult.repair_cost_ratio_pct ?? 0) <= 50
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      } transition-all duration-500`}
                      style={{ width: `${Math.min(100, decisionResult.repair_cost_ratio_pct ?? 0)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>0% (Ideal)</span>
                    <span>30% (Standard)</span>
                    <span>50% (Max Limit)</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="border-t border-slate-900 pt-3 space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Repair Cost:</span>
                    <span className="font-mono text-white">
                      ₹{decisionResult.financial_breakdown?.repair_cost_inr.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Device Value:</span>
                    <span className="font-mono text-cyan-400">
                      ₹{decisionResult.financial_breakdown?.device_market_value_inr.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net Equity Retained:</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      ₹{decisionResult.financial_breakdown?.net_equity_after_repair_inr.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Economic Summary and Factors */}
              <div className="lg:col-span-2 p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white mb-2">
                    Economic Assessment & Methodology:
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {decisionResult.economic_summary}
                  </p>

                  <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Key Decision Drivers:
                  </h5>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {decisionResult.decision_factors?.map((factor, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Economic Threshold: Repair cost {'>'} 50% of residual value recommends replacement.</span>
                  <span className="font-mono text-cyan-400">FairFix Decision Protocol v1.1</span>
                </div>
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
