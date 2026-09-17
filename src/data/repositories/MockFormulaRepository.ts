import { IFormulaRepository } from "@/domain/repositories/IFormulaRepository";
import {
  FormulaCreatePayload,
  FormulaItemResponse,
  FormulaUpdatePayload,
  FormulaVersionItem,
} from "@/domain/models/formula";

export class MockFormulaRepository implements IFormulaRepository {
  private formulas: FormulaItemResponse[] = [
    {
      formula_id: "form_default_chassis",
      name: "Chassis Emulsi Tropis 40°C v1",
      category: "skincare",
      batch_size_g: 500,
      notes: "Formula baku barrier cream stabilitas tropis Paragon",
      total_weight_pct: 100.0,
      status: "VALID_BALANCED",
      updated_at: new Date().toISOString(),
      ingredients: [
        { inci: "Squalane", name: "Plant-Derived Squalane", weight_pct: 4.5, phase: "A", is_locked: false },
        { inci: "Caprylic/Capric Triglyceride", name: "Caprylic/Capric Triglycerides", weight_pct: 3.5, phase: "A", is_locked: false },
        { inci: "Tocopheryl Acetate", name: "Tocopherol Acetate (Vit E)", weight_pct: 0.5, phase: "A", is_locked: false },
        { inci: "Aqua", name: "Demineralized Water", weight_pct: 73.0, phase: "B", is_locked: false },
        { inci: "Glycerin", name: "Glycerin USP 99.5%", weight_pct: 4.0, phase: "B", is_locked: false },
        { inci: "Butylene Glycol", name: "Butylene Glycol (1,3-BG)", weight_pct: 3.5, phase: "B", is_locked: false },
        { inci: "Carbomer", name: "Carbomer 940 (Polymer)", weight_pct: 0.3, phase: "B", is_locked: false },
        { inci: "Disodium EDTA", name: "Disodium EDTA", weight_pct: 0.1, phase: "B", is_locked: false },
        { inci: "Glyceryl Stearate", name: "Glyceryl Stearate & PEG-100", weight_pct: 2.8, phase: "C", is_locked: false },
        { inci: "Polyglyceryl-3 Polyricinoleate", name: "Polyglyceryl-3 Polyricinoleate", weight_pct: 1.8, phase: "C", is_locked: false },
        { inci: "Niacinamide", name: "Niacinamide (Vitamin B3)", weight_pct: 3.0, phase: "D", is_locked: false },
        { inci: "Panthenol", name: "D-Panthenol (Provitamin B5)", weight_pct: 1.5, phase: "D", is_locked: false },
        { inci: "Allantoin", name: "Allantoin USP", weight_pct: 0.5, phase: "D", is_locked: false },
        { inci: "Triethanolamine", name: "Triethanolamine 99% (TEA)", weight_pct: 0.3, phase: "D", is_locked: false },
        { inci: "Chlorphenesin", name: "Chlorphenesin Preservative", weight_pct: 0.7, phase: "D", is_locked: false },
      ],
    },
  ];

  private versionsMap: Record<string, FormulaVersionItem[]> = {};

  async listFormulas(): Promise<FormulaItemResponse[]> {
    return [...this.formulas];
  }

  async getFormula(formulaId: string): Promise<FormulaItemResponse> {
    const f = this.formulas.find((it) => it.formula_id === formulaId);
    if (!f) throw new Error("Formula not found");
    return { ...f };
  }

