/**
 * Base API Client with standardized error handling and timeout
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ApiClientConfig {
  baseUrl: string;
  timeoutMs?: number;
}

export function authHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("ps_access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export class ApiClient {
  private baseUrl: string;
  private timeoutMs: number;

  constructor(config?: ApiClientConfig) {
    this.baseUrl =
      config?.baseUrl ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "http://localhost:8000";
    this.timeoutMs = config?.timeoutMs || 15000;
  }

  async post<TReq, TRes>(endpoint: string, body: TReq): Promise<TRes> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData: unknown;
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text();
        }
        throw new ApiError(
          `Request to ${endpoint} failed with status ${response.status}`,
          response.status,
          errorData
        );
      }

      return (await response.json()) as TRes;
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof ApiError) throw err;
      if (err instanceof Error && err.name === "AbortError") {
        throw new ApiError(`Request to ${endpoint} timed out`, 408);
      }
      throw new ApiError(
        err instanceof Error ? err.message : "Network error",
        500,
        err
      );
    }
  }

  async get<TRes>(endpoint: string): Promise<TRes> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...authHeader(),
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData: unknown;
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text();
        }
        throw new ApiError(
          `Request to ${endpoint} failed with status ${response.status}`,
          response.status,
          errorData
        );
      }

      return (await response.json()) as TRes;
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        err instanceof Error ? err.message : "Network error",
        500,
        err
      );
    }
  }

  async getWithAuth<TRes>(endpoint: string, accessToken: string): Promise<TRes> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData: unknown;
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text();
        }
        throw new ApiError(
          `Request to ${endpoint} failed with status ${response.status}`,
          response.status,
          errorData
        );
      }

      return (await response.json()) as TRes;
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        err instanceof Error ? err.message : "Network error",
        500,
        err
      );
    }
  }
}
