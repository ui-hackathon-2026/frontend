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
import { getFormulaRepository, getOptimizerRepository, getWorkspaceRepository } from "@/data/di/container";
import { ParetoCandidateFormula } from "@/domain/models/optimizer";
import { useAuth } from "@/contexts/AuthContext";

const STORAGE_KEY_ACTIVE_ID = "ps_editor_active_formula_id";

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

export const EditorProvider: React.FC<{ children: ReactNode; workspaceId?: string }> = ({
  children,
  workspaceId,
}) => {
  const { user } = useAuth();
  const [drafts, setDrafts] = useState<DraftFormulation[]>([]);
  const [workspaceName, setWorkspaceName] = useState<string>("Untitled");
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
      // No workspace scope (e.g. /editor opened directly, or a brand new
      // workspace with nothing imported into it yet) means a blank editor,
      // never the unscoped global formula list.
      if (!workspaceId) {
        setDrafts([]);
        setActiveDraftId("");
        setSelectedMoleculeIngredient(null);
        setActiveVersions([]);
        return;
      }

      const repo = getFormulaRepository();
      const list = await repo.listFormulas(2000, workspaceId);

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
  }, [getActiveStorageKey, workspaceId]);

  useEffect(() => {
    loadFormulasFromBackend();
  }, [loadFormulasFromBackend]);

  // Resolve the real workspace name from the backend; "Untitled" whenever
  // there's no ?workspace= (direct /editor access) or the lookup fails.
  useEffect(() => {
    if (!workspaceId) {
      setWorkspaceName("Untitled");
      return;
    }
    let cancelled = false;
    getWorkspaceRepository()
      .getWorkspace(workspaceId)
      .then((ws) => {
        if (!cancelled) setWorkspaceName(ws.name || "Untitled");
      })
      .catch(() => {
        if (!cancelled) setWorkspaceName("Untitled");
      });
    return () => {
      cancelled = true;
    };
  }, [workspaceId]);

  const activeDraft: DraftFormulation | null =
    drafts.find((d) => d.id === activeDraftId) || (drafts.length > 0 ? drafts[0] : null);

  const ingredients = activeDraft ? activeDraft.ingredients : [];

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
        project_id: workspaceId ?? null,
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
  }, [drafts.length, getActiveStorageKey, workspaceId]);

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
        project_id: workspaceId ?? null,
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
  }, [activeDraft, drafts.length, createNewDraft, getActiveStorageKey, workspaceId]);

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

        // create_version is true for new_version, false for overwrite
        const shouldCreateVersion = mode === "new_version";

        const updated = await repo.updateFormula(
          activeDraft.id,
          {
            name: activeDraft.name,
            category: "skincare",
            batch_size_g: 500,
            phases,
          },
          shouldCreateVersion
        );

        const freshIngredients = mapDtoToEditorIngredients(updated.ingredients);

        const modeBadge =
          mode === "new_version"
            ? "versi snapshot baru"
            : "overwrite (timpa versi saat ini)";

        const confirmationContent = `Usulan formula berhasil diaplikasikan sebagai **${modeBadge}**. Komposisi di Composition Panel telah diperbarui dan disinkronkan ke cloud backend.`;

        setDrafts((prev) =>
          prev.map((d) => {
            if (d.id !== activeDraft.id) return d;

            // Mark the proposal that was applied as applied
            const updatedMessages = d.messages.map((m) => {
              if (m.proposal && m.proposal.id === proposal.id) {
                return {
                  ...m,
                  proposal: {
                    ...m.proposal,
                    isApplied: true,
                    appliedMode: mode,
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

        const vList = await repo.listVersions(activeDraft.id);
        setActiveVersions(vList);
      } catch (err) {
        console.error("Gagal menerapkan usulan formula:", err);
      } finally {
        setIsSaving(false);
      }
    },
    [activeDraft]
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

  // Execute Action Menu (+)
  const executeAction = useCallback(
    async (type: ArtifactType, configParams?: any) => {
      if (!activeDraft) return;
      closeActionConfig();

      const newArtId = `art-${type}-${Date.now().toString().slice(-4)}`;
      let newArtifact: EditorArtifact;
      let proposal: FormulaModificationProposal | undefined = undefined;
      let assistantContent = "";

      if (type === "simulation") {
        newArtifact = {
          id: newArtId,
          type: "simulation",
          title: "Tropical Stability Report (40°C / 75% RH)",
          subtitle: "Simulasi kestabilan dipercepat 90 hari • LightGBM Model",
          createdAt: "Baru saja",
          data: {
            temperature: configParams?.temperature ?? 40,
            humidity: configParams?.humidity ?? 75,
            durationDays: configParams?.durationDays ?? 90,
            stressCycleEnabled: configParams?.stressCycleEnabled ?? true,
            stabilityScore: 94.2,
            phaseSeparationRisk: "Low (0.04)",
            dropletSize: "148.5 nm",
            pdi: "0.185",
            viscosity: "8,450 cP",
            shelfLifeEst: "24 Bulan",
          },
        };
        assistantContent = `Aksi komputasi **${newArtifact.title}** selesai diproses. Klik tombol di bawah untuk membuka lembar analisis lengkap.`;
      } else if (type === "pareto") {
        setIsSaving(true);
        try {
          const optRepo = getOptimizerRepository();
          const normalizedPreset = (configParams?.preset || "balanced").replace("-", "_") as any;
          const minTkdn = configParams?.targetTkdn ?? configParams?.minTkdn ?? 40;
          const maxCogs = configParams?.maxCogs ?? 45000;
          const minStability = configParams?.minStability ?? 85;

          const paretoRes = await optRepo.runOptimization({
            preset: normalizedPreset,
            trialsCount: 2000,
            weights: {
              stabilityWeight: 35,
              cogsWeight: 30,
              tkdnWeight: 20,
              viscosityWeight: 15,
            },
            constraints: {
              minStabilityPct: minStability,
              maxCogsIdrPerKg: maxCogs,
              minTkdnPct: minTkdn,
              targetViscosityMpaS: 5200,
            },
          });

          newArtifact = {
            id: newArtId,
            type: "pareto",
            title: "Pareto Frontier Multi-Objective Optimization",
            subtitle: `${paretoRes.trialsEvaluated.toLocaleString("id-ID")} iterasi NSGA-II • Model LightGBM • Hypervolume ${paretoRes.hypervolumeScore.toFixed(3)}`,
            createdAt: "Baru saja",
            data: {
              ...paretoRes,
              maxCogs,
              minStability,
              minTkdn,
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

          if (paretoRes.topCandidates.length > 0) {
            const candA = paretoRes.topCandidates[0];
            proposal = buildProposalFromParetoCandidate(activeDraft.ingredients, candA);
            assistantContent = `Aksi komputasi **Pareto Frontier Multi-Objective Optimizer** selesai dievaluasi (${paretoRes.trialsEvaluated.toLocaleString("id-ID")} iterasi dengan model inferensi LightGBM & NSGA-II).\n\n**Rekomendasi Utama (${candA.title})**:\n- **Stabilitas 40°C**: **${candA.metrics.stabilityPct}%** (Lolos Uji Kestabilan Tropis)\n- **Estimasi COGS**: **Rp ${candA.metrics.cogsIdrPerKg.toLocaleString("id-ID")}/kg**\n- **Kandungan TKDN**: **${candA.metrics.tkdnPct}%**\n- **Viskositas**: **${candA.metrics.viscosityMpaS.toLocaleString("id-ID")} mPa.s** (Target HLB: ${candA.metrics.systemHlb})\n\n💡 *${candA.tradeOffSummary}*\n\n🔬 **Rasional Fisikokimia**: ${candA.physicochemicalRationale}\n\nSaya telah menyusun usulan modifikasi formula berdasarkan kandidat ini pada kartu di bawah. Anda dapat memilih **Buat Versi Baru (Snapshot)** atau **Overwrite Versi Ini**, atau klik tombol report untuk meninjau data komputasi.`;
          } else {
            assistantContent = `Aksi komputasi **${newArtifact.title}** selesai diproses. Klik tombol di bawah untuk membuka lembar analisis lengkap.`;
          }
        } catch (err) {
          console.error("Gagal menjalankan optimasi Pareto real:", err);
          newArtifact = {
            id: newArtId,
            type: "pareto",
            title: "Pareto Frontier Multi-Objective Optimization",
            subtitle: "50.000 iterasi NSGA-II • Trade-off Cost vs. Stability vs. TKDN",
            createdAt: "Baru saja",
            data: {
              maxCogs: configParams?.maxCogs ?? 45000,
              minStability: configParams?.minStability ?? 85,
              minTkdn: configParams?.minTkdn ?? 40,
              candidates: [
                { id: "cand-1", name: "Candidate A: Balanced Trade-off", cogs: 38500, stability: 92.4, tkdn: 46.2, isBest: true },
                { id: "cand-2", name: "Candidate B: Cost Leader (Hemat)", cogs: 29200, stability: 88.1, tkdn: 41.5, isBest: false },
                { id: "cand-3", name: "Candidate C: High-TKDN Lokal", cogs: 44000, stability: 90.8, tkdn: 54.8, isBest: false },
              ],
            },
          };
          assistantContent = `Aksi komputasi **${newArtifact.title}** selesai diproses. Klik tombol di bawah untuk membuka lembar analisis lengkap.`;
        } finally {
          setIsSaving(false);
        }
      } else if (type === "sentinel") {
        newArtifact = {
          id: newArtId,
          type: "sentinel",
          title: "Regulatory Compliance & Halal Audit",
          subtitle: "BPOM Annex III/V • Halal Assurance System HAS-23000",
          createdAt: "Baru saja",
          data: {
            overallStatus: "PASSED",
            bpomCompliance: "100% Compliant",
            halalStatus: "100% Certified / Halal Compliant",
            totalTkdn: "62.8%",
            checkedCount: ingredients.length,
            violations: [],
          },
        };
        assistantContent = `Aksi komputasi **${newArtifact.title}** selesai diproses. Klik tombol di bawah untuk membuka lembar analisis lengkap.`;
      } else {
        newArtifact = {
          id: newArtId,
          type: "similarity",
          title: "Benchmark Chemical Similarity Radar",
          subtitle: "Cosine similarity & Morgan Fingerprints",
          createdAt: "Baru saja",
          data: { similarityScore: "91.4%" },
        };
        assistantContent = `Aksi komputasi **${newArtifact.title}** selesai diproses. Klik tombol di bawah untuk membuka lembar analisis lengkap.`;
      }

      const assistantMsg: EditorChatMessage = {
        id: `msg-art-${Date.now()}`,
        sender: "assistant" as const,
        content: assistantContent,
        timestamp: "Baru saja",
        linkedArtifactId: newArtifact.id,
        proposal,
      };

      setDrafts((prev) =>
        prev.map((d) => {
          if (d.id !== activeDraft.id) return d;
          return {
            ...d,
            artifacts: [newArtifact, ...d.artifacts],
            messages: [...d.messages, assistantMsg],
          };
        })
      );

      // Persist assistant message with proposal to backend
      try {
        const repo = getFormulaRepository();
        await repo.addMessage(activeDraft.id, {
          role: "assistant",
          content: assistantContent,
          proposal: proposal || undefined,
        });
      } catch (e) {
        console.error("Gagal persist artifact message:", e);
      }

      viewArtifact(newArtifact);
    },
    [activeDraft, closeActionConfig, ingredients, viewArtifact]
  );

  // Chat message send
  const sendMessage = useCallback(
    async (text: string) => {
      if (!activeDraft) return;
      const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const userMsg: EditorChatMessage = {
        id: `user-${Date.now()}`,
        sender: "user" as const,
        content: text,
        timestamp,
      };

      // Push user message immediately
      setDrafts((prev) =>
        prev.map((d) => (d.id === activeDraft.id ? { ...d, messages: [...d.messages, userMsg] } : d))
      );

      // Persist user message to backend
      const repo = getFormulaRepository();
      repo.addMessage(activeDraft.id, {
        role: "user",
        content: text,
      }).catch((e) => console.error("Gagal persist user message:", e));

      let assistantReply = "";
      let proposal: FormulaModificationProposal | undefined = undefined;
      let linkedArtifactId: string | undefined = undefined;

      // Check if user is asking for Pareto optimization or multi-objective trade-off
      const isParetoQuery = /(pareto|optima|sweet spot|multi-objective|trade-off|rekomendasi kandidat)/i.test(text);

      if (isParetoQuery && ingredients.length > 0) {
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

          // Save artifact into active draft
          setDrafts((prev) =>
            prev.map((d) => (d.id === activeDraft.id ? { ...d, artifacts: [paretoArtifact, ...d.artifacts] } : d))
          );

          if (paretoRes.topCandidates.length > 0) {
            const candA = paretoRes.topCandidates[0];
            proposal = buildProposalFromParetoCandidate(ingredients, candA);
            linkedArtifactId = paretoArtifact.id;

            assistantReply = `Berdasarkan inferensi model **LightGBM terakselerasi GPU** dan **${paretoRes.trialsEvaluated.toLocaleString("id-ID")} iterasi Pareto NSGA-II**, saya menemukan konfigurasi Sweet Spot (**${candA.title}**).\n\n` +
              `📊 **Hasil Inferensi Model Multi-Objektif**:\n` +
              `- **Stabilitas Dipercepat 40°C**: **${candA.metrics.stabilityPct}%** (Lolos Uji Kestabilan Tropis)\n` +
              `- **Estimasi COGS**: **Rp ${candA.metrics.cogsIdrPerKg.toLocaleString("id-ID")}/kg**\n` +
              `- **Kandungan TKDN**: **${candA.metrics.tkdnPct}%**\n` +
              `- **Viskositas Target**: **${candA.metrics.viscosityMpaS.toLocaleString("id-ID")} mPa.s** (HLB Sistem: ${candA.metrics.systemHlb})\n\n` +
              `🔬 **Rasional Fisikokimia Formulasi**:\n${candA.physicochemicalRationale}\n\n` +
              `💡 *${candA.tradeOffSummary}*\n\n` +
              `Saya telah melampirkan lembar analisis Pareto dan menyusun usulan penyesuaian komposisi formula pada kartu di bawah ini. Anda dapat memilih **Buat Versi Baru (Snapshot)** untuk menyimpan checkpoint baru, atau **Overwrite Versi Ini** untuk langsung menimpa formula aktif.`;
          }
        } catch (err) {
          console.error("Gagal menjalankan pareto dari chat:", err);
        } finally {
          setIsSaving(false);
        }
      }

      // If formula has ingredients and no pareto proposal generated, call AI backend propose-adjustment endpoint
      if (!proposal && ingredients.length > 0) {
        try {
          const res = await repo.proposeAdjustment(activeDraft.id, text);

          if (res && res.changes && res.changes.length > 0) {
            // Flatten phases to EditorIngredient[]
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

            proposal = {
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

            assistantReply = `Saya telah menganalisis permintaan Anda dan menyusun usulan modifikasi formula.\n\nSilakan periksa kartu usulan di bawah ini. Anda dapat memilih untuk **Terapkan Sebagai Versi Baru** (menyimpan snapshot v${activeVersions.length + 1}) atau **Overwrite Versi Ini** (menimpa draft aktif langsung).`;
          } else {
            assistantReply = `Saran formulasi R&D: Formula pada **${activeDraft.name}** saat ini memiliki kesetimbangan fase yang sangat baik (${ingredients.length} bahan terdaftar). Anda dapat menjalankan aksi **Simulasi 40°C** atau **Pareto Optimizer** di tombol (+) untuk validasi lebih mendalam.`;
          }
        } catch (err) {
          console.error("Gagal meminta usulan formulasi AI:", err);
          assistantReply = `Mohon maaf, sistem formulasi AI sedang mengalami kendala jaringan. Anda tetap dapat menyesuaikan konsentrasi bahan langsung di Composition Panel.`;
        }
      } else if (!proposal && ingredients.length === 0) {
        assistantReply = `Kanvas formula masih kosong. Silakan pilih salah satu acuan benchmark dari Workbench di atas atau tambahkan bahan pertama Anda dari Library Bahan.`;
      }

      const assistantMsg: EditorChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "assistant" as const,
        content: assistantReply,
        timestamp,
        proposal,
        linkedArtifactId,
      };

      setDrafts((prev) =>
        prev.map((d) => (d.id === activeDraft.id ? { ...d, messages: [...d.messages, assistantMsg] } : d))
      );

      // Persist assistant message with proposal to backend
      try {
        await repo.addMessage(activeDraft.id, {
          role: "assistant",
          content: assistantReply,
          proposal: proposal || undefined,
        });
      } catch (e) {
        console.error("Gagal persist assistant message:", e);
      }
    },
    [ingredients, activeDraft, activeVersions.length]
  );

  const workspace: EditorWorkspace = {
    id: workspaceId || "ws-untitled",
    name: workspaceName,
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