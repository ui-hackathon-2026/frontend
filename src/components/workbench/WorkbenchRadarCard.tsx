"use client";

import React from "react";
import { SensitivityRadarMetrics } from "@/domain/models/workbench";
import { Zap, ShieldCheck, DollarSign, Sparkles } from "lucide-react";

interface WorkbenchRadarCardProps {
  metrics: SensitivityRadarMetrics;
  sorRatio: number;
  deltaHlb: number;
  systemHlb: number;
  requiredHlb: number;
  estimatedCogsPerKgIdr: number;
  averageTkdnPct: number;
}

export const WorkbenchRadarCard: React.FC<WorkbenchRadarCardProps> = ({
  metrics,
  sorRatio,
  deltaHlb,
  systemHlb,
  requiredHlb,
  estimatedCogsPerKgIdr,
  averageTkdnPct,
}) => {
  const radarItems = [
    { label: "Kesetimbangan HLB", val: metrics.hlbEquilibrium, desc: `ΔHLB: ${deltaHlb.toFixed(1)}` },
    { label: "Efisiensi Surfaktan (SOR)", val: metrics.surfactantEfficiency, desc: `Rasio: ${sorRatio.toFixed(2)}` },
    { label: "Potensi Viskositas", val: metrics.viscosityPotential, desc: "Gel Network" },
    { label: "Efisiensi Biaya Formula", val: metrics.costEfficiency, desc: `Rp ${estimatedCogsPerKgIdr.toLocaleString("id-ID")}/kg` },
    { label: "Kandungan Lokal (TKDN)", val: metrics.tkdnScore, desc: `${averageTkdnPct}% Terverifikasi` },
  ];

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-bold text-[#0a192f] uppercase tracking-wider">
            Live Formulation Radar & Physicochemical
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-500">Real-Time Compute</span>
      </div>

      {/* Physics Moments Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] text-slate-500 block">Sistem HLB</span>
          <span className="text-sm font-bold font-mono text-[#0a192f]">
            {systemHlb} <span className="text-[10px] font-normal text-slate-400">/ Req: {requiredHlb}</span>
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] text-slate-500 block">Surfactant-to-Oil (SOR)</span>
          <span className="text-sm font-bold font-mono text-[#0a192f]">
            {sorRatio.toFixed(2)}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] text-slate-500 block">Est. COGS Bahan Baku</span>
          <span className="text-sm font-bold font-mono text-[#0a192f]">
            Rp {estimatedCogsPerKgIdr.toLocaleString("id-ID")}
            <span className="text-[10px] font-normal text-slate-400">/kg</span>
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] text-slate-500 block">Skor TKDN Lokal</span>
          <span className="text-sm font-bold font-mono text-emerald-700">
            {averageTkdnPct}%
          </span>
        </div>
      </div>

      {/* Horizontal Radar Gauges */}
      <div className="space-y-2.5 pt-1">
        {radarItems.map((item, idx) => {
          const pct = Math.round(item.val * 100);
          const barColor =
            pct >= 75 ? "bg-emerald-500" : pct >= 50 ? "bg-blue-500" : "bg-amber-500";
          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-medium text-slate-700">{item.label}</span>
                <span className="font-mono text-slate-500">{item.desc}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${barColor} rounded-full transition-all duration-300`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
