"use client";

import React from "react";

export type ShimmerVariant = "hover" | "ambient" | "loading" | "none";

export interface ShimmerWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /**
   * Shimmer mode:
   * - 'hover' (default): Subtle refined light-beam shimmer sweep when the user hovers over the card.
   * - 'ambient': Continuous gentle periodic shimmer sweep (e.g. for active simulation/running engines).
   * - 'loading': High-tech pulse loading skeleton shimmer.
   * - 'none': Disables the shimmer effect.
   */
  shimmerVariant?: ShimmerVariant;
  className?: string;
}

/**
 * ShimmerWidget - Design System Component for Paragon Studio
 *
 * STANDARD DEVELOP:
 * Semua widget / card di seluruh platform wajib mengadopsi efek shimmering
 * untuk memberikan tactile responsiveness, visual depth, dan sentuhan premium enterprise.
 */
export const ShimmerWidget: React.FC<ShimmerWidgetProps> = ({
  children,
  shimmerVariant = "hover",
  className = "",
  ...rest
}) => {
  const variantClass =
    shimmerVariant === "hover"
      ? "shimmer-card"
      : shimmerVariant === "ambient"
      ? "shimmer-ambient"
      : shimmerVariant === "loading"
      ? "shimmer-loading"
      : "";

  return (
    <div
      className={`relative overflow-hidden transition-all duration-200 ${variantClass} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};
