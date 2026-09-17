export interface FormulaIngredientDto {
  inci: string;
  name?: string | null;
  smiles?: string | null;
  weight_pct: number;
  phase?: "A" | "B" | "C" | "D";
  is_locked?: boolean;
  is_solvent?: boolean;
}

export interface FormulaPhasesDto {
  phase_a: FormulaIngredientDto[];
  phase_b: FormulaIngredientDto[];
  phase_c: FormulaIngredientDto[];
  phase_d: FormulaIngredientDto[];
}

export interface FormulaCreatePayload {
  name: string;
  category?: string | null;
  batch_size_g?: number;
  notes?: string | null;
  project_id?: string | null;
  phases: FormulaPhasesDto;
}

export interface FormulaUpdatePayload extends FormulaCreatePayload {}

export interface FormulaItemResponse {
  formula_id: string;
  name: string;
  category?: string | null;
  batch_size_g: number;
  notes?: string | null;
  project_id?: string | null;
  total_weight_pct: number;
  status: string;
  updated_at: string;
  ingredients: Array<{
    inci: string;
    name?: string | null;
    smiles?: string | null;
    weight_pct: number;
    phase: string;
    is_locked: boolean;
  }>;
}

export interface FormulaVersionItem {
  version: number;
  snapshot: {
    name: string;
    category?: string | null;
    batch_size_g?: number;
    notes?: string | null;
    ingredients: Array<{
      phase: string;
      inci: string;
      name?: string | null;
      smiles?: string | null;
      weight_pct: number;
      is_locked: boolean;
    }>;
  };
  created_at: string;
}

export interface FormulaChangeItemDto {
  ingredient_id: string;
  name: string;
  inci: string;
  phase: "A" | "B" | "C" | "D" | string;
  old_pct: number;
  new_pct: number;
  action: "modified" | "added" | "removed";
}

export interface FormulaAdjustmentResponse {
  formula_id: string;
  title: string;
  explanation: string;
  changes: FormulaChangeItemDto[];
  updated_phases: FormulaPhasesDto;
  total_weight_pct: number;
}