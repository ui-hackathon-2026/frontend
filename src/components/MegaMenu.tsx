"use client";

import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";

interface MegaMenuProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="absolute top-full left-0 w-full z-50 pt-2 transition-all duration-200 animate-in fade-in slide-in-from-top-2"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="glass-dropdown rounded-2xl p-8 sm:p-10 border border-slate-200/80 shadow-2xl backdrop-blur-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
            {/* Column 1: Products */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold tracking-wider text-[#002df5] uppercase">
                Products
              </h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  "Product Overview",
                  "Benchling Bioresearch",
                  "Benchling Bioprocess",
                  "Benchling Automation",
                  "Benchling Biologics",
                  "Benchling In Vivo",
                  "PipeBio Antibodies",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-slate-800 hover:text-[#0018a8] font-medium transition-colors block py-0.5"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Platform */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold tracking-wider text-[#002df5] uppercase">
                Platform
              </h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  "Platform Overview",
                  "Validated Cloud",
                  "Developer Platform",
                  "Ecosystem Integrations",
                  "Security & Compliance (GxP)",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-slate-800 hover:text-[#0018a8] font-medium transition-colors block py-0.5"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Features */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold tracking-wider text-[#002df5] uppercase">
                Features
              </h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  "Lab Notebook",
                  "LIMS & Sample Tracking",
                  "Molecular Biology Tools",
                  "Registry & Inventory",
                  "Automated Workflows",
                  "AI Formulation Simulator",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-slate-800 hover:text-[#0018a8] font-medium transition-colors block py-0.5"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Success & Highlights */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold tracking-wider text-[#002df5] uppercase">
                  Success
                </h4>
                <ul className="space-y-2.5 text-sm mt-4">
                  {[
                    "Customer Success Packages",
                    "Professional Services",
                    "Scientific Advisory Board",
                    "Paragon Innovation Hub",
                  ].map((item) => (
                    <li key={item}>
                      <a
                        href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-slate-800 hover:text-[#0018a8] font-medium transition-colors block py-0.5"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Callout box inside mega menu */}
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border border-blue-100 text-xs">
                <div className="flex items-center space-x-1.5 text-[#0018a8] font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Benchling AI Assistant</span>
                </div>
                <p className="text-slate-600 mb-2 leading-relaxed">
                  Accelerate scientific experiment workflows with native LPU inference.
                </p>
                <a
                  href="#explore-ai"
                  className="text-[#0018a8] font-medium inline-flex items-center space-x-1 hover:underline"
                >
                  <span>Explore AI</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
