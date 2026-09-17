import { IWorkbenchRepository } from "@/domain/repositories/IWorkbenchRepository";
import {
  WorkbenchIngredient,
  WorkbenchFormulaState,
} from "@/domain/models/workbench";
import { ApiClient } from "../api/api-client";
import { MockWorkbenchRepository } from "./MockWorkbenchRepository";

export class HttpWorkbenchRepository implements IWorkbenchRepository {
  private apiClient: ApiClient;
  private fallbackMock: MockWorkbenchRepository;

  constructor(apiClient?: ApiClient) {
    this.apiClient = apiClient || new ApiClient();
    this.fallbackMock = new MockWorkbenchRepository();
  }

  async getIngredients(filters?: {
    phase?: string;
    role?: string;
    query?: string;
  }): Promise<WorkbenchIngredient[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.phase) params.append("phase", filters.phase);
      if (filters?.role) params.append("role", filters.role);
      if (filters?.query) params.append("q", filters.query);

      const qs = params.toString();
      const endpoint = `/api/v1/workbench/ingredients${qs ? `?${qs}` : ""}`;
      const response = await this.apiClient.get<{ items: WorkbenchIngredient[] }>(endpoint);
      return response.items;
    } catch (err) {
      console.warn("HttpWorkbenchRepository failed, falling back to mock:", err);
      return this.fallbackMock.getIngredients(filters);
    }
  }

  async calculateMoments(
    ingredients: WorkbenchIngredient[],
    batchSizeG: number
  ): Promise<Partial<WorkbenchFormulaState>> {
    try {
      const endpoint = "/api/v1/workbench/calculate-moments";
      const payload = {
        batch_size_g: batchSizeG,
        ingredients: ingredients.map((i) => ({
          id: i.id,
          name: i.name,
          inci: i.inci,
          smiles: i.smiles,
          weight_pct: i.weightPct,
          phase: i.phase,
          role: i.role,
          hlb: i.hlb,
          cost_per_kg_idr: i.costPerKgIdr,
          tkdn_pct: i.tkdnPct,
        })),
      };
      const response = await this.apiClient.post<any, any>(endpoint, payload);
      return {
        systemHlb: response.system_hlb,
        requiredHlb: response.required_hlb,
        deltaHlb: response.delta_hlb,
        sorRatio: response.sor_ratio,
        estimatedCogsPerKgIdr: response.estimated_cogs_per_kg_idr,
        averageTkdnPct: response.overall_tkdn_pct,
        radarMetrics: {
          hlbEquilibrium: response.radar_metrics.hlb_equilibrium,
          surfactantEfficiency: response.radar_metrics.surfactant_efficiency,
          viscosityPotential: response.radar_metrics.viscosity_potential,
          costEfficiency: response.radar_metrics.cost_efficiency,
          tkdnScore: response.radar_metrics.tkdn_score,
        },
      };
    } catch (err) {
      return this.fallbackMock.calculateMoments(ingredients, batchSizeG);
    }
  }

  async saveFormula(
    formula: WorkbenchFormulaState
  ): Promise<{ id: string; savedAt: string }> {
    try {
      const endpoint = "/api/v1/workbench/formulas";
      const payload = {
        name: formula.name,
        category: formula.category,
        batch_size_g: formula.batchSizeG,
        notes: formula.notes,
        ingredients: formula.ingredients.map((i) => ({
          id: i.id,
          name: i.name,
          inci: i.inci,
          smiles: i.smiles,
          weight_pct: i.weightPct,
          phase: i.phase,
          role: i.role,
          is_locked: i.isLocked,
        })),
      };
      return await this.apiClient.post<any, { id: string; savedAt: string }>(endpoint, payload);
    } catch (err) {
      return this.fallbackMock.saveFormula(formula);
    }
  }
}
