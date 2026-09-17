"use client";

import React, { useMemo } from "react";
import { useEditor } from "@/contexts/EditorContext";
import { EditorIngredient } from "@/domain/models/editor";
import {
  Sliders,
  Lock,
  Unlock,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  Atom,
  FlaskConical,
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
    createNewDraft,
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

  const handleStepWeight = (ingId: string, currentWeight: number, delta: number, maxVal: number) => {
    const newVal = Math.min(maxVal, Math.max(0.05, Number((currentWeight + delta).toFixed(2))));
    updateIngredientWeight(ingId, newVal);
  };

  const getPhaseMeta = (p: "A" | "B" | "C" | "D") => {
    switch (p) {
      case "A":
        return {
          title: "Fase A",
          desc: "Fase Minyak / Lipofilik",
          badgeBg: "bg-amber-500 text-white",
          borderLeft: "border-l-amber-500",
          colorHex: "#d97706",
          accentLight: "bg-amber-50 text-amber-900 border-amber-200",
          barColor: "bg-amber-500",
        };
      case "B":
        return {
          title: "Fase B",
          desc: "Fase Air / Hidrofilik",
          badgeBg: "bg-blue-600 text-white",
          borderLeft: "border-l-blue-600",
          colorHex: "#2563eb",
          accentLight: "bg-blue-50 text-blue-900 border-blue-200",
          barColor: "bg-blue-600",
        };
      case "C":
        return {
          title: "Fase C",
          desc: "Emulgator & Surfaktan",
          badgeBg: "bg-indigo-600 text-white",
          borderLeft: "border-l-indigo-600",
          colorHex: "#4f46e5",
          accentLight: "bg-indigo-50 text-indigo-900 border-indigo-200",
          barColor: "bg-indigo-600",
        };
      case "D":
        return {
          title: "Fase D",
          desc: "Bahan Aktif & Aditif",
          badgeBg: "bg-emerald-600 text-white",
          borderLeft: "border-l-emerald-600",
          colorHex: "#059669",
          accentLight: "bg-emerald-50 text-emerald-900 border-emerald-200",
          barColor: "bg-emerald-600",
        };
    }
  };

  const isBalanced = Math.abs(totalWeight - 100) < 0.1 && ingredients.length > 0;

  return (
    <div className="flex flex-col h-full bg-slate-50/50 font-sans select-none">
      {/* Sidebar Header */}
      <div className="p-3.5 border-b border-slate-200/80 bg-white shrink-0 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#001299] text-white shadow-2xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs font-extrabold text-[#0a192f] tracking-tight font-heading">
                  Composition Panel
                </h2>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 uppercase tracking-wider">
                  Sidebar
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono block truncate max-w-[150px]">
                {activeDraft ? activeDraft.name : "Belum Ada Formula"}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Formula
            </span>
            <div className="flex items-center gap-1 font-mono font-extrabold text-xs">
              <span className={isBalanced ? "text-emerald-700" : "text-amber-600"}>
                {totalWeight.toFixed(1)}%
              </span>
              {isBalanced ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-amber-500 inline" />
              )}
            </div>
          </div>
        </div>

        {/* 4-Phase Multi-Segment Ratio Bar */}
        <div className="space-y-1.5">
          <div className="h-2 w-full rounded-full overflow-hidden flex bg-slate-100 border border-slate-200/60 p-0.5 shadow-2xs">
            <div
              className="bg-amber-500 h-full rounded-l-full transition-all duration-300"
              style={{ width: `${Math.min(100, phaseBreakdown.A)}%` }}
              title={`Fase A (Minyak): ${phaseBreakdown.A}%`}
            />
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, phaseBreakdown.B)}%` }}
              title={`Fase B (Air): ${phaseBreakdown.B}%`}
            />
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, phaseBreakdown.C)}%` }}
              title={`Fase C (Emulgator): ${phaseBreakdown.C}%`}
            />
            <div
              className="bg-emerald-600 h-full rounded-r-full transition-all duration-300"
              style={{ width: `${Math.min(100, phaseBreakdown.D)}%` }}
              title={`Fase D (Aktif): ${phaseBreakdown.D}%`}
            />
          </div>

          {/* Phase Ratio Pills */}
          <div className="grid grid-cols-4 gap-1 text-[9px] font-mono">
            <div className="px-1.5 py-0.5 rounded-md bg-amber-50 border border-amber-200/60 text-amber-900 text-center font-bold truncate">
              A: {phaseBreakdown.A}%
            </div>
            <div className="px-1.5 py-0.5 rounded-md bg-blue-50 border border-blue-200/60 text-blue-900 text-center font-bold truncate">
              B: {phaseBreakdown.B}%
            </div>
            <div className="px-1.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200/60 text-indigo-900 text-center font-bold truncate">
              C: {phaseBreakdown.C}%
            </div>
            <div className="px-1.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/60 text-emerald-900 text-center font-bold truncate">
              D: {phaseBreakdown.D}%
            </div>
          </div>
        </div>
      </div>

      {/* Ingredient Items by Phase or Empty State */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {!activeDraft || ingredients.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#001299] flex items-center justify-center border border-blue-100 mb-1 shadow-xs">
              <FlaskConical className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Belum Ada Komposisi</h3>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Pilih bahan baku dari panel <strong>Library Bahan</strong> di kiri untuk menyusun formula kosmetik Anda.
            </p>
            {!activeDraft && (
              <button
                type="button"
                onClick={() => createNewDraft()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#001299] hover:bg-[#000e7a] text-white transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Mulai Formula Baru</span>
              </button>
            )}
          </div>
        ) : (
          (["A", "B", "C", "D"] as const).map((phaseKey) => {
            const items = phases[phaseKey];
            if (items.length === 0) return null;
            const meta = getPhaseMeta(phaseKey);

            return (
              <div key={phaseKey} className="space-y-2">
                {/* Phase Section Header */}
                <div className="flex items-center justify-between px-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-4 h-4 rounded text-[9px] font-extrabold flex items-center justify-center ${meta.badgeBg}`}>
                      {phaseKey}
                    </span>
                    <span className="text-[11px] font-extrabold text-slate-800 tracking-tight font-heading">
                      {meta.desc}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200/70 text-slate-600 font-mono font-medium">
                      {items.length} bahan
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono font-bold">
                      {phaseBreakdown[phaseKey]}%
                    </span>
                  </div>
                </div>

                {/* Ingredient Cards */}
                <div className="space-y-2">
                  {items.map((ing) => {
                    const isSelected = selectedMoleculeIngredient?.id === ing.id;
                    const maxVal = ing.role === "solvent" ? 95 : 25;
                    const pct = Math.min(100, Math.max(0, (ing.weightPct / maxVal) * 100));

                    const trackBg = ing.isLocked
                      ? "#e2e8f0"
                      : `linear-gradient(to right, ${meta.colorHex} 0%, ${meta.colorHex} ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)`;

                    return (
                      <div
                        key={ing.id}
                        onClick={() => handleSelectIngredient(ing)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-2.5 bg-white ${
                          meta.borderLeft
                        } border-l-[3.5px] ${
                          isSelected
                            ? "border-r-[#001299] border-y-[#001299] shadow-xs ring-1 ring-[#001299]/30 bg-blue-50/20"
                            : "border-slate-200/90 hover:border-slate-300 hover:shadow-2xs"
                        }`}
                      >
                        {/* Card Top: Name & Badges */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900 truncate block">
                                {ing.name}
                              </span>
                              {isSelected && (
                                <span className="text-[8px] font-extrabold uppercase px-1 rounded bg-[#001299] text-white shrink-0">
                                  3D Aktif
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono block truncate mt-0.5">
                              {ing.inci}
                            </span>
                          </div>

                          {/* Weight Badge & Controls */}
                          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <span
                              className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded-lg border transition-colors ${
                                isSelected
                                  ? "bg-[#001299] text-white border-[#001299]"
                                  : "text-[#001299] bg-blue-50 border-blue-200/70"
                              }`}
                            >
                              {ing.weightPct.toFixed(1)}%
                            </span>

                            <button
                              type="button"
                              onClick={() => toggleLockIngredient(ing.id)}
                              className={`p-1 rounded-md transition-colors cursor-pointer ${
                                ing.isLocked
                                  ? "bg-amber-100 text-amber-800"
                                  : "text-slate-300 hover:text-slate-600 hover:bg-slate-100"
                              }`}
                              title={ing.isLocked ? "Terkunci (tidak berubah saat auto-balance)" : "Kunci bobot bahan"}
                            >
                              {ing.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                            </button>

                            <button
                              type="button"
                              onClick={() => removeIngredient(ing.id)}
                              className="p-1 rounded-md text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Hapus bahan dari formula"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Modern Range Slider Control with Precision Buttons */}
                        <div className="space-y-1" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              disabled={ing.isLocked || ing.weightPct <= 0.05}
                              onClick={() => handleStepWeight(ing.id, ing.weightPct, -0.1, maxVal)}
                              className="w-5 h-5 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer text-xs font-bold shrink-0 border border-transparent hover:border-slate-200"
                              title="Kurangi 0.1%"
                            >
                              <Minus className="w-3 h-3" />
                            </button>

                            <div className="flex-1 relative flex items-center">
                              <input
                                type="range"
                                min="0.05"
                                max={maxVal}
                                step="0.05"
                                value={ing.weightPct}
                                disabled={ing.isLocked}
                                style={
                                  {
                                    background: trackBg,
                                    "--slider-thumb-border": meta.colorHex,
                                  } as React.CSSProperties
                                }
                                onChange={(e) => updateIngredientWeight(ing.id, parseFloat(e.target.value))}
                                className="studio-slider w-full cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                              />
                            </div>

                            <button
                              type="button"
                              disabled={ing.isLocked || ing.weightPct >= maxVal}
                              onClick={() => handleStepWeight(ing.id, ing.weightPct, 0.1, maxVal)}
                              className="w-5 h-5 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer text-xs font-bold shrink-0 border border-transparent hover:border-slate-200"
                              title="Tambah 0.1%"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Range Boundary Labels */}
                          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 px-6">
                            <span>0.05%</span>
                            <span>{maxVal}%</span>
                          </div>
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

      {/* Sidebar Footer Toolbar */}
      <div className="p-3 border-t border-slate-200/80 bg-white text-[10px] text-slate-500 flex items-center justify-between shrink-0 shadow-2xs">
        <button
          type="button"
          onClick={() => setLeftPanelMode("library")}
          className="inline-flex items-center gap-1 font-semibold text-[#001299] hover:text-[#000e7a] transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Bahan Baku</span>
        </button>

        <span className="flex items-center gap-1 font-mono text-[9px] text-slate-400">
          <Atom className="w-3 h-3 text-[#001299]" />
          <span>Klik kartu untuk 3D Molecule</span>
        </span>
      </div>
    </div>
  );
};