import { WorkspaceCreatePayload, WorkspaceItem } from "../models/workspace";

export interface IWorkspaceRepository {
  /**
   * List all workspaces (projects) visible to the R&D team
   */
  listWorkspaces(limit?: number): Promise<WorkspaceItem[]>;

  /**
   * Get single workspace by project_id
   */
  getWorkspace(projectId: string): Promise<WorkspaceItem>;

  /**
   * Create a new workspace
   */
  createWorkspace(payload: WorkspaceCreatePayload): Promise<WorkspaceItem>;
}
