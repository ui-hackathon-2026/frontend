"use client";

import React, { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";

export interface DelayedInfoTooltipProps {
  /** Content to display in the tooltip popover */
  content: React.ReactNode;
  /** Hover duration before tooltip appears (in milliseconds). Defaults to 300ms (0.3 second). */
  delayMs?: number;
  /** Tooltip position relative to trigger */
  position?: "top" | "bottom" | "left" | "right";
  /** Optional custom trigger. Defaults to a small Info icon. */
  children?: React.ReactNode;
  /** Size class for default Info icon */
  iconSizeClass?: string;
  /** Additional wrapper className */
  className?: string;
}

export const DelayedInfoTooltip: React.FC<DelayedInfoTooltipProps> = ({
  content,
  delayMs = 300,
  position = "top",
  children,
  iconSizeClass = "w-3.5 h-3.5",
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [computedPosition, setComputedPosition] = useState(position);
  const [alignMode, setAlignMode] = useState<"center" | "left" | "right">("center");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleMouseEnter = () => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      if (containerRef.current && typeof window !== "undefined") {
        const rect = containerRef.current.getBoundingClientRect();

        // Smart vertical flip: if close to top viewport boundary, flip to bottom
        let activePos = position;
        if (position === "top" && rect.top < 120) {
          activePos = "bottom";
        } else if (position === "bottom" && window.innerHeight - rect.bottom < 120) {
          activePos = "top";
        }
        setComputedPosition(activePos);

        // Smart horizontal alignment: avoid clipping off viewport edges
        if (window.innerWidth - rect.right < 180) {
          setAlignMode("right");
        } else if (rect.left < 180) {
          setAlignMode("left");
        } else {
          setAlignMode("center");
        }
      }
      setIsVisible(true);
    }, delayMs);
  };

  const handleMouseLeave = () => {
    clearTimer();
    setIsVisible(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, []);

  // Compute position classes
  const getPositionClasses = () => {
    if (computedPosition === "bottom") {
      if (alignMode === "right") return "top-full right-0 mt-2";
      if (alignMode === "left") return "top-full left-0 mt-2";
      return "top-full left-1/2 -translate-x-1/2 mt-2";
    }
    if (computedPosition === "top") {
      if (alignMode === "right") return "bottom-full right-0 mb-2";
      if (alignMode === "left") return "bottom-full left-0 mb-2";
      return "bottom-full left-1/2 -translate-x-1/2 mb-2";
    }
    if (computedPosition === "left") {
      return "right-full top-1/2 -translate-y-1/2 mr-2";
    }
    return "left-full top-1/2 -translate-y-1/2 ml-2";
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      tabIndex={0}
      role="button"
      aria-label="Info"
    >
      {/* Trigger: Small subtle info icon */}
      {children || (
        <span className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-help inline-flex items-center justify-center">
          <Info className={iconSizeClass} />
        </span>
      )}

      {/* Tooltip Popup (reveals with delayMs and smart boundary-safe placement) */}
      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-50 pointer-events-none max-w-xs w-max whitespace-normal text-left px-3 py-2 rounded-xl bg-slate-900/95 text-white text-xs font-sans leading-relaxed shadow-xl border border-slate-700/60 backdrop-blur-xs animate-in fade-in zoom-in-95 duration-150 ${getPositionClasses()}`}
        >
          {content}
        </div>
      )}
    </div>
  );
};
