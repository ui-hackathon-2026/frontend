"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { MoleculeItem, Atom3D, ElementType } from "@/domain/models/molecule";
import { RotateCw, ZoomIn, ZoomOut, Maximize2, Layers, Eye, RefreshCw, Zap } from "lucide-react";

export type RenderMode = "ball-and-stick" | "space-filling" | "wireframe";

interface Molecule3DViewerProps {
  molecule: MoleculeItem;
}

// CPK Color standard and Van der Waals radius (in Ångströms)
const ELEMENT_PROPERTIES: Record<ElementType, { color: string; radius: number; name: string }> = {
  C: { color: "#475569", radius: 1.70, name: "Carbon" },
  H: { color: "#f8fafc", radius: 1.20, name: "Hydrogen" },
  O: { color: "#ef4444", radius: 1.52, name: "Oxygen" },
  N: { color: "#3b82f6", radius: 1.55, name: "Nitrogen" },
  S: { color: "#eab308", radius: 1.80, name: "Sulfur" },
  P: { color: "#f97316", radius: 1.80, name: "Phosphorus" },
  Cl: { color: "#10b981", radius: 1.75, name: "Chlorine" },
  Na: { color: "#8b5cf6", radius: 2.27, name: "Sodium" },
};

export const Molecule3DViewer: React.FC<Molecule3DViewerProps> = ({ molecule }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [renderMode, setRenderMode] = useState<RenderMode>("ball-and-stick");
  const [showEspOverlay, setShowEspOverlay] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [hoveredAtom, setHoveredAtom] = useState<Atom3D | null>(null);

  // 3D camera state
  const rotationRef = useRef({ x: 0.3, y: 0.5 });
  const zoomRef = useRef(38);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Calculate molecule center to center coordinates around (0, 0, 0)
  const getTransformedAtoms = useCallback(() => {
    if (molecule.atoms.length === 0) return [];
    let sumX = 0, sumY = 0, sumZ = 0;
    for (const a of molecule.atoms) {
      sumX += a.x;
      sumY += a.y;
      sumZ += a.z;
    }
    const cx = sumX / molecule.atoms.length;
    const cy = sumY / molecule.atoms.length;
    const cz = sumZ / molecule.atoms.length;

    const rx = rotationRef.current.x;
    const ry = rotationRef.current.y;
    const cosX = Math.cos(rx), sinX = Math.sin(rx);
    const cosY = Math.cos(ry), sinY = Math.sin(ry);

    return molecule.atoms.map((atom) => {
      const x0 = atom.x - cx;
      const y0 = atom.y - cy;
      const z0 = atom.z - cz;

      // Rotate around Y
      const x1 = x0 * cosY + z0 * sinY;
      const z1 = -x0 * sinY + z0 * cosY;

      // Rotate around X
      const y2 = y0 * cosX - z1 * sinX;
      const z2 = y0 * sinX + z1 * cosX;

      return {
        ...atom,
        projX: x1,
        projY: y2,
        projZ: z2,
      };
    });
  }, [molecule]);

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      if (autoRotate && !isDraggingRef.current) {
        rotationRef.current.y += 0.008;
      }

      // Handle high-DPI
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

      // 1. Deep scientific radial gradient background (replaces flat black)
      const bgGrad = ctx.createRadialGradient(originX, originY, 20, originX, originY, Math.max(width, height) * 0.7);
      bgGrad.addColorStop(0, "#0f1f3d"); // illuminated center
      bgGrad.addColorStop(1, "#060a14"); // deep dark vignette edges
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Visible Blueprint Scientific Technical Grid
      const gridSize = 24; // fine technical grid
      const majorStep = 4; // major grid every 96px

      // Minor grid lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Major grid lines
      ctx.strokeStyle = "rgba(56, 189, 248, 0.18)";
      for (let x = 0; x <= width; x += gridSize * majorStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += gridSize * majorStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Grid intersection coordinate crosshairs/points
      ctx.fillStyle = "rgba(56, 189, 248, 0.4)";
      for (let x = 0; x <= width; x += gridSize * majorStep) {
        for (let y = 0; y <= height; y += gridSize * majorStep) {
          ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
        }
      }

      const atoms = getTransformedAtoms();
      const zoom = zoomRef.current;

      // Project atoms onto 2D screen coordinates
      const screenAtoms = atoms.map((atom) => {
        const perspective = 1 + atom.projZ * 0.05;
        const screenX = originX + atom.projX * zoom * perspective;
        const screenY = originY - atom.projY * zoom * perspective;
        return {
          ...atom,
          screenX,
          screenY,
          perspective,
        };
      });

      // 1. Draw Bonds (sort from back to front)
      for (const bond of molecule.bonds) {
        const a1 = screenAtoms[bond.source];
        const a2 = screenAtoms[bond.target];
        if (!a1 || !a2) continue;

        const bondZ = (a1.projZ + a2.projZ) / 2;
        const alpha = Math.max(0.2, Math.min(1, 0.6 + bondZ * 0.08));

        ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
        ctx.lineWidth = renderMode === "wireframe" ? 2 : Math.max(2, 4 * Math.min(a1.perspective, a2.perspective));
        ctx.lineCap = "round";

        if (bond.order === 1) {
          ctx.beginPath();
          ctx.moveTo(a1.screenX, a1.screenY);
          ctx.lineTo(a2.screenX, a2.screenY);
          ctx.stroke();
        } else if (bond.order === 2) {
          // Double bond offset
          const dx = a2.screenX - a1.screenX;
          const dy = a2.screenY - a1.screenY;
          const len = Math.hypot(dx, dy) || 1;
          const offX = (-dy / len) * 3;
          const offY = (dx / len) * 3;

          ctx.beginPath();
          ctx.moveTo(a1.screenX + offX, a1.screenY + offY);
          ctx.lineTo(a2.screenX + offX, a2.screenY + offY);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(a1.screenX - offX, a1.screenY - offY);
          ctx.lineTo(a2.screenX - offX, a2.screenY - offY);
          ctx.stroke();
        }
      }

      // 2. Draw Atoms (sorted by depth Z so front atoms overlap back ones)
      const sortedAtoms = [...screenAtoms].sort((a, b) => a.projZ - b.projZ);

      for (const atom of sortedAtoms) {
        const prop = ELEMENT_PROPERTIES[atom.element] || { color: "#94a3b8", radius: 1.5, name: atom.element };
        
        let atomRadius = 0;
        if (renderMode === "ball-and-stick") {
          atomRadius = (atom.element === "H" ? 5 : 9) * atom.perspective;
        } else if (renderMode === "space-filling") {
          atomRadius = prop.radius * (zoom * 0.28) * atom.perspective;
        } else {
          atomRadius = 3 * atom.perspective;
        }

        // Color determination: ESP (Electrostatic Potential) vs Standard CPK
        let atomColor = prop.color;
        if (showEspOverlay) {
          const q = atom.charge || 0;
          if (q < -0.2) atomColor = "#ef4444"; // Polar Negative (Oxygen/Nitrogen)
          else if (q > 0.2) atomColor = "#3b82f6"; // Polar Positive (Amide/H-donors)
          else atomColor = "#94a3b8"; // Neutral / Lipophilic
        }

        // 3D Sphere shading with radial gradient
        const lightOffX = atomRadius * 0.35;
        const lightOffY = atomRadius * 0.35;
        const grad = ctx.createRadialGradient(
          atom.screenX - lightOffX,
          atom.screenY - lightOffY,
          atomRadius * 0.1,
          atom.screenX,
          atom.screenY,
          atomRadius
        );

        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(0.3, atomColor);
        grad.addColorStop(1, "#020617");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(atom.screenX, atom.screenY, Math.max(1, atomRadius), 0, Math.PI * 2);
        ctx.fill();

        // Element Symbol Label (in ball-and-stick mode for heavy atoms)
        if (renderMode === "ball-and-stick" && atom.element !== "H") {
          ctx.fillStyle = "#ffffff";
          ctx.font = `bold ${Math.round(8 * atom.perspective)}px monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(atom.element, atom.screenX, atom.screenY);
        }
      }

      ctx.restore();
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [molecule, renderMode, showEspOverlay, autoRotate, getTransformedAtoms]);

  // Mouse drag to rotate
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) {
      // Check hit test for hovered atom
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const originX = rect.width / 2;
      const originY = rect.height / 2;
      const zoom = zoomRef.current;
      const atoms = getTransformedAtoms();

      let closest: Atom3D | null = null;
      let minD = 20;

      for (const a of atoms) {
        const p = 1 + a.projZ * 0.05;
        const sx = originX + a.projX * zoom * p;
        const sy = originY - a.projY * zoom * p;
        const d = Math.hypot(mouseX - sx, mouseY - sy);
        if (d < minD) {
          minD = d;
          closest = a;
        }
      }
      setHoveredAtom(closest);
      return;
    }

    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    rotationRef.current.y += dx * 0.01;
    rotationRef.current.x += dy * 0.01;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Wheel to zoom
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * -0.05;
    zoomRef.current = Math.max(15, Math.min(100, zoomRef.current + zoomDelta));
  };

  const resetCamera = () => {
    rotationRef.current = { x: 0.3, y: 0.5 };
    zoomRef.current = 38;
  };

  return (
    <div className="relative w-full rounded-3xl bg-[#070d18] border border-slate-800/80 shadow-md overflow-hidden flex flex-col font-sans">
      {/* Top Controls Overlay - Ultra Compact */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex flex-wrap items-center justify-between gap-1.5 pointer-events-none">
        {/* Left: Render Mode Selector (Ball & Stick vs CPK) */}
        <div className="flex items-center gap-0.5 p-0.5 bg-slate-900/85 backdrop-blur-md rounded-xl border border-white/10 pointer-events-auto w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setRenderMode("ball-and-stick")}
            className={`flex-1 sm:flex-initial px-2 py-1 rounded-lg text-[10.5px] font-semibold whitespace-nowrap text-center transition-all cursor-pointer ${
              renderMode === "ball-and-stick"
                ? "bg-[#001299] text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Ball &amp; Stick
          </button>
          <button
            type="button"
            onClick={() => setRenderMode("space-filling")}
            className={`flex-1 sm:flex-initial px-2 py-1 rounded-lg text-[10.5px] font-semibold whitespace-nowrap text-center transition-all cursor-pointer ${
              renderMode === "space-filling"
                ? "bg-[#001299] text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Van der Waals (CPK)
          </button>
        </div>

        {/* Right: ESP & Viewport Controls */}
        <div className="flex items-center gap-1 pointer-events-auto">
          {/* ESP Overlay Toggle */}
          <button
            type="button"
            onClick={() => setShowEspOverlay((v) => !v)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10.5px] font-semibold transition-all border cursor-pointer ${
              showEspOverlay
                ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                : "bg-slate-900/85 text-slate-300 border-white/10 hover:bg-slate-800"
            }`}
            title="Tampilkan peta muatan parsial elektrostatik (polar vs non-polar)"
          >
            <Zap className="w-3 h-3" />
            <span>ESP Polaritas</span>
          </button>

          {/* Auto Rotate Toggle */}
          <button
            type="button"
            onClick={() => setAutoRotate((v) => !v)}
            className={`p-1 rounded-lg text-[10.5px] font-semibold transition-all border cursor-pointer ${
              autoRotate
                ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                : "bg-slate-900/85 text-slate-400 border-white/10 hover:text-white"
            }`}
            title="Auto-rotate 360°"
          >
            <RefreshCw className={`w-3 h-3 ${autoRotate ? "animate-spin text-blue-400" : ""}`} />
          </button>

          {/* Reset Camera */}
          <button
            type="button"
            onClick={resetCamera}
            className="p-1 rounded-lg bg-slate-900/85 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Reset Sudut Pandang"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main 3D Canvas */}
      <div className="relative w-full h-[420px] sm:h-[480px] cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className="w-full h-full block"
        />

        {/* Hovered Atom Compact HUD - Sleek single-line at bottom */}
        {hoveredAtom && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 px-2.5 py-1 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/15 text-white text-[10.5px] font-mono shadow-md flex items-center justify-between gap-2 pointer-events-none animate-in fade-in duration-100">
            <div className="flex items-center gap-1.5 truncate">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: ELEMENT_PROPERTIES[hoveredAtom.element]?.color || "#fff" }}
              />
              <span className="font-bold text-white truncate">
                {ELEMENT_PROPERTIES[hoveredAtom.element]?.name || hoveredAtom.element}
              </span>
              <span className="text-slate-400 text-[10px]">
                ({hoveredAtom.element}#{hoveredAtom.id})
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-300 shrink-0">
              <span className="text-slate-400 font-mono">
                ({hoveredAtom.x.toFixed(1)}, {hoveredAtom.y.toFixed(1)}, {hoveredAtom.z.toFixed(1)})Å
              </span>
              {hoveredAtom.charge !== undefined && (
                <span className={`font-semibold ${hoveredAtom.charge > 0 ? "text-blue-400" : "text-rose-400"}`}>
                  q: {hoveredAtom.charge > 0 ? `+${hoveredAtom.charge.toFixed(2)}` : hoveredAtom.charge.toFixed(2)}e⁻
                </span>
              )}
            </div>
          </div>
        )}

        {/* Color Legend HUD - Compact at bottom right (hidden when atom is hovered) */}
        {!hoveredAtom && (
          <div className="absolute bottom-2.5 right-2.5 z-10 px-2 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-white text-[10px] flex items-center gap-2 pointer-events-none">
            {showEspOverlay ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-slate-300 text-[9.5px]">Negatif (O/N)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-slate-300 text-[9.5px]">Positif (H)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span className="text-slate-300 text-[9.5px]">Netral</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#475569]" />
                  <span className="text-slate-400 text-[10px]">C</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
                  <span className="text-slate-400 text-[10px]">O</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                  <span className="text-slate-400 text-[10px]">N</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f8fafc]" />
                  <span className="text-slate-400 text-[10px]">H</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
