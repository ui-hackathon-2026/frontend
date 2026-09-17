"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Clock,
  FileText,
  Calendar,
  CheckCircle2,
} from "lucide-react";

interface LabNotebookCardProps {
  title?: string;
  descriptionItems?: string[];
  ctaText?: string;
  notebookTitle?: string;
  badgeStatus?: string;
}

export const LabNotebookCard: React.FC<LabNotebookCardProps> = ({
  title = "Digitize your lab, automate workflows, and increase productivity with AI",
  descriptionItems = [
    "Plan, record, and share experiments using a collaborative, cloud-based notebook.",
    "Cut manual and repetitive work with automated workflows and analytics.",
    "Use AI tools to work more efficiently.",
  ],
  ctaText = "Read more",
  notebookTitle = "[NGS] Sample Collection and Prep",
  badgeStatus = "In Progress",
}) => {
  const [taskInfoOpen, setTaskInfoOpen] = useState(false);
  const [prepOpen, setPrepOpen] = useState(true);

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 lg:p-12 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Narrative & CTA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-[#0018a8]">
            <Sparkles className="w-5 h-5 text-blue-700" />
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0a192f] leading-tight">
            {title}
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            {descriptionItems.map((item, index) => (
              <p key={index}>{item}</p>
            ))}
          </div>

          <div className="pt-2">
            <a
              href="#read-more"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-sm font-semibold bg-[#001299] text-white hover:bg-[#000e7a] active:bg-[#000a5c] transition-all shadow-sm"
            >
              {ctaText}
            </a>
          </div>
        </div>

        {/* Right Column: Digital Lab Notebook UI Preview */}
        <div className="lg:col-span-7">
          <div className="bg-[#eff6ff] rounded-3xl p-4 sm:p-8 border border-blue-100 shadow-inner">
            {/* White Notebook Sheet */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
              {/* Notebook Top Tab Bar */}
              <div className="bg-slate-50/90 border-b border-slate-200 px-4 pt-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1">
                  <div className="bg-white border-t-2 border-t-blue-600 border-x border-slate-200 rounded-t-lg px-3 py-1.5 flex items-center space-x-2 font-medium text-slate-800 shadow-2xs">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>{notebookTitle}</span>
                  </div>
                </div>
                <div className="text-slate-400 font-mono text-[11px] hidden sm:block">
                  v2.4 — Certified Bench Protocol
                </div>
              </div>

              {/* Subtabs bar */}
              <div className="border-b border-slate-100 px-6 py-2 flex items-center space-x-6 text-xs font-semibold text-slate-500">
                <span className="text-blue-600 border-b-2 border-blue-600 pb-2 -mb-2">
                  NOTES
                </span>
                <span className="hover:text-slate-700 cursor-pointer">
                  RELEVANT ITEMS
                </span>
                <span className="hover:text-slate-700 cursor-pointer">
                  REVIEW
                </span>
                <span className="hover:text-slate-700 cursor-pointer">
                  METADATA
                </span>
              </div>

              {/* Notebook Inner Content */}
              <div className="p-6 space-y-4 text-xs sm:text-sm">
                {/* Entry Title with Status Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <FileText className="w-4 h-4 text-slate-700" />
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      {notebookTitle}
                    </h3>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-600 text-white">
                    ● {badgeStatus}
                  </span>
                </div>

                {/* Collapsible 1: Task Information */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                  <button
                    type="button"
                    onClick={() => setTaskInfoOpen(!taskInfoOpen)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-100/70 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      {taskInfoOpen ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <span>Task Information</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </div>
                    <div className="flex items-center space-x-1 text-slate-500 text-[11px]">
                      <Calendar className="w-3 h-3" />
                      <span>Wednesday, 7/31/2024</span>
                    </div>
                  </button>
                  {taskInfoOpen && (
                    <div className="p-3 bg-white border-t border-slate-200 text-xs text-slate-600 space-y-1">
                      <p>• Principal Scientist: Dr. F. L. Setiawan, M.Sc.</p>
                      <p>• Equipment: Brookfield Viscometer RVT & Climatic Chamber 40°C</p>
                    </div>
                  )}
                </div>

                {/* Collapsible 2: Sample Collection and Prep */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setPrepOpen(!prepOpen)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      {prepOpen ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <span className="font-semibold">Sample Collection and Prep</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </div>
                    <div className="flex items-center space-x-1 text-slate-500 text-[11px]">
                      <Clock className="w-3 h-3" />
                      <span>Wednesday, 7/31/2024</span>
                    </div>
                  </button>

                  {prepOpen && (
                    <div className="p-3.5 border-t border-slate-100 space-y-3">
                      <p className="text-slate-500 text-xs italic">
                        Insert your Sub-Template Method(s) into this section
                      </p>

                      {/* Sand/Beige Step Banner from Benchling Image 4 */}
                      <div className="bg-[#f4e6c3] border-l-4 border-amber-600/70 p-2.5 rounded-r-lg">
                        <span className="font-bold text-amber-950 text-xs tracking-wide">
                          Step 1: GEM Generation and Barcoding (Pages 30-41)
                        </span>
                      </div>

                      {/* Method User Guide reference */}
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center space-x-2 text-xs text-slate-600">
                        <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate font-mono text-[11px]">
                          CG000731_ChromiumGEM-X_SingleCell3_ReagentKits_v4_UserGuide_RevA.pdf
                        </span>
                      </div>

                      {/* 1.0 Preparation Box */}
                      <div className="bg-[#f4e6c3] border-l-4 border-amber-600/70 p-2.5 rounded-r-lg">
                        <span className="font-bold text-amber-950 text-xs tracking-wide">
                          1.0 Preparation
                        </span>
                      </div>

                      <div className="text-xs text-slate-700 space-y-1.5 pl-1 leading-relaxed">
                        <p>
                          Ensure Chromium X/IX firmware is version 2.0.0 or higher.
                        </p>
                        <p>
                          Equilibrate to room temperature (30 min before use):
                        </p>
                        <ul className="list-disc pl-5 text-slate-600 space-y-0.5 text-[11px]">
                          <li>GEM-X Single Cell 3&apos; Gel Bead v4</li>
                          <li>RT Reagent B</li>
                          <li>Template Switch Oligo B</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
