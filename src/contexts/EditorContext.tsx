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
  const [actionConfigModal, setActionConfigModal] = useState<{ isOpen: boolean; actionType: ArtifactType | null }>({
    isOpen: false,
    actionType: null,
  });

  // Restore workspace from localStorage
  useEffect(() => {
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
        }
      }
    } catch {
      // fallback to default
    }
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

  const activeDraft = workspace.drafts.find((d) => d.id === workspace.activeDraftId) || workspace.drafts[0];
  const ingredients = activeDraft.ingredients;

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

  // Execute Action & Generate Artifact
  const executeAction = useCallback((type: ArtifactType, configParams?: any) => {
    closeActionConfig();

    const timestamp = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    let artifactTitle = "";
    let artifactSubtitle = "";
    let dataPayload: any = {};
    let assistantChatText = "";

    if (type === "pareto") {
      artifactTitle = "Hasil Optimasi Multi-Objektif Pareto NSGA-II";
      artifactSubtitle = "50.000 iterasi evaluasi simpleks massa ∑w = 100%";
      assistantChatText = "Saya telah mengevaluasi 50.000 iterasi formula menggunakan Optuna NSGA-II pada GPU L40S. Report **Pareto Frontier** telah siap ditinjau.";
      dataPayload = {
        config: configParams || { maxCost: 50000, minStability: 85, targetTkdn: 40 },
        candidates: [
          { name: "Kandidat A (Balanced)", stability: "92.4%", cogs: "Rp 38.500", tkdn: "46.2%", hlb: "9.4" },
          { name: "Kandidat B (Cost Leader)", stability: "88.1%", cogs: "Rp 29.200", tkdn: "41.5%", hlb: "9.1" },
          { name: "Kandidat C (High-TKDN)", stability: "90.8%", cogs: "Rp 44.000", tkdn: "54.8%", hlb: "9.6" },
        ],
      };
    } else if (type === "sentinel") {
      artifactTitle = "Laporan Audit Regulasi BPOM & Halal HAS 23000";
      artifactSubtitle = "Skrining Perka BPOM No. 17/2022 & sertifikasi Halal bahan";
      assistantChatText = "Audit regulasi selesai. Seluruh bahan dalam batas aman BPOM dan bebas dari kontaminan non-halal. Report kepatuhan telah dibuka.";
      dataPayload = {
        status: "COMPLIANT",
        bpomScore: "100%",
        halalScore: "Lolos Uji HAS 23000",
        tkdnScore: "44.8%",
        checkedRules: 18,
      };
    } else if (type === "simulation") {
      artifactTitle = "Hasil Simulasi Fisikokimia Kestabilan 40°C";
      artifactSubtitle = "Inkubator Iklim Tropis Zona IVb (40°C / 75% RH / 90 Hari)";
      assistantChatText = "Simulasi kestabilan 40°C in-silico selesai (LightGBM surrogate inference <1 ms). Probabilitas kestabilan fisik terprediksi tinggi.";
      dataPayload = {
        probStability: 94.2,
        viscosityMpaS: 5350,
        dropletDlsNm: 145,
        gibbsDeltaG: -14.2,
      };
    } else if (type === "similarity") {
      artifactTitle = "Analisis Kemiripan Formula & Patent Novelty FTO";
      artifactSubtitle = "Paragon Cross-Brand Knowledge Base vs Global Patent Landscape";
      assistantChatText = "Analisis komparasi formula selesai. Chassis memiliki kemiripan 78% dengan Wardah Hydra Rose dan skor Patent Freedom-to-Operate 89%.";
      dataPayload = {
        chassisOverlap: 78,
        brandClosest: "Wardah Hydra Rose Dewy Gel",
        patentNoveltyIndex: 89,
        infringementRisk: "LOW",
      };
    }

    const newArtifact: EditorArtifact = {
      id: `art-${type}-${Date.now()}`,
      type,
      title: artifactTitle,
      subtitle: artifactSubtitle,
      createdAt: timestamp,
      data: dataPayload,
    };

    const newChatMsg: EditorChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "assistant" as const,
      content: assistantChatText,
      timestamp,
      linkedArtifactId: newArtifact.id,
    };

    const updatedDrafts = workspace.drafts.map((d) => {
      if (d.id !== activeDraft.id) return d;
      return {
        ...d,
        artifacts: [newArtifact, ...d.artifacts],
        messages: [...d.messages, newChatMsg],
      };
    });

    saveWorkspace({ ...workspace, drafts: updatedDrafts });
    setActiveArtifact(newArtifact);
    setCenterViewMode("artifact");
  }, [workspace, activeDraft, saveWorkspace, closeActionConfig]);

  // Send Chat Message
  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    const timestamp = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

    const userMsg: EditorChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user" as const,
      content: text,
      timestamp,
    };

    // Check if user is asking to modify formula
    const lower = text.toLowerCase();
    let proposal: FormulaModificationProposal | undefined;
    let assistantReply = "";

    if (lower.includes("tambah") || lower.includes("kurang") || lower.includes("ganti") || lower.includes("optimasi") || lower.includes("niacinamide")) {
      // Create a smart proposal diff
      const currentNiacinamide = ingredients.find((it) => it.id === "ing-niacinamide")?.weightPct || 3.0;
      const targetNiacinamide = currentNiacinamide >= 4 ? 2.0 : 4.0;
      const water = ingredients.find((it) => it.id === "ing-water")?.weightPct || 70.0;
      const waterDiff = currentNiacinamide - targetNiacinamide;
      const newWater = Number((water + waterDiff).toFixed(2));

      const updated = ingredients.map((it) => {
        if (it.id === "ing-niacinamide") return { ...it, weightPct: targetNiacinamide };
        if (it.id === "ing-water") return { ...it, weightPct: newWater };
        return it;
      });

      proposal = {
        id: `prop-${Date.now()}`,
        title: `Penyesuaian Konsentrasi Niacinamide (${targetNiacinamide}%) & Keseimbangan Air`,
        explanation: `Menaikkan Niacinamide ke ${targetNiacinamide}% untuk memperkuat klaim pencerah dan sawar kulit, dengan menyeimbangkan Demineralized Water ke ${newWater}% agar total formula tetap 100%.`,
        changes: [
          {
            ingredientId: "ing-niacinamide",
            name: "Niacinamide (Vitamin B3)",
            oldPct: currentNiacinamide,
            newPct: targetNiacinamide,
            phase: "D",
            action: "modified",
          },
          {
            ingredientId: "ing-water",
            name: "Demineralized Water",
            oldPct: water,
            newPct: newWater,
            phase: "B",
            action: "modified",
          },
        ],
        updatedIngredients: updated,
      };

      assistantReply = `Saya telah merancang usulan modifikasi formula berdasarkan permintaan Anda. Silakan periksa rincian perubahannya di kartu bawah dan klik **Terapkan ke Kitchen Panel** untuk mengaplikasikannya.`;
    } else {
      assistantReply = `Saran formulasi R&D: Formula pada **${activeDraft.name}** saat ini memiliki kesetimbangan fase yang sangat baik dengan rasio surfaktan-ke-minyak (SOR) terukur. Anda dapat menjalankan aksi **Simulasi 40°C** atau **Pareto Optimizer** di tombol (+) untuk validasi lebih mendalam.`;
    }

    const assistantMsg: EditorChatMessage = {
      id: `ai-${Date.now()}`,
      sender: "assistant" as const,
      content: assistantReply,
      timestamp,
      proposal,
    };

    const updatedDrafts = workspace.drafts.map((d) => {
      if (d.id !== activeDraft.id) return d;
      return {
        ...d,
        messages: [...d.messages, userMsg, assistantMsg],
      };
    });

    saveWorkspace({ ...workspace, drafts: updatedDrafts });
  }, [ingredients, workspace, activeDraft, saveWorkspace]);

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
