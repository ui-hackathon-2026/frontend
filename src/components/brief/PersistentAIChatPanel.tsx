"use client";

import React, { useState } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  MessageSquare,
} from "lucide-react";
import { ChatMessage, ProjectBriefInput, FormulationBlueprint } from "@/domain/models/brief";

interface PersistentAIChatPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  messages: ChatMessage[];
  isSending: boolean;
  onSendMessage: (msg: string) => void;
  activeBrief: ProjectBriefInput;
  blueprint?: FormulationBlueprint | null;
}

export const PersistentAIChatPanel: React.FC<PersistentAIChatPanelProps> = ({
  isOpen,
  onToggle,
  messages,
  isSending,
  onSendMessage,
  activeBrief,
  blueprint,
}) => {
  const [inputText, setInputText] = useState("");

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSending) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const quickPrompts = [
    "Rekomendasi bahan aktif lokal pencerah",
    "Hitung rasio emulgator untuk viskositas 5.000",
    "Audit kepatuhan batas pengawet BPOM",
  ];

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-30 flex items-center space-x-2 px-4 py-3 rounded-full bg-[#001299] text-white shadow-lg hover:bg-[#000e7a] transition-all cursor-pointer font-sans"
        aria-label="Buka Asisten AI Project Brief"
      >
        <Bot className="w-4 h-4 text-blue-200" />
        <span className="text-xs font-semibold">AI Assistant</span>
      </button>
    );
  }

  return (
    <aside className="w-full lg:w-80 xl:w-96 bg-white border-l border-slate-200/80 flex flex-col h-full shrink-0 shadow-xs">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#001299] text-white flex items-center justify-center shadow-xs">
            <Bot className="w-4 h-4 text-blue-200" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#0a192f] font-heading">AI Studio Assistant</h3>
            <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Siaga Kontekstual ({activeBrief.brand})
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          title="Tutup Panel Asisten"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Context Summary */}
      <div className="px-4 py-2 bg-blue-50/40 border-b border-blue-100/60 text-[11px] text-slate-600 flex items-center justify-between">
        <span className="truncate max-w-[200px] font-medium">
          {activeBrief.projectName || "Brief Belum Dinamai"}
        </span>
        <span className="font-bold text-[#001299] shrink-0">{activeBrief.category}</span>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
        {messages.map((m) => {
          const isAssistant = m.sender === "assistant";
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isAssistant ? "items-start" : "items-end"} space-y-1`}
            >
              <div
                className={`p-3 rounded-2xl max-w-[88%] leading-relaxed ${
                  isAssistant
                    ? "bg-slate-100 text-slate-800 rounded-tl-sm border border-slate-200/60"
                    : "bg-[#001299] text-white rounded-tr-sm"
                }`}
              >
                {m.content}
              </div>
              <span className="text-[9px] text-slate-400 px-1">{m.timestamp}</span>

              {m.suggestedAction && (
                <button
                  type="button"
                  onClick={() => onSendMessage(m.suggestedAction!.label)}
                  className="mt-1 text-[10px] font-semibold text-[#001299] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg hover:bg-blue-100/70 transition-colors cursor-pointer text-left"
                >
                  ⚡ {m.suggestedAction.label}
                </button>
              )}
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs p-2">
            <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-[#001299] rounded-full animate-spin" />
            <span>Menganalisis parameter formulasi...</span>
          </div>
        )}
      </div>

      {/* Quick Action Prompt Chips */}
      <div className="p-2 border-t border-slate-100 bg-slate-50/50 flex flex-wrap gap-1.5">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSendMessage(qp)}
            className="text-[10px] bg-white border border-slate-200 text-slate-600 hover:text-[#001299] hover:border-blue-300 px-2 py-1 rounded-md transition-colors cursor-pointer truncate max-w-full"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-200/80 bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tanyakan optimasi formula..."
            className="flex-1 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#001299]/20 focus:border-[#001299]"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="p-2.5 rounded-xl bg-[#001299] text-white hover:bg-[#000e7a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            aria-label="Kirim Pesan"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </aside>
  );
};
