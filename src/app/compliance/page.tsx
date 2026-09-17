import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

export default function CompliancePage() {
  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col font-sans">
      <Navbar brandName="Paragon Studio" />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0a192f] tracking-tight font-heading">
              Regulatory Audit Sentinel &amp; Knowledge Engine
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              Audit kepatuhan hukum instan: batas konsentrasi aman Perka BPOM No. 17/2022, verifikasi bahan baku halal bebas porcine (HAS 23000), dan kalkulator TKDN kementerian perindustrian (target ≥ 40%).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <span className="font-bold text-slate-700 block">Deterministic SQL Engine</span>
              <p className="text-slate-500">
                100% presisi bebas halusinasi, diverifikasi langsung terhadap database monografi BPOM dan katalog halal.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <span className="font-bold text-slate-700 block">Local Ingredient Recommender</span>
              <p className="text-slate-500">
                Rekomendasi otomatis bahan botani lokal (VCO, ekstrak pegagan, minyak kelapa sawit bersertifikat RSPO).
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <span className="font-bold text-slate-700 block">Kepastian Regulasi</span>
              <p className="text-slate-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Validasi instan ambang batas legal
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
