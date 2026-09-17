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
      <div className="border-b border-slate-100 pb-4">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Parameter Kondisi Uji In-Silico
        </span>
        <h2 className="text-xl font-bold text-[#0a192f] font-heading mt-0.5">
          Konfigurasi Simulasi Stabilitas
        </h2>
      </div>

      {/* 1. Incubator Temperature Selection */}
      {/* 1 & 2. Fixed Conditions: 40°C & 90 Hari (Calibrated ML surrogate) */}
      <div className="space-y-3">
        <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Thermometer className="w-4 h-4 text-[#001299]" />
          <span>Kondisi Baku Uji Stabilitas BPOM (Terkalibrasi)</span>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl border border-blue-200/70 bg-blue-50/40 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">
                Suhu Inkubator
              </span>
              <span className="text-[9px] font-bold text-[#001299] bg-blue-100/80 px-1.5 py-0.5 rounded-md">
                Baku BPOM
              </span>
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl font-extrabold text-[#0a192f] font-heading">
                40°C
              </span>
              <span className="text-[11px] text-slate-500 font-medium">(±2°C)</span>
            </div>
            <span className="text-[10px] text-slate-500 block">
              Uji Percepatan Zona IVb
            </span>
          </div>

          <div className="p-3.5 rounded-2xl border border-blue-200/70 bg-blue-50/40 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">
                Durasi Uji
              </span>
              <span className="text-[9px] font-bold text-[#001299] bg-blue-100/80 px-1.5 py-0.5 rounded-md">
                Standar
              </span>
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl font-extrabold text-[#0a192f] font-heading">
                90 Hari
              </span>
              <span className="text-[11px] text-slate-500 font-medium">(3 Bulan)</span>
            </div>
            <span className="text-[10px] text-slate-500 block">
              Setara 24 bulan real-time
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
          <strong>Catatan Tim AI/ML:</strong> Model surrogate dikalibrasi presisi pada kondisi spesifik <strong>40°C / 90 Hari</strong> sesuai pedoman percepatan stabilitas sediaan kosmetik BPOM.
        </p>
      </div>

      {/* 3. AI Model Engine Selection: LightGBM Active, GNN Disabled */}
      <div className="space-y-2.5">
        <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Cpu className="w-4 h-4 text-blue-600" />
          <span>3. Mesin AI Prediksi (AI Model Engine)</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {engineOptions.map((eng) => {
            const isGNN = eng.id === "DEEP_COLLOID_GNN";
            const isSelected = engine === eng.id;
            return (
              <div
                key={eng.id}
                onClick={() => {
                  if (!isGNN) onUpdateEngine(eng.id);
                }}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-1.5 ${
                  isGNN
                    ? "border-slate-200 bg-slate-50/70 opacity-60 cursor-not-allowed select-none"
                    : isSelected
                    ? "border-[#0018a8] bg-blue-50/50 ring-2 ring-[#0018a8]/20 shadow-xs cursor-pointer"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60 cursor-pointer"
                }`}
                title={
                  isGNN
                    ? "Mesin Deep Colloid GNN saat ini sedang dalam proses pelatihan di klaster Lintasarta GPU Cloudeka."
                    : undefined
                }
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      isGNN
                        ? "bg-amber-100 text-amber-800"
                        : "text-[#0018a8] bg-blue-100/80"
                    }`}
                  >
                    {isGNN ? "Segera Hadir" : eng.badge}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-500">
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
