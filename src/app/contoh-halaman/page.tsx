"use client";

import React, { useState } from "react";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Navbar } from "@/components/Navbar";
import { SegmentedTabBar, TabItem } from "@/components/SegmentedTabBar";
import { LabNotebookCard } from "@/components/LabNotebookCard";
import { CookieConsentModal } from "@/components/CookieConsentModal";
import { HighZModal } from "@/components/HighZModal";
import { FontPickerToolbar, NICHE_FONTS } from "@/components/FontPickerToolbar";
import {
  Sparkles,
  Layers,
  Eye,
  Info,
} from "lucide-react";

const FORMULATION_TABS: TabItem[] = [
  { id: "bioresearch", label: "Bioresearch", badge: "Core" },
  { id: "bioprocess", label: "Bioprocess" },
  { id: "benchling-ai", label: "Benchling AI", badge: "New" },
  { id: "biologics", label: "Biologics" },
  { id: "in-vivo", label: "In Vivo" },
  { id: "automation", label: "Automation" },
];

export default function ContohHalamanPage() {
  const [currentFont, setCurrentFont] = useState("");
  const [currentFontId, setCurrentFontId] = useState("paired");
  const [modalOpen, setModalOpen] = useState(false);
  const [cookieBannerVisible, setCookieBannerVisible] = useState(true);
  const [activeTab, setActiveTab] = useState("bioresearch");

  const handleFontChange = (fontClass: string, fontId: string) => {
    setCurrentFont(fontClass);
    setCurrentFontId(fontId);
  };

  const selectedFontObj =
    NICHE_FONTS.find((f) => f.id === currentFontId) || NICHE_FONTS[0];

  return (
    <div className={`min-h-screen bg-[#fafbfc] text-slate-900 ${currentFont} transition-all duration-150`}>
      {/* 1. Live Font Picker Toolbar (Top Utility) */}
      <FontPickerToolbar
        currentFont={currentFont}
        onSelectFont={handleFontChange}
      />

      {/* 2. Top Announcement Bar (Benchling Image 1) */}
      <AnnouncementBar
        message="Get free access to the latest scientific models at Benchling.ai"
        linkText="Try now"
        linkHref="#try-now"
      />

      {/* 3. Global Navbar with MegaMenu (Benchling Image 1 & 3) */}
      <Navbar brandName="Benchling" />

      {/* Main Content Showcase */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14 space-y-16 sm:space-y-20">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-semibold text-[#0018a8]">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Scientific Enterprise Design System • Light Mode</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0a192f] leading-tight sm:leading-tight">
            Designed for Science, Trusted by Senior R&D
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Sederhana, rapi, dan berwibawa. Tidak bergaya *vibe-coded* yang melelahkan mata,
            melainkan ergonomis dan nyaman untuk formulator Gen X &amp; Millennial.
          </p>

          {/* Interactive Action Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-semibold bg-[#001299] text-white hover:bg-[#000e7a] shadow-sm transition-all"
            >
              <Layers className="w-4 h-4" />
              <span>Test High-Z Glassmorphic Modal</span>
            </button>

            <button
              type="button"
              onClick={() => setCookieBannerVisible(!cookieBannerVisible)}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-medium bg-white text-slate-800 border border-slate-300/80 hover:bg-slate-50 shadow-2xs transition-all"
            >
              <Eye className="w-4 h-4 text-slate-500" />
              <span>{cookieBannerVisible ? "Hide Cookie Banner" : "Show Cookie Banner"}</span>
            </button>
          </div>
        </section>

        {/* 4. Segmented Tab Bar Showcase (Benchling Image 5) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Component Showcase: Segmented Pill Track (Image 5)
              </h3>
              <p className="text-xs text-slate-600">
                Pill capsule track dengan kontras lembut, active tab white-elevated pill.
              </p>
            </div>
            <span className="text-xs font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
              Active: {activeTab}
            </span>
          </div>

          <div className="flex justify-center sm:justify-start">
            <SegmentedTabBar
              tabs={FORMULATION_TABS}
              defaultTabId={activeTab}
              onChange={(id) => setActiveTab(id)}
            />
          </div>
        </section>

        {/* 5. Lab Notebook Protocol Card (Benchling Image 4 & 5) */}
        <section className="space-y-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Component Showcase: Digital Lab Notebook Protocol Card (Image 4 &amp; 5)
            </h3>
            <p className="text-xs text-slate-600">
              Menampilkan hierarki dokumen meja lab yang jelas, tab navigasi rapi, dan highlight langkah eksperimen.
            </p>
          </div>

          <LabNotebookCard
            title="Digitize your lab, automate workflows, and increase productivity with AI"
            descriptionItems={[
              "Plan, record, and share experiments using a collaborative, cloud-based notebook.",
              "Cut manual and repetitive work with automated workflows and analytics.",
              "Use AI tools to work more efficiently.",
            ]}
            ctaText="Read more"
            notebookTitle="[NGS] Sample Collection and Prep"
            badgeStatus="In Progress"
          />
        </section>

        {/* 6. Typography Deep-Dive: Niche, Clean, Non-Lebay Fonts */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-5">
            <div className="inline-flex items-center space-x-2 text-blue-700 bg-blue-50 px-3 py-1 rounded-lg text-xs font-semibold mb-2">
              <Info className="w-3.5 h-3.5" />
              <span>Niche Typography Guide for Gen X &amp; Millennials</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0a192f]">
              Mengapa Pilihan Font Ini Terasa Bersih &amp; Terpercaya?
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Font di bawah ini dipilih karena memiliki proporsi huruf yang seimbang (*balanced x-height*),
              angka tabular yang presisi untuk formula kimia, dan tidak memiliki kurva kekanak-kanakan.
            </p>
          </div>

          {/* Active Font Showcase Card */}
          <div className="p-6 rounded-2xl bg-[#f8fafc] border border-slate-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Current Active Font in DOM:
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0018a8] text-white">
                {selectedFontObj.name} ({selectedFontObj.category})
              </span>
            </div>

            <div className="text-xl sm:text-2xl font-bold text-slate-900">
              The quick brown fox jumps over the lazy dog. 0123456789
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-mono text-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>• Formula: SPF 30+ Hydrating Cream (40°C / 75% RH)</div>
              <div>• Viscosity: 5,420 mPa·s • Droplet Size: 138.4 nm</div>
              <div>• Active: Niacinamide 2.00% • Cetearyl Glucoside 3.00%</div>
              <div>• Compliance: PerBPOM No. 17/2022 [PASSED] • Halal HAS 23000</div>
            </div>
          </div>

          {/* Grid of all 6 Font Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {NICHE_FONTS.map((font) => (
              <div
                key={font.id}
                onClick={() => handleFontChange(font.cssClass, font.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  currentFontId === font.id
                    ? "border-[#0018a8] bg-blue-50/40 ring-2 ring-[#0018a8]/20"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-900 text-base">{font.name}</h4>
                  <span className="text-[10px] font-bold text-[#0018a8] bg-blue-100/80 px-2 py-0.5 rounded-full">
                    {font.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-3">{font.category}</p>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {font.description}
                </p>
                <div className={`${font.cssClass} text-sm font-medium text-slate-800 p-2.5 bg-slate-50 rounded-lg border border-slate-100 truncate`}>
                  Aa Bb Cc Gg 1234567890 (pH 5.5)
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Glassmorphism Elevation Specs */}
        <section className="bg-gradient-to-b from-white to-slate-50 rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#0a192f]">
              Spesifikasi Glassmorphism untuk Elemen High Z-Index
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              Sesuai arahan, elemen yang memiliki `z-index` tinggi (Modal dialog, cookie banner, dan mega menu)
              menerapkan efek *frosted glass* halus (`backdrop-blur-2xl bg-white/90`) agar terpisah tegas dari konten di bawahnya tanpa terkesan norak.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="font-bold text-slate-800 block">1. MegaMenu (z-40 / z-50)</span>
              <p className="text-slate-600">
                `backdrop-blur-2xl bg-white/92 border border-slate-200/80 shadow-2xl`
              </p>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium inline-block">
                Hover &quot;Products&quot; di Navbar
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="font-bold text-slate-800 block">2. High-Z Modal (z-50)</span>
              <p className="text-slate-600">
                `backdrop-blur-2xl bg-white/90 border border-white/90 shadow-2xl`
              </p>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="text-[11px] text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded font-semibold inline-block"
              >
                Klik untuk Buka Modal ➔
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="font-bold text-slate-800 block">3. Cookie Banner (z-50)</span>
              <p className="text-slate-600">
                `backdrop-blur-2xl bg-white/90 border border-white/80 shadow-2xl rounded-3xl`
              </p>
              <span className="text-[11px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-medium inline-block">
                Melayang di Bawah Layar
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* 8. Interactive High-Z Glassmorphic Modal Dialog */}
      <HighZModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Configure In-Silico Formulation Run"
      />

      {/* 9. Floating Cookie Consent Banner (Benchling Image 2 Style) */}
      <CookieConsentModal
        forceOpen={cookieBannerVisible}
        onAccept={() => setCookieBannerVisible(false)}
        onReject={() => setCookieBannerVisible(false)}
      />
    </div>
  );
}
