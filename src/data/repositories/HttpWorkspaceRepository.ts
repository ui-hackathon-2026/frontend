import { IWorkspaceRepository } from "@/domain/repositories/IWorkspaceRepository";
import { WorkspaceCreatePayload, WorkspaceItem, WorkspaceMode } from "@/domain/models/workspace";
import { ApiClient } from "../api/api-client";

interface ProjectResponseDto {
  project_id: string;
  name: string;
  mode: string;
  brief_text?: string | null;
  brief_id?: string | null;
  ref_formula_id?: string | null;
  instruction?: string | null;
  created_at: string;
  updated_at: string;
}

function toWorkspaceItem(dto: ProjectResponseDto): WorkspaceItem {
  return {
    projectId: dto.project_id,
    name: dto.name,
    mode: (dto.mode === "enhance" ? "enhance" : "new") as WorkspaceMode,
    briefText: dto.brief_text ?? null,
    briefId: dto.brief_id ?? null,
    refFormulaId: dto.ref_formula_id ?? null,
    instruction: dto.instruction ?? null,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export class HttpWorkspaceRepository implements IWorkspaceRepository {
  private client: ApiClient;

  constructor(client?: ApiClient) {
    this.client = client || new ApiClient();
  }

  async listWorkspaces(limit: number = 50): Promise<WorkspaceItem[]> {
    const items = await this.client.get<ProjectResponseDto[]>(`/api/v1/projects?limit=${limit}`);
    return items.map(toWorkspaceItem);
  }

  async getWorkspace(projectId: string): Promise<WorkspaceItem> {
    const item = await this.client.get<ProjectResponseDto>(`/api/v1/projects/${projectId}`);
    return toWorkspaceItem(item);
  }

  async createWorkspace(payload: WorkspaceCreatePayload): Promise<WorkspaceItem> {
    const body = {
      name: payload.name,
      mode: payload.mode,
      brief_text: payload.briefText ?? undefined,
      brief_id: payload.briefId ?? undefined,
      ref_formula_id: payload.refFormulaId ?? undefined,
      instruction: payload.instruction ?? undefined,
    };
    const item = await this.client.post<typeof body, ProjectResponseDto>("/api/v1/projects", body);
    return toWorkspaceItem(item);
  }
}
