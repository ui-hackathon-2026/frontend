import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Sliders, ArrowRight, CheckCircle2 } from "lucide-react";

export default function WorkbenchPage() {
  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col font-sans">
      <Navbar brandName="Paragon Studio" />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0a192f] tracking-tight font-heading">
              Interactive 4-Phase Formulation Canvas
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              Meja kerja digital presisi standar industri: Fase A (Minyak), Fase B (Air), Fase C (Emulgator), dan Fase D (Bahan Aktif &amp; Peka Panas) dengan jaminan matematis total bobot selalu tepat 100,00%.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <span className="font-bold text-slate-700 block">Pure FE State Math</span>
              <p className="text-slate-500">
                Logika penyeimbang simpleks massa instan tanpa lag jaringan, autofill solvent Aqua di Fase B.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <span className="font-bold text-slate-700 block">Konektivitas Modul</span>
              <p className="text-slate-500">
                Formula langsung dapat dikirim ke Stability Simulator hanya dengan satu klik tombol.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <span className="font-bold text-slate-700 block">Presisi Kimia</span>
              <p className="text-slate-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Presisi numerik desimal 0.01%
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <Link
              href="/simulator"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#001299] text-white hover:bg-[#000e7a] shadow-xs transition-all"
            >
              <span>Uji Simulasi Stabilitas Fisikokimia</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
