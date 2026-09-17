"use client";

import React, { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";

export interface DelayedInfoTooltipProps {
  /** Content to display in the tooltip popover */
  content: React.ReactNode;
  /** Hover duration before tooltip appears (in milliseconds). Defaults to 1000ms (1 second). */
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
  delayMs = 1000,
  position = "top",
  children,
  iconSizeClass = "w-3.5 h-3.5",
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
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

  // Position classes
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
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

      {/* Tooltip Popup (only reveals after delayMs of continuous hover) */}
      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-50 pointer-events-none whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-900/95 text-white text-xs font-mono shadow-lg border border-slate-700/60 backdrop-blur-xs animate-in fade-in zoom-in-95 duration-150 ${positionClasses[position]}`}
        >
          {content}
        </div>
      )}
    </div>
  );
};
