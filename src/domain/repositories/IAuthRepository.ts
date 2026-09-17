import { AuthSession, AuthTokens, AuthUser, LoginPayload } from "@/domain/models/auth";

export interface IAuthRepository {
  login(payload: LoginPayload): Promise<AuthSession>;
  register(payload: { name: string; email: string; password: string }): Promise<AuthSession>;
  refreshToken(refreshToken: string): Promise<AuthTokens>;
  logout(refreshToken: string): Promise<void>;
  getMe(accessToken: string): Promise<AuthUser>;
}
