"use client";

import React from "react";
import {
  ParetoObjectiveWeights,
  ParetoConstraints,
} from "@/domain/models/optimizer";
import { Sparkles } from "lucide-react";

interface ParetoObjectivesCardProps {
  weights: ParetoObjectiveWeights;
  onUpdateWeight: <K extends keyof ParetoObjectiveWeights>(key: K, val: number) => void;
  constraints: ParetoConstraints;
  onUpdateConstraint: <K extends keyof ParetoConstraints>(key: K, val: number) => void;
  isOptimizing: boolean;
  onRunOptimization: () => void;
}

export const ParetoObjectivesCard: React.FC<ParetoObjectivesCardProps> = ({
  weights,
  onUpdateWeight,
  constraints,
  onUpdateConstraint,
  isOptimizing,
  onRunOptimization,
}) => {
  const cogsPct = Math.round(((constraints.maxCogsIdrPerKg - 20000) / (60000 - 20000)) * 100);
  const stabPct = Math.round(((constraints.minStabilityPct - 75) / (95 - 75)) * 100);
  const tkdnPct = Math.round(((constraints.minTkdnPct - 30) / (70 - 30)) * 100);
  const viscPct = Math.round(((constraints.targetViscosityMpaS - 1500) / (15000 - 1500)) * 100);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">

      {/* 4 Constraint Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
        {/* Slider 1: COGS Ceiling */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Plafon Maksimum Biaya (COGS)
            </label>
            <span className="text-xs font-mono font-bold text-[#001299] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
              Rp {constraints.maxCogsIdrPerKg.toLocaleString("id-ID")} / kg
            </span>
          </div>

          <div className="py-1">
            <input
              type="range"
              min="20000"
              max="60000"
              step="1000"
              value={constraints.maxCogsIdrPerKg}
              onChange={(e) => onUpdateConstraint("maxCogsIdrPerKg", parseInt(e.target.value))}
              className="paragon-range-slider"
              style={{
                background: `linear-gradient(to right, #001299 0%, #001299 ${cogsPct}%, #e2e8f0 ${cogsPct}%, #e2e8f0 100%)`,
              }}
            />
          </div>

          <div className="flex justify-between pt-0.5">
            <div className="text-left">
              <span className="block text-xs font-mono font-bold text-slate-800">Rp 20.000</span>
              <span className="block text-[11px] font-semibold text-slate-500">Ekonomis</span>
            </div>
            <div className="text-center">
              <span className="block text-xs font-mono font-bold text-slate-800">Rp 40.000</span>
              <span className="block text-[11px] font-semibold text-slate-500">Standar Wardah</span>
            </div>
            <div className="text-right">
              <span className="block text-xs font-mono font-bold text-slate-800">Rp 60.000</span>
              <span className="block text-[11px] font-semibold text-slate-500">Premium Pro</span>
            </div>
          </div>
        </div>

        {/* Slider 2: Min Stability */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Batas Minimum Stabilitas 40°C
            </label>
            <span className="text-xs font-mono font-bold text-[#001299] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
              {constraints.minStabilityPct}%
            </span>
          </div>

          <div className="py-1">
            <input
              type="range"
              min="75"
              max="95"
              step="1"
              value={constraints.minStabilityPct}
              onChange={(e) => onUpdateConstraint("minStabilityPct", parseInt(e.target.value))}
              className="paragon-range-slider"
              style={{
                background: `linear-gradient(to right, #001299 0%, #001299 ${stabPct}%, #e2e8f0 ${stabPct}%, #e2e8f0 100%)`,
              }}
            />
          </div>

          <div className="flex justify-between pt-0.5">
            <div className="text-left">
              <span className="block text-xs font-mono font-bold text-slate-800">75%</span>
              <span className="block text-[11px] font-semibold text-slate-500">Toleransi Luas</span>
            </div>
            <div className="text-center">
              <span className="block text-xs font-mono font-bold text-slate-800">85%</span>
              <span className="block text-[11px] font-semibold text-slate-500">Ambang Kelulusan</span>
            </div>
            <div className="text-right">
              <span className="block text-xs font-mono font-bold text-slate-800">95%</span>
              <span className="block text-[11px] font-semibold text-slate-500">Ultra-Stabil</span>
            </div>
          </div>
        </div>

        {/* Slider 3: Min TKDN */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Ambang Kandungan Lokal (TKDN)
            </label>
            <span className="text-xs font-mono font-bold text-[#001299] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
              ≥ {constraints.minTkdnPct}%
            </span>
          </div>

          <div className="py-1">
            <input
              type="range"
              min="30"
              max="70"
              step="5"
              value={constraints.minTkdnPct}
              onChange={(e) => onUpdateConstraint("minTkdnPct", parseInt(e.target.value))}
              className="paragon-range-slider"
              style={{
                background: `linear-gradient(to right, #001299 0%, #001299 ${tkdnPct}%, #e2e8f0 ${tkdnPct}%, #e2e8f0 100%)`,
              }}
            />
          </div>

          <div className="flex justify-between pt-0.5">
            <div className="text-left">
              <span className="block text-xs font-mono font-bold text-slate-800">30%</span>
              <span className="block text-[11px] font-semibold text-slate-500">Minimal</span>
            </div>
            <div className="text-center">
              <span className="block text-xs font-mono font-bold text-slate-800">40%</span>
              <span className="block text-[11px] font-semibold text-slate-500">Regulasi Target</span>
            </div>
            <div className="text-right">
              <span className="block text-xs font-mono font-bold text-slate-800">70%</span>
              <span className="block text-[11px] font-semibold text-slate-500">Super Hayati</span>
            </div>
          </div>
        </div>

        {/* Slider 4: Target Viscosity */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Profil Sasaran Viskositas
            </label>
            <span className="text-xs font-mono font-bold text-[#001299] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
              {constraints.targetViscosityMpaS.toLocaleString("id-ID")} mPa·s
            </span>
          </div>

          <div className="py-1">
            <input
              type="range"
              min="1500"
              max="15000"
              step="250"
              value={constraints.targetViscosityMpaS}
              onChange={(e) => onUpdateConstraint("targetViscosityMpaS", parseInt(e.target.value))}
              className="paragon-range-slider"
              style={{
                background: `linear-gradient(to right, #001299 0%, #001299 ${viscPct}%, #e2e8f0 ${viscPct}%, #e2e8f0 100%)`,
              }}
            />
          </div>

          <div className="flex justify-between pt-0.5">
            <div className="text-left">
              <span className="block text-xs font-mono font-bold text-slate-800">1.500</span>
              <span className="block text-[11px] font-semibold text-slate-500">Serum</span>
            </div>
            <div className="text-center">
              <span className="block text-xs font-mono font-bold text-slate-800">5.500</span>
              <span className="block text-[11px] font-semibold text-slate-500">Gel-Cream</span>
            </div>
            <div className="text-right">
              <span className="block text-xs font-mono font-bold text-slate-800">15.000</span>
              <span className="block text-[11px] font-semibold text-slate-500">Thick Cream</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onRunOptimization}
          disabled={isOptimizing}
          className="w-full flex items-center justify-center space-x-2.5 py-4 px-6 rounded-2xl font-semibold text-sm bg-[#001299] hover:bg-[#000e7a] text-white shadow-xs transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isOptimizing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Mengevaluasi 50.000 Kombinasi Simpleks Massa (GPU NSGA-II)...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>Jalankan Optuna NSGA-II Optimizer (50.000 Trials)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
