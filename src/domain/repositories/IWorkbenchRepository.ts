import { WorkbenchIngredient, WorkbenchFormulaState } from "../models/workbench";

export interface IWorkbenchRepository {
  /**
   * Fetch lab stock ingredients
   */
  getIngredients(filters?: {
    phase?: string;
    role?: string;
    query?: string;
  }): Promise<WorkbenchIngredient[]>;

  /**
   * Calculate moments and radar metrics from ingredients list
   */
  calculateMoments(
    ingredients: WorkbenchIngredient[],
    batchSizeG: number
  ): Promise<Partial<WorkbenchFormulaState>>;

  /**
   * Save draft formula to backend
   */
  saveFormula(formula: WorkbenchFormulaState): Promise<{ id: string; savedAt: string }>;
}
