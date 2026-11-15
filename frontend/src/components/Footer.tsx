import Link from 'next/link';
import { Laptop, ExternalLink, GraduationCap, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                <Laptop className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-slate-900 tracking-tight">FairFix</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Independent consumer utility for laptop valuation and repair decision support. Understand what your device is worth, what it might cost to fix, and whether the deal is fair.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
              <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
              <span>B.Tech Computer Science Capstone</span>
            </div>
          </div>

          {/* Consumer Tools */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Consumer Tools</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/valuation" className="hover:text-slate-900 transition-colors">Laptop Value Calculator</Link>
              </li>
              <li>
                <Link href="/repair" className="hover:text-slate-900 transition-colors">Repair Assistant</Link>
              </li>
              <li>
                <Link href="/repair" className="hover:text-slate-900 transition-colors">Technician Quote Evaluator</Link>
              </li>
              <li>
                <Link href="/repair" className="hover:text-slate-900 transition-colors">Repair vs. Replace Advisor</Link>
              </li>
            </ul>
          </div>

          {/* Literature & Foundation */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Foundational Research</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://doi.org/10.1007/s10796-024-10515-9"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <span>Türkolmez et al. (2024) — Wear Curves</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://doi.org/10.1109/ICISCT64202.2024.10957051"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <span>Kuchkorov et al. (2024) — Ensembles</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://openrepair.org"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <span>Open Repair Alliance (CompCat)</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Academic & Technical */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Technical Reference</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/methodology" className="hover:text-slate-900 transition-colors font-medium text-slate-700">
                  Methodology & Dataset Docs →
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-slate-900 transition-colors text-slate-500">
                  Model Performance Telemetry
                </Link>
              </li>
              <li>
                <span className="text-slate-400">Illustrative Pricing Catalogue (33 Heuristic Records)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 FairFix. Independent consumer utility for laptop valuation and repair guidance.</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Indicative heuristic estimates — actual local quotes may vary.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
