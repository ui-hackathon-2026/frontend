"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import {
  EditorWorkspace,
  DraftFormulation,
  EditorIngredient,
  EditorChatMessage,
  EditorArtifact,
  ArtifactType,
  FormulaModificationProposal,
  FormulaDiffChange,
} from "@/domain/models/editor";
import {
  FormulaAdjustmentResponse,
  FormulaChatMessageItem,
  FormulaItemResponse,
  FormulaVersionItem,
} from "@/domain/models/formula";
import { PresetFormulaItem } from "@/domain/models/simulation";
import { getFormulaRepository, getOptimizerRepository } from "@/data/di/container";
import { ParetoCandidateFormula } from "@/domain/models/optimizer";
import { useAuth } from "@/contexts/AuthContext";

const STORAGE_KEY_ACTIVE_ID = "ps_editor_active_formula_id";

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

const INITIAL_MESSAGES_V1: EditorChatMessage[] = [
  {
    id: "msg-welcome-v1",
    sender: "assistant",
    content:
      "Halo Formulator Paragon! Selamat datang di **Studio Formulasi AI**.\n\nApa target formulasi atau riset sediaan yang ingin Anda kembangkan hari ini? Silakan pilih salah satu acuan benchmark dari **Workbench** berikut untuk langsung memuat komposisi awal, atau mulai racik bahan secara mandiri melalui Library Bahan:",
    timestamp: "Baru saja",
  },
];

