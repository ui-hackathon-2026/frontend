"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import {
  ArrowRight,
  Sliders,
  Zap,
  ShieldCheck,
  Bot,
  Gauge,
  FileSpreadsheet,
  CheckCircle2,
  ChevronRight,
  FlaskConical,
  Sparkles,
} from "lucide-react";

const PAGE_PREVIEW = "/images/landing/placeholder-page.png";
const IMG_TILE = "/images/landing/placeholder-img.png";

export default function HomePage() {
  const smartSectionRef = React.useRef<HTMLDivElement>(null);
  const [activeSmartStep, setActiveSmartStep] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      if (!smartSectionRef.current) return;
      const rect = smartSectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalDist = rect.height - windowHeight;
      if (totalDist <= 0) return;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalDist));
      if (progress < 0.33) setActiveSmartStep(0);
      else if (progress < 0.67) setActiveSmartStep(1);
      else setActiveSmartStep(2);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const capabilities = [
    {
      badge: "4-Phase Workbench",
      title: "Formulation Canvas",
      desc: "Meja kerja digital presisi standar industri Fase A–D dengan magnetic snap 100%, slider bobot interaktif, dan katalog bahan baku terkurasi.",
      href: "/workbench",
      cta: "Buka Formulation Canvas",
      icon: Sliders,
      accent: "blue",
    },
    {
      badge: "NSGA-II Genetic",
      title: "Pareto Optimizer",
      desc: "Evaluasi 50.000 kombinasi formula untuk menemukan sweet-spot Stabilitas vs COGS vs TKDN ≥ 40% dalam satu frontier interaktif.",
      href: "/optimizer",
      cta: "Jalankan Optimasi Pareto",
      icon: Zap,
      accent: "emerald",
    },
    {
      badge: "BPOM & Halal",
      title: "Regulatory Sentinel",
      desc: "Audit forensik Perka BPOM 17/2022, titik kritis Halal HAS 23000, dan booster substitusi bahan lokal Nusantara via Vector RAG.",
      href: "/compliance",
      cta: "Mulai Audit Regulasi",
      icon: ShieldCheck,
      accent: "amber",
    },
  ];

  const accentMap: Record<string, { soft: string; border: string; text: string; icon: string; glow: string }> = {
    blue: {
      soft: "bg-blue-50",
      border: "hover:border-blue-300",
      text: "text-[#001299]",
      icon: "bg-blue-50 text-[#001299] border-blue-200",
      glow: "bg-blue-200/50",
    },
    emerald: {
      soft: "bg-emerald-50",
      border: "hover:border-emerald-300",
      text: "text-emerald-800",
      icon: "bg-emerald-50 text-emerald-700 border-emerald-200",
      glow: "bg-emerald-200/50",
    },
    amber: {
      soft: "bg-amber-50",
      border: "hover:border-amber-300",
      text: "text-amber-800",
      icon: "bg-amber-50 text-amber-700 border-amber-200",
      glow: "bg-amber-200/50",
    },
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 flex flex-col overflow-x-clip font-sans">
      <Navbar brandName="CoRamu" />

      {/* 1. HERO */}
      <section className="relative pt-14 pb-14 md:pt-20 md:pb-16 px-4 sm:px-6 lg:px-8 w-full bg-white overflow-hidden border-b border-slate-200/70">
        <div className="absolute -top-24 right-0 w-[500px] lg:w-[640px] h-[380px] bg-blue-100/60 blur-[130px] pointer-events-none select-none rounded-full" />
        <div className="absolute top-40 -left-24 w-[380px] h-[280px] bg-slate-100 blur-[110px] pointer-events-none select-none rounded-full" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start relative z-10">
          <div className="lg:col-span-5 space-y-4 text-left pt-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 text-[11px] font-bold text-[#001299] animate-fade-in-up">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Paragon Formulation Studio • In-Silico R&D</span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0a192f] leading-[1.12] font-heading animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              <span className="block">Formulasi Cerdas.</span>
              <span className="block">AI Co-Pilot.</span>
              <span className="block text-[#001299] text-xl sm:text-2xl lg:text-3xl font-bold mt-1.5">
                Kosmetik Tropis Paragon
              </span>
            </h1>

            <p
              className="text-xs sm:text-sm lg:text-base text-slate-600 max-w-md leading-relaxed animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              Bukan sekadar kalkulator persen. Studio mengeksekusi penalaran multi-tahap,
              simulasi stabilitas 40°C / 90 hari, dan audit regulasi BPOM–Halal–TKDN secara terpadu.
            </p>

            <div
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 animate-fade-in-up"
              style={{ animationDelay: "300ms" }}
            >
              <Link
                href="/workbench"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-[#001299] hover:bg-[#000e7a] text-white font-bold text-xs sm:text-sm transition-all shadow-sm group"
              >
                <span>Buka Formulation Canvas</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/optimizer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-xs sm:text-sm transition-all"
              >
                <span>Coba Pareto Optimizer</span>
              </Link>
            </div>

            <div className="flex items-center gap-4 pt-2 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Mass Balance 100%
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> BPOM • Halal • TKDN
              </span>
            </div>
          </div>

          <div
            className="lg:col-span-7 relative flex items-end justify-center lg:justify-end self-end w-full animate-fade-in-up mt-4 lg:mt-0"
            style={{ animationDelay: "300ms" }}
          >
            <div className="relative w-full max-w-[620px] lg:max-w-[720px]">
              <div className="relative rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xl shadow-slate-200/60">
                <div className="flex items-center justify-between px-3.5 py-2 bg-slate-50 border-b border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">Project Brief Studio — Live Preview</div>
                  <div className="w-8" />
                </div>
                <div className="relative aspect-[16/9] w-full bg-slate-50">
                  <Image
                    src={PAGE_PREVIEW}
                    alt="CoRamu Formulation Workspace"
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-left-top"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE CAPABILITIES */}
      <section className="py-20 sm:py-24 bg-[#fafbfc] px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-full max-w-7xl h-56 bg-blue-100/50 blur-[140px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-28 self-start space-y-4 pt-2">
              <RevealOnScroll direction="left">
                <div className="space-y-4">
                  <span className="text-[11px] font-bold text-[#001299] uppercase tracking-wider">
                    Modul Formulasi & Komputasi
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a192f] tracking-tight leading-[1.15] font-heading">
                    Dirancang untuk R&D Kosmetik Tropis Indonesia
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-lg">
                    Kombinasi brief cerdas, kanvas 4-fase presisi, dan simulasi in-silico tanpa halusinasi angka —
                    dari ide produk hingga batch sheet siap pabrik.
                  </p>
                </div>
              </RevealOnScroll>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-10 sm:gap-12">
              {capabilities.map((f, idx) => {
                const Icon = f.icon;
                const accent = accentMap[f.accent];
                return (
                  <div key={f.title} className="lg:sticky transition-all duration-300" style={{ top: `${112 + idx * 12}px`, zIndex: 10 + idx }}>
                    <RevealOnScroll direction="up" delayMs={idx * 60}>
                      <div className="relative group min-h-[320px] flex flex-col lg:flex-row items-center">
                        <div className={`relative z-20 w-full lg:w-[360px] rounded-2xl bg-white border border-slate-200 p-6 shadow-lg shadow-slate-200/50 space-y-4 shrink-0 ${accent.border} transition-colors duration-300`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0 ${accent.icon}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <span className={`text-[10px] font-bold tracking-wider uppercase block ${accent.text}`}>
                                {f.badge}
                              </span>
                              <h3 className="text-lg font-bold text-[#0a192f] font-heading">{f.title}</h3>
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                          <div className="pt-2">
                            <Link
                              href={f.href}
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all group/btn ${accent.icon} hover:brightness-95`}
                            >
                              <span>{f.cta}</span>
                              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                          </div>
                        </div>

                        <div className="relative lg:absolute lg:left-[250px] xl:left-[280px] lg:top-1/2 lg:-translate-y-1/2 w-full lg:w-[480px] z-10 mt-4 lg:mt-0">
                          <div className={`absolute -inset-4 blur-3xl -z-10 rounded-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500 ${accent.glow}`} />
                          <div className="relative aspect-[21/10] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-white transform rotate-[1.5deg] lg:rotate-[2.5deg] group-hover:lg:rotate-[1deg] group-hover:scale-[1.02] transition-all duration-700">
                            <Image
                              src={PAGE_PREVIEW}
                              alt={f.title}
                              fill
                              sizes="(max-width: 1024px) 100vw, 550px"
                              className="object-cover object-left-top"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </RevealOnScroll>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 WORKFLOW */}
      <section className="py-16 sm:py-20 bg-white px-4 sm:px-6 lg:px-8 relative overflow-hidden border-y border-slate-200/70">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[280px] bg-blue-50 blur-[140px] pointer-events-none rounded-full" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 lg:gap-12 items-start">
            <div className="order-2 lg:order-1 lg:col-span-6 w-full">
              <RevealOnScroll direction="right">
                <div className="relative rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-lg shadow-slate-200/50 w-full group hover:border-blue-300 transition-colors duration-300">
                  <div className="flex items-center justify-between px-3.5 py-2 bg-slate-50 border-b border-slate-200">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    </div>
                    <div className="text-[11px] font-mono text-slate-500">Brief → Canvas → Simulasi → Batch</div>
                    <div className="w-8" />
                  </div>
                  <div className="relative aspect-video w-full bg-slate-50">
                    <Image src={PAGE_PREVIEW} alt="End-to-end formulation workflow" fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover object-left-top" />
                  </div>
                </div>
              </RevealOnScroll>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-4 w-full pt-1 flex flex-col justify-between self-stretch">
              <RevealOnScroll direction="left">
                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-[#001299] uppercase tracking-wider">Alur Kerja Terpadu</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a192f] tracking-tight leading-tight font-heading">
                    Ekosistem R&D End-to-End Tanpa Hambatan
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Setiap temuan di Brief, Canvas, hingga Optimizer saling terhubung. Transfer blueprint ke kanvas,
                    uji stabilitas 40°C, audit regulasi, lalu cetak batch sheet — tanpa salin data manual.
                  </p>
                </div>
              </RevealOnScroll>
              <RevealOnScroll direction="left" delayMs={200} className="w-full flex justify-end">
                <div className="relative flex justify-end items-end pt-4 pointer-events-none select-none">
                  <div className="absolute right-4 bottom-2 w-32 h-32 bg-blue-100 blur-3xl rounded-full pointer-events-none" />
                  <div className="relative w-36 sm:w-44 aspect-square rounded-2xl overflow-hidden border border-slate-200 shadow-md transform rotate-[8deg] hover:rotate-[4deg] transition-transform duration-700 bg-slate-50">
                    <Image src={IMG_TILE} alt="Workflow loop" fill sizes="180px" className="object-cover" />
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* 3. METRICS BOARD */}
      <section className="py-20 sm:py-24 bg-[#fafbfc] px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-light mask-radial-fade opacity-90 pointer-events-none select-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[320px] bg-blue-100/60 blur-[150px] pointer-events-none rounded-full" />
        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-12">
          <RevealOnScroll direction="up">
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
                <Gauge className="w-3.5 h-3.5 text-[#001299]" />
                <span>Paragon In-Silico Engine</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a192f] tracking-tight leading-[1.15] font-heading">
                Ditenagai Mesin Komputasi Formulasi Presisi
              </h2>
              <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Akurasi komposisi adalah prioritas mutlak. Seluruh analisis berakar pada neraca massa deterministik
                dan model stabilitas terkalibrasi tropis.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll direction="up" delayMs={120}>
            <div className="relative border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
              <div className="grid grid-cols-3 divide-x divide-slate-200 text-center">
                <div className="p-6 sm:p-8 group">
                  <div className="text-3xl sm:text-5xl font-extrabold text-[#0a192f] tracking-tight font-mono tabular-nums group-hover:text-[#001299] transition-colors">50K+</div>
                </div>
                <div className="p-6 sm:p-8 group">
                  <div className="text-3xl sm:text-5xl font-extrabold text-[#0a192f] tracking-tight font-mono tabular-nums group-hover:text-[#001299] transition-colors">4-Fase</div>
                </div>
                <div className="p-6 sm:p-8 group">
                  <div className="text-3xl sm:text-5xl font-extrabold text-[#0a192f] tracking-tight font-mono tabular-nums group-hover:text-[#001299] transition-colors">90Hr</div>
                </div>
              </div>
              <div className="w-full h-px bg-slate-200" />
              <div className="grid grid-cols-3 divide-x divide-slate-200 text-center">
                <div className="p-5 sm:p-6 space-y-1">
                  <div className="text-xs sm:text-sm font-bold text-[#0a192f]">Kombinasi Formula</div>
                  <p className="text-[11px] text-slate-500 max-w-[220px] mx-auto">Dievaluasi optimizer NSGA-II multi-objektif</p>
                </div>
                <div className="p-5 sm:p-6 space-y-1">
                  <div className="text-xs sm:text-sm font-bold text-[#0a192f]">Neraca Massa 100%</div>
                  <p className="text-[11px] text-slate-500 max-w-[220px] mx-auto">Kanvas A–D dengan snap presisi 0,1%</p>
                </div>
                <div className="p-5 sm:p-6 space-y-1">
                  <div className="text-xs sm:text-sm font-bold text-[#0a192f]">Simulasi 40°C</div>
                  <p className="text-[11px] text-slate-500 max-w-[220px] mx-auto">Uji stabilitas emulsi dipercepat in-silico</p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* 4. SCROLL STEPPING */}
      <section ref={smartSectionRef} className="relative min-h-[220vh] bg-white border-t border-slate-200/70">
        <div className="sticky top-16 md:top-20 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full min-h-[calc(100vh-4rem)] flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="order-2 lg:order-1 lg:col-span-6 flex flex-col justify-center">
              <div className="relative min-h-[440px] w-full">
                {[
                  {
                    title: "Project Brief Studio",
                    sub: "Brief Visual & Ingest PDF",
                    desc: "Susun target viskositas, COGS, hero ingredients lokal, atau ingest PDF marketing — lalu sintesis blueprint 4-fase otomatis.",
                    points: ["Target viskositas & COGS presisi", "Hero ingredients TKDN lokal", "Ingest PDF formula eksisting"],
                    href: "/project-brief",
                    cta: "Buka Brief Studio",
                    accent: "text-[#001299]",
                  },
                  {
                    title: "Simulasi 40°C / 90 Hari",
                    sub: "Stabilitas In-Silico",
                    desc: "Uji ketahanan emulsi tropis dengan audit termodinamika koloid, distribusi droplet, dan kurva reologi lengkap.",
                    points: ["Stability gauge terkalibrasi", "SOR, ΔG, CMC & mesophase", "Rekomendasi R&D naratif"],
                    href: "/workbench?step=3",
                    cta: "Jalankan Simulasi",
                    accent: "text-emerald-700",
                  },
                  {
                    title: "Batch Sheet & SOP",
                    sub: "Skala Pabrik Siap Cetak",
                    desc: "Terjemahkan formula lolos uji menjadi lembar penimbangan 500g–100kg dan SOP homogenizer siap executed analis.",
                    points: ["Auto-scaled weighing sheet", "SOP suhu & homogenizer", "Atribusi TreeSHAP per bahan"],
                    href: "/batch-sheet",
                    cta: "Buat Batch Sheet",
                    accent: "text-amber-700",
                  },
                ].map((c, i) => (
                  <div
                    key={c.title}
                    className={`transition-all duration-500 ${
                      activeSmartStep === i
                        ? "relative opacity-100 translate-y-0 scale-100 pointer-events-auto z-20"
                        : "absolute inset-0 opacity-0 translate-y-8 scale-95 pointer-events-none z-10"
                    }`}
                  >
                    <div className="relative rounded-2xl border border-slate-200 bg-[#fafbfc] p-6 hover:border-blue-300 transition-all flex flex-col justify-between h-full space-y-5 overflow-hidden shadow-sm">
                      <div className="absolute top-0 right-0 w-56 h-44 pointer-events-none overflow-hidden rounded-tr-2xl">
                        <Image src={PAGE_PREVIEW} alt={c.title} fill sizes="300px" className="object-cover object-left-top opacity-70" />
                        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-[#fafbfc]/70 to-[#fafbfc]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#fafbfc] via-[#fafbfc]/40 to-transparent" />
                      </div>
                      <div className="space-y-4 relative z-10">
                        <div className="h-8" aria-hidden="true" />
                        <div>
                          <h3 className="text-lg font-bold text-[#0a192f] font-heading">{c.title}</h3>
                          <p className={`text-xs font-semibold mt-0.5 ${c.accent}`}>{c.sub}</p>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{c.desc}</p>
                        <div className="space-y-1.5 pt-1 text-[11px] text-slate-500">
                          {c.points.map((p) => (
                            <div key={p} className="flex items-center gap-2">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                              <span>{p}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Link href={c.href} className={`relative z-10 inline-flex items-center justify-between text-xs font-bold pt-3 border-t border-slate-200 ${c.accent}`}>
                        <span>{c.cta}</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-6 flex flex-col space-y-4">
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-[#001299] uppercase tracking-wider">Follow-Up Tanpa Hambatan</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a192f] tracking-tight leading-tight font-heading">
                  Setiap Temuan Terhubung ke Langkah Berikutnya
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mulai dari brief marketing, uji stabilitas fisikokimia, hingga batch sheet pabrik — seluruh insight
                  dapat ditransfer sebagai konteks antar modul dalam satu klik.
                </p>
                <div className="flex items-center gap-2.5 pt-1">
                  <Link href="/project-brief" className="inline-flex items-center justify-center px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 font-semibold text-xs hover:bg-slate-50">
                    <span>Mulai dari Brief</span>
                  </Link>
                  <Link href="/workbench" className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#001299] hover:bg-[#000e7a] text-white font-bold text-xs shadow-xs">
                    <span>Coba di Canvas</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
              <div className="relative rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-md w-full">
                <div className="flex items-center justify-between px-3.5 py-2 bg-slate-50 border-b border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">Brief → Canvas Context Handoff</div>
                  <div className="w-8" />
                </div>
                <div className="relative aspect-video w-full bg-slate-50">
                  <Image src={PAGE_PREVIEW} alt="Context handoff demo" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-left-top" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 w-full bg-[#fafbfc] relative overflow-hidden border-t border-slate-200/70">
        <div className="absolute inset-0 bg-grid-light mask-radial-fade opacity-80 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[320px] bg-blue-100/70 blur-[150px] pointer-events-none rounded-full" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <RevealOnScroll direction="up">
            <div className="space-y-5">
              <div className="mx-auto w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white relative">
                <Image src={IMG_TILE} alt="CoRamu" fill sizes="56px" className="object-cover" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a192f] tracking-tight leading-tight font-heading">
                Mulai Formulasi Cerdas Hari Ini
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
                Rancang brief pertama Anda dan dapatkan blueprint 4-fase terstruktur dalam hitungan detik.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="/editor"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-[#001299] text-white font-bold hover:bg-[#000e7a] transition-all shadow-sm group cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-blue-200 group-hover:scale-110 transition-transform" />
                  <span>Buka Studio Formulasi AI</span>
                  <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/workbench"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
                >
                  <span>Lihat Workbench 4-Fase</span>
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="w-full border-t border-slate-200 bg-white pt-12 pb-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          <div className="space-y-3 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#0a192f] text-white flex items-center justify-center">
                <FlaskConical className="w-4 h-4 text-blue-200" />
              </div>
              <span className="font-bold text-[#0a192f] text-base tracking-tight font-heading">CoRamu</span>
            </div>
            <p className="text-xs leading-relaxed">Platform formulasi kosmetik in-silico untuk R&D tropis Paragon — dari brief hingga batch sheet siap pabrik.</p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-[11px] font-semibold text-[#001299]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#001299] animate-pulse" />
              <span>UI Hackathon 2026</span>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">Studio Formulasi</h3>
            <ul className="space-y-2">
              <li><Link href="/project-brief" className="hover:text-[#001299]">Project Brief Studio</Link></li>
              <li><Link href="/workbench" className="hover:text-[#001299]">Formulation Canvas 4-Fase</Link></li>
              <li><Link href="/workbench?step=3" className="hover:text-[#001299]">Simulasi 40°C / 90 Hari</Link></li>
              <li><Link href="/batch-sheet" className="hover:text-[#001299]">Batch Sheet & SOP</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">Inteligensi & Kepatuhan</h3>
            <ul className="space-y-2">
              <li><Link href="/optimizer" className="hover:text-[#001299]">Pareto Optimizer</Link></li>
              <li><Link href="/compliance" className="hover:text-[#001299]">BPOM & Halal Sentinel</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">Fitur Unggulan</h3>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5 text-[#001299]" /><span>Stability Gauge 40°C</span></li>
              <li className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-[#001299]" /><span>NSGA-II 50K Trials</span></li>
              <li className="flex items-center gap-1.5"><FileSpreadsheet className="w-3.5 h-3.5 text-[#001299]" /><span>Plant Scaling 100kg</span></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">Standar Enterprise</h3>
            <p className="leading-relaxed mb-3">Seluruh visual formulasi disajikan untuk kebutuhan R&D independen. Verifikasi lab tetap diperlukan sebelum skala pabrik.</p>
            <div className="text-[11px] font-mono text-slate-400">Light Theme • Plus Jakarta + Outfit</div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© 2026 CoRamu. Seluruh hak cipta dilindungi.</span>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1"><Sliders className="w-3 h-3" /> Canvas 4-Fase</span>
            <span>•</span>
            <span>In-Silico 40°C</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
