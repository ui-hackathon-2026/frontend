"use client";

import React, { useState } from "react";
import { ArtifactType } from "@/domain/models/editor";
import { X, Play, Zap, ShieldCheck, Thermometer, FileText, Sliders, CheckCircle2 } from "lucide-react";

interface ActionConfigModalProps {
  isOpen: boolean;
  actionType: ArtifactType | null;
  onClose: () => void;
  onExecute: (type: ArtifactType, params: any) => void;
}

export const ActionConfigModal: React.FC<ActionConfigModalProps> = ({
  isOpen,
  actionType,
  onClose,
  onExecute,
}) => {
  // Config state for Pareto
  const [maxCogs, setMaxCogs] = useState(45000);
  const [minStability, setMinStability] = useState(85);
  const [targetTkdn, setTargetTkdn] = useState(40);

  // Config state for Sentinel
  const [checkBpom, setCheckBpom] = useState(true);
  const [checkHalal, setCheckHalal] = useState(true);
  const [checkTkdn, setCheckTkdn] = useState(true);

  // Config state for Simulation
  const [tempCelsius, setTempCelsius] = useState(40);
  const [durationDays, setDurationDays] = useState(90);

  // Config state for Similarity
  const [brandScope, setBrandScope] = useState<"all" | "wardah" | "emina" | "kahf">("all");

  if (!isOpen || !actionType) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let params: any = {};
    if (actionType === "pareto") {
      params = { maxCogs, minStability, targetTkdn };
    } else if (actionType === "sentinel") {
      params = { checkBpom, checkHalal, checkTkdn };
    } else if (actionType === "simulation") {
      params = { tempCelsius, durationDays };
    } else if (actionType === "similarity") {
      params = { brandScope };
    }
    onExecute(actionType, params);
  };

  const getModalTitle = () => {
    switch (actionType) {
      case "pareto":
        return { title: "Konfigurasi Pareto Optimizer (NSGA-II)", icon: Zap, color: "text-indigo-600" };
      case "sentinel":
        return { title: "Konfigurasi Audit BPOM & Halal Sentinel", icon: ShieldCheck, color: "text-emerald-600" };
      case "simulation":
        return { title: "Konfigurasi Simulasi Kestabilan 40°C", icon: Thermometer, color: "text-rose-600" };
      case "similarity":
        return { title: "Konfigurasi Dual-Scope Similarity & Patent", icon: FileText, color: "text-blue-600" };
    }
  };

  const info = getModalTitle();
  const Icon = info.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in font-sans">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <Icon className={`w-4 h-4 ${info.color}`} />
            </div>
            <h3 className="text-sm font-extrabold text-[#0a192f] tracking-tight font-heading">
              {info.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {actionType === "pareto" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Tentukan batasan simpleks massa untuk menyaring 50.000 iterasi kandidat formula pada klaster GPU L40S.
              </p>

              {/* Max Cost */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Batas Plafon Biaya (COGS)</span>
                  <span className="text-[#001299] font-mono font-extrabold">
                    Rp {maxCogs.toLocaleString("id-ID")} / kg
                  </span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="90000"
                  step="1000"
                  value={maxCogs}
                  onChange={(e) => setMaxCogs(parseInt(e.target.value))}
                  className="w-full accent-[#001299] cursor-pointer"
                />
              </div>

              {/* Min Stability */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Target Minimum Stabilitas 40°C</span>
                  <span className="text-emerald-700 font-mono font-extrabold">{minStability}%</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="98"
                  step="1"
                  value={minStability}
                  onChange={(e) => setMinStability(parseInt(e.target.value))}
                  className="w-full accent-[#001299] cursor-pointer"
                />
              </div>

              {/* Target TKDN */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Target Kandungan Lokal (TKDN)</span>
                  <span className="text-blue-700 font-mono font-extrabold">≥ {targetTkdn}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="70"
                  step="5"
                  value={targetTkdn}
                  onChange={(e) => setTargetTkdn(parseInt(e.target.value))}
                  className="w-full accent-[#001299] cursor-pointer"
                />
              </div>
            </div>
          )}

          {actionType === "sentinel" && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Pilih basis standar kepatuhan regulasi kosmetik yang akan diaudit terhadap formula aktif:
              </p>
              <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkBpom}
                  onChange={(e) => setCheckBpom(e.target.checked)}
                  className="w-4 h-4 text-[#001299] rounded"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Perka BPOM No. 17 Tahun 2022</span>
                  <span className="text-[11px] text-slate-500">Batas maksimum zat aktif, pengawet, & tabir surya.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkHalal}
                  onChange={(e) => setCheckHalal(e.target.checked)}
                  className="w-4 h-4 text-[#001299] rounded"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Sertifikasi Halal HAS 23000 & BPJPH</span>
                  <span className="text-[11px] text-slate-500">Skrining bebas porcine & derivatif hewani non-halal.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkTkdn}
                  onChange={(e) => setCheckTkdn(e.target.checked)}
                  className="w-4 h-4 text-[#001299] rounded"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Audit Bobot Hayati Lokal (TKDN ≥ 40%)</span>
                  <span className="text-[11px] text-slate-500">Kalkulasi persentase bahan nabati lokal nusantara.</span>
                </div>
              </label>
            </div>
          )}

          {actionType === "simulation" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Parameter uji percepatan climatic chamber in-silico sesuai standar iklim tropis Zona IVb:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Suhu Uji</span>
                  <span className="text-base font-extrabold text-[#0a192f] font-mono">40°C (±2°C)</span>
                  <span className="text-[10px] text-slate-400 block">Iklim Tropis Standar</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Durasi Simulasi</span>
                  <span className="text-base font-extrabold text-[#0a192f] font-mono">90 Hari</span>
                  <span className="text-[10px] text-slate-400 block">≈ 24 Bulan Real-Time</span>
                </div>
              </div>
            </div>
          )}

          {actionType === "similarity" && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Pilih cakupan perbandingan repositori internal Paragon & database paten eksternal:
              </p>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Cakupan Brand Acuan
                </label>
                <select
                  value={brandScope}
                  onChange={(e) => setBrandScope(e.target.value as any)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="all">Semua Brand Paragon (Wardah, Kahf, Emina, Make Over, Laboré)</option>
                  <option value="wardah">Wardah Skincare Series</option>
                  <option value="emina">Emina Youth Series</option>
                  <option value="kahf">Kahf Men Essentials</option>
                </select>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-[#001299] hover:bg-[#000e7a] text-white shadow-xs transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Jalankan &amp; Buat Artifact</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
