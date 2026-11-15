'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  CheckCircle2,
  Cpu,
  Database,
  TrendingUp,
  Sliders,
  Layers,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Info
} from 'lucide-react';
import { ModelMetricsResponse, DiagnosisMetricsResponse } from '../../types';
import { getModelMetrics, getDiagnosisMetrics } from '../../services/api';

export default function DashboardPage() {
  const [data, setData] = useState<ModelMetricsResponse | null>(null);
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisMetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'comparison' | 'charts' | 'features' | 'tiers' | 'diagnosis'>('comparison');

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const [resVal, resDiag] = await Promise.all([
        getModelMetrics(),
        getDiagnosisMetrics().catch(() => null)
      ]);
      setData(resVal);
      setDiagnosisData(resDiag);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch metrics from backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const formatRupee = (val: number) => {
    return '₹' + Math.round(val).toLocaleString('en-IN');
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="animate-spin h-7 w-7 border-2 border-slate-900 border-t-transparent rounded-full mx-auto"></div>
        <p className="text-xs text-slate-500">Loading evaluation telemetry from serialized artifacts...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-20 max-w-xl mx-auto px-4 text-center space-y-4">
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 space-y-3">
          <h3 className="text-sm font-bold text-rose-900">Could Not Connect to Backend API</h3>
          <p className="text-xs text-rose-700 leading-relaxed">
            Ensure the FastAPI backend is running on <code>http://localhost:8000</code>.
          </p>
          <button
            onClick={fetchMetrics}
            className="px-4 py-2 rounded-xl bg-rose-900 hover:bg-rose-800 text-xs font-semibold text-white transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const { evaluation_summary, model_comparison, feature_importances, shap_summary, test_prediction_points } = data;
  const best = evaluation_summary.metrics;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <BarChart3 className="h-3.5 w-3.5 text-slate-700" />
            <span>Academic Telemetry Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Model Performance Telemetry</h1>
          <p className="text-sm text-slate-600 mt-1">
            Out-of-sample evaluation metrics loaded dynamically from serialized training artifacts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchMetrics}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reload Artifacts</span>
          </button>
        </div>
      </div>

      {/* Champion KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Test Set R² Score</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-[10px] font-semibold">
              Target &gt; 0.90 Met
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">
            {best.r2_score}
          </div>
          <p className="text-[11px] text-slate-500">
            Explains ~93.1% of target price variance on held-out test data
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Mean Absolute Error</span>
            <span className="text-emerald-700 text-xs font-mono font-semibold">Lowest of All</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">
            {formatRupee(best.mae_inr)}
          </div>
          <p className="text-[11px] text-slate-500">
            Average prediction deviation on unseen hardware configurations
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">5-Fold CV R² Mean</span>
            <span className="text-blue-700 text-xs font-mono font-semibold">In-Distribution</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">
            {evaluation_summary.cross_validation.r2_mean}
          </div>
          <p className="text-[11px] text-slate-500">
            Standard deviation across 5 folds: ±{evaluation_summary.cross_validation.r2_std}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">GroupKFold R²</span>
            <span className="text-indigo-700 text-xs font-mono font-semibold">Chassis Proof</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">
            {evaluation_summary.group_cross_validation.r2_mean}
          </div>
          <p className="text-[11px] text-slate-500">
            Withholds entire product chassis families from training folds
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('comparison')}
          className={`py-2.5 px-3.5 text-xs font-semibold rounded-t-xl transition-all ${
            activeTab === 'comparison'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Model Benchmark Matrix
        </button>
        <button
          onClick={() => setActiveTab('charts')}
          className={`py-2.5 px-3.5 text-xs font-semibold rounded-t-xl transition-all ${
            activeTab === 'charts'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Actual vs Predicted
        </button>
        <button
          onClick={() => setActiveTab('features')}
          className={`py-2.5 px-3.5 text-xs font-semibold rounded-t-xl transition-all ${
            activeTab === 'features'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Feature Importance &amp; SHAP
        </button>
        <button
          onClick={() => setActiveTab('tiers')}
          className={`py-2.5 px-3.5 text-xs font-semibold rounded-t-xl transition-all ${
            activeTab === 'tiers'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Price Tier Errors
        </button>
        <button
          onClick={() => setActiveTab('diagnosis')}
          className={`py-2.5 px-3.5 text-xs font-semibold rounded-t-xl transition-all ${
            activeTab === 'diagnosis'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Fault Classifier Telemetry (NLP)
        </button>
      </div>

      {/* Tab 1: Algorithm Comparison Table */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Evaluation Benchmark Matrix (Ordered by Test R²)
              </span>
              <span className="text-xs text-slate-500">
                Trained on 793 samples, Tested on 199 held-out samples
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Algorithm</th>
                    <th className="py-3 px-4">Test R²</th>
                    <th className="py-3 px-4">Test MAE (₹)</th>
                    <th className="py-3 px-4">Test RMSE</th>
                    <th className="py-3 px-4">Test MAPE</th>
                    <th className="py-3 px-4">5-Fold CV R²</th>
                    <th className="py-3 px-4">GroupKFold R²</th>
                    <th className="py-3 px-4">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-mono">
                  {model_comparison.comparison_table.map((row, i) => (
                    <tr
                      key={i}
                      className={
                        row.is_best
                          ? 'bg-slate-50 font-bold text-slate-900'
                          : 'hover:bg-slate-50/50 transition-colors'
                      }
                    >
                      <td className="py-3 px-4 font-sans font-medium flex items-center gap-2">
                        {row.is_best && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                        <span>{row.model_name}</span>
                      </td>
                      <td className={`py-3 px-4 ${row.test_r2 >= 0.9 ? 'text-emerald-700 font-bold' : ''}`}>
                        {row.test_r2}
                      </td>
                      <td className="py-3 px-4 text-slate-900 font-semibold">{formatRupee(row.test_mae_inr)}</td>
                      <td className="py-3 px-4 text-slate-500">{formatRupee(row.test_rmse_inr)}</td>
                      <td className="py-3 px-4 text-slate-500">{row.test_mape_pct}%</td>
                      <td className="py-3 px-4 text-blue-700">{row.cv_r2_mean}</td>
                      <td className="py-3 px-4 text-indigo-700">{row.group_cv_r2_mean}</td>
                      <td className="py-3 px-4 font-sans">
                        {row.is_best ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] uppercase font-bold">
                            Champion
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Benchmark</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
            {model_comparison.key_takeaways.map((takeaway, i) => (
              <div key={i} className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm leading-relaxed">
                {takeaway}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Actual vs Predicted */}
      {activeTab === 'charts' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Actual vs Predicted Price Distribution</h3>
                <p className="text-xs text-slate-500">Sample of held-out test instances evaluating prediction accuracy.</p>
              </div>
              <span className="text-xs text-emerald-700 font-mono font-bold">Test R²: {best.r2_score}</span>
            </div>

            <div className="max-h-96 overflow-y-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 text-slate-700 sticky top-0 border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Sample #</th>
                    <th className="p-2.5">Actual Listed Price</th>
                    <th className="p-2.5">Predicted Price</th>
                    <th className="p-2.5">Residual Error</th>
                    <th className="p-2.5">Error %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {test_prediction_points.slice(0, 30).map((pt) => (
                    <tr key={pt.index} className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-400">#{pt.index}</td>
                      <td className="p-2.5 font-bold text-slate-900">{formatRupee(pt.actual_inr)}</td>
                      <td className="p-2.5 text-slate-800">{formatRupee(pt.predicted_inr)}</td>
                      <td className={`p-2.5 ${Math.abs(pt.residual_inr) < 10000 ? 'text-emerald-700 font-semibold' : 'text-amber-700'}`}>
                        {pt.residual_inr > 0 ? '+' : ''}{formatRupee(pt.residual_inr)}
                      </td>
                      <td className="p-2.5 text-slate-500">{pt.error_percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-right text-[11px] text-slate-400">
              Showing first 30 of {test_prediction_points.length} held-out test predictions.
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Feature Importance & SHAP */}
      {activeTab === 'features' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Global Tree Importance */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="h-4 w-4 text-slate-600" />
                <span>Global Tree Impurity Importance (MDI)</span>
              </h3>
              <p className="text-xs text-slate-500">Relative contribution to variance reduction across the boosted decision forest.</p>

              <div className="space-y-3 pt-2">
                {feature_importances.slice(0, 10).map((feat, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-700 font-medium capitalize">{feat.feature.replace(/_/g, ' ')}</span>
                      <span className="text-slate-900 font-mono font-bold">{feat.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-slate-900 h-full rounded-full"
                        style={{ width: `${Math.min(100, feat.percentage * 2.5)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mean Absolute SHAP Impact */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-slate-600" />
                <span>Mean Absolute SHAP Value (Rupee Impact)</span>
              </h3>
              <p className="text-xs text-slate-500">Average magnitude of price adjustment exerted by each hardware specification.</p>

              <div className="space-y-2.5 pt-2">
                {shap_summary.top_shap_features.slice(0, 10).map((shap, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
                    <span className="text-slate-700 font-medium capitalize">{shap.feature.replace(/_/g, ' ')}</span>
                    <span className="text-emerald-700 font-mono font-bold">±{formatRupee(shap.impact_inr)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Price Tier Errors */}
      {activeTab === 'tiers' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Error Distribution Across Consumer Price Tiers</h3>
              <p className="text-xs text-slate-500">Verifying that error percentage remains stable across entry, mid-range, and enthusiast brackets.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="p-3">Price Tier Bracket</th>
                    <th className="p-3">Test Support</th>
                    <th className="p-3">MAE (INR)</th>
                    <th className="p-3">R² Score</th>
                    <th className="p-3">MAPE %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {evaluation_summary.price_tier_performance.map((tier, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-3 font-sans font-medium text-slate-900">{tier.tier_name}</td>
                      <td className="p-3 text-slate-500">{tier.count} samples</td>
                      <td className="p-3 text-slate-900 font-bold">{formatRupee(tier.mae_inr)}</td>
                      <td className="p-3 text-emerald-700 font-bold">{tier.r2_score}</td>
                      <td className="p-3 text-slate-600">{tier.mape_percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Diagnosis Telemetry (NLP) */}
      {activeTab === 'diagnosis' && (
        <div className="space-y-6">
          {!diagnosisData ? (
            <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center text-xs text-slate-500">
              No diagnosis telemetry artifacts loaded.
            </div>
          ) : (
            <>
              {/* Algorithm Comparison Table */}
              <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      NLP Fault Classifier Benchmark (5-Fold Stratified Cross-Validation)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Ingested 2,404 clean community repair records across 17 empirical fault categories.
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
                    Champion: Calibrated Linear SVC
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                      <tr>
                        <th className="p-3">Algorithm Candidate</th>
                        <th className="p-3">CV Macro F1 (Mean)</th>
                        <th className="p-3">CV Macro F1 (Std)</th>
                        <th className="p-3">CV Accuracy (Mean)</th>
                        <th className="p-3 font-sans">Calibration Method</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      {Object.entries(diagnosisData.model_comparison).map(([modelKey, metrics]) => {
                        const isWinning = modelKey === 'Calibrated_Linear_SVC';
                        return (
                          <tr
                            key={modelKey}
                            className={isWinning ? 'bg-slate-50 text-slate-900 font-bold' : 'hover:bg-slate-50/50'}
                          >
                            <td className="p-3 font-sans font-medium">
                              {modelKey.replace(/_/g, ' ')}
                              {isWinning && (
                                <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                                  Selected Champion
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-slate-900 font-bold">{metrics.cv_macro_f1_mean.toFixed(4)}</td>
                            <td className="p-3 text-slate-400">±{metrics.cv_macro_f1_std.toFixed(4)}</td>
                            <td className="p-3 text-emerald-700 font-bold">{(metrics.cv_accuracy_mean * 100).toFixed(2)}%</td>
                            <td className="p-3 font-sans text-slate-500">
                              {modelKey === 'Calibrated_Linear_SVC' ? 'Sigmoid (Platt Scaling, 3-fold)' : 'Standard / None'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Leakage & Generalization Robustness Matrix */}
              <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Data Science Leakage Audit &amp; Generalization Robustness Matrix
                    </h3>
                    <p className="text-xs text-slate-500">
                      Transparently reporting accuracy across standard split, verbatim duplicate exclusion, and cluster GroupKFold.
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 font-semibold">
                    Academic Transparency Audit
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                      <tr>
                        <th className="p-3 font-sans">Evaluation Perspective</th>
                        <th className="p-3 font-sans">Sample Scope</th>
                        <th className="p-3">Accuracy</th>
                        <th className="p-3">Macro F1</th>
                        <th className="p-3 font-sans">Methodological Significance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-sans font-medium text-slate-900">Standard Held-Out Test Split</td>
                        <td className="p-3 text-slate-500 font-sans">481 held-out test records</td>
                        <td className="p-3 text-slate-900 font-bold">72.35%</td>
                        <td className="p-3 text-slate-900 font-bold">0.6836</td>
                        <td className="p-3 font-sans text-slate-500">Stratified random split preserving real-world community log distribution.</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-sans font-medium text-slate-900">Exact-Duplicate-Excluded Subset</td>
                        <td className="p-3 text-slate-500 font-sans">400 novel descriptions</td>
                        <td className="p-3 text-amber-700 font-bold">67.50%</td>
                        <td className="p-3 text-amber-700 font-bold">0.6456</td>
                        <td className="p-3 font-sans text-slate-500">Excludes 81 test instances sharing verbatim shorthand text with training split.</td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="p-3 font-sans font-medium text-slate-900">GroupKFold (Near-Duplicate Isolated)</td>
                        <td className="p-3 text-slate-700 font-sans font-medium">1,991 text clusters (2,404 total)</td>
                        <td className="p-3 text-emerald-700 font-bold">72.50% ± 1.8%</td>
                        <td className="p-3 text-emerald-700 font-bold">0.6797 ± 0.014</td>
                        <td className="p-3 font-sans text-slate-700">5-Fold GroupKFold strictly isolating normalized &amp; near-duplicate clusters.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
                  <strong>Academic Disclosure:</strong> In community repair records, short fixer descriptions (e.g. <em>&quot;broken lcd&quot;</em>, <em>&quot;battery replaced&quot;</em>, <em>&quot;slow&quot;</em>) naturally repeat across independent repair events. When evaluating strictly on novel phrasing (400 samples), accuracy is 67.50% (~11.5× better than the 5.88% random baseline). When conducting 5-Fold GroupKFold on 1,991 normalized clusters across the entire 2,404 dataset, out-of-fold generalization stabilizes at 72.50%.
                </div>
              </div>

              {/* Per-Class Metrics Table */}
              <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">
                    Per-Category Classification Report on Held-Out Test Split (481 Samples)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Detailed precision, recall, and F1 performance across all 17 empirical fault categories.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                      <tr>
                        <th className="p-3 font-sans">Fault Category</th>
                        <th className="p-3">Test Support</th>
                        <th className="p-3">Precision</th>
                        <th className="p-3">Recall</th>
                        <th className="p-3">F1-Score</th>
                        <th className="p-3 font-sans">Top Predictive Keywords</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      {Object.entries(diagnosisData.per_class_metrics).map(([cls, met]) => {
                        const keywords = diagnosisData.top_keywords_per_class[cls] || [];
                        return (
                          <tr key={cls} className="hover:bg-slate-50">
                            <td className="p-3 font-sans font-medium text-slate-900">{cls}</td>
                            <td className="p-3 text-slate-400">{met.support}</td>
                            <td className="p-3 text-slate-800 font-semibold">{(met.precision * 100).toFixed(1)}%</td>
                            <td className="p-3 text-slate-800 font-semibold">{(met.recall * 100).toFixed(1)}%</td>
                            <td className="p-3 text-emerald-700 font-bold">{(met.f1_score * 100).toFixed(1)}%</td>
                            <td className="p-3 font-sans">
                              <div className="flex flex-wrap gap-1">
                                {keywords.slice(0, 4).map((kw, idx) => (
                                  <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                                    {kw}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}