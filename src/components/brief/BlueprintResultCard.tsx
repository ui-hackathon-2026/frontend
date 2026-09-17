"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Layers,
  FlaskConical,
} from "lucide-react";
import { FormulationBlueprint } from "@/domain/models/brief";
import { DelayedInfoTooltip } from "@/components/DelayedInfoTooltip";
import { EmptyState } from "@/components/EmptyState";

interface BlueprintResultCardProps {
  blueprint: FormulationBlueprint;
}

export const BlueprintResultCard: React.FC<BlueprintResultCardProps> = ({ blueprint }) => {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-200/80 shadow-xs space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-[#001299] uppercase tracking-wider block">
              Cetak Biru Arsitektur Formula
            </span>
            <DelayedInfoTooltip
              content="Cetak biru proporsi bahan 4-fase terstruktur yang siap ditransfer ke Formulation Canvas."
              delayMs={300}
              position="right"
            />
          </div>
          <h2 className="text-xl font-bold text-[#0a192f] font-heading mt-0.5">
            {blueprint.title}
          </h2>
          <span className="text-xs text-slate-500">
            Kategori: {blueprint.category} • Target Brand: {blueprint.brand}
          </span>
        </div>

        {/* Handshake CTA Button */}
        <Link
          href="/workbench"
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-[#001299] hover:bg-[#000e7a] text-white text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0"
        >
          <span>Transfer ke Formulation Canvas</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 4-Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Target Viskositas
          </span>
          <div className="text-base font-extrabold text-[#0a192f] font-mono">
            {blueprint.estimatedViscosityMpaS.toLocaleString("id-ID")}
            <span className="text-[10px] font-normal text-slate-500 ml-1">mPa·s</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Sistem HLB
          </span>
          <div className="text-base font-extrabold text-[#0a192f] font-mono">
            {blueprint.systemHlb.toFixed(1)}
            <span className="text-[10px] font-normal text-slate-500 ml-1">(O/W Lamellar)</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Estimasi COGS
          </span>
          <div className="text-base font-extrabold text-[#0a192f] font-mono">
            Rp {blueprint.estimatedCogsIdrPerKg.toLocaleString("id-ID")}
            <span className="text-[10px] font-normal text-slate-500 ml-1">/kg</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
            Kandungan TKDN
          </span>
          <div className="text-base font-extrabold text-emerald-900 font-mono">
            {blueprint.calculatedTkdnPct.toFixed(1)}%
            <span className="text-[10px] font-semibold text-emerald-700 ml-1">≥40% Target</span>
          </div>
        </div>
      </div>

      {/* Scientific Rationale */}
      <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 text-xs leading-relaxed text-slate-700 space-y-1">
        <span className="font-bold text-[#001299] block">Rasional Fisikokimia:</span>
        <p className="text-slate-600">{blueprint.scientificRationale}</p>
      </div>

      {/* 4-Phase Distribution Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#001299]" />
            <span>Alokasi Komposisi 4-Fase Sediaan</span>
          </h4>
          <span className="text-[11px] font-mono font-bold text-[#001299]">
            Total Bobot: 100.0% (Equilibrium)
          </span>
        </div>

        <div className="border border-slate-200/80 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
          {blueprint.ingredients.length === 0 ? (
            <EmptyState
              title="Komposisi Blueprint Kosong"
              description="Hasil sintesis tidak menghasilkan komposisi bahan. Coba sesuaikan target brief dan sintesis ulang."
              className="border-0 rounded-none"
            />
          ) : (
            blueprint.ingredients.map((ing) => (
            <div
              key={ing.id}
              className="p-3.5 bg-white hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-start space-x-3">
                <span
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    ing.phase === "A"
                      ? "bg-blue-100 text-[#001299]"
                      : ing.phase === "B"
                      ? "bg-amber-100 text-amber-900"
                      : ing.phase === "C"
                      ? "bg-purple-100 text-purple-900"
                      : "bg-emerald-100 text-emerald-900"
                  }`}
                >
                  {ing.phase}
                </span>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{ing.name}</span>
                    {ing.isLocalTkdn && (
                      <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                        Lokal TKDN
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono block">
                    INCI: {ing.inci} • {ing.functionDesc}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-mono font-bold text-sm text-slate-900">
                  {ing.weightPct.toFixed(2)}%
                </span>
              </div>
            </div>
          ))
          )}
        </div>
      </div>
    </div>
  );
};
