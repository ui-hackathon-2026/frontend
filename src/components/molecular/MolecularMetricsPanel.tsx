"use client";

import React, { useState } from "react";
import { MoleculeItem } from "@/domain/models/molecule";
import { DelayedInfoTooltip } from "@/components/DelayedInfoTooltip";
import { Copy, Check, FlaskConical, Atom } from "lucide-react";

interface MolecularMetricsPanelProps {
  molecule: MoleculeItem;
}

export const MolecularMetricsPanel: React.FC<MolecularMetricsPanelProps> = ({ molecule }) => {
  const [copied, setCopied] = useState(false);

  const handleCopySmiles = () => {
    navigator.clipboard.writeText(molecule.smiles);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLogPDescription = (logP: number) => {
    if (logP < 0) return "Sangat hidrofilik (larut air / polar)";
    if (logP <= 3) return "Lipofilisitas optimal untuk penetrasi stratum korneum";
    return "Sangat lipofilik (larut minyak / non-polar)";
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 space-y-5 shadow-xs">
      {/* Header Info */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-[#0a192f] tracking-tight font-heading">
              {molecule.name}
            </h3>
            <DelayedInfoTooltip
              content={`${molecule.description} — Formula: ${molecule.properties.formula}`}
              delayMs={300}
            />
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            INCI: {molecule.inci}
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Formula
          </span>
          <span className="text-sm font-extrabold text-[#001299] font-mono">
            {molecule.properties.formula}
          </span>
        </div>
      </div>

      {/* Primary Physicochemical Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Molecular Weight */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Bobot Molekul (MW)
            </span>
            <DelayedInfoTooltip
              content="Aturan Lipinski: MW < 500 Da esensial untuk penyerapan transdermal topikal."
              delayMs={300}
            />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-lg font-extrabold text-[#0a192f] font-heading">
              {molecule.properties.molecularWeight.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 font-medium">g/mol</span>
          </div>
        </div>

        {/* LogP */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Koefisien LogP
            </span>
            <DelayedInfoTooltip
              content={`LogP ${molecule.properties.logP}: ${getLogPDescription(molecule.properties.logP)}.`}
              delayMs={300}
            />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className={`text-lg font-extrabold font-heading ${
              molecule.properties.logP < 0 ? "text-blue-700" : molecule.properties.logP <= 3 ? "text-emerald-700" : "text-amber-700"
            }`}>
              {molecule.properties.logP > 0 ? `+${molecule.properties.logP.toFixed(2)}` : molecule.properties.logP.toFixed(2)}
            </span>
            <span className="text-[11px] text-slate-400">O/W</span>
          </div>
        </div>

        {/* TPSA */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Polar Area (TPSA)
            </span>
            <DelayedInfoTooltip
              content="Topological Polar Surface Area: Korelasi polaritas terhadap kemampuan pembentukan ikatan hidrogen dengan air."
              delayMs={300}
            />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-lg font-extrabold text-[#0a192f] font-heading">
              {molecule.properties.tpsa.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 font-medium">Å²</span>
          </div>
        </div>

        {/* H-Bond Donors & Acceptors */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              H-Bond Don/Acc
            </span>
            <DelayedInfoTooltip
              content="Jumlah gugus donor (N-H, O-H) dan akseptor (O, N) untuk ikatan hidrogen dalam sediaan emulsi."
              delayMs={300}
            />
          </div>
          <div className="mt-1 text-base font-extrabold text-[#0a192f] font-heading">
            {molecule.properties.hBondDonors} <span className="text-slate-300 font-normal">/</span> {molecule.properties.hBondAcceptors}
          </div>
        </div>

        {/* Rotatable Bonds */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Ikatan Fleksibel
            </span>
            <DelayedInfoTooltip
              content="Rotatable bonds: Tingkat kelenturan konformasi rantai molekul dalam matriks cairan atau gel."
              delayMs={300}
            />
          </div>
          <div className="mt-1 text-base font-extrabold text-[#0a192f] font-heading">
            {molecule.properties.rotatableBonds} <span className="text-xs text-slate-400 font-medium font-sans">ikatan</span>
          </div>
        </div>

        {/* Atom Count */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Ukuran Atom 3D
            </span>
            <DelayedInfoTooltip
              content={`Struktur teroptimasi terdiri dari ${molecule.atoms.length} atom terkoordinasi dan ${molecule.bonds.length} ikatan valensi.`}
              delayMs={300}
            />
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-base font-extrabold text-[#0a192f] font-heading">
            <Atom className="w-4 h-4 text-[#001299]" />
            <span>{molecule.atoms.length}</span>
            <span className="text-xs text-slate-400 font-medium font-sans">atom</span>
          </div>
        </div>
      </div>

      {/* SMILES Canonical String Bar */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900 text-white font-mono text-xs">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            SMILES
          </span>
          <span className="truncate text-slate-200 font-mono selection:bg-blue-600">
            {molecule.smiles}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopySmiles}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0 cursor-pointer"
          title="Salin string SMILES"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
        </button>
      </div>
    </div>
  );
};
