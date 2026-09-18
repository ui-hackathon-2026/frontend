"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { DelayedInfoTooltip } from "@/components/DelayedInfoTooltip";
import { ShimmerSkeleton } from "@/components/ShimmerWidget";
import { EmptyState } from "@/components/EmptyState";
import { PhaseCompositionBar } from "@/components/shared/PhaseCompositionBar";
import { Pagination } from "@/components/shared/Pagination";
import { SimilarityPanel } from "@/components/formulation/SimilarityPanel";
import { useFormulations } from "@/hooks/useFormulations";
import { useFormulaSimilarity } from "@/hooks/useFormulaSimilarity";
import { Search, ArrowUpDown, FlaskConical, CheckCircle2, FileEdit, GitCompareArrows, ChevronUp } from "lucide-react";

function relativeDate(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr} jam lalu`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 30) return `${diffDay} hari lalu`;
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

const STATUS_META: Record<string, { label: string; className: string; icon: typeof CheckCircle2 }> = {
  VALID_BALANCED: {
    label: "Balanced",
    className: "bg-emerald-50 text-emerald-800 border-emerald-200",
    icon: CheckCircle2,
  },
  EMPTY_DRAFT: {
    label: "Draft Kosong",
    className: "bg-slate-50 text-slate-600 border-slate-200",
    icon: FileEdit,
  },
};

function statusMeta(status: string) {
  return (
    STATUS_META[status] ?? {
      label: status,
      className: "bg-amber-50 text-amber-800 border-amber-200",
      icon: FlaskConical,
    }
  );
}

function RowSkeleton() {
  return (
    <tr className="border-b border-slate-50 last:border-0">
      <td className="px-4 py-3"><ShimmerSkeleton className="w-40 h-3.5 rounded-lg" /></td>
      <td className="px-4 py-3"><ShimmerSkeleton className="w-16 h-3.5 rounded-lg" /></td>
      <td className="px-4 py-3"><ShimmerSkeleton className="w-20 h-5 rounded-full" /></td>
      <td className="px-4 py-3"><ShimmerSkeleton className="w-24 h-2.5 rounded-full" /></td>
      <td className="px-4 py-3"><ShimmerSkeleton className="w-12 h-3.5 rounded-lg" /></td>
      <td className="px-4 py-3"><ShimmerSkeleton className="w-16 h-3.5 rounded-lg ml-auto" /></td>
      <td className="px-4 py-3"><ShimmerSkeleton className="w-8 h-8 rounded-xl ml-auto" /></td>
    </tr>
  );
}

export default function FormulationPage() {
  const {
    formulas,
    filteredCount,
    categories,
    statuses,
    isLoading,
    error,
    query,
    setQuery,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    sortKey,
    setSortKey,
    page,
    setPage,
    pageSize,
    setPageSize,
  } = useFormulations();

  const { expandedId, stateFor, toggle, retry } = useFormulaSimilarity();

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col font-sans">
      <Navbar brandName="CoRamu" />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 w-full py-6 space-y-6">
        {/* Header */}
        <div className="border-b border-slate-200/80 pb-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0a192f] tracking-tight font-heading">
              Formulasi
            </h1>
            <DelayedInfoTooltip
              content="Semua formula 4-fase yang pernah dibuat tim R&D, lintas workspace. Lacak status mass-balance dan komposisi tiap formula di satu tempat."
              delayMs={300}
              position="right"
            />
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari formulasi…"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
            >
              <option value="all">Semua Status</option>
              {statuses.map((s) => (
                <option key={s} value={s}>{statusMeta(s).label}</option>
              ))}
            </select>

            <div className="relative">
              <ArrowUpDown className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as typeof sortKey)}
                className="appearance-none pl-7 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
              >
                <option value="updated">Terakhir diubah</option>
                <option value="name">Nama (A–Z)</option>
                <option value="weight">Total Berat %</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        {error ? (
          <EmptyState title="Gagal memuat formulasi" description={error} />
        ) : !isLoading && formulas.length === 0 ? (
          <EmptyState
            title={query || categoryFilter !== "all" || statusFilter !== "all" ? "Formulasi tidak ditemukan" : "Belum ada formulasi"}
            description={
              query || categoryFilter !== "all" || statusFilter !== "all"
                ? "Tidak ada formula yang cocok dengan filter saat ini. Coba ubah pencarian atau filter."
                : "Formula yang dibuat di Formulation Canvas atau Editor akan muncul di sini."
            }
          />
        ) : (
          <div className="relative rounded-2xl border border-slate-200/80 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[860px]">
              <thead>
                <tr className="border-b border-slate-100 bg-[#fafbfc]">
                  <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Nama Formula</th>
                  <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Kategori</th>
                  <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Komposisi Fase</th>
                  <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Batch</th>
                  <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Diubah</th>
                  <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Similarity</th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => <RowSkeleton key={i} />)
                  : formulas.map((f) => {
                      const meta = statusMeta(f.status);
                      const StatusIcon = meta.icon;
                      const isExpanded = expandedId === f.formula_id;
                      const hasIngredients = f.ingredients.length > 0;
                      const simState = stateFor(f.formula_id);
                      return (
                        <React.Fragment key={f.formula_id}>
                          <tr
                            className={`border-b border-slate-50 last:border-0 hover:bg-blue-50/30 transition-colors ${
                              isExpanded ? "bg-blue-50/40" : ""
                            }`}
                          >
                            <td className="px-4 py-3">
                              <Link
                                href={`/editor?formula=${f.formula_id}`}
                                className="text-xs font-bold text-[#0a192f] hover:text-[#001299]"
                              >
                                {f.name}
                              </Link>
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-500 capitalize">{f.category ?? "—"}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${meta.className}`}>
                                <StatusIcon className="w-3 h-3" />
                                {meta.label}
                              </span>
                            </td>
                            <td className="px-4 py-3 w-40">
                              {hasIngredients ? (
                                <PhaseCompositionBar formula={f} height="sm" />
                              ) : (
                                <span className="text-[10px] text-slate-300">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-500">{f.batch_size_g.toFixed(0)} g</td>
                            <td className="px-4 py-3 text-xs text-slate-500 text-right">{relativeDate(f.updated_at)}</td>
                            <td className="px-4 py-3 text-right">
                              <button
                                type="button"
                                disabled={!hasIngredients}
                                onClick={() => toggle(f)}
                                title={
                                  hasIngredients
                                    ? "Cek similarity dengan formula lain & produk kompetitor"
                                    : "Formula ini belum punya komposisi untuk dibandingkan"
                                }
                                className={`inline-flex items-center justify-center w-8 h-8 rounded-xl border transition-colors ${
                                  isExpanded
                                    ? "bg-[#001299] border-[#001299] text-white"
                                    : "bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:text-[#001299]"
                                } disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:text-slate-500`}
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-3.5 h-3.5" />
                                ) : (
                                  <GitCompareArrows className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr className="bg-[#fafbfc] border-b border-slate-100">
                              <td colSpan={7} className="p-0">
                                {/* Sticky so the panel stays in view even when the
                                    table itself is horizontally scrolled on mobile. */}
                                <div className="sticky left-0 w-[min(calc(100vw-2rem),64rem)] p-4">
                                  <SimilarityPanel
                                    status={simState.status}
                                    internal={simState.internal}
                                    external={simState.external}
                                    error={simState.error}
                                    onRetry={() => retry(f)}
                                  />
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
              </tbody>
              </table>
            </div>
            <div
              aria-hidden="true"
              className="lg:hidden pointer-events-none absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-white to-transparent"
            />
          </div>
        )}

        {!isLoading && !error && filteredCount > 0 && (
          <Pagination
            page={page}
            pageSize={pageSize}
            totalItems={filteredCount}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        )}
      </main>
    </div>
  );
}
