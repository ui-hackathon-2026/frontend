"use client";

import React from "react";
import { FormulaItemResponse } from "@/domain/models/formula";

const PHASE_FILL: Record<string, string> = {
  A: "bg-amber-400",
  B: "bg-blue-400",
  C: "bg-purple-400",
  D: "bg-emerald-400",
};

const PHASE_LABEL: Record<string, string> = {
  A: "Fase A — Minyak",
  B: "Fase B — Air & Polimer",
  C: "Fase C — Emulgator",
  D: "Fase D — Aktif & Aditif",
};

interface PhaseSegment {
  phase: string;
  pct: number;
}

function summarizePhases(ingredients: FormulaItemResponse["ingredients"]): PhaseSegment[] {
  const totals: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  for (const ing of ingredients) {
    const p = ing.phase in totals ? ing.phase : "B";
    totals[p] += ing.weight_pct;
  }
  const sum = Object.values(totals).reduce((a, b) => a + b, 0) || 1;
  return (["A", "B", "C", "D"] as const)
    .map((phase) => ({ phase, pct: (totals[phase] / sum) * 100 }))
    .filter((s) => s.pct > 0);
}

interface PhaseCompositionBarProps {
  formula: FormulaItemResponse;
  className?: string;
  height?: "sm" | "md";
  showLegend?: boolean;
}

export const PhaseCompositionBar: React.FC<PhaseCompositionBarProps> = ({
  formula,
  className = "",
  height = "md",
  showLegend = false,
}) => {
  const segments = summarizePhases(formula.ingredients);
  const barHeight = height === "sm" ? "h-1.5" : "h-2.5";

  return (
    <div className={className}>
      <div className={`flex w-full overflow-hidden rounded-full bg-slate-100 ${barHeight}`}>
        {segments.map((seg) => (
          <div
            key={seg.phase}
            title={`${PHASE_LABEL[seg.phase]}: ${seg.pct.toFixed(1)}%`}
            className={`${PHASE_FILL[seg.phase]} h-full transition-all`}
            style={{ width: `${seg.pct}%` }}
          />
        ))}
      </div>
      {showLegend && (
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          {segments.map((seg) => (
            <span key={seg.phase} className="flex items-center gap-1 text-[10px] text-slate-500">
              <span className={`w-2 h-2 rounded-full ${PHASE_FILL[seg.phase]}`} />
              Fase {seg.phase} · {seg.pct.toFixed(0)}%
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhaseCompositionBar;
