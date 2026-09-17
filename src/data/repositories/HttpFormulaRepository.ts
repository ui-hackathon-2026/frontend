import { IFormulaRepository } from "@/domain/repositories/IFormulaRepository";
import {
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
    payload: FormulaUpdatePayload
  ): Promise<FormulaItemResponse> {
    const controller = new AbortController();
    const timeoutMs = 15000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
    try {
      const response = await fetch(`${baseUrl}/api/v1/formulas/${formulaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        let errData: any;
        try {
          errData = await response.json();
        } catch {
          errData = await response.text();
        }
        throw new Error(
          typeof errData?.detail === "string"
            ? errData.detail
            : `Gagal memperbarui formula (${response.status})`
        );
      }
      return (await response.json()) as FormulaItemResponse;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  async deleteFormula(formulaId: string): Promise<void> {
    const controller = new AbortController();
    const timeoutMs = 15000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
    try {
      const response = await fetch(`${baseUrl}/api/v1/formulas/${formulaId}`, {
        method: "DELETE",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok && response.status !== 204) {
        throw new Error(`Gagal menghapus formula (${response.status})`);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  async listVersions(formulaId: string): Promise<FormulaVersionItem[]> {
    return this.client.get<FormulaVersionItem[]>(`/api/v1/formulas/${formulaId}/versions`);
  }
}
