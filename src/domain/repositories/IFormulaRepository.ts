import {
  FormulaAdjustmentResponse,
  FormulaCreatePayload,
  FormulaItemResponse,
  FormulaUpdatePayload,
  FormulaVersionItem,
} from "../models/formula";

export interface IFormulaRepository {
  /**
   * List all saved formulas
   */
  listFormulas(limit?: number): Promise<FormulaItemResponse[]>;

  /**
   * Get single formula by formula_id
   */
  getFormula(formulaId: string): Promise<FormulaItemResponse>;

  /**
   * Create new formula draft with 4-phase composition
   */
  createFormula(payload: FormulaCreatePayload): Promise<FormulaItemResponse>;

  /**
   * Update existing formula (triggers append-only version snapshot in backend if createVersion is true)
   */
  updateFormula(
    formulaId: string,
    payload: FormulaUpdatePayload,
    createVersion?: boolean
  ): Promise<FormulaItemResponse>;

  /**
   * Propose AI-based formulation adjustment based on natural language prompt
   */
  proposeAdjustment(
    formulaId: string,
    prompt: string
  ): Promise<FormulaAdjustmentResponse>;

  /**
   * Delete formula by formula_id
   */
  deleteFormula(formulaId: string): Promise<void>;

  /**
   * Retrieve version history snapshots for audit trail / rollback
   */
  listVersions(formulaId: string): Promise<FormulaVersionItem[]>;
}
