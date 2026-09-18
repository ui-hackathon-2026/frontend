"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { useEditor } from "@/contexts/EditorContext";
import { EditorIngredient } from "@/domain/models/editor";
import { DelayedInfoTooltip } from "@/components/DelayedInfoTooltip";
import {
  Sliders,
  Lock,
  Unlock,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Plus,
  Droplets,
  Atom,
} from "lucide-react";

export const KitchenCompositionPanel: React.FC = () => {
  const {
    activeDraft,
    ingredients,
    updateIngredientWeight,
    toggleLockIngredient,
    removeIngredient,
    selectedMoleculeIngredient,
    setSelectedMoleculeIngredient,
    setLeftPanelMode,
  } = useEditor();

  // Group by Phase
  const phases = useMemo(() => {
    return {
      A: ingredients.filter((it) => it.phase === "A"),
      B: ingredients.filter((it) => it.phase === "B"),
      C: ingredients.filter((it) => it.phase === "C"),
      D: ingredients.filter((it) => it.phase === "D"),
    };
  }, [ingredients]);

  const totalWeight = useMemo(() => {
    return Number(ingredients.reduce((sum, it) => sum + it.weightPct, 0).toFixed(2));
  }, [ingredients]);

  const phaseBreakdown = useMemo(() => {
    const calc = (list: EditorIngredient[]) => list.reduce((sum, it) => sum + it.weightPct, 0);
    return {
      A: Number(calc(phases.A).toFixed(1)),
      B: Number(calc(phases.B).toFixed(1)),
      C: Number(calc(phases.C).toFixed(1)),
      D: Number(calc(phases.D).toFixed(1)),
    };
  }, [phases]);

  const handleSelectIngredient = (item: EditorIngredient) => {
    setSelectedMoleculeIngredient(item);
    setLeftPanelMode("molecule-3d");
  };

  const getPhaseName = (p: "A" | "B" | "C" | "D") => {
    switch (p) {
      case "A":
        return "Fase A (Fase Minyak / Lipofilik)";
      case "B":
        return "Fase B (Fase Air / Hidrofilik)";
      case "C":
        return "Fase C (Sistem Emulgator & Surfaktan)";
      case "D":
        return "Fase D (Bahan Aktif & Aditif)";
    }
  };

  const getPhaseColor = (p: "A" | "B" | "C" | "D") => {
    switch (p) {
      case "A":
        return "bg-amber-500 text-amber-50";
      case "B":
        return "bg-blue-500 text-blue-50";
      case "C":
        return "bg-indigo-500 text-indigo-50";
      case "D":
        return "bg-emerald-500 text-emerald-50";
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200/80 font-sans">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70 shrink-0 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#001299] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs font-extrabold text-[#0a192f] tracking-tight font-heading truncate">
                Composition Panel
              </h2>
              <span
                className="text-[10px] text-slate-400 font-mono block truncate"
                title={activeDraft ? activeDraft.name : undefined}
              >
                {activeDraft ? activeDraft.name : "Belum Ada Formula"}
              </span>
            </div>
          </div>

          {ingredients.length > 0 && (
            <span className="shrink-0 px-2.5 py-1 rounded-xl bg-white border border-slate-200/90 text-slate-600 font-mono text-[10px] font-bold shadow-2xs">
              {ingredients.length} Bahan
            </span>
          )}
        </div>

        {/* Mini Phase Ratio Pill Bar */}
        <div className="flex items-center justify-between text-[10px] bg-white p-2 rounded-xl border border-slate-200/70 font-mono shadow-2xs">
          <span className="text-amber-700 font-bold">A: {phaseBreakdown.A}%</span>
          <span className="text-slate-300">|</span>
          <span className="text-blue-700 font-bold">B: {phaseBreakdown.B}%</span>
          <span className="text-slate-300">|</span>
          <span className="text-indigo-700 font-bold">C: {phaseBreakdown.C}%</span>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-700 font-bold">D: {phaseBreakdown.D}%</span>
        </div>
      </div>

      {/* Ingredient Items by Phase or Empty State */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {!activeDraft || ingredients.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="relative w-40 h-36 mb-1">
              <Image
                src="/images/landing/No%20Content.png"
                alt="Belum Ada Komposisi"
                fill
                sizes="160px"
                className="object-contain"
                priority={false}
              />
            </div>
            <h3 className="text-sm font-bold text-[#0a192f] font-heading">Belum Ada Komposisi</h3>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Pilih bahan baku dari panel <strong>Library Bahan</strong> di kiri atau buat formula baru untuk menyusun sediaan kosmetik Anda.
            </p>
          </div>
        ) : (
          (["A", "B", "C", "D"] as const).map((phaseKey) => {
            const items = phases[phaseKey];
            if (items.length === 0) return null;

            return (
              <div key={phaseKey} className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider font-heading">
                    {getPhaseName(phaseKey)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-bold">
                    {phaseBreakdown[phaseKey]}%
                  </span>
                </div>

                <div className="space-y-2">
                  {items.map((ing) => {
                    const isSelected = selectedMoleculeIngredient?.id === ing.id;
                    const minVal = 0.05;
                    const maxVal = ing.role === "solvent" ? 95 : Math.max(25, Math.ceil(ing.weightPct));
                    const pct = Math.min(100, Math.max(0, ((ing.weightPct - minVal) / (maxVal - minVal)) * 100));

                    return (
                      <div
                        key={ing.id}
                        onClick={() => handleSelectIngredient(ing)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                          isSelected
                            ? "border-[#001299] bg-blue-50/50 shadow-xs ring-1 ring-[#001299]/30"
                            : "border-slate-200/80 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${getPhaseColor(ing.phase)}`}>
                                {ing.phase}
                              </span>
                              <span className="text-xs font-bold text-slate-900 truncate block">
                                {ing.name}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono block truncate mt-0.5">
                              {ing.inci}
                            </span>
                          </div>

                          {/* Weight Badge & Controls */}
                          <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <span className="text-xs font-mono font-extrabold text-[#001299] bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200/60">
                              {ing.weightPct.toFixed(1)}%
                            </span>

                            <button
                              type="button"
                              onClick={() => toggleLockIngredient(ing.id)}
                              className={`p-1 rounded-md transition-colors ${
                                ing.isLocked ? "bg-amber-100 text-amber-800" : "text-slate-300 hover:text-slate-600"
                              }`}
                              title={ing.isLocked ? "Terkunci (tidak terpengaruh auto-balance)" : "Kunci bobot"}
                            >
                              {ing.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                            </button>

                            <button
                              type="button"
                              onClick={() => removeIngredient(ing.id)}
                              className="p-1 rounded-md text-slate-300 hover:text-rose-600 transition-colors"
                              title="Hapus bahan"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Weight Slider */}
                        <div className="pt-2 pb-0.5" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="range"
                            min={minVal}
                            max={maxVal}
                            step="0.05"
                            value={ing.weightPct}
                            disabled={ing.isLocked}
                            onChange={(e) => updateIngredientWeight(ing.id, parseFloat(e.target.value))}
                            className="paragon-range-slider disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{
                              background: `linear-gradient(to right, #001299 0%, #001299 ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-100 bg-slate-50 text-[10px] text-slate-400 flex items-center justify-between shrink-0">
        <span className="flex items-center gap-1">
          <Atom className="w-3 h-3 text-[#001299]" />
          <span>Klik bahan untuk inspect 3D</span>
        </span>
        <span
          className={`flex items-center gap-1 font-bold font-mono ${
            Math.abs(totalWeight - 100) < 0.1 ? "text-emerald-700" : "text-amber-700"
          }`}
        >
          {Math.abs(totalWeight - 100) < 0.1 ? (
            <>
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>Auto-Rebalanced 100%</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
              <span>Total: {totalWeight.toFixed(1)}%</span>
            </>
          )}
        </span>
      </div>
    </div>
  );
};