"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useWorkbench } from "@/hooks/useWorkbench";
import { WorkbenchIngredientRow } from "@/components/workbench/WorkbenchIngredientRow";
import { WorkbenchPhaseTabs } from "@/components/workbench/WorkbenchPhaseTabs";
import { WorkbenchRadarCard } from "@/components/workbench/WorkbenchRadarCard";
import { AddIngredientSidebar } from "@/components/simulator/AddIngredientSidebar";
import {
  Sliders,
  Sparkles,
  Plus,
  RefreshCw,
  Save,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Layers,
  FlaskConical,
  RotateCcw,
  Gauge,
  Info,
} from "lucide-react";
import { FormulationPhase } from "@/domain/models/workbench";

export default function WorkbenchPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    formulaName,
    setFormulaName,
    category,
    setCategory,
    batchSizeG,
    setBatchSizeG,
    ingredients,
    totalWeightPct,
    isBalanced,
    phaseSummaries,
    calculatedMoments,
    updateIngredientWeight,
    toggleLock,
    autoBalanceSolvent,
    addIngredient,
    removeIngredient,
    saveFormula,
    isSaving,
    saveSuccess,
    activePhaseFilter,
    setActivePhaseFilter,
  } = useWorkbench();

  // Filter ingredients according to active phase tab
  const filteredIngredients = useMemo(() => {
    if (activePhaseFilter === "ALL") {
      const order: Record<string, number> = { A: 1, B: 2, C: 3, D: 4 };
      return [...ingredients].sort((a, b) => {
        const oA = order[a.phase] ?? 99;
        const oB = order[b.phase] ?? 99;
        if (oA !== oB) return oA - oB;
        return a.name.localeCompare(b.name);
      });
    }
    return ingredients.filter((i) => i.phase === activePhaseFilter);
  }, [ingredients, activePhaseFilter]);

  // Phase color mappings
  const phaseColors: Record<FormulationPhase, { badge: string; border: string }> = {
    A: { badge: "bg-amber-100 text-amber-800", border: "border-l-amber-400" },
    B: { badge: "bg-blue-100 text-blue-800", border: "border-l-blue-400" },
    C: { badge: "bg-purple-100 text-purple-800", border: "border-l-purple-400" },
    D: { badge: "bg-emerald-100 text-emerald-800", border: "border-l-emerald-400" },
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col font-sans">
      <Navbar brandName="Paragon Studio" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-6 w-full space-y-6">
        {/* Step Wizard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0a192f] tracking-tight font-heading">
              Interactive 4-Phase Formulation Canvas
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm">
              Meja kerja formulator kosmetik dengan auto-balancing solvent dan live sensitivity radar.
            </p>
          </div>

          {/* Stepper Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl text-xs shrink-0 self-start sm:self-center">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                currentStep === 1
                  ? "bg-white text-[#0a192f] shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              1. Komposisi 4-Fase
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                currentStep === 2
                  ? "bg-white text-[#0a192f] shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              2. Radar Fisikokimia
            </button>
          </div>
        </div>

        {/* Global Formula Header Info & Balance Bar */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Title & Category Input */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#001299] flex items-center justify-center shrink-0 border border-blue-100">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <input
                  type="text"
                  value={formulaName}
                  onChange={(e) => setFormulaName(e.target.value)}
                  className="font-bold text-base sm:text-lg text-[#0a192f] bg-transparent border-b border-dashed border-slate-300 focus:border-blue-600 focus:outline-none w-full max-w-md truncate"
                />
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Kategori: <strong>{category}</strong></span>
                  <span>•</span>
                  <span>Batch: <strong>{batchSizeG}g</strong></span>
                </div>
              </div>
            </div>

            {/* Quick Balance Status & Actions */}
            <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={autoBalanceSolvent}
                title="Sesuaikan pelarut Aqua agar total tepat 100.00%"
                className="px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50 text-[#001299] hover:bg-blue-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Auto-Balance Aqua</span>
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={saveFormula}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tersimpan</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? "Menyimpan..." : "Simpan Formula"}</span>
                  </>
                )}
              </button>

              <Link
                href="/simulator"
                className="px-3.5 py-1.5 rounded-xl bg-[#001299] hover:bg-[#000e7a] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <span>Uji di Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Simple Clean Mass Equilibrium Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <span>Simpleks Massa Formula:</span>
                <span className={`font-mono ${isBalanced ? "text-emerald-700" : "text-amber-700"}`}>
                  {totalWeightPct.toFixed(2)}% / 100.00%
                </span>
              </span>
              <span className="text-[11px] text-slate-400">
                {isBalanced ? "Seimbang (Siap Diuji)" : "Belum 100% (Gunakan Auto-Balance)"}
              </span>
            </div>

            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-amber-400 transition-all"
                style={{ width: `${Math.min(100, phaseSummaries.A.totalWeightPct)}%` }}
                title={`Fase A: ${phaseSummaries.A.totalWeightPct}%`}
              />
              <div
                className="h-full bg-blue-400 transition-all"
                style={{ width: `${Math.min(100, phaseSummaries.B.totalWeightPct)}%` }}
                title={`Fase B: ${phaseSummaries.B.totalWeightPct}%`}
              />
              <div
                className="h-full bg-purple-400 transition-all"
                style={{ width: `${Math.min(100, phaseSummaries.C.totalWeightPct)}%` }}
                title={`Fase C: ${phaseSummaries.C.totalWeightPct}%`}
              />
              <div
                className="h-full bg-emerald-400 transition-all"
                style={{ width: `${Math.min(100, phaseSummaries.D.totalWeightPct)}%` }}
                title={`Fase D: ${phaseSummaries.D.totalWeightPct}%`}
              />
            </div>
          </div>
        </div>

        {/* STEP 1: Interactive Composition Editor */}
        {currentStep === 1 && (
          <div className="space-y-4">
            {/* Phase Selector Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <WorkbenchPhaseTabs
                summaries={phaseSummaries}
                activePhase={activePhaseFilter}
                onSelectPhase={setActivePhaseFilter}
              />

              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-center shrink-0 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Bahan Lab</span>
              </button>
            </div>

            {/* Ingredients Table / List */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Daftar Bahan ({filteredIngredients.length} item)
                </span>
                <span className="text-[11px] text-slate-400">
                  Gunakan slider atau ketik persentase presisi
                </span>
              </div>

              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {filteredIngredients.map((item) => (
                  <WorkbenchIngredientRow
                    key={item.id}
                    ingredient={item}
                    onUpdateWeight={updateIngredientWeight}
                    onToggleLock={toggleLock}
                    onRemove={removeIngredient}
                  />
                ))}
              </div>
            </div>

            {/* Bottom Step Switcher */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Formula tersusun dalam 4 fase baku kosmetik.
              </span>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all flex items-center gap-1.5"
              >
                <span>Lihat Analisis Radar Fisikokimia</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Sensitivity Radar & Advanced Physicochemical */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <WorkbenchRadarCard
              metrics={calculatedMoments.radar}
              sorRatio={calculatedMoments.sorRatio}
              deltaHlb={calculatedMoments.deltaHlb}
              systemHlb={calculatedMoments.systemHlb}
              requiredHlb={calculatedMoments.requiredHlb}
              estimatedCogsPerKgIdr={calculatedMoments.estimatedCogsPerKgIdr}
              averageTkdnPct={calculatedMoments.averageTkdnPct}
            />

            {/* Phase Breakdown Summary Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {Object.values(phaseSummaries).map((p) => (
                <div
                  key={p.phase}
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">{p.label}</span>
                    <span className="text-xs font-mono font-bold text-[#0a192f]">
                      {p.totalWeightPct.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{p.name}</p>
                  <div className="text-[10px] text-slate-400">
                    {p.itemCount} bahan terdaftar
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation CTA */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all"
              >
                Kembali ke Komposisi 4-Fase
              </button>

              <Link
                href="/simulator"
                className="px-5 py-2.5 rounded-xl bg-[#001299] text-white text-xs font-semibold hover:bg-[#000e7a] transition-all flex items-center gap-2 shadow-xs"
              >
                <span>Mulai Simulasi Uji Oven 40°C</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Modal / Drawer Tambah Bahan */}
        <AddIngredientSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          currentIngredients={ingredients}
          onAddIngredient={(newIng) => {
            addIngredient({
              ...newIng,
              isLocked: false,
              costPerKgIdr: 75000,
              tkdnPct: 40,
            });
            setIsSidebarOpen(false);
          }}
        />
      </main>
    </div>
  );
}