  async createFormula(payload: FormulaCreatePayload): Promise<FormulaItemResponse> {
    const allIngs = [
      ...payload.phases.phase_a.map((i) => ({ ...i, phase: "A", is_locked: !!i.is_locked })),
      ...payload.phases.phase_b.map((i) => ({ ...i, phase: "B", is_locked: !!i.is_locked })),
      ...payload.phases.phase_c.map((i) => ({ ...i, phase: "C", is_locked: !!i.is_locked })),
      ...payload.phases.phase_d.map((i) => ({ ...i, phase: "D", is_locked: !!i.is_locked })),
    ];
    const total = Number(allIngs.reduce((sum, i) => sum + i.weight_pct, 0).toFixed(2));
    const newFormula: FormulaItemResponse = {
      formula_id: `form_mock_${Date.now()}`,
      name: payload.name,
      category: payload.category ?? "skincare",
      batch_size_g: payload.batch_size_g ?? 500,
      notes: payload.notes ?? null,
      project_id: payload.project_id ?? null,
      total_weight_pct: total,
      status: "VALID_BALANCED",
      updated_at: new Date().toISOString(),
      ingredients: allIngs,
    };
    this.formulas.unshift(newFormula);
    return newFormula;
  }

  async updateFormula(
    formulaId: string,
    payload: FormulaUpdatePayload,
    createVersion: boolean = true
  ): Promise<FormulaItemResponse> {
    const index = this.formulas.findIndex((it) => it.formula_id === formulaId);
    if (index === -1) throw new Error("Formula not found");

    const prev = this.formulas[index];
    if (createVersion) {
      const curVersions = this.versionsMap[formulaId] || [];
      curVersions.unshift({
        version: curVersions.length + 1,
        snapshot: {
          name: prev.name,
          category: prev.category,
          batch_size_g: prev.batch_size_g,
          notes: prev.notes,
          ingredients: prev.ingredients,
        },
        created_at: new Date().toISOString(),
      });
      this.versionsMap[formulaId] = curVersions;
    }

    const allIngs = [
      ...payload.phases.phase_a.map((i) => ({ ...i, phase: "A", is_locked: !!i.is_locked })),
      ...payload.phases.phase_b.map((i) => ({ ...i, phase: "B", is_locked: !!i.is_locked })),
      ...payload.phases.phase_c.map((i) => ({ ...i, phase: "C", is_locked: !!i.is_locked })),
      ...payload.phases.phase_d.map((i) => ({ ...i, phase: "D", is_locked: !!i.is_locked })),
    ];
    const total = Number(allIngs.reduce((sum, i) => sum + i.weight_pct, 0).toFixed(2));
    const updated: FormulaItemResponse = {
      ...prev,
      name: payload.name,
      category: payload.category ?? prev.category,
      batch_size_g: payload.batch_size_g ?? prev.batch_size_g,
      notes: payload.notes ?? prev.notes,
      total_weight_pct: total,
      updated_at: new Date().toISOString(),
      ingredients: allIngs,
    };
    this.formulas[index] = updated;
    return updated;
  }

  async proposeAdjustment(
    formulaId: string,
    prompt: string
  ): Promise<any> {
    const f = await this.getFormula(formulaId);
    return {
      formula_id: formulaId,
      title: "Rekomendasi Penyesuaian Formula",
      explanation: `Penyesuaian berbasis prompt "${prompt}"`,
      changes: [
        {
          ingredient_id: "ing-1",
          name: f.ingredients[0]?.name || "Active",
          inci: f.ingredients[0]?.inci || "Active",
          phase: f.ingredients[0]?.phase || "A",
          old_pct: f.ingredients[0]?.weight_pct || 1.0,
          new_pct: Math.max(0.1, (f.ingredients[0]?.weight_pct || 1.0) + 0.5),
          action: "modified",
        },
      ],
      updated_phases: {
        phase_a: f.ingredients.filter((i) => i.phase === "A"),
        phase_b: f.ingredients.filter((i) => i.phase === "B"),
        phase_c: f.ingredients.filter((i) => i.phase === "C"),
        phase_d: f.ingredients.filter((i) => i.phase === "D"),
      },
      total_weight_pct: 100.0,
    };
  }

  async deleteFormula(formulaId: string): Promise<void> {
    this.formulas = this.formulas.filter((it) => it.formula_id !== formulaId);
    delete this.versionsMap[formulaId];
  }

  async listVersions(formulaId: string): Promise<FormulaVersionItem[]> {
    return this.versionsMap[formulaId] || [];
  }
}
