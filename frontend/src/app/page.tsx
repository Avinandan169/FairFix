'use client';

import Link from 'next/link';
import {
  Laptop,
  Wrench,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingDown,
  ShieldCheck,
  Scale,
  Sparkles,
  Info
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-20 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* 1. Hero Section */}
      <section className="text-center space-y-6 pt-4 sm:pt-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-medium text-slate-700">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-500"></span>
          <span>Independent Consumer Utility</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
          Make smarter decisions about your device.
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Understand your laptop’s value, explore potential faults, and evaluate repair costs — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <Link
            href="/valuation"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all active:scale-[0.98]"
          >
            <Laptop className="h-4 w-4" />
            <span>Check Laptop Value</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/repair"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/80 shadow-sm transition-all active:scale-[0.98]"
          >
            <Wrench className="h-4 w-4 text-slate-500" />
            <span>Explore Repair Assistant</span>
          </Link>
        </div>

        {/* Feature Highlights Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 text-left">
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">01. Valuation</span>
            <p className="text-sm font-semibold text-slate-900">Fair Second-Hand Estimates</p>
            <p className="text-xs text-slate-500">Hardware spec analysis with condition &amp; battery wear modeling.</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">02. Diagnosis</span>
            <p className="text-sm font-semibold text-slate-900">Symptom Fault Identification</p>
            <p className="text-xs text-slate-500">Natural language triage mapping descriptions to likely fault causes.</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">03. Decision Support</span>
            <p className="text-sm font-semibold text-slate-900">Quote Audit &amp; Repair Economics</p>
            <p className="text-xs text-slate-500">Independent benchmark checks and repair-versus-replace advice.</p>
          </div>
        </div>
      </section>

      {/* 2. Utility Section A: Know Your Laptop's Value */}
      <section className="p-8 sm:p-12 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <Laptop className="h-3.5 w-3.5 text-slate-700" />
              <span>Valuation Utility</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Know what your laptop is actually worth.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Whether you are buying a used laptop, selling an old device, or assessing whether to invest in repairs, getting an objective estimate protects you from unfair asking prices.
            </p>
            <ul className="space-y-2.5 text-sm text-slate-600 pt-2">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong>Enter core specifications:</strong> Brand, processor generation, RAM capacity, storage speed, display resolution, and graphics card.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong>Account for real condition:</strong> Age in months, battery health percentage, screen scratches, and casing wear.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong>Clear, transparent breakdown:</strong> See the estimated new retail baseline alongside second-hand depreciation factors.</span>
              </li>
            </ul>

            <div className="pt-4 flex items-center gap-4">
              <Link
                href="/valuation"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors"
              >
                <span>Calculate Laptop Value</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Sample Valuation Preview Card */}
          <div className="lg:col-span-5 p-6 rounded-xl bg-slate-50 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-medium text-slate-500">Example Valuation</span>
                <h4 className="text-base font-bold text-slate-900">MacBook Air 13 (Used)</h4>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                Fair Price
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500">Estimated Market Value</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">₹72,400</span>
                <span className="text-xs text-slate-500">Range: ₹66,000 – ₹78,000</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white border border-slate-200/60 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>New Retail Baseline:</span>
                <span className="font-medium text-slate-900">₹1,14,900</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Condition Depreciation:</span>
                <span className="font-medium text-rose-600">-37.0% (18 mos, 84% battery)</span>
              </div>
              <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-100">
                <span>Asking Price Comparison:</span>
                <span className="font-medium text-emerald-700">₹70,000 (Fair Deal)</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              Estimated from hardware specifications and econometric depreciation curves. Not validated against used transaction logs.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Utility Section B: Understand Your Laptop's Problems */}
      <section className="p-8 sm:p-12 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Sample Symptom Diagnostic Preview Card */}
          <div className="lg:col-span-5 order-2 lg:order-1 p-6 rounded-xl bg-slate-50 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-medium text-slate-500">Sample Symptom Input</span>
                <p className="text-xs font-medium text-slate-800 italic mt-0.5">
                  &ldquo;Screen turns on and fan spins loudly, but the display stays black.&rdquo;
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-slate-500 font-medium">Likely Fault Classification</span>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">Integrated Screen / Display</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60">
                    High Match
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Possible LCD panel, backlight inverter, or flex ribbon cable failure.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                <span>Recommended First Check</span>
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Connect your laptop to an external monitor or TV via HDMI. If an image appears, your motherboard and GPU are functioning normally.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2 space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <Wrench className="h-3.5 w-3.5 text-slate-700" />
              <span>Fault Identification</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Understand symptoms before visiting a shop.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              When a laptop malfunctions, non-technical consumers are often vulnerable to inaccurate diagnoses or expensive, unnecessary full-motherboard replacements.
            </p>
            <ul className="space-y-2.5 text-sm text-slate-600 pt-2">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong>Natural language triage:</strong> Describe what is happening in everyday terms without needing technical jargon.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong>Actionable preliminary checks:</strong> Receive concrete steps you can test at home to narrow down the problem.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong>Important physical check caveat:</strong> Software triage provides preliminary guidance only; it cannot replace physical multimeter inspection.</span>
              </li>
            </ul>

            <div className="pt-4 flex items-center gap-4">
              <Link
                href="/repair"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors"
              >
                <span>Diagnose a Laptop Fault</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Utility Section C: Evaluate Repair Decisions */}
      <section className="p-8 sm:p-12 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <Scale className="h-3.5 w-3.5 text-slate-700" />
              <span>Decision Support</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Evaluate repair costs and avoid overpaying.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Repair quotations vary wildly across service shops. FairFix helps you audit technician quotes against typical component benchmarks and decide whether fixing the machine makes economic sense.
            </p>
            <ul className="space-y-2.5 text-sm text-slate-600 pt-2">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong>Indicative cost benchmarks:</strong> Explore typical parts and labour price ranges for screens, batteries, keyboards, and motherboards.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong>Quote evaluation:</strong> Enter a technician&apos;s quote to see if it is competitive, slightly elevated, or significantly marked up.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong>Repair-vs-replace guidance:</strong> Compare the repair cost against the laptop&apos;s market value using clear economic guidelines (30% / 50% rule).</span>
              </li>
            </ul>

            <div className="pt-4 flex items-center gap-4">
              <Link
                href="/repair"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors"
              >
                <span>Evaluate a Repair Quote</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Sample Quote Audit Card */}
          <div className="lg:col-span-5 p-6 rounded-xl bg-slate-50 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-medium text-slate-500">Sample Quote Audit</span>
                <h4 className="text-base font-bold text-slate-900">FHD Screen Replacement</h4>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                Fair &amp; Competitive
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Shop Quotation:</span>
                <span className="font-bold text-slate-900">₹4,200</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Indicative Reference:</span>
                <span className="font-medium text-slate-800">₹3,300 – ₹5,100</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Repair-to-Value Ratio:</span>
                <span className="font-medium text-slate-800">12% of device value</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200/60 text-xs text-emerald-950 space-y-1">
              <p className="font-semibold">Decision: Repair Recommended</p>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                The repair cost is well below 30% of your laptop’s estimated market value. Fixing this component retains high device equity.
              </p>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              Indicative reference estimate — actual costs may vary by location, service provider, component quality and availability.
            </p>
          </div>
        </div>
      </section>

      {/* 5. How FairFix Works */}
      <section className="space-y-8 pt-4">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Simple, Transparent Process</span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">How FairFix Works</h2>
          <p className="text-sm text-slate-600">
            A three-step consumer journey designed to provide objective clarity without technical confusion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">Enter Details or Symptoms</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Input your laptop specifications for a valuation, or describe what is malfunctioning in plain, everyday language.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">Get Independent Analysis</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Receive an estimated market value with condition depreciation, or explore probable fault categories with indicative repair ranges.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">Make Informed Decisions</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Audit technician quotes to ensure you are not overpaying, and use clear economic guidelines to decide whether to repair or replace.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Bottom Call to Action */}
      <section className="p-8 sm:p-12 rounded-2xl bg-slate-900 text-white text-center space-y-6">
        <div className="space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ready to evaluate your laptop?
          </h2>
          <p className="text-sm text-slate-300">
            Start by calculating your device’s current market value or explore our guided repair assistant.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/valuation"
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-medium text-slate-900 bg-white hover:bg-slate-100 transition-colors text-sm"
          >
            Start Valuation
          </Link>
          <Link
            href="/repair"
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors text-sm"
          >
            Launch Repair Assistant
          </Link>
        </div>
      </section>
    </div>
  );
}