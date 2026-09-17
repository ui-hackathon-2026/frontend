"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Bot,
  Sliders,
  Gauge,
  Zap,
  ShieldCheck,
  FileSpreadsheet,
  Box,
  Palette,
  FlaskConical,
} from "lucide-react";

interface MegaMenuProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="absolute top-full left-0 w-full z-50 pt-2 transition-all duration-200 animate-in fade-in slide-in-from-top-2"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="glass-dropdown rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-2xl backdrop-blur-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {/* Column 1: Core AI & Simulation */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold tracking-wider text-[#002df5] uppercase">
                Core Engine &amp; Modeling
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/workbench?step=3"
                    onClick={onClose}
                    className="group flex items-start space-x-2.5 p-2 rounded-xl hover:bg-blue-50/70 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/80 mt-0.5">
                      <Gauge className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 group-hover:text-[#0018a8] block">
                        Simulasi Kestabilan 40°C (In-Silico)
                      </span>
                      <p className="text-xs text-slate-500 leading-snug">
                        Simulasi kestabilan emulsi 40°C 90 hari dipercepat terintegrasi pada Formulation Canvas.
                      </p>
                    </div>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/project-brief"
                    onClick={onClose}
                    className="group flex items-start space-x-2.5 p-2 rounded-xl hover:bg-blue-50/70 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/80 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 group-hover:text-[#0018a8] block">
                        Project Brief Studio
                      </span>
                      <p className="text-xs text-slate-500 leading-snug">
                        Setup target matriks, ingest brief PDF/chassis &amp; sintesis arsitektur formula terintegrasi AI.
                      </p>
                    </div>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/optimizer"
                    onClick={onClose}
                    className="group flex items-start space-x-2.5 p-2 rounded-xl hover:bg-blue-50/70 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/80 mt-0.5">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 group-hover:text-[#0018a8] block">
                        Pareto Multi-Objective Optimizer
                      </span>
                      <p className="text-xs text-slate-500 leading-snug">
                        Optuna NSGA-II 50.000 trials paralel: stabilitas, COGS &amp; TKDN.
                      </p>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Formulation & Regulatory */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold tracking-wider text-[#002df5] uppercase">
                Formulation &amp; Standards
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/workbench"
                    onClick={onClose}
                    className="group flex items-start space-x-2.5 p-2 rounded-xl hover:bg-blue-50/70 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200/80 mt-0.5">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 group-hover:text-[#0018a8] block">
                        Formulation Canvas
                      </span>
                      <p className="text-xs text-slate-500 leading-snug">
                        Meja racik interaktif Fase A, B, C, D dengan balance matematis 100%.
                      </p>
                    </div>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/compliance"
                    onClick={onClose}
                    className="group flex items-start space-x-2.5 p-2 rounded-xl hover:bg-blue-50/70 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/80 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 group-hover:text-[#0018a8] block">
                        Regulatory &amp; Halal Sentinel
                      </span>
                      <p className="text-xs text-slate-500 leading-snug">
                        Perka BPOM 17/2022, Halal HAS 23000, dan TKDN kalkulator lokal.
                      </p>
                    </div>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/molecular-inspector"
                    onClick={onClose}
                    className="group flex items-start space-x-2.5 p-2 rounded-xl hover:bg-blue-50/70 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200/80 mt-0.5">
                      <Box className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 group-hover:text-[#0018a8] block">
                        3D Molecular &amp; Colloid Inspector
                      </span>
                      <p className="text-xs text-slate-500 leading-snug">
                        RDKit 3D conformers &amp; struktur emulsi droplet 360° WebGL.
                      </p>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Factory Scale & Documents */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold tracking-wider text-[#002df5] uppercase">
                Plant Scale &amp; Explainability
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/batch-sheet"
                    onClick={onClose}
                    className="group flex items-start space-x-2.5 p-2 rounded-xl hover:bg-blue-50/70 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200/80 mt-0.5">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 group-hover:text-[#0018a8] block">
                        Master Batch Record &amp; SOP
                      </span>
                      <p className="text-xs text-slate-500 leading-snug">
                        Konversi gramatur batch lab/pabrik (500g–100kg), SOP, dan TreeSHAP.
                      </p>
                    </div>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/contoh-halaman"
                    onClick={onClose}
                    className="group flex items-start space-x-2.5 p-2 rounded-xl hover:bg-blue-50/70 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200/80 mt-0.5">
                      <Palette className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 group-hover:text-[#0018a8] block">
                        Design System Showcase
                      </span>
                      <p className="text-xs text-slate-500 leading-snug">
                        Katalog komponen Benchling-inspired, font picker, &amp; modal.
                      </p>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Lintasarta AI Cloud Info */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold tracking-wider text-[#002df5] uppercase">
                  Metode Ilmiah
                </h4>
                <div className="mt-3 p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/60 border border-blue-100/90 text-xs space-y-2">
                  <div className="flex items-center space-x-1.5 text-[#0018a8] font-bold">
                    <FlaskConical className="w-3.5 h-3.5 text-[#0018a8]" />
                    <span>Simulasi Koloid In-Silico</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Kombinasi termodinamika koloid, kesetimbangan fasa, dan model machine learning prediktif untuk riset formulasi.
                  </p>
                  <div className="pt-1">
                    <Link
                      href="/workbench?step=3"
                      onClick={onClose}
                      className="text-[#0018a8] font-semibold inline-flex items-center space-x-1 hover:underline text-[11px]"
                    >
                      <span>Buka Simulasi Kestabilan 40°C</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
