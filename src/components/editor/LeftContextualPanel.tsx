"use client";

import React, { useState } from "react";
import { useEditor } from "@/contexts/EditorContext";
import { MOLECULAR_CATALOG } from "@/data/mock/molecularData";
import { COSMETIC_INGREDIENTS_CATALOG } from "@/data/mock/ingredientsCatalog";
import { Molecule3DViewer } from "@/components/molecular/Molecule3DViewer";
import { DelayedInfoTooltip } from "@/components/DelayedInfoTooltip";
import { Atom, BookOpen, Plus, Search, Check, Sparkles } from "lucide-react";

export const LeftContextualPanel: React.FC = () => {
  const {
    leftPanelMode,
    setLeftPanelMode,
    selectedMoleculeIngredient,
    addIngredient,
    ingredients,
  } = useEditor();

  const [searchQuery, setSearchQuery] = useState("");
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  // Find 3D conformer for selected ingredient
  const targetMolecule = React.useMemo(() => {
    if (!selectedMoleculeIngredient) return MOLECULAR_CATALOG[0];
    const nameLower = selectedMoleculeIngredient.name.toLowerCase();
    const inciLower = selectedMoleculeIngredient.inci.toLowerCase();
    
    const matched = MOLECULAR_CATALOG.find((m) =>
      nameLower.includes(m.name.toLowerCase().split(" ")[0]) ||
      inciLower.includes(m.inci.toLowerCase()) ||
      m.id.toLowerCase().includes(selectedMoleculeIngredient.id.toLowerCase())
    );
    return matched || MOLECULAR_CATALOG[0];
  }, [selectedMoleculeIngredient]);

  // Filter library ingredients
  const filteredCatalog = React.useMemo(() => {
    if (!searchQuery.trim()) return COSMETIC_INGREDIENTS_CATALOG;
    const q = searchQuery.toLowerCase();
    return COSMETIC_INGREDIENTS_CATALOG.filter(
      (it) => it.name.toLowerCase().includes(q) || it.inci.toLowerCase().includes(q) || it.role.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleAddFromLibrary = (item: typeof COSMETIC_INGREDIENTS_CATALOG[0]) => {
    addIngredient({
      id: `ing-${item.id}-${Date.now().toString().slice(-4)}`,
      name: item.name,
      inci: item.inci,
      phase: item.defaultPhase,
      weightPct: item.defaultWeightPct,
      role: item.role,
    });
    setAddedNotice(item.name);
    setTimeout(() => setAddedNotice(null), 1800);
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden font-sans">
      {/* Header Mode Switcher */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl">
          <button
            type="button"
            onClick={() => setLeftPanelMode("molecule-3d")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              leftPanelMode === "molecule-3d"
                ? "bg-white text-[#001299] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Atom className="w-3.5 h-3.5 text-[#001299]" />
            <span>3D Molekul</span>
          </button>

          <button
            type="button"
            onClick={() => setLeftPanelMode("library")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              leftPanelMode === "library"
                ? "bg-white text-[#001299] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#001299]" />
            <span>Library Bahan</span>
          </button>
        </div>

        <DelayedInfoTooltip
          content={
            leftPanelMode === "molecule-3d"
              ? "Menampilkan struktur 3D molekul bahan yang sedang dipilih di Composition panel."
              : "Cari bahan baku kosmetik dan tambahkan ke komposisi formula di panel kanan."
          }
          delayMs={300}
        />
      </div>

      {/* Mode 1: Contextual 3D Molecule Inspector */}
      {leftPanelMode === "molecule-3d" && (
        <div className="flex-1 flex flex-col overflow-hidden p-3 space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="truncate">
              <span className="text-[11px] font-bold text-slate-800 font-heading block truncate">
                {selectedMoleculeIngredient ? selectedMoleculeIngredient.name : targetMolecule.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono block">
                {targetMolecule.properties.formula} • MW: {targetMolecule.properties.molecularWeight}
              </span>
            </div>
            <span className="text-[10px] font-semibold text-[#001299] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60 shrink-0">
              LogP {targetMolecule.properties.logP}
            </span>
          </div>

          <div className="flex-1 min-h-[220px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner flex flex-col">
            <Molecule3DViewer
              molecule={targetMolecule}
              className="h-full flex-1"
              canvasHeight="h-full min-h-[220px]"
            />
          </div>
        </div>
      )}

      {/* Mode 2: Ingredient Library Picker */}
      {leftPanelMode === "library" && (
        <div className="flex-1 flex flex-col overflow-hidden p-3 space-y-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama bahan atau INCI..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#001299]"
            />
          </div>

          {addedNotice && (
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="truncate"><strong>{addedNotice}</strong> ditambahkan ke Composition Panel!</span>
            </div>
          )}

          {/* Ingredient List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {filteredCatalog.map((item) => {
              const alreadyInFormula = ingredients.some(
                (it) => it.name.toLowerCase() === item.name.toLowerCase()
              );

              return (
                <div
                  key={item.id}
                  className="p-2 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between gap-2 text-xs"
                >
                  <div className="truncate flex-1">
                    <span className="font-bold text-slate-800 block truncate">{item.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono block truncate">
                      Fase {item.defaultPhase} • {item.inci}
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={alreadyInFormula}
                    onClick={() => handleAddFromLibrary(item)}
                    className={`p-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                      alreadyInFormula
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-[#001299] hover:bg-[#000e7a] text-white shadow-xs"
                    }`}
                    title={alreadyInFormula ? "Bahan sudah ada di Composition Panel" : "Tambah ke Composition Panel"}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
