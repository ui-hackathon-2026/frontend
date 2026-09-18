"use client";

import React, { useState, useRef, useEffect } from "react";
import { useEditor } from "@/contexts/EditorContext";
import { ActionPlusMenu } from "./ActionPlusMenu";
import { InlineActionConfigCard } from "./InlineActionConfigCard";
import { ArtifactType } from "@/domain/models/editor";
import { DelayedInfoTooltip } from "@/components/DelayedInfoTooltip";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import {
  Plus,
  Send,
  Sparkles,
  Bot,
  User,
  Sliders,
  CheckCircle2,
  FileText,
  ArrowRight,
  Zap,
  History,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { getSimulationRepository } from "@/data/di/container";
import { PresetFormulaItem } from "@/domain/models/simulation";

export const CenterChatPanel: React.FC = () => {
  const {
    activeDraft,
    sendMessage,
    executeAction,
    applyProposal,
    applyPresetBenchmark,
    viewArtifact,
    setArtifactsListModalOpen,
    createNewDraft,
    isGenerating,
    generatingStatus,
  } = useEditor();

  const [presets, setPresets] = useState<PresetFormulaItem[]>([]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const [activeInlineAction, setActiveInlineAction] = useState<ArtifactType | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inlineActionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const simRepo = getSimulationRepository();
    simRepo.getPresetFormulas().then(setPresets);
  }, []);

  const messages = activeDraft ? activeDraft.messages : [];

  const scrollToInlineAction = React.useCallback(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight + 1500,
        behavior: "smooth",
      });
    }
    if (inlineActionRef.current) {
      inlineActionRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isGenerating) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isGenerating]);

  // Clear any active action widget whenever the active draft is changed or deleted
  useEffect(() => {
    setActiveInlineAction(null);
    setPlusMenuOpen(false);
  }, [activeDraft?.id]);

  useEffect(() => {
    if (activeInlineAction) {
      scrollToInlineAction();
      requestAnimationFrame(scrollToInlineAction);
      const timer1 = setTimeout(scrollToInlineAction, 60);
      const timer2 = setTimeout(scrollToInlineAction, 180);
      const timer3 = setTimeout(scrollToInlineAction, 360);
      const timer4 = setTimeout(scrollToInlineAction, 600);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
  }, [activeInlineAction, scrollToInlineAction]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim()) return;
    sendMessage(inputPrompt);
    setInputPrompt("");
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white font-sans relative">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200/80 bg-white/90 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#0a192f] text-white flex items-center justify-center">
            <Bot className="w-4 h-4 text-blue-200" />
          </div>
          <div>
            <h2 className="text-xs font-extrabold text-[#0a192f] tracking-tight font-heading">
              Formulation Co-Pilot
            </h2>
          </div>
        </div>

        {/* Right: List of Artifacts Button */}
        <div className="flex items-center gap-2">
          {activeDraft && (
            <button
              type="button"
              onClick={() => setArtifactsListModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-[#001299] bg-slate-50 hover:bg-blue-50/50 text-xs font-semibold text-slate-700 hover:text-[#001299] transition-all cursor-pointer shadow-2xs"
              title="Buka daftar report artifact tersimpan"
            >
              <FileText className="w-3.5 h-3.5 text-[#001299]" />
              <span>Artifacts ({activeDraft.artifacts.length})</span>
            </button>
          )}

          <DelayedInfoTooltip
            content="Klik untuk melihat dokumen dan hasil analitik yang telah dibuat pada draft ini."
            position="bottom"
            align="right"
            delayMs={300}
          />
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {!activeDraft ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#001299] flex items-center justify-center border border-blue-100 mb-1">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Selamat Datang di Studio Formulasi</h3>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Anda belum memiliki formula yang tersimpan di cloud. Buat formula baru sekarang untuk mulai berkonsultasi dengan AI Co-Pilot.
            </p>
            <button
              type="button"
              onClick={() => createNewDraft()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#001299] hover:bg-[#000e7a] text-white transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Formula Pertama</span>
            </button>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => {
            const isUser = msg.sender === "user";

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-2xl ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                    isUser
                      ? "bg-[#001299] text-white"
                      : "bg-[#0a192f] text-blue-200"
                  }`}
                >
                  {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-2">
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isUser
                        ? "bg-[#001299] text-white rounded-tr-xs"
                        : "bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-xs"
                    }`}
                  >
                    <MarkdownRenderer content={msg.content} isUser={isUser} />
                  </div>

                  {/* Benchmark Presets Selector from Workbench (Shown on empty canvas) */}
                  {!isUser && activeDraft.ingredients.length === 0 && presets.length > 0 && idx === 0 && (
                    <div className="pt-2 space-y-2.5 max-w-2xl">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                          Pilihan Riset &amp; Benchmark (Workbench)
                        </span>
                        <span className="text-[10px] text-[#001299] font-mono font-bold bg-blue-50 px-2 py-0.5 rounded-md">
                          {presets.length} Formula Acuan
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {presets.map((preset) => (
                          <div
                            key={preset.id}
                            onClick={() => applyPresetBenchmark(preset)}
                            className="group text-left p-4 rounded-2xl border border-slate-200 hover:border-[#001299] bg-white hover:bg-blue-50/40 transition-all cursor-pointer flex flex-col justify-between space-y-3 shadow-2xs hover:shadow-xs ring-0 hover:ring-2 hover:ring-[#001299]/20"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-[#001299] bg-blue-100/70 px-2 py-0.5 rounded-md">
                                  {preset.category}
                                </span>
                              </div>
                              <h4 className="font-bold text-slate-900 text-xs leading-snug group-hover:text-[#001299] transition-colors">
                                {preset.name}
                              </h4>
                              <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
                                {preset.description}
                              </p>
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                              <span>{preset.request.ingredients.length} Komponen Bahan</span>
                              <span className="inline-flex items-center gap-1 font-semibold text-[#001299] group-hover:translate-x-0.5 transition-transform">
                                <span>Pilih</span>
                                <ArrowRight className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Linked Artifact Button */}
                  {msg.linkedArtifactId && (
                    <div className="pt-1">
                      {(() => {
                        const linked = activeDraft?.artifacts.find((a) => a.id === msg.linkedArtifactId);
                        if (!linked) return null;
                        return (
                          <button
                            type="button"
                            onClick={() => viewArtifact(linked)}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                          >
                            <FileText className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Buka Report: {linked.title}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />
                          </button>
                        );
                      })()}
                    </div>
                  )}

                  {/* Formula Proposal Diff Card */}
                  {msg.proposal && (
                    <div className="p-4 rounded-2xl bg-white border border-blue-200 shadow-xs space-y-3 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-[#001299] font-heading flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#001299]" />
                          <span>Usulan Modifikasi Formula</span>
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 font-mono">
                          {msg.proposal.changes.length} Komponen Berubah
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-800">
                          {msg.proposal.title}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {msg.proposal.explanation}
                        </p>
                      </div>

                      {/* Changes Pill List */}
                      <div className="space-y-1.5 pt-1">
                        {msg.proposal.changes.map((chg) => (
                          <div
                            key={chg.ingredientId}
                            className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-xs border border-slate-100 font-mono"
                          >
                            <span className="text-slate-800 font-semibold truncate mr-2">
                              {chg.name}
                            </span>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-slate-400 line-through">
                                {chg.oldPct.toFixed(1)}%
                              </span>
                              <ArrowRight className="w-3 h-3 text-slate-400" />
                              <span className="text-emerald-600 font-bold">
                                {chg.newPct.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Action Choice: New Version vs Overwrite (Hidden if already applied) */}
                      {msg.proposal.isApplied ? (
                        <div className="pt-2 flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>
                              {msg.proposal.appliedMode === "new_version"
                                ? "Usulan telah diterapkan sebagai Versi Baru"
                                : "Usulan telah diterapkan (Overwrite)"}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md">
                            Sudah Diaplikasikan
                          </span>
                        </div>
                      ) : (
                        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => applyProposal(msg.proposal!, "new_version")}
                            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#001299] hover:bg-[#000e7a] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer group"
                          >
                            <History className="w-3.5 h-3.5 text-blue-200 group-hover:rotate-12 transition-transform" />
                            <span>Buat Versi Baru (Snapshot)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => applyProposal(msg.proposal!, "overwrite")}
                            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-all cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                            <span>Overwrite Versi Ini</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
            })}

            {/* Chatbot Generating / Processing Notification Indicator */}
            {isGenerating && (
              <div className="flex gap-3 max-w-2xl mr-auto animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold bg-[#0a192f] text-blue-200 shadow-2xs">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="p-3.5 rounded-2xl text-xs bg-slate-50 border border-blue-100/90 text-slate-800 rounded-tl-xs space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#001299] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#001299]"></span>
                    </span>
                    <span className="text-[#001299] font-bold">
                      {generatingStatus || "Co-Pilot sedang menganalisis & merumuskan respons..."}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 pl-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#001299]/70 animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#001299]/70 animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#001299]/70 animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}

            {/* Inline Action Launcher (if opened from (+)) */}
            {activeInlineAction && (
              <div ref={inlineActionRef} className="pt-2 scroll-mt-4">
                <InlineActionConfigCard
                  actionType={activeInlineAction}
                  hasIngredients={activeDraft.ingredients.length > 0}
                  onClose={() => setActiveInlineAction(null)}
                  onExecute={(type, params) => {
                    executeAction(type, params);
                    setActiveInlineAction(null);
                  }}
                />
              </div>
            )}
          </>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Action Bar */}
      <div className="p-4 border-t border-slate-200/80 bg-white shrink-0">
        <form onSubmit={handleSend} className="relative flex items-center gap-2">
          {/* Action (+) Button */}
          <div className="relative shrink-0">
            <button
              type="button"
              disabled={!activeDraft || isGenerating}
              onClick={() => setPlusMenuOpen(!plusMenuOpen)}
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-slate-600 hover:text-[#001299] hover:bg-blue-50 border border-slate-200 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
              title="Aksi Komputasi Formula: Simulasi 40°C, Pareto NSGA-II, BPOM Sentinel"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Menu Popover */}
            <ActionPlusMenu
              isOpen={plusMenuOpen && !!activeDraft}
              hasIngredients={activeDraft ? activeDraft.ingredients.length > 0 : false}
              onClose={() => setPlusMenuOpen(false)}
              onSelectAction={(type) => {
                setActiveInlineAction(type);
                setPlusMenuOpen(false);
                setTimeout(scrollToInlineAction, 50);
                setTimeout(scrollToInlineAction, 200);
              }}
            />
          </div>

          {/* Text Input Area */}
          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              disabled={!activeDraft || isGenerating}
              placeholder={
                !activeDraft
                  ? "Buat formula terlebih dahulu untuk memulai obrolan..."
                  : isGenerating
                    ? (generatingStatus || "AI Co-Pilot sedang memproses respons...")
                    : "Tanyakan rekomendasi formula, atau minta AI modifikasi bahan..."
              }
              className="w-full h-11 pl-4 pr-12 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#001299]/20 focus:border-[#001299] focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed leading-normal"
            />

            <button
              type="submit"
              disabled={!inputPrompt.trim() || !activeDraft || isGenerating}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-[#001299] text-white hover:bg-[#000e7a] disabled:opacity-40 disabled:hover:bg-[#001299] transition-all cursor-pointer flex items-center justify-center shrink-0"
              aria-label="Kirim Pesan"
              title={isGenerating ? "Sedang memproses respons..." : "Kirim Pesan"}
            >
              {isGenerating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};