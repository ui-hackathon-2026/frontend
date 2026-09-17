import { IComplianceRepository } from "@/domain/repositories/IComplianceRepository";
import {
  ComplianceAuditReport,
  RagChatMessage,
} from "@/domain/models/compliance";
import { IngredientInput } from "@/domain/models/simulation";
import { ApiClient } from "../api/api-client";
import { MockComplianceRepository } from "./MockComplianceRepository";

export class HttpComplianceRepository implements IComplianceRepository {
  private apiClient: ApiClient;
  private fallbackMock: MockComplianceRepository;

  constructor(apiClient?: ApiClient) {
    this.apiClient = apiClient || new ApiClient();
    this.fallbackMock = new MockComplianceRepository();
  }

  async auditFormula(
    formulaName: string,
    category: string,
    ingredients: IngredientInput[]
  ): Promise<ComplianceAuditReport> {
    try {
      const endpoint = "/api/v1/compliance/audit";
      const payload = {
        formula_name: formulaName,
        category,
        ingredients: ingredients.map((i) => ({
          id: i.id,
          name: i.name,
          inci: i.inci,
          smiles: i.smiles,
          weight_pct: i.weightPct,
          phase: i.phase,
          role: i.role,
        })),
      };
      const response = await this.apiClient.post<any, any>(endpoint, payload);
      return {
        auditId: response.audit_id,
        formulaName: response.formula_name,
        category,
        overallStatus: response.overall_status,
        complianceScore: response.compliance_score,
        halalStatus: response.halal_status,
        totalTkdnPct: response.total_tkdn_pct,
        summaryVerdict: response.summary_verdict,
        ingredientsAudit: response.ingredients_audit.map((ia: any) => ({
          id: ia.ingredient_id,
          name: ia.name,
          inci: ia.inci,
          weightPct: ia.weight_pct,
          phase: ia.phase || "A",
          role: ia.role || "active",
          status: ia.status,
          bpomLimitPct: ia.bpom_limit_pct,
          halalStatus: ia.halal_status,
          tkdnPct: ia.tkdn_pct,
          ragCitation: ia.rag_citation
            ? {
                regulation: ia.rag_citation.regulation,
                appendix: ia.rag_citation.appendix,
                clauseNumber: ia.rag_citation.clause_number,
                excerpt: ia.rag_citation.excerpt,
              }
            : undefined,
          auditNotes: ia.audit_notes,
        })),
        llmReasoning: {
          toxicologyEvaluation: response.llm_reasoning.toxicology_evaluation,
          mandatoryLabelWarnings: response.llm_reasoning.mandatory_label_warnings,
          localSubstitutionRecommendations: response.llm_reasoning.local_substitution_recommendations.map(
            (r: any) => ({
              currentIngredient: r.current_ingredient,
              recommendedLocal: r.recommended_local,
              tkdnImpact: r.tkdn_impact || "+10% TKDN",
              rationale: r.rationale,
            })
          ),
        },
        evaluatedAt: new Date().toISOString(),
      };
    } catch (err) {
      console.warn("HttpComplianceRepository failed, falling back to mock:", err);
      return this.fallbackMock.auditFormula(formulaName, category, ingredients);
    }
  }

  async askRagKnowledge(query: string, categoryContext?: string): Promise<RagChatMessage> {
    try {
      const endpoint = "/api/v1/compliance/ask-rag";
      const payload = { query, category_context: categoryContext };
      const response = await this.apiClient.post<any, any>(endpoint, payload);
      return {
        id: `msg_${Date.now()}`,
        sender: "assistant",
        text: response.answer,
        citations: response.citations,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };
    } catch (err) {
      return this.fallbackMock.askRagKnowledge(query, categoryContext);
    }
  }
}
