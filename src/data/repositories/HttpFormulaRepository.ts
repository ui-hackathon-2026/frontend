import { IFormulaRepository } from "@/domain/repositories/IFormulaRepository";
import {
  FormulaAdjustmentResponse,
  FormulaCreatePayload,
  FormulaItemResponse,
  FormulaUpdatePayload,
  FormulaVersionItem,
} from "@/domain/models/formula";
import { ApiClient } from "../api/api-client";

export class HttpFormulaRepository implements IFormulaRepository {
  private client: ApiClient;

  constructor(client?: ApiClient) {
    this.client = client || new ApiClient();
  }

  async listFormulas(limit: number = 50): Promise<FormulaItemResponse[]> {
    return this.client.get<FormulaItemResponse[]>(`/api/v1/formulas?limit=${limit}`);
  }

  async getFormula(formulaId: string): Promise<FormulaItemResponse> {
    return this.client.get<FormulaItemResponse>(`/api/v1/formulas/${formulaId}`);
  }

  async createFormula(payload: FormulaCreatePayload): Promise<FormulaItemResponse> {
    return this.client.post<FormulaCreatePayload, FormulaItemResponse>("/api/v1/formulas", payload);
  }

  async updateFormula(
    formulaId: string,
    payload: FormulaUpdatePayload,
    createVersion: boolean = true
  ): Promise<FormulaItemResponse> {
    return this.client.put<FormulaUpdatePayload, FormulaItemResponse>(
      `/api/v1/formulas/${formulaId}?create_version=${createVersion}`,
      payload
    );
  }

  async proposeAdjustment(
    formulaId: string,
    prompt: string
  ): Promise<FormulaAdjustmentResponse> {
    return this.client.post<{ prompt: string }, FormulaAdjustmentResponse>(
      `/api/v1/formulas/${formulaId}/propose-adjustment`,
      { prompt }
    );
  }

  async deleteFormula(formulaId: string): Promise<void> {
    return this.client.delete(`/api/v1/formulas/${formulaId}`);
  }

  async listVersions(formulaId: string): Promise<FormulaVersionItem[]> {
    return this.client.get<FormulaVersionItem[]>(`/api/v1/formulas/${formulaId}/versions`);
  }
}
