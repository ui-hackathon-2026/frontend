"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Search, Beaker, Loader2 } from "lucide-react";
import { getFormulaRepository, getWorkspaceRepository } from "@/data/di/container";
import { FormulaItemResponse } from "@/domain/models/formula";

interface NewWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PAGE_SIZE = 20;
const SCROLL_THRESHOLD_PX = 48;
const SEARCH_DEBOUNCE_MS = 300;

export const NewWorkspaceModal: React.FC<NewWorkspaceModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [items, setItems] = useState<FormulaItemResponse[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingFirstPage, setIsLoadingFirstPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const requestSeq = useRef(0);

  // Reset the whole modal state on open.
  useEffect(() => {
    if (!isOpen) return;
    setName("");
    setQuery("");
    setDebouncedQuery("");
    setSelectedIds(new Set());
    setError(null);
  }, [isOpen]);

  // Debounce free-text search.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const loadPage = useCallback(
    async (targetOffset: number, replace: boolean) => {
      const seq = ++requestSeq.current;
      if (replace) setIsLoadingFirstPage(true);
      else setIsLoadingMore(true);
      try {
        const page = await getFormulaRepository().listFormulas(
          PAGE_SIZE,
          undefined,
          targetOffset,
          debouncedQuery || undefined
        );
        if (seq !== requestSeq.current) return; // stale response, a newer search/open superseded it
        setItems((prev) => (replace ? page : [...prev, ...page]));
        setOffset(targetOffset + page.length);
        setHasMore(page.length === PAGE_SIZE);
        setError(null);
      } catch {
        if (seq !== requestSeq.current) return;
        setError("Gagal memuat daftar formulasi.");
      } finally {
        if (seq !== requestSeq.current) return;
        setIsLoadingFirstPage(false);
        setIsLoadingMore(false);
      }
    },
    [debouncedQuery]
  );

  // (Re)load the first page whenever the modal opens or the search settles.
  useEffect(() => {
    if (!isOpen) return;
    setItems([]);
    setOffset(0);
    setHasMore(true);
    if (listRef.current) listRef.current.scrollTop = 0;
    loadPage(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, debouncedQuery]);

  const handleScroll = () => {
    const el = listRef.current;
    if (!el || isLoadingMore || isLoadingFirstPage || !hasMore) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < SCROLL_THRESHOLD_PX) {
      loadPage(offset, false);
    }
  };

  const toggleSelected = (formulaId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(formulaId)) next.delete(formulaId);
      else next.add(formulaId);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!name.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const workspace = await getWorkspaceRepository().createWorkspace({
        name: name.trim(),
        mode: "new",
      });

      const formulaRepo = getFormulaRepository();
      await Promise.all(
        Array.from(selectedIds).map((formulaId) =>
          formulaRepo.importFormulaToProject(formulaId, workspace.projectId)
        )
      );

      onClose();
      router.push(`/editor?workspace=${workspace.projectId}`);
    } catch {
      setError("Gagal membuat workspace. Coba lagi.");
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xl z-10 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-[#001299]">
              <Beaker className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#0a192f]">Workspace Baru</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="py-5 space-y-4 overflow-y-auto min-h-0">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Nama Workspace</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="mis. Emina — Serum Niacinamide v2"
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Formulasi Awal <span className="font-normal text-slate-400">(opsional)</span>
            </label>
            <p className="text-[11px] text-slate-400">
              Cari formulasi yang sudah ada untuk langsung dimasukkan ke workspace ini.
            </p>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari formulasi…"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder:text-slate-400"
              />
            </div>

            <div
              ref={listRef}
              onScroll={handleScroll}
              className="rounded-2xl border border-slate-200/80 max-h-56 overflow-y-auto divide-y divide-slate-50"
            >
              {isLoadingFirstPage ? (
                <div className="p-4 text-center text-xs text-slate-400">Memuat formulasi…</div>
              ) : items.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  {debouncedQuery ? "Tidak ada formulasi yang cocok." : "Belum ada formulasi tersedia."}
                </div>
              ) : (
                <>
                  {items.map((f) => (
                    <label
                      key={f.formula_id}
                      className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-blue-50/40 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.has(f.formula_id)}
                        onChange={() => toggleSelected(f.formula_id)}
                        className="w-3.5 h-3.5 rounded border-slate-300 text-[#001299] focus:ring-blue-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-800 truncate">{f.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {f.category || "—"} • {f.total_weight_pct.toFixed(0)}%
                        </p>
                      </div>
                    </label>
                  ))}
                  {isLoadingMore && (
                    <div className="p-2.5 text-center text-[11px] text-slate-400">Memuat lagi…</div>
                  )}
                </>
              )}
            </div>

            {selectedIds.size > 0 && (
              <p className="text-[11px] text-[#001299] font-semibold">
                {selectedIds.size} formulasi dipilih
              </p>
            )}
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!name.trim() || isSubmitting}
            className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[#001299] text-white hover:bg-[#000e7a] shadow-sm transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Buat Workspace</span>
          </button>
        </div>
      </div>
    </div>
  );
};
