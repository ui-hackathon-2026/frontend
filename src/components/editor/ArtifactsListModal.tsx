"use client";

import React from "react";
import { useEditor } from "@/contexts/EditorContext";
import { EmptyState } from "@/components/EmptyState";
import { X, FileText, Zap, ShieldCheck, Thermometer, ChevronRight, Clock } from "lucide-react";

export const ArtifactsListModal: React.FC = () => {
  const {
    activeDraft,
    artifactsListModalOpen,
    setArtifactsListModalOpen,
    viewArtifact,
  } = useEditor();

  if (!artifactsListModalOpen) return null;

  const artifacts = activeDraft ? activeDraft.artifacts : [];

  const getIcon = (type: string) => {
    switch (type) {
      case "pareto":
        return <Zap className="w-4 h-4 text-indigo-600" />;
      case "sentinel":
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case "simulation":
        return <Thermometer className="w-4 h-4 text-rose-600" />;
      case "similarity":
        return <FileText className="w-4 h-4 text-blue-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in font-sans">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-[#001299] border border-blue-200/60">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#0a192f] tracking-tight font-heading">
                Riwayat Artifact &amp; Report
              </h3>
              <span className="text-[11px] text-slate-400 font-mono block">
                {activeDraft ? activeDraft.name : "Belum Ada Formula"} • {artifacts.length} Dokumen Tersedia
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setArtifactsListModalOpen(false)}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {artifacts.length === 0 ? (
            <EmptyState
              compact
              title="Belum Ada Dokumen Artifact"
              description="Jalankan simulasi 40°C, optimasi Pareto, atau audit regulasi melalui tombol (+) pada chat untuk menghasilkan lembar report komputasi."
            />
          ) : (
            artifacts.map((art) => (
              <div
                key={art.id}
                onClick={() => {
                  viewArtifact(art);
                  setArtifactsListModalOpen(false);
                }}
                className="group p-4 rounded-2xl border border-slate-200/80 hover:border-[#001299] hover:bg-blue-50/30 transition-all cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-white border border-slate-200 group-hover:border-blue-200 shadow-2xs shrink-0 mt-0.5">
                    {getIcon(art.type)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#001299] transition-colors truncate">
                      {art.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {art.subtitle}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-mono mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{art.createdAt}</span>
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#001299] group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Setiap artifact terikat pada draft formula aktif</span>
          <button
            type="button"
            onClick={() => setArtifactsListModalOpen(false)}
            className="px-4 py-1.5 rounded-xl font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};