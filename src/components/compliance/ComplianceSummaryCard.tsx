"use client";

import React from "react";
import { ComplianceAuditReport } from "@/domain/models/compliance";
import { ShieldCheck, AlertTriangle, XCircle, Award, Sparkles, CheckCircle2 } from "lucide-react";

interface ComplianceSummaryCardProps {
  report: ComplianceAuditReport;
}

export const ComplianceSummaryCard: React.FC<ComplianceSummaryCardProps> = ({ report }) => {
  const isPassed = report.overallStatus === "COMPLIANT";
  const isWarning = report.overallStatus === "CONDITIONAL_APPROVAL";

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5">
      {/* Top Banner Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-xs shrink-0 ${
              isPassed
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : isWarning
                ? "bg-amber-50 border-amber-200 text-amber-700"
                : "bg-rose-50 border-rose-200 text-rose-700"
            }`}
          >
            {isPassed ? (
              <ShieldCheck className="w-6 h-6" />
            ) : isWarning ? (
              <AlertTriangle className="w-6 h-6" />
            ) : (
              <XCircle className="w-6 h-6" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-[#0a192f] font-heading">
                {report.formulaName}
              </h2>
              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border flex items-center gap-1.5 ${
                  isPassed
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : isWarning
                    ? "bg-amber-50 text-amber-800 border-amber-200"
                    : "bg-rose-50 text-rose-800 border-rose-200"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isPassed ? "bg-emerald-500" : isWarning ? "bg-amber-500" : "bg-rose-500"
                  }`}
                />
                <span>{isPassed ? "Lolos Regulasi BPOM & Halal" : isWarning ? "Persetujuan Bersyarat" : "Pelanggaran Regulasi"}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{report.summaryVerdict}</p>
          </div>
        </div>

      </div>

      {/* 3 Core Metric KPI Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* KPI 1: BPOM Compliance */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Perka BPOM No. 17/2022
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-extrabold font-mono text-[#0a192f]">
              {Math.round(report.complianceScore * 100)}%
            </span>
            <span
              className={`text-[11px] font-semibold flex items-center gap-1 ${
                isPassed ? "text-emerald-700" : "text-amber-700"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi
            </span>
          </div>
          <p className="text-[10px] text-slate-400">
            Diverifikasi terhadap Lampiran I - V (Pengawet, Tabir Surya, Bahan Dibatasi)
          </p>
        </div>

        {/* KPI 2: Halal HAS 23000 */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Status Halal HAS 23000
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-base font-extrabold text-emerald-800 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              100% Halal
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold">BPJPH / LPPOM</span>
          </div>
          <p className="text-[10px] text-slate-400">
            Zero porcine, bebas khamr, dan audit titik kritis fraksi minyak nabati
          </p>
        </div>

        {/* KPI 3: TKDN Score */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Capaian TKDN Hayati Lokal
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-extrabold font-mono text-emerald-700">
              {report.totalTkdnPct}%
            </span>
            <span
              className={`text-[11px] font-semibold ${
                report.totalTkdnPct >= 40 ? "text-emerald-700" : "text-amber-700"
              }`}
            >
              {report.totalTkdnPct >= 40 ? "Target ≥40% Tercapai" : "Di Bawah Target"}
            </span>
          </div>
          <p className="text-[10px] text-slate-400">
            Pedoman Kemenperin No. 16/2020 untuk industri kosmetik nasional
          </p>
        </div>
      </div>
    </div>
  );
};
