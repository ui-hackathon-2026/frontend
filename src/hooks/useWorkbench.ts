"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  WorkbenchIngredient,
  WorkbenchFormulaState,
  FormulationPhase,
  PhaseSummary,
} from "@/domain/models/workbench";
import { getWorkbenchRepository } from "@/data/di/container";

const DEFAULT_BENCHMARK_INGREDIENTS: WorkbenchIngredient[] = [
  {
    id: "ing-1",
    name: "Aqua Demineralisata",
    inci: "Aqua",
    smiles: "O",
    weightPct: 69.5,
    phase: "B",
    role: "solvent",
    hlb: 0,
    costPerKgIdr: 2500,
    tkdnPct: 100,
    isLocked: false,
  },
  {
    id: "ing-2",
    name: "Glycerin (Vegetable USP)",
    inci: "Glycerin",
    smiles: "C(C(CO)O)O",
    weightPct: 4.0,
    phase: "B",
    role: "humectant",
    costPerKgIdr: 32000,
    tkdnPct: 90,
    isLocked: false,
  },
  {
    id: "ing-3",
    name: "Simmondsia Chinensis Seed Oil",
    inci: "Simmondsia Chinensis Seed Oil",
    smiles: "CCCCCCCCC=CCCCCCCCC(=O)OCCCCCCCCCC=CCCCCCCCCC",
    weightPct: 8.0,
    phase: "A",
    role: "emollient",
    hlb: 6.5,
    costPerKgIdr: 480000,
    tkdnPct: 0,
    isLocked: false,
  },
  {
    id: "ing-4",
    name: "Squalane (Olive-Derived)",
    inci: "Squalane",
    smiles: "CC(C)CCCC(C)CCCC(C)CCCC(C)CCCC(C)C",
    weightPct: 5.0,
    phase: "A",
    role: "emollient",
    hlb: 11.0,
    costPerKgIdr: 650000,
    tkdnPct: 0,
    isLocked: false,
  },
  {
    id: "ing-5",
    name: "Cetearyl Olivate & Sorbitan Olivate",
    inci: "Cetearyl Olivate",
    smiles: "CCCCCCCCCCCCCCCCO[C@H]1[C@@H]([C@H]([C@@H]([C@H](O1)CO)O)O)O",
    weightPct: 4.5,
    phase: "C",
    role: "emulsifier",
    hlb: 9.0,
    costPerKgIdr: 280000,
    tkdnPct: 45,
    isLocked: false,
  },
  {
    id: "ing-6",
    name: "Centella Asiatica Leaf Extract",
    inci: "Centella Asiatica Extract",
    smiles: "C30H48O6",
    weightPct: 3.0,
    phase: "D",
    role: "active",
    costPerKgIdr: 350000,
    tkdnPct: 95,
    isLocked: false,
  },
  {
    id: "ing-7",
    name: "Niacinamide (Vitamin B3 USP)",
    inci: "Niacinamide",
    smiles: "C1=CC(=CN=C1)C(=O)N",
    weightPct: 2.0,
    phase: "D",
    role: "active",
    costPerKgIdr: 185000,
    tkdnPct: 0,
    isLocked: true, // Pin Niacinamide by default
  },
  {
    id: "ing-8",
    name: "Phenoxyethanol & Ethylhexylglycerin",
    inci: "Phenoxyethanol",
    smiles: "C1=CC=C(C=C1)OCCO",
    weightPct: 0.9,
    phase: "D",
    role: "preservative",
    costPerKgIdr: 140000,
    tkdnPct: 20,
    isLocked: true, // Pin preservative
    bpomLimitPct: 1.0,
  },
  {
    id: "ing-9",
    name: "Tocopherol Acetate (Vitamin E)",
    inci: "Tocopheryl Acetate",
    smiles: "CC1=C(C(=C2CCC(OC2=C1C)(C)CCCC(C)CCCC(C)CCCC(C)C)C)OC(=O)C",
    weightPct: 0.5,
    phase: "A",
    role: "active",
    costPerKgIdr: 420000,
    tkdnPct: 0,
    isLocked: false,
  },
  {
    id: "ing-10",
    name: "Carbomer 940",
    inci: "Carbomer",
    smiles: "C=CC(=O)O",
    weightPct: 0.3,
    phase: "B",
    role: "thickener",
    costPerKgIdr: 190000,
    tkdnPct: 0,
    isLocked: false,
  },
  {
    id: "ing-11",
    name: "Xanthan Gum (Bio-Ferment)",
    inci: "Xanthan Gum",
    smiles: "C12H20O10",
    weightPct: 0.3,
    phase: "B",
    role: "thickener",
    costPerKgIdr: 150000,
    tkdnPct: 60,
    isLocked: false,
  },
  {
    id: "ing-12",
    name: "Triethanolamine 99%",
    inci: "Triethanolamine",
    smiles: "C(CO)N(CCO)CCO",
    weightPct: 0.3,
    phase: "D",
    role: "active",
    costPerKgIdr: 65000,
    tkdnPct: 30,
    isLocked: false,
  },
  {
    id: "ing-13",
    name: "Disodium EDTA",
    inci: "Disodium EDTA",
    smiles: "C(CN(CC(=O)O)CC(=O)[O-])N(CC(=O)O)CC(=O)[O-].[Na+].[Na+]",
    weightPct: 0.1,
    phase: "B",
    role: "chelating",
    costPerKgIdr: 95000,
    tkdnPct: 0,
    isLocked: true,
  },
  {
    id: "ing-14",
    name: "Sodium Hyaluronate (Multi-MW)",
    inci: "Sodium Hyaluronate",
    smiles: "C14H20NNaO11",
    weightPct: 0.2,
    phase: "D",
    role: "active",
    costPerKgIdr: 1200000,
    tkdnPct: 0,
    isLocked: false,
  },
  {
    id: "ing-15",
    name: "Allantoin USP",
    inci: "Allantoin",
    smiles: "C4H6N4O3",
    weightPct: 0.4,
    phase: "D",
    role: "active",
    costPerKgIdr: 210000,
    tkdnPct: 0,
    isLocked: false,
  },
  {
    id: "ing-16",
    name: "Virgin Coconut Oil (VCO Riau)",
    inci: "Cocos Nucifera Oil",
    smiles: "CCCCCCCCCCCC(=O)OCC(COC(=O)CCCCCCCCCCC)OC(=O)CCCCCCCCCCC",
    weightPct: 1.0,
    phase: "A",
    role: "emollient",
    hlb: 8.0,
    costPerKgIdr: 45000,
    tkdnPct: 100,
    isLocked: false,
  },
];

