"use client";

import React, { useState } from "react";
import { IngredientAuditItem } from "@/domain/models/compliance";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  Bookmark,
} from "lucide-react";

interface IngredientAuditTableProps {
  ingredients: IngredientAuditItem[];
}

export const IngredientAuditTable: React.FC<IngredientAuditTableProps> = ({ ingredients }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Rincian Audit Forensik Bahan ({ingredients.length} Komponen)
          </span>
          <p className="text-xs text-slate-400">
            Klik pada baris bahan untuk membaca klausul hukum resmi hasil penarikan Vector RAG
          </p>
        </div>
      </div>

      <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
        {ingredients.map((item) => {
          const isExpanded = expandedId === item.id;
          const isPassed = item.status === "PASSED";
          const isViolation = item.status === "VIOLATION";

          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all ${
                isViolation
                  ? "bg-rose-50/40 border-rose-200"
                  : isExpanded
                  ? "bg-blue-50/20 border-blue-200 shadow-xs"
                  : "bg-white border-slate-200/80 hover:border-slate-300"
              }`}
            >
              <div
                onClick={() => toggleExpand(item.id)}
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
              >
                {/* Left: Info */}
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 shrink-0">
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isViolation ? (
                      <XCircle className="w-4 h-4 text-rose-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    )}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-xs sm:text-sm text-[#0a192f] truncate">
                        {item.name}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {item.inci}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span>Fase: <strong className="text-slate-700">{item.phase}</strong></span>
                      <span>Dosis: <strong className="font-mono text-slate-800">{item.weightPct}%</strong></span>
                      {item.bpomLimitPct && (
                        <span>
                          Batas BPOM: <strong className="font-mono text-slate-800">{item.bpomLimitPct}%</strong>
                        </span>
                      )}
                      <span>TKDN: <strong className="font-mono text-emerald-700">{item.tkdnPct}%</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right: Status Pill & Expand Trigger */}
                <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isPassed
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : isViolation
                        ? "bg-rose-50 text-rose-800 border-rose-200"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                  >
                    {isPassed ? "Lolos BPOM" : isViolation ? "Melanggar Batas" : "Perhatian"}
                  </span>

                  {item.ragCitation && (
                    <span className="text-[11px] text-[#001299] font-medium flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> Sitasi RAG
                    </span>
                  )}

                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expand Drawer: Exact RAG Regulatory Citation */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-100 text-xs space-y-3 animate-in fade-in duration-150">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-[11px]">
                      <Bookmark className="w-3.5 h-3.5 text-[#001299]" />
                      <span>{item.ragCitation?.regulation || "Monografi Resmi BPOM RI"}</span>
                      {item.ragCitation?.appendix && (
                        <span className="text-slate-500 font-normal">
                          • {item.ragCitation.appendix} ({item.ragCitation.clauseNumber})
                        </span>
                      )}
                    </div>
                    {item.ragCitation?.excerpt && (
                      <p className="text-[11px] text-slate-600 italic pl-5 border-l-2 border-[#001299]/40 leading-relaxed">
                        &ldquo;{item.ragCitation.excerpt}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-600 pl-1">
                    <strong>Catatan Audit:</strong> {item.auditNotes}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
