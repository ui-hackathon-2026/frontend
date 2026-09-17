import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Zap, ArrowRight, CheckCircle2 } from "lucide-react";

export default function OptimizerPage() {
  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col font-sans">
      <Navbar brandName="Paragon Studio" />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8">
        <div className="relative overflow-hidden shimmer-card p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0a192f] tracking-tight font-heading">
              Pareto Frontier NSGA-II Multi-Objective Optimizer
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              Mengevaluasi hingga 50.000 kombinasi formula dalam 2 detik untuk menemukan titik kompromi terbaik (*sweet spot*) antara Kestabilan 40°C, Biaya (COGS), Viskositas, dan Skor Hayati Lokal (TKDN ≥ 40%).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
            <div className="relative overflow-hidden shimmer-card p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <span className="font-bold text-slate-700 block">Komputasi Paralel Presisi</span>
              <p className="text-slate-500">
                NSGA-II Genetic Algorithm dengan fungsi evaluasi kelayakan formula secara simultan.
              </p>
            </div>
            <div className="relative overflow-hidden shimmer-card p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <span className="font-bold text-slate-700 block">3D Interactive Scatter</span>
              <p className="text-slate-500">
                Visualisasi sebaran titik Pareto 3D (Stabilitas vs Biaya vs TKDN) dengan 3 kandidat juara.
              </p>
            </div>
            <div className="relative overflow-hidden shimmer-card p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <span className="font-bold text-slate-700 block">Evaluasi Mutu</span>
              <p className="text-slate-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Non-dominated sorting multi-kriteria
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <Link
              href="/simulator"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#001299] text-white hover:bg-[#000e7a] shadow-xs transition-all"
            >
              <span>Uji Stability Simulator 40°C</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
