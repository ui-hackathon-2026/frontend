import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Box, ArrowRight, CheckCircle2 } from "lucide-react";

export default function MolecularInspectorPage() {
  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col font-sans">
      <Navbar brandName="Paragon Studio" />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8">
        <div className="relative overflow-hidden shimmer-card p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0a192f] tracking-tight font-heading">
              3D Molecular &amp; Colloid Inspector
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              Visualisasi 3D WebGL interaktif untuk konformasi molekul bahan aktif (SMILES ➔ 3D SDF) serta sketsa orientasi surfaktan polar-nonpolar pada antarmuka tetesan emulsi (*lamellar gel network*).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
            <div className="relative overflow-hidden shimmer-card p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <span className="font-bold text-slate-700 block">RDKit AllChem 3D</span>
              <p className="text-slate-500">
                Pembangkitan koordinat konformasi 3D berenergi minimal (MMFF94 forcefield) secara otomatis di backend.
              </p>
            </div>
            <div className="relative overflow-hidden shimmer-card p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <span className="font-bold text-slate-700 block">Mol* WebGL Render</span>
              <p className="text-slate-500">
                Render 60 FPS di browser dengan dukungan rotasi 360°, ball &amp; stick, dan permukaan polaritas Van der Waals.
              </p>
            </div>
            <div className="relative overflow-hidden shimmer-card p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <span className="font-bold text-slate-700 block">Eksplorasi Molekuler</span>
              <p className="text-slate-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Inspeksi visual interaktif 3D di browser
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <Link
              href="/simulator"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#001299] text-white hover:bg-[#000e7a] shadow-xs transition-all"
            >
              <span>Uji Stability Simulator Fisikokimia</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
