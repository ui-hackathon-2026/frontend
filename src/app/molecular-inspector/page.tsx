"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { MOLECULAR_CATALOG } from "@/data/mock/molecularData";
import { Molecule3DViewer } from "@/components/molecular/Molecule3DViewer";
import { ColloidInterface3DViewer } from "@/components/molecular/ColloidInterface3DViewer";
import { MolecularMetricsPanel } from "@/components/molecular/MolecularMetricsPanel";
import { DelayedInfoTooltip } from "@/components/DelayedInfoTooltip";
import { Atom, Layers, Sliders, ArrowRight, FlaskConical, ChevronRight } from "lucide-react";

type InspectorTab = "conformer" | "colloid";

export default function MolecularInspectorPage() {
  const [activeTab, setActiveTab] = useState<InspectorTab>("conformer");
  const [selectedMoleculeId, setSelectedMoleculeId] = useState<string>(MOLECULAR_CATALOG[0].id);

  const selectedMolecule = MOLECULAR_CATALOG.find((m) => m.id === selectedMoleculeId) || MOLECULAR_CATALOG[0];

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col font-sans">
      <Navbar brandName="Paragon Studio" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0a192f] tracking-tight font-heading">
                3D Molecular &amp; Colloid Inspector
              </h1>
              <DelayedInfoTooltip
                content="Inspeksi visual konformasi 3D bahan aktif berenergi minimal serta pemodelan antarmuka misel & lapisan lamellar pelindung emulsi 40°C."
                delayMs={300}
              />
            </div>
            <p className="text-sm text-slate-500">
              Analisis struktur molekul 3D terakselerasi WebGL dan termodinamika antarmuka koloid kosmetik tropis.
            </p>
          </div>

          {/* Mode Tabs Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200 shadow-xs shrink-0 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("conformer")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "conformer"
                  ? "bg-[#001299] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Atom className="w-4 h-4" />
              <span>3D Conformer Molekul</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("colloid")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "colloid"
                  ? "bg-[#001299] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Antarmuka Koloid 3D</span>
            </button>
          </div>
        </div>

        {/* TAB 1: 3D Conformer Inspector */}
        {activeTab === "conformer" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Molecule Selector Bar */}
            <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
                  Bahan Aktif:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {MOLECULAR_CATALOG.map((m) => {
                    const isSelected = m.id === selectedMoleculeId;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedMoleculeId(m.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#0a192f] text-white shadow-xs"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {m.name.split(" (")[0]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/workbench"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#001299] hover:bg-blue-50 transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Atur di Canvas</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 3D Canvas + Metrics Panel Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: 3D Interactive Viewer (7 cols) */}
              <div className="lg:col-span-7">
                <Molecule3DViewer molecule={selectedMolecule} />
              </div>

              {/* Right Column: Physicochemical Metrics Panel (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <MolecularMetricsPanel molecule={selectedMolecule} />

                {/* Technical Card Info */}
                <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <FlaskConical className="w-3.5 h-3.5 text-[#001299]" />
                    <span>In-Silico Conformation Note</span>
                  </div>
                  <p className="text-slate-500 leading-relaxed">
                    Koordinat atom 3D dihitung dengan minimisasi medan gaya MMFF94. Muatan parsial elektrostatik dipetakan untuk menganalisis afinitas ikatan hidrogen dengan fase pembawa emulsi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Colloidal Emulsion Interface Inspector */}
        {activeTab === "colloid" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <ColloidInterface3DViewer />

            {/* Bottom CTA to Step 3 Simulation */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-sm font-extrabold text-[#0a192f] font-heading">
                  Validasi Kestabilan Koloid pada Formula Lengkap
                </h4>
                <p className="text-xs text-slate-500">
                  Uji formula sediaan Anda pada uji kestabilan 40°C / 90 hari dengan LightGBM &amp; Deep Colloid GNN.
                </p>
              </div>
              <Link
                href="/workbench?step=3"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#001299] text-white hover:bg-[#000e7a] shadow-xs transition-all shrink-0 cursor-pointer"
              >
                <span>Buka Console Simulasi 40°C</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
