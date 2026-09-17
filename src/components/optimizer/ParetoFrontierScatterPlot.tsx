"use client";

import React, { useState } from "react";
import {
  ParetoTrialPoint,
  ParetoCandidateFormula,
} from "@/domain/models/optimizer";
import { ProjectionAxisMode } from "@/hooks/useParetoOptimizer";
import { DelayedInfoTooltip } from "@/components/DelayedInfoTooltip";
import { BarChart3, Eye, ArrowUpDown, Sparkles } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

interface ParetoFrontierScatterPlotProps {
  points: ParetoTrialPoint[];
  topCandidates: ParetoCandidateFormula[];
  selectedCandidateId: "A" | "B" | "C" | null;
  onSelectCandidate: (id: "A" | "B" | "C") => void;
  projectionAxis: ProjectionAxisMode;
  onChangeProjectionAxis: (axis: ProjectionAxisMode) => void;
}

export const ParetoFrontierScatterPlot: React.FC<ParetoFrontierScatterPlotProps> = ({
  points,
  topCandidates,
  selectedCandidateId,
  onSelectCandidate,
  projectionAxis,
  onChangeProjectionAxis,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<ParetoTrialPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Chart dimensions inside SVG viewBox
  const width = 760;
  const height = 440;
  const padding = { top: 40, right: 40, bottom: 60, left: 70 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Determine X & Y metrics based on projectionAxis
  // Default: X = COGS (Rp), Y = Stability (%)
  let xMin = 20000;
  let xMax = 60000;
  let yMin = 70;
  let yMax = 100;
  let xLabel = "Estimasi Biaya Bahan (COGS Rp / kg)";
  let yLabel = "Probabilitas Stabilitas 40°C (%)";

  if (projectionAxis === "stability_tkdn") {
    xMin = 30;
    xMax = 70;
    yMin = 70;
    yMax = 100;
    xLabel = "Kandungan Bahan Lokal (TKDN %)";
    yLabel = "Probabilitas Stabilitas 40°C (%)";
  } else if (projectionAxis === "cogs_tkdn") {
    xMin = 20000;
    xMax = 60000;
    yMin = 30;
    yMax = 70;
    xLabel = "Estimasi Biaya Bahan (COGS Rp / kg)";
    yLabel = "Kandungan Bahan Lokal (TKDN %)";
  }

  // Coordinate mapping functions
  const getXVal = (pt: ParetoTrialPoint) => {
    if (projectionAxis === "stability_tkdn") return pt.tkdnPct;
    return pt.cogsIdr;
  };

  const getYVal = (pt: ParetoTrialPoint) => {
    if (projectionAxis === "cogs_tkdn") return pt.tkdnPct;
    return pt.stabilityPct;
  };

  const scaleX = (val: number) => {
    return padding.left + ((val - xMin) / (xMax - xMin)) * plotWidth;
  };

  const scaleY = (val: number) => {
    return height - padding.bottom - ((val - yMin) / (yMax - yMin)) * plotHeight;
  };

  // Sort frontier points to draw envelope curve
  const frontierPoints = points
    .filter((p) => p.isParetoOptimal)
    .sort((a, b) => getXVal(a) - getXVal(b));

  const frontierPathD = frontierPoints.reduce((acc, pt, idx) => {
    const x = scaleX(getXVal(pt));
    const y = scaleY(getYVal(pt));
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, "");

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4 relative">
      {points.length === 0 ? (
        <EmptyState
          title="Belum Ada Titik Optimasi"
          description="Hasil trial Pareto masih kosong. Jalankan ulang optimasi untuk menghasilkan sebaran titik."
        />
      ) : (
        <>
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-[#0a192f] font-heading flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-[#001299]" />
              <span>Interactive Pareto Frontier Scatter</span>
            </h3>
            <DelayedInfoTooltip
              content="Visualisasi sebaran 50.000 formula. Titik pada garis kurva biru adalah solusi non-dominated yang memiliki rasio kompromi paling efisien."
              delayMs={300}
            />
          </div>
          <span className="text-xs text-slate-500">
            Arahkan kursor ke titik untuk melihat rincian formula atau klik kandidat A/B/C
          </span>
        </div>

        {/* Projection Mode Switcher */}
        <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => onChangeProjectionAxis("stability_cogs")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
              projectionAxis === "stability_cogs"
                ? "bg-white text-[#001299] font-bold shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Stabilitas vs COGS
          </button>
          <button
            type="button"
            onClick={() => onChangeProjectionAxis("stability_tkdn")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
              projectionAxis === "stability_tkdn"
                ? "bg-white text-[#001299] font-bold shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Stabilitas vs TKDN
          </button>
          <button
            type="button"
            onClick={() => onChangeProjectionAxis("cogs_tkdn")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
              projectionAxis === "cogs_tkdn"
                ? "bg-white text-[#001299] font-bold shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            COGS vs TKDN
          </button>
        </div>
      </div>

      {/* Legend Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 pt-1">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span>Dominated Trials</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#001299]" />
            <span className="font-semibold text-[#001299]">Pareto Frontier Envelope</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 font-medium">
          <button
            type="button"
            onClick={() => onSelectCandidate("A")}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded-md transition-all cursor-pointer ${
              selectedCandidateId === "A"
                ? "bg-blue-100 text-[#001299] font-bold ring-1 ring-[#001299]"
                : "hover:bg-slate-100"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>Kandidat A (Balanced)</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectCandidate("B")}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded-md transition-all cursor-pointer ${
              selectedCandidateId === "B"
                ? "bg-emerald-100 text-emerald-900 font-bold ring-1 ring-emerald-600"
                : "hover:bg-slate-100"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Kandidat B (Cost Leader)</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectCandidate("C")}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded-md transition-all cursor-pointer ${
              selectedCandidateId === "C"
                ? "bg-purple-100 text-purple-900 font-bold ring-1 ring-purple-600"
                : "hover:bg-slate-100"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-600" />
            <span>Kandidat C (High-TKDN)</span>
          </button>
        </div>
      </div>

      {/* SVG Scatter Plot Canvas */}
      <div className="relative w-full overflow-hidden border border-slate-100 rounded-2xl bg-[#fafbfc]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          {/* Grid lines: Horizontal */}
          {[0.2, 0.4, 0.6, 0.8, 1.0].map((t, idx) => {
            const y = padding.top + t * plotHeight;
            const yVal = Math.round(yMax - t * (yMax - yMin));
            return (
              <g key={`grid-h-${idx}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="#94a3b8"
                  fontFamily="monospace"
                >
                  {yVal}
                  {projectionAxis === "cogs_tkdn" ? "%" : "%"}
                </text>
              </g>
            );
          })}

          {/* Grid lines: Vertical */}
          {[0.0, 0.25, 0.5, 0.75, 1.0].map((t, idx) => {
            const x = padding.left + t * plotWidth;
            const xVal = Math.round(xMin + t * (xMax - xMin));
            return (
              <g key={`grid-v-${idx}`}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={height - padding.bottom}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={height - padding.bottom + 18}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#94a3b8"
                  fontFamily="monospace"
                >
                  {projectionAxis === "stability_tkdn"
                    ? `${xVal}%`
                    : `${(xVal / 1000).toFixed(0)}k`}
                </text>
              </g>
            );
          })}

          {/* Axis Labels */}
          <text
            x={width / 2}
            y={height - 15}
            textAnchor="middle"
            fontSize="11"
            fontWeight="bold"
            fill="#475569"
          >
            {xLabel}
          </text>
          <text
            x={-height / 2}
            y={20}
            transform="rotate(-90)"
            textAnchor="middle"
            fontSize="11"
            fontWeight="bold"
            fill="#475569"
          >
            {yLabel}
          </text>

          {/* Pareto Frontier Connecting Line */}
          {frontierPathD && (
            <path
              d={frontierPathD}
              fill="none"
              stroke="#001299"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-80"
            />
          )}

          {/* 1. Render Dominated Points */}
          {points
            .filter((p) => !p.isParetoOptimal)
            .map((pt) => {
              const cx = scaleX(getXVal(pt));
              const cy = scaleY(getYVal(pt));
              return (
                <circle
                  key={pt.id}
                  cx={cx}
                  cy={cy}
                  r="3.5"
                  fill="#94a3b8"
                  opacity="0.45"
                  className="transition-all hover:opacity-100 hover:scale-150 cursor-pointer"
                  onMouseEnter={(e) => {
                    setHoveredPoint(pt);
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltipPos({ x: cx, y: cy });
                  }}
                />
              );
            })}

          {/* 2. Render Non-Dominated Frontier Points */}
          {frontierPoints.map((pt) => {
            const cx = scaleX(getXVal(pt));
            const cy = scaleY(getYVal(pt));
            const isChampion = Boolean(pt.candidateId);
            if (isChampion) return null; // Render champion separately for layering

            return (
              <circle
                key={pt.id}
                cx={cx}
                cy={cy}
                r="4.5"
                fill="#001299"
                stroke="#ffffff"
                strokeWidth="1.5"
                className="transition-all hover:scale-175 cursor-pointer"
                onMouseEnter={() => {
                  setHoveredPoint(pt);
                  setTooltipPos({ x: cx, y: cy });
                }}
              />
            );
          })}

          {/* 3. Render Top-3 Champions on Frontier */}
          {frontierPoints
            .filter((pt) => Boolean(pt.candidateId))
            .map((pt) => {
              const cx = scaleX(getXVal(pt));
              const cy = scaleY(getYVal(pt));
              const cid = pt.candidateId!;
              const isSelected = selectedCandidateId === cid;

              const color =
                cid === "A" ? "#001299" : cid === "B" ? "#059669" : "#7c3aed";

              return (
                <g
                  key={pt.id}
                  onClick={() => onSelectCandidate(cid)}
                  className="cursor-pointer"
                  onMouseEnter={() => {
                    setHoveredPoint(pt);
                    setTooltipPos({ x: cx, y: cy });
                  }}
                >
                  {/* Pulsing ring if selected */}
                  {isSelected && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="16"
                      fill={color}
                      opacity="0.2"
                      className="animate-pulse"
                    />
                  )}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? "9" : "8"}
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="shadow-lg transition-transform hover:scale-125"
                  />
                  <text
                    x={cx}
                    y={cy + 3.5}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="extrabold"
                  >
                    {cid}
                  </text>
                </g>
              );
            })}
        </svg>

        {/* Floating Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute z-20 pointer-events-none p-3 rounded-xl bg-slate-900/95 text-white shadow-xl text-xs space-y-1 backdrop-blur-md border border-slate-700 transition-all -translate-x-1/2 -translate-y-full mb-3"
            style={{
              left: `${(scaleX(getXVal(hoveredPoint)) / width) * 100}%`,
              top: `${(scaleY(getYVal(hoveredPoint)) / height) * 100}%`,
            }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1">
              <span className="font-bold text-blue-300">
                {hoveredPoint.candidateId
                  ? `Kandidat ${hoveredPoint.candidateId}`
                  : `Trial #${hoveredPoint.trialIndex.toLocaleString("id-ID")}`}
              </span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  hoveredPoint.isParetoOptimal
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-300"
                }`}
              >
                {hoveredPoint.isParetoOptimal ? "Frontier (Rank 1)" : "Dominated"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] pt-0.5 font-mono">
              <span className="text-slate-400">Stabilitas 40°C:</span>
              <span className="text-right font-bold">{hoveredPoint.stabilityPct}%</span>
              <span className="text-slate-400">Biaya (COGS):</span>
              <span className="text-right font-bold">
                Rp {hoveredPoint.cogsIdr.toLocaleString("id-ID")}/kg
              </span>
              <span className="text-slate-400">TKDN Lokal:</span>
              <span className="text-right font-bold">{hoveredPoint.tkdnPct}%</span>
              <span className="text-slate-400">Viskositas:</span>
              <span className="text-right font-bold">
                {hoveredPoint.viscosityMpaS.toLocaleString("id-ID")} mPa·s
              </span>
            </div>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
};
