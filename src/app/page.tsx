import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import {
  Gauge,
  Sliders,
  Bot,
  Zap,
  ShieldCheck,
  FileSpreadsheet,
  Box,
  ArrowRight,
  Palette,
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      id: "simulator",
      name: "Simulasi Kestabilan 40°C",
      href: "/workbench?step=3",
      desc: "Simulasi kestabilan emulsi 40°C 90 hari dipercepat dengan model in-silico prediktif.",
      icon: Gauge,
      badge: "In-Silico ML",
      badgeColor: "bg-emerald-100 text-emerald-800",
      highlight: true,
    },
    {
      id: "copilot",
      name: "AI Formulation Co-Pilot",
      href: "/copilot",
      desc: "Llama-3.3-70B LPU orchestrator untuk formulasi otomatis berbasis bahasa alami.",
      icon: Bot,
      badge: "Multi-Agent AI",
      badgeColor: "bg-blue-100 text-blue-800",
    },
    {
      id: "workbench",
      name: "Formulation Canvas",
      href: "/workbench",
      desc: "Meja kerja digital presisi standar industri (Fase A, B, C, D) dengan total berat 100%.",
      icon: Sliders,
      badge: "4-Phase Workbench",
      badgeColor: "bg-amber-100 text-amber-800",
    },
    {
      id: "optimizer",
      name: "Pareto Multi-Objective Optimizer",
      href: "/optimizer",
      desc: "Evaluasi 50.000 kombinasi formula: Stabilitas vs Biaya COGS vs TKDN ≥ 40%.",
      icon: Zap,
      badge: "NSGA-II Genetic",
      badgeColor: "bg-indigo-100 text-indigo-800",
    },
    {
      id: "compliance",
      name: "Regulatory & Halal Sentinel",
      href: "/compliance",
      desc: "Audit deterministik Perka BPOM 17/2022, Halal HAS 23000 & katalog TKDN Kemenperin.",
      icon: ShieldCheck,
      badge: "BPOM & Halal",
      badgeColor: "bg-emerald-100 text-emerald-800",
    },
    {
      id: "batch-sheet",
      name: "Master Batch Record & SOP",
      href: "/batch-sheet",
      desc: "Skala batch lab & pabrik (500g–100kg), TreeSHAP attribution, dan generator SOP.",
      icon: FileSpreadsheet,
      badge: "Plant Scaling",
      badgeColor: "bg-sky-100 text-sky-800",
    },
    {
      id: "molecular-inspector",
      name: "3D Molecular & Colloid Inspector",
      href: "/molecular-inspector",
      desc: "Konformasi 3D molekul RDKit & diagram antarmuka tetesan emulsi WebGL.",
      icon: Box,
      badge: "3D WebGL",
      badgeColor: "bg-purple-100 text-purple-800",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col font-sans">
      <Navbar brandName="Paragon Studio" />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16 w-full space-y-12">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0a192f] font-heading">
            AI-Driven Formulation Co-Pilot Studio
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Platform in-silico komputasi kimia &amp; formulasi kosmetik cerdas untuk riset dan pengembangan kosmetik tropis.
            Dirancang dengan antarmuka bersih, presisi, dan ergonomis untuk formulator laboratorium R&amp;D.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/workbench?step=3"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-semibold bg-[#001299] text-white hover:bg-[#000e7a] shadow-sm transition-all"
            >
              <Gauge className="w-4 h-4" />
              <span>Buka Simulasi Kestabilan 40°C</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/contoh-halaman"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-medium bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 transition-all"
            >
              <Palette className="w-4 h-4 text-slate-500" />
              <span>Design System Showcase</span>
            </Link>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#0a192f] font-heading">
                Modul Komputasi &amp; Formulasi Kimia
              </h2>
              <p className="text-xs text-slate-500">
                Akses rangkaian instrumen formulasi, pemodelan termodinamika koloid, dan kepatuhan regulasi
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <Link
                  key={f.id}
                  href={f.href}
                  className={`p-6 rounded-3xl border transition-all group flex flex-col justify-between ${
                    f.highlight
                      ? "border-[#0018a8] bg-blue-50/40 hover:bg-blue-50/70 ring-2 ring-[#0018a8]/20 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-[#0018a8] group-hover:text-white text-[#0018a8] flex items-center justify-center transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${f.badgeColor}`}
                      >
                        {f.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0018a8] transition-colors">
                        {f.name}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {f.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0018a8]">
                    <span>Buka Modul</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
