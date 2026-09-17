"use client";

import React, { useMemo } from "react";
import { IngredientInput } from "@/domain/models/simulation";
import {
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface FormulaPhaseOverviewCardProps {
  formulaName: string;
  ingredients: IngredientInput[];
  totalWeight: number;
}

export const FormulaPhaseOverviewCard: React.FC<FormulaPhaseOverviewCardProps> = ({
  formulaName,
  ingredients,
  totalWeight,
}) => {
  const isBalanced = Math.abs(totalWeight - 100.0) <= 0.1;

  // Calculate phase totals
  const phaseStats = useMemo(() => {
    const stats: Record<
      string,
      { label: string; name: string; total: number; count: number; color: string; bg: string }
    > = {
      A: {
        label: "Fase A",
        name: "Fase Minyak / Lipofilik",
        total: 0,
        count: 0,
        color: "bg-amber-500 text-amber-900 border-amber-200",
        bg: "bg-amber-50/70",
      },
      B: {
        label: "Fase B",
        name: "Fase Air / Hidrofilik",
        total: 0,
        count: 0,
        color: "bg-blue-500 text-blue-900 border-blue-200",
        bg: "bg-blue-50/70",
      },
      C: {
        label: "Fase C",
        name: "Emulgator & Surfaktan",
        total: 0,
        count: 0,
        color: "bg-purple-500 text-purple-900 border-purple-200",
        bg: "bg-purple-50/70",
      },
      D: {
        label: "Fase D",
        name: "Aktif Peka Panas & Aditif",
        total: 0,
        count: 0,
        color: "bg-emerald-500 text-emerald-900 border-emerald-200",
        bg: "bg-emerald-50/70",
      },
    };

    ingredients.forEach((ing) => {
      const p = ing.phase in stats ? ing.phase : "B";
      stats[p].total += ing.weightPct;
      stats[p].count += 1;
    });

    return stats;
  }, [ingredients]);

  // Role counts
  const roleStats = useMemo(() => {
    const counts: Record<string, number> = {};
    ingredients.forEach((ing) => {
      counts[ing.role] = (counts[ing.role] || 0) + 1;
    });
    return counts;
  }, [ingredients]);

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
      {/* Header */}
      <div className="border-b border-slate-100 pb-2.5 space-y-0.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Analisis Distribusi Fase Formula
          </span>
          <span
            className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
              isBalanced
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
          >
            {isBalanced ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Bobot Seimbang (100.0%)</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                <span>Total: {totalWeight.toFixed(1)}% (Belum 100%)</span>
              </>
            )}
          </span>
        </div>
        <h3 className="text-lg font-bold text-[#0a192f] font-heading">
          Ringkasan Komposisi Fisikokimia
        </h3>
      </div>

      {/* Visual Phase Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
          <span>Rasio Fase Emulsi</span>
          <span className="font-mono text-slate-400">Total: {totalWeight.toFixed(1)}%</span>
        </div>
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
          {(["A", "B", "C", "D"] as const).map((phase) => {
            const stat = phaseStats[phase];
            const pct = totalWeight > 0 ? (stat.total / totalWeight) * 100 : 0;
            if (pct <= 0) return null;
            const barColors: Record<string, string> = {
              A: "bg-amber-400",
              B: "bg-blue-500",
              C: "bg-purple-500",
              D: "bg-emerald-500",
            };
            return (
              <div
                key={phase}
                style={{ width: `${pct}%` }}
                className={`${barColors[phase]} transition-all duration-300`}
                title={`${stat.label}: ${stat.total.toFixed(1)}%`}
              />
            );
          })}
        </div>
      </div>

      {/* Phase Breakdown Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {(["A", "B", "C", "D"] as const).map((phase) => {
          const stat = phaseStats[phase];
          return (
            <div
              key={phase}
              className={`p-3 rounded-2xl border border-slate-200/80 ${stat.bg} space-y-1`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">{stat.label}</span>
                <span className="text-xs font-mono font-bold text-slate-900">
                  {stat.total.toFixed(1)}%
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight">{stat.name}</p>
              <span className="text-[10px] text-slate-400 font-mono block pt-0.5">
                {stat.count} Bahan terdaftar
              </span>
            </div>
          );
        })}
      </div>

      {/* Role Breakdown Badges */}
      <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
          Distribusi Peran Bahan:
        </span>
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {Object.entries(roleStats).map(([role, count]) => (
            <span
              key={role}
              className="text-xs font-mono bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-lg flex items-center space-x-1.5"
            >
              <span className="font-semibold capitalize">{role}:</span>
              <span className="font-bold text-[#0018a8]">{count}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
