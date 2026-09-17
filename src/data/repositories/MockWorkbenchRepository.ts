import { IWorkbenchRepository } from "@/domain/repositories/IWorkbenchRepository";
import {
  WorkbenchIngredient,
  WorkbenchFormulaState,
  SensitivityRadarMetrics,
} from "@/domain/models/workbench";
import { COSMETIC_INGREDIENTS_CATALOG } from "../mock/ingredientsCatalog";

export class MockWorkbenchRepository implements IWorkbenchRepository {
  async getIngredients(filters?: {
    phase?: string;
    role?: string;
    query?: string;
  }): Promise<WorkbenchIngredient[]> {
    await new Promise((r) => setTimeout(r, 60)); // Fast mock response

    let list = COSMETIC_INGREDIENTS_CATALOG.map((item) => ({
      id: item.id,
      name: item.name,
      inci: item.inci,
      smiles: item.smiles,
      weightPct: item.defaultWeightPct,
      phase: item.defaultPhase,
      role: item.role as any,
      hlb: item.role === "emulsifier" ? 11.0 : item.role === "emollient" ? 6.5 : undefined,
      costPerKgIdr: item.role === "solvent" ? 2500 : item.role === "active" ? 185000 : 85000,
      tkdnPct: item.role === "solvent" ? 100 : item.id.includes("centella") || item.id.includes("curcuma") ? 85 : 30,
      isLocked: false,
      bpomLimitPct: item.inci.toLowerCase().includes("phenoxyethanol") ? 1.0 : undefined,
    }));

    if (filters?.phase) {
      list = list.filter((i) => i.phase === filters.phase);
    }
    if (filters?.role && filters.role !== "all") {
      list = list.filter((i) => i.role === filters.role);
    }
    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.inci.toLowerCase().includes(q) ||
          i.role.toLowerCase().includes(q)
      );
    }

    return list;
  }

  async calculateMoments(
    ingredients: WorkbenchIngredient[],
    batchSizeG: number
  ): Promise<Partial<WorkbenchFormulaState>> {
    // Pure thermodynamic and physical chemistry approximation
    const totalWeight = ingredients.reduce((sum, i) => sum + i.weightPct, 0);

    const oilIngredients = ingredients.filter((i) => i.phase === "A");
    const oilWeight = oilIngredients.reduce((sum, i) => sum + i.weightPct, 0);

    const emulsifierIngredients = ingredients.filter((i) => i.phase === "C");
    const emulsifierWeight = emulsifierIngredients.reduce((sum, i) => sum + i.weightPct, 0);

    // Required HLB calculation
    const requiredHlb = oilIngredients.length > 0 ? 8.5 : 0;

    // System HLB (mass weighted)
    let systemHlb = 0;
    if (emulsifierWeight > 0) {
      const weightedHlbSum = emulsifierIngredients.reduce(
        (sum, i) => sum + (i.hlb ?? 10.0) * i.weightPct,
        0
      );
      systemHlb = Math.round((weightedHlbSum / emulsifierWeight) * 10) / 10;
    }

    const deltaHlb = Math.round(Math.abs(systemHlb - requiredHlb) * 10) / 10;
    const sorRatio = oilWeight > 0 ? Math.round((emulsifierWeight / oilWeight) * 100) / 100 : 0;

    // Estimated COGS / kg
    const totalCost = ingredients.reduce((sum, i) => {
      const unitCost = i.costPerKgIdr ?? 45000;
      return sum + (unitCost * i.weightPct) / 100;
    }, 0);

    // TKDN weighted average
    const tkdnWeightedSum = ingredients.reduce((sum, i) => {
      return sum + (i.tkdnPct ?? 25.0) * i.weightPct;
    }, 0);
    const averageTkdn = totalWeight > 0 ? Math.round(tkdnWeightedSum / totalWeight) : 0;

    // Radar Metrics (0.0 to 1.0)
    const hlbScore = Math.max(0, Math.min(1.0, 1.0 - deltaHlb / 8.0));
    const sorScore = Math.max(0, Math.min(1.0, sorRatio >= 0.25 ? 0.95 : sorRatio * 3.5));
    const thickenerWeight = ingredients
      .filter((i) => i.role === "thickener")
      .reduce((sum, i) => sum + i.weightPct, 0);
    const viscScore = Math.max(0.2, Math.min(1.0, 0.4 + thickenerWeight * 0.4));
    const costScore = Math.max(0.1, Math.min(1.0, 1.0 - totalCost / 250000));
    const tkdnScore = Math.max(0, Math.min(1.0, averageTkdn / 100.0));

    const radarMetrics: SensitivityRadarMetrics = {
      hlbEquilibrium: Math.round(hlbScore * 100) / 100,
      surfactantEfficiency: Math.round(sorScore * 100) / 100,
      viscosityPotential: Math.round(viscScore * 100) / 100,
      costEfficiency: Math.round(costScore * 100) / 100,
      tkdnScore: Math.round(tkdnScore * 100) / 100,
    };

    return {
      totalWeightPct: Math.round(totalWeight * 100) / 100,
      isBalanced: Math.abs(totalWeight - 100.0) <= 0.05,
      systemHlb,
      requiredHlb,
      deltaHlb,
      sorRatio,
      estimatedCogsPerKgIdr: Math.round(totalCost),
      averageTkdnPct: averageTkdn,
      radarMetrics,
    };
  }

  async saveFormula(
    formula: WorkbenchFormulaState
  ): Promise<{ id: string; savedAt: string }> {
    await new Promise((r) => setTimeout(r, 200));
    return {
      id: `form_wb_${Date.now()}`,
      savedAt: new Date().toISOString(),
    };
  }
}
