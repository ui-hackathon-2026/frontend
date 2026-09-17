"use client";

import React, { useState } from "react";
import { ChevronDown, Menu, X, FlaskConical } from "lucide-react";
import { MegaMenu } from "./MegaMenu";

interface NavbarProps {
  brandName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ brandName = "Benchling" }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = (name: string) => {
    setActiveMenu(activeMenu === name ? null : name);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex items-center space-x-8">
            <a href="#" className="flex items-center space-x-2.5 group">
              {/* Benchling-inspired scientific icon */}
              <div className="w-8 h-8 rounded-lg bg-[#0a192f] text-white flex items-center justify-center shadow-sm group-hover:bg-[#0018a8] transition-colors">
                <FlaskConical className="w-5 h-5 text-blue-200" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-[#0a192f]">
                  {brandName}
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 pl-4">
              {/* Products link with dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveMenu("products")}
              >
                <button
                  type="button"
                  onClick={() => toggleMenu("products")}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeMenu === "products"
                      ? "bg-slate-100/80 text-[#0018a8]"
                      : "text-slate-800 hover:text-[#0018a8] hover:bg-slate-50"
                  }`}
                >
                  <span>Products</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeMenu === "products" ? "rotate-180 text-[#0018a8]" : "text-slate-400"
                    }`}
                  />
                </button>
              </div>

              {/* AI Link */}
              <button
                type="button"
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-sm font-medium text-slate-800 hover:text-[#0018a8] hover:bg-slate-50 transition-colors"
              >
                <span>AI</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Solutions */}
              <button
                type="button"
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-sm font-medium text-slate-800 hover:text-[#0018a8] hover:bg-slate-50 transition-colors"
              >
                <span>Solutions</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Customers */}
              <a
                href="#customers"
                className="px-3.5 py-2 rounded-full text-sm font-medium text-slate-800 hover:text-[#0018a8] hover:bg-slate-50 transition-colors"
              >
                Customers
              </a>

              {/* Resources */}
              <button
                type="button"
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-sm font-medium text-slate-800 hover:text-[#0018a8] hover:bg-slate-50 transition-colors"
              >
                <span>Resources</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Company */}
              <button
                type="button"
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-sm font-medium text-slate-800 hover:text-[#0018a8] hover:bg-slate-50 transition-colors"
              >
                <span>Company</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </nav>
          </div>

          {/* Desktop Right CTAs (Exact Benchling Style) */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Neutral pill button */}
            <a
              href="#signup"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-medium bg-[#f1f3f5] text-[#1e293b] hover:bg-[#e4e7eb] transition-all shadow-2xs"
            >
              Sign up
            </a>

            {/* Deep Royal Navy pill button */}
            <a
              href="#demo"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-semibold bg-[#001299] text-white hover:bg-[#000e7a] active:bg-[#000a5c] transition-all shadow-sm"
            >
              Request a demo
            </a>
          </div>

          {/* Mobile hamburger toggle */}
          <div className="flex sm:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MegaMenu dropdown */}
      <MegaMenu
        isOpen={activeMenu === "products"}
        onClose={() => setActiveMenu(null)}
      />

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2 text-sm font-medium">
            <a href="#products" className="px-3 py-2 rounded-lg hover:bg-slate-50">Products</a>
            <a href="#ai" className="px-3 py-2 rounded-lg hover:bg-slate-50">AI</a>
            <a href="#solutions" className="px-3 py-2 rounded-lg hover:bg-slate-50">Solutions</a>
            <a href="#customers" className="px-3 py-2 rounded-lg hover:bg-slate-50">Customers</a>
            <a href="#resources" className="px-3 py-2 rounded-lg hover:bg-slate-50">Resources</a>
          </div>
          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2.5">
            <a href="#signup" className="w-full text-center py-2.5 rounded-full text-sm font-medium bg-[#f1f3f5] text-[#1e293b]">
              Sign up
            </a>
            <a href="#demo" className="w-full text-center py-2.5 rounded-full text-sm font-medium bg-[#001299] text-white">
              Request a demo
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
