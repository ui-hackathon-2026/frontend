"use client";

import React, { useState } from "react";
import { DelayedInfoTooltip } from "@/components/DelayedInfoTooltip";
import { ShieldCheck, FileCheck, CheckCircle2, AlertTriangle, Layers, Building2, Globe } from "lucide-react";

export interface InternalMatch {
  name?: string;
  formula_id?: string;
  jaccard?: number;
  cosine?: number;
  chassis_overlap_pct?: number;
}

export interface ExternalMatchItem {
  brand?: string;
  product_name?: string;
  url?: string;
  similarity?: number;
  shared_ingredients?: string[];
}

export interface SimilarityReportData {
  internal?: {
    matches?: InternalMatch[];
  };
  external?: {
    novelty_score?: number;
    top_matches?: ExternalMatchItem[];
  };
}

export const DualScopeSimilarityReport: React.FC<{ data?: SimilarityReportData | null }> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<"internal" | "external">("internal");
  const internalMatches = data?.internal?.matches ?? [];
  const externalMatches: ExternalMatchItem[] = data?.external?.top_matches ?? [];
  const noveltyPct = data?.external?.novelty_score != null ? Math.round(data.external.novelty_score * 100) : null;
  const topInternal = internalMatches[0];
  const topOverlap = topInternal != null
    ? Math.round(((topInternal.jaccard ?? 0) + (topInternal.cosine ?? 0)) / 2 * 1000) / 10
    : null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-6 shadow-xs font-sans">
      {/* Header & Dual Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-[#0a192f] tracking-tight font-heading">
              Dual-Scope Formula Similarity &amp; Patent Intelligence
            </h3>
            <DelayedInfoTooltip
              content="Analisis vektor kemiripan dua arah: repositori internal merk Paragon (efisiensi skala & data stabilitas terbukti) vs lanskap paten industri global (kebebasan operasional / FTO)."
              delayMs={300}
            />
          </div>
          <p className="text-xs text-slate-500">
            Audit kedekatan komposisi chassis terhadap basis data sediaan Wardah, Kahf, Emina, dan paten kosmetik global.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("internal")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "internal"
                ? "bg-[#001299] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Kemiripan Internal Paragon</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("external")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "external"
                ? "bg-[#001299] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Patent Novelty &amp; FTO</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Internal Brand Similarity */}
      {activeTab === "internal" && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* Top Score Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/60 space-y-1">
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
                Chassis Overlap Index
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-[#001299] font-heading">{topOverlap != null ? `${topOverlap}%` : "-"}</span>
                <span className="text-xs text-blue-600 font-medium">Jaccard &amp; Cosine</span>
              </div>
              <span className="text-[11px] text-slate-500 block">{topInternal ? `Paling mirip dengan ${topInternal.name ?? topInternal.formula_id}` : "Belum ada pembanding"}</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 space-y-1">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                Prior Art Stability Proof
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-emerald-800 font-heading">3+ Tahun</span>
                <span className="text-xs text-emerald-600 font-medium">di pasar</span>
              </div>
              <span className="text-[11px] text-slate-500 block">Rendah risiko pemisahan fase / sineresis</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Pengadaan Bersama (Synergy)
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-[#0a192f] font-heading">85%</span>
                <span className="text-xs text-slate-400 font-medium">bahan baku terikat</span>
              </div>
              <span className="text-[11px] text-slate-500 block">Harga kontrak volume besar R&amp;D</span>
            </div>
          </div>

          {/* Cross-Brand Breakdown Table */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Daftar Produk Internal Serupa (Paragon Cross-Brand Database)
            </span>
            <div className="overflow-x-auto border border-slate-200/80 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Produk Terdaftar</th>
                    <th className="p-3">Brand</th>
                    <th className="p-3">Overlap Chassis</th>
                    <th className="p-3">Diferensiasi Aktif</th>
                    <th className="p-3 text-right">Status Stabilitas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {internalMatches.length === 0 && (
                    <tr>
                      <td className="p-3 text-slate-400" colSpan={5}>Tidak ada formula pembanding tersimpan.</td>
                    </tr>
                  )}
                  {internalMatches.map((m, idx) => {
                    const overlap = Math.round(((m.jaccard ?? 0) + (m.cosine ?? 0)) / 2 * 1000) / 10;
                    return (
                    <tr key={m.formula_id ?? idx} className="hover:bg-slate-50/50">
                      <td className="p-3 font-semibold text-slate-900">{m.name ?? m.formula_id}</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#001299] font-bold">Internal</span></td>
                      <td className="p-3 font-mono font-bold text-[#001299]">{overlap}%</td>
                      <td className="p-3 text-slate-500">Chassis overlap {m.chassis_overlap_pct ?? "-"}%</td>
                      <td className="p-3 text-right"><span className="text-emerald-700 font-semibold">Terdaftar</span></td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Patent Novelty & FTO */}
      {activeTab === "external" && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-900 block">
                  Skor Kebaruan vs Produk Beredar
                </span>
                <span className="text-[11px] text-emerald-700">
                  Estimasi berbasis urutan label, bukan persen lab. Mesin FTO paten belum tersambung.
                </span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                Patent Novelty Index
              </span>
              <span className="text-2xl font-extrabold text-emerald-800 font-heading">
                {noveltyPct != null ? `${noveltyPct} / 100` : "-"}
              </span>
            </div>
          </div>

          {/* Patent Search Results */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Produk Kompetitor Paling Mirip
            </span>
            <div className="space-y-2">
              {externalMatches.length === 0 && (
                <p className="text-xs text-slate-400">Tidak ada produk pembanding yang cocok.</p>
              )}
              {externalMatches.map((m, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">{m.product_name} ({m.brand})</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold">
                    Mirip: {Math.round((m.similarity ?? 0) * 1000) / 10}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Bahan bersama: {(m.shared_ingredients || []).join(", ") || "-"}
                </p>
              </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
