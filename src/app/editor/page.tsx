"use client";

import React from "react";
import { EditorProvider, useEditor } from "@/contexts/EditorContext";
import { LeftWorkspaceDrafts } from "@/components/editor/LeftWorkspaceDrafts";
import { LeftContextualPanel } from "@/components/editor/LeftContextualPanel";
import { CenterChatPanel } from "@/components/editor/CenterChatPanel";
import { ArtifactViewerPanel } from "@/components/editor/ArtifactViewerPanel";
import { KitchenCompositionPanel } from "@/components/editor/KitchenCompositionPanel";
import { ArtifactsListModal } from "@/components/editor/ArtifactsListModal";
import { ActionConfigModal } from "@/components/editor/ActionConfigModal";

function EditorStudioInner() {
  const {
    centerViewMode,
    actionConfigModal,
    closeActionConfig,
    executeAction,
  } = useEditor();

  return (
    <div className="flex-1 flex overflow-hidden w-full h-full bg-white font-sans">
      {/* 1. LEFT PANEL (Workspace Drafts & Contextual 3D/Library) */}
      <aside className="w-72 sm:w-80 flex flex-col border-r border-slate-200/80 bg-white shrink-0 overflow-hidden">
        {/* Top: Workspace & Draft Formulations (Fork) */}
        <div className="shrink-0">
          <LeftWorkspaceDrafts />
        </div>

        {/* Bottom: Contextual 3D Molecule / Library Bahan */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <LeftContextualPanel />
        </div>
      </aside>

      {/* 2. CENTER PANEL (AI Chat OR Artifact View) */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#fafbfc] overflow-hidden">
        {centerViewMode === "chat" ? (
          <CenterChatPanel />
        ) : (
          <ArtifactViewerPanel />
        )}
      </main>

      {/* 3. RIGHT PANEL (Kitchen Panel / 4-Phase Composition) */}
      <aside className="w-80 sm:w-96 flex flex-col border-l border-slate-200/80 bg-white shrink-0 overflow-hidden">
        <KitchenCompositionPanel />
      </aside>

      {/* Global Modals */}
      <ArtifactsListModal />
      <ActionConfigModal
        isOpen={actionConfigModal.isOpen}
        actionType={actionConfigModal.actionType}
        onClose={closeActionConfig}
        onExecute={executeAction}
      />
    </div>
  );
}

export default function EditorPage() {
  return (
    <EditorProvider>
      <div className="h-screen w-screen flex flex-col bg-white overflow-hidden font-sans">
        <EditorStudioInner />
      </div>
    </EditorProvider>
  );
}
