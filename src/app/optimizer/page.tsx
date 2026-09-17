"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { useParetoOptimizer } from "@/hooks/useParetoOptimizer";
import { ParetoObjectivesCard } from "@/components/optimizer/ParetoObjectivesCard";
import { ParetoFrontierScatterPlot } from "@/components/optimizer/ParetoFrontierScatterPlot";
import { ParetoCandidateComparisonCard } from "@/components/optimizer/ParetoCandidateComparisonCard";
import { ShimmerSkeleton } from "@/components/ShimmerWidget";
import { DelayedInfoTooltip } from "@/components/DelayedInfoTooltip";
import { ParetoPresetId } from "@/domain/models/optimizer";
import { Scale, DollarSign, ShieldCheck, Sprout } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

const PRESET_OPTIONS: { id: ParetoPresetId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "balanced", label: "Balanced Trade-off", icon: Scale },
  { id: "cost_leader", label: "Cost Leader (Hemat)", icon: DollarSign },
  { id: "max_stability", label: "Stabilitas Maksimal", icon: ShieldCheck },
  { id: "high_tkdn", label: "High-TKDN Lokal", icon: Sprout },
];

export default function OptimizerPage() {
  const {
    preset,
    selectPreset,
    weights,
    updateWeight,
    constraints,
    updateConstraint,
    projectionAxis,
    setProjectionAxis,
    selectedCandidateId,
    setSelectedCandidateId,
    isOptimizing,
    result,
    error,
    handleRunOptimization,
  } = useParetoOptimizer();

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col font-sans">
      <Navbar brandName="Paragon Studio" />

      <main className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-6">
        {/* Header Title & Preset Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0a192f] tracking-tight font-heading">
                Pareto Multi-Objective Optimizer
              </h1>
              <DelayedInfoTooltip
                content="Algoritma genetika Optuna NSGA-II mengevaluasi hingga 50.000 kombinasi rasio formula pada simpleks massa 100% untuk menemukan titik kompromi optimal (sweet spot) stabilitas, biaya, viskositas, dan TKDN."
                delayMs={300}
                position="right"
              />
            </div>
          </div>

          {/* Preset Selector */}
          <div className="flex items-center flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl text-xs shrink-0 self-start sm:self-center">
            {PRESET_OPTIONS.map((p) => {
              const isSelected = preset === p.id;
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => selectPreset(p.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? "bg-white text-[#001299] shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-[#001299]" : "text-slate-400"}`} />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {error}
          </div>
        )}

        {/* Constraints & Objectives Card */}
        <ParetoObjectivesCard
          weights={weights}
          onUpdateWeight={updateWeight}
          constraints={constraints}
          onUpdateConstraint={updateConstraint}
          isOptimizing={isOptimizing}
          onRunOptimization={handleRunOptimization}
        />

        {/* SKELETON LOADING STATE (Strictly active when isOptimizing) */}
        {isOptimizing && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-200/80 shadow-xs space-y-6 animate-in fade-in duration-200">
            <div className="space-y-2">
              <ShimmerSkeleton className="w-56 h-5 rounded-lg" />
              <ShimmerSkeleton className="w-80 h-4 rounded-md" />
            </div>
            <ShimmerSkeleton className="h-72 rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <ShimmerSkeleton className="h-28 rounded-2xl" />
              <ShimmerSkeleton className="h-28 rounded-2xl" />
              <ShimmerSkeleton className="h-28 rounded-2xl" />
            </div>
          </div>
        )}

        {/* INTERACTIVE PARETO SCATTER PLOT & CANDIDATES (When ready) */}
        {!isOptimizing && result && (
          <>
            <ParetoFrontierScatterPlot
              points={result.points}
              topCandidates={result.topCandidates}
              selectedCandidateId={selectedCandidateId}
              onSelectCandidate={(id) => setSelectedCandidateId(id)}
              projectionAxis={projectionAxis}
              onChangeProjectionAxis={setProjectionAxis}
            />

            <ParetoCandidateComparisonCard
              candidates={result.topCandidates}
              selectedCandidateId={selectedCandidateId || "A"}
              onSelectCandidate={(id) => setSelectedCandidateId(id)}
            />
          </>
        )}

        {/* EMPTY STATE: before first optimization */}
        {!isOptimizing && !result && !error && (
          <EmptyState
            title="Belum Ada Hasil Optimasi Pareto"
            description="Atur bobot objektif dan batasan di atas, lalu jalankan optimasi NSGA-II untuk menampilkan frontier stabilitas, COGS, dan TKDN."
          />
        )}
      </main>
    </div>
  );
}
