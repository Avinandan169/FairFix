'use client';

import { useState } from 'react';
import {
  Laptop,
  Cpu,
  HardDrive,
  Monitor,
  Sparkles,
  ShieldCheck,
  TrendingDown,
  Info,
  RotateCcw,
  Sliders,
  DollarSign,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { LaptopSpecsInput, ValuationResponse } from '../../types';
import { predictValuation } from '../../services/api';

export default function ValuationPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ValuationResponse | null>(null);

  // Form State
  const [brand, setBrand] = useState('lenovo');
  const [model, setModel] = useState('Lenovo Legion Pro 5');
  const [deviceCategory, setDeviceCategory] = useState('Gaming');
  const [cpuBrand, setCpuBrand] = useState('Intel');
  const [cpuFamily, setCpuFamily] = useState('Core Ultra');
  const [cpuSeries, setCpuSeries] = useState('Core Ultra 7');
  const [cpuModel, setCpuModel] = useState('255HX');
  const [cpuCoreCount, setCpuCoreCount] = useState(20);
  const [cpuThreadCount, setCpuThreadCount] = useState(20);
  const [ramGb, setRamGb] = useState(32);
  const [storageGb, setStorageGb] = useState(1024);
  const [displaySizeInch, setDisplaySizeInch] = useState(16.0);
  const [resolutionPreset, setResolutionPreset] = useState('2560x1600');
  const [gpuType, setGpuType] = useState('Dedicated');
  const [gpuBrand, setGpuBrand] = useState('NVIDIA');
  const [gpuSeries, setGpuSeries] = useState('GeForce RTX');
  const [gpuModel, setGpuModel] = useState('RTX 5060');
  const [gpuVramGb, setGpuVramGb] = useState(8.0);
  const [osName, setOsName] = useState('Windows');
  const [warrantyYears, setWarrantyYears] = useState(1);
  const [askingPrice, setAskingPrice] = useState<string>('185000');

  // Used Device Condition State
  const [isUsed, setIsUsed] = useState(false);
  const [ageMonths, setAgeMonths] = useState(12);
  const [batteryHealth, setBatteryHealth] = useState(85);
  const [cosmeticCondition, setCosmeticCondition] = useState('good');
  const [screenCondition, setScreenCondition] = useState('flawless');
  const [hasWarranty, setHasWarranty] = useState(false);

  // Quick Preset Handlers
  const loadPreset = (presetType: 'gaming' | 'macbook' | 'budget') => {
    setError(null);
    if (presetType === 'gaming') {
      setBrand('lenovo');
      setModel('Lenovo Legion Pro 5');
      setDeviceCategory('Gaming');
      setCpuBrand('Intel');
      setCpuFamily('Core Ultra');
      setCpuSeries('Core Ultra 7');
      setCpuModel('255HX');
      setCpuCoreCount(20);
      setCpuThreadCount(20);
      setRamGb(32);
      setStorageGb(1024);
      setDisplaySizeInch(16.0);
      setResolutionPreset('2560x1600');
      setGpuType('Dedicated');
      setGpuBrand('NVIDIA');
      setGpuSeries('GeForce RTX');
      setGpuModel('RTX 5060');
      setGpuVramGb(8.0);
      setOsName('Windows');
      setWarrantyYears(1);
      setAskingPrice('185000');
      setIsUsed(false);
    } else if (presetType === 'macbook') {
      setBrand('apple');
      setModel('Apple MacBook Air 13');
      setDeviceCategory('Thin & Light');
      setCpuBrand('Apple');
      setCpuFamily('M-series');
      setCpuSeries('M3');
      setCpuModel('M3');
      setCpuCoreCount(8);
      setCpuThreadCount(8);
      setRamGb(16);
      setStorageGb(512);
      setDisplaySizeInch(13.6);
      setResolutionPreset('2560x1600');
      setGpuType('Integrated');
      setGpuBrand('Apple');
      setGpuSeries('Apple GPU');
      setGpuModel('Apple 10-Core GPU');
      setGpuVramGb(0.0);
      setOsName('Mac');
      setWarrantyYears(1);
      setAskingPrice('89000');
      setIsUsed(true);
      setAgeMonths(14);
      setBatteryHealth(88);
      setCosmeticCondition('good');
      setScreenCondition('flawless');
      setHasWarranty(false);
    } else {
      setBrand('hp');
      setModel('HP Pavilion 15');
      setDeviceCategory('Thin & Light');
      setCpuBrand('Intel');
      setCpuFamily('Core');
      setCpuSeries('Core I5');
      setCpuModel('13420H');
      setCpuCoreCount(8);
      setCpuThreadCount(12);
      setRamGb(16);
      setStorageGb(512);
      setDisplaySizeInch(15.6);
      setResolutionPreset('1920x1080');
      setGpuType('Integrated');
      setGpuBrand('Intel');
      setGpuSeries('UHD');
      setGpuModel('UHD Graphics');
      setGpuVramGb(0.0);
      setOsName('Windows');
      setWarrantyYears(1);
      setAskingPrice('42000');
      setIsUsed(true);
      setAgeMonths(24);
      setBatteryHealth(78);
      setCosmeticCondition('fair');
      setScreenCondition('flawless');
      setHasWarranty(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const [wPx, hPx] = resolutionPreset.split('x').map((n) => parseInt(n, 10));

    const payload: LaptopSpecsInput = {
      brand,
      model,
      device_category: deviceCategory,
      cpu_brand: cpuBrand,
      cpu_family: cpuFamily,
      cpu_series: cpuSeries,
      cpu_model: cpuModel,
      cpu_core_count: Number(cpuCoreCount),
      cpu_thread_count: Number(cpuThreadCount),
      ram_gb: Number(ramGb),
      storage_gb: Number(storageGb),
      display_size_inch: Number(displaySizeInch),
      display_width_px: wPx || 1920,
      display_height_px: hPx || 1080,
      gpu_brand: gpuBrand,
      gpu_series: gpuSeries,
      gpu_model: gpuModel,
      gpu_type: gpuType,
      gpu_vram_gb: gpuType === 'Dedicated' ? Number(gpuVramGb) : 0.0,
      os_name: osName,
      warranty_years: Number(warrantyYears),
      asking_price_inr: askingPrice ? parseFloat(askingPrice) : undefined,
      condition: isUsed
        ? {
            is_used: true,
            age_months: Number(ageMonths),
            battery_health_percentage: Number(batteryHealth),
            cosmetic_condition: cosmeticCondition,
            screen_condition: screenCondition,
            has_active_warranty: hasWarranty
          }
        : {
            is_used: false,
            age_months: 0,
            battery_health_percentage: 100,
            cosmetic_condition: 'like_new',
            screen_condition: 'flawless',
            has_active_warranty: false
          }
    };

    try {
      const response = await predictValuation(payload);
      setResult(response);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to communicate with prediction service.');
    } finally {
      setLoading(false);
    }
  };

  const formatRupee = (val: number) => {
    return '₹' + Math.round(val).toLocaleString('en-IN');
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Title & Presets Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <Laptop className="h-3.5 w-3.5 text-slate-700" />
            <span>Valuation Calculator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Laptop Value Calculator</h1>
          <p className="text-sm text-slate-600 mt-1">
            Configure specifications and optional condition details to estimate fair market value.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 font-medium">Sample Configurations:</span>
          <button
            type="button"
            onClick={() => loadPreset('gaming')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-sm transition-colors"
          >
            Gaming Laptop
          </button>
          <button
            type="button"
            onClick={() => loadPreset('macbook')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-sm transition-colors"
          >
            MacBook Air M3
          </button>
          <button
            type="button"
            onClick={() => loadPreset('budget')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-sm transition-colors"
          >
            Everyday Pavilion
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Specification Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          {/* Card 1: Brand & Category */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 text-sm font-semibold border-b border-slate-100 pb-3">
              <Laptop className="h-4 w-4 text-slate-600" />
              <span>1. Device Brand &amp; Category</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Brand</label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all"
                >
                  <option value="lenovo">Lenovo</option>
                  <option value="hp">HP</option>
                  <option value="asus">ASUS</option>
                  <option value="acer">Acer</option>
                  <option value="msi">MSI</option>
                  <option value="dell">Dell</option>
                  <option value="apple">Apple</option>
                  <option value="samsung">Samsung</option>
                  <option value="alienware">Alienware</option>
                  <option value="gigabyte">Gigabyte</option>
                  <option value="other">Other / Standard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Model Name</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. Legion Pro 5"
                  className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Category</label>
                <select
                  value={deviceCategory}
                  onChange={(e) => setDeviceCategory(e.target.value)}
                  className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all"
                >
                  <option value="Gaming">Gaming Laptop</option>
                  <option value="Thin & Light">Thin &amp; Light / Ultrabook</option>
                  <option value="Mainstream">Mainstream / Everyday</option>
                  <option value="Workstation">Professional Workstation</option>
                  <option value="Budget">Budget / Student</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Processor (CPU) */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 text-sm font-semibold border-b border-slate-100 pb-3">
              <Cpu className="h-4 w-4 text-slate-600" />
              <span>2. Processor &amp; Performance</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">CPU Brand</label>
                <select
                  value={cpuBrand}
                  onChange={(e) => setCpuBrand(e.target.value)}
                  className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all"
                >
                  <option value="Intel">Intel</option>
                  <option value="AMD">AMD</option>
                  <option value="Apple">Apple Silicon</option>
                  <option value="Qualcomm">Qualcomm Snapdragon</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Family / Series</label>
                <select
                  value={cpuSeries}
                  onChange={(e) => setCpuSeries(e.target.value)}
                  className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all"
                >
                  <option value="Core Ultra 7">Core Ultra 7</option>
                  <option value="Core Ultra 9">Core Ultra 9</option>
                  <option value="Core Ultra 5">Core Ultra 5</option>
                  <option value="Core I7">Core i7 (13th/14th Gen)</option>
                  <option value="Core I5">Core i5 (13th/14th Gen)</option>
                  <option value="Core I9">Core i9 Flagship</option>
                  <option value="Ryzen 7">Ryzen 7</option>
                  <option value="Ryzen 5">Ryzen 5</option>
                  <option value="Ryzen 9">Ryzen 9</option>
                  <option value="M3">Apple M3 / M3 Pro</option>
                  <option value="M2">Apple M2</option>
                  <option value="M1">Apple M1</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">CPU Cores</label>
                <select
                  value={cpuCoreCount}
                  onChange={(e) => {
                    const c = parseInt(e.target.value, 10);
                    setCpuCoreCount(c);
                    setCpuThreadCount(c >= 12 ? c : c * 2);
                  }}
                  className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all"
                >
                  <option value={4}>4 Cores</option>
                  <option value={6}>6 Cores</option>
                  <option value={8}>8 Cores</option>
                  <option value={10}>10 Cores</option>
                  <option value={12}>12 Cores</option>
                  <option value={14}>14 Cores</option>
                  <option value={16}>16 Cores</option>
                  <option value={20}>20 Cores</option>
                  <option value={24}>24 Cores</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 3: Memory & Storage */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 text-sm font-semibold border-b border-slate-100 pb-3">
              <HardDrive className="h-4 w-4 text-slate-600" />
              <span>3. Memory &amp; Storage</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">RAM Capacity</label>
                <select
                  value={ramGb}
                  onChange={(e) => setRamGb(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all"
                >
                  <option value={8}>8 GB RAM</option>
                  <option value={16}>16 GB RAM</option>
                  <option value={32}>32 GB RAM</option>
                  <option value={64}>64 GB RAM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Storage Capacity</label>
                <select
                  value={storageGb}
                  onChange={(e) => setStorageGb(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all"
                >
                  <option value={256}>256 GB NVMe SSD</option>
                  <option value={512}>512 GB NVMe SSD</option>
                  <option value={1024}>1 TB (1024 GB) NVMe SSD</option>
                  <option value={2048}>2 TB (2048 GB) NVMe SSD</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 4: Display & Graphics */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 text-sm font-semibold border-b border-slate-100 pb-3">
              <Monitor className="h-4 w-4 text-slate-600" />
              <span>4. Display &amp; Graphics</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Screen Size</label>
                <select
                  value={displaySizeInch}
                  onChange={(e) => setDisplaySizeInch(parseFloat(e.target.value))}
                  className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all"
                >
                  <option value={13.3}>13.3 Inch</option>
                  <option value={13.6}>13.6 Inch</option>
                  <option value={14.0}>14.0 Inch</option>
                  <option value={15.6}>15.6 Inch</option>
                  <option value={16.0}>16.0 Inch</option>
                  <option value={17.3}>17.3 Inch</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Resolution</label>
                <select
                  value={resolutionPreset}
                  onChange={(e) => setResolutionPreset(e.target.value)}
                  className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all"
                >
                  <option value="1920x1080">FHD (1920x1080)</option>
                  <option value="1920x1200">WUXGA (1920x1200)</option>
                  <option value="2560x1440">QHD (2560x1440)</option>
                  <option value="2560x1600">2.5K / WQXGA (2560x1600)</option>
                  <option value="2880x1800">3K (2880x1800)</option>
                  <option value="3840x2160">4K UHD (3840x2160)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Graphics Type</label>
                <select
                  value={gpuType}
                  onChange={(e) => setGpuType(e.target.value)}
                  className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all"
                >
                  <option value="Integrated">Integrated GPU</option>
                  <option value="Dedicated">Dedicated GPU</option>
                </select>
              </div>
            </div>

            {gpuType === 'Dedicated' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">GPU Series</label>
                  <select
                    value={gpuSeries}
                    onChange={(e) => setGpuSeries(e.target.value)}
                    className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all"
                  >
                    <option value="GeForce RTX">NVIDIA GeForce RTX</option>
                    <option value="Radeon">AMD Radeon RX</option>
                    <option value="Arc">Intel Arc Discrete</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Dedicated VRAM</label>
                  <select
                    value={gpuVramGb}
                    onChange={(e) => setGpuVramGb(parseFloat(e.target.value))}
                    className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all"
                  >
                    <option value={4.0}>4 GB VRAM</option>
                    <option value={6.0}>6 GB VRAM</option>
                    <option value={8.0}>8 GB VRAM</option>
                    <option value={12.0}>12 GB VRAM</option>
                    <option value={16.0}>16 GB VRAM</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Card 5: Second-Hand Condition (Optional Toggle) */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 text-sm font-semibold">
                <Sliders className="h-4 w-4 text-slate-600" />
                <span>5. Device Condition &amp; Age</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={isUsed}
                  onChange={(e) => setIsUsed(e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4"
                />
                <span>Used or Refurbished Device</span>
              </label>
            </div>

            {isUsed ? (
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Elapsed Age: <span className="font-semibold text-slate-900">{ageMonths} Months</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={60}
                      value={ageMonths}
                      onChange={(e) => setAgeMonths(parseInt(e.target.value, 10))}
                      className="w-full accent-slate-900"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>1 mo</span>
                      <span>2.5 yrs</span>
                      <span>5 yrs</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Battery Health: <span className="font-semibold text-slate-900">{batteryHealth}%</span>
                    </label>
                    <input
                      type="range"
                      min={40}
                      max={100}
                      value={batteryHealth}
                      onChange={(e) => setBatteryHealth(parseInt(e.target.value, 10))}
                      className="w-full accent-slate-900"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>40% (Degraded)</span>
                      <span>80% (Typical)</span>
                      <span>100% (New)</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Cosmetic Casing</label>
                    <select
                      value={cosmeticCondition}
                      onChange={(e) => setCosmeticCondition(e.target.value)}
                      className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all"
                    >
                      <option value="like_new">Like New / Flawless</option>
                      <option value="good">Good (Minor normal scuffs)</option>
                      <option value="fair">Fair (Visible scratches or dings)</option>
                      <option value="poor">Poor (Heavy wear or dents)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Screen Glass</label>
                    <select
                      value={screenCondition}
                      onChange={(e) => setScreenCondition(e.target.value)}
                      className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all"
                    >
                      <option value="flawless">Flawless (No scratches)</option>
                      <option value="minor_scratches">Micro-scratches</option>
                      <option value="visible_scratches">Visible scratches</option>
                      <option value="dead_pixels_or_lines">Dead pixels / lines</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2">
                  <Info className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                  <span>
                    Second-hand depreciation uses econometric remanufacturing wear curves (Türkolmez et al. 2024). Not validated against used transaction logs.
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Valuing as a brand-new retail unit. Toggle above if this is an out-of-warranty or pre-owned device to account for age and wear.
              </p>
            )}
          </div>

          {/* Card 6: Asking Price (Optional for Deal Check) */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 text-sm font-semibold border-b border-slate-100 pb-3">
              <DollarSign className="h-4 w-4 text-slate-600" />
              <span>6. Seller Asking Price (Optional Deal Evaluation)</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Asking Price in INR (₹)
              </label>
              <input
                type="number"
                value={askingPrice}
                onChange={(e) => setAskingPrice(e.target.value)}
                placeholder="e.g. 85000"
                className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Enter what the seller is asking to get an instant deal assessment (Fair Price, Great Deal, or Overpriced).
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                <span>Calculating Valuation...</span>
              </span>
            ) : (
              <>
                <span>Calculate Estimated Value</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}
        </form>

        {/* Valuation Result Panel */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-6">
          {result ? (
            <div className="rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-7 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Valuation Result
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200">
                  {result.used_valuation ? 'Second-Hand Adjusted' : 'New Retail Baseline'}
                </span>
              </div>

              {/* Main Price Box */}
              <div className="text-center space-y-1.5 py-2">
                <span className="text-xs font-medium text-slate-500">
                  {result.used_valuation ? 'Estimated Used Market Value' : 'Estimated Retail Market Value'}
                </span>
                <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                  {formatRupee(result.valuation_inr)}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Expected Range: {formatRupee(result.price_range_low_inr)} – {formatRupee(result.price_range_high_inr)}
                </div>
                {result.used_valuation && (
                  <div className="text-xs text-slate-500 pt-1">
                    New Retail Baseline: <span className="font-semibold text-slate-800">{formatRupee(result.new_price_baseline_inr)}</span>
                  </div>
                )}
              </div>

              {/* Deal Assessment Card (if asking price provided) */}
              {result.deal_assessment && (
                <div className={`p-4 rounded-xl border space-y-2 ${
                  result.deal_assessment.verdict === 'GREAT_DEAL'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : result.deal_assessment.verdict === 'FAIR_PRICE'
                    ? 'bg-blue-50 border-blue-200 text-blue-900'
                    : result.deal_assessment.verdict === 'SLIGHTLY_OVERPRICED'
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider">Deal Assessment</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-white/80 border border-current">
                      {result.deal_assessment.difference_percentage > 0 ? '+' : ''}
                      {result.deal_assessment.difference_percentage}%
                    </span>
                  </div>
                  <div className="text-sm font-bold">
                    {result.deal_assessment.verdict_label}
                  </div>
                  <div className="text-xs opacity-90">
                    Seller asking price is <span className="font-bold">{formatRupee(result.deal_assessment.asking_price_inr)}</span> (
                    {result.deal_assessment.difference_inr > 0 ? '+' : ''}
                    {formatRupee(result.deal_assessment.difference_inr)} vs estimated value).
                  </div>
                </div>
              )}

              {/* Condition Depreciation Breakdown (if used) */}
              {result.used_valuation && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-900 pb-1 border-b border-slate-200/60">
                    <span>Total Condition Depreciation</span>
                    <span className="text-rose-600 font-bold">-{result.used_valuation.depreciation_percentage}%</span>
                  </div>

                  <div className="space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>Age Depreciation ({ageMonths} months)</span>
                      <span className="font-medium text-slate-800">-{result.used_valuation.breakdown.age_depreciation_pct}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Battery Capacity ({batteryHealth}%)</span>
                      <span className="font-medium text-slate-800">-{result.used_valuation.breakdown.battery_penalty_pct}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cosmetic Wear ({cosmeticCondition})</span>
                      <span className="font-medium text-slate-800">-{result.used_valuation.breakdown.cosmetic_penalty_pct}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Top Specification Influences */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  Top Influencing Specifications
                </span>
                <div className="space-y-1.5">
                  {result.key_drivers.slice(0, 4).map((driver, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/60 text-xs"
                    >
                      <span className="text-slate-700 font-medium capitalize">{driver.feature.replace(/_/g, ' ')}</span>
                      <span
                        className={`font-semibold ${
                          driver.shap_value > 0 ? 'text-emerald-700' : 'text-slate-500'
                        }`}
                      >
                        {driver.shap_value > 0 ? '+' : ''}
                        {formatRupee(driver.shap_value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
                {result.data_provenance_note}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-white border border-slate-200/80 p-8 text-center space-y-4 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 mx-auto">
                <Laptop className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Ready to Value Your Device</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Fill in the specifications on the left, optionally toggle condition wear, and click
                <strong> Calculate Estimated Value</strong>.
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => loadPreset('macbook')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                >
                  Load MacBook Air Sample
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}