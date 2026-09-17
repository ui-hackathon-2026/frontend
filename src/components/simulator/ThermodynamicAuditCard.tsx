"use client";

import React from "react";
import {
  ColloidalThermodynamics,
  SimulationEngineType,
} from "@/domain/models/simulation";
import {
  ShieldAlert,
  Sparkles,
  Flame,
  Cpu,
  Layers,
  Check,
  AlertTriangle,
} from "lucide-react";

interface ThermodynamicAuditCardProps {
  thermodynamics: ColloidalThermodynamics;
  isOod: boolean;
  oodDistance: number;
  engineUsed: SimulationEngineType;
  inferenceMs: number;
  riskFactors: string[];
  stabilizingFactors: string[];
  recommendations: string[];
}

export const ThermodynamicAuditCard: React.FC<ThermodynamicAuditCardProps> = ({
  thermodynamics,
  isOod,
  oodDistance,
  engineUsed,
  inferenceMs,
  riskFactors,
  stabilizingFactors,
  recommendations,
}) => {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
      {/* Header with Engine Info & OOD Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-[#0a192f] font-heading flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Colloidal Physical Chemistry &amp; Uncertainty Audit</span>
          </h3>
          <p className="text-xs text-slate-500">
            Analisis termodinamika antarmuka tetesan dan jaminan validitas domain data latih model.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* OOD Badge */}
          <div
            className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              isOod
                ? "bg-rose-50 text-rose-800 border-rose-200"
                : "bg-emerald-50 text-emerald-800 border-emerald-200"
            }`}
          >
            {isOod ? (
              <AlertTriangle className="w-3.5 h-3.5" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            <span>
              {isOod
                ? `OOD Warning (Distance: ${oodDistance})`
                : "In-Distribution (Reliable)"}
            </span>
          </div>

          {/* Engine Badge */}
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Cpu className="w-3.5 h-3.5 text-[#0018a8]" />
            <span>
              {engineUsed === "LIGHTGBM_GPU" ? "Surrogate ML" : "Colloid Network"} ({inferenceMs} ms)
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Thermodynamic Parameters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-[#f8fafc] border border-slate-200/80 space-y-1">
          <span className="text-slate-500 font-medium block">
            Surfactant-to-Oil Ratio (SOR)
          </span>
          <span className="text-lg font-extrabold text-[#0a192f] font-mono">
            {thermodynamics.sorRatio.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-400 block">
            Optimal: 0.28 – 0.40
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#f8fafc] border border-slate-200/80 space-y-1">
          <span className="text-slate-500 font-medium block">
            Gibbs Free Energy (ΔG)
          </span>
          <span className="text-lg font-extrabold text-[#0a192f] font-mono">
            {thermodynamics.gibbsFreeEnergyKjMol} <span className="text-xs">kJ/mol</span>
          </span>
          <span className="text-[10px] text-emerald-600 block font-medium">
            Spontaneous Formation
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#f8fafc] border border-slate-200/80 space-y-1">
          <span className="text-slate-500 font-medium block">
            Critical Micelle Conc. (CMC)
          </span>
          <span className="text-lg font-extrabold text-[#0a192f] font-mono">
            {thermodynamics.criticalMicelleConcentrationMmolL}{" "}
            <span className="text-xs">mmol/L</span>
          </span>
          <span className="text-[10px] text-slate-400 block">
            Surface tension plateau
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#f8fafc] border border-slate-200/80 space-y-1">
          <span className="text-slate-500 font-medium block">Interface Mesophase</span>
          <span className="text-sm font-bold text-blue-900 block truncate">
            {thermodynamics.interfaceState}
          </span>
          <span className="text-[10px] text-slate-400 block">
            Packing param: {thermodynamics.packingParameterP}
          </span>
        </div>
      </div>

      {/* Narrative Scientific Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
        {/* Stabilizing Factors */}
        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 space-y-2">
          <div className="flex items-center space-x-1.5 text-emerald-800 font-bold">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Faktor Pengokoh Kestabilan Koloid</span>
          </div>
          <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
            {stabilizingFactors.map((f, idx) => (
              <li key={idx} className="leading-relaxed">
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Risk Factors or Warning */}
        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-2">
          <div className="flex items-center space-x-1.5 text-amber-800 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>
              {riskFactors.length > 0
                ? "Faktor Risiko Destabilisasi"
                : "Profil Keamanan Fisikokimia"}
            </span>
          </div>
          {riskFactors.length > 0 ? (
            <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
              {riskFactors.map((r, idx) => (
                <li key={idx} className="leading-relaxed">
                  {r}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-600 leading-relaxed">
              Tidak terdeteksi risiko flokulasi atau Ostwald ripening dalam 90 hari inkubasi 40°C. Jaringan lamellar gel kristal cair menahan tetesan minyak secara kokoh.
            </p>
          )}
        </div>
      </div>

      {/* Recommendations Box */}
      {recommendations.length > 0 && (
        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 text-xs space-y-2">
          <div className="flex items-center space-x-1.5 text-[#0018a8] font-bold">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Rekomendasi Formulasi In-Silico untuk Analis R&amp;D</span>
          </div>
          <ul className="space-y-1 text-slate-700">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start space-x-1.5">
                <span className="font-bold text-[#0018a8]">•</span>
                <span className="leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
