"use client";

import React from "react";
import { RheologyPoint } from "@/domain/models/simulation";
import { Activity, Gauge } from "lucide-react";

interface RheologyViscosityCardProps {
  viscosityMpaS: number;
  targetViscosityMpaS: number;
  temperatureC: number;
  rheologyCurve: RheologyPoint[];
}

export const RheologyViscosityCard: React.FC<RheologyViscosityCardProps> = ({
  viscosityMpaS,
  targetViscosityMpaS,
  temperatureC,
  rheologyCurve,
}) => {
  const deltaVisc = viscosityMpaS - targetViscosityMpaS;
  const isOptimal = Math.abs(deltaVisc) <= 1200;

  return (
    <div className="relative overflow-hidden shimmer-card p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Dynamic Viscosity (Brookfield In-Silico)
          </span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-extrabold text-[#0a192f] font-heading">
              {viscosityMpaS.toLocaleString()}
              <span className="text-sm font-semibold text-slate-500 ml-1">mPa·s</span>
            </span>
            <span className="text-xs text-slate-500">
              (@ 20 RPM / {temperatureC}°C)
            </span>
          </div>
        </div>

        <div
          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
            isOptimal
              ? "bg-blue-50 text-blue-800 border-blue-200"
              : "bg-amber-50 text-amber-800 border-amber-200"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>{isOptimal ? "Optimal Skin Feel" : "Viscosity Drift"}</span>
        </div>
      </div>

      {/* Mini Flow Curve Display */}
      <div className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/60 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
          <span>Shear-Thinning Pseudoplasticity:</span>
          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
            Intact Flow Index (n &lt; 0.5)
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
          {rheologyCurve.slice(1, 5).map((pt) => (
            <div
              key={pt.shearRateS1}
              className="p-1.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs"
            >
              <div className="text-slate-400 font-mono">
                {pt.shearRateS1} s⁻¹
              </div>
              <div className="font-bold text-slate-800 font-mono">
                {pt.viscosityMpaS.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Target Ideal Kategori Gel-Cream:</span>
        <span className="font-semibold text-slate-700">
          4.000 – 7.000 mPa·s
        </span>
      </div>
    </div>
  );
};
