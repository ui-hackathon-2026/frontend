"use client";

import React, { useState } from "react";
import { WorkbenchIngredient } from "@/domain/models/workbench";
import { Lock, Unlock, Trash2, ShieldCheck, AlertCircle } from "lucide-react";

interface WorkbenchIngredientRowProps {
  ingredient: WorkbenchIngredient;
  onUpdateWeight: (id: string, weight: number) => void;
  onToggleLock: (id: string) => void;
  onRemove: (id: string) => void;
}

export const WorkbenchIngredientRow: React.FC<WorkbenchIngredientRowProps> = ({
  ingredient,
  onUpdateWeight,
  onToggleLock,
  onRemove,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const maxLimit = ingredient.role === "solvent" ? 95 : 30;

  // BPOM Guardrail Check
  const isOverBpomLimit =
    ingredient.bpomLimitPct !== undefined && ingredient.weightPct > ingredient.bpomLimitPct;

  return (
    <div
      className={`p-3 sm:p-3.5 rounded-2xl border transition-all ${
        ingredient.isLocked
          ? "bg-slate-50/70 border-slate-200 text-slate-700"
          : "bg-white border-slate-200/80 hover:border-slate-300 shadow-xs"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Left: Info */}
        <div className="flex items-start gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => onToggleLock(ingredient.id)}
            title={ingredient.isLocked ? "Terkunci (Pin)" : "Bebas (Klik untuk kunci)"}
            className={`mt-0.5 p-1.5 rounded-lg border transition-colors ${
              ingredient.isLocked
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600"
            }`}
          >
            {ingredient.isLocked ? (
              <Lock className="w-3.5 h-3.5" />
            ) : (
              <Unlock className="w-3.5 h-3.5" />
            )}
          </button>

          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-xs sm:text-sm text-[#0a192f] truncate">
                {ingredient.name}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {ingredient.inci}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span>Peran: <strong className="text-slate-700 capitalize">{ingredient.role}</strong></span>
              {ingredient.hlb !== undefined && (
                <span>HLB: <strong className="text-slate-700 font-mono">{ingredient.hlb}</strong></span>
              )}
              {ingredient.costPerKgIdr !== undefined && (
                <span>Rp {(ingredient.costPerKgIdr).toLocaleString("id-ID")}/kg</span>
              )}
              {isOverBpomLimit && (
                <span className="text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Max BPOM: {ingredient.bpomLimitPct}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Interactive Slider, Number Input, Trash */}
        <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
          <input
            type="range"
            min={0}
            max={maxLimit}
            step={0.05}
            disabled={ingredient.isLocked}
            value={ingredient.weightPct}
            onChange={(e) => onUpdateWeight(ingredient.id, parseFloat(e.target.value))}
            className={`w-24 sm:w-32 h-1.5 rounded-lg appearance-none cursor-pointer accent-[#001299] ${
              ingredient.isLocked ? "opacity-40 cursor-not-allowed" : "bg-slate-200"
            }`}
          />

          <div className="relative flex items-center">
            <input
              type="number"
              min={0}
              max={maxLimit}
              step={0.05}
              disabled={ingredient.isLocked}
              value={ingredient.weightPct}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onUpdateWeight(ingredient.id, isNaN(val) ? 0 : val);
              }}
              className={`w-20 text-right pr-6 pl-2 py-1 text-xs font-mono font-semibold rounded-lg border focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                ingredient.isLocked
                  ? "bg-slate-100/70 border-slate-200 text-slate-500 cursor-not-allowed"
                  : "bg-white border-slate-200 text-slate-900"
              }`}
            />
            <span className="absolute right-2 text-[11px] text-slate-400 font-mono pointer-events-none">
              %
            </span>
          </div>

          {/* Reddish Trash with Confirmation Popover */}
          <div className="relative">
            <button
              type="button"
              disabled={ingredient.isLocked}
              onClick={() => setConfirmDelete(!confirmDelete)}
              className={`p-1.5 rounded-lg border transition-colors ${
                ingredient.isLocked
                  ? "opacity-30 cursor-not-allowed border-slate-200 text-slate-400"
                  : "text-rose-500 bg-rose-50 border-rose-200/80 hover:bg-rose-100"
              }`}
              title="Hapus bahan"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {confirmDelete && (
              <div className="absolute right-0 top-full mt-1.5 z-20 w-44 p-2.5 bg-white rounded-xl shadow-lg border border-slate-200 text-[11px] space-y-2 animate-in fade-in zoom-in-95">
                <span className="text-slate-700 font-medium block">Hapus bahan ini?</span>
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="px-2 py-1 rounded-md text-slate-500 hover:bg-slate-100 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onRemove(ingredient.id);
                      setConfirmDelete(false);
                    }}
                    className="px-2 py-1 rounded-md bg-rose-600 text-white font-medium hover:bg-rose-700 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
