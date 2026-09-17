"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useProjectBrief } from "@/hooks/useProjectBrief";
import { BlueprintResultCard } from "@/components/brief/BlueprintResultCard";
import { ShimmerSkeleton } from "@/components/ShimmerWidget";
import { DelayedInfoTooltip } from "@/components/DelayedInfoTooltip";
import {
  FileText,
  UploadCloud,
  Sliders,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  FolderOpen,
  DollarSign,
  Droplets,
  Layers,
  FlaskConical,
} from "lucide-react";
import {
  ProductFormulationCategory,
  SkinTargetProfile,
  SensoryFinishProfile,
} from "@/domain/models/brief";

export default function ProjectBriefPage() {
  const [activeTab, setActiveTab] = useState<"visual" | "ingest">("visual");

  const {
    brief,
    updateBriefField,
    toggleHeroIngredient,
    blueprint,
    heroCatalog,
    chassisList,
    selectedChassisId,
    applyChassis,
    isSynthesizing,
    isParsingPdf,
    pdfClaims,
    handleParsePdf,
    handleSynthesize,
    error,
  } = useProjectBrief();

  const categories: ProductFormulationCategory[] = [
    "Gel-Cream",
    "Hydrating Serum",
    "Sunscreen Emulsion",
    "Barrier Cream",
    "Facial Cleanser",
  ];

  const skinProfiles: SkinTargetProfile[] = [
    "Semua Jenis Kulit",
    "Kulit Berminyak & Berjerawat",
    "Kulit Kering Dehidrasi",
    "Kulit Sensitif Tropis",
    "Anti-Aging & Mature Skin",
  ];

  const sensoryFinishes: SensoryFinishProfile[] = [
    "Lightweight Dewy",
    "Matte Velvety",
    "Watery Refreshing",
    "Rich Nourishing",
  ];

  const brands = ["Wardah", "Kahf", "Emina", "Make Over", "Laboré", "Custom R&D"] as const;

  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleParsePdf(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col font-sans">
      <Navbar brandName="Paragon Studio" />

      <main className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-6">
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0a192f] tracking-tight font-heading">
                  Project Brief Studio
                </h1>
                <DelayedInfoTooltip
                  content="Pusat inisiasi perancangan formula produk baru atau optimasi sediaan eksisting berdasarkan brief teknis dan marketing."
                  delayMs={300}
                  position="right"
                />
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-xl text-xs shrink-0 self-start sm:self-center">
              <button
                type="button"
                onClick={() => setActiveTab("visual")}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === "visual"
                    ? "bg-white text-[#001299] font-bold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Rancang Sasaran Visual</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("ingest")}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === "ingest"
                    ? "bg-white text-[#001299] font-bold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Ingest PDF / Formula Eksisting</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {error}
            </div>
          )}

          {/* TAB 1: VISUAL TARGET MATRIX SETUP */}
          {activeTab === "visual" && (
            <section className="space-y-6 animate-in fade-in duration-200">
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
                {/* Brand & Project Identity */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-8 space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Nama Proyek Sediaan
                    </label>
                    <input
                      type="text"
                      value={brief.projectName}
                      onChange={(e) => updateBriefField("projectName", e.target.value)}
                      placeholder="Contoh: Hydrating Barrier Sunscreen Gel"
                      className="w-full text-sm font-semibold px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#001299]/20 focus:border-[#001299]"
                    />
                  </div>

                  <div className="sm:col-span-4 space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Target Brand Paragon
                    </label>
                    <select
                      value={brief.brand}
                      onChange={(e) => updateBriefField("brand", e.target.value as any)}
                      className="w-full text-sm font-semibold px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#001299]/20 focus:border-[#001299] bg-white cursor-pointer"
                    >
                      {brands.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Category & Skin Target */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Kategori Formulasi
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((cat) => {
                        const isSelected = brief.category === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => updateBriefField("category", cat)}
                            className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                              isSelected
                                ? "border-[#001299] bg-blue-50/60 font-bold text-[#001299] ring-1 ring-[#001299]"
                                : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                            }`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Profil Sasaran Kulit
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {skinProfiles.slice(0, 4).map((prof) => {
                        const isSelected = brief.skinProfile === prof;
                        return (
                          <button
                            key={prof}
                            type="button"
                            onClick={() => updateBriefField("skinProfile", prof)}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                              isSelected
                                ? "border-[#001299] bg-blue-50/60 font-bold text-[#001299] ring-1 ring-[#001299]"
                                : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                            }`}
                          >
                            {prof}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Sensory & Viscosity Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Target Viskositas Aliran
                      </label>
                      <span className="text-xs font-mono font-bold text-[#001299]">
                        {brief.targetViscosityMpaS.toLocaleString("id-ID")} mPa·s
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1500"
                      max="15000"
                      step="250"
                      value={brief.targetViscosityMpaS}
                      onChange={(e) =>
                        updateBriefField("targetViscosityMpaS", parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#001299]"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>1.500 (Serum)</span>
                      <span>5.500 (Gel-Cream)</span>
                      <span>15.000 (Thick Cream)</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Batas Plafon Biaya Bahan (COGS)
                      </label>
                      <span className="text-xs font-mono font-bold text-[#001299]">
                        Rp {brief.maxCogsIdrPerKg.toLocaleString("id-ID")} / kg
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20000"
                      max="85000"
                      step="1000"
                      value={brief.maxCogsIdrPerKg}
                      onChange={(e) =>
                        updateBriefField("maxCogsIdrPerKg", parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#001299]"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Rp 20.000 (Mass Emina)</span>
                      <span>Rp 45.000 (Prestige Wardah)</span>
                      <span>Rp 85.000 (Pro Make Over)</span>
                    </div>
                  </div>
                </div>

                {/* Hero Active Ingredients Picker */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center space-x-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Bahan Aktif Unggulan (Hero Ingredients)
                    </label>
                    <DelayedInfoTooltip
                      content="Pilih bahan aktif lokal untuk meningkatkan skor TKDN dan memperkuat narasi khasiat produk."
                      delayMs={300}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {heroCatalog.map((hero) => {
                      const isChecked = brief.selectedHeroIngredients.includes(hero.name);
                      return (
                        <div
                          key={hero.id}
                          onClick={() => toggleHeroIngredient(hero.name)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
                            isChecked
                              ? "border-[#001299] bg-blue-50/50 ring-1 ring-[#001299]"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 leading-snug">
                              {hero.name}
                            </span>
                            {isChecked && <CheckCircle2 className="w-4 h-4 text-[#001299] shrink-0" />}
                          </div>
                          <span className="text-[10px] text-slate-500 leading-relaxed block">
                            {hero.benefit}
                          </span>
                          {hero.isLocalTkdn && (
                            <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded w-fit">
                              Asal: {hero.localOrigin}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Button: Synthesize */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSynthesize}
                    disabled={isSynthesizing}
                    className="w-full flex items-center justify-center space-x-2.5 py-4 px-6 rounded-2xl font-semibold text-sm bg-[#001299] hover:bg-[#000e7a] text-white shadow-xs transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSynthesizing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Menyintesis Arsitektur Formula 4-Fase...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-blue-200" />
                        <span>Sintesis Arsitektur Formula</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* TAB 2: INGEST PDF / FORMULA EKSISTING */}
          {activeTab === "ingest" && (
            <section className="space-y-6 animate-in fade-in duration-200">
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
                {/* PDF Drag and Drop Area */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    1. Unggah Proposal Marketing / Brief Produk (PDF)
                  </label>
                  <label className="border-2 border-dashed border-slate-300 hover:border-[#001299] hover:bg-blue-50/30 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all block">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={onFileUpload}
                      className="hidden"
                      disabled={isParsingPdf}
                    />
                    <UploadCloud className="w-10 h-10 text-blue-600 mb-2" />
                    <span className="text-sm font-bold text-[#0a192f] block">
                      Klik untuk Unggah atau Tarik Berkas PDF ke Sini
                    </span>
                    <span className="text-xs text-slate-500 mt-1 block">
                      Mendukung dokumen PDF Product Concept Brief dari tim Brand Wardah, Kahf, Emina
                    </span>
                  </label>
                </div>

                {isParsingPdf && (
                  <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-200/70 flex items-center space-x-3 text-xs text-slate-600">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span>Mengekstrak klaim marketing dan parameter teknis dari dokumen PDF...</span>
                  </div>
                )}

                {pdfClaims.length > 0 && (
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-2">
                    <span className="font-bold text-emerald-900 block">
                      Klaim Berhasil Diekstrak dari Brief:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-emerald-800 text-[11px]">
                      {pdfClaims.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Existing Chassis Selector */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    2. Atau Pilih Basis Chassis Formula Eksisting Paragon (Reverse-Engineering)
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {chassisList.map((chassis) => {
                      const isSelected = selectedChassisId === chassis.id;
                      return (
                        <div
                          key={chassis.id}
                          onClick={() => applyChassis(chassis.id)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                            isSelected
                              ? "border-[#001299] bg-blue-50/60 ring-2 ring-[#001299]"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-[#001299] bg-blue-100/70 px-2 py-0.5 rounded">
                              {chassis.brand}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              TKDN: {chassis.tkdnPct}%
                            </span>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{chassis.name}</h4>
                            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                              {chassis.description}
                            </p>
                          </div>
                          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                            Viskositas: {chassis.baseViscosity.toLocaleString("id-ID")} mPa·s
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Button: Synthesize */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSynthesize}
                    disabled={isSynthesizing}
                    className="w-full flex items-center justify-center space-x-2.5 py-4 px-6 rounded-2xl font-semibold text-sm bg-[#001299] hover:bg-[#000e7a] text-white shadow-xs transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSynthesizing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Menyusun Rekomendasi Re-engineering...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-blue-200" />
                        <span>Sintesis Cetak Biru Berdasarkan Ingest</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* SKELETON LOADING STATE (Strictly active when isSynthesizing) */}
          {isSynthesizing && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-200/80 shadow-xs space-y-6 animate-in fade-in duration-200">
              <div className="space-y-2">
                <ShimmerSkeleton className="w-48 h-5 rounded-lg" />
                <ShimmerSkeleton className="w-72 h-4 rounded-md" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <ShimmerSkeleton className="h-20 rounded-2xl" />
                <ShimmerSkeleton className="h-20 rounded-2xl" />
                <ShimmerSkeleton className="h-20 rounded-2xl" />
                <ShimmerSkeleton className="h-20 rounded-2xl" />
              </div>
              <ShimmerSkeleton className="h-24 rounded-2xl" />
              <div className="space-y-2">
                <ShimmerSkeleton className="w-full h-12 rounded-xl" />
                <ShimmerSkeleton className="w-full h-12 rounded-xl" />
                <ShimmerSkeleton className="w-full h-12 rounded-xl" />
              </div>
            </div>
          )}

          {/* GENERATED BLUEPRINT RESULT */}
          {!isSynthesizing && blueprint && <BlueprintResultCard blueprint={blueprint} />}
      </main>
    </div>
  );
}
