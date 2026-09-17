"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { AuthUser, AuthTokens, LoginPayload, RegisterPayload } from "@/domain/models/auth";
import { getAuthRepository } from "@/data/di/container";

// ─── Storage keys ────────────────────────────────────────────────────────────
const KEY_ACCESS  = "ps_access_token";
const KEY_REFRESH = "ps_refresh_token";
const KEY_USER    = "ps_user";
const KEY_EXPIRES = "ps_token_expires_at"; // unix ms

// ─── Context shape ────────────────────────────────────────────────────────────
interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Helpers ─────────────────────────────────────────────────────────────────
function readStorage() {
  if (typeof window === "undefined") return null;
  try {
    const user = localStorage.getItem(KEY_USER);
    const access = localStorage.getItem(KEY_ACCESS);
    const refresh = localStorage.getItem(KEY_REFRESH);
    const expiresAt = Number(localStorage.getItem(KEY_EXPIRES) ?? "0");
    if (!user || !access || !refresh) return null;
    if (Date.now() > expiresAt) return null; // expired
    return { user: JSON.parse(user) as AuthUser, access, refresh, expiresAt };
  } catch {
    return null;
  }
}

function writeStorage(user: AuthUser, tokens: AuthTokens) {
  const expiresAt = Date.now() + tokens.expiresIn * 1000;
  localStorage.setItem(KEY_USER, JSON.stringify(user));
  localStorage.setItem(KEY_ACCESS, tokens.accessToken);
  localStorage.setItem(KEY_REFRESH, tokens.refreshToken);
  localStorage.setItem(KEY_EXPIRES, String(expiresAt));
}

function clearStorage() {
  [KEY_USER, KEY_ACCESS, KEY_REFRESH, KEY_EXPIRES, "ps_editor_active_formula_id"].forEach((k) =>
    localStorage.removeItem(k)
  );
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("ps_editor_active_formula_id")) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleRefresh = useCallback((expiresAt: number, refreshToken: string) => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    const msUntilRefresh = expiresAt - Date.now() - 60_000; // 1 min before expiry
    if (msUntilRefresh <= 0) return;

    refreshTimerRef.current = setTimeout(async () => {
      try {
        const repo = getAuthRepository();
        const tokens = await repo.refreshToken(refreshToken);
        const stored = readStorage();
        if (stored) {
          writeStorage(stored.user, tokens);
          scheduleRefresh(Date.now() + tokens.expiresIn * 1000, tokens.refreshToken);
        }
      } catch {
        // refresh failed — silent, user will be redirected on next protected route visit
        clearStorage();
        setUser(null);
      }
    }, msUntilRefresh);
  }, []);

  // Restore session on mount
  useEffect(() => {
    const stored = readStorage();
    if (stored) {
      setUser(stored.user);
      scheduleRefresh(stored.expiresAt, stored.refresh);
    }
    setIsLoading(false);

    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, [scheduleRefresh]);

  const login = useCallback(async (payload: LoginPayload) => {
    const repo = getAuthRepository();
    const session = await repo.login(payload);
    writeStorage(session.user, session.tokens);
    setUser(session.user);
    scheduleRefresh(
      Date.now() + session.tokens.expiresIn * 1000,
      session.tokens.refreshToken
    );
  }, [scheduleRefresh]);

  const register = useCallback(async (payload: RegisterPayload) => {
    const { confirmPassword: _, ...serverPayload } = payload;
    void _; // not sent to server
    const repo = getAuthRepository();
    const session = await repo.register(serverPayload);
    writeStorage(session.user, session.tokens);
    setUser(session.user);
    scheduleRefresh(
      Date.now() + session.tokens.expiresIn * 1000,
      session.tokens.refreshToken
    );
  }, [scheduleRefresh]);

  const logout = useCallback(async () => {
    const refresh = localStorage.getItem(KEY_REFRESH) ?? "";
    try {
      const repo = getAuthRepository();
      await repo.logout(refresh);
    } catch {
      // best-effort
    } finally {
      clearStorage();
      setUser(null);
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    }
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
