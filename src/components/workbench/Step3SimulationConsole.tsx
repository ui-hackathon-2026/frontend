"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Thermometer,
  Calendar,
  Cpu,
  Play,
  ArrowRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Lock,
  Clock,
  FlaskConical,
  Gauge,
  AlertTriangle,
  Info,
} from "lucide-react";
import {
  IngredientInput,
  SimulationEngineType,
  SimulationResult,
} from "@/domain/models/simulation";
import { getSimulationRepository } from "@/data/di/container";
import { StabilityGauge } from "@/components/simulator/StabilityGauge";
import { DropletDistributionChart } from "@/components/simulator/DropletDistributionChart";
import { RheologyViscosityCard } from "@/components/simulator/RheologyViscosityCard";
import { ThermodynamicAuditCard } from "@/components/simulator/ThermodynamicAuditCard";
import { ShimmerSkeleton } from "@/components/ShimmerWidget";
import { DelayedInfoTooltip } from "@/components/DelayedInfoTooltip";

interface Step3SimulationConsoleProps {
  formulaName: string;
  category: string;
  ingredients: IngredientInput[];
  totalWeight: number;
  onBackToComposition: () => void;
}

export const Step3SimulationConsole: React.FC<Step3SimulationConsoleProps> = ({
  formulaName,
  category,
  ingredients,
  totalWeight,
  onBackToComposition,
}) => {
  const [engine, setEngine] = useState<SimulationEngineType>("LIGHTGBM_GPU");
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fixed AI/ML Calibrated Condition: strictly 40 deg C and 90 Days
  const fixedTemperatureC = 40;
  const fixedDurationDays = 90;

  const isBalanced = Math.abs(totalWeight - 100.0) <= 0.1;

  const handleRunSimulation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const repository = getSimulationRepository();
      const simResult = await repository.simulateStability({
        formulaName,
        temperatureC: fixedTemperatureC,
        durationDays: fixedDurationDays,
        engine,
        ingredients,
      });
      setResult(simResult);
    } catch (err: any) {
      setError(err?.message || "Gagal menjalankan simulasi stabilitas");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner Bar with Back navigation & Formula details */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#001299] flex items-center justify-center border border-blue-100 shrink-0">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-[#0a192f] block">{formulaName}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  isBalanced
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                Total: {totalWeight.toFixed(1)}% {isBalanced ? "(Balanced)" : "(Warning: != 100%)"}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Kategori: {category} • {ingredients.length} Komponen Bahan Siap Diuji
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onBackToComposition}
            className="text-xs font-semibold text-slate-600 hover:text-[#001299] flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Kembali ke Edit Komposisi</span>
          </button>
        </div>
      </div>

      {/* Error state if any */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={handleRunSimulation}
            className="underline font-semibold"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Two-Column Grid: Left (Condition & Engine) | Right (Shimmer Loading / Simulation Results) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (5 Cols): Fixed 40 deg C / 90 Days Standard + Model Selector + Run CTA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
            {/* Header */}
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Tahap 3 dari 3
              </span>
              <h2 className="text-lg font-bold text-[#0a192f] font-heading mt-0.5">
                Simulasi Kestabilan In-Silico
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Kondisi baku uji dipercepat iklim tropis zona IVb sesuai Pedoman Uji Stabilitas BPOM.
              </p>
            </div>

            {/* 1. Fixed Conditions Card (40 deg C & 90 Hari) */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <Thermometer className="w-4 h-4 text-[#001299]" />
                <span>Kondisi Baku Uji Stabilitas BPOM</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                {/* Temperature card */}
                <div className="p-3.5 rounded-2xl border border-blue-200/70 bg-blue-50/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">
                      Suhu Inkubator
                    </span>
                    <Lock className="w-3 h-3 text-blue-500" />
                  </div>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-xl font-extrabold text-[#0a192f] font-heading">
                      40°C
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      (±2°C)
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Baku Uji Percepatan Zona IVb
                  </span>
                </div>

                {/* Duration card */}
                <div className="p-3.5 rounded-2xl border border-blue-200/70 bg-blue-50/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">
                      Durasi Pengujian
                    </span>
                    <Lock className="w-3 h-3 text-blue-500" />
                  </div>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-xl font-extrabold text-[#0a192f] font-heading">
                      90 Hari
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      (3 Bulan)
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Setara 24 bulan real-time
                  </span>
                </div>
              </div>

              {/* Calibration Notice from AI/ML team */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start space-x-2.5">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  <strong>Kalibrasi Model Terpadu:</strong> Model surrogate fisikokimia dikalibrasi presisi khusus untuk rezim termodinamika <strong>40°C &amp; 90 Hari</strong> guna memastikan deviasi MAE &lt; 3.2% terhadap data uji empiris lab Paragon.
                </p>
              </div>
            </div>

            {/* 2. AI Model Engine Selection: LightGBM Active, GNN Disabled */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <Cpu className="w-4 h-4 text-[#001299]" />
                <span>Mesin AI Prediksi (AI Engine Selection)</span>
              </label>

              <div className="space-y-2.5">
                {/* Option 1: LightGBM Physical Chemistry Surrogate (Active & Selected) */}
                <div
                  onClick={() => setEngine("LIGHTGBM_GPU")}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    engine === "LIGHTGBM_GPU"
                      ? "border-[#001299] bg-blue-50/50 ring-2 ring-[#001299]/20 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold text-[#001299] bg-blue-100/80 px-2 py-0.5 rounded-md">
                        Tersedia &amp; Aktif
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        &lt; 1 ms
                      </span>
                    </div>
                    {engine === "LIGHTGBM_GPU" && (
                      <CheckCircle2 className="w-4 h-4 text-[#001299]" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      LightGBM Physical Chemistry Surrogate
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                      Surrogate model pohon keputusan teroptimasi fitur fisikokimia, momen Hansen, &amp; deskriptor RDKit.
                    </p>
                  </div>
                </div>

                {/* Option 2: Deep Colloid Graph Neural Network (GNN) - Disabled with badge */}
                <div
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 opacity-60 cursor-not-allowed flex flex-col justify-between space-y-2 relative select-none"
                  title="Mesin Deep Colloid GNN saat ini sedang dalam proses pelatihan di klaster Lintasarta GPU Cloudeka."
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md">
                        Dalam Pengembangan / Segera Hadir
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        ~ 350 ms
                      </span>
                    </div>
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-700">
                      Deep Colloid Graph Neural Network (GNN)
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                      Pemodelan interaksi antarmuka mesoskopis droplet koloid dengan representasi graf molekular.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Run Simulation CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleRunSimulation}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-5 rounded-2xl font-semibold text-sm bg-[#001299] hover:bg-[#000e7a] text-white shadow-xs transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Menjalankan Simulasi Fisikokimia In-Silico...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Jalankan Simulasi 40°C (90 Hari)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Physicochemical Simulation Results or Skeleton Loading */}
        <div className="lg:col-span-7 space-y-6">
          {isLoading ? (
            /* Shimmer Skeleton Loading State strictly during computation */
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-200/80 shadow-xs space-y-6 min-h-[460px] animate-in fade-in duration-200">
              <div className="space-y-2">
                <ShimmerSkeleton className="w-48 h-5 rounded-lg" />
                <ShimmerSkeleton className="w-72 h-4 rounded-md" />
              </div>

              {/* Top 2 Metric Cards Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <ShimmerSkeleton className="w-24 h-4 rounded-md" />
                    <ShimmerSkeleton className="w-12 h-4 rounded-full" />
                  </div>
                  <ShimmerSkeleton className="w-20 h-8 rounded-lg" />
                  <ShimmerSkeleton className="w-full h-12 rounded-xl" />
                </div>
                <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <ShimmerSkeleton className="w-28 h-4 rounded-md" />
                    <ShimmerSkeleton className="w-14 h-4 rounded-full" />
                  </div>
                  <ShimmerSkeleton className="w-24 h-8 rounded-lg" />
                  <ShimmerSkeleton className="w-full h-12 rounded-xl" />
                </div>
              </div>

              {/* Chart Placeholder Skeleton */}
              <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <ShimmerSkeleton className="w-36 h-4 rounded-md" />
                  <ShimmerSkeleton className="w-16 h-4 rounded-md" />
                </div>
                <ShimmerSkeleton className="w-full h-40 rounded-xl" />
              </div>

              {/* Bottom Card Skeleton */}
              <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
                <ShimmerSkeleton className="w-44 h-4 rounded-md" />
                <ShimmerSkeleton className="w-full h-20 rounded-xl" />
              </div>
            </div>
          ) : result ? (
            /* Live Simulation Result Cards */
            <>
              {/* Row 1: Primary Stability Gauge & Rheology Viscosity Card */}
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

              {/* Row 3: Thermodynamic Physical Chemistry & Audit */}
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

              {/* Next Step Handshake to Compliance */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Langkah Selanjutnya:
                  </span>
                  <h4 className="text-sm font-bold text-[#0a192f]">
                    Verifikasi Kepatuhan BPOM &amp; Halal HAS 23000
                  </h4>
                  <p className="text-xs text-slate-500">
                    Lakukan pengecekan batas kadar bahan pengawet, pelarut terlarang, dan kalkulasi TKDN.
                  </p>
                </div>

                <Link
                  href="/compliance"
                  className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-xs bg-[#001299] hover:bg-[#000e7a] text-white shadow-xs transition-all cursor-pointer shrink-0"
                >
                  <span>Audit Kepatuhan Resmi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </>
          ) : (
            /* Ready to Run Simulation State */
            <div className="p-10 sm:p-14 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center justify-center text-center space-y-4 min-h-[460px]">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-[#001299] flex items-center justify-center shadow-xs">
                <Gauge className="w-7 h-7" />
              </div>
              <div className="space-y-1.5 max-w-md">
                <h3 className="text-lg font-bold text-[#0a192f] font-heading">
                  Simulator Siap Dijalankan
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Formula <strong>{formulaName}</strong> ({ingredients.length} bahan) siap diuji kestabilan emulsi pada kondisi standar <strong>40°C / 90 Hari</strong>. Tekan tombol <strong>Jalankan Simulasi 40°C</strong> di panel kiri.
                </p>
              </div>
              <button
                type="button"
                onClick={handleRunSimulation}
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-xs bg-[#001299] hover:bg-[#000e7a] text-white shadow-xs transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Mulai Simulasi Sekarang</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
