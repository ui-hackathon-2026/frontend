"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  EditorWorkspace,
  DraftFormulation,
  EditorIngredient,
  EditorChatMessage,
  EditorArtifact,
  ArtifactType,
  FormulaModificationProposal,
} from "@/domain/models/editor";

const STORAGE_KEY = "ps_editor_workspace_v2";

const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

function authHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("ps_access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Backend ${path} menjawab ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json", ...authHeaders() },
  });
  if (!res.ok) {
    throw new Error(`Backend ${path} menjawab ${res.status}`);
  }
  return res.json() as Promise<T>;
}

const INITIAL_INGREDIENTS_V1: EditorIngredient[] = [
  // Fase A (Minyak)
  { id: "ing-squalane", name: "Plant-Derived Squalane (Olive)", inci: "Squalane", phase: "A", weightPct: 4.5, role: "emollient" },
  { id: "ing-cct", name: "Caprylic/Capric Triglycerides", inci: "Caprylic/Capric Triglyceride", phase: "A", weightPct: 3.5, role: "emollient" },
  { id: "ing-tocopherol", name: "Tocopherol Acetate (Vit E)", inci: "Tocopheryl Acetate", phase: "A", weightPct: 0.5, role: "active" },

  // Fase B (Air & Humektan)
  { id: "ing-water", name: "Demineralized Water", inci: "Aqua", phase: "B", weightPct: 73.0, role: "solvent", isLocked: false },
  { id: "ing-glycerin", name: "Glycerin USP 99.5%", inci: "Glycerin", phase: "B", weightPct: 4.0, role: "humectant" },
  { id: "ing-butylene", name: "Butylene Glycol (1,3-BG)", inci: "Butylene Glycol", phase: "B", weightPct: 3.5, role: "humectant" },
  { id: "ing-carbomer", name: "Carbomer 940 (Polymer)", inci: "Carbomer", phase: "B", weightPct: 0.3, role: "thickener" },
  { id: "ing-edta", name: "Disodium EDTA", inci: "Disodium EDTA", phase: "B", weightPct: 0.1, role: "chelating" },

  // Fase C (Emulgator)
  { id: "ing-gms", name: "Glyceryl Stearate & PEG-100", inci: "Glyceryl Stearate", phase: "C", weightPct: 2.8, role: "emulsifier" },
  { id: "ing-poly3", name: "Polyglyceryl-3 Polyricinoleate", inci: "Polyglyceryl-3 Polyricinoleate", phase: "C", weightPct: 1.8, role: "emulsifier" },

  // Fase D (Aktif & Aditif)
  { id: "ing-niacinamide", name: "Niacinamide (Vitamin B3)", inci: "Niacinamide", phase: "D", weightPct: 3.0, role: "active" },
  { id: "ing-panthenol", name: "D-Panthenol (Provitamin B5)", inci: "Panthenol", phase: "D", weightPct: 1.5, role: "active" },
  { id: "ing-allantoin", name: "Allantoin USP", inci: "Allantoin", phase: "D", weightPct: 0.5, role: "active" },
  { id: "ing-tea", name: "Triethanolamine 99% (TEA)", inci: "Triethanolamine", phase: "D", weightPct: 0.3, role: "active" },
  { id: "ing-preservative", name: "Chlorphenesin Preservative", inci: "Chlorphenesin", phase: "D", weightPct: 0.7, role: "preservative" },
];

const INITIAL_MESSAGES_V1: EditorChatMessage[] = [
  {
    id: "msg-1",
    sender: "assistant",
    content: "Halo Formulator Paragon! Selamat datang di **Studio Editor Formulasi**. Anda dapat menguji kestabilan 40°C, menjalankan optimasi Pareto, atau mengaudit regulasi BPOM & Halal melalui menu **(+)**. Klik bahan di Kitchen panel kanan untuk langsung menginspeksi struktur 3D molekulnya.",
    timestamp: "Baru saja",
  },
];

const DEFAULT_WORKSPACE: EditorWorkspace = {
  id: "ws-1",
  name: "Workspace-1: Tropical Barrier Cream",
  activeDraftId: "draft-v1",
  drafts: [
    {
      id: "draft-v1",
      name: "draft-formulation v1",
      createdAt: "18 Sep, 01:00",
      ingredients: INITIAL_INGREDIENTS_V1,
      messages: INITIAL_MESSAGES_V1,
      artifacts: [],
    },
  ],
};

