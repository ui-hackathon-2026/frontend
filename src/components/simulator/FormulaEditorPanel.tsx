"use client";

import React, { useState, useMemo } from "react";
import {
  IngredientInput,
} from "@/domain/models/simulation";
import {
  Sliders,
  Plus,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { AddIngredientSidebar } from "./AddIngredientSidebar";

interface FormulaEditorPanelProps {
  formulaName: string;
  ingredients: IngredientInput[];
  totalWeight: number;
  onUpdateWeight: (id: string, weight: number) => void;
  onAddIngredient: (ingredient: IngredientInput) => void;
  onRemoveIngredient: (id: string) => void;
  onProceedToConfig: () => void;
}

export const FormulaEditorPanel: React.FC<FormulaEditorPanelProps> = ({
  formulaName,
  ingredients,
  totalWeight,
  onUpdateWeight,
  onAddIngredient,
  onRemoveIngredient,
  onProceedToConfig,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const isBalanced = Math.abs(totalWeight - 100.0) <= 0.1;

  // Silent Magnetic Snap to 100% when close
  const handleWeightChange = (id: string, rawVal: number) => {
    const ing = ingredients.find((i) => i.id === id);
    if (!ing) return;
    const maxVal = ing.role === "solvent" ? 90 : 25;
    const clamped = Math.max(0, Math.min(maxVal, Math.round(rawVal * 100) / 100));

    // Calculate sum of all other ingredients
    const otherTotal = ingredients.reduce(
      (sum, item) => (item.id === id ? sum : sum + item.weightPct),
      0
    );
    const snapWeight = Math.round((100.0 - otherTotal) * 100) / 100;

    let finalWeight = clamped;

    // Silently snap if candidate weight is within ±0.45% of 100.0% equilibrium
    if (
      snapWeight >= 0 &&
      snapWeight <= maxVal &&
      Math.abs(clamped - snapWeight) <= 0.45
    ) {
      finalWeight = snapWeight;
    }

    onUpdateWeight(id, finalWeight);
  };

  // Sort ingredients strictly by Phase order (A -> B -> C -> D)
  const sortedIngredients = useMemo(() => {
    const phaseOrder: Record<string, number> = { A: 1, B: 2, C: 3, D: 4 };
    return [...ingredients].sort((a, b) => {
      const orderA = phaseOrder[a.phase] ?? 99;
      const orderB = phaseOrder[b.phase] ?? 99;
      if (orderA !== orderB) return orderA - orderB;
      return a.name.localeCompare(b.name);
    });
  }, [ingredients]);

  const phaseColors: Record<string, { badge: string; border: string }> = {
    A: { badge: "bg-amber-100 text-amber-800", border: "border-l-amber-400" },
    B: { badge: "bg-blue-100 text-blue-800", border: "border-l-blue-400" },
    C: { badge: "bg-emerald-100 text-emerald-800", border: "border-l-emerald-400" },
    D: { badge: "bg-purple-100 text-purple-800", border: "border-l-purple-400" },
  };

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3.5">
      {/* Formula Parameter Controls Header */}
      <div className="border-b border-slate-100 pb-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
          Formula Parameter Controls
        </span>
      </div>

      {/* Interactive Ingredient List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          <span>Komposisi Bahan Aktif &amp; Eksipien</span>
          <span>Bobot (%)</span>
        </div>

        <div className="space-y-1.5 max-h-[250px] overflow-y-auto pr-1">
          {sortedIngredients.map((ing, index) => {
            const style = phaseColors[ing.phase] || phaseColors.B;
            const isConfirming = confirmDeleteId === ing.id;
            const maxVal = ing.role === "solvent" ? 90 : 25;

            return (
              <div
                key={ing.id}
                className={`p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all border-l-4 ${style.border} space-y-1`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md whitespace-nowrap shrink-0 leading-none ${style.badge}`}
                    >
                      Fase {ing.phase}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-900 leading-tight truncate">
                        {ing.name}
                      </h4>
                      <p className="text-[10px] font-mono text-slate-400 truncate">
                        {ing.inci}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    {/* Precise Number Input Field */}
                    <div className="flex items-center bg-slate-50 border border-slate-200/90 rounded-lg px-1.5 py-0.5 focus-within:ring-1.5 focus-within:ring-[#0018a8] focus-within:border-[#0018a8] focus-within:bg-white transition-all shadow-2xs">
                      <input
                        type="number"
                        min="0"
                        max={maxVal}
                        step="0.05"
                        value={ing.weightPct}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          handleWeightChange(ing.id, isNaN(val) ? 0 : val);
                        }}
                        className="w-12 text-xs font-mono font-bold text-slate-900 text-right bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-[10px] font-mono text-slate-400 pl-0.5">%</span>
                    </div>

                    {/* Reddish Trash Button with Confirmation Popover */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setConfirmDeleteId(isConfirming ? null : ing.id)
                        }
                        title={`Hapus ${ing.name}`}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isConfirming
                            ? "bg-rose-600 text-white border-rose-600 ring-2 ring-rose-200 shadow-xs"
                            : "text-rose-500 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 border-rose-200/80 shadow-2xs"
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Small Confirmation Modal / Popover */}
                      {isConfirming && (
                        <>
                          <div
                            className="fixed inset-0 z-20 cursor-default"
                            onClick={() => setConfirmDeleteId(null)}
                          />
                          <div
                            className={`absolute right-0 z-30 w-44 p-2.5 rounded-xl bg-white border border-slate-200 shadow-xl text-xs space-y-2 animate-in fade-in zoom-in-95 duration-150 ${
                              index >= sortedIngredients.length - 2
                                ? "bottom-full mb-1.5 origin-bottom-right"
                                : "top-full mt-1.5 origin-top-right"
                            }`}
                          >
                            <div className="space-y-0.5 text-left">
                              <p className="font-bold text-slate-900 leading-tight">
                                Hapus bahan ini?
                              </p>
                              <p className="text-[10px] text-slate-500 truncate">
                                {ing.name}
                              </p>
                            </div>
                            <div className="flex items-center space-x-1.5 pt-0.5">
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="flex-1 py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors cursor-pointer text-center"
                              >
                                Batal
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  onRemoveIngredient(ing.id);
                                  setConfirmDeleteId(null);
                                }}
                                className="flex-1 py-1 px-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px] shadow-2xs transition-colors cursor-pointer text-center"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Clean Slider for interactive adjustments */}
                <div className="flex items-center space-x-2.5 pt-0.5">
                  <input
                    type="range"
                    min="0"
                    max={maxVal}
                    step="0.1"
                    value={ing.weightPct}
                    onChange={(e) =>
                      handleWeightChange(ing.id, parseFloat(e.target.value))
                    }
                    className="flex-1 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#0018a8]"
                  />
                  <span className="text-[10px] text-slate-400 font-mono w-14 text-right truncate">
                    {ing.role}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Ingredient Button */}
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="w-full py-2 px-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-[#0018a8] hover:bg-blue-50/40 text-slate-600 hover:text-[#0018a8] text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Bahan Baru dari Katalog</span>
        </button>
      </div>

      {/* Proceed to Configuration Button */}
      <div className="pt-1">
        <button
          type="button"
          onClick={onProceedToConfig}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl font-semibold text-xs bg-[#001299] hover:bg-[#000e7a] text-white shadow-xs transition-all cursor-pointer"
        >
          <span>Lanjut ke Konfigurasi Parameter Uji</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Slide-over Sidebar Drawer */}
      <AddIngredientSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentIngredients={ingredients}
        onAddIngredient={onAddIngredient}
      />
    </div>
  );
};
