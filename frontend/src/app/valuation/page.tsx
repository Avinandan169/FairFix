'use client';

import { useState } from 'react';
import {
  Cpu,
  Layers,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  Info,
  RotateCcw,
  Sliders,
  DollarSign,
  ChevronDown,
  CheckCircle,
  AlertTriangle
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
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Title & Presets Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-semibold">
            Inference & Intelligence Engine
          </span>
          <h1 className="text-3xl font-bold text-white tracking-tight">Laptop Valuation Studio</h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure hardware specifications and optional second-hand condition to calculate true market value.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs text-slate-500 font-medium mr-1">Load Presets:</span>
          <button
            type="button"
            onClick={() => loadPreset('gaming')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
          >
            Legion Gaming
          </button>
          <button
            type="button"
            onClick={() => loadPreset('macbook')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
          >
            Refurbished M3
          </button>
          <button
            type="button"
            onClick={() => loadPreset('budget')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
          >
            Used Pavilion
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Specification Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          {/* Card 1: Core Identity & Category */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold border-b border-slate-800/80 pb-3">
              <Cpu className="h-4 w-4" />
              <span>1. System Identity & Category</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Brand</label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
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
                  <option value="other">Other / White-label</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Product Model</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. Legion Pro 5, Pavilion 15"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Device Category</label>
                <select
                  value={deviceCategory}
                  onChange={(e) => setDeviceCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Thin & Light">Thin & Light</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Business">Business</option>
                  <option value="Convertible">Convertible (2-in-1)</option>
                  <option value="General">General / Everyday</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Processor (CPU) Specifications */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold border-b border-slate-800/80 pb-3">
              <Sliders className="h-4 w-4" />
              <span>2. Processor (CPU) Architecture</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">CPU Manufacturer</label>
                <select
                  value={cpuBrand}
                  onChange={(e) => setCpuBrand(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Intel">Intel</option>
                  <option value="AMD">AMD</option>
                  <option value="Apple">Apple Silicon</option>
                  <option value="Snapdragon">Qualcomm Snapdragon</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">CPU Series Tier</label>
                <select
                  value={cpuSeries}
                  onChange={(e) => setCpuSeries(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Core I5">Intel Core i5</option>
                  <option value="Core I7">Intel Core i7</option>
                  <option value="Core I3">Intel Core i3</option>
                  <option value="Core I9">Intel Core i9</option>
                  <option value="Core Ultra 7">Intel Core Ultra 7</option>
                  <option value="Core Ultra 5">Intel Core Ultra 5</option>
                  <option value="Core Ultra 9">Intel Core Ultra 9</option>
                  <option value="Ryzen 5">AMD Ryzen 5</option>
                  <option value="Ryzen 7">AMD Ryzen 7</option>
                  <option value="Ryzen 9">AMD Ryzen 9</option>
                  <option value="M1">Apple M1</option>
                  <option value="M2">Apple M2</option>
                  <option value="M3">Apple M3</option>
                  <option value="M4">Apple M4</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">CPU Model Number</label>
                <input
                  type="text"
                  value={cpuModel}
                  onChange={(e) => setCpuModel(e.target.value)}
                  placeholder="e.g. 13420H, 255HX, 7735HS"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Physical CPU Cores</span>
                  <span className="text-cyan-400 font-mono font-bold">{cpuCoreCount} Cores</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="24"
                  value={cpuCoreCount}
                  onChange={(e) => setCpuCoreCount(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Logical Execution Threads</span>
                  <span className="text-cyan-400 font-mono font-bold">{cpuThreadCount} Threads</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="32"
                  value={cpuThreadCount}
                  onChange={(e) => setCpuThreadCount(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Memory, Storage & Display */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold border-b border-slate-800/80 pb-3">
              <Layers className="h-4 w-4" />
              <span>3. Memory, Storage & Display</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">RAM Capacity</label>
                <select
                  value={ramGb}
                  onChange={(e) => setRamGb(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value={8}>8 GB</option>
                  <option value={16}>16 GB</option>
                  <option value={24}>24 GB</option>
                  <option value={32}>32 GB</option>
                  <option value={64}>64 GB</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Storage Capacity</label>
                <select
                  value={storageGb}
                  onChange={(e) => setStorageGb(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value={256}>256 GB SSD</option>
                  <option value={512}>512 GB SSD</option>
                  <option value={1024}>1 TB SSD</option>
                  <option value={2048}>2 TB SSD</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Display Size</label>
                <select
                  value={displaySizeInch}
                  onChange={(e) => setDisplaySizeInch(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value={13.3}>13.3 Inches</option>
                  <option value={14.0}>14.0 Inches</option>
                  <option value={15.6}>15.6 Inches</option>
                  <option value={16.0}>16.0 Inches</option>
                  <option value={17.3}>17.3 Inches</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Screen Resolution</label>
                <select
                  value={resolutionPreset}
                  onChange={(e) => setResolutionPreset(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="1920x1080">FHD (1920x1080)</option>
                  <option value="1920x1200">WUXGA (1920x1200)</option>
                  <option value="2560x1440">QHD (2560x1440)</option>
                  <option value="2560x1600">WQXGA (2560x1600)</option>
                  <option value="2880x1800">3K (2880x1800)</option>
                  <option value="3840x2160">4K UHD (3840x2160)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 4: Graphics (GPU) Configuration */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold border-b border-slate-800/80 pb-3">
              <Sparkles className="h-4 w-4" />
              <span>4. Graphics Processing Unit (GPU)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">GPU Architecture</label>
                <select
                  value={gpuType}
                  onChange={(e) => setGpuType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Integrated">Integrated Graphics</option>
                  <option value="Dedicated">Dedicated GPU</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">GPU Family / Series</label>
                <select
                  value={gpuSeries}
                  onChange={(e) => setGpuSeries(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="GeForce RTX">NVIDIA GeForce RTX</option>
                  <option value="Iris Xe">Intel Iris Xe</option>
                  <option value="UHD">Intel UHD Graphics</option>
                  <option value="Arc">Intel Arc Graphics</option>
                  <option value="Radeon">AMD Radeon Graphics</option>
                  <option value="Apple GPU">Apple Integrated GPU</option>
                </select>
              </div>

              {gpuType === 'Dedicated' ? (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Dedicated VRAM</label>
                  <select
                    value={gpuVramGb}
                    onChange={(e) => setGpuVramGb(parseFloat(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value={4.0}>4 GB GDDR6</option>
                    <option value={6.0}>6 GB GDDR6</option>
                    <option value={8.0}>8 GB GDDR6</option>
                    <option value={12.0}>12 GB GDDR6</option>
                    <option value={16.0}>16 GB GDDR6</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Dedicated VRAM</label>
                  <div className="w-full bg-slate-950/40 border border-slate-800/40 rounded-lg px-3 py-2 text-xs text-slate-500">
                    Shared System Memory (0 GB)
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card 5: OS & Asking Price */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold border-b border-slate-800/80 pb-3">
              <DollarSign className="h-4 w-4" />
              <span>5. Operating System & Seller Asking Price</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Operating System</label>
                <select
                  value={osName}
                  onChange={(e) => setOsName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Windows">Windows 11 / 10</option>
                  <option value="Mac">macOS</option>
                  <option value="Linux">Linux / Ubuntu</option>
                  <option value="Chrome">ChromeOS</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Seller Asking Price (INR ₹) <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="number"
                  value={askingPrice}
                  onChange={(e) => setAskingPrice(e.target.value)}
                  placeholder="e.g. 75000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Card 6: Used / Refurbished Condition Toggle */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${isUsed ? 'bg-amber-600/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                  <TrendingDown className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Used / Out-of-Warranty Valuation Layer</h3>
                  <p className="text-xs text-slate-400">Apply empirical remanufacturing depreciation heuristics (Türkolmez et al. 2024)</p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUsed}
                  onChange={(e) => setIsUsed(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {isUsed && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium">Device Age</span>
                      <span className="text-amber-400 font-mono font-bold">{ageMonths} Months ({Math.round((ageMonths/12)*10)/10} yrs)</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="60"
                      value={ageMonths}
                      onChange={(e) => setAgeMonths(parseInt(e.target.value, 10))}
                      className="w-full accent-amber-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium">Battery Health</span>
                      <span className="text-amber-400 font-mono font-bold">{batteryHealth}% Maximum Capacity</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      value={batteryHealth}
                      onChange={(e) => setBatteryHealth(parseInt(e.target.value, 10))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Cosmetic Wear Grade</label>
                    <select
                      value={cosmeticCondition}
                      onChange={(e) => setCosmeticCondition(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="like_new">Like New / Pristine</option>
                      <option value="good">Good (Normal wear)</option>
                      <option value="fair">Fair (Scratches/scuffs)</option>
                      <option value="poor">Poor (Heavy dents/cracks)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Screen / Panel Condition</label>
                    <select
                      value={screenCondition}
                      onChange={(e) => setScreenCondition(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="flawless">Flawless (Zero scratches)</option>
                      <option value="minor_scratches">Minor hairline scratches</option>
                      <option value="visible_scratches">Visible scratches</option>
                      <option value="dead_pixels_or_lines">Dead pixels / screen bleed</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={hasWarranty}
                        onChange={(e) => setHasWarranty(e.target.checked)}
                        className="rounded bg-slate-950 border-slate-800 text-amber-500 focus:ring-0"
                      />
                      <span>Active Manufacturer Warranty (+6% bonus)</span>
                    </label>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/40 text-[11px] text-amber-300/80 leading-relaxed flex items-start gap-2">
                  <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
                  <span>
                    <strong>Experimental Literature Heuristic:</strong> Used-device depreciation is calculated using the
                    econometric framework published in <em>Information Systems Frontiers</em> (Türkolmez et al. 2024).
                    Clearly separate from the machine-learned replacement baseline.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-xl shadow-cyan-500/20 transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                <span>Calculating Valuation via Gradient Boosting Pipeline...</span>
              </span>
            ) : (
              <span>Compute FairFix Market Valuation</span>
            )}
          </button>

          {error && (
            <div className="p-4 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-sm flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </form>

        {/* Valuation Result Panel */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          {result ? (
            <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-semibold">
                  Valuation Result
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 font-mono">
                  {result.model_name} (R² {result.model_r2_score})
                </span>
              </div>

              {/* Main Price Box */}
              <div className="text-center space-y-2 py-2">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  {result.used_valuation ? 'Adjusted Second-Hand Valuation' : 'Estimated Fair Market Value'}
                </span>
                <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                  {formatRupee(result.valuation_inr)}
                </div>
                <div className="text-xs text-cyan-400/90 font-medium">
                  Confidence Range: {formatRupee(result.price_range_low_inr)} – {formatRupee(result.price_range_high_inr)}
                </div>
                {result.used_valuation && (
                  <div className="text-xs text-slate-400 pt-1">
                    New Retail Baseline: <span className="font-mono text-slate-300">{formatRupee(result.new_price_baseline_inr)}</span>
                  </div>
                )}
              </div>

              {/* Deal Assessment Card (if asking price was provided) */}
              {result.deal_assessment && (
                <div className={`p-4 rounded-xl border space-y-3 ${
                  result.deal_assessment.verdict === 'GREAT_DEAL'
                    ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                    : result.deal_assessment.verdict === 'FAIR_PRICE'
                    ? 'bg-blue-950/40 border-blue-800/80 text-blue-300'
                    : result.deal_assessment.verdict === 'SLIGHTLY_OVERPRICED'
                    ? 'bg-amber-950/40 border-amber-800/80 text-amber-300'
                    : 'bg-red-950/40 border-red-800/80 text-red-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider">Market Deal Verdict</span>
                    <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-slate-900 border border-slate-800">
                      {result.deal_assessment.difference_percentage > 0 ? '+' : ''}
                      {result.deal_assessment.difference_percentage}%
                    </span>
                  </div>
                  <div className="text-base font-bold">
                    {result.deal_assessment.verdict_label}
                  </div>
                  <div className="text-xs opacity-90">
                    Seller asking price is <span className="font-mono font-bold">{formatRupee(result.deal_assessment.asking_price_inr)}</span> (
                    {result.deal_assessment.difference_inr > 0 ? '+' : ''}
                    {formatRupee(result.deal_assessment.difference_inr)} vs valuation).
                  </div>
                </div>
              )}

              {/* Used Depreciation Breakdown (if used) */}
              {result.used_valuation && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">Total Condition Depreciation</span>
                    <span className="font-mono font-bold text-amber-400">-{result.used_valuation.depreciation_percentage}%</span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-400">
                    <div className="flex justify-between">
                      <span>Age Depreciation ({ageMonths} mos)</span>
                      <span className="font-mono text-slate-300">-{result.used_valuation.breakdown.age_depreciation_pct}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Battery Capacity Wear ({batteryHealth}%)</span>
                      <span className="font-mono text-slate-300">-{result.used_valuation.breakdown.battery_penalty_pct}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cosmetic Condition ({cosmeticCondition})</span>
                      <span className="font-mono text-slate-300">-{result.used_valuation.breakdown.cosmetic_penalty_pct}%</span>
                    </div>
                    {result.used_valuation.breakdown.warranty_bonus_pct > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Active Warranty Offset</span>
                        <span className="font-mono">+{result.used_valuation.breakdown.warranty_bonus_pct}%</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Top SHAP Drivers */}
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Key Influencing Drivers (SHAP Tree Values)</span>
                </span>
                <div className="space-y-2">
                  {result.key_drivers.slice(0, 5).map((driver, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/60 text-xs"
                    >
                      <span className="text-slate-300 font-medium capitalize">{driver.feature.replace(/_/g, ' ')}</span>
                      <span
                        className={`font-mono font-bold ${
                          driver.shap_value > 0 ? 'text-emerald-400' : 'text-slate-400'
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
              <div className="pt-2 text-[11px] text-slate-500 leading-relaxed border-t border-slate-800">
                {result.data_provenance_note}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-900/40 border border-slate-800 border-dashed p-8 text-center space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">Awaiting Valuation Parameters</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Fill in the laptop hardware specifications on the left, optionally toggle used device condition, and click
                <strong> Compute FairFix Market Valuation</strong>.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => loadPreset('gaming')}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800/60 hover:bg-cyan-900/50 transition-colors"
                >
                  Load Gaming Laptop Sample
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
