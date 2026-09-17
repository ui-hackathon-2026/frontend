"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { useWorkbench } from "@/hooks/useWorkbench";
import { FormulaEditorPanel } from "@/components/simulator/FormulaEditorPanel";
import { FormulaPhaseOverviewCard } from "@/components/simulator/FormulaPhaseOverviewCard";
import { Step3SimulationConsole } from "@/components/workbench/Step3SimulationConsole";
import {
  Sliders,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  RotateCcw,
  FlaskConical,
  Gauge,
} from "lucide-react";
import { getSimulationRepository } from "@/data/di/container";
import { PresetFormulaItem } from "@/domain/models/simulation";
import { DelayedInfoTooltip } from "@/components/DelayedInfoTooltip";

function WorkbenchContent() {
  const searchParams = useSearchParams();
  const initialStepParam = searchParams.get("step");
  const initialStep: 1 | 2 | 3 =
    initialStepParam === "3" ? 3 : initialStepParam === "2" ? 2 : 1;

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(initialStep);
  const [presets, setPresets] = useState<PresetFormulaItem[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");

  const {
    formulaName,
    setFormulaName,
    category,
    ingredients,
    totalWeightPct,
    updateIngredientWeight,
    addIngredient,
    removeIngredient,
    normalizeComposition,
  } = useWorkbench();

  // Load benchmark presets on mount
  React.useEffect(() => {
    const simRepo = getSimulationRepository();
    simRepo.getPresetFormulas().then((data) => {
      setPresets(data);
      if (data.length > 0 && !selectedPresetId) {
        setSelectedPresetId(data[0].id);
      }
    });
  }, [selectedPresetId]);

  const selectedPreset = presets.find((p) => p.id === selectedPresetId);

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col font-sans">
      <Navbar brandName="Paragon Studio" />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 w-full py-6 space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0a192f] tracking-tight font-heading">
              Next-Gen Interactive Formulation Canvas
            </h1>
            <DelayedInfoTooltip
              content="Alur kerja terpadu 3-tahap: Pilih benchmark, rancang formula 4-fase, dan uji kestabilan emulsi in-silico 40°C (90 Hari)."
              delayMs={300}
              position="right"
            />
          </div>

          {/* 3-Step Navigation Stepper Tabs */}
          <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-xl text-xs shrink-0 self-start sm:self-center overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentStep === 1
                  ? "bg-white text-[#0a192f] shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep === 1 ? "bg-[#001299] text-white" : "bg-slate-200 text-slate-700"
                }`}
              >
                1
              </span>
              <span>Pilih Benchmark</span>
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />

            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentStep === 2
                  ? "bg-white text-[#0a192f] shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep === 2 ? "bg-[#001299] text-white" : "bg-slate-200 text-slate-700"
                }`}
              >
                2
              </span>
              <span>Komposisi 4-Fase</span>
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />

            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentStep === 3
                  ? "bg-white text-[#0a192f] shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep === 3 ? "bg-[#001299] text-white" : "bg-slate-200 text-slate-700"
                }`}
              >
                3
              </span>
              <span>Simulasi 40°C (90 Hari)</span>
            </button>
          </div>
        </div>

        {/* STEP 1: PILIH FORMULA BENCHMARK */}
        {currentStep === 1 && (
          <section className="space-y-6 animate-in fade-in duration-200">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Tahap 1 dari 2
                  </span>
                  <h2 className="text-xl font-bold text-[#0a192f] font-heading">
                    Pilih Formula Benchmark Teruji
                  </h2>
                </div>
                <span className="text-xs text-slate-500">
                  Pilih salah satu formula acuan di bawah untuk memuat komposisi ke kanvas
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {presets.map((preset) => {
                  const isSelected = selectedPresetId === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => {
                        setSelectedPresetId(preset.id);
                        setFormulaName(preset.name);
                      }}
                      className={`text-left p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                        isSelected
                          ? "border-[#001299] bg-blue-50/40 ring-2 ring-[#001299]/20 shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#001299] bg-blue-100/70 px-2 py-0.5 rounded-md">
                            {preset.category}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#001299]" />}
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm leading-snug">
                          {preset.name}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {preset.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span>{preset.request.ingredients.length} Komponen Bahan</span>
                        <span
                          className={`font-semibold ${
                            isSelected ? "text-[#001299]" : "text-slate-400"
                          }`}
                        >
                          {isSelected ? "Terpilih" : "Klik untuk Memilih"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Bar for Step 1 */}
              {selectedPreset && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Formula Terpilih:
                    </span>
                    <h4 className="text-sm font-bold text-[#0a192f]">
                      {selectedPreset.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Basis sediaan: {selectedPreset.category} • {selectedPreset.request.ingredients.length} Bahan Baku Lab
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm bg-[#001299] hover:bg-[#000e7a] text-white shadow-xs transition-all cursor-pointer"
                  >
                    <span>Lanjut ke Komposisi 4-Fase</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* STEP 2: KOMPOSISI FORMULA & DISTRIBUSI FASE */}
        {currentStep === 2 && (
          <section className="space-y-6 animate-in fade-in duration-200">
            {/* Top Sub-header with back button */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#001299] flex items-center justify-center border border-blue-100">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-[#0a192f] block">{formulaName}</span>
                    <DelayedInfoTooltip
                      content={`Σ Total: ${totalWeightPct.toFixed(1)}% ${
                        Math.abs(totalWeightPct - 100.0) <= 0.1 ? "(Balanced)" : "(Unbalanced)"
                      }`}
                      delayMs={300}
                      position="right"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500">Kategori: {category}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-semibold text-slate-600 hover:text-[#001299] flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Ganti Benchmark</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column (5 Cols): Formula Parameter Controls */}
              <div className="lg:col-span-5 space-y-6">
                <FormulaEditorPanel
                  formulaName={formulaName}
                  ingredients={ingredients}
                  totalWeight={totalWeightPct}
                  onUpdateWeight={updateIngredientWeight}
                  onAddIngredient={addIngredient}
                  onRemoveIngredient={removeIngredient}
                  onProceedToConfig={() => {
                    setCurrentStep(3);
                  }}
                />
              </div>

              {/* Right Column (7 Cols): Phase Distribution Overview */}
              <div className="lg:col-span-7 space-y-6">
                <FormulaPhaseOverviewCard
                  formulaName={formulaName}
                  ingredients={ingredients}
                  totalWeight={totalWeightPct}
                  onNormalize={normalizeComposition}
                />
              </div>
            </div>
          </section>
        )}

        {/* STEP 3: SIMULASI KESTABILAN 40°C (90 HARI) */}
        {currentStep === 3 && (
          <section className="space-y-6 animate-in fade-in duration-200">
            <Step3SimulationConsole
              formulaName={formulaName}
              category={category}
              ingredients={ingredients}
              totalWeight={totalWeightPct}
              onBackToComposition={() => setCurrentStep(2)}
            />
          </section>
        )}
      </main>
    </div>
  );
}

export default function WorkbenchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center text-xs text-slate-500 font-sans">
          Memuat Formulation Canvas...
        </div>
      }
    >
      <WorkbenchContent />
    </Suspense>
  );
}
