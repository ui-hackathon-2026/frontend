"use client";

import React from "react";
import { X, CheckCircle2, ShieldCheck, Sparkles, Beaker } from "lucide-react";

interface HighZModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const HighZModal: React.FC<HighZModalProps> = ({
  isOpen,
  onClose,
  title = "Configure In-Silico Formulation Run",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop with frosted dark glass blur */}
      <div
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog with High-Z Glassmorphism */}
      <div className="relative w-full max-w-xl glass-modal rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 border border-white/90 shadow-2xl backdrop-blur-2xl transition-all z-10">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-[#0018a8]">
              <Beaker className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#0a192f]">
                {title}
              </h3>
              <p className="text-xs text-slate-500">
                Paragon R&D Emulsion Matrix Simulator
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="py-6 space-y-5 text-sm">
          {/* Target Profile */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Target Sediaan / Dosage Form
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Daily Gel-Cream", "Hydrating Lotion", "Velvet Serum"].map(
                (item, idx) => (
                  <button
                    key={item}
                    type="button"
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                      idx === 0
                        ? "bg-[#eff6ff] border-[#0018a8] text-[#0018a8] shadow-2xs"
                        : "bg-white/70 border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Form input fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Target SPF Rating
              </label>
              <input
                type="text"
                defaultValue="SPF 30+"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white/80 focus:bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0018a8]/20 focus:border-[#0018a8]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Target Viscosity (mPa·s)
              </label>
              <input
                type="text"
                defaultValue="4,500 – 6,500"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white/80 focus:bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0018a8]/20 focus:border-[#0018a8]"
              />
            </div>
          </div>

          {/* Compliance Callout Card */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start space-x-3 text-xs text-blue-900">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">Automated Guardrails Active</span>
              <p className="text-blue-800/80 leading-relaxed">
                Formula runs are screened against Perka BPOM No. 17/2022 and Halal HAS 23000 constraints automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-200/60 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-full text-sm font-semibold bg-[#001299] text-white hover:bg-[#000e7a] shadow-sm transition-all flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span>Start 50k Simulation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
