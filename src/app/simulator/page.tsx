"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useSimulation } from "@/hooks/useSimulation";
import { StabilityGauge } from "@/components/simulator/StabilityGauge";
import { DropletDistributionChart } from "@/components/simulator/DropletDistributionChart";
import { RheologyViscosityCard } from "@/components/simulator/RheologyViscosityCard";
import { ThermodynamicAuditCard } from "@/components/simulator/ThermodynamicAuditCard";
import { SimulationConfigPanel } from "@/components/simulator/SimulationConfigPanel";
import {
  Gauge,
  Sliders,
  Zap,
  ArrowRight,
  CheckCircle2,
  Cpu,
  FlaskConical,
  RotateCcw,
} from "lucide-react";

export default function SimulatorPage() {
  const {
    currentRequest,
    updateTemperature,
    updateDuration,
    updateEngine,
    runSimulation,
    result,
    isLoading,
    error,
    totalWeight,
  } = useSimulation();

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col font-sans">
      <Navbar brandName="Paragon Studio" />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 w-full py-6 space-y-6">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0a192f] tracking-tight font-heading">
                In-Silico 40°C Stability &amp; Physicochemical Simulator
              </h1>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm">
              Simulasi uji kestabilan fisik emulsi 90 hari di climatic chamber (40°C / 75% RH) berbasis model prediksi ML Cloudeka.
            </p>
          </div>

          {/* Quick Handshake Link to Workbench */}
          <Link
            href="/workbench"
            className="text-xs font-semibold text-slate-700 hover:text-[#001299] flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer shrink-0 self-start sm:self-center"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Komposisi di Canvas</span>
          </Link>
        </div>

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

        {/* Main Simulator Console: Left Config Panel, Right Results */}
        <section className="space-y-6">
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
                  onBackToFormula={() => {
                    window.location.href = "/workbench";
                  }}
                />
              ) : (
                <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center text-slate-400">
                  Memuat konfigurasi formula...
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
                      Simulator Siap Dijalankan
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Pilih suhu inkubator, periode pengujian, dan mesin AI pada panel di sebelah kiri, lalu tekan tombol{" "}
                      <strong>Simulate 40°C Stability</strong> untuk memulai uji in-silico.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
