export type ParetoPresetId =
  | "balanced"
  | "cost_leader"
  | "max_stability"
  | "high_tkdn"
  | "custom";

export interface ParetoObjectiveWeights {
  stabilityWeight: number; // 0 - 100
  cogsWeight: number; // 0 - 100
  tkdnWeight: number; // 0 - 100
  viscosityWeight: number; // 0 - 100
}

export interface ParetoConstraints {
  minStabilityPct: number;
  maxCogsIdrPerKg: number;
  minTkdnPct: number;
  targetViscosityMpaS: number;
}

export interface ParetoTrialPoint {
  id: string;
  trialIndex: number;
  stabilityPct: number; // e.g. 92.4
  cogsIdr: number; // e.g. 38500
  tkdnPct: number; // e.g. 48.2
  viscosityMpaS: number; // e.g. 5250
  isParetoOptimal: boolean;
  rank: number; // 1 for non-dominated front
  candidateId?: "A" | "B" | "C";
}

export interface CandidateIngredient {
  id: string;
  name: string;
  inci: string;
  phase: "A" | "B" | "C" | "D";
  weightPct: number;
  functionDesc: string;
  isLocalTkdn?: boolean;
}

export interface ParetoCandidateFormula {
  id: "A" | "B" | "C";
  title: string;
  archetype: string;
  badgeLabel: string;
  metrics: {
    stabilityPct: number;
    cogsIdrPerKg: number;
    tkdnPct: number;
    viscosityMpaS: number;
    systemHlb: number;
  };
  tradeOffSummary: string;
  physicochemicalRationale: string;
  ingredients: CandidateIngredient[];
}

export interface ParetoOptimizationResult {
  trialsEvaluated: number;
  executionTimeMs: number;
  nonDominatedCount: number;
  hypervolumeScore: number;
  points: ParetoTrialPoint[];
  topCandidates: ParetoCandidateFormula[];
}

export interface ParetoOptimizationParams {
  weights: ParetoObjectiveWeights;
  constraints: ParetoConstraints;
  preset: ParetoPresetId;
  trialsCount?: number;
}
