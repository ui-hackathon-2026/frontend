"use client";

import React from "react";
import { DropletDistributionPoint } from "@/domain/models/simulation";
import { Target, Info } from "lucide-react";

interface DropletDistributionChartProps {
  meanSizeNm: number;
  pdi: number;
  distribution: DropletDistributionPoint[];
}

export const DropletDistributionChart: React.FC<DropletDistributionChartProps> = ({
  meanSizeNm,
  pdi,
  distribution,
}) => {
  const maxFreq = Math.max(...distribution.map((d) => d.volumeFrequencyPct), 25);
  const chartHeight = 120;
  const chartWidth = 320;

  // Build SVG path coordinates
  const minD = 40;
  const maxD = 500;

  const points = distribution
    .filter((d) => d.diameterNm <= maxD)
    .map((d) => {
      const x = ((d.diameterNm - minD) / (maxD - minD)) * chartWidth;
      const y = chartHeight - (d.volumeFrequencyPct / maxFreq) * (chartHeight - 20);
      return `${x},${y}`;
    });

  const pathD = points.length > 0 ? `M ${points.join(" L ")}` : "";
  const areaD =
    points.length > 0
      ? `M ${points[0].split(",")[0]},${chartHeight} L ${points.join(" L ")} L ${
          points[points.length - 1].split(",")[0]
        },${chartHeight} Z`
      : "";

  // Target 200nm line X coordinate
  const targetX = ((200 - minD) / (maxD - minD)) * chartWidth;
  const meanX = ((meanSizeNm - minD) / (maxD - minD)) * chartWidth;

  const isTargetAchieved = meanSizeNm <= 200;

  return (
    <div className="relative overflow-hidden shimmer-card p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Droplet Size Distribution (DLS In-Silico)
          </span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-extrabold text-[#0a192f] font-heading">
              {meanSizeNm} <span className="text-sm font-semibold text-slate-500">nm</span>
            </span>
            <span className="text-xs text-slate-500">
              (PDI: <span className="font-mono font-semibold text-slate-700">{pdi.toFixed(3)}</span>)
            </span>
          </div>
        </div>

        <div
          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
            isTargetAchieved
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>{isTargetAchieved ? "Target <200nm Cleared" : "Large Coalescence Risk"}</span>
        </div>
      </div>

      {/* SVG Bell Curve Chart */}
      <div className="relative pt-2 pb-1">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-32 overflow-visible"
        >
          {/* Grid lines */}
          <line
            x1="0"
            y1={chartHeight}
            x2={chartWidth}
            y2={chartHeight}
            stroke="#cbd5e1"
            strokeWidth="1"
          />
          <line
            x1="0"
            y1={chartHeight / 2}
            x2={chartWidth}
            y2={chartHeight / 2}
            stroke="#f1f5f9"
            strokeDasharray="3 3"
          />

          {/* Area fill */}
          {areaD && <path d={areaD} fill="rgba(0, 18, 153, 0.08)" />}

          {/* Curve stroke */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#0018a8"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {/* Target 200nm threshold line */}
          <line
            x1={targetX}
            y1="0"
            x2={targetX}
            y2={chartHeight}
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          <text
            x={targetX + 3}
            y="12"
            fill="#059669"
            fontSize="9"
            fontWeight="bold"
          >
            Target 200nm
          </text>

          {/* Current Mean Size Marker */}
          {meanX >= 0 && meanX <= chartWidth && (
            <>
              <line
                x1={meanX}
                y1="0"
                x2={meanX}
                y2={chartHeight}
                stroke="#0a192f"
                strokeWidth="1.5"
              />
              <circle cx={meanX} cy="5" r="3" fill="#0a192f" />
            </>
          )}
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1">
          <span>50 nm</span>
          <span>150 nm</span>
          <span>250 nm</span>
          <span>350 nm</span>
          <span>450+ nm</span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center space-x-1">
          <Info className="w-3.5 h-3.5 text-blue-600" />
          <span>Ukuran tetesan nano menjamin stabilitas termodinamika &amp; sensori ringan non-greasy.</span>
        </span>
      </div>
    </div>
  );
};
