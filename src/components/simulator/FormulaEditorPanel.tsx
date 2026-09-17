"use client";

import React from "react";
import {
  IngredientInput,
  SimulationEngineType,
} from "@/domain/models/simulation";
import {
  Sliders,
  Play,
  RotateCcw,
  Thermometer,
  Calendar,
  Cpu,
  Layers,
  Info,
} from "lucide-react";
import { DelayedInfoTooltip } from "@/components/DelayedInfoTooltip";

interface FormulaEditorPanelProps {
  formulaName: string;
  ingredients: IngredientInput[];
  temperatureC: number;
  durationDays: number;
  engine: SimulationEngineType;
  totalWeight: number;
  isLoading: boolean;
  onUpdateWeight: (id: string, weight: number) => void;
  onUpdateTemperature: (temp: number) => void;
  onUpdateDuration: (days: number) => void;
  onUpdateEngine: (engine: SimulationEngineType) => void;
  onRunSimulation: () => void;
}

export const FormulaEditorPanel: React.FC<FormulaEditorPanelProps> = ({
  formulaName,
  ingredients,
  temperatureC,
  durationDays,
  engine,
  totalWeight,
  isLoading,
  onUpdateWeight,
  onUpdateTemperature,
  onUpdateDuration,
  onUpdateEngine,
  onRunSimulation,
}) => {
  const isBalanced = Math.abs(totalWeight - 100.0) <= 0.1;

  const phaseColors: Record<string, { badge: string; border: string }> = {
    A: { badge: "bg-amber-100 text-amber-800", border: "border-l-amber-400" },
    B: { badge: "bg-blue-100 text-blue-800", border: "border-l-blue-400" },
    C: { badge: "bg-emerald-100 text-emerald-800", border: "border-l-emerald-400" },
    D: { badge: "bg-purple-100 text-purple-800", border: "border-l-purple-400" },
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
      {/* Formula Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Formula Parameter Controls
          </span>
          <h2 className="text-xl font-bold text-[#0a192f] font-heading mt-0.5">
            {formulaName}
          </h2>
        </div>

        {/* Total Weight Indicator - Revealed on 1-second hover */}
        <div className="flex items-center">
          <DelayedInfoTooltip
            content={`Σ Total: ${totalWeight.toFixed(1)}% ${isBalanced ? "(Balanced)" : "(Unbalanced)"}`}
            delayMs={1000}
            position="left"
          />
        </div>
      </div>

      {/* Environmental & Engine Conditions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#f8fafc] border border-slate-200/80 text-xs">
        {/* Temperature Toggle */}
        <div className="space-y-1.5">
          <label className="flex items-center space-x-1.5 font-bold text-slate-700">
            <Thermometer className="w-3.5 h-3.5 text-blue-600" />
            <span>Incubator Temp:</span>
          </label>
          <div className="flex rounded-xl bg-white border border-slate-200 p-0.5">
            {[25, 40, 50].map((temp) => (
              <button
                key={temp}
                type="button"
                onClick={() => onUpdateTemperature(temp)}
                className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-all ${
                  temperatureC === temp
                    ? "bg-[#0018a8] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {temp}°C
              </button>
            ))}
          </div>
        </div>

        {/* Duration Days */}
        <div className="space-y-1.5">
          <label className="flex items-center space-x-1.5 font-bold text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Simulated Period:</span>
          </label>
          <div className="flex rounded-xl bg-white border border-slate-200 p-0.5">
            {[30, 60, 90].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => onUpdateDuration(days)}
                className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-all ${
                  durationDays === days
                    ? "bg-[#0018a8] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {days} Hari
              </button>
            ))}
          </div>
        </div>

        {/* Engine Type */}
        <div className="space-y-1.5">
          <label className="flex items-center space-x-1.5 font-bold text-slate-700">
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Model Engine:</span>
          </label>
          <div className="flex rounded-xl bg-white border border-slate-200 p-0.5">
            <button
              type="button"
              onClick={() => onUpdateEngine("LIGHTGBM_GPU")}
              className={`flex-1 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                engine === "LIGHTGBM_GPU"
                  ? "bg-[#0018a8] text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              LightGBM (&lt;1ms)
            </button>
            <button
              type="button"
              onClick={() => onUpdateEngine("DEEP_COLLOID_GNN")}
              className={`flex-1 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                engine === "DEEP_COLLOID_GNN"
                  ? "bg-[#0018a8] text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Colloid GNN
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Ingredient List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span>Komposisi Bahan Aktif &amp; Eksipien</span>
          <span>Bobot (%)</span>
        </div>

        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {ingredients.map((ing) => {
            const style = phaseColors[ing.phase] || phaseColors.B;
            return (
              <div
                key={ing.id}
                className={`p-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all border-l-4 ${style.border} space-y-2`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${style.badge}`}
                    >
                      Fase {ing.phase}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {ing.name}
                      </h4>
                      <p className="text-[10px] font-mono text-slate-400">
                        {ing.inci}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-slate-800 w-12 text-right">
                      {ing.weightPct.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Slider for interactive adjustments */}
                <div className="flex items-center space-x-3 pt-0.5">
                  <input
                    type="range"
                    min="0"
                    max={ing.role === "solvent" ? "90" : "15"}
                    step="0.1"
                    value={ing.weightPct}
                    onChange={(e) =>
                      onUpdateWeight(ing.id, parseFloat(e.target.value))
                    }
                    className="flex-1 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#0018a8]"
                  />
                  <span className="text-[10px] text-slate-400 font-mono w-14 text-right">
                    {ing.role}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Big Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onRunSimulation}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2.5 py-3.5 px-6 rounded-2xl font-semibold text-sm bg-[#001299] hover:bg-[#000e7a] text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Menghitung Stabilitas Fisikokimia In-Silico...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>
                Simulate 40°C Stability ({temperatureC}°C, {durationDays} Hari)
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
