"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  Menu,
  X,
  FlaskConical,
  Sliders,
  Bot,
  Zap,
  ShieldCheck,
  FileSpreadsheet,
  Box,
  LogOut,
  LogIn,
} from "lucide-react";
import { MegaMenu } from "./MegaMenu";
import { useAuth } from "@/hooks/useAuth";

interface NavbarProps {
  brandName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ brandName = "Paragon Studio" }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const avatarRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, logout } = useAuth();

  const toggleMenu = (name: string) => {
    setActiveMenu(activeMenu === name ? null : name);
  };

  // Close avatar dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    setAvatarDropdownOpen(false);
    await logout();
    router.push("/login");
  };

  const navFeatures = [
    { label: "Project Brief Studio", href: "/project-brief", icon: Bot },
    { label: "Formulation Canvas", href: "/workbench", icon: Sliders },
    { label: "Pareto Optimizer", href: "/optimizer", icon: Zap },
    { label: "Regulatory Sentinel", href: "/compliance", icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-shadow font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#0a192f] text-white flex items-center justify-center shadow-sm group-hover:bg-[#0018a8] transition-colors">
                <FlaskConical className="w-4 h-4 text-blue-200" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-[#0a192f] font-heading">
                  {brandName}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 pl-2">
              {/* All Features Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveMenu("features")}
              >
                <button
                  type="button"
                  onClick={() => toggleMenu("features")}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    activeMenu === "features"
                      ? "bg-slate-100 text-[#0018a8]"
                      : "text-slate-800 hover:text-[#0018a8] hover:bg-slate-50"
                  }`}
                >
                  <span>Modul Formulasi</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeMenu === "features" ? "rotate-180 text-[#0018a8]" : "text-slate-400"
                    }`}
                  />
                </button>
              </div>

              {/* Direct Quick Links to Top Features */}
              {navFeatures.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-[#0018a8] font-semibold border border-blue-200/60"
                        : "text-slate-700 hover:text-[#0018a8] hover:bg-slate-50"
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center space-x-3">
            {isAuthenticated && user ? (
              /* Avatar Dropdown */
              <div className="relative" ref={avatarRef}>
                <button
                  type="button"
                  onClick={() => setAvatarDropdownOpen((v) => !v)}
                  className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-[#001299] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {user.avatarInitials}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 text-slate-400 transition-transform ${avatarDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {avatarDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-slate-200 shadow-lg py-2 animate-in fade-in slide-in-from-top-1 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Keluar</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Login Button */
              <Link
                href="/login"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-semibold text-[#001299] border border-[#001299]/30 hover:bg-blue-50 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk</span>
              </Link>
            )}

            <Link
              href="/workbench"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#001299] text-white hover:bg-[#000e7a] shadow-xs transition-all"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Buka Canvas</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="lg:hidden flex items-center space-x-2">
            {isAuthenticated && user && (
              <div className="w-7 h-7 rounded-full bg-[#001299] text-white flex items-center justify-center text-xs font-bold shrink-0">
                {user.avatarInitials}
              </div>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Mega Menu Dropdown */}
      <MegaMenu
        isOpen={activeMenu === "features"}
        onClose={() => setActiveMenu(null)}
      />

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top-2">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3">
              Modul Formulasi &amp; Komputasi
            </span>
            <div className="space-y-1 pt-1">
              <Link
                href="/project-brief"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm text-slate-800 hover:bg-slate-50"
              >
                <Bot className="w-4 h-4 text-blue-600" />
                <span>Project Brief Studio</span>
              </Link>
              <Link
                href="/workbench"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm text-slate-800 hover:bg-slate-50"
              >
                <Sliders className="w-4 h-4 text-amber-600" />
                <span>Formulation Canvas</span>
              </Link>
              <Link
                href="/optimizer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm text-slate-800 hover:bg-slate-50"
              >
                <Zap className="w-4 h-4 text-indigo-600" />
                <span>Pareto Multi-Objective Optimizer</span>
              </Link>
              <Link
                href="/compliance"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm text-slate-800 hover:bg-slate-50"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Regulatory &amp; Halal Sentinel</span>
              </Link>
              <Link
                href="/batch-sheet"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm text-slate-800 hover:bg-slate-50"
              >
                <FileSpreadsheet className="w-4 h-4 text-sky-600" />
                <span>Master Batch Record &amp; SOP</span>
              </Link>
              <Link
                href="/molecular-inspector"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm text-slate-800 hover:bg-slate-50"
              >
                <Box className="w-4 h-4 text-purple-600" />
                <span>3D Molecular Inspector</span>
              </Link>
            </div>
          </div>

          {/* Mobile auth */}
          <div className="border-t border-slate-100 pt-3">
            {isAuthenticated && user ? (
              <div className="space-y-1">
                <div className="px-3 py-2">
                  <p className="text-xs font-bold text-slate-900">{user.name}</p>
                  <p className="text-[11px] text-slate-500">{user.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm text-[#001299] font-semibold hover:bg-blue-50 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk ke akun</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

