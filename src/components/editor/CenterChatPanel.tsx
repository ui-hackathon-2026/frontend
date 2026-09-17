"use client";

import React, { useState, useRef, useEffect } from "react";
import { useEditor } from "@/contexts/EditorContext";
import { ActionPlusMenu } from "./ActionPlusMenu";
import { InlineActionConfigCard } from "./InlineActionConfigCard";
import { ArtifactType } from "@/domain/models/editor";
import { DelayedInfoTooltip } from "@/components/DelayedInfoTooltip";
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
} from "lucide-react";

export const CenterChatPanel: React.FC = () => {
  const {
    activeDraft,
    sendMessage,
    executeAction,
    applyProposal,
    viewArtifact,
    setArtifactsListModalOpen,
  } = useEditor();

  const [inputPrompt, setInputPrompt] = useState("");
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const [activeInlineAction, setActiveInlineAction] = useState<ArtifactType | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const messages = activeDraft.messages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim()) return;
    sendMessage(inputPrompt);
    setInputPrompt("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
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
            <span className="text-[10px] text-slate-400 font-mono block">
              Draft Aktif: {activeDraft.name}
            </span>
          </div>
        </div>

        {/* Right: List of Artifacts Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setArtifactsListModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-[#001299] bg-slate-50 hover:bg-blue-50/50 text-xs font-semibold text-slate-700 hover:text-[#001299] transition-all cursor-pointer shadow-2xs"
            title="Buka daftar report artifact tersimpan"
          >
            <FileText className="w-3.5 h-3.5 text-[#001299]" />
            <span>Artifacts ({activeDraft.artifacts.length})</span>
          </button>

          <DelayedInfoTooltip
            content="Klik untuk melihat dokumen dan hasil analitik yang telah dibuat pada draft ini."
            delayMs={300}
          />
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => {
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
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                {/* Linked Artifact Button */}
                {msg.linkedArtifactId && (
                  <div className="pt-1">
                    {(() => {
                      const linked = activeDraft.artifacts.find((a) => a.id === msg.linkedArtifactId);
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

                    <p className="text-[11px] text-slate-600">{msg.proposal.explanation}</p>

                    {/* Diff Table */}
                    <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 text-xs font-mono">
                      {msg.proposal.changes.map((chg) => (
                        <div key={chg.ingredientId} className="flex justify-between items-center text-[11px]">
                          <span className="font-medium text-slate-700 truncate mr-2">
                            {chg.name}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-slate-400 line-through">{chg.oldPct}%</span>
                            <ArrowRight className="w-3 h-3 text-slate-400" />
                            <span className="text-[#001299] font-bold">{chg.newPct}%</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => applyProposal(msg.proposal!)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#001299] hover:bg-[#000e7a] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Terapkan ke Composition Panel</span>
                    </button>
                  </div>
                )}

                <span className="text-[10px] text-slate-400 block px-1 font-mono">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Area or Inline Action Config Card */}
      <div className="p-4 bg-white border-t border-slate-200/80 shrink-0">
        {activeInlineAction ? (
          <InlineActionConfigCard
            actionType={activeInlineAction}
            onClose={() => setActiveInlineAction(null)}
            onExecute={(type, params) => {
              setActiveInlineAction(null);
              executeAction(type, params);
            }}
          />
        ) : (
          <form onSubmit={handleSend} className="relative flex items-center gap-2">
            {/* Action (+) Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setPlusMenuOpen((v) => !v)}
                className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer shrink-0"
                title="Aksi Komputasi (Pareto, Sentinel, Simulasi 40°C, Similarity)"
              >
                <Plus className={`w-4 h-4 transition-transform ${plusMenuOpen ? "rotate-45" : ""}`} />
              </button>

              <ActionPlusMenu
                isOpen={plusMenuOpen}
                onClose={() => setPlusMenuOpen(false)}
                onSelectAction={(actType) => setActiveInlineAction(actType)}
              />
            </div>

            {/* Text input */}
            <div className="flex-1 relative">
              <textarea
                rows={1}
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tanyakan rekomendasi formula, atau minta AI modifikasi bahan..."
                className="w-full text-xs px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#001299]/20 focus:border-[#001299] resize-none pr-10"
              />
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputPrompt.trim()}
              className="p-2.5 rounded-2xl bg-[#001299] hover:bg-[#000e7a] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0 shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
