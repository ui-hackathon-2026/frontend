export type WorkspaceMode = "new" | "enhance";

export interface WorkspaceItem {
  projectId: string;
  name: string;
  mode: WorkspaceMode;
  briefText?: string | null;
  briefId?: string | null;
  refFormulaId?: string | null;
  instruction?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceCreatePayload {
  name: string;
  mode: WorkspaceMode;
  briefText?: string | null;
  briefId?: string | null;
  refFormulaId?: string | null;
  instruction?: string | null;
}