interface EditorContextType {
  workspace: EditorWorkspace;
  activeDraft: DraftFormulation;
  switchDraft: (draftId: string) => void;
  createDraftFork: () => void;
  renameDraft: (draftId: string, newName: string) => void;
  deleteDraft: (draftId: string) => void;
  // Ingredients (Kitchen Panel)
  ingredients: EditorIngredient[];
  updateIngredientWeight: (id: string, weight: number) => void;
  toggleLockIngredient: (id: string) => void;
  removeIngredient: (id: string) => void;
  addIngredient: (item: Omit<EditorIngredient, "isLocked">) => void;
  applyProposal: (proposal: FormulaModificationProposal) => void;
  applyCandidateRecipe: (entries: Array<{ inci: string; weightPct: number }>) => void;
  // Contextual Left Panel
  selectedMoleculeIngredient: EditorIngredient | null;
  setSelectedMoleculeIngredient: (item: EditorIngredient | null) => void;
  leftPanelMode: "molecule-3d" | "library";
  setLeftPanelMode: (mode: "molecule-3d" | "library") => void;
  // Center View Mode
  centerViewMode: "chat" | "artifact";
  setCenterViewMode: (mode: "chat" | "artifact") => void;
  activeArtifact: EditorArtifact | null;
  viewArtifact: (art: EditorArtifact) => void;
  closeArtifactView: () => void;
  // Artifacts Modal
  artifactsListModalOpen: boolean;
  setArtifactsListModalOpen: (open: boolean) => void;
  // Action Menu & Modal
  actionConfigModal: { isOpen: boolean; actionType: ArtifactType | null };
  openActionConfig: (type: ArtifactType) => void;
  closeActionConfig: () => void;
  executeAction: (type: ArtifactType, configParams?: any) => void;
  // Chat
  sendMessage: (text: string) => void;
}

