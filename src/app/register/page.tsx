"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FlaskConical,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Sparkles,
  Layers,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

function PasswordRule({ met, label }: { met: boolean; label: string }) {
  return (
    <li className={`flex items-center space-x-1.5 text-xs ${met ? "text-emerald-600" : "text-slate-400"}`}>
      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${met ? "text-emerald-500" : "text-slate-300"}`} />
      <span>{label}</span>
    </li>
  );
}

export default function RegisterPage() {
  const { register, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router]);

  const rules = {
    length: password.length >= 6,
    match: confirm.length > 0 && password === confirm,
  };

  const isFormValid =
    name.trim() !== "" &&
    email.trim() !== "" &&
    rules.length &&
    rules.match;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setError(null);
    setIsSubmitting(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        confirmPassword: confirm,
      });
      router.replace("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Pendaftaran gagal. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] flex font-sans">
      {/* Left branding panel - hidden on mobile */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[#0a192f] px-12 py-10">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-2.5 group w-fit">
          <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <FlaskConical className="w-4 h-4 text-blue-300" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-white font-heading">
            CoRamu
          </span>
        </Link>

        {/* Center copy */}
        <div className="space-y-8">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Akses Penuh Studio Formulasi R&D</span>
            </span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight font-heading leading-tight">
              Mulai Eksplorasi Formula<br />Berbasis AI &amp; Sains Komputasi.
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Bergabunglah dengan ekosistem formulator kosmetik cerdas: kelola chassis emulsi, jalankan simulasi stres iklim 40°C, dan validasi kepatuhan BPOM-Halal otomatis.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 text-sm text-slate-300">
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white block text-xs">Cloud Drafts &amp; Auto-Rebalance</strong>
                <span className="text-xs text-slate-400">Komposisi 4-fase tersimpan di Neon Postgres dengan audit snapshot log.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm text-slate-300">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white block text-xs">Simulasi Tropis In-Silico</strong>
                <span className="text-xs text-slate-400">Prediksi stabilitas emulsi 90 hari pada suhu 40°C &amp; 75% RH.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm text-slate-300">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white block text-xs">Audit BPOM &amp; Halal Sentinel</strong>
                <span className="text-xs text-slate-400">Pemeriksaan otomatis batas konsentrasi aman dan kalkulator TKDN lokal.</span>
              </div>
            </div>
          </div>
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
            CoRamu
          </span>
        </div>

        <div className="w-full max-w-sm space-y-8">
          {/* Heading */}
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-[#0a192f] tracking-tight font-heading">
              Buat akun baru
            </h2>
            <p className="text-sm text-slate-500">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="text-[#001299] font-semibold hover:underline"
              >
                Masuk
              </Link>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start space-x-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Nama Lengkap
              </label>
              <input
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                placeholder="Andi Wibowo"
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#001299]/20 focus:border-[#001299] transition-all"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
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
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="Min. 6 karakter"
                  className="w-full text-sm px-4 py-2.5 pr-10 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#001299]/20 focus:border-[#001299] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password rules */}
              {password.length > 0 && (
                <ul className="space-y-1 pt-1">
                  <PasswordRule met={rules.length} label="Minimal 6 karakter" />
                </ul>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type={showCf ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value);
                    setError(null);
                  }}
                  placeholder="Ulangi password"
                  className={`w-full text-sm px-4 py-2.5 pr-10 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-[#001299]/20 focus:border-[#001299] ${
                    confirm.length > 0 && !rules.match
                      ? "border-rose-300 bg-rose-50/50"
                      : "border-slate-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCf((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  tabIndex={-1}
                >
                  {showCf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirm.length > 0 && !rules.match && (
                <p className="text-xs text-rose-600">Password tidak cocok</p>
              )}
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
                  <span>Membuat akun...</span>
                </>
              ) : (
                <>
                  <span>Daftar Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <Link
            href="/login"
            className="flex items-center justify-center space-x-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke halaman masuk</span>
          </Link>
        </div>
      </div>
    </div>
  );
}