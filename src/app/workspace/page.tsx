"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { DelayedInfoTooltip } from "@/components/DelayedInfoTooltip";
import { ShimmerSkeleton } from "@/components/ShimmerWidget";
import { EmptyState } from "@/components/EmptyState";
import { PhaseCompositionBar } from "@/components/shared/PhaseCompositionBar";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { WorkspaceItem } from "@/domain/models/workspace";
import {
  Search,
  Plus,
  LayoutGrid,
  List as ListIcon,
  Beaker,
  ArrowUpDown,
} from "lucide-react";

function relativeDate(iso: string): string {
  const then = new Date(iso).getTime();
  const diffMs = Date.now() - then;
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr} jam lalu`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 30) return `${diffDay} hari lalu`;
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

const MODE_LABEL: Record<WorkspaceItem["mode"], { label: string; className: string }> = {
  new: { label: "Formula Baru", className: "bg-blue-50 text-[#001299] border-blue-200" },
  enhance: { label: "Enhance", className: "bg-purple-50 text-purple-700 border-purple-200" },
};

function WorkspaceCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 space-y-3">
      <ShimmerSkeleton className="w-full h-16 rounded-xl" />
      <ShimmerSkeleton className="w-3/4 h-4 rounded-lg" />
      <div className="flex items-center justify-between">
        <ShimmerSkeleton className="w-16 h-5 rounded-full" />
        <ShimmerSkeleton className="w-20 h-3 rounded-lg" />
      </div>
    </div>
  );
}

export default function WorkspacePage() {
  const { user } = useAuth();
  const {
    workspaces,
    totalCount,
    formulasById,
    isLoading,
    error,
    query,
    setQuery,
    sortKey,
    setSortKey,
    viewMode,
    setViewMode,
  } = useWorkspaces();

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col font-sans">
      <Navbar brandName="Paragon Studio" />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 w-full py-6 space-y-6">
        {/* Header */}
        <div className="border-b border-slate-200/80 pb-4 flex items-start justify-between gap-3">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0a192f] tracking-tight font-heading">
              Workspace
            </h1>
            <DelayedInfoTooltip
              content="Setiap workspace adalah satu proyek R&D per produk: brief, draft formulasi, dan riwayat versi tersimpan di sini. Buka untuk melanjutkan pekerjaan tim."
              delayMs={300}
              position="right"
            />
          </div>
          <Link
            href="/project-brief"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#001299] hover:bg-[#000e7a] text-white text-xs font-bold transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Workspace Baru</span>
          </Link>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari workspace…"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <ArrowUpDown className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as typeof sortKey)}
                className="appearance-none pl-7 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
              >
                <option value="updated">Terakhir diubah</option>
                <option value="created">Terbaru dibuat</option>
                <option value="name">Nama (A–Z)</option>
              </select>
            </div>

            <div className="flex items-center rounded-xl border border-slate-200 bg-white p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Tampilan grid"
                aria-pressed={viewMode === "grid"}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "grid" ? "bg-blue-50 text-[#001299]" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="Tampilan list"
                aria-pressed={viewMode === "list"}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "list" ? "bg-blue-50 text-[#001299]" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <ListIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <WorkspaceCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <EmptyState title="Gagal memuat workspace" description={error} />
        ) : workspaces.length === 0 ? (
          <EmptyState
            title={query ? "Workspace tidak ditemukan" : "Belum ada workspace"}
            description={
              query
                ? "Tidak ada workspace yang cocok dengan pencarian. Coba kata kunci lain."
                : "Mulai proyek formulasi baru lewat Project Brief Studio untuk membuat workspace pertama tim."
            }
          />
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {workspaces.map((ws) => {
              const formula = ws.refFormulaId ? formulasById[ws.refFormulaId] : undefined;
              const mode = MODE_LABEL[ws.mode];
              return (
                <Link
                  key={ws.projectId}
                  href={`/editor?workspace=${ws.projectId}`}
                  className="group rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col"
                >
                  {/* Preview slot */}
                  <div className="h-24 shrink-0 bg-[#fafbfc] border-b border-slate-100 flex flex-col justify-center px-4">
                    {formula ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-slate-500 truncate max-w-[70%]">
                            {formula.name}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {formula.total_weight_pct.toFixed(0)}%
                          </span>
                        </div>
                        <PhaseCompositionBar formula={formula} height="sm" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-300 group-hover:text-blue-200 transition-colors">
                        <Beaker className="w-6 h-6" />
                        <span className="text-[10px] text-slate-400">Belum ada formula tertaut</span>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-2.5 flex-1 flex flex-col">
                    <h3 className="text-sm font-bold text-[#0a192f] leading-snug line-clamp-2 group-hover:text-[#001299] transition-colors">
                      {ws.name}
                    </h3>
                    <span
                      className={`inline-flex items-center self-start px-2 py-0.5 rounded-full border text-[10px] font-bold ${mode.className}`}
                    >
                      {mode.label}
                    </span>
                    <div className="flex items-center justify-between pt-1 mt-auto">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-[#001299] text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                          {user?.avatarInitials ?? "—"}
                        </div>
                        <span className="text-[10px] text-slate-500">Diubah • {relativeDate(ws.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-[#fafbfc]">
                  <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Nama</th>
                  <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Mode</th>
                  <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Formula Tertaut</th>
                  <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Diubah</th>
                </tr>
              </thead>
              <tbody>
                {workspaces.map((ws) => {
                  const formula = ws.refFormulaId ? formulasById[ws.refFormulaId] : undefined;
                  const mode = MODE_LABEL[ws.mode];
                  return (
                    <tr key={ws.projectId} className="border-b border-slate-50 last:border-0 hover:bg-blue-50/30 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/editor?workspace=${ws.projectId}`} className="text-xs font-bold text-[#0a192f] hover:text-[#001299]">
                          {ws.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold ${mode.className}`}>
                          {mode.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {formula ? formula.name : "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 text-right">{relativeDate(ws.updatedAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && !error && workspaces.length > 0 && (
          <p className="text-[11px] text-slate-400">
            Menampilkan {workspaces.length} dari {totalCount} workspace
          </p>
        )}
      </main>
    </div>
  );
}
