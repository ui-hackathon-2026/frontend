/**
 * DTO contracts matching FastAPI Pydantic backend models exactly.
 * Endpoint: POST /api/v1/simulate/stability
 */

export interface IngredientDto {
  name: string;
  inci: string;
  smiles: string;
  weight_pct: number;
  phase: string;
  hlb?: number;
  role: string;
}

export interface SimulationRequestDto {
  formula_id?: string;
  formula_name: string;
  temperature_c: number;
  duration_days: number;
  engine: "LIGHTGBM_GPU" | "DEEP_COLLOID_GNN";
  ingredients: IngredientDto[];
}

export interface DropletDistributionPointDto {
  diameter_nm: number;
  volume_frequency_pct: number;
}

export interface RheologyPointDto {
  shear_rate_s1: number;
  viscosity_mpas: number;
}

export interface ColloidalThermodynamicsDto {
  delta_hlb: number;
  sor_ratio: number;
  packing_parameter_p: number;
  gibbs_free_energy_kj_mol: number;
  critical_micelle_concentration_mmol_l: number;
  interface_state: string;
}

export interface SimulationResponseDto {
  run_id: string;
  formula_id?: string;
  formula_name: string;
  temperature_c: number;
  duration_days: number;
  engine_used: "LIGHTGBM_GPU" | "DEEP_COLLOID_GNN";
  inference_duration_ms: number;
  created_at: string;
  stability_score_40c_90days: number;
  verdict: "HIGHLY_STABLE" | "MODERATELY_STABLE" | "UNSTABLE_RISK" | "PHASE_SEPARATION_IMMINENT";
  confidence_score: number;
  is_out_of_distribution: boolean;
  ood_mahalanobis_distance: number;
  dynamic_viscosity_mpas: number;
  target_viscosity_mpas: number;
  mean_droplet_size_nm: number;
  polydispersity_index_pdi: number;
  droplet_distribution: DropletDistributionPointDto[];
  rheology_curve: RheologyPointDto[];
  thermodynamics: ColloidalThermodynamicsDto;
  risk_factors: string[];
  stabilizing_factors: string[];
  recommendations: string[];
}
