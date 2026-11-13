import Link from 'next/link';
import { ShieldCheck, ExternalLink, GraduationCap, Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-cyan-600 flex items-center justify-center text-white">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">FAIRFIX</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              ML-Based Price Intelligence and Valuation for Used and Out-of-Warranty Laptops.
              Trained on modern Indian hardware specifications, validated via chassis-grouped cross-validation,
              and grounded in peer-reviewed electronics remanufacturing literature.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <GraduationCap className="h-4 w-4 text-cyan-400" />
              <span>B.Tech Computer Science and Engineering Capstone Project</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3 tracking-wider uppercase">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/valuation" className="hover:text-cyan-400 transition-colors">Laptop Valuation Studio</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">Model Metrics & Telemetry</Link>
              </li>
              <li>
                <Link href="/methodology" className="hover:text-cyan-400 transition-colors">Methodology & Dataset Docs</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3 tracking-wider uppercase">Literature References</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-slate-300">
                <a href="https://doi.org/10.1007/s10796-024-10515-9" target="_blank" rel="noreferrer" className="flex items-center gap-1">
                  <span>Türkolmez et al. (2024)</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li className="hover:text-slate-300">
                <a href="https://doi.org/10.1109/ICISCT64202.2024.10957051" target="_blank" rel="noreferrer" className="flex items-center gap-1">
                  <span>Kuchkorov et al. (2024)</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li className="hover:text-slate-300">
                <a href="https://doi.org/10.71097/IJSAT.v16.i2.6502" target="_blank" rel="noreferrer" className="flex items-center gap-1">
                  <span>Gupta et al. (2025)</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 FAIRFIX Research Project. Built with genuine ML & Full-Stack Engineering.</p>
          <div className="flex items-center gap-4">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-mono">
              R² = 0.9307 (Test Verified)
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 font-mono">
              MAE = ₹11,230
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
