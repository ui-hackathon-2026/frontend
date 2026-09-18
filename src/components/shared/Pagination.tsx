"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

interface PaginationProps {
  page: number;
  pageSize: PageSize;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: PageSize) => void;
}

function pageNumbers(current: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages: (number | "ellipsis")[] = [1];
  if (current > 3) pages.push("ellipsis");
  for (let p = Math.max(2, current - 1); p <= Math.min(totalPages - 1, current + 1); p++) {
    pages.push(p);
  }
  if (current < totalPages - 2) pages.push("ellipsis");
  pages.push(totalPages);
  return pages;
}

export function Pagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
      <div className="flex items-center gap-2 text-[11px] text-slate-500">
        <span>
          Menampilkan {startItem}–{endItem} dari {totalItems}
        </span>
        <span className="text-slate-300">•</span>
        <label className="flex items-center gap-1.5">
          <span>Per halaman</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value) as PageSize)}
            className="appearance-none pl-2 pr-6 py-1 text-[11px] rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            aria-label="Halaman sebelumnya"
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-[#001299] hover:border-blue-200 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {pageNumbers(page, totalPages).map((p, i) =>
            p === "ellipsis" ? (
              <span key={`e-${i}`} className="px-1.5 text-[11px] text-slate-400">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                aria-current={p === page ? "page" : undefined}
                className={`min-w-[26px] h-[26px] px-1.5 rounded-lg text-[11px] font-bold transition-colors ${
                  p === page
                    ? "bg-[#001299] text-white"
                    : "text-slate-600 border border-slate-200 bg-white hover:border-blue-200 hover:text-[#001299]"
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            aria-label="Halaman berikutnya"
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-[#001299] hover:border-blue-200 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
