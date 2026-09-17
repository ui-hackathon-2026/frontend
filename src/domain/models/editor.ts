export interface EditorIngredient {
  id: string;
  name: string;
  inci: string;
  phase: "A" | "B" | "C" | "D";
  weightPct: number;
  role: "active" | "emollient" | "thickener" | "emulsifier" | "solvent" | "preservative" | "chelating" | "humectant";
  isLocked?: boolean;
}

export interface FormulaDiffChange {
  ingredientId: string;
  name: string;
  oldPct: number;
  newPct: number;
  phase: "A" | "B" | "C" | "D";
  action: "modified" | "added" | "removed";
}

export interface FormulaModificationProposal {
  id: string;
  title: string;
  explanation: string;
  changes: FormulaDiffChange[];
  updatedIngredients: EditorIngredient[];
}

export interface EditorChatMessage {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: string;
  proposal?: FormulaModificationProposal;
  linkedArtifactId?: string;
}

export type ArtifactType = "pareto" | "simulation" | "sentinel" | "similarity";

export interface EditorArtifact {
  id: string;
  type: ArtifactType;
  title: string;
  subtitle: string;
  createdAt: string;
  data: any; // specific data payload for each artifact type
}

export interface DraftFormulation {
  id: string;
  name: string;
  createdAt: string;
  ingredients: EditorIngredient[];
  messages: EditorChatMessage[];
  artifacts: EditorArtifact[];
}

export interface EditorWorkspace {
  id: string;
  name: string;
  activeDraftId: string;
  drafts: DraftFormulation[];
}
