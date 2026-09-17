"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useCompliance } from "@/hooks/useCompliance";
import { ComplianceSummaryCard } from "@/components/compliance/ComplianceSummaryCard";
import { IngredientAuditTable } from "@/components/compliance/IngredientAuditTable";
import { AiRegulatoryReasoningCard } from "@/components/compliance/AiRegulatoryReasoningCard";
import {
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { DelayedInfoTooltip } from "@/components/DelayedInfoTooltip";
import { ShimmerSkeleton } from "@/components/ShimmerWidget";
import { EmptyState } from "@/components/EmptyState";

export default function CompliancePage() {
  const {
    presets,
    selectedPresetId,
    selectPresetAndAudit,
    report,
    isLoadingAudit,
  } = useCompliance();

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col font-sans">
      <Navbar brandName="Paragon Studio" />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 w-full py-6 space-y-6">
        {/* Top Header Banner */}
        <div className="border-b border-slate-200/80 pb-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0a192f] tracking-tight font-heading">
              Enterprise BPOM, Halal HAS 23000 &amp; TKDN Sentinel
            </h1>
            <DelayedInfoTooltip
              content="Audit forensik regulasi otomatis: penarikan pasal hukum Perka BPOM No. 17/2022 via Vector RAG, verifikasi titik kritis halal, dan rekomendasi substitusi bahan hayati lokal."
              delayMs={300}
              position="right"
            />
          </div>
        </div>

        {/* Formula Selector Bar */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <span className="text-xs font-bold text-slate-700 block">
              Pilih Formula Uji:
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {presets.map((p) => {
              const isSelected = selectedPresetId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => selectPresetAndAudit(p.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap ${
                    isSelected
                      ? "bg-[#001299] text-white border-[#001299] font-semibold shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Shimmering Skeleton Loading State */}
        {isLoadingAudit && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Shimmer Summary Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3">
                  <ShimmerSkeleton className="w-11 h-11 rounded-2xl" />
                  <ShimmerSkeleton className="w-64 h-6 rounded-xl" />
                </div>
                <ShimmerSkeleton className="w-48 h-10 rounded-2xl" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <ShimmerSkeleton className="h-24 rounded-2xl" />
                <ShimmerSkeleton className="h-24 rounded-2xl" />
                <ShimmerSkeleton className="h-24 rounded-2xl" />
              </div>
            </div>

            {/* Shimmer 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                <ShimmerSkeleton className="w-48 h-5 rounded-lg" />
                <ShimmerSkeleton className="w-full h-14 rounded-2xl" />
                <ShimmerSkeleton className="w-full h-14 rounded-2xl" />
                <ShimmerSkeleton className="w-full h-14 rounded-2xl" />
                <ShimmerSkeleton className="w-full h-14 rounded-2xl" />
              </div>
              <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                <ShimmerSkeleton className="w-40 h-5 rounded-lg" />
                <ShimmerSkeleton className="w-full h-24 rounded-2xl" />
                <ShimmerSkeleton className="w-full h-32 rounded-2xl" />
              </div>
            </div>
          </div>
        )}

        {/* FULL AUDIT REPORT */}
        {!isLoadingAudit && report && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* 1. Summary Card */}
            <ComplianceSummaryCard report={report} />

            {/* 2-Column: Ingredients Table vs AI Reasoning */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column (7 Cols): Forensik Bahan Table with RAG Drawer */}
              <div className="lg:col-span-7 space-y-6">
                <IngredientAuditTable ingredients={report.ingredientsAudit} />
              </div>

              {/* Right Column (5 Cols): AI Regulatory Reasoning & TKDN Booster */}
              <div className="lg:col-span-5 space-y-6">
                <AiRegulatoryReasoningCard reasoning={report.llmReasoning} />

                {/* Handshake CTA to Simulator */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-[#001299] text-white shadow-sm space-y-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-blue-200 uppercase tracking-wider block">
                      Formula Lolos Regulasi
                    </span>
                    <h4 className="text-sm font-bold">Lanjutkan Uji Stabilitas Oven 40°C</h4>
                    <p className="text-xs text-blue-100/80 leading-relaxed">
                      Komposisi formula telah diverifikasi aman. Lakukan simulasi in-silico 90 hari untuk menguji kestabilan fisik emulsi.
                    </p>
                  </div>

                  <Link
                    href="/workbench?step=3"
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white text-[#001299] hover:bg-blue-50 text-xs font-bold transition-all"
                  >
                    <span>Uji Kestabilan 40°C</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EMPTY STATE: no audit selected yet */}
        {!isLoadingAudit && !report && (
          <EmptyState
            title="Belum Ada Hasil Audit Regulasi"
            description="Pilih formula uji di atas untuk menampilkan audit forensik BPOM, Halal HAS 23000, dan skor TKDN."
          />
        )}
      </main>
    </div>
  );
}
