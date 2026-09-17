"use client";

import React from "react";
import { StabilityVerdict } from "@/domain/models/simulation";
import { ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2 } from "lucide-react";

interface StabilityGaugeProps {
  score: number; // 0.00 to 1.00
  verdict: StabilityVerdict;
  confidenceScore: number;
  durationDays: number;
  temperatureC: number;
}

export const StabilityGauge: React.FC<StabilityGaugeProps> = ({
  score,
  verdict,
  confidenceScore,
  durationDays,
  temperatureC,
}) => {
  const percentage = Math.round(score * 100);

  // SVG Gauge calculations
  // Semi-circle arc from 180 to 0 degrees
  const radius = 80;
  const strokeWidth = 14;
  const circumference = Math.PI * radius; // Half-circle length
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let color = "#10b981"; // green
  let statusBadgeBg = "bg-emerald-50 text-emerald-800 border-emerald-200";
  let verdictLabel = "Highly Stable";
  let Icon = CheckCircle2;

  if (percentage < 55) {
    color = "#ef4444"; // red
    statusBadgeBg = "bg-rose-50 text-rose-800 border-rose-200";
    verdictLabel = "Phase Separation Imminent";
    Icon = AlertOctagon;
  } else if (percentage < 70) {
    color = "#f97316"; // orange
    statusBadgeBg = "bg-orange-50 text-orange-800 border-orange-200";
    verdictLabel = "Unstable Risk";
    Icon = AlertTriangle;
  } else if (percentage < 85) {
    color = "#f59e0b"; // amber
    statusBadgeBg = "bg-amber-50 text-amber-800 border-amber-200";
    verdictLabel = "Moderately Stable";
    Icon = AlertTriangle;
  }

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center justify-between space-y-4">
      <div className="w-full flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Accelerated Stability Index
        </span>
        <div className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBadgeBg}`}>
          <Icon className="w-3.5 h-3.5" />
          <span>{verdictLabel}</span>
        </div>
      </div>

      {/* Circular Speedometer Arc */}
      <div className="relative flex flex-col items-center justify-center pt-2">
        <svg width="200" height="115" className="overflow-visible">
          {/* Background Track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Color Progress Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Value Display */}
        <div className="absolute bottom-1 flex flex-col items-center">
          <span className="text-4xl font-extrabold text-[#0a192f] tracking-tight font-heading">
            {percentage}%
          </span>
          <span className="text-[11px] font-semibold text-slate-500">
            {temperatureC}°C / 75% RH ({durationDays} Hari)
          </span>
        </div>
      </div>

      {/* Safety Band Legend */}
      <div className="w-full grid grid-cols-3 gap-1 pt-2 text-[10px] text-center text-slate-500">
        <div className="p-1 rounded-lg bg-rose-50/70 border border-rose-100">
          <span className="font-bold text-rose-700 block">&lt;70%</span>
          <span>Defisit Fase</span>
        </div>
        <div className="p-1 rounded-lg bg-amber-50/70 border border-amber-100">
          <span className="font-bold text-amber-700 block">70-85%</span>
          <span>Risiko Fluktuasi</span>
        </div>
        <div className="p-1 rounded-lg bg-emerald-50/70 border border-emerald-100">
          <span className="font-bold text-emerald-700 block">&gt;85%</span>
          <span>Lamellar Stabil</span>
        </div>
      </div>

      <div className="w-full pt-1 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Confidence Model ML:</span>
        <span className="font-semibold text-slate-700">{(confidenceScore * 100).toFixed(1)}%</span>
      </div>
    </div>
  );
};
