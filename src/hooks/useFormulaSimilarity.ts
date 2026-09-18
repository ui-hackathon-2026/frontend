"use client";

import { useCallback, useState } from "react";
import { FormulaItemResponse } from "@/domain/models/formula";
import { InternalSimilarityMatch, ExternalSimilarityResult } from "@/domain/models/similarity";
import { getSimilarityRepository } from "@/data/di/container";

interface SimilarityState {
  status: "idle" | "loading" | "loaded" | "error";
  internal: InternalSimilarityMatch[];
  external: ExternalSimilarityResult | null;
  error: string | null;
}

const EMPTY_STATE: SimilarityState = {
  status: "idle",
  internal: [],
  external: null,
  error: null,
};

export function useFormulaSimilarity() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [byFormulaId, setByFormulaId] = useState<Record<string, SimilarityState>>({});

  const repo = getSimilarityRepository();

  const load = useCallback(
    (formula: FormulaItemResponse) => {
      setByFormulaId((prev) => ({
        ...prev,
        [formula.formula_id]: { ...EMPTY_STATE, status: "loading" },
      }));

      const ingredients = formula.ingredients.map((i) => ({
        inci: i.inci,
        weight_pct: i.weight_pct,
        phase: i.phase as "A" | "B" | "C" | "D",
      }));

      Promise.all([
        repo.checkInternalSimilarity(ingredients, formula.formula_id),
        repo.checkExternalSimilarity(ingredients),
      ])
        .then(([internal, external]) => {
          setByFormulaId((prev) => ({
            ...prev,
            [formula.formula_id]: { status: "loaded", internal, external, error: null },
          }));
        })
        .catch(() => {
          setByFormulaId((prev) => ({
            ...prev,
            [formula.formula_id]: {
              ...EMPTY_STATE,
              status: "error",
              error: "Gagal memuat similarity. Coba lagi.",
            },
          }));
        });
    },
    [repo]
  );

  const toggle = useCallback(
    (formula: FormulaItemResponse) => {
      setExpandedId((prev) => {
        const next = prev === formula.formula_id ? null : formula.formula_id;
        if (next && !byFormulaId[formula.formula_id]) {
          load(formula);
        }
        return next;
      });
    },
    [byFormulaId, load]
  );

  const retry = useCallback(
    (formula: FormulaItemResponse) => load(formula),
    [load]
  );

  return {
    expandedId,
    stateFor: (formulaId: string): SimilarityState => byFormulaId[formulaId] ?? EMPTY_STATE,
    toggle,
    retry,
  };
}
