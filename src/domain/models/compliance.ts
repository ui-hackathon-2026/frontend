/**
 * Domain Models for Feature 5: Enterprise BPOM, Halal HAS 23000 & TKDN Sentinel (Hybrid RAG + LLM)
 */

export type ComplianceStatus = "PASSED" | "WARNING" | "VIOLATION";

export type HalalStatus = "HALAL_CERTIFIED" | "NEEDS_AUDIT" | "CRITICAL_NON_HALAL";

export interface RagCitation {
  regulation: string; // e.g. "Peraturan BPOM No. 17 Tahun 2022"
  appendix: string; // e.g. "Lampiran V (Pengawet yang Diizinkan)"
  clauseNumber: string; // e.g. "Entri No. 29"
  excerpt: string; // Exact legal citation snippet
}

export interface IngredientAuditItem {
  id: string;
  name: string;
  inci: string;
  weightPct: number;
  phase: string;
  role: string;
  status: ComplianceStatus;
  bpomLimitPct?: number;
  halalStatus: HalalStatus;
  tkdnPct: number;
  ragCitation?: RagCitation;
  auditNotes: string;
}

export interface LocalSubstitutionItem {
  currentIngredient: string;
  recommendedLocal: string;
  tkdnImpact: string; // e.g. "+12.5% TKDN"
  rationale: string;
}

export interface LlmRegulatoryReasoning {
  toxicologyEvaluation: string;
  mandatoryLabelWarnings: string[];
  localSubstitutionRecommendations: LocalSubstitutionItem[];
}

export interface ComplianceAuditReport {
  auditId: string;
  formulaName: string;
  category: string;
  overallStatus: "COMPLIANT" | "CONDITIONAL_APPROVAL" | "NON_COMPLIANT_VIOLATION";
  complianceScore: number; // 0.00 - 1.00
  halalStatus: HalalStatus;
  totalTkdnPct: number;
  summaryVerdict: string;
  ingredientsAudit: IngredientAuditItem[];
  llmReasoning: LlmRegulatoryReasoning;
  evaluatedAt: string;
}

export interface RagChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  citations?: { document: string; clause: string; text: string }[];
  timestamp: string;
}
