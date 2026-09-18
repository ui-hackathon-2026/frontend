"use client";

import React, { useState } from "react";
import { RagChatMessage } from "@/domain/models/compliance";
import { Send, Bot, User, Bookmark, Sparkles } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

interface RagKnowledgeChatProps {
  messages: RagChatMessage[];
  isLoading: boolean;
  onSendMessage: (query: string) => void;
}

export const RagKnowledgeChat: React.FC<RagKnowledgeChatProps> = ({
  messages,
  isLoading,
  onSendMessage,
}) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput("");
  };

  const quickPrompts = [
    "Batas aman Phenoxyethanol menurut BPOM?",
    "Apakah Alpha-Arbutin 2% boleh untuk serum wajah?",
    "Titik kritis kehalalan gliserin pada sediaan kosmetik?",
  ];

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4 flex flex-col h-[620px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#001299] flex items-center justify-center border border-blue-100">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#0a192f] uppercase tracking-wider">
              Tanya Regulasi (Semantic Vector RAG)
            </h3>
            <p className="text-[10px] text-slate-400">
              Basis data: Perka BPOM 17/2022, HAS 23000 &amp; Farmakope Kosmetik
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
        {messages.length === 0 && !isLoading ? (
          <EmptyState
            compact
            title="Belum Ada Riwayat Konsultasi"
            description="Ajukan pertanyaan regulasi BPOM, Halal, atau TKDN untuk memulai."
            className="border-dashed"
          />
        ) : (
          messages.map((msg) => {
          const isBot = msg.sender === "assistant";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isBot ? "justify-start" : "justify-end"}`}
            >
              {isBot && (
                <div className="w-6 h-6 rounded-full bg-blue-100 text-[#001299] flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-3 rounded-2xl space-y-2 leading-relaxed ${
                  isBot
                    ? "bg-slate-50 border border-slate-200/80 text-slate-800"
                    : "bg-[#001299] text-white font-medium"
                }`}
              >
                <MarkdownRenderer content={msg.text} isUser={!isBot} />

                {/* Citations Box */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/70 space-y-1 text-[11px] text-slate-600">
                    <span className="font-bold text-[#001299] block flex items-center gap-1">
                      <Bookmark className="w-3 h-3" /> Sitasi Pasal:
                    </span>
                    {msg.citations.map((c, i) => (
                      <div key={i} className="pl-2 border-l-2 border-blue-400 bg-white/70 p-1.5 rounded-r-lg">
                        <span className="font-semibold text-slate-800 block">
                          {c.document} — {c.clause}
                        </span>
                        <span className="italic text-slate-500">{c.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                <span
                  className={`text-[9px] block text-right ${
                    isBot ? "text-slate-400" : "text-blue-200"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {!isBot && (
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })
        )}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-[#001299]" />
            <span>Mencari rujukan pasal di Vector Database &amp; menyusun penalaran...</span>
          </div>
        )}
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 shrink-0">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSendMessage(prompt)}
            className="text-[10px] text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1 border-t border-slate-100 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanyakan regulasi atau batas kadar bahan kosmetik..."
          disabled={isLoading}
          className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#001299] text-slate-900 placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="p-2.5 rounded-xl bg-[#001299] hover:bg-[#000e7a] text-white disabled:opacity-40 transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
