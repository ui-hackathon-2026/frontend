/**
 * Domain Models for Physicochemical & Stability Simulator
 */

export type StabilityVerdict =
  | "HIGHLY_STABLE"
  | "MODERATELY_STABLE"
  | "UNSTABLE_RISK"
  | "PHASE_SEPARATION_IMMINENT";

export type SimulationEngineType = "LIGHTGBM_GPU" | "DEEP_COLLOID_GNN";

export interface IngredientInput {
  id: string;
  name: string;
  inci: string;
  smiles: string;
  weightPct: number;
  phase: "A" | "B" | "C" | "D";
  hlb?: number;
  role: "solvent" | "active" | "emulsifier" | "emollient" | "thickener" | "preservative" | "chelating" | "humectant";
}

export interface SimulationRequest {
  formulaId?: string;
  formulaName: string;
  temperatureC: number;
  durationDays: number;
  engine: SimulationEngineType;
  ingredients: IngredientInput[];
}

export interface DropletDistributionPoint {
  diameterNm: number;
  volumeFrequencyPct: number;
}

export interface RheologyPoint {
  shearRateS1: number;
  viscosityMpaS: number;
}

export interface ColloidalThermodynamics {
  deltaHlb: number;
  sorRatio: number;
  packingParameterP: number;
  gibbsFreeEnergyKjMol: number;
  criticalMicelleConcentrationMmolL: number;
  interfaceState: "Monolayer Saturated" | "Depleted Boundary" | "Bicontinuous Mesophase";
}

export interface SimulationResult {
  runId: string;
  formulaId?: string;
  formulaName: string;
  temperatureC: number;
  durationDays: number;
  engineUsed: SimulationEngineType;
  inferenceDurationMs: number;
  createdAt: string;

  // Primary Metrics
  stabilityScore: number; // 0.00 to 1.00 (e.g. 0.942 = 94.2%)
  verdict: StabilityVerdict;
  confidenceScore: number; // 0.00 to 1.00
  isOutOfDistribution: boolean;
  oodMahalanobisDistance: number;

  // Physicochemical Predictions
  dynamicViscosityMpaS: number;
  targetViscosityMpaS: number;
  meanDropletSizeNm: number;
  polydispersityIndexPdi: number;
  dropletDistribution: DropletDistributionPoint[];
  rheologyCurve: RheologyPoint[];

  // Scientific Thermodynamic Explanations
  thermodynamics: ColloidalThermodynamics;
  riskFactors: string[];
  stabilizingFactors: string[];
  recommendations: string[];
}

export interface PresetFormulaItem {
  id: string;
  name: string;
  category: string;
  description: string;
  request: SimulationRequest;
}
