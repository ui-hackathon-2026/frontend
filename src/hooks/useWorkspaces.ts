"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { WorkspaceItem } from "@/domain/models/workspace";
import { FormulaItemResponse } from "@/domain/models/formula";
import { getWorkspaceRepository, getFormulaRepository } from "@/data/di/container";
import { PageSize } from "@/components/shared/Pagination";

export type WorkspaceSortKey = "updated" | "created" | "name";
export type WorkspaceViewMode = "grid" | "list";

const FETCH_LIMIT = 2000;

export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>([]);
  const [formulasById, setFormulasById] = useState<Record<string, FormulaItemResponse>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<WorkspaceSortKey>("updated");
  const [viewMode, setViewMode] = useState<WorkspaceViewMode>("grid");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(10);

  const workspaceRepo = getWorkspaceRepository();
  const formulaRepo = getFormulaRepository();

  const load = useCallback(() => {
    setIsLoading(true);
    setError(null);
    Promise.all([workspaceRepo.listWorkspaces(FETCH_LIMIT), formulaRepo.listFormulas(FETCH_LIMIT)])
      .then(([wsList, formulaList]) => {
        setWorkspaces(wsList);
        setFormulasById(
          Object.fromEntries(formulaList.map((f) => [f.formula_id, f]))
        );
      })
      .catch(() => setError("Gagal memuat daftar workspace. Coba muat ulang."))
      .finally(() => setIsLoading(false));
  }, [workspaceRepo, formulaRepo]);

  useEffect(() => {
    load();
  }, [load]);

  const filteredWorkspaces = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = workspaces;
    if (q) {
      list = list.filter((w) => w.name.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name);
      if (sortKey === "created")
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [workspaces, query, sortKey]);

  // Reset to page 1 whenever the filtered result set changes shape.
  useEffect(() => {
    setPage(1);
  }, [query, sortKey, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredWorkspaces.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedWorkspaces = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredWorkspaces.slice(start, start + pageSize);
  }, [filteredWorkspaces, currentPage, pageSize]);

  return {
    workspaces: paginatedWorkspaces,
    totalCount: workspaces.length,
    filteredCount: filteredWorkspaces.length,
    formulasById,
    isLoading,
    error,
    query,
    setQuery,
    sortKey,
    setSortKey,
    viewMode,
    setViewMode,
    page: currentPage,
    setPage,
    pageSize,
    setPageSize,
    reload: load,
  };
}
