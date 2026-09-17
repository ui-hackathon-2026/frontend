import { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import { AuthSession, AuthTokens, AuthUser, LoginPayload } from "@/domain/models/auth";

// Demo credentials for mock environment
const DEMO_USER: AuthUser = {
  id: "usr_demo_001",
  name: "Andi Wibowo",
  email: "demo@paragon.co.id",
  role: "formulator",
  avatarInitials: "AW",
};

const DEMO_PASSWORD = "paragon2026";

function makeFakeJwt(payload: object): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify({ ...payload, iat: Date.now(), exp: Date.now() + 900_000 }));
  return `${header}.${body}.mock_signature`;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockAuthRepository implements IAuthRepository {
  private registeredEmails: Set<string> = new Set(["demo@paragon.co.id"]);

  async login(payload: LoginPayload): Promise<AuthSession> {
    await delay(700);

    if (
      payload.email !== DEMO_USER.email ||
      payload.password !== DEMO_PASSWORD
    ) {
      throw new Error("Email atau password salah. Coba: demo@paragon.co.id / paragon2026");
    }

    return {
      user: DEMO_USER,
      tokens: {
        accessToken: makeFakeJwt({ sub: DEMO_USER.id, email: DEMO_USER.email }),
        refreshToken: makeFakeJwt({ sub: DEMO_USER.id, type: "refresh" }),
        expiresIn: 900, // 15 minutes
      },
    };
  }

  async register(payload: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthSession> {
    await delay(800);

    if (this.registeredEmails.has(payload.email.toLowerCase())) {
      throw new Error("Email ini sudah terdaftar. Silakan masuk atau gunakan email lain.");
    }

    const initials = payload.name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("");

    const newUser: AuthUser = {
      id: `usr_${Date.now()}`,
      name: payload.name,
      email: payload.email.toLowerCase(),
      role: "formulator",
      avatarInitials: initials || payload.email[0].toUpperCase(),
    };

    this.registeredEmails.add(newUser.email);

    return {
      user: newUser,
      tokens: {
        accessToken: makeFakeJwt({ sub: newUser.id, email: newUser.email }),
        refreshToken: makeFakeJwt({ sub: newUser.id, type: "refresh" }),
        expiresIn: 900,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    await delay(300);
    if (!refreshToken) throw new Error("Refresh token tidak valid.");
    return {
      accessToken: makeFakeJwt({ sub: "usr_demo_001", refreshed: true }),
      refreshToken,
      expiresIn: 900,
    };
  }

  async logout(_refreshToken: string): Promise<void> {
    await delay(200);
    // Mock: nothing to invalidate server-side
  }

  async getMe(accessToken: string): Promise<AuthUser> {
    await delay(200);
    if (!accessToken) throw new Error("Unauthorized");
    return DEMO_USER;
  }
}