function mapDtoToEditorMessages(items: FormulaChatMessageItem[]): EditorChatMessage[] {
  if (!items || items.length === 0) {
    return INITIAL_MESSAGES_V1;
  }

  // Check which proposals have already been applied by scanning confirmation messages
  const hasAppliedConfirmation = items.some(
    (it) => it.content && it.content.includes("Usulan formula berhasil diaplikasikan")
  );

  return items.map((m, idx) => {
    let proposalData = m.proposal ? { ...m.proposal } : undefined;
    if (proposalData) {
      // If proposalData explicitly has isApplied flag or there's a subsequent applied confirmation
      const isSubsequentApplied = items
        .slice(idx + 1)
        .some((it) => it.content && it.content.includes("Usulan formula berhasil diaplikasikan"));
      if (proposalData.isApplied || isSubsequentApplied) {
        proposalData.isApplied = true;
      }
    }

    return {
      id: `msg-db-${m.id}`,
      sender: m.role === "user" ? "user" : "assistant",
      content: m.content,
      timestamp: new Date(m.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      proposal: proposalData,
      linkedArtifactId: m.linked_artifact_id || undefined,
    };
  });
}

function mapDtoToEditorIngredients(dtoIngredients: FormulaItemResponse["ingredients"]): EditorIngredient[] {
  return dtoIngredients.map((item, idx) => ({
    id: `ing-${item.phase.toLowerCase()}-${item.inci.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${idx}`,
    name: item.name || item.inci,
    inci: item.inci,
    phase: (item.phase as "A" | "B" | "C" | "D") || "B",
    weightPct: item.weight_pct,
    role: inferRole(item.inci),
    isLocked: item.is_locked,
  }));
}

function inferRole(inci: string): EditorIngredient["role"] {
  const s = inci.toLowerCase();
  if (s.includes("aqua") || s.includes("water")) return "solvent";
  if (s.includes("squalane") || s.includes("triglyceride") || s.includes("oil")) return "emollient";
  if (s.includes("stearate") || s.includes("polyglyceryl") || s.includes("peg-")) return "emulsifier";
  if (s.includes("carbomer") || s.includes("gum") || s.includes("polymer")) return "thickener";
  if (s.includes("glycerin") || s.includes("glycol")) return "humectant";
  if (s.includes("chlorphenesin") || s.includes("phenoxy") || s.includes("benzoate")) return "preservative";
  if (s.includes("edta")) return "chelating";
  return "active";
}

function mapEditorToDtoPhases(ingredients: EditorIngredient[]) {
  const getPhase = (p: "A" | "B" | "C" | "D") =>
    ingredients
      .filter((i) => i.phase === p)
      .map((i) => ({
        inci: i.inci,
        name: i.name,
        weight_pct: Number(i.weightPct.toFixed(2)),
        is_locked: !!i.isLocked,
        is_solvent: i.role === "solvent",
      }));

  return {
    phase_a: getPhase("A"),
    phase_b: getPhase("B"),
    phase_c: getPhase("C"),
    phase_d: getPhase("D"),
  };
}

function buildProposalFromParetoCandidate(
  currentIngredients: EditorIngredient[],
  candidate: ParetoCandidateFormula,
  customTitle?: string
): FormulaModificationProposal {
  const updatedIngredients: EditorIngredient[] = candidate.ingredients.map((c, idx) => ({
    id: `ing-cand-${candidate.id.toLowerCase()}-${c.phase.toLowerCase()}-${c.inci.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${idx}`,
    name: c.name || c.inci,
    inci: c.inci,
    phase: c.phase,
    weightPct: Number(c.weightPct.toFixed(2)),
    role: inferRole(c.inci),
    isLocked: false,
  }));

  const currentMap = new Map<string, EditorIngredient>();
  currentIngredients.forEach((it) => currentMap.set(it.inci.toLowerCase(), it));

  const updatedMap = new Map<string, EditorIngredient>();
  updatedIngredients.forEach((it) => updatedMap.set(it.inci.toLowerCase(), it));

  const changes: FormulaDiffChange[] = [];

  // Updated or added ingredients
  for (const item of updatedIngredients) {
    const existing = currentMap.get(item.inci.toLowerCase());
    if (existing) {
      if (Math.abs(existing.weightPct - item.weightPct) > 0.05) {
        changes.push({
          ingredientId: existing.id,
          name: item.name,
          oldPct: existing.weightPct,
          newPct: item.weightPct,
          phase: item.phase,
          action: "modified",
        });
      }
    } else {
      changes.push({
        ingredientId: item.id,
        name: item.name,
        oldPct: 0,
        newPct: item.weightPct,
        phase: item.phase,
        action: "added",
      });
    }
  }

  // Removed ingredients
  for (const item of currentIngredients) {
    if (!updatedMap.has(item.inci.toLowerCase())) {
      changes.push({
        ingredientId: item.id,
        name: item.name,
        oldPct: item.weightPct,
        newPct: 0,
        phase: item.phase,
        action: "removed",
      });
    }
  }

  const title = customTitle || `Usulan Optimasi Pareto (${candidate.title})`;
  const explanation = `${candidate.archetype} • ${candidate.tradeOffSummary}\n\n🔬 Rasional Fisikokimia: ${candidate.physicochemicalRationale}\n📊 Metrik Model: Stabilitas 40°C ${candidate.metrics.stabilityPct}% | COGS Rp ${candidate.metrics.cogsIdrPerKg.toLocaleString("id-ID")}/kg | TKDN ${candidate.metrics.tkdnPct}%`;

  return {
    id: `prop-pareto-${candidate.id.toLowerCase()}-${Date.now()}`,
    title,
    explanation,
    changes,
    updatedIngredients,
  };
}

interface EditorContextType {
  workspace: EditorWorkspace;
  activeDraft: DraftFormulation | null;
  activeVersions: FormulaVersionItem[];
  isLoading: boolean;
  isSaving: boolean;
  switchDraft: (draftId: string) => void;
  createNewDraft: (name?: string) => Promise<void>;
  createDraftFork: () => Promise<void>;
  renameDraft: (draftId: string, newName: string) => Promise<void>;
  deleteDraft: (draftId: string) => Promise<void>;
  saveCurrentFormula: () => Promise<void>;
  restoreVersion: (version: FormulaVersionItem) => Promise<void>;
  applyPresetBenchmark: (preset: PresetFormulaItem) => Promise<void>;
  // Ingredients (Composition Panel)
  ingredients: EditorIngredient[];
  updateIngredientWeight: (id: string, weight: number) => void;
  toggleLockIngredient: (id: string) => void;
  removeIngredient: (id: string) => void;
  addIngredient: (item: Omit<EditorIngredient, "isLocked">) => void;
  applyProposal: (
    proposal: FormulaModificationProposal,
    mode?: "overwrite" | "new_version"
  ) => Promise<void>;
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
  const { user } = useAuth();
  const [drafts, setDrafts] = useState<DraftFormulation[]>([]);
  const [activeDraftId, setActiveDraftId] = useState<string>("");
  const [activeVersions, setActiveVersions] = useState<FormulaVersionItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [selectedMoleculeIngredient, setSelectedMoleculeIngredient] = useState<EditorIngredient | null>(null);
  const [leftPanelMode, setLeftPanelMode] = useState<"molecule-3d" | "library">("molecule-3d");
  const [centerViewMode, setCenterViewMode] = useState<"chat" | "artifact">("chat");
  const [activeArtifact, setActiveArtifact] = useState<EditorArtifact | null>(null);
  const [artifactsListModalOpen, setArtifactsListModalOpen] = useState(false);
  const [actionConfigModal, setActionConfigModal] = useState<{ isOpen: boolean; actionType: ArtifactType | null }>({
    isOpen: false,
    actionType: null,
  });

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const getActiveStorageKey = useCallback(() => {
    return user ? `${STORAGE_KEY_ACTIVE_ID}_${user.id}` : STORAGE_KEY_ACTIVE_ID;
  }, [user]);

  // Fetch formulas from backend
  const loadFormulasFromBackend = useCallback(async () => {
    setIsLoading(true);
    try {
      const repo = getFormulaRepository();
      const list = await repo.listFormulas(50);

      const mappedDrafts: DraftFormulation[] = list.map((f) => ({
        id: f.formula_id,
        name: f.name,
        createdAt: new Date(f.updated_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
        ingredients: mapDtoToEditorIngredients(f.ingredients),
        messages: INITIAL_MESSAGES_V1,
        artifacts: [],
      }));

      const storageKey = getActiveStorageKey();
      const savedActiveId = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
      const targetActive = mappedDrafts.find((d) => d.id === savedActiveId) || mappedDrafts[0];

      if (targetActive) {
        setActiveDraftId(targetActive.id);
        if (targetActive.ingredients.length > 0) {
          setSelectedMoleculeIngredient(targetActive.ingredients[0]);
        } else {
          setSelectedMoleculeIngredient(null);
        }

        try {
          const [vList, msgList] = await Promise.all([
            repo.listVersions(targetActive.id),
            repo.listMessages(targetActive.id),
          ]);
          setActiveVersions(vList);

          const initialMsgs =
            msgList && msgList.length > 0
              ? mapDtoToEditorMessages(msgList)
              : INITIAL_MESSAGES_V1;

          setDrafts(
            mappedDrafts.map((d) =>
              d.id === targetActive.id ? { ...d, messages: initialMsgs } : d
            )
          );
        } catch (e) {
          console.error("Gagal load history formula aktif:", e);
          setDrafts(mappedDrafts);
          setActiveVersions([]);
        }
      } else {
        setDrafts(mappedDrafts);
        setActiveDraftId("");
        setSelectedMoleculeIngredient(null);
        setActiveVersions([]);
      }
    } catch (err) {
      console.error("Gagal memuat formula dari backend:", err);
    } finally {
      setIsLoading(false);
    }
  }, [getActiveStorageKey]);

  useEffect(() => {
    loadFormulasFromBackend();
  }, [loadFormulasFromBackend]);

  const activeDraft: DraftFormulation | null =
    drafts.find((d) => d.id === activeDraftId) || (drafts.length > 0 ? drafts[0] : null);

  const ingredients = activeDraft ? activeDraft.ingredients : [];

  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const smilesMapRef = React.useRef<Record<string, string>>({});

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
  const switchDraft = useCallback(
    async (draftId: string) => {
      const target = drafts.find((d) => d.id === draftId);
      if (!target) return;
      setActiveDraftId(draftId);
      if (typeof window !== "undefined") {
        localStorage.setItem(getActiveStorageKey(), draftId);
      }
      if (target.ingredients.length > 0) {
        setSelectedMoleculeIngredient(target.ingredients[0]);
      } else {
        setSelectedMoleculeIngredient(null);
      }
      setCenterViewMode("chat");
      setActiveArtifact(null);

      try {
        const repo = getFormulaRepository();
        const [vList, msgList] = await Promise.all([
          repo.listVersions(draftId),
          repo.listMessages(draftId),
        ]);
        setActiveVersions(vList);
        if (msgList && msgList.length > 0) {
          const restoredMsgs = mapDtoToEditorMessages(msgList);
          setDrafts((prev) =>
            prev.map((d) => (d.id === draftId ? { ...d, messages: restoredMsgs } : d))
          );
        }
      } catch {
        setActiveVersions([]);
      }
    },
    [drafts, getActiveStorageKey]
  );

  // Save current active draft to backend
  const saveCurrentFormula = useCallback(async () => {
    if (!activeDraft) return;
    setIsSaving(true);
    try {
      const repo = getFormulaRepository();
      const phases = mapEditorToDtoPhases(activeDraft.ingredients);
      await repo.updateFormula(activeDraft.id, {
        name: activeDraft.name,
        category: "skincare",
        batch_size_g: 500,
        phases,
      });

      const vList = await repo.listVersions(activeDraft.id);
      setActiveVersions(vList);
    } catch (err) {
      console.error("Gagal menyimpan formula ke backend:", err);
    } finally {
      setIsSaving(false);
    }
  }, [activeDraft]);

  // Create Brand New Pristine Empty Draft Formula
  const createNewDraft = useCallback(async (customName?: string) => {
    setIsSaving(true);
    try {
      const repo = getFormulaRepository();
      const newVersionNum = drafts.length + 1;
      const newDraftName = customName || `Formula Baru ${newVersionNum}`;

      // Default pristine empty draft with 0 ingredients
      const created = await repo.createFormula({
        name: newDraftName,
        category: "skincare",
        batch_size_g: 500,
        notes: "Draft baru kosongan",
        phases: {
          phase_a: [],
          phase_b: [],
          phase_c: [],
          phase_d: [],
        },
      });

      const newDraft: DraftFormulation = {
        id: created.formula_id,
        name: created.name,
        createdAt: "Baru saja",
        ingredients: [],
        messages: INITIAL_MESSAGES_V1,
        artifacts: [],
      };

      setDrafts((prev) => [newDraft, ...prev]);
      setActiveDraftId(newDraft.id);
      if (typeof window !== "undefined") {
        localStorage.setItem(getActiveStorageKey(), newDraft.id);
      }
      setSelectedMoleculeIngredient(null);
      setActiveVersions([]);
      setCenterViewMode("chat");
      setActiveArtifact(null);
    } catch (err) {
      console.error("Gagal membuat formula baru:", err);
    } finally {
      setIsSaving(false);
    }
  }, [drafts.length, getActiveStorageKey]);

  // Apply Benchmark Preset from Workbench
  const applyPresetBenchmark = useCallback(
    async (preset: PresetFormulaItem) => {
      if (!activeDraft) return;
      setIsSaving(true);
      try {
        const repo = getFormulaRepository();
        const mappedIngredients: EditorIngredient[] = preset.request.ingredients.map(
          (item, idx) => ({
            id: `ing-${item.phase.toLowerCase()}-${item.inci
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "-")}-${idx}`,
            name: item.name || item.inci,
            inci: item.inci,
            phase: (item.phase as "A" | "B" | "C" | "D") || "B",
            weightPct: item.weightPct,
            role: item.role || inferRole(item.inci),
            isLocked: false,
          })
        );

        const phases = mapEditorToDtoPhases(mappedIngredients);
        await repo.updateFormula(activeDraft.id, {
          name: preset.name,
          category: preset.category,
          batch_size_g: 500,
          phases,
        });

        const userMsg: EditorChatMessage = {
          id: `msg-user-preset-${Date.now()}`,
          sender: "user",
          content: `Saya memilih acuan benchmark: "${preset.name}".`,
          timestamp: "Baru saja",
        };

        const assistantMsg: EditorChatMessage = {
          id: `msg-asst-preset-${Date.now() + 1}`,
          sender: "assistant",
          content: `Bagus! Komposisi acuan benchmark **${preset.name}** (${preset.request.ingredients.length} bahan) telah dimuat ke kanvas 4-Fase dengan total 100.0%.\n\nKarakteristik acuan:\n- **Kategori**: ${preset.category}\n- **Catatan R&D**: ${preset.description}\n\nKomposisi siap dikembangkan! Anda dapat menyesuaikan konsentrasi bahan di Composition Panel kanan, menginspeksi konformasi molekul 3D, atau menguji stabilitas 40°C melalui menu **(+)**.`,
          timestamp: "Baru saja",
        };

        setDrafts((prev) =>
          prev.map((d) =>
            d.id === activeDraft.id
              ? {
                  ...d,
                  name: preset.name,
                  ingredients: mappedIngredients,
                  messages: [...d.messages, userMsg, assistantMsg],
                }
              : d
          )
        );

        if (mappedIngredients.length > 0) {
          setSelectedMoleculeIngredient(mappedIngredients[0]);
        }

        // Persist interaction to backend sequentially
        try {
          await repo.addMessage(activeDraft.id, {
            role: "user",
            content: userMsg.content,
          });
          await repo.addMessage(activeDraft.id, {
            role: "assistant",
            content: assistantMsg.content,
          });
        } catch (e) {
          console.error("Gagal persist preset messages:", e);
        }

        try {
          const vList = await repo.listVersions(activeDraft.id);
          setActiveVersions(vList);
        } catch {
          // ignore
        }
      } catch (err) {
        console.error("Gagal memuat preset benchmark:", err);
      } finally {
        setIsSaving(false);
      }
    },
    [activeDraft]
  );

  // Create Draft Fork (Clones active formula)
  const createDraftFork = useCallback(async () => {
    if (!activeDraft) {
      await createNewDraft();
      return;
    }
    setIsSaving(true);
    try {
      const repo = getFormulaRepository();
      const newVersionNum = drafts.length + 1;
      const newDraftName = `draft-formulation v${newVersionNum} (Fork)`;
      const phases = mapEditorToDtoPhases(activeDraft.ingredients);

      const created = await repo.createFormula({
        name: newDraftName,
        category: "skincare",
        batch_size_g: 500,
        notes: `Difork dari ${activeDraft.name}`,
        phases,
      });

      const newDraft: DraftFormulation = {
        id: created.formula_id,
        name: created.name,
        createdAt: "Baru saja",
        ingredients: mapDtoToEditorIngredients(created.ingredients),
        messages: [
          {
            id: `msg-fork-${Date.now()}`,
            sender: "assistant" as const,
            content: `Draft baru **${created.name}** berhasil difork ke cloud backend dari **${activeDraft.name}**. Anda dapat memodifikasi komposisi, menguji simulasi independen, dan melihat audit trail version-nya.`,
            timestamp: "Baru saja",
          },
        ],
        artifacts: [],
      };

      setDrafts((prev) => [newDraft, ...prev]);
      setActiveDraftId(newDraft.id);
      if (typeof window !== "undefined") {
        localStorage.setItem(getActiveStorageKey(), newDraft.id);
      }
      setActiveVersions([]);
      setCenterViewMode("chat");
      setActiveArtifact(null);
    } catch (err) {
      console.error("Gagal melakukan fork formula:", err);
    } finally {
      setIsSaving(false);
    }
  }, [activeDraft, drafts.length, createNewDraft, getActiveStorageKey]);

  // Rename Draft in Backend
  const renameDraft = useCallback(
    async (draftId: string, newName: string) => {
      setDrafts((prev) => prev.map((d) => (d.id === draftId ? { ...d, name: newName } : d)));
      try {
        const repo = getFormulaRepository();
        const target = drafts.find((d) => d.id === draftId);
        if (target) {
          const phases = mapEditorToDtoPhases(target.ingredients);
          await repo.updateFormula(draftId, {
            name: newName,
            category: "skincare",
            batch_size_g: 500,
            phases,
          });
        }
      } catch (err) {
        console.error("Gagal rename formula:", err);
      }
    },
    [drafts]
  );

  // Delete Draft in Backend
  const deleteDraft = useCallback(
    async (draftId: string) => {
      try {
        const repo = getFormulaRepository();
        await repo.deleteFormula(draftId);
        const remaining = drafts.filter((d) => d.id !== draftId);
        setDrafts(remaining);
        if (activeDraftId === draftId) {
          if (remaining.length > 0) {
            const next = remaining[0];
            setActiveDraftId(next.id);
            if (typeof window !== "undefined") {
              localStorage.setItem(getActiveStorageKey(), next.id);
            }
            setSelectedMoleculeIngredient(next.ingredients[0] || null);
            const vList = await repo.listVersions(next.id);
            setActiveVersions(vList);
          } else {
            setActiveDraftId("");
            setSelectedMoleculeIngredient(null);
            setActiveVersions([]);
            if (typeof window !== "undefined") {
              localStorage.removeItem(getActiveStorageKey());
            }
          }
        }
      } catch (err) {
        console.error("Gagal menghapus formula:", err);
      }
    },
    [drafts, activeDraftId, getActiveStorageKey]
  );

  // Restore snapshot version
  const restoreVersion = useCallback(
    async (v: FormulaVersionItem) => {
      if (!activeDraft) return;
      setIsSaving(true);
      try {
        const repo = getFormulaRepository();
        const ingredientsDto = v.snapshot.ingredients.map((i) => ({
          inci: i.inci,
          name: i.name,
          weight_pct: i.weight_pct,
          phase: (i.phase as "A" | "B" | "C" | "D") || "B",
          is_locked: i.is_locked,
          is_solvent: i.inci.toLowerCase().includes("aqua"),
        }));
        const phases = {
          phase_a: ingredientsDto.filter((i) => i.phase === "A"),
          phase_b: ingredientsDto.filter((i) => i.phase === "B"),
          phase_c: ingredientsDto.filter((i) => i.phase === "C"),
          phase_d: ingredientsDto.filter((i) => i.phase === "D"),
        };
        const updated = await repo.updateFormula(activeDraft.id, {
          name: `${activeDraft.name} (v${v.version} Restored)`,
          category: v.snapshot.category ?? "skincare",
          batch_size_g: v.snapshot.batch_size_g ?? 500,
          phases,
        });

        const restoredIngredients = mapDtoToEditorIngredients(updated.ingredients);
        setDrafts((prev) =>
          prev.map((d) => (d.id === activeDraft.id ? { ...d, name: updated.name, ingredients: restoredIngredients } : d))
        );
        const vList = await repo.listVersions(activeDraft.id);
        setActiveVersions(vList);
      } catch (err) {
        console.error("Gagal me-restore versi formula:", err);
      } finally {
        setIsSaving(false);
      }
    },
    [activeDraft]
  );

  // Auto-normalize ingredients when a weight changes + debounced backend autosave
  const updateIngredientWeight = useCallback(
    (id: string, newWeight: number) => {
      if (!activeDraft) return;
      const clampedWeight = Math.max(0.01, Math.min(99.0, Number(newWeight.toFixed(2))));
      const current = ingredients.map((item) => (item.id === id ? { ...item, weightPct: clampedWeight } : item));
      const targetId = id;

      const otherUnlocked = current.filter((item) => item.id !== targetId && !item.isLocked);
      const lockedTotal = current
        .filter((item) => item.isLocked || item.id === targetId)
        .reduce((acc, it) => acc + it.weightPct, 0);
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

      setDrafts((prev) =>
        prev.map((d) => (d.id === activeDraft.id ? { ...d, ingredients: normalized } : d))
      );

      // Debounce autosave to backend (1.5 seconds)
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = setTimeout(async () => {
        try {
          setIsSaving(true);
          const repo = getFormulaRepository();
          const phases = mapEditorToDtoPhases(normalized);
          await repo.updateFormula(activeDraft.id, {
            name: activeDraft.name,
            category: "skincare",
            batch_size_g: 500,
            phases,
          });
          const vList = await repo.listVersions(activeDraft.id);
          setActiveVersions(vList);
        } catch (e) {
          console.error("Autosave gagal:", e);
        } finally {
          setIsSaving(false);
        }
      }, 1500);
    },
    [ingredients, activeDraft]
  );

  // Toggle Lock
  const toggleLockIngredient = useCallback(
    (id: string) => {
      if (!activeDraft) return;
      const updatedIngredients = ingredients.map((it) => (it.id === id ? { ...it, isLocked: !it.isLocked } : it));
      setDrafts((prev) =>
        prev.map((d) => (d.id === activeDraft.id ? { ...d, ingredients: updatedIngredients } : d))
      );
    },
    [ingredients, activeDraft]
  );

  // Remove Ingredient
  const removeIngredient = useCallback(
    (id: string) => {
      if (!activeDraft || ingredients.length <= 1) return;
      const filtered = ingredients.filter((it) => it.id !== id);
      setDrafts((prev) =>
        prev.map((d) => (d.id === activeDraft.id ? { ...d, ingredients: filtered } : d))
      );
    },
    [ingredients, activeDraft]
  );

  // Add Ingredient
  const addIngredient = useCallback(
    (item: Omit<EditorIngredient, "isLocked">) => {
      if (!activeDraft) return;
      const exists = ingredients.some((it) => it.name.toLowerCase() === item.name.toLowerCase());
      if (exists) return;
      const newIng: EditorIngredient = { ...item, isLocked: false };
      const updated = [...ingredients, newIng];
      setDrafts((prev) =>
        prev.map((d) => (d.id === activeDraft.id ? { ...d, ingredients: updated } : d))
      );
      setSelectedMoleculeIngredient(newIng);
    },
    [ingredients, activeDraft]
  );

  // Apply Proposal from AI (Supports Overwrite current version vs Create New Version)
  const applyProposal = useCallback(
    async (
      proposal: FormulaModificationProposal,
      mode: "overwrite" | "new_version" = "new_version"
    ) => {
      if (!activeDraft) return;
      setIsSaving(true);
      try {
        const repo = getFormulaRepository();
        const phases = mapEditorToDtoPhases(proposal.updatedIngredients);

        if (mode === "new_version") {
          // CREATE A REAL NEW DRAFT FORMULA IN BACKEND & WORKSPACE!
          const newDraftNum = drafts.length + 1;
          const cleanBaseName = activeDraft.name.replace(/\s*\(v\d+.*?\)$/i, "").trim();
          const newDraftName = `${cleanBaseName} (v${newDraftNum})`;

          const created = await repo.createFormula({
            name: newDraftName,
            category: "skincare",
            batch_size_g: 500,
            notes: `Dibuat dari usulan: ${proposal.title}`,
            phases,
          });

          const initialMsgContent = `Draft formula baru **${created.name}** berhasil dibuat berdasarkan usulan **${proposal.title}**.\n\nKomposisi baru (${proposal.updatedIngredients.length} bahan) telah dimuat ke Composition Panel. Anda dapat mulai menguji simulasi kestabilan 40°C atau meminta modifikasi formula lanjutan pada chat ini.`;

          const welcomeMsg: EditorChatMessage = {
            id: `msg-welcome-${Date.now()}`,
            sender: "assistant",
            content: initialMsgContent,
            timestamp: "Baru saja",
          };

          const newDraft: DraftFormulation = {
            id: created.formula_id,
            name: created.name,
            createdAt: "Baru saja",
            ingredients: mapDtoToEditorIngredients(created.ingredients),
            messages: [welcomeMsg],
            artifacts: [],
          };

          // Persist initial message to backend for new formula
          try {
            await repo.addMessage(created.formula_id, {
              role: "assistant",
              content: initialMsgContent,
            });
          } catch (e) {
            console.error("Gagal persist initial message for new formula draft:", e);
          }

          // Mark proposal as applied on the previous draft
          setDrafts((prev) => [
            newDraft,
            ...prev.map((d) => {
              if (d.id !== activeDraft.id) return d;
              return {
                ...d,
                messages: d.messages.map((m) => {
                  if (m.proposal && (m.proposal.id === proposal.id || !proposal.id)) {
                    return {
                      ...m,
                      proposal: {
                        ...m.proposal,
                        isApplied: true,
                        appliedMode: "new_version" as const,
                      },
                    };
                  }
                  return m;
                }),
              };
            }),
          ]);

          setActiveDraftId(newDraft.id);
          if (typeof window !== "undefined") {
            localStorage.setItem(getActiveStorageKey(), newDraft.id);
          }
          setActiveVersions([]);
          if (newDraft.ingredients.length > 0) {
            setSelectedMoleculeIngredient(newDraft.ingredients[0]);
          }

          // Buka chat formula baru
          setCenterViewMode("chat");
          setActiveArtifact(null);
          return;
        }

        // OVERWRITE MODE: Updates active formula in-place
        const updated = await repo.updateFormula(
          activeDraft.id,
          {
            name: activeDraft.name,
            category: "skincare",
            batch_size_g: 500,
            phases,
          },
          false // do not create snapshot, overwrite current
        );

        const freshIngredients = mapDtoToEditorIngredients(updated.ingredients);
        const confirmationContent = `Formula aktif **${activeDraft.name}** berhasil diperbarui (Overwrite). Komposisi di Composition Panel telah disinkronkan langsung ke cloud backend.`;

        setDrafts((prev) =>
          prev.map((d) => {
            if (d.id !== activeDraft.id) return d;

            const updatedMessages = d.messages.map((m) => {
              if (m.proposal && (m.proposal.id === proposal.id || !proposal.id)) {
                return {
                  ...m,
                  proposal: {
                    ...m.proposal,
                    isApplied: true,
                    appliedMode: "overwrite" as const,
                  },
                };
              }
              return m;
            });

            return {
              ...d,
              ingredients: freshIngredients,
              messages: [
                ...updatedMessages,
                {
                  id: `sys-applied-${Date.now()}`,
                  sender: "assistant" as const,
                  content: confirmationContent,
                  timestamp: "Baru saja",
                },
              ],
            };
          })
        );

        try {
          await repo.addMessage(activeDraft.id, {
            role: "assistant",
            content: confirmationContent,
          });
        } catch (e) {
          console.error("Gagal persist applied msg:", e);
        }

        try {
          const vList = await repo.listVersions(activeDraft.id);
          setActiveVersions(vList);
        } catch {}

        // Kembali ke chat ini lagi
        setCenterViewMode("chat");
        setActiveArtifact(null);
      } catch (err) {
        console.error("Gagal menerapkan usulan formula:", err);
      } finally {
        setIsSaving(false);
      }
    },
    [activeDraft, drafts.length, getActiveStorageKey]
  );

  // Artifact & Modal Controls
  const viewArtifact = useCallback((art: EditorArtifact) => {
    setActiveArtifact(art);
    setCenterViewMode("artifact");
  }, []);

  const closeArtifactView = useCallback(() => {
    setCenterViewMode("chat");
  }, []);

  const openActionConfig = useCallback((type: ArtifactType) => {
    setActionConfigModal({ isOpen: true, actionType: type });
  }, []);

  const closeActionConfig = useCallback(() => {
    setActionConfigModal({ isOpen: false, actionType: null });
  }, []);

  // Apply candidate recipe (bulk, by INCI match, single renormalization + persist)
  const applyCandidateRecipe = useCallback(
    async (entries: Array<{ inci: string; weightPct: number }>) => {
      if (!activeDraft) return;
      const byInci = new Map(entries.map((e) => [e.inci.toLowerCase(), e.weightPct]));
      const matched = ingredients.map((it) =>
        byInci.has(it.inci.toLowerCase())
          ? { ...it, weightPct: byInci.get(it.inci.toLowerCase()) as number }
          : it
      );
      const total = matched.reduce((acc, it) => acc + it.weightPct, 0);
      const normalized =
        total > 0
          ? matched.map((it) => ({
              ...it,
              weightPct: Number(((it.weightPct / total) * 100).toFixed(2)),
            }))
          : matched;
      setDrafts((prev) =>
        prev.map((d) => (d.id !== activeDraft.id ? d : { ...d, ingredients: normalized }))
      );
      try {
        const repo = getFormulaRepository();
        await repo.updateFormula(activeDraft.id, {
          name: activeDraft.name,
          category: "skincare",
          batch_size_g: 500,
          phases: mapEditorToDtoPhases(normalized),
        });
      } catch (err) {
        console.error("Gagal menyimpan hasil apply:", err);
      }
    },
    [ingredients, activeDraft]
  );

  // Execute Action Menu (+) — real backend engines
  const executeAction = useCallback(
    async (type: ArtifactType, configParams?: any) => {
      if (!activeDraft) return;
      closeActionConfig();

      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const simIngredients = await toSimulateIngredients();
      let actionProposal: FormulaModificationProposal | undefined = undefined;

      const pushArtifact = (
        title: string,
        subtitle: string,
        dataPayload: any,
        chatText: string,
        proposal?: FormulaModificationProposal
      ) => {
        const newArtifact: EditorArtifact = {
          id: `art-${type}-${Date.now().toString().slice(-4)}`,
          type,
          title,
          subtitle,
          createdAt: timestamp,
          data: dataPayload,
        };
        const newChatMsg: EditorChatMessage = {
          id: `msg-art-${Date.now()}`,
          sender: "assistant" as const,
          content: chatText,
          timestamp,
          linkedArtifactId: newArtifact.id,
          proposal,
        };
        setDrafts((prev) =>
          prev.map((d) => {
            if (d.id !== activeDraft.id) return d;
            return {
              ...d,
              artifacts: [newArtifact, ...d.artifacts],
              messages: [...d.messages, newChatMsg],
            };
          })
        );
        getFormulaRepository()
          .addMessage(activeDraft.id, {
            role: "assistant",
            content: chatText,
            proposal: proposal || undefined,
          })
          .catch((e) => console.error("Gagal persist artifact message:", e));
        viewArtifact(newArtifact);
      };

      const pushError = (label: string) => {
        const newChatMsg: EditorChatMessage = {
          id: `msg-${Date.now()}`,
          sender: "assistant" as const,
          content: `${label} gagal dijalankan: backend tidak tersedia. Coba lagi nanti.`,
          timestamp,
        };
        setDrafts((prev) =>
          prev.map((d) =>
            d.id !== activeDraft.id ? d : { ...d, messages: [...d.messages, newChatMsg] }
          )
        );
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
            recipe: Object.fromEntries(
              (c.ingredients || []).map((i: any) => [i.inci, i.weightPct])
            ),
          }));
          if ((res.topCandidates || []).length > 0) {
            try {
              actionProposal = buildProposalFromParetoCandidate(
                activeDraft.ingredients,
                res.topCandidates[0]
              );
            } catch (e) {
              console.error("Gagal menyusun proposal pareto:", e);
            }
          }
          pushArtifact(
            "Pareto Frontier Multi-Objective Optimization",
            `${res.trialsEvaluated} iterasi NSGA-II • Trade-off Cost vs. Stability vs. TKDN`,
            {
              candidates,
              topCandidates: res.topCandidates || [],
              trialsEvaluated: res.trialsEvaluated,
              executionTimeMs: res.executionTimeMs,
              nonDominatedCount: res.nonDominatedCount,
            },
            `Optimasi Pareto selesai: ${res.trialsEvaluated} iterasi, ${res.nonDominatedCount} titik front non-dominated. Report telah siap ditinjau.`,
            actionProposal
          );
        } else if (type === "sentinel") {
          const res: any = await apiPost("/api/v1/compliance/audit", {
            formula_name: activeDraft.name,
            ingredients: simIngredients,
          });
          const violations = (res.ingredients_audit || []).filter(
            (a: any) => a.status !== "PASSED"
          ).length;
          pushArtifact(
            "Regulatory Compliance & Halal Audit",
            "BPOM Annex III/V • Halal Assurance System HAS-23000",
            {
              status: res.overall_status,
              bpomScore: `${Math.round((res.compliance_score || 0) * 100)}%`,
              halalScore: res.halal_status,
              tkdnScore: `${res.total_tkdn_pct}%`,
              checkedRules: (res.ingredients_audit || []).length,
              violations,
            },
            `Audit regulasi selesai dengan status ${res.overall_status}. ${violations} temuan dari ${(res.ingredients_audit || []).length} bahan.`
          );
        } else if (type === "simulation") {
          const res: any = await apiPost("/api/v1/simulate/stability", {
            formula_name: activeDraft.name,
            temperature_c: configParams?.temperature ?? 40,
            duration_days: configParams?.durationDays ?? 90,
            ingredients: simIngredients,
          });
          pushArtifact(
            "Tropical Stability Report (40°C / 75% RH)",
            "Simulasi kestabilan dipercepat 90 hari • LightGBM Model",
            {
              probStability: Math.round((res.stability_score_40c_90days || 0) * 1000) / 10,
              viscosityMpaS: Math.round(res.dynamic_viscosity_mpas || 0),
              dropletDlsNm: Math.round((res.mean_droplet_size_nm || 0) * 10) / 10,
              gibbsDeltaG: res.thermodynamics?.gibbs_free_energy_kj_mol ?? null,
              verdict: res.verdict,
            },
            `Simulasi kestabilan 40°C selesai: skor ${Math.round((res.stability_score_40c_90days || 0) * 1000) / 10}% (${res.verdict}).`
          );
        } else {
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
            "Benchmark Chemical Similarity Radar",
            "Cosine similarity & Morgan Fingerprints",
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
                novelty_score: external.novelty_score,
                top_matches: (external.top_matches || []).map((m: any) => ({
                  brand: m.brand,
                  product_name: m.product_name,
                  url: m.url,
                  similarity: m.similarity,
                  shared_ingredients: m.shared_ingredients,
                })),
              },
            },
            `Analisis komparasi selesai. Skor kebaruan vs produk beredar: ${Math.round((external.novelty_score || 0) * 100)}%.`
          );
        }
      } catch (err) {
        console.error(err);
        pushError(
          type === "pareto"
            ? "Optimasi Pareto"
            : type === "sentinel"
              ? "Audit regulasi"
              : type === "simulation"
                ? "Simulasi kestabilan"
                : "Analisis similaritas"
        );
      }
    },
    [activeDraft, closeActionConfig, toSimulateIngredients, viewArtifact]
  );

  // Chat message send: propose-adjustment for modification intents,
  // SSE copilot stream for general discussion. All messages persist.
  const sendMessage = useCallback(
    async (text: string) => {
      if (!activeDraft) return;
      const draftId = activeDraft.id;
      const draftName = activeDraft.name;
      const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const userMsg: EditorChatMessage = {
        id: `user-${Date.now()}`,
        sender: "user" as const,
        content: text,
        timestamp,
      };
      const repo = getFormulaRepository();

      setDrafts((prev) =>
        prev.map((d) => (d.id === draftId ? { ...d, messages: [...d.messages, userMsg] } : d))
      );
      repo.addMessage(draftId, { role: "user", content: text }).catch((e) =>
        console.error("Gagal persist user message:", e)
      );

      const persistAssistant = async (content: string, proposal?: FormulaModificationProposal) => {
        try {
          await repo.addMessage(draftId, {
            role: "assistant",
            content,
            proposal: proposal || undefined,
          });
        } catch (e) {
          console.error("Gagal persist assistant message:", e);
        }
      };

      const streamCopilotReply = async (): Promise<string> => {
        const assistantId = `ai-${Date.now()}`;
        let streamed = "";
        setDrafts((prev) =>
          prev.map((d) =>
            d.id !== draftId
              ? d
              : {
                  ...d,
                  messages: [
                    ...d.messages,
                    { id: assistantId, sender: "assistant" as const, content: "", timestamp },
                  ],
                }
          )
        );
        const res = await fetch(`${API_BASE}/api/v1/copilot/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({
            message: text,
            session_id: chatSessionId,
            canvas: {
              formula_name: draftName,
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
              const token = evt.token;
              setDrafts((prev) =>
                prev.map((d) =>
                  d.id !== draftId
                    ? d
                    : {
                        ...d,
                        messages: d.messages.map((m) =>
                          m.id === assistantId ? { ...m, content: m.content + token } : m
                        ),
                      }
                )
              );
            } else if (evt.type === "meta" && typeof evt.session_id === "string") {
              setChatSessionId(evt.session_id);
            } else if (evt.type === "error") {
              throw new Error(typeof evt.detail === "string" ? evt.detail : "AI error");
            }
          }
        }
        if (!streamed) throw new Error("empty reply");
        return streamed;
      };

      if (ingredients.length > 0) {

      // Pareto / multi-objective trade-off queries → real optimizer + proposal card
      if (/(pareto|optima|sweet spot|multi-objective|trade-off|rekomendasi kandidat)/i.test(text)) {
        try {
          setIsSaving(true);
          const optRepo = getOptimizerRepository();
          const paretoRes = await optRepo.runOptimization({
            preset: "balanced",
            trialsCount: 2000,
            weights: {
              stabilityWeight: 35,
              cogsWeight: 30,
              tkdnWeight: 20,
              viscosityWeight: 15,
            },
            constraints: {
              minStabilityPct: 85,
              maxCogsIdrPerKg: 45000,
              minTkdnPct: 40,
              targetViscosityMpaS: 5200,
            },
          });

          const paretoArtId = `art-pareto-${Date.now().toString().slice(-4)}`;
          const paretoArtifact: EditorArtifact = {
            id: paretoArtId,
            type: "pareto",
            title: "Pareto Frontier Multi-Objective Optimization",
            subtitle: `${paretoRes.trialsEvaluated.toLocaleString("id-ID")} iterasi NSGA-II • LightGBM Model`,
            createdAt: "Baru saja",
            data: {
              ...paretoRes,
              maxCogs: 45000,
              minStability: 85,
              minTkdn: 40,
              candidates: paretoRes.topCandidates.map((c) => ({
                id: c.id,
                name: c.title,
                cogs: c.metrics.cogsIdrPerKg,
                stability: c.metrics.stabilityPct,
                tkdn: c.metrics.tkdnPct,
                isBest: c.id === "A",
              })),
            },
          };

          setDrafts((prev) =>
            prev.map((d) => (d.id === draftId ? { ...d, artifacts: [paretoArtifact, ...d.artifacts] } : d))
          );

          if (paretoRes.topCandidates.length > 0) {
            const candA = paretoRes.topCandidates[0];
            const chatProposal = buildProposalFromParetoCandidate(ingredients, candA);
            const chatContent = `Berdasarkan inferensi model **LightGBM terakselerasi GPU** dan **${paretoRes.trialsEvaluated.toLocaleString("id-ID")} iterasi Pareto NSGA-II**, saya menemukan konfigurasi Sweet Spot (**${candA.title}**).\n\n` +
              `📊 **Hasil Inferensi Model Multi-Objektif**:\n` +
              `- **Stabilitas Dipercepat 40°C**: **${candA.metrics.stabilityPct}%** (Lolos Uji Kestabilan Tropis)\n` +
              `- **Estimasi COGS**: **Rp ${candA.metrics.cogsIdrPerKg.toLocaleString("id-ID")}/kg**\n` +
              `- **Kandungan TKDN**: **${candA.metrics.tkdnPct}%**\n` +
              `- **Viskositas Target**: **${candA.metrics.viscosityMpaS.toLocaleString("id-ID")} mPa.s** (HLB Sistem: ${candA.metrics.systemHlb})\n\n` +
              `🔬 **Rasional Fisikokimia Formulasi**:\n${candA.physicochemicalRationale}\n\n` +
              `💡 *${candA.tradeOffSummary}*\n\n` +
              `Saya telah melampirkan lembar analisis Pareto dan menyusun usulan penyesuaian komposisi formula pada kartu di bawah ini. Anda dapat memilih **Buat Versi Baru (Snapshot)** untuk menyimpan checkpoint baru, atau **Overwrite Versi Ini** untuk langsung menimpa formula aktif.`;
            const paretoMsg: EditorChatMessage = {
              id: `ai-${Date.now()}`,
              sender: "assistant" as const,
              content: chatContent,
              timestamp,
              proposal: chatProposal,
              linkedArtifactId: paretoArtId,
            };
            setDrafts((prev) =>
              prev.map((d) => (d.id === draftId ? { ...d, messages: [...d.messages, paretoMsg] } : d))
            );
            await persistAssistant(chatContent, chatProposal);
            viewArtifact(paretoArtifact);
            return;
          }
          viewArtifact(paretoArtifact);
        } catch (err) {
          console.error("Gagal menjalankan pareto dari chat:", err);
        } finally {
          setIsSaving(false);
        }
      }
        try {
          const res = await repo.proposeAdjustment(draftId, text);
          if (res && res.changes && res.changes.length > 0) {
            const updatedEditorIngredients: EditorIngredient[] = [];
            const mapping = [
              { phase: "A" as const, items: res.updated_phases.phase_a },
              { phase: "B" as const, items: res.updated_phases.phase_b },
              { phase: "C" as const, items: res.updated_phases.phase_c },
              { phase: "D" as const, items: res.updated_phases.phase_d },
            ];
            let idx = 0;
            for (const group of mapping) {
              for (const it of group.items) {
                updatedEditorIngredients.push({
                  id: `ing-${group.phase.toLowerCase()}-${it.inci.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${idx++}`,
                  name: it.name || it.inci,
                  inci: it.inci,
                  phase: group.phase,
                  weightPct: it.weight_pct,
                  role: inferRole(it.inci),
                  isLocked: it.is_locked,
                });
              }
            }
            const proposal: FormulaModificationProposal = {
              id: `prop-${Date.now()}`,
              title: res.title,
              explanation: res.explanation,
              changes: res.changes.map((c) => ({
                ingredientId: c.ingredient_id,
                name: c.name,
                oldPct: c.old_pct,
                newPct: c.new_pct,
                phase: (c.phase as "A" | "B" | "C" | "D") || "B",
                action: c.action,
              })),
              updatedIngredients: updatedEditorIngredients,
            };
            const content = `Saya telah menganalisis permintaan Anda dan menyusun usulan modifikasi formula.\n\nSilakan periksa kartu usulan di bawah ini. Anda dapat memilih untuk **Terapkan Sebagai Versi Baru** (menyimpan snapshot v${activeVersions.length + 1}) atau **Overwrite Versi Ini** (menimpa draft aktif langsung).`;
            const assistantMsg: EditorChatMessage = {
              id: `ai-${Date.now()}`,
              sender: "assistant" as const,
              content,
              timestamp,
              proposal,
            };
            setDrafts((prev) =>
              prev.map((d) =>
                d.id === draftId ? { ...d, messages: [...d.messages, assistantMsg] } : d
              )
            );
            await persistAssistant(content, proposal);
            return;
          }
        } catch (err) {
          console.error("Gagal meminta usulan formulasi AI:", err);
        }
      }

      if (ingredients.length === 0) {
        const emptyContent = `Kanvas formula masih kosong. Silakan pilih salah satu acuan benchmark dari Workbench di atas atau tambahkan bahan pertama Anda dari Library Bahan.`;
        const emptyMsg: EditorChatMessage = {
          id: `ai-${Date.now()}`,
          sender: "assistant" as const,
          content: emptyContent,
          timestamp,
        };
        setDrafts((prev) =>
          prev.map((d) => (d.id === draftId ? { ...d, messages: [...d.messages, emptyMsg] } : d))
        );
        await persistAssistant(emptyContent);
        return;
      }
      try {
        const reply = await streamCopilotReply();
        await persistAssistant(reply);
      } catch (err) {
        console.error(err);
        const fallback = "Maaf, asisten AI tidak tersedia saat ini. Coba lagi nanti.";
        setDrafts((prev) =>
          prev.map((d) =>
            d.id !== draftId
              ? d
              : {
                  ...d,
                  messages: [
                    ...d.messages,
                    { id: `ai-${Date.now()}`, sender: "assistant" as const, content: fallback, timestamp },
                  ],
                }
          )
        );
        await persistAssistant(fallback);
      }
    },
    [ingredients, activeDraft, activeVersions.length, chatSessionId]
  );

  const workspace: EditorWorkspace = {
    id: "ws-paragon",
    name: "Paragon R&D Studio: Tropical Skincare",
    activeDraftId: activeDraft ? activeDraft.id : "",
    drafts,
  };

  return (
    <EditorContext.Provider
      value={{
        workspace,
        activeDraft,
        activeVersions,
        isLoading,
        isSaving,
        switchDraft,
        createNewDraft,
        createDraftFork,
        renameDraft,
        deleteDraft,
        saveCurrentFormula,
        restoreVersion,
        applyPresetBenchmark,
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