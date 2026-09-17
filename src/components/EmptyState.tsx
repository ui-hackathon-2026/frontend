"use client";

import React from "react";
import Image from "next/image";

interface EmptyStateProps {
  title?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  compact?: boolean;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Belum Ada Konten",
  description = "Tidak ada data untuk ditampilkan saat ini. Coba ubah filter atau tambahkan data baru.",
  imageSrc = "/images/landing/No%20Content.png",
  imageAlt = "Tidak ada konten",
  compact = false,
  action,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center bg-white border border-slate-200/80 rounded-2xl shadow-xs ${
        compact ? "p-6 space-y-3" : "p-8 sm:p-10 space-y-4"
      } ${className}`}
    >
      <div className={`relative ${compact ? "w-32 h-28" : "w-48 h-40 sm:w-56 sm:h-48"}`}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 192px, 224px"
          className="object-contain"
          priority={false}
        />
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className={`${compact ? "text-sm" : "text-base"} font-bold text-[#0a192f] font-heading`}>
          {title}
        </h4>
        <p className={`${compact ? "text-[11px]" : "text-xs sm:text-sm"} text-slate-500 leading-relaxed`}>
          {description}
        </p>
      </div>
      {action && <div className="pt-1">{action}</div>}
    </div>
  );
};

export default EmptyState;
