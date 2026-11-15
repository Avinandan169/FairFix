'use client';

import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  Search,
  DollarSign,
  Scale,
  RefreshCw,
  Info,
  ShieldAlert,
  ChevronRight,
  ShieldCheck
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

// Preset symptom queries for instant one-click testing
const COMMON_SYMPTOMS = [
  {
    label: 'Screen Stays Black on Boot',
    query: 'Laptop screen is completely blank on boot, fans spin loudly, external HDMI monitor works fine',
    brand: 'asus'
  },
  {
    label: 'Battery Draining Rapidly',
    query: 'Battery drains within 20 minutes of unplugging and fails to hold charge beyond 30%',
    brand: 'dell'
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
    label: 'Completely Dead / Won’t Turn On',
    query: 'Completely dead laptop, no charging light indicator when plugged in, will not power on at all',
    brand: 'acer'
  }
];

export default function RepairAssistantPage() {
  // Current active step in the guided journey (1 to 6)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Laptop Details State
  const [brand, setBrand] = useState<string>('dell');
  const [model, setModel] = useState<string>('Inspiron 15');
  const [deviceAgeYears, setDeviceAgeYears] = useState<number>(2.5);
  const [deviceCondition, setDeviceCondition] = useState<string>('Good');
  const [deviceMarketValue, setDeviceMarketValue] = useState<string>('38000');

  // Step 2: Symptom State
  const [symptomText, setSymptomText] = useState<string>(
    'Laptop screen is completely blank on boot, fans spin loudly, external HDMI monitor works fine'
  );
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResponse | null>(null);
  const [diagnosisError, setDiagnosisError] = useState<string | null>(null);

  // Step 4: Pricing Benchmark State
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

  // Step 5: Quote Evaluation State
  const [quotedPrice, setQuotedPrice] = useState<string>('4200');
  const [isEvaluatingQuote, setIsEvaluatingQuote] = useState(false);
  const [quoteResult, setQuoteResult] = useState<QuoteEvaluationResponse | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  // Step 6: Repair vs Replace Decision State
  const [decisionRepairCost, setDecisionRepairCost] = useState<string>('4200');
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

  // Format currency in INR
  const formatRupee = (val: number) => {
    return '₹' + Math.round(val).toLocaleString('en-IN');
  };

  // Handler: Run Fault Diagnosis (Step 2 -> Step 3)
  async function handleDiagnose(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!symptomText.trim()) return;

    setIsDiagnosing(true);
    setDiagnosisError(null);
    try {
      const res = await predictDiagnosis(symptomText, brand || undefined);
      setDiagnosisResult(res);

      // Auto-suggest matching component for pricing if identified
      if (res.primary_fault) {
        setSelectedComponent(res.primary_fault);
      }
      setCurrentStep(3);
    } catch (err: any) {
      setDiagnosisError(err.message || 'Failed to analyze symptoms');
    } finally {
      setIsDiagnosing(false);
    }
  }

  // Handler: Estimate Repair Cost Benchmark (Step 4)
  async function handleEstimateCost(comp?: string) {
    const targetComp = comp || selectedComponent;
    if (!targetComp) return;

    setIsEstimating(true);
    setPricingError(null);
    try {
      const res = await estimateRepairCost(
        targetComp,
        selectedRepairType || undefined,
        brand || undefined
      );
      setPricingEstimate(res);

      // Pre-fill quote and decision inputs with midpoint
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

  // Auto-fetch pricing estimate when moving to step 4
  useEffect(() => {
    if (currentStep === 4 && selectedComponent) {
      handleEstimateCost(selectedComponent);
    }
  }, [currentStep, selectedComponent]);

  // Handler: Evaluate Quote (Step 5)
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
        brand || undefined
      );
      setQuoteResult(res);
      setDecisionRepairCost(String(val));
    } catch (err: any) {
      setQuoteError(err.message || 'Failed to evaluate quote');
    } finally {
      setIsEvaluatingQuote(false);
    }
  }

  // Handler: Evaluate Repair vs Replace Decision (Step 6)
  async function handleDecisionAnalysis() {
    const cost = parseFloat(decisionRepairCost);
    const value = parseFloat(deviceMarketValue);
    if (isNaN(cost) || cost <= 0 || isNaN(value) || value <= 0) return;

    setIsDeciding(true);
    setDecisionError(null);
    try {
      const res = await evaluateRepairDecision({
        repair_cost: cost,
        device_market_value: value,
        device_age_years: deviceAgeYears,
        device_condition: deviceCondition,
        component: selectedComponent
      });
      setDecisionResult(res);
    } catch (err: any) {
      setDecisionError(err.message || 'Failed to compute repair-versus-replace recommendation');
    } finally {
      setIsDeciding(false);
    }
  }

  // Auto-run decision analysis when moving to step 6
  useEffect(() => {
    if (currentStep === 6) {
      handleDecisionAnalysis();
    }
  }, [currentStep, decisionRepairCost, deviceMarketValue]);

  const stepsList = [
    { number: 1, title: 'Laptop Details' },
    { number: 2, title: 'Describe Symptoms' },
    { number: 3, title: 'Fault Assessment' },
    { number: 4, title: 'Indicative Costs' },
    { number: 5, title: 'Evaluate Quote' },
    { number: 6, title: 'Repair vs. Replace' }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200/80 pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <Wrench className="h-3.5 w-3.5 text-slate-700" />
          <span>Consumer Diagnostic &amp; Decision Assistant</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Laptop Repair Assistant
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Follow a guided, 6-step journey to understand what might be wrong with your laptop, explore typical repair costs, evaluate technician quotes, and decide whether fixing it makes financial sense.
        </p>
      </div>

      {/* Guided Journey Stepper Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {stepsList.map((step) => {
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            return (
              <button
                key={step.number}
                type="button"
                onClick={() => setCurrentStep(step.number)}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-left transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : isCompleted
                    ? 'bg-slate-50 text-slate-800 hover:bg-slate-100'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`h-5 w-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                    isActive
                      ? 'bg-white text-slate-900'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted ? '✓' : step.number}
                </span>
                <span className="text-xs font-semibold truncate">{step.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Select Laptop Details */}
      {currentStep === 1 && (
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Step 1 of 6</span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">Tell us about your laptop</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Providing device details helps contextualize repair costs and evaluate whether repair makes financial sense.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Laptop Brand</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all"
              >
                <option value="dell">Dell</option>
                <option value="hp">HP</option>
                <option value="lenovo">Lenovo</option>
                <option value="asus">ASUS</option>
                <option value="acer">Acer</option>
                <option value="apple">Apple</option>
                <option value="msi">MSI</option>
                <option value="samsung">Samsung</option>
                <option value="other">Other / Standard Brand</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Model / Series (Optional)</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. Inspiron 15, ThinkPad E14"
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Device Age: <span className="text-slate-900 font-bold">{deviceAgeYears} Years</span>
              </label>
              <input
                type="range"
                min={0.5}
                max={8}
                step={0.5}
                value={deviceAgeYears}
                onChange={(e) => setDeviceAgeYears(parseFloat(e.target.value))}
                className="w-full accent-slate-900"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Under 1 yr</span>
                <span>3–4 yrs</span>
                <span>7+ yrs</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Overall Physical Condition</label>
              <select
                value={deviceCondition}
                onChange={(e) => setDeviceCondition(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all"
              >
                <option value="Excellent">Excellent / Well Maintained</option>
                <option value="Good">Good (Normal minor wear)</option>
                <option value="Fair">Fair (Noticeable scratches / worn keys)</option>
                <option value="Poor">Poor (Heavily degraded)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Estimated Current Market Value (₹)
              </label>
              <input
                type="number"
                value={deviceMarketValue}
                onChange={(e) => setDeviceMarketValue(e.target.value)}
                placeholder="e.g. 35000"
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Used to compute the Repair-to-Value ratio in Step 6. (Tip: You can calculate this precisely using our Laptop Value tool).
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all"
            >
              <span>Next: Describe Symptoms</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {/* STEP 2: Describe Symptoms */}
      {currentStep === 2 && (
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Step 2 of 6</span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">Describe what is malfunctioning</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Explain the symptoms in your own words. Mention what happened (drops, spills, sudden shutoff) and what you see.
            </p>
          </div>

          {/* Quick Preset Symptom Chips */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-500">Common Symptom Examples (Click to Test):</span>
            <div className="flex flex-wrap gap-2">
              {COMMON_SYMPTOMS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSymptomText(preset.query);
                    setBrand(preset.brand);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Symptom Input Form */}
          <form onSubmit={handleDiagnose} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Symptom Description
              </label>
              <textarea
                rows={4}
                value={symptomText}
                onChange={(e) => setSymptomText(e.target.value)}
                placeholder="E.g. The laptop turns on and the power light comes on, but the display remains completely dark. It works when plugged into an external TV via HDMI..."
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all leading-relaxed"
              />
            </div>

            {diagnosisError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{diagnosisError}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back: Laptop Details</span>
              </button>

              <button
                type="submit"
                disabled={isDiagnosing || !symptomText.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all disabled:opacity-50"
              >
                {isDiagnosing ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    <span>Analyzing Symptoms...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze Symptoms</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* STEP 3: Review Possible Fault Categories */}
      {currentStep === 3 && (
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Step 3 of 6</span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">Preliminary Fault Assessment</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Based on the symptoms described, here are the most probable hardware or software subsystems involved.
            </p>
          </div>

          {diagnosisResult ? (
            <div className="space-y-5">
              {/* Primary Fault Banner */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Primary Potential Failure Subsystem
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      diagnosisResult.is_confident
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {diagnosisResult.is_confident ? 'Strong Symptom Match' : 'Preliminary Guidance'}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900">
                  {diagnosisResult.primary_fault}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  Reported symptom profile: &ldquo;{diagnosisResult.input_symptom}&rdquo;
                </p>
              </div>

              {/* Actionable Preliminary Checks */}
              {diagnosisResult.suggested_checks && diagnosisResult.suggested_checks.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/60 space-y-1.5 text-xs text-amber-900">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Info className="h-4 w-4 text-amber-700 shrink-0" />
                    <span>Recommended Preliminary Test Before Service</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-amber-800 leading-relaxed">
                    {diagnosisResult.suggested_checks.map((check, i) => (
                      <li key={i}>{check}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Other Possible Factors */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider block">
                    Other Possible Factors
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Symptom correlation &amp; co-occurrence
                  </span>
                </div>

                {diagnosisResult.alternatives && diagnosisResult.alternatives.length > 0 ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 gap-2.5">
                      {diagnosisResult.alternatives.slice(0, 3).map((alt, i) => {
                        const levelColor =
                          alt.relevance_level === 'High'
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : alt.relevance_level === 'Moderate'
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200';

                        return (
                          <div
                            key={i}
                            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-800 text-xs">{alt.fault_type}</span>
                                {alt.relevance_level && (
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${levelColor}`}>
                                    {alt.relevance_level} Relevance
                                  </span>
                                )}
                              </div>
                              <span className="text-slate-600 font-mono text-[11px] font-medium bg-white px-2 py-0.5 rounded border border-slate-200">
                                {alt.relevance_score !== undefined
                                  ? `Score: ${alt.relevance_score}/100`
                                  : `${alt.confidence_percentage}% Match`}
                              </span>
                            </div>

                            {alt.explanation && (
                              <p className="text-[11px] text-slate-600 leading-relaxed">
                                {alt.explanation}
                              </p>
                            )}

                            {alt.matched_symptoms && alt.matched_symptoms.length > 0 && (
                              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                                <span className="text-[10px] text-slate-400 uppercase font-medium">Symptom evidence:</span>
                                {alt.matched_symptoms.map((term, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[10px] bg-slate-200/80 text-slate-700 px-1.5 py-0.5 rounded font-mono"
                                  >
                                    &ldquo;{term}&rdquo;
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <p className="text-[10px] text-slate-400 italic">
                      * Relevance scores (0–100) are heuristic indicators derived from reported symptom keywords and diagnostic subsystem correlation, not independent failure probabilities.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/50 text-[11px] text-slate-500">
                    No secondary contributing factors detected. The reported symptoms isolated specifically to the primary subsystem without secondary hardware correlations.
                  </div>
                )}
              </div>

              {/* Physical Check Disclaimer */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
                <ShieldAlert className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Important Notice:</strong> Software-based diagnosis provides preliminary triage based on reported symptoms. It cannot detect internal electrical shorts, microscopic liquid corrosion, or blown power stages that require physical multimeter and bench testing by a qualified technician.
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Re-describe Symptoms</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(4);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all"
                >
                  <span>Next: Explore Indicative Repair Costs</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-3">
              <p className="text-sm text-slate-500">No diagnosis performed yet.</p>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-slate-900"
              >
                Describe Symptoms
              </button>
            </div>
          )}
        </section>
      )}

      {/* STEP 4: Explore Indicative Repair Cost Estimates */}
      {currentStep === 4 && (
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Step 4 of 6</span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">Indicative Repair Cost Benchmarks</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Explore typical parts and labour price ranges for common laptop components.
            </p>
          </div>

          {/* Component Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Component to Benchmark</label>
              <select
                value={selectedComponent}
                onChange={(e) => {
                  setSelectedComponent(e.target.value);
                  handleEstimateCost(e.target.value);
                }}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all"
              >
                {pricingOptions.components.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Repair Location / Hub</label>
              <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-600">
                Major Electronics Hubs (Nehru Place, SP Road, Lamington Road)
              </div>
            </div>
          </div>

          {/* Benchmark Display Card */}
          {pricingEstimate && pricingEstimate.found ? (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <div>
                  <span className="text-xs font-medium text-slate-500">Benchmark Reference for</span>
                  <h4 className="text-lg font-bold text-slate-900">{pricingEstimate.component}</h4>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                  {pricingEstimate.representative_matches?.[0]?.repair_type || 'Component Service'}
                </span>
              </div>

              {/* Three Column Cost Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-1">
                  <span className="text-xs text-slate-500">Parts Cost Range</span>
                  <p className="text-base font-bold text-slate-900">
                    {pricingEstimate.part_cost_range
                      ? `${formatRupee(pricingEstimate.part_cost_range.min)} – ${formatRupee(pricingEstimate.part_cost_range.max)}`
                      : 'Indicative'}
                  </p>
                  <p className="text-[11px] text-slate-400">Wholesale component price</p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-1">
                  <span className="text-xs text-slate-500">Labour Fee Range</span>
                  <p className="text-base font-bold text-slate-900">
                    {pricingEstimate.labour_cost_range
                      ? `${formatRupee(pricingEstimate.labour_cost_range.min)} – ${formatRupee(pricingEstimate.labour_cost_range.max)}`
                      : 'Indicative'}
                  </p>
                  <p className="text-[11px] text-slate-400">Bench installation &amp; testing</p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-1">
                  <span className="text-xs text-slate-500">Total Benchmark</span>
                  <p className="text-lg font-black text-slate-900">
                    {pricingEstimate.total_estimated_range
                      ? `${formatRupee(pricingEstimate.total_estimated_range.min)} – ${formatRupee(pricingEstimate.total_estimated_range.max)}`
                      : 'Indicative'}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-medium">Indicative all-in estimate</p>
                </div>
              </div>

              {pricingEstimate.representative_matches?.[0]?.part_description && (
                <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200/60">
                  <strong>Standard Specification:</strong> {pricingEstimate.representative_matches[0].part_description}
                </p>
              )}

              {/* Prominent Provenance Disclaimer */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2">
                <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Indicative Reference Estimate:</strong> Actual costs may vary by location, service provider, component quality and availability. These figures represent expert heuristic benchmarks for consumer guidance.
                </span>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-slate-50 text-center text-xs text-slate-500">
              No specific benchmark range found for the selected component. Choose another item from the list above.
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back: Fault Assessment</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all"
            >
              <span>Next: Evaluate Technician Quote</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {/* STEP 5: Enter Technician Quotation and Evaluate It */}
      {currentStep === 5 && (
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Step 5 of 6</span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">Audit Technician Quotation</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter the price quoted by a repair shop or technician to evaluate whether it is competitive, slightly marked up, or significantly overpriced.
            </p>
          </div>

          <form onSubmit={handleEvaluateQuote} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Quoted Amount in INR (₹)
                </label>
                <input
                  type="number"
                  value={quotedPrice}
                  onChange={(e) => setQuotedPrice(e.target.value)}
                  placeholder="e.g. 4500"
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Evaluating Against Component
                </label>
                <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800">
                  {selectedComponent}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isEvaluatingQuote || !quotedPrice}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all disabled:opacity-50"
            >
              {isEvaluatingQuote ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  <span>Auditing Quote...</span>
                </>
              ) : (
                <>
                  <span>Evaluate Quotation</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quote Result Card */}
          {quoteResult && (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Quote Audit Verdict
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    quoteResult.verdict === 'FAIR_AND_COMPETITIVE'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : quoteResult.verdict === 'SLIGHTLY_ABOVE_REFERENCE'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : quoteResult.verdict === 'BELOW_REFERENCE'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {quoteResult.verdict_label || quoteResult.verdict}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200/60">
                  <span className="text-slate-500">Your Quote:</span>
                  <p className="text-base font-bold text-slate-900 mt-0.5">
                    {formatRupee(quoteResult.quoted_price ?? parseFloat(quotedPrice))}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200/60">
                  <span className="text-slate-500">Reference Benchmark:</span>
                  <p className="text-base font-bold text-slate-900 mt-0.5">
                    {quoteResult.benchmark_range
                      ? `${formatRupee(quoteResult.benchmark_range.min)} – ${formatRupee(quoteResult.benchmark_range.max)}`
                      : 'N/A'}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200/60">
                  <span className="text-slate-500">Variance from Benchmark:</span>
                  {quoteResult.variance ? (
                    <p
                      className={`text-base font-bold mt-0.5 ${
                        quoteResult.variance.difference_inr > 0 ? 'text-amber-700' : 'text-emerald-700'
                      }`}
                    >
                      {quoteResult.variance.difference_inr > 0 ? '+' : ''}
                      {formatRupee(quoteResult.variance.difference_inr)} ({quoteResult.variance.percentage > 0 ? '+' : ''}
                      {quoteResult.variance.percentage}%)
                    </p>
                  ) : (
                    <p className="text-base font-bold text-slate-700 mt-0.5">Aligned</p>
                  )}
                </div>
              </div>

              {quoteResult.explanation && (
                <div className="p-4 rounded-xl bg-white border border-slate-200/60 space-y-1.5 text-xs text-slate-700 leading-relaxed">
                  <p className="font-semibold text-slate-900">Analysis &amp; Advice:</p>
                  <p>{quoteResult.explanation}</p>
                </div>
              )}

              {quoteResult.suggested_questions && quoteResult.suggested_questions.length > 0 && (
                <div className="p-4 rounded-xl bg-white border border-slate-200/60 space-y-2 text-xs text-slate-700 leading-relaxed">
                  <p className="font-semibold text-slate-900">Questions to ask the technician before authorizing repair:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    {quoteResult.suggested_questions.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-[11px] text-slate-400 italic">
                Indicative reference estimate — actual costs may vary by location, service provider, component quality and availability.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back: Indicative Costs</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(6)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all"
            >
              <span>Next: Review Repair vs. Replace</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {/* STEP 6: Review Repair-versus-Replacement Guidance */}
      {currentStep === 6 && (
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Step 6 of 6</span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">Repair vs. Replace Economic Guidance</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluating the financial wisdom of repairing versus replacing based on your laptop’s estimated market value and repair quote.
            </p>
          </div>

          {/* Quick Parameters Re-check */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-500">Repair Cost:</span>
              <div className="flex items-center gap-1 mt-0.5">
                <input
                  type="number"
                  value={decisionRepairCost}
                  onChange={(e) => setDecisionRepairCost(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-sm font-bold text-slate-900"
                />
              </div>
            </div>

            <div>
              <span className="text-slate-500">Device Market Value:</span>
              <div className="flex items-center gap-1 mt-0.5">
                <input
                  type="number"
                  value={deviceMarketValue}
                  onChange={(e) => setDeviceMarketValue(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-sm font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleDecisionAnalysis}
                className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
              >
                Re-calculate
              </button>
            </div>
          </div>

          {/* Decision Verdict Card */}
          {decisionResult && (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Economic Recommendation
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    decisionResult.verdict === 'REPAIR_RECOMMENDED'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : decisionResult.verdict === 'BORDERLINE_EVALUATE' || decisionResult.verdict === 'BORDERLINE_LEAN_REPLACE'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {decisionResult.verdict_label || decisionResult.verdict}
                </span>
              </div>

              {/* Ratio Gauge */}
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Repair Cost Ratio</span>
                  <span className="font-extrabold text-base text-slate-900">
                    {decisionResult.repair_cost_ratio_pct ?? 0}% of device value
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      (decisionResult.repair_cost_ratio_pct ?? 0) <= 30
                        ? 'bg-emerald-600'
                        : (decisionResult.repair_cost_ratio_pct ?? 0) <= 50
                        ? 'bg-amber-500'
                        : 'bg-rose-600'
                    }`}
                    style={{ width: `${Math.min(decisionResult.repair_cost_ratio_pct ?? 0, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                  <span>0% – 30% (Repair Sensible)</span>
                  <span>30% – 50% (Borderline)</span>
                  <span>50%+ (Replace Favored)</span>
                </div>
              </div>

              {/* Actionable Guidance */}
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-2 text-xs leading-relaxed text-slate-700">
                {decisionResult.economic_summary && (
                  <p className="font-bold text-slate-900 text-sm">{decisionResult.economic_summary}</p>
                )}
                {decisionResult.decision_factors && decisionResult.decision_factors.length > 0 && (
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    {decisionResult.decision_factors.map((factor, idx) => (
                      <li key={idx}>{factor}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Consumer Economics Heuristic Notice */}
              <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
                <Info className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Configurable Consumer Economics Heuristic (30% / 50% Rule):</strong> Recommendations are based on standard consumer asset preservation guidelines. Factors like component availability, remaining warranty, and device sentimental value should also be considered.
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back: Audit Quote</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all"
            >
              <span>Start New Assessment</span>
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>
      )}
    </div>
  );
}