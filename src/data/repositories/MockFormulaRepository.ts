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
      formula_id: "form_demo_workbench",
      name: "Formula Eksplorasi Kosmetik Baru",
      category: "skincare",
      batch_size_g: 500,
      notes: "Pilih acuan riset & benchmark di bawah untuk memuat komposisi awal",
      total_weight_pct: 0,
      status: "EMPTY_DRAFT",
      updated_at: new Date().toISOString(),
      ingredients: [],
    },
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

  async listFormulas(
    limit: number = 50,
    projectId?: string,
    offset: number = 0,
    q?: string
  ): Promise<FormulaItemResponse[]> {
    let list = this.formulas;
    if (projectId) list = list.filter((f) => f.project_id === projectId);
    if (q) list = list.filter((f) => f.name.toLowerCase().includes(q.toLowerCase()));
    return list.slice(offset, offset + limit).map((f) => ({ ...f }));
  }

  async getFormula(formulaId: string): Promise<FormulaItemResponse> {
    const f = this.formulas.find((it) => it.formula_id === formulaId);
    if (!f) throw new Error("Formula not found");
    return { ...f };
  }

  async importFormulaToProject(formulaId: string, projectId: string): Promise<FormulaItemResponse> {
    const source = this.formulas.find((it) => it.formula_id === formulaId);
    if (!source) throw new Error("Formula not found");
    const copy: FormulaItemResponse = {
      ...source,
      formula_id: `form_${Date.now()}_${Math.round(Math.random() * 1000)}`,
      project_id: projectId,
      updated_at: new Date().toISOString(),
      ingredients: source.ingredients.map((i) => ({ ...i })),
    };
    this.formulas.unshift(copy);
    return { ...copy };
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
    const lower = prompt.toLowerCase();

    // Work on a mutable clone of ingredients
    const items = f.ingredients.map((it) => ({ ...it }));
    const changes: any[] = [];

    const findIng = (matcher: (i: typeof items[0]) => boolean) => items.find(matcher);

    // Scenario: user asks for softer texture on hands ("saya ingin krimnya lebih lembut di tangan")
    if (
      lower.includes("lembut") ||
      lower.includes("tangan") ||
      lower.includes("soft") ||
      lower.includes("halus") ||
      lower.includes("velvet")
    ) {
      const emollient =
        findIng((i) => (i.phase === "A" && (i.inci.toLowerCase().includes("squalane") || i.inci.toLowerCase().includes("triglyceride") || i.inci.toLowerCase().includes("oil")))) ||
        findIng((i) => i.phase === "A");

      const humectant =
        findIng((i) => (i.phase === "B" && (i.inci.toLowerCase().includes("glycerin") || i.inci.toLowerCase().includes("glycol")) && !i.inci.toLowerCase().includes("aqua"))) ||
        findIng((i) => i.phase === "B" && !i.inci.toLowerCase().includes("aqua") && !i.inci.toLowerCase().includes("water"));

      const solvent =
        findIng((i) => (i.phase === "B" && (i.inci.toLowerCase().includes("aqua") || i.inci.toLowerCase().includes("water")))) ||
        findIng((i) => i.phase === "B");

      let totalAdded = 0;

      if (emollient) {
        const delta = 1.5;
        const oldPct = emollient.weight_pct;
        emollient.weight_pct = Number((oldPct + delta).toFixed(2));
        totalAdded += delta;
        changes.push({
          ingredient_id: `ing-${emollient.inci.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
          name: emollient.name,
          inci: emollient.inci,
          phase: emollient.phase,
          old_pct: oldPct,
          new_pct: emollient.weight_pct,
          action: "modified",
        });
      }

      if (humectant) {
        const delta = 1.0;
        const oldPct = humectant.weight_pct;
        humectant.weight_pct = Number((oldPct + delta).toFixed(2));
        totalAdded += delta;
        changes.push({
          ingredient_id: `ing-${humectant.inci.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
          name: humectant.name,
          inci: humectant.inci,
          phase: humectant.phase,
          old_pct: oldPct,
          new_pct: humectant.weight_pct,
          action: "modified",
        });
      }

      if (solvent && totalAdded > 0) {
        const oldPct = solvent.weight_pct;
        solvent.weight_pct = Number(Math.max(5, oldPct - totalAdded).toFixed(2));
        changes.push({
          ingredient_id: `ing-${solvent.inci.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
          name: solvent.name,
          inci: solvent.inci,
          phase: solvent.phase,
          old_pct: oldPct,
          new_pct: solvent.weight_pct,
          action: "modified",
        });
      }

      // Normalise total to exact 100.0%
      const sum = Number(items.reduce((acc, it) => acc + it.weight_pct, 0).toFixed(2));
      if (solvent && Math.abs(sum - 100) > 0.001) {
        solvent.weight_pct = Number((solvent.weight_pct + (100 - sum)).toFixed(2));
      }

      const getPhaseItems = (p: string) =>
        items.filter((i) => i.phase === p).map((i) => ({
          inci: i.inci,
          name: i.name,
          weight_pct: i.weight_pct,
          is_locked: i.is_locked,
        }));

      return {
        formula_id: formulaId,
        title: "Usulan Formula Krim Lembut di Tangan (Velvety Emollient Boost)",
        explanation:
          "Untuk memberikan sensasi krim yang lebih lembut di tangan (*velvety skin-feel*), meningkatkan daya lumas (*glideability*), dan cepat meresap tanpa meninggalkan rasa lengket, kami meningkatkan fraksi emolen pelembap alami serta humektan penahan hidrasi stratum corneum. Fase pelarut (Aqua) diseimbangkan kembali agar total massa formula tepat 100.0%.",
        changes,
        updated_phases: {
          phase_a: getPhaseItems("A"),
          phase_b: getPhaseItems("B"),
          phase_c: getPhaseItems("C"),
          phase_d: getPhaseItems("D"),
        },
        total_weight_pct: 100.0,
      };
    }

    // Generic fallback adjustment
    const active = items.find((i) => i.phase === "D" || i.inci.toLowerCase().includes("niacinamide")) || items[0];
    const solvent = items.find((i) => i.inci.toLowerCase().includes("aqua") || i.phase === "B");

    if (active) {
      const oldPct = active.weight_pct;
      active.weight_pct = Number((oldPct + 0.5).toFixed(2));
      changes.push({
        ingredient_id: `ing-${active.inci.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
        name: active.name,
        inci: active.inci,
        phase: active.phase,
        old_pct: oldPct,
        new_pct: active.weight_pct,
        action: "modified",
      });
      if (solvent) {
        const oldSolvent = solvent.weight_pct;
        solvent.weight_pct = Number(Math.max(5, oldSolvent - 0.5).toFixed(2));
        changes.push({
          ingredient_id: `ing-${solvent.inci.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
          name: solvent.name,
          inci: solvent.inci,
          phase: solvent.phase,
          old_pct: oldSolvent,
          new_pct: solvent.weight_pct,
          action: "modified",
        });
      }
    }

    const getPhaseItems = (p: string) =>
      items.filter((i) => i.phase === p).map((i) => ({
        inci: i.inci,
        name: i.name,
        weight_pct: i.weight_pct,
        is_locked: i.is_locked,
      }));

    return {
      formula_id: formulaId,
      title: "Rekomendasi Penyesuaian Formula Teroptimasi",
      explanation: `Penyesuaian komposisi berbasis permintaan: "${prompt}". Konsentrasi bahan aktif ditingkatkan dan fase pelarut diseimbangkan agar total massa formula tetap 100.0%.`,
      changes,
      updated_phases: {
        phase_a: getPhaseItems("A"),
        phase_b: getPhaseItems("B"),
        phase_c: getPhaseItems("C"),
        phase_d: getPhaseItems("D"),
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

  private messagesMap: Record<string, any[]> = {};

  async listMessages(formulaId: string): Promise<any[]> {
    return this.messagesMap[formulaId] || [];
  }

  async addMessage(
    formulaId: string,
    payload: {
      role: "user" | "assistant" | "system";
      content: string;
      proposal?: any;
      linked_artifact_id?: string | null;
    }
  ): Promise<any> {
    const list = this.messagesMap[formulaId] || [];
    const item = {
      id: Date.now(),
      session_id: `sess_${formulaId}`,
      role: payload.role,
      content: payload.content,
      proposal: payload.proposal,
      linked_artifact_id: payload.linked_artifact_id,
      created_at: new Date().toISOString(),
    };
    list.push(item);
    this.messagesMap[formulaId] = list;
    return item;
  }
}
