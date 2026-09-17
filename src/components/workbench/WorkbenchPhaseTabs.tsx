"use client";

import React from "react";
import { FormulationPhase, PhaseSummary } from "@/domain/models/workbench";

interface WorkbenchPhaseTabsProps {
  summaries: Record<FormulationPhase, PhaseSummary>;
  activePhase: FormulationPhase | "ALL";
  onSelectPhase: (phase: FormulationPhase | "ALL") => void;
}

export const WorkbenchPhaseTabs: React.FC<WorkbenchPhaseTabsProps> = ({
  summaries,
  activePhase,
  onSelectPhase,
}) => {
  const tabs: { id: FormulationPhase | "ALL"; label: string; sub: string; count?: number; weight?: number }[] = [
    {
      id: "ALL",
      label: "Semua Fase",
      sub: "Overview Utuh",
    },
    {
      id: "A",
      label: "Fase A (Minyak)",
      sub: "Lipofilik & Emolien",
      count: summaries.A.itemCount,
      weight: summaries.A.totalWeightPct,
    },
    {
      id: "B",
      label: "Fase B (Air)",
      sub: "Hidrofilik & Polimer",
      count: summaries.B.itemCount,
      weight: summaries.B.totalWeightPct,
    },
    {
      id: "C",
      label: "Fase C (Emulgator)",
      sub: "Surfaktan & Stabilizer",
      count: summaries.C.itemCount,
      weight: summaries.C.totalWeightPct,
    },
    {
      id: "D",
      label: "Fase D (Aktif/Aditif)",
      sub: "Peka Panas & Pengawet",
      count: summaries.D.itemCount,
      weight: summaries.D.totalWeightPct,
    },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl overflow-x-auto text-xs">
      {tabs.map((tab) => {
        const isActive = activePhase === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectPhase(tab.id)}
            className={`flex-1 min-w-[130px] px-3 py-2 rounded-xl text-left transition-all ${
              isActive
                ? "bg-white text-[#0a192f] shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50 font-normal"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="truncate">{tab.label}</span>
              {tab.weight !== undefined && (
                <span className="text-[11px] font-mono text-slate-500 font-semibold">
                  {tab.weight.toFixed(1)}%
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {tab.sub}
            </div>
          </button>
        );
      })}
    </div>
  );
};
