"use client";

import React from "react";

export interface ShimmerSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * ShimmerSkeleton - Standar Elemen Loading Shimmer Paragon Studio
 * Menghasilkan blok skeleton dengan sapuan kilau gradien halus (shimmer)
 * yang hanya aktif saat komponen sedang memuat data.
 */
export const ShimmerSkeleton: React.FC<ShimmerSkeletonProps> = ({
  className = "w-full h-6 rounded-xl",
  ...props
}) => {
  return (
    <div
      className={`shimmer-loading rounded-xl ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
};

export interface ShimmerWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /**
   * Jika true, widget menampilkan state shimmer loading / skeleton.
   * Jika false (default), widget menampilkan konten normal tanpa animasi konstan.
   */
  isLoading?: boolean;
  /**
   * Custom skeleton layout yang ditampilkan saat isLoading = true.
   */
  loadingFallback?: React.ReactNode;
  className?: string;
}

/**
 * ShimmerWidget - Design System Component for Paragon Studio
 *
 * STANDARD DEVELOP:
 * Efek shimmering HANYA aktif saat status `isLoading = true`.
 * Ketika data sudah dimuat, widget tampil solid, jernih, dan tenang (bebas distraksi).
 */
export const ShimmerWidget: React.FC<ShimmerWidgetProps> = ({
  children,
  isLoading = false,
  loadingFallback,
  className = "",
  ...rest
}) => {
  if (isLoading) {
    if (loadingFallback) {
      return <div className={className} {...rest}>{loadingFallback}</div>;
    }

    return (
      <div
        className={`p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4 ${className}`}
        {...rest}
      >
        <div className="flex items-center justify-between">
          <ShimmerSkeleton className="w-36 h-5 rounded-lg" />
          <ShimmerSkeleton className="w-20 h-5 rounded-full" />
        </div>
        <ShimmerSkeleton className="w-3/4 h-7 rounded-xl" />
        <div className="grid grid-cols-3 gap-3 pt-2">
          <ShimmerSkeleton className="h-20 rounded-2xl" />
          <ShimmerSkeleton className="h-20 rounded-2xl" />
          <ShimmerSkeleton className="h-20 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className={`transition-all duration-200 ${className}`} {...rest}>
      {children}
    </div>
  );
};
