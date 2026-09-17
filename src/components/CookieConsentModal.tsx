"use client";

import React, { useState } from "react";
import { Settings2, Languages, X } from "lucide-react";

interface CookieConsentModalProps {
  onAccept?: () => void;
  onReject?: () => void;
  forceOpen?: boolean;
}

export const CookieConsentModal: React.FC<CookieConsentModalProps> = ({
  onAccept,
  onReject,
  forceOpen = true,
}) => {
  const [isVisible, setIsVisible] = useState(forceOpen);

  if (!isVisible) return null;

  const handleAccept = () => {
    setIsVisible(false);
    if (onAccept) onAccept();
  };

  const handleReject = () => {
    setIsVisible(false);
    if (onReject) onReject();
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4 animate-in fade-in slide-in-from-bottom-6 duration-300">
      <div className="glass-modal rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 border border-white/80 shadow-2xl backdrop-blur-2xl transition-all">
        {/* Top Content Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Text Left Column */}
          <div className="md:col-span-8 space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0a192f]">
              We use cookies
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-xl">
              By clicking &ldquo;Accept all&rdquo;, you agree to the storing of cookies on your
              device for functional, analytics, and advertising purposes.
            </p>
          </div>

          {/* Buttons Right Column */}
          <div className="md:col-span-4 flex items-center justify-start md:justify-end space-x-3">
            <button
              type="button"
              onClick={handleAccept}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-semibold border-2 border-[#0018a8] text-[#0018a8] hover:bg-[#0018a8] hover:text-white transition-all shadow-xs focus:ring-2 focus:ring-[#0018a8]/30"
            >
              Accept all
            </button>
            <button
              type="button"
              onClick={handleReject}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-semibold border-2 border-[#0018a8] text-[#0018a8] hover:bg-[#0018a8]/10 transition-all shadow-xs focus:ring-2 focus:ring-[#0018a8]/30"
            >
              Reject all
            </button>
          </div>
        </div>

        {/* Bottom Utility Row */}
        <div className="mt-6 pt-4 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center space-x-6">
            <button
              type="button"
              className="flex items-center space-x-1.5 hover:text-[#0018a8] transition-colors"
            >
              <Settings2 className="w-3.5 h-3.5 text-slate-500" />
              <span>More choices</span>
            </button>
            <a
              href="#privacy-policy"
              className="hover:text-[#0018a8] transition-colors hover:underline"
            >
              See our privacy policy
            </a>
          </div>

          <div className="flex items-center space-x-2 text-slate-500">
            <Languages className="w-4 h-4 text-slate-600" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              ID / EN
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
