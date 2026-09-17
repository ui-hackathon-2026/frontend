"use client";

import { useState, useCallback, useEffect } from "react";
import {
  ParetoObjectiveWeights,
  ParetoConstraints,
  ParetoPresetId,
  ParetoOptimizationResult,
  ParetoTrialPoint,
} from "@/domain/models/optimizer";
import { getOptimizerRepository } from "@/data/di/container";

const DEFAULT_WEIGHTS: ParetoObjectiveWeights = {
  stabilityWeight: 35,
  cogsWeight: 30,
  tkdnWeight: 20,
  viscosityWeight: 15,
};

const DEFAULT_CONSTRAINTS: ParetoConstraints = {
  minStabilityPct: 85,
  maxCogsIdrPerKg: 45000,
  minTkdnPct: 40,
  targetViscosityMpaS: 5200,
};

export type ProjectionAxisMode =
  | "stability_cogs"
  | "stability_tkdn"
  | "cogs_tkdn";

export function useParetoOptimizer() {
  const [preset, setPreset] = useState<ParetoPresetId>("balanced");
  const [weights, setWeights] = useState<ParetoObjectiveWeights>(DEFAULT_WEIGHTS);
  const [constraints, setConstraints] = useState<ParetoConstraints>(DEFAULT_CONSTRAINTS);
  const [projectionAxis, setProjectionAxis] = useState<ProjectionAxisMode>("stability_cogs");
  const [selectedCandidateId, setSelectedCandidateId] = useState<"A" | "B" | "C" | null>("A");
  const [hoveredPoint, setHoveredPoint] = useState<ParetoTrialPoint | null>(null);

  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [result, setResult] = useState<ParetoOptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const repository = getOptimizerRepository();

  const selectPreset = useCallback((newPreset: ParetoPresetId) => {
    setPreset(newPreset);
    switch (newPreset) {
      case "balanced":
        setWeights({ stabilityWeight: 35, cogsWeight: 30, tkdnWeight: 20, viscosityWeight: 15 });
        setConstraints({ minStabilityPct: 85, maxCogsIdrPerKg: 42000, minTkdnPct: 40, targetViscosityMpaS: 5200 });
        break;
      case "cost_leader":
        setWeights({ stabilityWeight: 25, cogsWeight: 50, tkdnWeight: 15, viscosityWeight: 10 });
        setConstraints({ minStabilityPct: 80, maxCogsIdrPerKg: 28000, minTkdnPct: 40, targetViscosityMpaS: 5000 });
        break;
      case "max_stability":
        setWeights({ stabilityWeight: 55, cogsWeight: 15, tkdnWeight: 15, viscosityWeight: 15 });
        setConstraints({ minStabilityPct: 92, maxCogsIdrPerKg: 55000, minTkdnPct: 40, targetViscosityMpaS: 5500 });
        break;
      case "high_tkdn":
        setWeights({ stabilityWeight: 30, cogsWeight: 15, tkdnWeight: 45, viscosityWeight: 10 });
        setConstraints({ minStabilityPct: 85, maxCogsIdrPerKg: 48000, minTkdnPct: 55, targetViscosityMpaS: 5300 });
        break;
      case "custom":
        break;
    }
  }, []);

  const updateWeight = useCallback(
    <K extends keyof ParetoObjectiveWeights>(key: K, val: number) => {
      setPreset("custom");
      setWeights((prev) => ({ ...prev, [key]: val }));
    },
    []
  );

  const updateConstraint = useCallback(
    <K extends keyof ParetoConstraints>(key: K, val: number) => {
      setPreset("custom");
      setConstraints((prev) => ({ ...prev, [key]: val }));
    },
    []
  );

  const handleRunOptimization = useCallback(async () => {
    setIsOptimizing(true);
    setError(null);
    try {
      const res = await repository.runOptimization({
        weights,
        constraints,
        preset,
        trialsCount: 50000,
      });
      setResult(res);
      setSelectedCandidateId("A");
    } catch (err: any) {
      setError(err?.message || "Gagal menjalankan optimasi Pareto NSGA-II");
    } finally {
      setIsOptimizing(false);
    }
  }, [weights, constraints, preset, repository]);

  // Initial load: run initial optimization on mount
  useEffect(() => {
    handleRunOptimization();
  }, []); // Run once on initial load

  return {
    preset,
    selectPreset,
    weights,
    updateWeight,
    constraints,
    updateConstraint,
    projectionAxis,
    setProjectionAxis,
    selectedCandidateId,
    setSelectedCandidateId,
    hoveredPoint,
    setHoveredPoint,
    isOptimizing,
    result,
    error,
    handleRunOptimization,
  };
}
