"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  ProjectBriefInput,
  FormulationBlueprint,
  ExistingFormulaChassis,
  HeroIngredientSelection,
  ChatMessage,
} from "@/domain/models/brief";
import { getBriefRepository } from "@/data/di/container";

const DEFAULT_BRIEF: ProjectBriefInput = {
  projectName: "Hydrating Sunscreen Barrier Gel",
  brand: "Wardah",
  category: "Gel-Cream",
  skinProfile: "Kulit Sensitif Tropis",
  sensoryFinish: "Lightweight Dewy",
  targetSpf: 30,
  targetViscosityMpaS: 5200,
  maxCogsIdrPerKg: 42000,
  targetTkdnPct: 45.0,
  selectedHeroIngredients: ["Ekstrak Centella Asiatica (Pegagan Jawa Barat)"],
  specialInstructions: "Formula O/W non-greasy tahan cuaca panas lembap perkotaan.",
};

export function useProjectBrief() {
  const [brief, setBrief] = useState<ProjectBriefInput>(DEFAULT_BRIEF);
  const [blueprint, setBlueprint] = useState<FormulationBlueprint | null>(null);
  const [heroCatalog, setHeroCatalog] = useState<HeroIngredientSelection[]>([]);
  const [chassisList, setChassisList] = useState<ExistingFormulaChassis[]>([]);
  const [selectedChassisId, setSelectedChassisId] = useState<string>("");
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [isParsingPdf, setIsParsingPdf] = useState<boolean>(false);
  const [pdfClaims, setPdfClaims] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-init",
      sender: "assistant",
      content:
        "Halo Formulator Paragon! Saya asisten AI Project Brief Studio. Parameter brief Anda siap disintesis menjadi arsitektur formula 4-fase, atau tanyakan saya seputar rekomendasi bahan aktif lokal & optimasi COGS.",
      timestamp: "Baru saja",
    },
  ]);
  const [isChatSending, setIsChatSending] = useState<boolean>(false);
  const chatSessionIdRef = useRef<string | null>(null);

  const repository = getBriefRepository();

  useEffect(() => {
    let mounted = true;
    Promise.all([
      repository.getHeroIngredientsCatalog(),
      repository.getExistingChassisList(),
    ]).then(([heroes, chassis]) => {
      if (!mounted) return;
      setHeroCatalog(heroes);
      setChassisList(chassis);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const updateBriefField = useCallback(
    <K extends keyof ProjectBriefInput>(field: K, value: ProjectBriefInput[K]) => {
      setBrief((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const toggleHeroIngredient = useCallback((name: string) => {
    setBrief((prev) => {
      const exists = prev.selectedHeroIngredients.includes(name);
      return {
        ...prev,
        selectedHeroIngredients: exists
          ? prev.selectedHeroIngredients.filter((n) => n !== name)
          : [...prev.selectedHeroIngredients, name],
      };
    });
  }, []);

  const applyChassis = useCallback(
    (chassisId: string) => {
      setSelectedChassisId(chassisId);
      const found = chassisList.find((c) => c.id === chassisId);
      if (!found) return;
      setBrief((prev) => ({
        ...prev,
        projectName: `${found.brand} ${found.name} (Enhanced)`,
        brand: found.brand as any,
        category: found.category,
        targetViscosityMpaS: found.baseViscosity,
        maxCogsIdrPerKg: found.cogsIdrPerKg + 5000,
        targetTkdnPct: found.tkdnPct,
      }));
    },
    [chassisList]
  );

  const handleParsePdf = useCallback(
    async (file: File) => {
      setIsParsingPdf(true);
      setError(null);
      try {
        const res = await repository.parseMarketingPdf(file);
        setBrief((prev) => ({ ...prev, ...res.extractedBrief }));
        setPdfClaims(res.detectedClaims);
      } catch (err: any) {
        setError(err?.message || "Gagal memproses file PDF brief");
      } finally {
        setIsParsingPdf(false);
      }
    },
    [repository]
  );

  const handleSynthesize = useCallback(async () => {
    setIsSynthesizing(true);
    setError(null);
    try {
      const res = await repository.synthesizeBlueprint(brief);
      setBlueprint(res);
    } catch (err: any) {
      setError(err?.message || "Gagal menyintesis cetak biru formula");
    } finally {
      setIsSynthesizing(false);
    }
  }, [brief, repository]);

  const handleSendChat = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      const userMsg: ChatMessage = {
        id: "usr-" + Date.now(),
        sender: "user",
        content: text,
        timestamp: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, userMsg]);
      const assistantId = "asst-" + Date.now();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          sender: "assistant",
          content: "",
          timestamp: new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setIsChatSending(true);

      try {
        await repository.sendChatMessage(
          text,
          { brief, blueprint },
          {
            sessionId: chatSessionIdRef.current ?? undefined,
            onToken: (token) =>
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: m.content + token } : m
                )
              ),
            onSession: (id) => {
              chatSessionIdRef.current = id;
            },
          }
        );
      } catch (err) {
        console.error(err);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: "Maaf, asisten AI tidak tersedia saat ini. Coba lagi nanti." }
              : m
          )
        );
      } finally {
        setIsChatSending(false);
      }
    },
    [brief, blueprint, repository]
  );

  return {
    brief,
    updateBriefField,
    toggleHeroIngredient,
    blueprint,
    heroCatalog,
    chassisList,
    selectedChassisId,
    applyChassis,
    isSynthesizing,
    isParsingPdf,
    pdfClaims,
    handleParsePdf,
    handleSynthesize,
    messages,
    isChatSending,
    handleSendChat,
    error,
  };
}
