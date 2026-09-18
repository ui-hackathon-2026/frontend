"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ComplianceAuditReport,
  RagChatMessage,
} from "@/domain/models/compliance";
import { getComplianceRepository, getSimulationRepository } from "@/data/di/container";
import { PresetFormulaItem } from "@/domain/models/simulation";

export function useCompliance() {
  const [presets, setPresets] = useState<PresetFormulaItem[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");
  const [report, setReport] = useState<ComplianceAuditReport | null>(null);
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);
  const [chatMessages, setChatMessages] = useState<RagChatMessage[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "Halo! Saya adalah **Enterprise Regulatory & Halal Sentinel**. Basis data saya terindeks secara semantik (Vector RAG) dengan **Peraturan BPOM No. 25 Tahun 2025** (Lampiran I-V), Daftar Bahan Bebas Sertifikasi Halal **KMA 1360/2021 & HAS 23000**, serta Kebijakan Nilai TKDN **Permenperin 15/2011**. Ada yang bisa saya bantu audit mengenai batas kadar bahan, bahan terlarang, atau status titik kritis halal?",
      timestamp: "Sekarang",
    },
  ]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  const complianceRepo = getComplianceRepository();
  const simRepo = getSimulationRepository();

  // Load preset formulas on mount
  useEffect(() => {
    let mounted = true;
    simRepo.getPresetFormulas().then((data) => {
      if (!mounted) return;
      setPresets(data);
      if (data.length > 0) {
        setSelectedPresetId(data[0].id);
        // Automatically run initial audit on first preset
        setIsLoadingAudit(true);
        complianceRepo
          .auditFormula(data[0].name, data[0].category, data[0].request.ingredients)
          .then((res) => {
            if (mounted) setReport(res);
          })
          .finally(() => {
            if (mounted) setIsLoadingAudit(false);
          });
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const selectPresetAndAudit = useCallback(
    async (presetId: string) => {
      setSelectedPresetId(presetId);
      const found = presets.find((p) => p.id === presetId);
      if (!found) return;

      setIsLoadingAudit(true);
      try {
        const res = await complianceRepo.auditFormula(
          found.name,
          found.category,
          found.request.ingredients
        );
        setReport(res);
      } catch (err) {
        console.error("Compliance audit error:", err);
      } finally {
        setIsLoadingAudit(false);
      }
    },
    [presets, complianceRepo]
  );

  const sendRagQuery = useCallback(
    async (queryText: string) => {
      if (!queryText.trim()) return;

      const userMsg: RagChatMessage = {
        id: `user_${Date.now()}`,
        sender: "user",
        text: queryText,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };

      setChatMessages((prev) => [...prev, userMsg]);
      setIsLoadingChat(true);

      try {
        const botResponse = await complianceRepo.askRagKnowledge(
          queryText,
          report?.category || "Kosmetik Umum"
        );
        setChatMessages((prev) => [...prev, botResponse]);
      } catch (err) {
        console.error("RAG chat error:", err);
      } finally {
        setIsLoadingChat(false);
      }
    },
    [complianceRepo, report]
  );

  return {
    presets,
    selectedPresetId,
    selectPresetAndAudit,
    report,
    isLoadingAudit,
    chatMessages,
    isLoadingChat,
    sendRagQuery,
  };
}
