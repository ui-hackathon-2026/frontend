"use client";

import React from "react";
import {
  Thermometer,
  Calendar,
  Cpu,
  Play,
  ArrowLeft,
  CheckCircle2,
  Sliders,
  Sparkles,
} from "lucide-react";
import { SimulationEngineType } from "@/domain/models/simulation";

interface SimulationConfigPanelProps {
  formulaName: string;
  ingredientsCount: number;
  totalWeight: number;
  temperatureC: number;
  durationDays: number;
  engine: SimulationEngineType;
  isLoading: boolean;
  onUpdateTemperature: (temp: number) => void;
  onUpdateDuration: (days: number) => void;
  onUpdateEngine: (engine: SimulationEngineType) => void;
  onRunSimulation: () => void;
  onBackToFormula: () => void;
}

export const SimulationConfigPanel: React.FC<SimulationConfigPanelProps> = ({
  formulaName,
  ingredientsCount,
  totalWeight,
  temperatureC,
  durationDays,
  engine,
  isLoading,
  onUpdateTemperature,
  onUpdateDuration,
  onUpdateEngine,
  onRunSimulation,
  onBackToFormula,
}) => {
  const isBalanced = Math.abs(totalWeight - 100.0) <= 0.1;

  const tempOptions = [
    {
      value: 25,
      label: "25°C",
    },
    {
      value: 40,
      label: "40°C",
      recommended: true,
    },
    {
      value: 50,
      label: "50°C",
    },
  ];

  const durationOptions = [
    {
      value: 30,
      label: "30 Hari",
    },
    {
      value: 60,
      label: "60 Hari",
    },
    {
      value: 90,
      label: "90 Hari",
      recommended: true,
    },
  ];

  const engineOptions: {
    id: SimulationEngineType;
    name: string;
    badge: string;
    desc: string;
    speed: string;
  }[] = [
    {
      id: "LIGHTGBM_GPU",
      name: "LightGBM Physical Chemistry Surrogate",
      badge: "Inferensi Cepat",
      desc: "Surrogate model berbasis pohon keputusan teroptimasi fitur fisikokimia & deskriptor RDKit.",
      speed: "< 1 ms",
    },
    {
      id: "DEEP_COLLOID_GNN",
      name: "Deep Colloid Graph Neural Network",
      badge: "High Precision",
      desc: "Pemodelan interaksi antarmuka mesoskopis droplet koloid dengan graph representations.",
      speed: "~ 350 ms",
    },
  ];

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
      {/* Header & Formula Summary */}
      <div className="border-b border-slate-100 pb-5 space-y-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToFormula}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-[#0018a8] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Komposisi Bahan</span>
          </button>

          <span className="text-[11px] font-mono text-slate-400">Tahap 3 dari 3</span>
        </div>

        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Parameter Kondisi Uji In-Silico
          </span>
          <h2 className="text-xl font-bold text-[#0a192f] font-heading mt-0.5">
            Konfigurasi Simulasi Stabilitas
          </h2>
        </div>
      </div>

      {/* 1. Incubator Temperature Selection */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Thermometer className="w-4 h-4 text-blue-600" />
          <span>1. Suhu Inkubator (Incubator Temperature)</span>
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {tempOptions.map((opt) => {
            const isSelected = temperatureC === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onUpdateTemperature(opt.value)}
                className={`py-3 px-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                  isSelected
                    ? "border-[#0018a8] bg-blue-50/70 text-[#0018a8] ring-2 ring-[#0018a8]/20 shadow-xs font-bold"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/60 font-semibold"
                }`}
              >
                <span className="text-sm font-heading">{opt.label}</span>
                {opt.recommended && (
                  <span className="text-[9px] font-bold text-[#0018a8] bg-blue-100/80 px-1.5 py-0.5 rounded-md">
                    Standar
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Simulated Duration Selection */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span>2. Periode Uji Simulasi (Simulated Period)</span>
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {durationOptions.map((opt) => {
            const isSelected = durationDays === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onUpdateDuration(opt.value)}
                className={`py-3 px-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                  isSelected
                    ? "border-[#0018a8] bg-blue-50/70 text-[#0018a8] ring-2 ring-[#0018a8]/20 shadow-xs font-bold"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/60 font-semibold"
                }`}
              >
                <span className="text-sm font-heading">{opt.label}</span>
                {opt.recommended && (
                  <span className="text-[9px] font-bold text-[#0018a8] bg-blue-100/80 px-1.5 py-0.5 rounded-md">
                    BPOM
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. AI Model Engine Selection */}
      <div className="space-y-2.5">
        <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Cpu className="w-4 h-4 text-blue-600" />
          <span>3. Mesin AI Prediksi (AI Model Engine)</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {engineOptions.map((eng) => {
            const isSelected = engine === eng.id;
            return (
              <div
                key={eng.id}
                onClick={() => onUpdateEngine(eng.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
                  isSelected
                    ? "border-[#0018a8] bg-blue-50/50 ring-2 ring-[#0018a8]/20 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    {eng.badge}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#0018a8]">
                    {eng.speed}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900">{eng.name}</h4>
                  <p className="text-[11px] text-slate-500 leading-tight">{eng.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Final Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onRunSimulation}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2.5 py-4 px-6 rounded-2xl font-semibold text-sm bg-[#001299] hover:bg-[#000e7a] text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Menghitung Stabilitas Fisikokimia In-Silico...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>
                Simulate 40°C Stability ({temperatureC}°C, {durationDays} Hari)
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
