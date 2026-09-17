"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useSimulation } from "@/hooks/useSimulation";
import { StabilityGauge } from "@/components/simulator/StabilityGauge";
import { DropletDistributionChart } from "@/components/simulator/DropletDistributionChart";
import { RheologyViscosityCard } from "@/components/simulator/RheologyViscosityCard";
import { ThermodynamicAuditCard } from "@/components/simulator/ThermodynamicAuditCard";
import { FormulaEditorPanel } from "@/components/simulator/FormulaEditorPanel";
import { FormulaPhaseOverviewCard } from "@/components/simulator/FormulaPhaseOverviewCard";
import { SimulationConfigPanel } from "@/components/simulator/SimulationConfigPanel";
import {
  Gauge,
  Sliders,
  Zap,
  FileSpreadsheet,
  Box,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Info,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

export default function SimulatorPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const {
    presets,
    selectedPresetId,
    selectPreset,
    currentRequest,
    updateIngredientWeight,
    addIngredient,
    removeIngredient,
    updateTemperature,
    updateDuration,
    updateEngine,
    runSimulation,
    result,
    isLoading,
    error,
    totalWeight,
  } = useSimulation();

  const selectedPreset = presets.find((p) => p.id === selectedPresetId);

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col font-sans">
      <Navbar brandName="Paragon Studio" />

      <main
        className={`max-w-7xl mx-auto px-4 sm:px-8 w-full transition-all duration-300 ${
          currentStep === 1 ? "py-8 sm:py-12 space-y-8" : "py-4 sm:py-6 space-y-5"
        }`}
      >
        {/* Top Header Banner - Smoothly hides on Step 2 to maximize console workspace space */}
        <section
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            currentStep === 1
              ? "max-h-56 opacity-100 transform translate-y-0 mb-2 space-y-2"
              : "max-h-0 opacity-0 transform -translate-y-4 -mb-2 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0a192f] tracking-tight font-heading">
              In-Silico 40°C Stability &amp; Physicochemical Simulator
            </h1>
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>In-Silico Engine Active</span>
            </div>
          </div>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Menggantikan masa tunggu uji stabilitas fisik 3 bulan (90 hari) di inkubator laboratorium (40°C / 75% RH)
            dengan simulasi fisika-kimia in-silico prediktif secara instan.
          </p>
        </section>

        {/* 3-Step Progress Indicator */}
        <section className="p-2 sm:p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm font-medium">
            {/* Step 1 */}
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                currentStep === 1
                  ? "bg-blue-50 text-[#0018a8] font-bold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  currentStep === 1
                    ? "bg-[#0018a8] text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                1
              </span>
              <span>Pilih Formula Benchmark</span>
            </button>

            <ChevronRight className="w-4 h-4 text-slate-300" />

            {/* Step 2 */}
            <button
              type="button"
              onClick={() => {
                if (selectedPresetId) setCurrentStep(2);
              }}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                currentStep === 2
                  ? "bg-blue-50 text-[#0018a8] font-bold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  currentStep === 2
                    ? "bg-[#0018a8] text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                2
              </span>
              <span>Komposisi Formula</span>
            </button>

            <ChevronRight className="w-4 h-4 text-slate-300" />

            {/* Step 3 */}
            <button
              type="button"
              onClick={() => {
                if (selectedPresetId) setCurrentStep(3);
              }}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                currentStep === 3
                  ? "bg-blue-50 text-[#0018a8] font-bold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  currentStep === 3
                    ? "bg-[#0018a8] text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                3
              </span>
              <span>Konfigurasi &amp; Simulasi</span>
            </button>

            {(currentStep === 2 || currentStep === 3) && currentRequest && (
              <div className="hidden lg:flex items-center space-x-2 pl-3 border-l border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Formula:</span>
                <span className="text-xs font-mono font-semibold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/80 max-w-[240px] truncate">
                  {currentRequest.formulaName}
                </span>
              </div>
            )}
          </div>

          {currentStep === 2 && (
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-xs font-semibold text-slate-700 hover:text-[#0018a8] flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Ganti Benchmark</span>
            </button>
          )}

          {currentStep === 3 && (
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="text-xs font-semibold text-slate-700 hover:text-[#0018a8] flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Ubah Komposisi Bahan</span>
            </button>
          )}
        </section>

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
            <span>{error}</span>
            <button
              type="button"
              onClick={runSimulation}
              className="underline font-semibold"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* STEP 1: BENCHMARK FORMULA SELECTION */}
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
                  Pilih salah satu formula di bawah untuk memuat komposisi ke dalam konsol
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {presets.map((preset) => {
                  const isSelected = selectedPresetId === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => selectPreset(preset.id)}
                      className={`text-left p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                        isSelected
                          ? "border-[#0018a8] bg-blue-50/40 ring-2 ring-[#0018a8]/20 shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#0018a8] bg-blue-100/70 px-2 py-0.5 rounded-md">
                            {preset.category}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-[#0018a8]" />
                          )}
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
                        <span className={`font-semibold ${isSelected ? "text-[#0018a8]" : "text-slate-400"}`}>
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
                      Formula Siap Diuji:
                    </span>
                    <h4 className="text-sm font-bold text-[#0a192f]">
                      {selectedPreset.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Standar inkubator: {selectedPreset.request.temperatureC}°C • {selectedPreset.request.durationDays} Hari • Uji Stabilitas Koloid Dipercepat
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm bg-[#001299] hover:bg-[#000e7a] text-white shadow-xs transition-all cursor-pointer"
                  >
                    <span>Lanjut ke Komposisi Formula</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* STEP 2: FORMULA COMPOSITION & PHASE OVERVIEW */}
        {currentStep === 2 && (
          <section className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column (5 Cols): Formula Parameter Controls */}
              <div className="lg:col-span-5 space-y-6">
                {currentRequest ? (
                  <FormulaEditorPanel
                    formulaName={currentRequest.formulaName}
                    ingredients={currentRequest.ingredients}
                    totalWeight={totalWeight}
                    onUpdateWeight={updateIngredientWeight}
                    onAddIngredient={addIngredient}
                    onRemoveIngredient={removeIngredient}
                    onProceedToConfig={() => setCurrentStep(3)}
                  />
                ) : (
                  <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center text-slate-400">
                    Memuat data formula...
                  </div>
                )}
              </div>

              {/* Right Column (7 Cols): Phase Distribution & Readiness Overview */}
              <div className="lg:col-span-7 space-y-6">
                {currentRequest && (
                  <FormulaPhaseOverviewCard
                    formulaName={currentRequest.formulaName}
                    ingredients={currentRequest.ingredients}
                    totalWeight={totalWeight}
                  />
                )}
              </div>
            </div>
          </section>
        )}

        {/* STEP 3: SIMULATION CONFIGURATION & LIVE RESULTS */}
        {currentStep === 3 && (
          <section className="space-y-6 animate-in fade-in duration-200">
            {/* Main Work Area: 2-Column Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column (5 Cols): 3-Config Panel */}
              <div className="lg:col-span-5 space-y-6">
                {currentRequest ? (
                  <SimulationConfigPanel
                    formulaName={currentRequest.formulaName}
                    ingredientsCount={currentRequest.ingredients.length}
                    totalWeight={totalWeight}
                    temperatureC={currentRequest.temperatureC}
                    durationDays={currentRequest.durationDays}
                    engine={currentRequest.engine}
                    isLoading={isLoading}
                    onUpdateTemperature={updateTemperature}
                    onUpdateDuration={updateDuration}
                    onUpdateEngine={updateEngine}
                    onRunSimulation={runSimulation}
                    onBackToFormula={() => setCurrentStep(2)}
                  />
                ) : (
                  <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center text-slate-400">
                    Memuat data formula...
                  </div>
                )}
              </div>

              {/* Right Column (7 Cols): Live Physicochemical Simulation Results */}
              <div className="lg:col-span-7 space-y-6">
            {isLoading ? (
              <div className="p-8 sm:p-12 rounded-3xl bg-white border border-blue-200/80 shadow-md flex flex-col items-center justify-center text-center space-y-6 min-h-[460px] animate-in fade-in duration-200">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0018a8]">
                    <Cpu className="w-8 h-8 animate-pulse text-[#0018a8]" />
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-[#0018a8]"></span>
                  </span>
                </div>

                <div className="space-y-2 max-w-md">
                  <h3 className="text-xl font-bold text-[#0a192f] font-heading">
                    Menghitung Prediksi Fisikokimia In-Silico...
                  </h3>
                  <p className="text-xs text-slate-500">
                    Komputasi Termodinamika Koloid • Estimasi waktu &lt;1 detik
                  </p>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full max-w-sm bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-pulse w-4/5" />
                </div>

                {/* Calculation Pipeline Steps */}
                <div className="w-full max-w-sm space-y-2.5 text-left pt-2">
                  <div className="flex items-center space-x-2.5 text-xs text-slate-700 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-medium">Ekstraksi ECFP4 Fingerprints &amp; Deskriptor RDKit</span>
                  </div>
                  <div className="flex items-center space-x-2.5 text-xs text-slate-700 p-2.5 rounded-xl bg-blue-50/60 border border-blue-200/60">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    <span className="font-medium">Kalkulasi Energi Gibbs &amp; Tegangan Antarmuka Tetesan</span>
                  </div>
                  <div className="flex items-center space-x-2.5 text-xs text-slate-500 p-2.5 rounded-xl bg-slate-50/50 border border-slate-200/40">
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                    <span>Inferensi Model Surrogate Fisikokimia</span>
                  </div>
                </div>
              </div>
            ) : result ? (
              <>
                {/* Row 1: Primary Gauge & Droplet Chart */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <StabilityGauge
                    score={result.stabilityScore}
                    verdict={result.verdict}
                    confidenceScore={result.confidenceScore}
                    durationDays={result.durationDays}
                    temperatureC={result.temperatureC}
                  />

                  <RheologyViscosityCard
                    viscosityMpaS={result.dynamicViscosityMpaS}
                    targetViscosityMpaS={result.targetViscosityMpaS}
                    temperatureC={result.temperatureC}
                    rheologyCurve={result.rheologyCurve}
                  />
                </div>

                {/* Row 2: Droplet Size DLS Chart */}
                <DropletDistributionChart
                  meanSizeNm={result.meanDropletSizeNm}
                  pdi={result.polydispersityIndexPdi}
                  distribution={result.dropletDistribution}
                />

                {/* Row 3: Thermodynamic Physical Chemistry & OOD Audit */}
                <ThermodynamicAuditCard
                  thermodynamics={result.thermodynamics}
                  isOod={result.isOutOfDistribution}
                  oodDistance={result.oodMahalanobisDistance}
                  engineUsed={result.engineUsed}
                  inferenceMs={result.inferenceDurationMs}
                  riskFactors={result.riskFactors}
                  stabilizingFactors={result.stabilizingFactors}
                  recommendations={result.recommendations}
                />
              </>
            ) : (
              <div className="p-10 sm:p-14 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center justify-center text-center space-y-4 min-h-[460px]">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-[#0018a8] flex items-center justify-center shadow-xs">
                  <Gauge className="w-7 h-7" />
                </div>
                <div className="space-y-1.5 max-w-md">
                  <h3 className="text-lg font-bold text-[#0a192f] font-heading">
                    Chamber Uji In-Silico Siap
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Atur suhu inkubator, durasi, dan mesin AI di panel kiri, kemudian tekan tombol{" "}
                    <strong className="text-[#0018a8] font-semibold">&quot;Simulate 40°C Stability&quot;</strong>{" "}
                    untuk menjalankan prediksi fisikokimia secara in-silico.
                  </p>
                </div>
                {currentRequest && (
                  <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-50 text-[11px] font-mono text-slate-600 border border-slate-200/80">
                    <span>Target: {currentRequest.formulaName}</span>
                    <span>•</span>
                    <span>{currentRequest.temperatureC}°C / {currentRequest.durationDays} Hari</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    )}

        {/* End-to-End Inter-Feature Navigation Bar */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-[#0a192f] text-white space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-blue-300 uppercase tracking-wider block">
              Alur Kerja Terintegrasi (End-to-End Pipeline)
            </span>
            <h3 className="text-xl font-bold font-heading">
              Lanjutkan Hasil Simulasi ke Tahap Formulasi Berikutnya:
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl">
              Formula yang telah tervalidasi dapat langsung dikirim ke modul peracikan 4-fase, multi-objective Pareto optimizer, atau lembar kerja penimbangan pabrik.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <Link
              href="/workbench"
              className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors flex items-center justify-between group"
            >
              <div>
                <span className="text-xs text-blue-200 block">Tahap Formulasi</span>
                <span className="text-sm font-semibold">Buka di Formulation Canvas</span>
              </div>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/optimizer"
              className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors flex items-center justify-between group"
            >
              <div>
                <span className="text-xs text-blue-200 block">Tahap Optimasi</span>
                <span className="text-sm font-semibold">Optimasi Pareto NSGA-II</span>
              </div>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/batch-sheet"
              className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors flex items-center justify-between group"
            >
              <div>
                <span className="text-xs text-blue-200 block">Tahap Produksi</span>
                <span className="text-sm font-semibold">Cetak Master Batch Record</span>
              </div>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
