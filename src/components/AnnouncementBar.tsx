"use client";

import React from "react";
import Link from "next/link";
import { ChevronDown, Globe } from "lucide-react";

interface AnnouncementBarProps {
  message?: string;
  linkText?: string;
  linkHref?: string;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  message = "Get free access to the latest scientific models at Benchling.ai",
  linkText = "Try now",
  linkHref = "#",
}) => {
  return (
    <div className="w-full bg-[#dce9fe] text-[#0a192f] text-xs sm:text-sm font-medium border-b border-[#cbdffc] py-2 px-4 sm:px-8 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left / Center announcement */}
        <div className="flex items-center space-x-2 truncate">
          <span className="truncate">{message}</span>
          <a
            href={linkHref}
            className="underline underline-offset-4 decoration-[#0a192f]/60 hover:decoration-[#0a192f] font-semibold text-[#0a192f] whitespace-nowrap transition-colors"
          >
            {linkText}
          </a>
        </div>

        {/* Right utilities: Login & Language Selector */}
        <div className="hidden sm:flex items-center space-x-6 text-[#0a192f]/90 text-xs font-medium shrink-0 ml-4">
          <Link
            href="/login"
            className="hover:text-[#0018a8] transition-colors"
          >
            Login
          </Link>
          <button
            type="button"
            className="flex items-center space-x-1.5 hover:text-[#0018a8] transition-colors focus:outline-none"
          >
            <span>English</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#0a192f]/70" />
          </button>
        </div>
      </div>
    </div>
  );
};
