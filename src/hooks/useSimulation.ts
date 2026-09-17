"use client";

import { useState, useEffect, useCallback } from "react";
import {
  SimulationRequest,
  SimulationResult,
  IngredientInput,
  SimulationEngineType,
} from "@/domain/models/simulation";
import { getSimulationRepository } from "@/data/di/container";

export interface PresetOption {
  id: string;
  name: string;
  category: string;
  description: string;
  request: SimulationRequest;
}

export function useSimulation() {
  const [presets, setPresets] = useState<PresetOption[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");
  const [currentRequest, setCurrentRequest] = useState<SimulationRequest | null>(null);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const repository = getSimulationRepository();

  // Load presets on mount
  useEffect(() => {
    let mounted = true;
    repository.getPresetFormulas().then((data) => {
      if (!mounted) return;
      setPresets(data);
      if (data.length > 0) {
        setSelectedPresetId(data[0].id);
        setCurrentRequest(data[0].request);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const selectPreset = useCallback((presetId: string) => {
    setSelectedPresetId(presetId);
    const found = presets.find((p) => p.id === presetId);
    if (found) {
      setCurrentRequest({ ...found.request });
      setResult(null);
    }
  }, [presets]);

  const updateIngredientWeight = useCallback((ingredientId: string, newWeight: number) => {
    setResult(null);
    setCurrentRequest((prev) => {
      if (!prev) return null;
      const updatedIngredients = prev.ingredients.map((ing) => {
        if (ing.id === ingredientId) {
          return { ...ing, weightPct: Math.round(newWeight * 10) / 10 };
        }
        return ing;
      });
      return { ...prev, ingredients: updatedIngredients };
    });
  }, []);

  const updateTemperature = useCallback((temp: number) => {
    setResult(null);
    setCurrentRequest((prev) => (prev ? { ...prev, temperatureC: temp } : null));
  }, []);

  const updateDuration = useCallback((days: number) => {
    setResult(null);
    setCurrentRequest((prev) => (prev ? { ...prev, durationDays: days } : null));
  }, []);

  const updateEngine = useCallback((engine: SimulationEngineType) => {
    setResult(null);
    setCurrentRequest((prev) => (prev ? { ...prev, engine } : null));
  }, []);

  const runSimulation = useCallback(async () => {
    if (!currentRequest) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await repository.simulateStability(currentRequest);
      setResult(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Simulasi gagal dijalankan");
    } finally {
      setIsLoading(false);
    }
  }, [currentRequest, repository]);

  // Total formula weight
  const totalWeight = currentRequest
    ? currentRequest.ingredients.reduce((sum, i) => sum + i.weightPct, 0)
    : 0;

  return {
    presets,
    selectedPresetId,
    selectPreset,
    currentRequest,
    updateIngredientWeight,
    updateTemperature,
    updateDuration,
    updateEngine,
    runSimulation,
    result,
    isLoading,
    error,
    totalWeight: Math.round(totalWeight * 10) / 10,
  };
}
