"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useCompliance } from "@/hooks/useCompliance";
import { ComplianceSummaryCard } from "@/components/compliance/ComplianceSummaryCard";
import { IngredientAuditTable } from "@/components/compliance/IngredientAuditTable";
import { AiRegulatoryReasoningCard } from "@/components/compliance/AiRegulatoryReasoningCard";
import { RagKnowledgeChat } from "@/components/compliance/RagKnowledgeChat";
import {
  ShieldCheck,
  ArrowRight,
  Bot,
  Sparkles,
} from "lucide-react";
import { DelayedInfoTooltip } from "@/components/DelayedInfoTooltip";
import { ShimmerSkeleton } from "@/components/ShimmerWidget";
import { EmptyState } from "@/components/EmptyState";

export default function CompliancePage() {
  const [activeView, setActiveView] = useState<"audit" | "rag_chat">("audit");
  const {
    presets,
    selectedPresetId,
    selectPresetAndAudit,
    report,
    isLoadingAudit,
    chatMessages,
    isLoadingChat,
    sendRagQuery,
  } = useCompliance();

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col font-sans">
      <Navbar brandName="CoRamu" />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 w-full py-6 space-y-6">
        {/* Top Header Banner */}
        <div className="border-b border-slate-200/80 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0a192f] tracking-tight font-heading">
              Enterprise BPOM, Halal HAS 23000 &amp; TKDN Sentinel
            </h1>
            <DelayedInfoTooltip
              content="Audit forensik regulasi otomatis: penarikan pasal hukum Peraturan BPOM No. 25 Tahun 2025 via Semantic Vector RAG, verifikasi titik kritis halal (KMA 1360/2021 & HAS 23000), dan rekomendasi substitusi bahan hayati lokal TKDN."
              delayMs={300}
              position="right"
            />
          </div>

          {/* Navigation View Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => setActiveView("audit")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === "audit"
                  ? "bg-white text-[#001299] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Audit Forensik Formula</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView("rag_chat")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === "rag_chat"
                  ? "bg-white text-[#001299] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-blue-600" />
              <span>Tanya Regulasi (Vector RAG)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live RAG Chunks" />
            </button>
          </div>
        </div>

        {/* 1. VIEW: RAG KNOWLEDGE CHAT */}
        {activeView === "rag_chat" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <RagKnowledgeChat
              messages={chatMessages}
              isLoading={isLoadingChat}
              onSendMessage={sendRagQuery}
            />
          </div>
        )}

        {/* 2. VIEW: AUDIT FORENSIK FORMULA */}
        {activeView === "audit" && (
          <div className="space-y-6">
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
                      className={`text-xs px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap cursor-pointer ${
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

                    {/* Quick Link to RAG Knowledge Chat */}
                    <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/70 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#001299] text-white flex items-center justify-center shrink-0">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#0a192f]">Ada Pertanyaan Regulasi?</p>
                          <p className="text-[11px] text-slate-500">Tanya langsung ke basis data Perka BPOM 25/2025 via RAG.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveView("rag_chat")}
                        className="px-3 py-1.5 rounded-xl bg-[#001299] text-white hover:bg-[#000e7a] text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                      >
                        Tanya RAG
                      </button>
                    </div>

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
          </div>
        )}
      </main>
    </div>
  );
}
