"use client";

import React, { useState } from "react";
import { ArtifactType } from "@/domain/models/editor";
import { DelayedInfoTooltip } from "@/components/DelayedInfoTooltip";
import {
  X,
  Play,
  Zap,
  ShieldCheck,
  Thermometer,
  FileText,
  Sparkles,
  Scale,
  DollarSign,
  TrendingUp,
  Sprout,
  AlertTriangle,
} from "lucide-react";

type ParetoPreset = "balanced" | "cost-leader" | "max-stability" | "high-tkdn" | "custom";

const PARETO_PRESETS: Record<
  Exclude<ParetoPreset, "custom">,
  { label: string; cogs: number; stability: number; tkdn: number; icon: React.ComponentType<{ className?: string }> }
> = {
  balanced: {
    label: "Balanced Trade-off",
    cogs: 45000,
    stability: 88,
    tkdn: 40,
    icon: Scale,
  },
  "cost-leader": {
    label: "Cost Leader (Hemat)",
    cogs: 28000,
    stability: 80,
    tkdn: 35,
    icon: DollarSign,
  },
  "max-stability": {
    label: "Stabilitas Maksimal",
    cogs: 65000,
    stability: 95,
    tkdn: 40,
    icon: TrendingUp,
  },
  "high-tkdn": {
    label: "High-TKDN Lokal",
    cogs: 50000,
    stability: 85,
    tkdn: 60,
    icon: Sprout,
  },
};

interface InlineActionConfigCardProps {
  actionType: ArtifactType;
  hasIngredients?: boolean;
  onClose: () => void;
  onExecute: (type: ArtifactType, params: any) => void;
}

