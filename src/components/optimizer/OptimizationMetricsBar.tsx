"use client";

import React from "react";
import { Zap, Clock, TrendingUp, Layers, CheckCircle2 } from "lucide-react";
import { DelayedInfoTooltip } from "@/components/DelayedInfoTooltip";

interface OptimizationMetricsBarProps {
  trialsEvaluated: number;
  executionTimeMs: number;
  nonDominatedCount: number;
  hypervolumeScore: number;
  isOptimizing: boolean;
}

export const OptimizationMetricsBar: React.FC<OptimizationMetricsBarProps> = ({
  trialsEvaluated,
  executionTimeMs,
  nonDominatedCount,
  hypervolumeScore,
  isOptimizing,
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs grid grid-cols-2 lg:grid-cols-4 gap-4 items-center">
      {/* Metric 1: Capacity */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#001299] border border-blue-200/60 flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Kapasitas Penapisan
            </span>
            <DelayedInfoTooltip
              content="Jumlah iterasi kombinasi rasio formula yang dievaluasi secara masif melintasi ruang simpleks massa 100%."
              delayMs={300}
            />
          </div>
          <div className="text-base font-extrabold text-[#0a192f] font-mono">
            {trialsEvaluated.toLocaleString("id-ID")}
            <span className="text-[11px] font-normal text-slate-500 ml-1">trials</span>
          </div>
        </div>
      </div>

      {/* Metric 2: Speed / Latency */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Latensi Komputasi
            </span>
            <DelayedInfoTooltip
              content="Waktu komputasi algoritma genetika NSGA-II terakselerasi GPU untuk penapisan global."
              delayMs={300}
            />
          </div>
          <div className="text-base font-extrabold text-[#0a192f] font-mono">
            {(executionTimeMs / 1000).toFixed(2)}
            <span className="text-[11px] font-normal text-slate-500 ml-1">detik</span>
          </div>
        </div>
      </div>

      {/* Metric 3: Non-Dominated Solutions */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center shrink-0">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Solusi Frontier
            </span>
            <DelayedInfoTooltip
              content="Jumlah solusi optimal non-dominated pada envelope terluar yang tidak dapat dikalahkan kriteria lain."
              delayMs={300}
            />
          </div>
          <div className="text-base font-extrabold text-[#0a192f] font-mono">
            {nonDominatedCount}
            <span className="text-[11px] font-normal text-slate-500 ml-1">kandidat</span>
          </div>
        </div>
      </div>

      {/* Metric 4: Hypervolume Indicator */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200/60 flex items-center justify-center shrink-0">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Skor Hypervolume
            </span>
            <DelayedInfoTooltip
              content="Indikator matematis cakupan dan diversitas ruang objektif Pareto (rentang 0,0 - 1,0)."
              delayMs={300}
            />
          </div>
          <div className="text-base font-extrabold text-[#0a192f] font-mono">
            {hypervolumeScore.toFixed(3)}
            <span className="text-[11px] font-normal text-emerald-600 ml-1">(Optimal)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
