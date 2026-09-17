"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FlaskConical, Eye, EyeOff, AlertCircle, ArrowRight, Info } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// Inner component uses useSearchParams — must be wrapped in Suspense
function LoginForm() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email, password });
      router.replace(redirectTo);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = email.trim() !== "" && password.length >= 6;

  return (
    <div className="w-full max-w-sm space-y-8">
      {/* Heading */}
      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold text-[#0a192f] tracking-tight font-heading">
          Masuk ke akun
        </h2>
        <p className="text-sm text-slate-500">
          Belum punya akun?{" "}
          <Link href="/register" className="text-[#001299] font-semibold hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </div>

      {/* Dev credentials hint */}
      {isDev && (
        <div className="flex items-start space-x-2 p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-800">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
          <span>
            <strong>Demo:</strong> demo@paragon.co.id / paragon2026
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start space-x-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Email
          </label>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null); }}
            placeholder="name@paragon.co.id"
            className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#001299]/20 focus:border-[#001299] transition-all"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null); }}
              placeholder="Min. 6 karakter"
              className="w-full text-sm px-4 py-2.5 pr-10 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#001299]/20 focus:border-[#001299] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-semibold text-sm bg-[#001299] hover:bg-[#000e7a] text-white shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Memverifikasi...</span>
            </>
          ) : (
            <>
              <span>Masuk</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#fafbfc] flex font-sans">
      {/* Left branding panel — hidden on mobile */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[#0a192f] px-12 py-10">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-2.5 group w-fit">
          <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <FlaskConical className="w-4 h-4 text-blue-300" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-white font-heading">
            Paragon Studio
          </span>
        </Link>

        {/* Center copy */}
        <div className="space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold text-white tracking-tight font-heading leading-tight">
              Platform Formulasi<br />AI-Driven Terdepan.
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Rancang, optimasi, dan validasi formula kosmetik berbasis data ilmiah dan standar BPOM–Halal.
            </p>
          </div>

          <ul className="space-y-3">
            {[
              "Simulasi kestabilan emulsi 40°C in-silico",
              "Pareto optimizer 50.000 trial NSGA-II",
              "Regulatory Sentinel BPOM & Halal otomatis",
            ].map((item) => (
              <li key={item} className="flex items-start space-x-2.5 text-sm text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <p className="text-xs text-slate-600">
          © 2026 PT Paragon Technology and Innovation
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile brand */}
        <div className="lg:hidden mb-8 flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0a192f] text-white flex items-center justify-center">
            <FlaskConical className="w-4 h-4 text-blue-300" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-[#0a192f] font-heading">
            Paragon Studio
          </span>
        </div>

        <Suspense fallback={
          <div className="w-full max-w-sm space-y-4 animate-pulse">
            <div className="h-8 bg-slate-100 rounded-xl w-48" />
            <div className="h-4 bg-slate-100 rounded-lg w-64" />
            <div className="h-11 bg-slate-100 rounded-xl" />
            <div className="h-11 bg-slate-100 rounded-xl" />
            <div className="h-12 bg-slate-200 rounded-xl" />
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
