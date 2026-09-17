"use client";

import React, { useState } from "react";
import { useEditor } from "@/contexts/EditorContext";
import { DelayedInfoTooltip } from "@/components/DelayedInfoTooltip";
import { Folder, GitFork, Plus, Trash2, Edit2, Check, X, Layers } from "lucide-react";

export const LeftWorkspaceDrafts: React.FC = () => {
  const { workspace, activeDraft, switchDraft, createDraftFork, renameDraft, deleteDraft } = useEditor();

  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleStartRename = (id: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingDraftId(id);
    setEditName(currentName);
  };

  const handleSaveRename = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editName.trim()) {
      renameDraft(id, editName.trim());
    }
    setEditingDraftId(null);
  };

  return (
    <div className="flex flex-col h-full bg-white border-b border-slate-200/80 p-4 font-sans">
      {/* Workspace Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-6 h-6 rounded-lg bg-blue-50 text-[#001299] flex items-center justify-center shrink-0">
            <Folder className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <h2 className="text-xs font-extrabold text-[#0a192f] tracking-tight font-heading truncate">
              {workspace.name}
            </h2>
            <span className="text-[10px] text-slate-400 font-mono block">
              {workspace.drafts.length} Versi Formula
            </span>
          </div>
        </div>

        <DelayedInfoTooltip
          content="Sesi formulasi mandiri. Setiap draft memiliki komposisi, riwayat percakapan AI, dan report artifact yang terisolasi."
          delayMs={300}
        />
      </div>

      {/* Draft List */}
      <div className="flex-1 overflow-y-auto py-2.5 space-y-1.5 min-h-[110px] max-h-[170px]">
        {workspace.drafts.map((draft) => {
          const isActive = draft.id === activeDraft.id;
          const isEditing = editingDraftId === draft.id;

          return (
            <div
              key={draft.id}
              onClick={() => !isEditing && switchDraft(draft.id)}
              className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                isActive
                  ? "bg-[#001299] text-white shadow-xs font-semibold"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium"
              }`}
            >
              <div className="flex items-center gap-2 truncate flex-1 mr-1">
                <Layers className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-blue-200" : "text-slate-400"}`} />
                {isEditing ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full text-xs px-1.5 py-0.5 rounded bg-white text-slate-900 border border-slate-300 focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <span className="truncate">{draft.name}</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={(e) => handleSaveRename(draft.id, e)}
                      className="p-1 hover:bg-white/20 rounded"
                    >
                      <Check className="w-3 h-3 text-emerald-400" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingDraftId(null);
                      }}
                      className="p-1 hover:bg-white/20 rounded"
                    >
                      <X className="w-3 h-3 text-rose-300" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={(e) => handleStartRename(draft.id, draft.name, e)}
                      className={`p-1 rounded ${isActive ? "hover:bg-white/20 text-white" : "hover:bg-slate-200 text-slate-500"}`}
                      title="Ganti nama draft"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    {workspace.drafts.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDraft(draft.id);
                        }}
                        className={`p-1 rounded ${isActive ? "hover:bg-white/20 text-rose-200" : "hover:bg-slate-200 text-rose-500"}`}
                        title="Hapus draft"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Button Fork New Draft */}
      <button
        type="button"
        onClick={createDraftFork}
        className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border border-dashed border-slate-300 hover:border-[#001299] hover:bg-blue-50/60 text-slate-700 hover:text-[#001299] transition-all cursor-pointer"
      >
        <GitFork className="w-3.5 h-3.5 text-[#001299]" />
        <span>+ Fork Draft Baru</span>
      </button>
    </div>
  );
};
