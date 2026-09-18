"use client";

import React, { useState } from "react";
import { ShimmerSkeleton } from "@/components/ShimmerWidget";
import { DelayedInfoTooltip } from "@/components/DelayedInfoTooltip";
import {
  Building2,
  Globe,
  RotateCcw,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { InternalSimilarityMatch, ExternalSimilarityResult } from "@/domain/models/similarity";

interface SimilarityPanelProps {
  status: "idle" | "loading" | "loaded" | "error";
  internal: InternalSimilarityMatch[];
  external: ExternalSimilarityResult | null;
  error: string | null;
  onRetry: () => void;
}

function scoreTone(score: number): string {
  if (score >= 0.7) return "text-rose-700 bg-rose-50 border-rose-200";
  if (score >= 0.4) return "text-amber-700 bg-amber-50 border-amber-200";
  return "text-emerald-700 bg-emerald-50 border-emerald-200";
}

function InternalTab({ matches }: { matches: InternalSimilarityMatch[] }) {
  if (matches.length === 0) {
    return (
      <p className="text-xs text-slate-400 py-6 text-center">
        Tidak ada formula internal lain yang cukup mirip.
      </p>
    );
  }
  return (
    <div className="overflow-x-auto border border-slate-200/80 rounded-2xl">
      <table className="w-full text-left text-xs min-w-[520px]">
        <thead className="bg-[#fafbfc] text-slate-500 font-bold border-b border-slate-200">
          <tr>
            <th className="p-3">Formula</th>
            <th className="p-3">Jaccard</th>
            <th className="p-3">Cosine</th>
            <th className="p-3 text-right">Overlap Chassis</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {matches.map((m) => (
            <tr key={m.formulaId} className="hover:bg-slate-50/50">
              <td className="p-3 font-semibold text-slate-900">{m.name}</td>
              <td className="p-3">
                <span className={`px-2 py-0.5 rounded-md border font-mono font-bold text-[11px] ${scoreTone(m.jaccard)}`}>
                  {(m.jaccard * 100).toFixed(0)}%
                </span>
              </td>
              <td className="p-3">
                <span className={`px-2 py-0.5 rounded-md border font-mono font-bold text-[11px] ${scoreTone(m.cosine)}`}>
                  {(m.cosine * 100).toFixed(0)}%
                </span>
              </td>
              <td className="p-3 text-right font-mono text-slate-500">{m.chassisOverlapPct.toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ExternalTab({ result }: { result: ExternalSimilarityResult | null }) {
  if (!result) return null;
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#fafbfc] border border-slate-200/80">
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Novelty Score (Estimasi)
          </span>
          <span className="text-[11px] text-slate-400">{result.estimatedBasis}</span>
        </div>
        <span className="text-xl font-extrabold text-[#0a192f] font-heading shrink-0">
          {(result.noveltyScore * 100).toFixed(0)}%
        </span>
      </div>

      {result.topMatches.length === 0 ? (
        <p className="text-xs text-slate-400 py-4 text-center">
          Tidak ditemukan produk kompetitor dengan bahan yang tumpang tindih.
        </p>
      ) : (
        <div className="space-y-2">
          {result.topMatches.map((m) => (
            <div key={m.url} className="p-3.5 rounded-2xl border border-slate-200 bg-[#fafbfc]/60 space-y-1.5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{m.brand}</span>
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-bold text-[#0a192f] hover:text-[#001299] truncate"
                  >
                    {m.productName}
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
                <span className={`px-2 py-0.5 rounded-md border font-mono text-[11px] font-bold shrink-0 ${scoreTone(m.similarity)}`}>
                  {(m.similarity * 100).toFixed(0)}%
                </span>
              </div>
              {m.sharedIngredients.length > 0 && (
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Bahan bersama: {m.sharedIngredients.join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const SimilarityPanel: React.FC<SimilarityPanelProps> = ({
  status,
  internal,
  external,
  error,
  onRetry,
}) => {
  const [activeTab, setActiveTab] = useState<"internal" | "external">("internal");

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-xs font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-extrabold text-[#0a192f] tracking-tight font-heading">
            Similarity Check
          </h4>
          <DelayedInfoTooltip
            content="Internal: bandingkan komposisi (Jaccard, cosine, overlap fase) dengan formula lain milik tim. Eksternal: bandingkan dengan 552 produk kompetitor hasil scraping label INCI — skor eksternal adalah estimasi berbasis urutan bahan, bukan persentase lab."
            delayMs={300}
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("internal")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "internal" ? "bg-[#001299] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Formula Internal</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("external")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "external" ? "bg-[#001299] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Produk Kompetitor</span>
          </button>
        </div>
      </div>

      {status === "loading" && (
        <div className="space-y-2.5">
          <ShimmerSkeleton className="w-full h-9 rounded-xl" />
          <ShimmerSkeleton className="w-full h-9 rounded-xl" />
          <ShimmerSkeleton className="w-2/3 h-9 rounded-xl" />
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
          <div className="flex items-center gap-2 text-rose-800 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </button>
        </div>
      )}

      {status === "loaded" && (
        <div className="animate-in fade-in duration-150">
          {activeTab === "internal" ? <InternalTab matches={internal} /> : <ExternalTab result={external} />}
        </div>
      )}
    </div>
  );
};

export default SimilarityPanel;
