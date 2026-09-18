"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { FormulaItemResponse } from "@/domain/models/formula";
import { getFormulaRepository } from "@/data/di/container";

export type FormulationSortKey = "updated" | "name" | "weight";

export function useFormulations() {
  const [formulas, setFormulas] = useState<FormulaItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<FormulationSortKey>("updated");

  const formulaRepo = getFormulaRepository();

  const load = useCallback(() => {
    setIsLoading(true);
    setError(null);
    formulaRepo
      .listFormulas()
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

  return {
    formulas: filteredFormulas,
    totalCount: formulas.length,
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
    reload: load,
  };
}
