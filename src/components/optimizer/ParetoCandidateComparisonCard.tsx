"use client";

import React from "react";
import Link from "next/link";
import {
  ParetoCandidateFormula,
  CandidateIngredient,
} from "@/domain/models/optimizer";
import {
  ArrowRight,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  Layers,
  Sparkles,
  CheckCircle2,
  Sprout,
  Scale,
} from "lucide-react";
import { DelayedInfoTooltip } from "@/components/DelayedInfoTooltip";

interface ParetoCandidateComparisonCardProps {
  candidates: ParetoCandidateFormula[];
  selectedCandidateId: "A" | "B" | "C";
  onSelectCandidate: (id: "A" | "B" | "C") => void;
}

export const ParetoCandidateComparisonCard: React.FC<ParetoCandidateComparisonCardProps> = ({
  candidates,
  selectedCandidateId,
  onSelectCandidate,
}) => {
  const activeCandidate =
    candidates.find((c) => c.id === selectedCandidateId) || candidates[0];

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
      {/* Header & Candidate Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-[#001299] uppercase tracking-wider block">
              Komparasi Formula Juara Pareto
            </span>
            <DelayedInfoTooltip
              content="Tiga titik solusi frontier terbaik yang mewakili trade-off seimbang, efisiensi biaya tertinggi, dan pemanfaatan bahan lokal tertinggi."
              delayMs={300}
            />
          </div>
          <h3 className="text-xl font-extrabold text-[#0a192f] font-heading mt-0.5">
            Top-3 Pareto Candidates
          </h3>
        </div>

        {/* Handshake CTA to Workbench */}
        <Link
          href="/workbench"
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-[#001299] hover:bg-[#000e7a] text-white text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0"
        >
          <span>Adopsi ke Formulation Canvas</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 3 Candidate Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {candidates.map((c) => {
          const isSelected = selectedCandidateId === c.id;
          const badgeColor =
            c.id === "A"
              ? "bg-blue-100 text-[#001299]"
              : c.id === "B"
              ? "bg-emerald-100 text-emerald-900"
              : "bg-purple-100 text-purple-900";

          return (
            <div
              key={c.id}
              onClick={() => onSelectCandidate(c.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? "border-[#001299] bg-blue-50/40 ring-2 ring-[#001299]"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${badgeColor}`}>
                  {c.badgeLabel}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  Kandidat {c.id}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-slate-900">{c.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{c.archetype}</p>
              </div>

              {/* Mini metric summary */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Stabilitas:</span>
                  <span className="font-bold text-slate-800">{c.metrics.stabilityPct}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">COGS:</span>
                  <span className="font-bold text-slate-800">
                    Rp {(c.metrics.cogsIdrPerKg / 1000).toFixed(1)}k
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">TKDN Lokal:</span>
                  <span className="font-bold text-emerald-700">{c.metrics.tkdnPct}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Viskositas:</span>
                  <span className="font-bold text-slate-800">
                    {c.metrics.viscosityMpaS.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Candidate Detailed Metrics & Rationale */}
      <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-[#001299]">Rasional Trade-Off Solusi:</span>
            <p className="text-xs text-slate-700 leading-relaxed mt-0.5">
              {activeCandidate.tradeOffSummary}
            </p>
          </div>
        </div>

        {/* 4-Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200/70 space-y-0.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Stabilitas 40°C
            </span>
            <div className="text-base font-extrabold text-[#0a192f] font-mono">
              {activeCandidate.metrics.stabilityPct}%
              <span className="text-[10px] font-normal text-emerald-600 ml-1">(Lulus 90h)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200/70 space-y-0.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Estimasi COGS
            </span>
            <div className="text-base font-extrabold text-[#0a192f] font-mono">
              Rp {activeCandidate.metrics.cogsIdrPerKg.toLocaleString("id-ID")}
              <span className="text-[10px] font-normal text-slate-500 ml-1">/kg</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/70 space-y-0.5">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
              Kandungan TKDN
            </span>
            <div className="text-base font-extrabold text-emerald-900 font-mono">
              {activeCandidate.metrics.tkdnPct}%
              <span className="text-[10px] font-semibold text-emerald-700 ml-1">≥40% Target</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200/70 space-y-0.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Viskositas &amp; HLB
            </span>
            <div className="text-base font-extrabold text-[#0a192f] font-mono">
              {activeCandidate.metrics.viscosityMpaS.toLocaleString("id-ID")}
              <span className="text-[10px] font-normal text-slate-500 ml-1">
                mPa·s (HLB {activeCandidate.metrics.systemHlb.toFixed(1)})
              </span>
            </div>
          </div>
        </div>

        {/* Physicochemical Rationale Box */}
        <div className="p-3.5 rounded-xl bg-blue-50/40 border border-blue-100 text-xs text-slate-700 leading-relaxed space-y-1">
          <span className="font-bold text-[#001299] block">Penjelasan Fisikokimia Koloid:</span>
          <p className="text-slate-600">{activeCandidate.physicochemicalRationale}</p>
        </div>
      </div>

      {/* 4-Phase Composition Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#001299]" />
            <span>Alokasi Komposisi 4-Fase Sediaan</span>
          </h4>
          <span className="text-[11px] font-mono font-bold text-[#001299]">
            Total Bobot: 100.0% (Equilibrium Presisi)
          </span>
        </div>

        <div className="border border-slate-200/80 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
          {activeCandidate.ingredients.map((ing) => (
            <div
              key={ing.id}
              className="p-3.5 bg-white hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-start space-x-3">
                <span
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    ing.phase === "A"
                      ? "bg-blue-100 text-[#001299]"
                      : ing.phase === "B"
                      ? "bg-amber-100 text-amber-900"
                      : ing.phase === "C"
                      ? "bg-purple-100 text-purple-900"
                      : "bg-emerald-100 text-emerald-900"
                  }`}
                >
                  {ing.phase}
                </span>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{ing.name}</span>
                    {ing.isLocalTkdn && (
                      <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                        Lokal TKDN
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono block">
                    INCI: {ing.inci} • {ing.functionDesc}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-mono font-bold text-sm text-slate-900">
                  {ing.weightPct.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