export const InlineActionConfigCard: React.FC<InlineActionConfigCardProps> = ({
  actionType,
  hasIngredients = true,
  onClose,
  onExecute,
}) => {
  // Listen for Escape key to easily close widget
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);
  // Pareto State
  const [activePreset, setActivePreset] = useState<ParetoPreset>("balanced");
  const [maxCogs, setMaxCogs] = useState(45000);
  const [minStability, setMinStability] = useState(88);
  const [targetTkdn, setTargetTkdn] = useState(40);

  // Sentinel State
  const [checkBpom, setCheckBpom] = useState(true);
  const [checkHalal, setCheckHalal] = useState(true);
  const [checkTkdn, setCheckTkdn] = useState(true);

  // Simulation State
  const [tempCelsius, setTempCelsius] = useState(40);
  const [durationDays, setDurationDays] = useState(90);

  // Similarity State
  const [brandScope, setBrandScope] = useState<"all" | "wardah" | "emina" | "kahf">("all");

  const handleSelectPreset = (key: Exclude<ParetoPreset, "custom">) => {
    setActivePreset(key);
    const p = PARETO_PRESETS[key];
    setMaxCogs(p.cogs);
    setMinStability(p.stability);
    setTargetTkdn(p.tkdn);
  };

  const handleCustomCogs = (val: number) => {
    setMaxCogs(val);
    setActivePreset("custom");
  };

  const handleCustomStability = (val: number) => {
    setMinStability(val);
    setActivePreset("custom");
  };

  const handleCustomTkdn = (val: number) => {
    setTargetTkdn(val);
    setActivePreset("custom");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasIngredients) return;
    let params: any = {};
    if (actionType === "pareto") {
      params = { maxCogs, minStability, targetTkdn, preset: activePreset };
    } else if (actionType === "sentinel") {
      params = { checkBpom, checkHalal, checkTkdn };
    } else if (actionType === "simulation") {
      params = { tempCelsius, durationDays };
    } else if (actionType === "similarity") {
      params = { brandScope };
    }
    onExecute(actionType, params);
  };

  const getHeaderInfo = () => {
    switch (actionType) {
      case "pareto":
        return {
          title: "Konfigurasi Pareto Multi-Objective Optimizer (NSGA-II)",
          icon: Zap,
          color: "text-indigo-600 bg-indigo-50 border-indigo-200",
          desc: "Tentukan batasan simpleks massa untuk menyaring 50.000 iterasi kandidat formula pada klaster GPU L40S.",
        };
      case "sentinel":
        return {
          title: "Konfigurasi Audit BPOM, Halal HAS 23000 & TKDN Sentinel",
          icon: ShieldCheck,
          color: "text-emerald-600 bg-emerald-50 border-emerald-200",
          desc: "Pilih basis standar kepatuhan regulasi kosmetik yang akan diaudit terhadap formula aktif.",
        };
      case "simulation":
        return {
          title: "Konfigurasi Simulasi Kestabilan 40°C In-Silico",
          icon: Thermometer,
          color: "text-rose-600 bg-rose-50 border-rose-200",
          desc: "Parameter uji percepatan climatic chamber in-silico sesuai standar iklim tropis Zona IVb.",
        };
      case "similarity":
        return {
          title: "Konfigurasi Dual-Scope Formula Similarity & Patent FTO",
          icon: FileText,
          color: "text-blue-600 bg-blue-50 border-blue-200",
          desc: "Pilih cakupan perbandingan repositori internal Paragon & database paten eksternal.",
        };
    }
  };

  const header = getHeaderInfo();
  const Icon = header.icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4 font-sans animate-in fade-in slide-in-from-bottom-2">
      {/* Header Bar with Title & Close Button */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg border ${header.color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-extrabold text-[#0a192f] tracking-tight font-heading">
                {header.title}
              </h3>
              <DelayedInfoTooltip content={header.desc} delayMs={300} />
            </div>
            <span className="text-[11px] text-slate-500 block">{header.desc}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Batal dan kembali ke input pesan"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Warning Notice if formula has 0 ingredients */}
      {!hasIngredients && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-amber-950">Formula Aktif Belum Memiliki Bahan Baku</span>
            <span className="text-[11px] text-amber-800 leading-normal block mt-0.5">
              Tambahkan bahan baku dari <strong>Library Bahan</strong> di panel kiri atau terapkan acuan benchmark terlebih dahulu untuk mengeksekusi aksi komputasi ini.
            </span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 1. PARETO OPTIMIZER CONFIG */}
        {actionType === "pareto" && (
          <div className="space-y-4">
            {/* Presets Button Row */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Pilihan Preset Strategi:
                </span>
                {activePreset !== "custom" && (
                  <span className="text-[10px] font-bold text-[#001299] font-mono">
                    Preset Aktif: {PARETO_PRESETS[activePreset].label}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(Object.keys(PARETO_PRESETS) as Array<Exclude<ParetoPreset, "custom">>).map((key) => {
                  const p = PARETO_PRESETS[key];
                  const isSelected = activePreset === key;
                  const PresetIcon = p.icon;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleSelectPreset(key)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-[#001299] text-white border-[#001299] shadow-xs"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      <PresetIcon className={`w-3.5 h-3.5 ${isSelected ? "text-blue-200" : "text-slate-500"}`} />
                      <span className="truncate">{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Revamped Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {/* Slider 1: Batas Plafon Biaya (COGS) */}
              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Plafon Biaya (COGS)
                  </span>
                  <span className="text-xs font-mono font-extrabold text-[#001299] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                    Rp {maxCogs.toLocaleString("id-ID")} / kg
                  </span>
                </div>

                <div className="py-1">
                  <input
                    type="range"
                    min="20000"
                    max="90000"
                    step="1000"
                    value={maxCogs}
                    onChange={(e) => handleCustomCogs(parseInt(e.target.value, 10))}
                    className="paragon-range-slider"
                    style={{
                      background: `linear-gradient(to right, #001299 0%, #001299 ${Math.round(
                        ((maxCogs - 20000) / (90000 - 20000)) * 100
                      )}%, #e2e8f0 ${Math.round(
                        ((maxCogs - 20000) / (90000 - 20000)) * 100
                      )}%, #e2e8f0 100%)`,
                    }}
                  />
                </div>

                <div className="flex justify-between pt-0.5 text-slate-500">
                  <div className="text-left">
                    <span className="block text-xs font-mono font-bold text-slate-800">Rp 20.000</span>
                    <span className="block text-[10px] font-medium text-slate-400">Ekonomis</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-xs font-mono font-bold text-slate-800">Rp 45.000</span>
                    <span className="block text-[10px] font-medium text-slate-400">Standar</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-mono font-bold text-slate-800">Rp 90.000</span>
                    <span className="block text-[10px] font-medium text-slate-400">Premium</span>
                  </div>
                </div>
              </div>

              {/* Slider 2: Target Minimum Stabilitas 40°C */}
              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Min. Stabilitas 40°C
                  </span>
                  <span className="text-xs font-mono font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                    {minStability}%
                  </span>
                </div>

                <div className="py-1">
                  <input
                    type="range"
                    min="70"
                    max="98"
                    step="1"
                    value={minStability}
                    onChange={(e) => handleCustomStability(parseInt(e.target.value, 10))}
                    className="paragon-range-slider"
                    style={{
                      background: `linear-gradient(to right, #059669 0%, #059669 ${Math.round(
                        ((minStability - 70) / (98 - 70)) * 100
                      )}%, #e2e8f0 ${Math.round(
                        ((minStability - 70) / (98 - 70)) * 100
                      )}%, #e2e8f0 100%)`,
                    }}
                  />
                </div>

                <div className="flex justify-between pt-0.5 text-slate-500">
                  <div className="text-left">
                    <span className="block text-xs font-mono font-bold text-slate-800">70%</span>
                    <span className="block text-[10px] font-medium text-slate-400">Minimal</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-xs font-mono font-bold text-slate-800">85%</span>
                    <span className="block text-[10px] font-medium text-slate-400">Zona IVb</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-mono font-bold text-slate-800">98%</span>
                    <span className="block text-[10px] font-medium text-slate-400">Ultra Stabil</span>
                  </div>
                </div>
              </div>

              {/* Slider 3: Target Kandungan Lokal (TKDN) */}
              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Target TKDN Lokal
                  </span>
                  <span className="text-xs font-mono font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                    ≥ {targetTkdn}%
                  </span>
                </div>

                <div className="py-1">
                  <input
                    type="range"
                    min="20"
                    max="70"
                    step="5"
                    value={targetTkdn}
                    onChange={(e) => handleCustomTkdn(parseInt(e.target.value, 10))}
                    className="paragon-range-slider"
                    style={{
                      background: `linear-gradient(to right, #001299 0%, #001299 ${Math.round(
                        ((targetTkdn - 20) / (70 - 20)) * 100
                      )}%, #e2e8f0 ${Math.round(
                        ((targetTkdn - 20) / (70 - 20)) * 100
                      )}%, #e2e8f0 100%)`,
                    }}
                  />
                </div>

                <div className="flex justify-between pt-0.5 text-slate-500">
                  <div className="text-left">
                    <span className="block text-xs font-mono font-bold text-slate-800">20%</span>
                    <span className="block text-[10px] font-medium text-slate-400">Baseline</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-xs font-mono font-bold text-slate-800">40%</span>
                    <span className="block text-[10px] font-medium text-slate-400">Batas Legal</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-mono font-bold text-slate-800">70%</span>
                    <span className="block text-[10px] font-medium text-slate-400">Hayati Lokal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. SENTINEL CONFIG */}
        {actionType === "sentinel" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100 cursor-pointer">
              <input
                type="checkbox"
                checked={checkBpom}
                onChange={(e) => setCheckBpom(e.target.checked)}
                className="w-4 h-4 text-[#001299] rounded"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Perka BPOM 25/2025</span>
                <span className="text-[11px] text-slate-500">Batas maksimum zat aktif.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100 cursor-pointer">
              <input
                type="checkbox"
                checked={checkHalal}
                onChange={(e) => setCheckHalal(e.target.checked)}
                className="w-4 h-4 text-[#001299] rounded"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Halal HAS 23000</span>
                <span className="text-[11px] text-slate-500">Bebas turunan non-halal.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100 cursor-pointer">
              <input
                type="checkbox"
                checked={checkTkdn}
                onChange={(e) => setCheckTkdn(e.target.checked)}
                className="w-4 h-4 text-[#001299] rounded"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Target TKDN ≥ 40%</span>
                <span className="text-[11px] text-slate-500">Kalkulasi bobot hayati lokal.</span>
              </div>
            </label>
          </div>
        )}

        {/* 3. SIMULATION CONFIG */}
        {actionType === "simulation" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Suhu Uji</span>
              <span className="text-sm font-extrabold text-[#0a192f] font-mono">40°C (±2°C) Tropis</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Durasi</span>
              <span className="text-sm font-extrabold text-[#0a192f] font-mono">90 Hari (≈ 24 Bulan)</span>
            </div>
          </div>
        )}

        {/* 4. SIMILARITY CONFIG */}
        {actionType === "similarity" && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Cakupan Brand Acuan
            </label>
            <select
              value={brandScope}
              onChange={(e) => setBrandScope(e.target.value as any)}
              className="w-full text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
            >
              <option value="all">Semua Brand Paragon (Wardah, Kahf, Emina, Make Over, Laboré)</option>
              <option value="wardah">Wardah Skincare Series</option>
              <option value="emina">Emina Youth Series</option>
              <option value="kahf">Kahf Men Essentials</option>
            </select>
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={!hasIngredients}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-[#001299] hover:bg-[#000e7a] text-white shadow-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title={!hasIngredients ? "Formula masih kosong, tambahkan bahan terlebih dahulu" : undefined}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Jalankan &amp; Buat Artifact</span>
          </button>
        </div>
      </form>
    </div>
  );
};
