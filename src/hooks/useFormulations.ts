"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { FormulaItemResponse } from "@/domain/models/formula";
import { getFormulaRepository } from "@/data/di/container";
import { PageSize } from "@/components/shared/Pagination";

export type FormulationSortKey = "updated" | "name" | "weight";

const FETCH_LIMIT = 2000;

export function useFormulations() {
  const [formulas, setFormulas] = useState<FormulaItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<FormulationSortKey>("updated");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(25);

  const formulaRepo = getFormulaRepository();

  const load = useCallback(() => {
    setIsLoading(true);
    setError(null);
    formulaRepo
      .listFormulas(FETCH_LIMIT)
      .then(setFormulas)
      .catch(() => setError("Gagal memuat daftar formulasi. Coba muat ulang."))
      .finally(() => setIsLoading(false));
  }, [formulaRepo]);

  useEffect(() => {
    load();
  }, [load]);

  const categories = useMemo(
    () =>
      Array.from(new Set(formulas.map((f) => f.category).filter(Boolean))) as string[],
    [formulas]
  );

  const statuses = useMemo(
    () => Array.from(new Set(formulas.map((f) => f.status))),
    [formulas]
  );

  const filteredFormulas = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = formulas;
    if (q) list = list.filter((f) => f.name.toLowerCase().includes(q));
    if (categoryFilter !== "all") list = list.filter((f) => f.category === categoryFilter);
    if (statusFilter !== "all") list = list.filter((f) => f.status === statusFilter);

    return [...list].sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name);
      if (sortKey === "weight") return b.total_weight_pct - a.total_weight_pct;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }, [formulas, query, categoryFilter, statusFilter, sortKey]);

  // Reset to page 1 whenever the filtered result set changes shape.
  useEffect(() => {
    setPage(1);
  }, [query, categoryFilter, statusFilter, sortKey, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredFormulas.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedFormulas = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredFormulas.slice(start, start + pageSize);
  }, [filteredFormulas, currentPage, pageSize]);

  return {
    formulas: paginatedFormulas,
    totalCount: formulas.length,
    filteredCount: filteredFormulas.length,
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
    page: currentPage,
    setPage,
    pageSize,
    setPageSize,
    reload: load,
  };
}
