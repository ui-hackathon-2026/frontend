import { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import { AuthSession, AuthTokens, AuthUser, LoginPayload } from "@/domain/models/auth";
import { ApiClient } from "@/data/api/api-client";

export class HttpAuthRepository implements IAuthRepository {
  private client: ApiClient;

  constructor() {
    this.client = new ApiClient();
  }

  async login(payload: LoginPayload): Promise<AuthSession> {
    return this.client.post<LoginPayload, AuthSession>("/api/v1/auth/login", payload);
  }

  async register(payload: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthSession> {
    return this.client.post<typeof payload, AuthSession>("/api/v1/auth/register", payload);
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    return this.client.post<{ refreshToken: string }, AuthTokens>("/api/v1/auth/refresh", {
      refreshToken,
    });
  }

  async logout(refreshToken: string): Promise<void> {
    await this.client.post<{ refreshToken: string }, void>("/api/v1/auth/logout", {
      refreshToken,
    });
  }

  async getMe(accessToken: string): Promise<AuthUser> {
    return this.client.getWithAuth<AuthUser>("/api/v1/auth/me", accessToken);
  }
}
