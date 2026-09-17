import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Bot, ArrowRight, CheckCircle2 } from "lucide-react";

export default function CopilotPage() {
  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col font-sans">
      <Navbar brandName="Paragon Studio" />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0a192f] tracking-tight font-heading">
              AI Formulation Co-Pilot (Llama-3.3-70B LPU)
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              Menerjemahkan ide produk dari bahasa alami Bahasa Indonesia menjadi spesifikasi formula kimia 4-fase yang tervalidasi termodinamika dan bebas halusinasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <span className="font-bold text-slate-700 block">Orchestrator Backend</span>
              <p className="text-slate-500">
                Hit LLM (Groq Cloud LPU Llama-3.3-70B + Llama-3.1-8B) dengan multi-key rotation pool &amp; strict Pydantic JSON schema.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <span className="font-bold text-slate-700 block">3 Spesialis Sub-Agen</span>
              <p className="text-slate-500">
                Formulation Architect, Colloidal Auditor, dan Regulatory Sentinel bekerja berurutan.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <span className="font-bold text-slate-700 block">Arsitektur Terintegrasi</span>
              <p className="text-slate-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Siap tersambung ke Formulation Canvas
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <Link
              href="/workbench?step=3"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#001299] text-white hover:bg-[#000e7a] shadow-xs transition-all"
            >
              <span>Uji Simulasi Kestabilan 40°C</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