export function useWorkbench() {
  const [formulaName, setFormulaName] = useState("Daily Hydrating Barrier Gel-Cream");
  const [category, setCategory] = useState("Gel-Cream");
  const [batchSizeG, setBatchSizeG] = useState(1000);
  const [ingredients, setIngredients] = useState<WorkbenchIngredient[]>(DEFAULT_BENCHMARK_INGREDIENTS);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activePhaseFilter, setActivePhaseFilter] = useState<FormulationPhase | "ALL">("ALL");

  const repository = getWorkbenchRepository();

  // Instant calculated state
  const totalWeightPct = useMemo(() => {
    const sum = ingredients.reduce((acc, i) => acc + i.weightPct, 0);
    return Math.round(sum * 100) / 100;
  }, [ingredients]);

  const isBalanced = useMemo(() => {
    return Math.abs(totalWeightPct - 100.0) <= 0.05;
  }, [totalWeightPct]);

  // Phase summaries
  const phaseSummaries: Record<FormulationPhase, PhaseSummary> = useMemo(() => {
    const base: Record<FormulationPhase, PhaseSummary> = {
      A: {
        phase: "A",
        label: "Fase A",
        name: "Fase Minyak / Lipofilik",
        totalWeightPct: 0,
        itemCount: 0,
        color: "text-amber-700 border-amber-300",
        bgColor: "bg-amber-50",
      },
      B: {
        phase: "B",
        label: "Fase B",
        name: "Fase Air & Polimer",
        totalWeightPct: 0,
        itemCount: 0,
        color: "text-blue-700 border-blue-300",
        bgColor: "bg-blue-50",
      },
      C: {
        phase: "C",
        label: "Fase C",
        name: "Emulgator & Surfaktan",
        totalWeightPct: 0,
        itemCount: 0,
        color: "text-purple-700 border-purple-300",
        bgColor: "bg-purple-50",
      },
      D: {
        phase: "D",
        label: "Fase D",
        name: "Bahan Aktif & Aditif",
        totalWeightPct: 0,
        itemCount: 0,
        color: "text-emerald-700 border-emerald-300",
        bgColor: "bg-emerald-50",
      },
    };

    ingredients.forEach((ing) => {
      const p = ing.phase in base ? ing.phase : "B";
      base[p].totalWeightPct += ing.weightPct;
      base[p].itemCount += 1;
    });

    // Round
    Object.values(base).forEach((b) => {
      b.totalWeightPct = Math.round(b.totalWeightPct * 100) / 100;
    });

    return base;
  }, [ingredients]);

  // Instant Physicochemical indicators
  const calculatedMoments = useMemo(() => {
    const oilWeight = phaseSummaries.A.totalWeightPct;
    const emulsifierWeight = phaseSummaries.C.totalWeightPct;

    const sorRatio = oilWeight > 0 ? Math.round((emulsifierWeight / oilWeight) * 100) / 100 : 0;
    const systemHlb = 9.0;
    const requiredHlb = 8.2;
    const deltaHlb = 0.8;

    const totalCost = ingredients.reduce((sum, i) => {
      const unitCost = i.costPerKgIdr ?? 45000;
      return sum + (unitCost * i.weightPct) / 100;
    }, 0);

    const tkdnWeighted = ingredients.reduce((sum, i) => {
      return sum + (i.tkdnPct ?? 25) * i.weightPct;
    }, 0);

    const averageTkdn = totalWeightPct > 0 ? Math.round(tkdnWeighted / totalWeightPct) : 0;

    return {
      sorRatio,
      systemHlb,
      requiredHlb,
      deltaHlb,
      estimatedCogsPerKgIdr: Math.round(totalCost),
      averageTkdnPct: averageTkdn,
      radar: {
        hlbEquilibrium: 0.9,
        surfactantEfficiency: Math.min(1.0, sorRatio >= 0.28 ? 0.95 : sorRatio * 3.2),
        viscosityPotential: 0.72,
        costEfficiency: Math.max(0.2, 1.0 - totalCost / 250000),
        tkdnScore: Math.min(1.0, averageTkdn / 100.0),
      },
    };
  }, [ingredients, phaseSummaries, totalWeightPct]);

  // Update ingredient weight with optional magnetic snap
  const updateIngredientWeight = useCallback((id: string, newWeight: number) => {
    setIngredients((prev) => {
      const ing = prev.find((i) => i.id === id);
      if (!ing) return prev;

      const maxVal = ing.role === "solvent" ? 95 : 30;
      const clamped = Math.max(0, Math.min(maxVal, Math.round(newWeight * 100) / 100));

      // Calculate others
      const others = prev.reduce((sum, item) => (item.id === id ? sum : sum + item.weightPct), 0);
      const snapTarget = Math.round((100.0 - others) * 100) / 100;

      let finalVal = clamped;
      // Silent snap if within 0.45%
      if (snapTarget >= 0 && snapTarget <= maxVal && Math.abs(clamped - snapTarget) <= 0.45) {
        finalVal = snapTarget;
      }

      return prev.map((item) => (item.id === id ? { ...item, weightPct: finalVal } : item));
    });
  }, []);

  // Toggle lock / pin
  const toggleLock = useCallback((id: string) => {
    setIngredients((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isLocked: !item.isLocked } : item))
    );
  }, []);

  // Auto-Balance via Aqua (Solvent in Phase B)
  const autoBalanceSolvent = useCallback(() => {
    setIngredients((prev) => {
      const aquaIndex = prev.findIndex((i) => i.role === "solvent" && i.phase === "B");
      if (aquaIndex === -1) return prev;

      const aquaItem = prev[aquaIndex];
      const othersWeight = prev.reduce(
        (sum, item, idx) => (idx === aquaIndex ? sum : sum + item.weightPct),
        0
      );

      const targetAquaWeight = Math.max(0, Math.round((100.0 - othersWeight) * 100) / 100);
      return prev.map((item, idx) =>
        idx === aquaIndex ? { ...item, weightPct: targetAquaWeight } : item
      );
    });
  }, []);

  // Normalize composition proportionally to 100.0% based on current ingredient ratios
  const normalizeComposition = useCallback(() => {
    setIngredients((prev) => {
      const currentSum = prev.reduce((acc, i) => acc + i.weightPct, 0);
      if (currentSum <= 0 || Math.abs(currentSum - 100.0) <= 0.05) return prev;

      // Proportional scaling rounded to 2 decimal places
      const scaled = prev.map((item) => ({
        ...item,
        weightPct: Math.round(((item.weightPct / currentSum) * 100) * 100) / 100,
      }));

      // Calculate any rounding residual (e.g. 99.98% or 100.02%)
      const scaledSum = Math.round(scaled.reduce((acc, i) => acc + i.weightPct, 0) * 100) / 100;
      const residual = Math.round((100.0 - scaledSum) * 100) / 100;

      if (residual !== 0) {
        // Adjust solvent or largest component to ensure exact 100.00% balance
        let targetIdx = scaled.findIndex((i) => i.role === "solvent" && i.phase === "B");
        if (targetIdx === -1) {
          let maxVal = -1;
          scaled.forEach((item, idx) => {
            if (item.weightPct > maxVal) {
              maxVal = item.weightPct;
              targetIdx = idx;
            }
          });
        }
        if (targetIdx !== -1) {
          scaled[targetIdx].weightPct =
            Math.round((scaled[targetIdx].weightPct + residual) * 100) / 100;
        }
      }

      return scaled;
    });
  }, []);

  // Add ingredient
  const addIngredient = useCallback((newIng: WorkbenchIngredient) => {
    setIngredients((prev) => [...prev, newIng]);
  }, []);

  // Remove ingredient
  const removeIngredient = useCallback((id: string) => {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  }, []);

  // Save formula draft
  const saveFormula = useCallback(async () => {
    setIsSaving(true);
    try {
      await repository.saveFormula({
        name: formulaName,
        category,
        batchSizeG,
        ingredients,
        totalWeightPct,
        isBalanced,
        systemHlb: calculatedMoments.systemHlb,
        requiredHlb: calculatedMoments.requiredHlb,
        deltaHlb: calculatedMoments.deltaHlb,
        sorRatio: calculatedMoments.sorRatio,
        estimatedCogsPerKgIdr: calculatedMoments.estimatedCogsPerKgIdr,
        averageTkdnPct: calculatedMoments.averageTkdnPct,
        radarMetrics: calculatedMoments.radar,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }, [
    repository,
    formulaName,
    category,
    batchSizeG,
    ingredients,
    totalWeightPct,
    isBalanced,
    calculatedMoments,
  ]);

  return {
    formulaName,
    setFormulaName,
    category,
    setCategory,
    batchSizeG,
    setBatchSizeG,
    ingredients,
    totalWeightPct,
    isBalanced,
    phaseSummaries,
    calculatedMoments,
    updateIngredientWeight,
    toggleLock,
    autoBalanceSolvent,
    normalizeComposition,
    addIngredient,
    removeIngredient,
    saveFormula,
    isSaving,
    saveSuccess,
    activePhaseFilter,
    setActivePhaseFilter,
  };
}
