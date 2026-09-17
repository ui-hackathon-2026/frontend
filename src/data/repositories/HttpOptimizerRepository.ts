import { IOptimizerRepository } from "@/domain/repositories/IOptimizerRepository";
import {
  ParetoOptimizationParams,
  ParetoOptimizationResult,
} from "@/domain/models/optimizer";

export class HttpOptimizerRepository implements IOptimizerRepository {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  }

  async runOptimization(
    params: ParetoOptimizationParams
  ): Promise<ParetoOptimizationResult> {
    const res = await fetch(`${this.baseUrl}/api/v1/optimizer/run-nsga2`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error("Gagal menjalankan komputasi Pareto NSGA-II");
    }

    return res.json();
  }
}
