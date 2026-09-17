import {
  ParetoOptimizationParams,
  ParetoOptimizationResult,
} from "@/domain/models/optimizer";

export interface IOptimizerRepository {
  runOptimization(params: ParetoOptimizationParams): Promise<ParetoOptimizationResult>;
}
