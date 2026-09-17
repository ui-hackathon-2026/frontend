"use client";

import React from "react";
import { useEditor } from "@/contexts/EditorContext";
import { EmptyState } from "@/components/EmptyState";
import { X, FileText, Zap, ShieldCheck, Thermometer, Compass, ChevronRight, Clock } from "lucide-react";

export const ArtifactsListModal: React.FC = () => {
  const {
    activeDraft,
    artifactsListModalOpen,
    setArtifactsListModalOpen,
    viewArtifact,
  } = useEditor();

  if (!artifactsListModalOpen) return null;

  const artifacts = activeDraft.artifacts;

  const getIcon = (type: string) => {
    switch (type) {
      case "pareto":
        return <Zap className="w-4 h-4 text-indigo-600" />;
      case "sentinel":
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case "simulation":
        return <Thermometer className="w-4 h-4 text-rose-600" />;
      case "similarity":
        return <Compass className="w-4 h-4 text-blue-600" />;
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
                {activeDraft.name} • {artifacts.length} Dokumen Tersedia
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {artifacts.length === 0 ? (
            <div className="py-8 text-center">
              <EmptyState
                title="Belum Ada Artifact"
                description="Draft ini belum memiliki report tersimpan. Klik tombol (+) pada bilah chat di bawah untuk menjalankan analitik komputasi."
              />
            </div>
          ) : (
            artifacts.map((art) => (
              <div
                key={art.id}
                onClick={() => viewArtifact(art)}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-[#001299] bg-white hover:bg-blue-50/30 transition-all flex items-center justify-between gap-3 cursor-pointer group shadow-2xs"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 group-hover:bg-white transition-colors shrink-0 mt-0.5">
                    {getIcon(art.type)}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-extrabold text-[#0a192f] group-hover:text-[#001299] transition-colors block truncate">
                      {art.title}
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {art.subtitle}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{art.createdAt}</span>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#001299] group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end shrink-0">
          <button
            type="button"
            onClick={() => setArtifactsListModalOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
