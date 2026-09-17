"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { DelayedInfoTooltip } from "@/components/DelayedInfoTooltip";
import { ShieldCheck, Sliders, RefreshCw, Thermometer, Sparkles, Layers } from "lucide-react";

interface ColloidInterface3DViewerProps {
  oilPhasePct?: number;
}

export const ColloidInterface3DViewer: React.FC<ColloidInterface3DViewerProps> = ({
  oilPhasePct = 15,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Interactive controls
  const [sor, setSor] = useState(0.22); // Surfactant to Oil Ratio (0.08 to 0.40)
  const [lamellarLayers, setLamellarLayers] = useState(2); // 1 to 4 bilayers
  const [testTemp, setTestTemp] = useState<25 | 40>(40); // 25°C vs 40°C stress
  const [autoRotate, setAutoRotate] = useState(true);

  // 3D camera
  const rotationRef = useRef({ x: 0.35, y: 0.6 });
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Colloidal calculations
  const colloidMetrics = useMemo(() => {
    // Droplet size inversely related to SOR
    const dropletDiameterNm = Math.round(380 * (0.12 / Math.max(0.08, sor)));
    // Interfacial tension drops with higher surfactant packing
    const interfacialTensionMnm = Math.max(0.8, 18.5 - sor * 55).toFixed(1);
    // Coalescence barrier increases with lamellar layers & SOR
    const coalescenceBarrierKj = Math.round(18 + sor * 140 + lamellarLayers * 22);
    // Packing parameter: P = v / (a0 * lc)
    const packingParam = (0.33 + sor * 0.4).toFixed(2);
    const isStableAt40C = coalescenceBarrierKj >= 55;

    return {
      dropletDiameterNm,
      interfacialTensionMnm,
      coalescenceBarrierKj,
      packingParam,
      isStableAt40C,
    };
  }, [sor, lamellarLayers]);

  // Generate surfactant positions evenly on a sphere (Fibonacci sphere distribution)
  const surfactantNodes = useMemo(() => {
    const count = Math.round(48 + sor * 120);
    const nodes = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      nodes.push({ x, y, z });
    }
    return nodes;
  }, [sor]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const render = () => {
      if (autoRotate && !isDraggingRef.current) {
        rotationRef.current.y += 0.005;
      }

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      const width = rect.width;
      const height = rect.height;
      const originX = width / 2;
      const originY = height / 2;

      // Dark colloidal viewport background
      ctx.fillStyle = "#070d18";
      ctx.fillRect(0, 0, width, height);

      // Radial background glow (Aqueous continuous phase)
      const bgGrad = ctx.createRadialGradient(originX, originY, 40, originX, originY, width * 0.6);
      bgGrad.addColorStop(0, "rgba(30, 58, 138, 0.15)");
      bgGrad.addColorStop(1, "rgba(7, 13, 24, 0)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const rx = rotationRef.current.x;
      const ry = rotationRef.current.y;
      const cosX = Math.cos(rx), sinX = Math.sin(rx);
      const cosY = Math.cos(ry), sinY = Math.sin(ry);

      // Droplet base radius on screen
      const coreRadius = 90;

      // 1. Draw Lamellar Liquid Crystal Bilayers (Outer gel concentric rings)
      for (let l = 1; l <= lamellarLayers; l++) {
        const ringRadius = coreRadius + 30 + l * 20;
        ctx.save();
        ctx.strokeStyle = `rgba(96, 165, 250, ${0.25 - l * 0.04})`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);

        ctx.beginPath();
        // Slightly tilted ellipse for 3D depth
        ctx.ellipse(originX, originY, ringRadius, ringRadius * 0.88, rx * 0.4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 2. Draw Oil Droplet Core Sphere
      const oilGrad = ctx.createRadialGradient(
        originX - coreRadius * 0.3,
        originY - coreRadius * 0.35,
        coreRadius * 0.1,
        originX,
        originY,
        coreRadius
      );
      oilGrad.addColorStop(0, "#fde68a"); // Bright amber highlight
      oilGrad.addColorStop(0.5, "#d97706"); // Warm oil lipid core
      oilGrad.addColorStop(1, "#78350f"); // Dark edge shadow

      ctx.fillStyle = oilGrad;
      ctx.beginPath();
      ctx.arc(originX, originY, coreRadius, 0, Math.PI * 2);
      ctx.fill();

      // 3. Project and Sort Surfactants by depth Z
      const projectedSurfactants = surfactantNodes.map((node) => {
        // Rotate around Y
        const x1 = node.x * cosY + node.z * sinY;
        const z1 = -node.x * sinY + node.z * cosY;
        // Rotate around X
        const y2 = node.y * cosX - z1 * sinX;
        const z2 = node.y * sinX + z1 * cosX;

        return {
          projX: x1,
          projY: y2,
          projZ: z2,
        };
      });

      projectedSurfactants.sort((a, b) => a.projZ - b.projZ);

      // Thermal jitter if testTemp === 40
      const jitter = testTemp === 40 ? 1.2 : 0.4;

      for (const surf of projectedSurfactants) {
        // Core boundary point (Tail anchor inside oil)
        const tailDepth = 0.75;
        const tailX = originX + surf.projX * (coreRadius * tailDepth);
        const tailY = originY - surf.projY * (coreRadius * tailDepth);

        // Interface head point (pointing out to water)
        const headDistance = coreRadius + 22 + (Math.sin(Date.now() * 0.003 + surf.projX) * jitter);
        const headX = originX + surf.projX * headDistance;
        const headY = originY - surf.projY * headDistance;

        const alpha = Math.max(0.2, Math.min(1, 0.6 + surf.projZ * 0.4));

        // Lipophilic Tail (Amber/Golden zig-zag line)
        ctx.strokeStyle = `rgba(245, 158, 11, ${alpha * 0.9})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        // Middle kink for hydrocarbon tail
        const midX = (tailX + headX) / 2 + surf.projZ * 2;
        const midY = (tailY + headY) / 2 - surf.projZ * 2;
        ctx.lineTo(midX, midY);
        ctx.lineTo(headX, headY);
        ctx.stroke();

        // Hydrophilic Polar Head (Cyan/Blue sphere)
        const headRadius = Math.max(2.5, 4.5 * (1 + surf.projZ * 0.25));
        const headGrad = ctx.createRadialGradient(
          headX - headRadius * 0.3,
          headY - headRadius * 0.3,
          1,
          headX,
          headY,
          headRadius
        );
        headGrad.addColorStop(0, "#93c5fd");
        headGrad.addColorStop(0.7, "#2563eb");
        headGrad.addColorStop(1, "#1e3a8a");

        ctx.fillStyle = headGrad;
        ctx.beginPath();
        ctx.arc(headX, headY, headRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Draw Center Oil Core Label on top with high-contrast subtle pill badge
      const badgeW = 96;
      const badgeH = 34;
      ctx.fillStyle = "rgba(10, 25, 47, 0.85)";
      ctx.beginPath();
      ctx.roundRect(originX - badgeW / 2, originY - badgeH / 2, badgeW, badgeH, 12);
      ctx.fill();
      ctx.strokeStyle = "rgba(253, 230, 138, 0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Oil Core (Lipid)", originX, originY - 6);
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = "#fde68a";
      ctx.fillText(`Ø ~${colloidMetrics.dropletDiameterNm} nm`, originX, originY + 8);



      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [sor, lamellarLayers, testTemp, autoRotate, surfactantNodes, colloidMetrics]);

  // Mouse interaction
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    rotationRef.current.y += dx * 0.01;
    rotationRef.current.x += dy * 0.01;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="space-y-5 font-sans">
      {/* 3D Canvas Box */}
      <div className="relative w-full rounded-3xl bg-[#070d18] border border-slate-800/80 shadow-md overflow-hidden flex flex-col">
        {/* Top Floating Control Bar */}
        <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          {/* Temperature Stress Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/85 backdrop-blur-md rounded-2xl border border-white/10 pointer-events-auto">
            <button
              type="button"
              onClick={() => setTestTemp(25)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                testTemp === 25 ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Thermometer className="w-3.5 h-3.5" />
              <span>25°C Ambient</span>
            </button>
            <button
              type="button"
              onClick={() => setTestTemp(40)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                testTemp === 40 ? "bg-rose-600 text-white shadow-xs" : "text-slate-400 hover:text-white"
              }`}
            >
              <Thermometer className="w-3.5 h-3.5 text-amber-200" />
              <span>40°C Tropis (Zona IVb)</span>
            </button>
          </div>

          {/* Auto rotate toggle */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={() => setAutoRotate((v) => !v)}
              className={`p-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                autoRotate
                  ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                  : "bg-slate-900/80 text-slate-400 border-white/10 hover:text-white"
              }`}
              title="Auto-rotate 360°"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${autoRotate ? "animate-spin text-blue-400" : ""}`} />
            </button>
          </div>
        </div>

        {/* Canvas viewport */}
        <div className="relative w-full h-[400px] sm:h-[460px] cursor-grab active:cursor-grabbing">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full h-full block"
          />

          {/* Legend Overlay */}
          <div className="absolute bottom-4 left-4 z-10 p-3 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-white/10 text-white text-[11px] space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
              <span className="text-slate-300">Kepala Hidrofilik Polar (Fase Air)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-1 bg-amber-400 shrink-0 rounded-full" />
              <span className="text-slate-300">Ekor Lipofilik (Tertambat di Inti Minyak)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full border border-dashed border-blue-300 shrink-0" />
              <span className="text-slate-300">Lapisan Lamellar Liquid Crystal Bilayer</span>
            </div>
          </div>

          {/* Stability Badge */}
          <div className="absolute bottom-4 right-4 z-10 p-3 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-white/10 text-white text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className={`w-4 h-4 ${colloidMetrics.isStableAt40C ? "text-emerald-400" : "text-amber-400"}`} />
              <span className="font-bold">
                {colloidMetrics.isStableAt40C ? "Stabil Terhadap Koalesensi 40°C" : "Rentan Pemisahan Fase"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Colloidal Sliders & Parameter Tuning */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Slider 1: Surfactant-to-Oil Ratio (SOR) */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#001299]" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Surfactant-to-Oil Ratio (SOR)
              </span>
              <DelayedInfoTooltip
                content="Rasio massa surfaktan terhadap fase minyak. Nilai optimal (0.20-0.30) meminimalkan tegangan antarmuka dan mencegah Ostwald ripening."
                delayMs={300}
              />
            </div>
            <span className="text-sm font-extrabold text-[#001299] font-mono">
              {sor.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0.08"
            max="0.40"
            step="0.01"
            value={sor}
            onChange={(e) => setSor(parseFloat(e.target.value))}
            className="w-full accent-[#001299] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-medium">
            <span>0.08 (Tetesan Makro)</span>
            <span>0.22 (Baku Paragon)</span>
            <span>0.40 (Mikro/Nanoemulsi)</span>
          </div>
        </div>

        {/* Slider 2: Lamellar Liquid Crystal Bilayers */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#001299]" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Lapisan Lamellar Gel Bilayer
              </span>
              <DelayedInfoTooltip
                content="Jaringan konsentrik kristal cair yang membungkus tetesan minyak untuk mencegah penggabungan droplet (coalescence) saat inkubasi 40°C."
                delayMs={300}
              />
            </div>
            <span className="text-sm font-extrabold text-[#001299] font-mono">
              {lamellarLayers} Bilayer
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="4"
            step="1"
            value={lamellarLayers}
            onChange={(e) => setLamellarLayers(parseInt(e.target.value, 10))}
            className="w-full accent-[#001299] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-medium">
            <span>1 Lapisan (Minimal)</span>
            <span>2 Lapisan (Rekomendasi)</span>
            <span>4 Lapisan (Gel Barrier Kokoh)</span>
          </div>
        </div>
      </div>

      {/* Real-time Physical Chemistry Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Diameter Tetesan
            </span>
            <DelayedInfoTooltip
              content="Estimasi ukuran partikel rata-rata (DLS in-silico) pada kesetimbangan termodinamika."
              delayMs={300}
            />
          </div>
          <div className="mt-1 text-lg font-extrabold text-[#0a192f] font-heading">
            {colloidMetrics.dropletDiameterNm} <span className="text-xs text-slate-400 font-medium font-sans">nm</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Tegangan Antarmuka (γ)
            </span>
            <DelayedInfoTooltip
              content="Interfacial tension pada antarmuka tetesan minyak/air. Nilai < 10 mN/m esensial untuk kestabilan jangka panjang."
              delayMs={300}
            />
          </div>
          <div className="mt-1 text-lg font-extrabold text-[#0a192f] font-heading">
            {colloidMetrics.interfacialTensionMnm} <span className="text-xs text-slate-400 font-medium font-sans">mN/m</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Barrier Koalesensi (ΔE)
            </span>
            <DelayedInfoTooltip
              content="Energi aktivasi penghalang penggabungan droplet. Ambang batas aman 40°C ≥ 55 kJ/mol."
              delayMs={300}
            />
          </div>
          <div className="mt-1 text-lg font-extrabold text-[#0a192f] font-heading">
            {colloidMetrics.coalescenceBarrierKj} <span className="text-xs text-slate-400 font-medium font-sans">kJ/mol</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Packing Parameter (P)
            </span>
            <DelayedInfoTooltip
              content="P = v / (a0 * lc). P < 0.5 menghasilkan kelengkungan positif sferis yang menguntungkan emulsi O/W."
              delayMs={300}
            />
          </div>
          <div className="mt-1 text-lg font-extrabold text-[#001299] font-heading font-mono">
            {colloidMetrics.packingParam}
          </div>
        </div>
      </div>
    </div>
  );
};
