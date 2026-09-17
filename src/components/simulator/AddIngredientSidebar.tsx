"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  X,
  Search,
  Plus,
  Check,
  Filter,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";
import {
  COSMETIC_INGREDIENTS_CATALOG,
  CatalogIngredientItem,
} from "@/data/mock/ingredientsCatalog";
import { IngredientInput } from "@/domain/models/simulation";

interface AddIngredientSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentIngredients: IngredientInput[];
  onAddIngredient: (ingredient: IngredientInput) => void;
}

export const AddIngredientSidebar: React.FC<AddIngredientSidebarProps> = ({
  isOpen,
  onClose,
  currentIngredients,
  onAddIngredient,
}) => {
  const [targetPhase, setTargetPhase] = useState<"A" | "B" | "C" | "D">("B");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Phase metadata
  const phaseMetadata = {
    A: {
      label: "Fase A",
      name: "Fase Minyak / Lipofilik",
      border: "border-amber-400",
      activeBg: "bg-amber-500 text-white",
      badge: "bg-amber-50 text-amber-900 border-amber-200",
    },
    B: {
      label: "Fase B",
      name: "Fase Air / Hidrofilik",
      border: "border-blue-400",
      activeBg: "bg-blue-600 text-white",
      badge: "bg-blue-50 text-blue-900 border-blue-200",
    },
    C: {
      label: "Fase C",
      name: "Emulgator & Surfaktan",
      border: "border-purple-400",
      activeBg: "bg-purple-600 text-white",
      badge: "bg-purple-50 text-purple-900 border-purple-200",
    },
    D: {
      label: "Fase D",
      name: "Aktif Peka Panas & Aditif",
      border: "border-emerald-400",
      activeBg: "bg-emerald-600 text-white",
      badge: "bg-emerald-50 text-emerald-900 border-emerald-200",
    },
  };

  // Filter catalog items
  const filteredCatalog = useMemo(() => {
    return COSMETIC_INGREDIENTS_CATALOG.filter((item) => {
      // 1. RULE: Hide ingredients that are ALREADY in the current formula on the selected target phase
      const alreadyInSelectedPhase = currentIngredients.some(
        (ci) =>
          ci.inci.toLowerCase() === item.inci.toLowerCase() &&
          ci.phase === targetPhase
      );
      if (alreadyInSelectedPhase) return false;

      // 2. Search query filter (matches name, inci, or role)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesInci = item.inci.toLowerCase().includes(query);
        const matchesRole = item.role.toLowerCase().includes(query);
        if (!matchesName && !matchesInci && !matchesRole) return false;
      }

      // 3. Role filter
      if (selectedRole !== "all") {
        if (item.role !== selectedRole) return false;
      }

      return true;
    });
  }, [currentIngredients, targetPhase, searchQuery, selectedRole]);

  const handleAdd = (item: CatalogIngredientItem) => {
    // Normalize role to IngredientInput valid roles
    let mappedRole: "active" | "emollient" | "thickener" | "emulsifier" | "solvent" | "preservative" = "active";
    if (
      item.role === "active" ||
      item.role === "emollient" ||
      item.role === "thickener" ||
      item.role === "emulsifier" ||
      item.role === "solvent" ||
      item.role === "preservative"
    ) {
      mappedRole = item.role;
    } else {
      mappedRole = "active";
    }

    const newIngredient: IngredientInput = {
      id: `ing-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: item.name,
      inci: item.inci,
      smiles: item.smiles,
      weightPct: item.defaultWeightPct,
      phase: targetPhase,
      role: mappedRole,
    };

    onAddIngredient(newIngredient);

    // Briefly record added state for feedback
    setAddedIds((prev) => new Set(prev).add(item.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop with subtle blur */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Panel from Right */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl border-l border-slate-200 flex flex-col transform transition-transform ease-out duration-300">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-[#0018a8] uppercase tracking-wider">
                  Katalog Bahan Baku Formulasi
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#0a192f] font-heading mt-0.5">
                Tambah Bahan ke Formula
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Phase Target Selector */}
          <div className="p-5 border-b border-slate-100 space-y-2 bg-white">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
              Pilih Fase Tujuan:
            </label>

            <div className="grid grid-cols-4 gap-2">
              {(["A", "B", "C", "D"] as const).map((phase) => {
                const meta = phaseMetadata[phase];
                const isActive = targetPhase === phase;
                return (
                  <button
                    key={phase}
                    type="button"
                    onClick={() => setTargetPhase(phase)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer text-center ${
                      isActive
                        ? `${meta.activeBg} border-transparent shadow-xs`
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div>{meta.label}</div>
                    <div className="text-[9px] font-normal truncate opacity-80">
                      {phase === "A" && "Minyak"}
                      {phase === "B" && "Air"}
                      {phase === "C" && "Emulgator"}
                      {phase === "D" && "Aktif/Dingin"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search & Role Filters */}
          <div className="p-5 border-b border-slate-100 space-y-3 bg-white">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama bahan, INCI (cth: EDTA, Carbomer, Vitamin E)..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0018a8]/20 focus:border-[#0018a8] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Role Filter Buttons */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
              {[
                { id: "all", label: "Semua Peran" },
                { id: "active", label: "Aktif" },
                { id: "thickener", label: "Thickener" },
                { id: "emulsifier", label: "Emulsifier" },
                { id: "emollient", label: "Emollient" },
                { id: "chelating", label: "Chelating" },
                { id: "humectant", label: "Humektan" },
                { id: "preservative", label: "Pengawet" },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRole(r.id)}
                  className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    selectedRole === r.id
                      ? "bg-slate-900 text-white font-semibold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#fafbfc]">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
              <span>{filteredCatalog.length} Bahan Tersedia untuk Fase {targetPhase}</span>
              <span className="text-[11px] text-slate-400">
                Target: {phaseMetadata[targetPhase].name}
              </span>
            </div>

            {filteredCatalog.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
                <Info className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-600 font-medium">
                  Tidak ada bahan yang cocok atau semua bahan yang dicari sudah terdaftar di Fase {targetPhase}.
                </p>
                <p className="text-[11px] text-slate-400">
                  Coba ganti kata kunci pencarian atau pilih fase tujuan lain.
                </p>
              </div>
            ) : (
              filteredCatalog.map((item) => {
                const isJustAdded = addedIds.has(item.id);

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-xs transition-all space-y-2.5"
                  >
                    {/* Header Row: Info on left, CTA on top right */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wide">
                            {item.role}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Rekomendasi: Fase {item.defaultPhase}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {item.name}
                        </h4>
                        <p className="text-xs font-mono text-slate-500 truncate">
                          {item.inci}
                        </p>
                      </div>

                      {/* CTA Button moved to Top Right */}
                      <button
                        type="button"
                        onClick={() => handleAdd(item)}
                        disabled={isJustAdded}
                        className={`shrink-0 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isJustAdded
                            ? "bg-emerald-600 text-white"
                            : "bg-[#001299] hover:bg-[#000e7a] text-white shadow-xs"
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Ditambahkan!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Fase {targetPhase}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Scientific description */}
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {item.description}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
            <span>Formula aktif: {currentIngredients.length} bahan</span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-semibold transition-colors cursor-pointer"
            >
              Selesai Menambahkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
