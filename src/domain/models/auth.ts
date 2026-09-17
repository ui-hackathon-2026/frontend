// Domain models for authentication

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "formulator" | "manager" | "admin";
  avatarInitials: string; // e.g. "AW" from "Andi Wibowo"
}

export interface AuthTokens {
  accessToken: string;  // JWT, short-lived (15 min)
  refreshToken: string; // JWT or opaque, long-lived (7 days)
  expiresIn: number;    // seconds until accessToken expires
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string; // client-side validation only — not sent to server
}

export interface AuthSession {
  user: AuthUser;
  tokens: AuthTokens;
}
