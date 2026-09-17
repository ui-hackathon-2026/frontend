"use client";

import React from "react";
import { ArtifactType } from "@/domain/models/editor";
import { Zap, ShieldCheck, Thermometer, Compass, Plus, Sparkles } from "lucide-react";

interface ActionPlusMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (type: ArtifactType) => void;
}

export const ActionPlusMenu: React.FC<ActionPlusMenuProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  if (!isOpen) return null;

  const actions: Array<{
    type: ArtifactType;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
  }> = [
    {
      type: "pareto",
      title: "Pareto Multi-Objective Optimizer",
      description: "Optimasi 50.000 iterasi simpleks massa (Stabilitas vs Biaya COGS vs TKDN lokal).",
      icon: Zap,
      accentColor: "text-indigo-600 bg-indigo-50 border-indigo-200",
    },
    {
      type: "sentinel",
      title: "Enterprise BPOM, Halal & TKDN Sentinel",
      description: "Audit batas legal Perka BPOM No. 17/2022 & screening sertifikasi Halal HAS 23000.",
      icon: ShieldCheck,
      accentColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      type: "simulation",
      title: "Simulasi Kestabilan 40°C (In-Silico)",
      description: "Prediksi degradasi emulsi iklim tropis Zona IVb 90 hari via LightGBM GPU.",
      icon: Thermometer,
      accentColor: "text-rose-600 bg-rose-50 border-rose-200",
    },
    {
      type: "similarity",
      title: "Dual-Scope Formula Similarity & Patent FTO",
      description: "Deteksi kemiripan chassis lintas merk Paragon & audit kebaruan paten global.",
      icon: Compass,
      accentColor: "text-blue-600 bg-blue-50 border-blue-200",
    },
  ];

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute bottom-14 left-0 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-40 animate-in fade-in slide-in-from-bottom-2 font-sans">
        <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider font-heading">
            <Sparkles className="w-3.5 h-3.5 text-[#001299]" />
            <span>Pilih Aksi Analisis Komputasi</span>
          </div>
          <span className="text-[10px] text-slate-400">4 Fitur Utama</span>
        </div>

        <div className="p-1 space-y-1 mt-1">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.type}
                type="button"
                onClick={() => {
                  onSelectAction(act.type);
                  onClose();
                }}
                className="w-full p-2.5 rounded-xl hover:bg-slate-50 transition-all text-left flex items-start gap-3 group cursor-pointer"
              >
                <div className={`p-2 rounded-lg border ${act.accentColor} shrink-0 mt-0.5`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-[#001299] transition-colors block">
                    {act.title}
                  </span>
                  <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                    {act.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
