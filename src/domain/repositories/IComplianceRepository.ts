import {
  ComplianceAuditReport,
  IngredientAuditItem,
  RagChatMessage,
} from "../models/compliance";
import { IngredientInput } from "../models/simulation";

export interface IComplianceRepository {
  /**
   * Run hybrid regulatory audit (Deterministic + Vector RAG + LLM Reasoning)
   */
  auditFormula(
    formulaName: string,
    category: string,
    ingredients: IngredientInput[]
  ): Promise<ComplianceAuditReport>;

  /**
   * Query the Vector RAG BPOM & Halal knowledge base with LLM answer synthesis
   */
  askRagKnowledge(
    query: string,
    categoryContext?: string
  ): Promise<RagChatMessage>;
}
