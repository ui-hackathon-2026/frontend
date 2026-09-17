"use client";

import React, { useState } from "react";
import { useEditor } from "@/contexts/EditorContext";
import { DualScopeSimilarityReport } from "./DualScopeSimilarityReport";
import { DelayedInfoTooltip } from "@/components/DelayedInfoTooltip";
import {
  ArrowLeft,
  Zap,
  ShieldCheck,
  Thermometer,
  Compass,
  CheckCircle2,
  Sliders,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  FileCheck,
} from "lucide-react";

export const ArtifactViewerPanel: React.FC = () => {
  const { activeArtifact, closeArtifactView, updateIngredientWeight } = useEditor();
  const [selectedCandidate, setSelectedCandidate] = useState<"A" | "B" | "C">("A");
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  if (!activeArtifact) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <p className="text-xs">Tidak ada artifact yang dipilih.</p>
        <button
          type="button"
          onClick={closeArtifactView}
          className="mt-3 text-xs font-semibold text-[#001299] hover:underline"
        >
          Kembali ke Chat
        </button>
      </div>
    );
  }

  const handleApplyCandidate = (candName: string) => {
    // Modify slightly to simulate applying Pareto candidate
    if (selectedCandidate === "A") {
      updateIngredientWeight("ing-squalane", 5.0);
      updateIngredientWeight("ing-niacinamide", 3.5);
    } else if (selectedCandidate === "B") {
      updateIngredientWeight("ing-squalane", 3.0);
      updateIngredientWeight("ing-cct", 2.5);
    } else {
      updateIngredientWeight("ing-niacinamide", 4.5);
    }
    setAppliedNotice(`Formula ${candName} berhasil diterapkan ke Composition Panel!`);
    setTimeout(() => setAppliedNotice(null), 2500);
  };

  const getIcon = () => {
    switch (activeArtifact.type) {
      case "pareto":
        return <Zap className="w-4 h-4 text-indigo-600" />;
      case "sentinel":
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case "simulation":
        return <Thermometer className="w-4 h-4 text-rose-600" />;
      case "similarity":
        return <Compass className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fafbfc] overflow-hidden font-sans">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-slate-200/80 shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={closeArtifactView}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 hover:text-[#001299] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Chat</span>
          </button>

          <div className="h-4 w-px bg-slate-200" />

          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-100 border border-slate-200/60">
              {getIcon()}
            </div>
            <div>
              <h2 className="text-xs font-extrabold text-[#0a192f] tracking-tight font-heading">
                {activeArtifact.title}
              </h2>
              <span className="text-[10px] text-slate-400 block font-mono">
                {activeArtifact.subtitle} • {activeArtifact.createdAt}
              </span>
            </div>
          </div>
        </div>

        <DelayedInfoTooltip
          content="Artifact adalah dokumen hasil analisis komputasi. Anda dapat meninjau report atau menerapkannya ke formula."
          position="bottom"
          delayMs={300}
        />
      </div>

      {/* Main Artifact Content Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {appliedNotice && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{appliedNotice}</span>
          </div>
        )}

        {/* 1. PARETO OPTIMIZER REPORT */}
        {activeArtifact.type === "pareto" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-6 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-[#0a192f] font-heading">
                    Top-3 Kandidat Solusi Non-Dominated Pareto Frontier
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Dievaluasi dari 50.000 iterasi dengan algoritma Optuna NSGA-II terakselerasi GPU.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
                  Simplex ∑w = 100%
                </span>
              </div>

              {/* Candidate Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    id: "A" as const,
                    title: "Kandidat A: Balanced",
                    stability: "92.4%",
                    cogs: "Rp 38.500",
                    tkdn: "46.2%",
                    badge: "Rekomendasi Utama",
                    desc: "Keseimbangan sempurna antara kestabilan 40°C dan efisiensi biaya produksi.",
                  },
                  {
                    id: "B" as const,
                    title: "Kandidat B: Cost Leader",
                    stability: "88.1%",
                    cogs: "Rp 29.200",
                    tkdn: "41.5%",
                    badge: "Paling Hemat",
                    desc: "Optimalisasi pengemulsi non-ionik untuk margin kotor maksimum.",
                  },
                  {
                    id: "C" as const,
                    title: "Kandidat C: High-TKDN",
                    stability: "90.8%",
                    cogs: "Rp 44.000",
                    tkdn: "54.8%",
                    badge: "TKDN Tertinggi",
                    desc: "Memaksimalkan minyak nabati lokal nusantara (Squalane & Tengkawang).",
                  },
                ].map((cand) => {
                  const isSelected = selectedCandidate === cand.id;
                  return (
                    <div
                      key={cand.id}
                      onClick={() => setSelectedCandidate(cand.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                        isSelected
                          ? "border-[#001299] bg-blue-50/40 ring-2 ring-[#001299]/20 shadow-xs"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-[#0a192f] font-heading">
                          {cand.title}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                          {cand.badge}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Stabilitas</span>
                          <span className="text-xs font-bold text-emerald-700 font-mono">{cand.stability}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">COGS/kg</span>
                          <span className="text-xs font-bold text-[#001299] font-mono">{cand.cogs}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">TKDN</span>
                          <span className="text-xs font-bold text-indigo-700 font-mono">{cand.tkdn}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500">{cand.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Action Apply */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  Kandidat terpilih: <strong>Kandidat {selectedCandidate}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => handleApplyCandidate(`Kandidat ${selectedCandidate}`)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#001299] hover:bg-[#000e7a] text-white shadow-xs transition-all cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Terapkan Kandidat {selectedCandidate} ke Composition Panel</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. REGULATORY SENTINEL REPORT */}
        {activeArtifact.type === "sentinel" && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-[#0a192f] font-heading">
                  Hasil Audit Legalitas BPOM, Halal HAS 23000 &amp; TKDN
                </h3>
                <p className="text-xs text-slate-500">
                  Pemeriksaan kepatuhan komprehensif terhadap 18 aturan regulasi kosmetik tropis.
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>STATUS: COMPLIANT</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Batas BPOM 17/2022</span>
                <span className="text-xl font-extrabold text-emerald-700 font-mono mt-1 block">100% Lolos</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Semua zat aktif di bawah ambang batas legal</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Sertifikasi Halal</span>
                <span className="text-xl font-extrabold text-[#001299] font-mono mt-1 block">HAS 23000</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Bebas turunan hewani non-halal &amp; porcine-free</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Bobot TKDN Hayati</span>
                <span className="text-xl font-extrabold text-indigo-700 font-mono mt-1 block">44.8%</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Memenuhi target minimal TKDN ≥ 40%</span>
              </div>
            </div>
          </div>
        )}

        {/* 3. SIMULASI KESTABILAN 40°C REPORT */}
        {activeArtifact.type === "simulation" && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-[#0a192f] font-heading">
                  Hasil Simulasi Termodinamika &amp; Kestabilan 40°C
                </h3>
                <p className="text-xs text-slate-500">
                  Uji in-silico 90 hari pada suhu 40°C (Inkubator Iklim Tropis Zona IVb) via LightGBM Surrogate GPU.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                Zona IVb (40°C / 75% RH)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Probabilitas Stabil</span>
                <span className="text-2xl font-extrabold text-emerald-800 font-mono mt-1 block">94.2%</span>
                <span className="text-[10px] text-emerald-600 block">Sangat Tahan Koalesensi</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Viskositas Prediksi</span>
                <span className="text-2xl font-extrabold text-[#0a192f] font-mono mt-1 block">5.350</span>
                <span className="text-[10px] text-slate-400 block">mPa·s (Gel-Cream)</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Ukuran Droplet DLS</span>
                <span className="text-2xl font-extrabold text-[#001299] font-mono mt-1 block">145 nm</span>
                <span className="text-[10px] text-slate-400 block">Distribusi Nanomisel Halus</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Energi Bebas Gibbs</span>
                <span className="text-2xl font-extrabold text-indigo-700 font-mono mt-1 block">-14.2</span>
                <span className="text-[10px] text-slate-400 block">kJ/mol (Spontan Stabil)</span>
              </div>
            </div>
          </div>
        )}

        {/* 4. DUAL-SCOPE SIMILARITY & PATENT NOVELTY REPORT */}
        {activeArtifact.type === "similarity" && <DualScopeSimilarityReport />}
      </div>
    </div>
  );
};