const EditorContext = createContext<EditorContextType | null>(null);

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [workspace, setWorkspace] = useState<EditorWorkspace>(DEFAULT_WORKSPACE);
  const [selectedMoleculeIngredient, setSelectedMoleculeIngredient] = useState<EditorIngredient | null>(INITIAL_INGREDIENTS_V1[0]);
  const [leftPanelMode, setLeftPanelMode] = useState<"molecule-3d" | "library">("molecule-3d");
  const [centerViewMode, setCenterViewMode] = useState<"chat" | "artifact">("chat");
  const [activeArtifact, setActiveArtifact] = useState<EditorArtifact | null>(null);
  const [artifactsListModalOpen, setArtifactsListModalOpen] = useState(false);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const smilesMapRef = React.useRef<Record<string, string>>({});
  const [actionConfigModal, setActionConfigModal] = useState<{ isOpen: boolean; actionType: ArtifactType | null }>({
    isOpen: false,
    actionType: null,
  });

  // Restore workspace from localStorage, else seed from backend chassis
  useEffect(() => {
    let cancelled = false;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as EditorWorkspace;
        if (parsed.drafts && parsed.drafts.length > 0) {
          setWorkspace(parsed);
          const active = parsed.drafts.find((d) => d.id === parsed.activeDraftId) || parsed.drafts[0];
          if (active.ingredients.length > 0) {
            setSelectedMoleculeIngredient(active.ingredients[0]);
          }
          return;
        }
      }
    } catch {
      // fallback to default
    }
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/orchestrator/chassis`, {
          headers: { Accept: "application/json", ...authHeaders() },
        });
        if (!res.ok) return;
        const list = await res.json();
        const first = Array.isArray(list) && list.length > 0 ? list[0] : null;
        const items = first?.ingredients;
        if (cancelled || !Array.isArray(items) || items.length === 0) return;
        const roleForPhase: Record<string, EditorIngredient["role"]> = {
          A: "emollient",
          B: "solvent",
          C: "emulsifier",
          D: "active",
        };
        const seeded: EditorIngredient[] = items.map((it: any, idx: number) => ({
          id: `ing-seed-${idx}`,
          name: String(it.name || it.inci),
          inci: String(it.inci),
          phase: ["A", "B", "C", "D"].includes(it.phase) ? it.phase : "B",
          weightPct: Number(it.weightPct) || 0,
          role: roleForPhase[it.phase] || "active",
        }));
        setWorkspace((prev) => ({
          ...prev,
          drafts: prev.drafts.map((d, i) =>
            i !== 0 ? d : { ...d, ingredients: seeded }
          ),
        }));
        setSelectedMoleculeIngredient(seeded[0]);
      } catch {
        // keep hardcoded defaults offline
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Save workspace to localStorage
  const saveWorkspace = useCallback((ws: EditorWorkspace) => {
    setWorkspace(ws);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ws));
    } catch {
      // ignore storage full
    }
  }, []);

  // Persist every workspace change (covers streaming chat and artifacts)
  const hydratedRef = React.useRef(false);
  useEffect(() => {
    if (!hydratedRef.current) {
      hydratedRef.current = true;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
    } catch {
      // ignore storage full
    }
  }, [workspace]);

  const activeDraft = workspace.drafts.find((d) => d.id === workspace.activeDraftId) || workspace.drafts[0];
  const ingredients = activeDraft.ingredients;

  // SMILES lookup from backend catalog (for simulate calls)
  const ensureSmilesMap = useCallback(async () => {
    if (Object.keys(smilesMapRef.current).length > 0) return smilesMapRef.current;
    try {
      const data = await apiGet<{ items: Array<{ inci: string; smiles: string }> }>(
        "/api/v1/workbench/ingredients"
      );
      const map: Record<string, string> = {};
      for (const item of data.items || []) {
        if (item.inci && item.smiles) map[item.inci.toLowerCase()] = item.smiles;
      }
      smilesMapRef.current = map;
    } catch {
      // offline catalog: simulate calls will fail gracefully at request time
    }
    return smilesMapRef.current;
  }, []);

  const toSimulateIngredients = useCallback(async () => {
    const smilesMap = await ensureSmilesMap();
    return ingredients.map((it) => ({
      name: it.name,
      inci: it.inci,
      smiles: smilesMap[it.inci.toLowerCase()] || "O",
      weight_pct: it.weightPct,
      phase: it.phase,
      role: it.role,
    }));
  }, [ingredients, ensureSmilesMap]);

  // Switch Draft
  const switchDraft = useCallback((draftId: string) => {
    const target = workspace.drafts.find((d) => d.id === draftId);
    if (!target) return;
    const updated: EditorWorkspace = {
      ...workspace,
      activeDraftId: draftId,
    };
    saveWorkspace(updated);
    if (target.ingredients.length > 0) {
      setSelectedMoleculeIngredient(target.ingredients[0]);
    }
    setCenterViewMode("chat");
    setActiveArtifact(null);
  }, [workspace, saveWorkspace]);

  // Create Draft Fork
  const createDraftFork = useCallback(() => {
    const newVersionNum = workspace.drafts.length + 1;
    const newDraftId = `draft-v${newVersionNum}-${Date.now().toString().slice(-4)}`;
    const newDraftName = `draft-formulation v${newVersionNum}`;

    // Deep copy ingredients from active draft
    const clonedIngredients = ingredients.map((item) => ({ ...item }));

    const newDraft: DraftFormulation = {
      id: newDraftId,
      name: newDraftName,
      createdAt: "Baru saja",
      ingredients: clonedIngredients,
      messages: [
        {
          id: `msg-fork-${Date.now()}`,
          sender: "assistant" as const,
          content: `Draft baru **${newDraftName}** berhasil difork dari **${activeDraft.name}**. Anda dapat memodifikasi komposisi, menguji simulasi independen, dan berdiskusi dengan AI.`,
          timestamp: "Baru saja",
        },
      ],
      artifacts: [],
    };

    const updated: EditorWorkspace = {
      ...workspace,
      activeDraftId: newDraftId,
      drafts: [...workspace.drafts, newDraft],
    };
    saveWorkspace(updated);
    setCenterViewMode("chat");
    setActiveArtifact(null);
  }, [workspace, ingredients, activeDraft, saveWorkspace]);

  // Rename Draft
  const renameDraft = useCallback((draftId: string, newName: string) => {
    const updatedDrafts = workspace.drafts.map((d) => (d.id === draftId ? { ...d, name: newName } : d));
    saveWorkspace({ ...workspace, drafts: updatedDrafts });
  }, [workspace, saveWorkspace]);

  // Delete Draft
  const deleteDraft = useCallback((draftId: string) => {
    if (workspace.drafts.length <= 1) return; // Keep at least one
    const remaining = workspace.drafts.filter((d) => d.id !== draftId);
    const nextActiveId = workspace.activeDraftId === draftId ? remaining[0].id : workspace.activeDraftId;
    saveWorkspace({ ...workspace, activeDraftId: nextActiveId, drafts: remaining });
  }, [workspace, saveWorkspace]);

  // Auto-normalize ingredients when a weight changes
  const updateIngredientWeight = useCallback((id: string, newWeight: number) => {
    const clampedWeight = Math.max(0.01, Math.min(99.0, Number(newWeight.toFixed(2))));

    // Calculate adjustment on water or unlocked ingredients
    const current = ingredients.map((item) => (item.id === id ? { ...item, weightPct: clampedWeight } : item));
    const targetId = id;
    
    // Find unlocked ingredients other than the modified one
    const otherUnlocked = current.filter((item) => item.id !== targetId && !item.isLocked);
    const lockedTotal = current.filter((item) => item.isLocked || item.id === targetId).reduce((acc, it) => acc + it.weightPct, 0);
    const remainingNeeded = Math.max(0, 100 - lockedTotal);

    let normalized = current;
    if (otherUnlocked.length > 0) {
      const currentUnlockedSum = otherUnlocked.reduce((acc, it) => acc + it.weightPct, 0);
      if (currentUnlockedSum > 0) {
        normalized = current.map((item) => {
          if (item.id === targetId || item.isLocked) return item;
          const ratio = item.weightPct / currentUnlockedSum;
          const adjusted = Math.max(0.01, Number((ratio * remainingNeeded).toFixed(2)));
          return { ...item, weightPct: adjusted };
        });
      }
    }

    // Update active draft
    const updatedDrafts = workspace.drafts.map((d) => (d.id === activeDraft.id ? { ...d, ingredients: normalized } : d));
    saveWorkspace({ ...workspace, drafts: updatedDrafts });
  }, [ingredients, workspace, activeDraft, saveWorkspace]);

  // Toggle Lock
  const toggleLockIngredient = useCallback((id: string) => {
    const updatedIngredients = ingredients.map((it) => (it.id === id ? { ...it, isLocked: !it.isLocked } : it));
    const updatedDrafts = workspace.drafts.map((d) => (d.id === activeDraft.id ? { ...d, ingredients: updatedIngredients } : d));
    saveWorkspace({ ...workspace, drafts: updatedDrafts });
  }, [ingredients, workspace, activeDraft, saveWorkspace]);

  // Remove Ingredient
  const removeIngredient = useCallback((id: string) => {
    if (ingredients.length <= 1) return;
    const filtered = ingredients.filter((it) => it.id !== id);
    const updatedDrafts = workspace.drafts.map((d) => (d.id === activeDraft.id ? { ...d, ingredients: filtered } : d));
    saveWorkspace({ ...workspace, drafts: updatedDrafts });
  }, [ingredients, workspace, activeDraft, saveWorkspace]);

  // Add Ingredient
  const addIngredient = useCallback((item: Omit<EditorIngredient, "isLocked">) => {
    const exists = ingredients.some((it) => it.name.toLowerCase() === item.name.toLowerCase());
    if (exists) return;
    const newIng: EditorIngredient = { ...item, isLocked: false };
    const updated = [...ingredients, newIng];
    const updatedDrafts = workspace.drafts.map((d) => (d.id === activeDraft.id ? { ...d, ingredients: updated } : d));
    saveWorkspace({ ...workspace, drafts: updatedDrafts });
    setSelectedMoleculeIngredient(newIng);
  }, [ingredients, workspace, activeDraft, saveWorkspace]);

  // Apply Proposal from AI
  const applyProposal = useCallback((proposal: FormulaModificationProposal) => {
    const updatedDrafts = workspace.drafts.map((d) => {
      if (d.id !== activeDraft.id) return d;
      return {
        ...d,
        ingredients: proposal.updatedIngredients,
        messages: [
          ...d.messages,
          {
            id: `msg-applied-${Date.now()}`,
            sender: "assistant" as const,
            content: `Formula berhasil diperbarui di **Kitchen Panel** sesuai usulan *${proposal.title}*.`,
            timestamp: "Baru saja",
          },
        ],
      };
    });
    saveWorkspace({ ...workspace, drafts: updatedDrafts });
  }, [workspace, activeDraft, saveWorkspace]);

  // Apply candidate recipe (bulk, by INCI match, single renormalization)
  const applyCandidateRecipe = useCallback((entries: Array<{ inci: string; weightPct: number }>) => {
    const byInci = new Map(entries.map((e) => [e.inci.toLowerCase(), e.weightPct]));
    const matched = ingredients.map((it) =>
      byInci.has(it.inci.toLowerCase())
        ? { ...it, weightPct: byInci.get(it.inci.toLowerCase()) as number }
        : it
    );
    const total = matched.reduce((acc, it) => acc + it.weightPct, 0);
    const normalized = total > 0
      ? matched.map((it) => ({ ...it, weightPct: Number(((it.weightPct / total) * 100).toFixed(2)) }))
      : matched;
    const updatedDrafts = workspace.drafts.map((d) =>
      d.id !== activeDraft.id ? d : { ...d, ingredients: normalized }
    );
    saveWorkspace({ ...workspace, drafts: updatedDrafts });
  }, [ingredients, workspace, activeDraft, saveWorkspace]);

  // View Artifact
  const viewArtifact = useCallback((art: EditorArtifact) => {
    setActiveArtifact(art);
    setCenterViewMode("artifact");
    setArtifactsListModalOpen(false);
  }, []);

  const closeArtifactView = useCallback(() => {
    setCenterViewMode("chat");
  }, []);

  // Action Config Modal
  const openActionConfig = useCallback((type: ArtifactType) => {
    setActionConfigModal({ isOpen: true, actionType: type });
  }, []);

  const closeActionConfig = useCallback(() => {
    setActionConfigModal({ isOpen: false, actionType: null });
  }, []);

  // Execute Action & Generate Artifact (real backend engines)
  const executeAction = useCallback(async (type: ArtifactType, configParams?: any) => {
    closeActionConfig();

    const timestamp = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const simIngredients = await toSimulateIngredients();

    const pushArtifact = (
      title: string,
      subtitle: string,
      dataPayload: any,
      chatText: string
    ) => {
      const newArtifact: EditorArtifact = {
        id: `art-${type}-${Date.now()}`,
        type,
        title,
        subtitle,
        createdAt: timestamp,
        data: dataPayload,
      };
      const newChatMsg: EditorChatMessage = {
        id: `msg-${Date.now()}`,
        sender: "assistant" as const,
        content: chatText,
        timestamp,
        linkedArtifactId: newArtifact.id,
      };
      setWorkspace((prev) => ({
        ...prev,
        drafts: prev.drafts.map((d) =>
          d.id !== activeDraft.id
            ? d
            : {
                ...d,
                artifacts: [newArtifact, ...d.artifacts],
                messages: [...d.messages, newChatMsg],
              }
        ),
      }));
      setActiveArtifact(newArtifact);
      setCenterViewMode("artifact");
    };

    const pushError = (label: string) => {
      const newChatMsg: EditorChatMessage = {
        id: `msg-${Date.now()}`,
        sender: "assistant" as const,
        content: `${label} gagal dijalankan: backend tidak tersedia. Coba lagi nanti.`,
        timestamp,
      };
      setWorkspace((prev) => ({
        ...prev,
        drafts: prev.drafts.map((d) =>
          d.id !== activeDraft.id ? d : { ...d, messages: [...d.messages, newChatMsg] }
        ),
      }));
    };

    try {
      if (type === "pareto") {
        const res: any = await apiPost("/api/v1/optimizer/run-nsga2", {
          constraints: {
            minStabilityPct: configParams?.minStability ?? 85,
            maxCogsIdrPerKg: configParams?.maxCogs ?? 45000,
            minTkdnPct: configParams?.targetTkdn ?? 40,
            targetViscosityMpaS: 5200,
          },
          trialsCount: 500,
        });
        const candidates = (res.topCandidates || []).map((c: any) => ({
          id: c.id,
          title: c.title,
          stability: `${c.metrics.stabilityPct}%`,
          cogs: `Rp ${Number(c.metrics.cogsIdrPerKg).toLocaleString("id-ID")}`,
          tkdn: `${c.metrics.tkdnPct}%`,
          badge: c.badgeLabel,
          desc: c.tradeOffSummary,
          recipe: c.ingredients,
        }));
        pushArtifact(
          "Hasil Optimasi Multi-Objektif Pareto NSGA-II",
          `${res.trialsEvaluated} iterasi evaluasi simpleks massa ∑w = 100%`,
          {
            config: configParams || {},
            candidates,
            trialsEvaluated: res.trialsEvaluated,
            executionTimeMs: res.executionTimeMs,
            nonDominatedCount: res.nonDominatedCount,
          },
          `Optimasi Pareto selesai: ${res.trialsEvaluated} iterasi, ${res.nonDominatedCount} titik front non-dominated. Report telah siap ditinjau.`
        );
      } else if (type === "sentinel") {
        const res: any = await apiPost("/api/v1/compliance/audit", {
          formula_name: activeDraft.name,
          ingredients: simIngredients,
        });
        const violations = (res.ingredients_audit || []).filter((a: any) => a.status !== "PASSED").length;
        pushArtifact(
          "Laporan Audit Regulasi BPOM & Halal HAS 23000",
          "Skrining Perka BPOM No. 25/2025 & sertifikasi Halal bahan",
          {
            status: res.overall_status,
            bpomScore: `${res.compliance_score != null ? Math.round(res.compliance_score * 100) : 0}%`,
            halalScore: res.halal_status,
            tkdnScore: `${res.total_tkdn_pct}%`,
            checkedRules: (res.ingredients_audit || []).length,
            violations,
          },
          `Audit regulasi selesai dengan status ${res.overall_status}. ${violations} temuan dari ${(res.ingredients_audit || []).length} bahan. Report kepatuhan telah dibuka.`
        );
      } else if (type === "simulation") {
        const res: any = await apiPost("/api/v1/simulate/stability", {
          formula_name: activeDraft.name,
          temperature_c: configParams?.tempCelsius ?? 40,
          duration_days: configParams?.durationDays ?? 90,
          ingredients: simIngredients,
        });
        pushArtifact(
          "Hasil Simulasi Fisikokimia Kestabilan 40°C",
          "Inkubator Iklim Tropis Zona IVb (40°C / 75% RH / 90 Hari)",
          {
            probStability: Math.round((res.stability_score_40c_90days || 0) * 1000) / 10,
            viscosityMpaS: Math.round(res.dynamic_viscosity_mpas || 0),
            dropletDlsNm: Math.round((res.mean_droplet_size_nm || 0) * 10) / 10,
            gibbsDeltaG: res.thermodynamics?.gibbs_free_energy_kj_mol ?? null,
            verdict: res.verdict,
          },
          `Simulasi kestabilan 40°C selesai: skor ${Math.round((res.stability_score_40c_90days || 0) * 1000) / 10}% (${res.verdict}).`
        );
      } else if (type === "similarity") {
        const payload = {
          ingredients: simIngredients.map((it: any) => ({
            inci: it.inci,
            weight_pct: it.weight_pct,
          })),
        };
        const [internal, external] = await Promise.all([
          apiPost<any>("/api/v1/similarity/check", payload),
          apiPost<any>("/api/v1/similarity/external", payload),
        ]);
        pushArtifact(
          "Analisis Kemiripan Formula & Patent Novelty",
          "Paragon Cross-Brand Knowledge Base vs komposisi produk beredar",
          {
            internal: {
              matches: (internal.matches || []).map((m: any) => ({
                name: m.name,
                formula_id: m.formula_id,
                jaccard: m.jaccard,
                cosine: m.cosine,
                chassis_overlap_pct: m.chassis_overlap_pct,
              })),
            },
            external: {
              noveltyScore: Math.round((external.novelty_score || 0) * 100),
              matches: (external.top_matches || []).map((m: any) => ({
                brand: m.brand,
                productName: m.product_name,
                url: m.url,
                similarity: Math.round(m.similarity * 1000) / 10,
                shared: m.shared_ingredients,
              })),
            },
          },
          `Analisis komparasi selesai. Skor kebaruan vs produk beredar: ${Math.round((external.novelty_score || 0) * 100)}%.`
        );
      }
    } catch (err) {
      console.error(err);
      pushError(
        type === "pareto" ? "Optimasi Pareto"
        : type === "sentinel" ? "Audit regulasi"
        : type === "simulation" ? "Simulasi kestabilan"
        : "Analisis similaritas"
      );
    }
  }, [activeDraft, toSimulateIngredients, closeActionConfig]);

  // Send Chat Message (real backend SSE stream)
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    const timestamp = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

    const userMsg: EditorChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user" as const,
      content: text,
      timestamp,
    };

    const assistantId = `ai-${Date.now()}`;
    let streamed = "";
    const pushUserAndPlaceholder = (prev: EditorWorkspace): EditorWorkspace => ({
      ...prev,
      drafts: prev.drafts.map((d) =>
        d.id !== activeDraft.id
          ? d
          : {
              ...d,
              messages: [
                ...d.messages,
                userMsg,
                { id: assistantId, sender: "assistant" as const, content: "", timestamp },
              ],
            }
      ),
    });
    const appendToken = (prev: EditorWorkspace, token: string): EditorWorkspace => ({
      ...prev,
      drafts: prev.drafts.map((d) =>
        d.id !== activeDraft.id
          ? d
          : {
              ...d,
              messages: d.messages.map((m) =>
                m.id === assistantId ? { ...m, content: m.content + token } : m
              ),
            }
      ),
    });

    setWorkspace(pushUserAndPlaceholder);
    try {
      const res = await fetch(`${API_BASE}/api/v1/copilot/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          message: text,
          session_id: chatSessionId,
          canvas: {
            formula_name: activeDraft.name,
            ingredients: ingredients.map((it) => ({
              inci: it.inci,
              weight_pct: it.weightPct,
              phase: it.phase,
            })),
          },
        }),
      });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const data = trimmed.slice(5).trim();
          if (data === "[DONE]") continue;
          let evt: any;
          try {
            evt = JSON.parse(data);
          } catch {
            continue;
          }
          if (evt.type === "token" && typeof evt.token === "string") {
            streamed += evt.token;
            setWorkspace((prev) => appendToken(prev, evt.token));
          } else if (evt.type === "meta" && typeof evt.session_id === "string") {
            setChatSessionId(evt.session_id);
          } else if (evt.type === "error") {
            throw new Error(typeof evt.detail === "string" ? evt.detail : "AI error");
          }
        }
      }
      if (!streamed) throw new Error("empty reply");
    } catch (err) {
      console.error(err);
      const fallback =
        streamed || "Maaf, asisten AI tidak tersedia saat ini. Coba lagi nanti.";
      setWorkspace((prev) => ({
        ...prev,
        drafts: prev.drafts.map((d) =>
          d.id !== activeDraft.id
            ? d
            : {
                ...d,
                messages: d.messages.map((m) =>
                  m.id === assistantId ? { ...m, content: fallback } : m
                ),
              }
        ),
      }));
      streamed = fallback;
    } finally {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as EditorWorkspace;
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              ...parsed,
              drafts: parsed.drafts.map((d) =>
                d.id !== activeDraft.id
                  ? d
                  : {
                      ...d,
                      messages: [
                        ...d.messages.filter(
                          (m) => m.id !== userMsg.id && m.id !== assistantId
                        ),
                        userMsg,
                        {
                          id: assistantId,
                          sender: "assistant" as const,
                          content: streamed,
                          timestamp,
                        },
                      ],
                    }
              ),
            })
          );
        }
      } catch {
        // persistence best-effort
      }
    }
  }, [activeDraft, ingredients, chatSessionId]);

  return (
    <EditorContext.Provider
      value={{
        workspace,
        activeDraft,
        switchDraft,
        createDraftFork,
        renameDraft,
        deleteDraft,
        ingredients,
        updateIngredientWeight,
        toggleLockIngredient,
        removeIngredient,
        addIngredient,
        applyProposal,
        applyCandidateRecipe,
        selectedMoleculeIngredient,
        setSelectedMoleculeIngredient,
        leftPanelMode,
        setLeftPanelMode,
        centerViewMode,
        setCenterViewMode,
        activeArtifact,
        viewArtifact,
        closeArtifactView,
        artifactsListModalOpen,
        setArtifactsListModalOpen,
        actionConfigModal,
        openActionConfig,
        closeActionConfig,
        executeAction,
        sendMessage,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};
