"use client";

import React from "react";
import { LlmRegulatoryReasoning } from "@/domain/models/compliance";
import { Sparkles, AlertCircle, ArrowUpRight, Leaf, ShieldAlert } from "lucide-react";

interface AiRegulatoryReasoningCardProps {
  reasoning: LlmRegulatoryReasoning;
}

export const AiRegulatoryReasoningCard: React.FC<AiRegulatoryReasoningCardProps> = ({ reasoning }) => {
  return (
    <div className="relative overflow-hidden shimmer-card p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-bold text-[#0a192f] uppercase tracking-wider">
            AI Regulatory Reasoning &amp; Local TKDN Booster
          </h3>
        </div>
      </div>

      {/* Toxicology Narrative */}
      <div className="relative overflow-hidden shimmer-card p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100/80 space-y-1.5">
        <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider block">
          Evaluasi Toksikologi &amp; Sawar Kulit
        </span>
        <p className="text-xs text-indigo-950 leading-relaxed">
          {reasoning.toxicologyEvaluation}
        </p>
      </div>

      {/* Local Substitution Recommendations (TKDN Booster) */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
          <Leaf className="w-4 h-4 text-emerald-600" />
          Rekomendasi Substitusi Bahan Lokal Nusantara
        </span>

        <div className="space-y-2">
          {reasoning.localSubstitutionRecommendations.map((rec, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden shimmer-card p-3 rounded-2xl bg-emerald-50/40 border border-emerald-200/70 space-y-1.5"
            >
              <div className="flex items-center justify-between flex-wrap gap-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-950">
                  <span className="text-slate-500 line-through">{rec.currentIngredient}</span>
                  <span className="text-emerald-700">➔</span>
                  <span className="text-emerald-900 font-bold">{rec.recommendedLocal}</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  {rec.tkdnImpact}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">{rec.rationale}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mandatory Packaging Warnings */}
      <div className="space-y-2 pt-1 border-t border-slate-100">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          Peringatan Wajib Etiket Kemasan (Perka BPOM)
        </span>

        <ul className="space-y-1.5">
          {reasoning.mandatoryLabelWarnings.map((warn, idx) => (
            <li
              key={idx}
              className="text-[11px] text-slate-600 flex items-start gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200/60"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <span>{warn}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
