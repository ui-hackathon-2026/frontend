"use client";

import React from "react";
import { Type, Sparkles, Check } from "lucide-react";

export interface FontOption {
  id: string;
  name: string;
  cssClass: string;
  category: string;
  description: string;
  badge: string;
}

export const NICHE_FONTS: FontOption[] = [
  {
    id: "paired",
    name: "Jakarta + Outfit",
    cssClass: "",
    category: "Official Dual Pairing",
    description: "Plus Jakarta Sans for large titles & headings, Outfit for body text and controls.",
    badge: "Official Standard",
  },
  {
    id: "jakarta",
    name: "Plus Jakarta Sans",
    cssClass: "font-jakarta",
    category: "Geometric Neo-Grotesque",
    description: "Modern, open counters, high x-height, super clean for data tables & scientific SaaS.",
    badge: "Display / Headings",
  },
  {
    id: "instrument",
    name: "Instrument Sans",
    cssClass: "font-instrument",
    category: "Precision Swiss Grotesque",
    description: "Refined metric balance, disciplined letterforms, feels authoritative & clinical.",
    badge: "Editorial Science",
  },
  {
    id: "dmsans",
    name: "DM Sans",
    cssClass: "font-dmsans",
    category: "Humanist & Approachable",
    description: "Maximum readability for Gen X & Millennials, zero visual strain during long lab sessions.",
    badge: "Maximum Ergonomics",
  },
  {
    id: "outfit",
    name: "Outfit",
    cssClass: "font-outfit",
    category: "Sophisticated Geometric",
    description: "Polished and subtle, gives enterprise software a premium yet friendly touch.",
    badge: "Clean Premium",
  },
  {
    id: "inter",
    name: "Inter",
    cssClass: "font-inter",
    category: "Universal Neutral Workhorse",
    description: "Engineered specifically for computer screens, flawless tabular numbers & micro-text.",
    badge: "Lab Benchmark",
  },
  {
    id: "geist",
    name: "Geist Sans",
    cssClass: "font-geist",
    category: "Technical Modern",
    description: "Structured, crisp spacing, developer-scientific precision.",
    badge: "Modern Technical",
  },
];

interface FontPickerToolbarProps {
  currentFont: string;
  onSelectFont: (fontClass: string, fontId: string) => void;
}

export const FontPickerToolbar: React.FC<FontPickerToolbarProps> = ({
  currentFont,
  onSelectFont,
}) => {
  return (
    <div className="w-full bg-slate-50 border-b border-slate-200/80 py-4 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-slate-800">
            <Type className="w-4 h-4 text-[#0018a8]" />
            <span>Niche & Clean Typography Selector:</span>
            <span className="text-slate-500 font-normal hidden md:inline">
              (Live preview on all components below)
            </span>
          </div>

          <span className="text-xs text-slate-500">
            Pilihan font yang sopan di mata, tidak lebay, ramah Gen X & Millennial
          </span>
        </div>

        {/* Font Selector Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {NICHE_FONTS.map((font) => {
            const isSelected = currentFont === font.cssClass;
            return (
              <button
                key={font.id}
                type="button"
                onClick={() => onSelectFont(font.cssClass, font.id)}
                className={`p-3 rounded-xl text-left border transition-all relative ${
                  isSelected
                    ? "bg-white border-[#0018a8] shadow-sm ring-2 ring-[#0018a8]/20"
                    : "bg-white/60 hover:bg-white border-slate-200/70 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-bold truncate ${
                      isSelected ? "text-[#0018a8]" : "text-slate-800"
                    }`}
                  >
                    {font.name}
                  </span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[#0018a8] shrink-0" />
                  )}
                </div>

                <div className="text-[10px] text-slate-500 truncate mb-1">
                  {font.category}
                </div>

                <div className="text-[9px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-md inline-block">
                  {font.badge}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
