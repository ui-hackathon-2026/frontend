/**
 * Domain Models for Feature 2: Next-Gen Interactive Formulation Canvas (Workbench 4-Phase)
 */

export type FormulationPhase = "A" | "B" | "C" | "D";

export type FormulationRole =
  | "solvent"
  | "active"
  | "emulsifier"
  | "emollient"
  | "thickener"
  | "preservative"
  | "chelating"
  | "humectant";

export interface WorkbenchIngredient {
  id: string;
  name: string;
  inci: string;
  smiles: string;
  weightPct: number;
  phase: FormulationPhase;
  role: FormulationRole;
  hlb?: number;
  costPerKgIdr?: number;
  tkdnPct?: number;
  isLocked?: boolean; // Pinning capability to lock percentage during auto-balance
  bpomLimitPct?: number;
}

export interface SensitivityRadarMetrics {
  hlbEquilibrium: number; // 0.0 - 1.0 (closeness to required HLB)
  surfactantEfficiency: number; // 0.0 - 1.0 (SOR adequacy)
  viscosityPotential: number; // 0.0 - 1.0
  costEfficiency: number; // 0.0 - 1.0 (lower cost = higher score)
  tkdnScore: number; // 0.0 - 1.0 (TKDN >= 40% gives high score)
}

export interface PhaseSummary {
  phase: FormulationPhase;
  label: string;
  name: string;
  totalWeightPct: number;
  itemCount: number;
  color: string;
  bgColor: string;
}

export interface WorkbenchFormulaState {
  id?: string;
  name: string;
  category: string;
  batchSizeG: number;
  notes?: string;
  ingredients: WorkbenchIngredient[];
  totalWeightPct: number;
  isBalanced: boolean;
  systemHlb: number;
  requiredHlb: number;
  deltaHlb: number;
  sorRatio: number;
  estimatedCogsPerKgIdr: number;
  averageTkdnPct: number;
  radarMetrics: SensitivityRadarMetrics;
}
