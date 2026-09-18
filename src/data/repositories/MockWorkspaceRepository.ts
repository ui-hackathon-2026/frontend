import { IWorkspaceRepository } from "@/domain/repositories/IWorkspaceRepository";
import { WorkspaceCreatePayload, WorkspaceItem } from "@/domain/models/workspace";

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export class MockWorkspaceRepository implements IWorkspaceRepository {
  private workspaces: WorkspaceItem[] = [
    {
      projectId: "proj_emina_barrier_2026",
      name: "Emina — Barrier Cream Tropis",
      mode: "new",
      briefText: "Moisturizer harian untuk kulit remaja, target COGS Rp 25.000, tekstur ringan non-lengket.",
      briefId: "brief_emina_001",
      refFormulaId: "form_default_chassis",
      instruction: null,
      createdAt: daysAgo(14),
      updatedAt: daysAgo(0),
    },
    {
      projectId: "proj_kahf_sunscreen_2026",
      name: "Kahf — Sunscreen Gel SPF50",
      mode: "new",
      briefText: "Sunscreen gel wajah pria, finish matte, tahan keringat, klaim halal.",
      briefId: "brief_kahf_014",
      refFormulaId: null,
      instruction: null,
      createdAt: daysAgo(9),
      updatedAt: daysAgo(1),
    },
    {
      projectId: "proj_wardah_serum_enhance",
      name: "Wardah — Niacinamide Serum v2",
      mode: "enhance",
      briefText: null,
      briefId: null,
      refFormulaId: "form_default_chassis",
      instruction: "Turunkan COGS 15% tanpa mengurangi stabilitas 40°C, pertahankan sensori.",
      createdAt: daysAgo(30),
      updatedAt: daysAgo(3),
    },
    {
      projectId: "proj_emina_toner_draft",
      name: "Emina — Toner Centella Draft",
      mode: "new",
      briefText: "Eksplorasi awal toner menenangkan berbasis Centella Asiatica.",
      briefId: null,
      refFormulaId: null,
      instruction: null,
      createdAt: daysAgo(2),
      updatedAt: daysAgo(2),
    },
    {
      projectId: "proj_kahf_bodywash",
      name: "Kahf — Body Wash Musk TKDN",
      mode: "new",
      briefText: "Body wash TKDN ≥ 40%, wangi musk maskulin, sumber bahan lokal.",
      briefId: "brief_kahf_009",
      refFormulaId: null,
      instruction: null,
      createdAt: daysAgo(45),
      updatedAt: daysAgo(6),
    },
  ];

  async listWorkspaces(): Promise<WorkspaceItem[]> {
    return [...this.workspaces].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getWorkspace(projectId: string): Promise<WorkspaceItem> {
    const found = this.workspaces.find((w) => w.projectId === projectId);
    if (!found) throw new Error("Workspace not found");
    return { ...found };
  }

  async createWorkspace(payload: WorkspaceCreatePayload): Promise<WorkspaceItem> {
    const now = new Date().toISOString();
    const item: WorkspaceItem = {
      projectId: `proj_${Date.now()}`,
      name: payload.name,
      mode: payload.mode,
      briefText: payload.briefText ?? null,
      briefId: payload.briefId ?? null,
      refFormulaId: payload.refFormulaId ?? null,
      instruction: payload.instruction ?? null,
      createdAt: now,
      updatedAt: now,
    };
    this.workspaces.unshift(item);
    return { ...item };
  }
}
