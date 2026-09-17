/**
 * Domain models for Feature 1: Project Brief Studio
 */

export type ProductFormulationCategory =
  | "Gel-Cream"
  | "Hydrating Serum"
  | "Sunscreen Emulsion"
  | "Barrier Cream"
  | "Facial Cleanser";

export type SkinTargetProfile =
  | "Semua Jenis Kulit"
  | "Kulit Berminyak & Berjerawat"
  | "Kulit Kering Dehidrasi"
  | "Kulit Sensitif Tropis"
  | "Anti-Aging & Mature Skin";

export type SensoryFinishProfile = "Lightweight Dewy" | "Matte Velvety" | "Watery Refreshing" | "Rich Nourishing";

export interface HeroIngredientSelection {
  id: string;
  name: string;
  inci: string;
  localOrigin?: string;
  benefit: string;
  isLocalTkdn: boolean;
}

export interface ProjectBriefInput {
  projectName: string;
  brand: "Wardah" | "Kahf" | "Emina" | "Make Over" | "Laboré" | "Custom R&D";
  category: ProductFormulationCategory;
  skinProfile: SkinTargetProfile;
  sensoryFinish: SensoryFinishProfile;
  targetSpf?: number;
  targetViscosityMpaS: number;
  maxCogsIdrPerKg: number;
  targetTkdnPct: number;
  selectedHeroIngredients: string[];
  specialInstructions?: string;
}

export interface BlueprintPhaseIngredient {
  id: string;
  name: string;
  inci: string;
  weightPct: number;
  phase: "A" | "B" | "C" | "D";
  role: string;
  isLocalTkdn: boolean;
  functionDesc: string;
}

export interface FormulationBlueprint {
  blueprintId: string;
  title: string;
  brand: string;
  category: ProductFormulationCategory;
  estimatedViscosityMpaS: number;
  systemHlb: number;
  estimatedCogsIdrPerKg: number;
  calculatedTkdnPct: number;
  phaseDistribution: {
    phaseA: number;
    phaseB: number;
    phaseC: number;
    phaseD: number;
  };
  ingredients: BlueprintPhaseIngredient[];
  scientificRationale: string;
  initialRegulatoryClearance: {
    bpomCompliant: boolean;
    halalClearance: boolean;
    safetyMarginScore: number;
  };
  createdAt: string;
}

export interface ExistingFormulaChassis {
  id: string;
  name: string;
  brand: string;
  category: ProductFormulationCategory;
  baseViscosity: number;
  cogsIdrPerKg: number;
  tkdnPct: number;
  description: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    actionType: "apply_ingredient" | "adjust_cogs" | "set_tkdn";
    payload: any;
  };
}
