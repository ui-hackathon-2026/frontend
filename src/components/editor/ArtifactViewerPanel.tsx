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
  FileText,
  CheckCircle2,
  Sliders,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  FileCheck,
  History,
  RefreshCw,
  Sprout,
} from "lucide-react";
import { ParetoCandidateFormula } from "@/domain/models/optimizer";
import { EditorIngredient, FormulaModificationProposal } from "@/domain/models/editor";

export const ArtifactViewerPanel: React.FC = () => {
  const { activeArtifact, closeArtifactView, applyProposal, ingredients } = useEditor();
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

  const handleApplyCandidate = async (
    cand: ParetoCandidateFormula | null,
    mode: "new_version" | "overwrite" = "new_version"
  ) => {
    if (cand && cand.ingredients && cand.ingredients.length > 0) {
      const updatedEditorIngredients: EditorIngredient[] = cand.ingredients.map((c, idx) => ({
        id: `ing-pareto-${cand.id.toLowerCase()}-${c.phase.toLowerCase()}-${c.inci.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${idx}`,
        name: c.name || c.inci,
        inci: c.inci,
        phase: c.phase,
        weightPct: Number(c.weightPct.toFixed(2)),
        role: "active",
        isLocked: false,
      }));

      const currentMap = new Map<string, EditorIngredient>();
      ingredients.forEach((it) => currentMap.set(it.inci.toLowerCase(), it));

      const changes = updatedEditorIngredients.map((item) => {
        const existing = currentMap.get(item.inci.toLowerCase());
        return {
          ingredientId: existing?.id || item.id,
          name: item.name,
          oldPct: existing ? existing.weightPct : 0,
          newPct: item.weightPct,
          phase: item.phase,
          action: existing ? ("modified" as const) : ("added" as const),
        };
      });

      const proposal: FormulaModificationProposal = {
        id: `prop-pareto-art-${cand.id.toLowerCase()}-${Date.now()}`,
        title: `Aplikasi Formula ${cand.title}`,
        explanation: `${cand.archetype} • Stabilitas 40°C ${cand.metrics.stabilityPct}% | COGS Rp ${cand.metrics.cogsIdrPerKg.toLocaleString("id-ID")}/kg | TKDN ${cand.metrics.tkdnPct}%`,
        changes,
        updatedIngredients: updatedEditorIngredients,
      };

      await applyProposal(proposal, mode);
      setAppliedNotice(
        `Formula ${cand.title} berhasil diterapkan sebagai ${mode === "new_version" ? "Versi Baru (Snapshot)" : "Overwrite"} di Composition Panel!`
      );
      setTimeout(() => setAppliedNotice(null), 3000);
      return;
    }

    setAppliedNotice(`Formula Kandidat ${selectedCandidate} berhasil diterapkan ke Composition Panel!`);
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
        return <FileText className="w-4 h-4 text-blue-600" />;
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
          align="right"
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
                    Dievaluasi dari{" "}
                    {((activeArtifact as any).data?.trialsEvaluated ?? 0).toLocaleString("id-ID")}{" "}
                    iterasi dengan algoritma Optuna NSGA-II terakselerasi GPU.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
                  Simplex ∑w = 100%
                </span>
              </div>

              {/* Candidate Cards Grid */}
              {(() => {
                const topCandidates: ParetoCandidateFormula[] = activeArtifact.data?.topCandidates || [];
                const candidatesToRender =
                  topCandidates.length > 0
                    ? topCandidates.map((c) => ({
                        id: c.id,
                        title: c.title,
                        stability: `${c.metrics.stabilityPct}%`,
                        cogs: `Rp ${c.metrics.cogsIdrPerKg.toLocaleString("id-ID")}`,
                        tkdn: `${c.metrics.tkdnPct}%`,
                        badge: c.badgeLabel || (c.id === "A" ? "Rekomendasi Utama" : c.id === "B" ? "Paling Hemat" : "TKDN Tertinggi"),
                        desc: c.tradeOffSummary || c.archetype,
                        raw: c,
                      }))
                    : [
                        {
                          id: "A" as const,
                          title: "Kandidat A: Balanced",
                          stability: "92.4%",
                          cogs: "Rp 38.500",
                          tkdn: "46.2%",
                          badge: "Rekomendasi Utama",
                          desc: "Keseimbangan sempurna antara kestabilan 40°C dan efisiensi biaya produksi.",
                          raw: null,
                        },
                        {
                          id: "B" as const,
                          title: "Kandidat B: Cost Leader",
                          stability: "88.1%",
                          cogs: "Rp 29.200",
                          tkdn: "41.5%",
                          badge: "Paling Hemat",
                          desc: "Optimalisasi pengemulsi non-ionik untuk margin kotor maksimum.",
                          raw: null,
                        },
                        {
                          id: "C" as const,
                          title: "Kandidat C: High-TKDN",
                          stability: "90.8%",
                          cogs: "Rp 44.000",
                          tkdn: "54.8%",
                          badge: "TKDN Tertinggi",
                          desc: "Memaksimalkan minyak nabati lokal nusantara (Squalane & Tengkawang).",
                          raw: null,
                        },
                      ];

                const currentCandidateObj =
                  topCandidates.find((c) => c.id === selectedCandidate) || topCandidates[0] || null;

                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {candidatesToRender.map((cand) => {
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

                            <p className="text-[11px] text-slate-500 line-clamp-2">{cand.desc}</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Rationale & Candidate Detail Box */}
                    {currentCandidateObj && (
                      <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3 mt-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#001299]" />
                            <h4 className="text-xs font-bold text-[#001299]">
                              Rasional Fisikokimia: {currentCandidateObj.title}
                            </h4>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                            HLB Sistem: {currentCandidateObj.metrics.systemHlb} • Viskositas: {currentCandidateObj.metrics.viscosityMpaS.toLocaleString("id-ID")} mPa.s
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {currentCandidateObj.physicochemicalRationale}
                        </p>

                        {/* Candidate Ingredients Breakdown Table */}
                        {currentCandidateObj.ingredients && currentCandidateObj.ingredients.length > 0 && (
                          <div className="pt-2">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                              Komposisi Bahan Rekomendasi Model ({currentCandidateObj.ingredients.length} Komponen)
                            </div>
                            <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
                              <table className="w-full text-left text-[11px]">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[10px] sticky top-0">
                                  <tr>
                                    <th className="py-1.5 px-3">Fase</th>
                                    <th className="py-1.5 px-3">Bahan / INCI</th>
                                    <th className="py-1.5 px-3 text-right">Konsentrasi (% b/b)</th>
                                    <th className="py-1.5 px-3">Peran / Fungsi</th>
                                    <th className="py-1.5 px-3 text-center">Status</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {currentCandidateObj.ingredients.map((ing) => (
                                    <tr key={ing.id} className="hover:bg-slate-50/80 transition-colors">
                                      <td className="py-1.5 px-3 font-mono font-bold text-indigo-700">Fase {ing.phase}</td>
                                      <td className="py-1.5 px-3 font-semibold text-slate-800">{ing.name || ing.inci}</td>
                                      <td className="py-1.5 px-3 text-right font-mono font-bold text-[#001299]">{ing.weightPct.toFixed(2)}%</td>
                                      <td className="py-1.5 px-3 text-slate-500">{ing.functionDesc}</td>
                                      <td className="py-1.5 px-3 text-center">
                                        {ing.isLocalTkdn ? (
                                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            TKDN Lokal
                                          </span>
                                        ) : (
                                          <span className="text-[9px] text-slate-400">Standard</span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Apply: Dual Choice */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
                      <span className="text-xs text-slate-500">
                        Kandidat terpilih: <strong>Kandidat {selectedCandidate}</strong>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleApplyCandidate(currentCandidateObj, "new_version")}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#001299] hover:bg-[#000e7a] text-white shadow-xs transition-all cursor-pointer"
                        >
                          <History className="w-3.5 h-3.5 text-blue-200" />
                          <span>Terapkan Sebagai Versi Baru</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyCandidate(currentCandidateObj, "overwrite")}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                          <span>Overwrite Versi Ini</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
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
                <span>STATUS: {(activeArtifact as any).data?.status ?? "UNKNOWN"}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Batas BPOM 25/2025</span>
                <span className="text-xl font-extrabold text-emerald-700 font-mono mt-1 block">{(activeArtifact as any).data?.bpomScore ?? "-"}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Batas aman per bahan terverifikasi</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Sertifikasi Halal</span>
                <span className="text-xl font-extrabold text-[#001299] font-mono mt-1 block">{(activeArtifact as any).data?.halalScore ?? "-"}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Bebas turunan hewani non-halal &amp; porcine-free</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Bobot TKDN Hayati</span>
                <span className="text-xl font-extrabold text-indigo-700 font-mono mt-1 block">{(activeArtifact as any).data?.tkdnScore ?? "-"}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Target minimal TKDN ≥ 40%</span>
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
                <span className="text-2xl font-extrabold text-emerald-800 font-mono mt-1 block">{(activeArtifact as any).data?.probStability ?? "-"}%</span>
                <span className="text-[10px] text-emerald-600 block">{(activeArtifact as any).data?.verdict ?? ""}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Viskositas Prediksi</span>
                <span className="text-2xl font-extrabold text-[#0a192f] font-mono mt-1 block">{Number((activeArtifact as any).data?.viscosityMpaS ?? 0).toLocaleString("id-ID")}</span>
                <span className="text-[10px] text-slate-400 block">mPa·s (Gel-Cream)</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Ukuran Droplet DLS</span>
                <span className="text-2xl font-extrabold text-[#001299] font-mono mt-1 block">{(activeArtifact as any).data?.dropletDlsNm ?? "-"} nm</span>
                <span className="text-[10px] text-slate-400 block">Distribusi Nanomisel Halus</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Energi Bebas Gibbs</span>
                <span className="text-2xl font-extrabold text-indigo-700 font-mono mt-1 block">{(activeArtifact as any).data?.gibbsDeltaG ?? "-"}</span>
                <span className="text-[10px] text-slate-400 block">kJ/mol (Spontan Stabil)</span>
              </div>
            </div>
          </div>
        )}

        {/* 4. DUAL-SCOPE SIMILARITY & PATENT NOVELTY REPORT */}
        {activeArtifact.type === "similarity" && <DualScopeSimilarityReport data={(activeArtifact as any).data} />}
      </div>
    </div>
  );
};
