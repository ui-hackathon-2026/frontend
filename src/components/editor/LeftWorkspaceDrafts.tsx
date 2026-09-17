"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useEditor } from "@/contexts/EditorContext";
import { DelayedInfoTooltip } from "@/components/DelayedInfoTooltip";
import {
  Folder,
  GitFork,
  Trash2,
  Edit2,
  Check,
  X,
  Layers,
  FlaskConical,
  ArrowLeft,
  History,
  RotateCcw,
  Clock,
  Cloud,
  Loader2,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { FormulaVersionItem } from "@/domain/models/formula";

export const LeftWorkspaceDrafts: React.FC = () => {
  const {
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
    restoreVersion,
  } = useEditor();

  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const [restoringVersion, setRestoringVersion] = useState<number | null>(null);
  const [deleteConfirmDraftId, setDeleteConfirmDraftId] = useState<string | null>(null);
  const [isDeletingDraftId, setIsDeletingDraftId] = useState<string | null>(null);

  const handleStartRename = (id: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingDraftId(id);
    setEditName(currentName);
  };

  const handleSaveRename = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editName.trim()) {
      await renameDraft(id, editName.trim());
    }
    setEditingDraftId(null);
  };

  const handleRestore = async (v: FormulaVersionItem) => {
    setRestoringVersion(v.version);
    await restoreVersion(v);
    setRestoringVersion(null);
    setVersionModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-white border-b border-slate-200/80 p-3.5 space-y-3 font-sans">
      {/* Top Brand Navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded-lg bg-[#0a192f] text-white flex items-center justify-center group-hover:bg-[#0018a8] transition-colors">
            <FlaskConical className="w-3.5 h-3.5 text-blue-200" />
          </div>
          <span className="text-xs font-extrabold text-[#0a192f] font-heading tracking-tight group-hover:text-[#0018a8] transition-colors">
            Paragon Studio
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Cloud Sync Indicator */}
          <div
            className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-500"
            title="Sinkronisasi Cloud Neon Postgres Aktif"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-[#001299]" />
                <span className="text-[#001299]">Saving...</span>
              </>
            ) : (
              <>
                <Cloud className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Synced</span>
              </>
            )}
          </div>

          <Link
            href="/"
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-slate-700 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
            title="Kembali ke Beranda Portal"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Keluar</span>
          </Link>
        </div>
      </div>

      {/* Workspace Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-6 h-6 rounded-lg bg-blue-50 text-[#001299] flex items-center justify-center shrink-0">
            <Folder className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <h2 className="text-xs font-extrabold text-[#0a192f] tracking-tight font-heading truncate">
              {workspace.name}
            </h2>
            <span className="text-[10px] text-slate-400 font-mono block">
              {isLoading ? "Memuat..." : `${workspace.drafts.length} Formula Cloud`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Version History Button */}
          {activeDraft && (
            <button
              type="button"
              onClick={() => setVersionModalOpen(true)}
              className="p-1 rounded-lg text-slate-500 hover:text-[#001299] hover:bg-blue-50 transition-colors cursor-pointer"
              title="Lihat Riwayat Versi (Snapshot Log)"
            >
              <History className="w-3.5 h-3.5" />
            </button>
          )}
          <DelayedInfoTooltip
            content="Seluruh draft tersimpan langsung di Neon Postgres Cloud. Setiap perubahan otomatis meng-create version snapshot append-only."
            position="bottom"
            delayMs={300}
          />
        </div>
      </div>

      {/* Draft List */}
      <div className="flex-1 overflow-y-auto py-2.5 space-y-2 min-h-[110px] max-h-[260px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-6 text-xs text-slate-400 gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#001299]" />
            <span>Memuat draft cloud...</span>
          </div>
        ) : workspace.drafts.length === 0 ? (
          <div className="text-center py-5 px-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
            <p className="text-xs font-semibold text-slate-700">Belum Ada Formula</p>
            <p className="text-[11px] text-slate-400">
              Buat formula baru untuk mulai eksplorasi bahan di studio.
            </p>
            <button
              type="button"
              onClick={() => createNewDraft()}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#001299] hover:bg-[#000e7a] text-white transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Formula Baru</span>
            </button>
          </div>
        ) : (
          workspace.drafts.map((draft) => {
            const isActive = activeDraft && draft.id === activeDraft.id;
            const isEditing = editingDraftId === draft.id;
            const isConfirmingDelete = deleteConfirmDraftId === draft.id;

            return (
              <div key={draft.id} className="space-y-1">
                <div
                  onClick={() => !isEditing && switchDraft(draft.id)}
                  className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#001299] text-white shadow-xs font-semibold"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate flex-1 mr-1">
                    <Layers
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive ? "text-blue-200" : "text-slate-400"
                      }`}
                    />
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
                      <div className="truncate flex flex-col">
                        <span className="truncate">{draft.name}</span>
                        <span
                          className={`text-[9px] font-mono leading-none ${
                            isActive ? "text-blue-200" : "text-slate-400"
                          }`}
                        >
                          {draft.id}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className={`flex items-center gap-1 shrink-0 ${isConfirmingDelete ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`}>
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={(e) => handleSaveRename(draft.id, e)}
                          className="p-1 hover:bg-white/20 rounded cursor-pointer"
                        >
                          <Check className="w-3 h-3 text-emerald-400" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingDraftId(null);
                          }}
                          className="p-1 hover:bg-white/20 rounded cursor-pointer"
                        >
                          <X className="w-3 h-3 text-rose-300" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={(e) => handleStartRename(draft.id, draft.name, e)}
                          className={`p-1 rounded cursor-pointer ${
                            isActive ? "hover:bg-white/20 text-white" : "hover:bg-slate-200 text-slate-500"
                          }`}
                          title="Ganti nama draft"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmDraftId(isConfirmingDelete ? null : draft.id);
                          }}
                          className={`p-1 rounded cursor-pointer transition-colors ${
                            isConfirmingDelete
                              ? "bg-rose-500 text-white shadow-xs"
                              : isActive
                              ? "hover:bg-white/20 text-rose-200"
                              : "hover:bg-rose-100 text-rose-500"
                          }`}
                          title="Hapus draft dari cloud"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Expand Downward Delete Confirmation Modal/Card */}
                {isConfirmingDelete && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="p-3 rounded-xl bg-rose-50/95 border border-rose-200 text-slate-800 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200 space-y-2"
                  >
                    <div className="flex items-start gap-2">
                      <div className="p-1 rounded-lg bg-rose-100 text-rose-600 shrink-0 mt-0.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-rose-900 leading-tight">
                          Hapus Formula Ini?
                        </p>
                        <p className="text-[11px] text-rose-700/90 leading-tight mt-0.5 break-words">
                          Formula <span className="font-semibold text-rose-950">&ldquo;{draft.name}&rdquo;</span> beserta audit trail snapshot-nya akan dihapus permanen dari cloud.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-1.5 pt-1.5 border-t border-rose-200/60">
                      <button
                        type="button"
                        disabled={isDeletingDraftId === draft.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmDraftId(null);
                        }}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-slate-800 hover:bg-rose-100/70 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        disabled={isDeletingDraftId === draft.id}
                        onClick={async (e) => {
                          e.stopPropagation();
                          setIsDeletingDraftId(draft.id);
                          try {
                            await deleteDraft(draft.id);
                          } finally {
                            setIsDeletingDraftId(null);
                            setDeleteConfirmDraftId(null);
                          }
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer shadow-xs disabled:opacity-60"
                      >
                        {isDeletingDraftId === draft.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                        <span>{isDeletingDraftId === draft.id ? "Menghapus..." : "Ya, Hapus"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Button Actions */}
      {workspace.drafts.length > 0 && (
        <button
          type="button"
          disabled={isSaving || isLoading}
          onClick={() => createDraftFork()}
          className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border border-dashed border-slate-300 hover:border-[#001299] hover:bg-blue-50/60 text-slate-700 hover:text-[#001299] transition-all cursor-pointer disabled:opacity-50"
        >
          <GitFork className="w-3.5 h-3.5 text-[#001299]" />
          <span>+ Fork Draft Baru ke Cloud</span>
        </button>
      )}

      {/* Version History Modal */}
      {versionModalOpen && activeDraft && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setVersionModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-100 text-[#001299]">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Audit Trail &amp; Riwayat Versi
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Formula: <span className="font-semibold text-slate-700">{activeDraft.name}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setVersionModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 max-h-80 overflow-y-auto space-y-2.5">
              {activeVersions.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 space-y-1">
                  <Clock className="w-6 h-6 mx-auto text-slate-300 mb-2" />
                  <p className="font-medium text-slate-600">Belum Ada Snapshot Versi</p>
                  <p className="text-[11px]">
                    Setiap kali Anda mengubah komposisi bahan di Kitchen panel, backend akan otomatis
                    membuat snapshot versi di sini.
                  </p>
                </div>
              ) : (
                activeVersions.map((v) => (
                  <div
                    key={v.version}
                    className="p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/20 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-100 text-[#001299]">
                          v{v.version}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {v.snapshot.name}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {new Date(v.created_at).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                        {" • "}
                        {v.snapshot.ingredients?.length ?? 0} Bahan Baku
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={restoringVersion === v.version}
                      onClick={() => handleRestore(v)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-[#001299] transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {restoringVersion === v.version ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <RotateCcw className="w-3 h-3" />
                      )}
                      <span>Rollback</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>Append-only snapshot di Neon Postgres</span>
              <button
                type="button"
                onClick={() => setVersionModalOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};