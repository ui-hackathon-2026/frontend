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

function extractErrorMessage(status: number, errorData: unknown, endpoint: string): string {
  if (typeof errorData === "object" && errorData !== null) {
    const record = errorData as Record<string, unknown>;
    if (typeof record.detail === "string") {
      if (record.detail === "invalid credentials") return "Email atau password salah. Silakan periksa kembali.";
      if (record.detail === "email already registered") return "Email sudah terdaftar. Silakan masuk atau gunakan email lain.";
      if (record.detail === "invalid refresh token") return "Sesi telah berakhir. Silakan masuk kembali.";
      return record.detail;
    }
    if (Array.isArray(record.detail) && record.detail.length > 0) {
      const first = record.detail[0];
      if (typeof first === "object" && first !== null && "msg" in first) {
        return String(first.msg);
      }
    }
    if (typeof record.message === "string") return record.message;
  }
  return `Permintaan ke ${endpoint} gagal (Status: ${status})`;
}

export interface ApiClientConfig {
  baseUrl?: string;
  timeoutMs?: number;
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

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    if (typeof window !== "undefined") {
      try {
        const token = localStorage.getItem("ps_access_token");
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
      } catch {
        // ignore localStorage errors in non-browser environments
      }
    }
    return headers;
  }

  async post<TReq, TRes>(endpoint: string, body: TReq): Promise<TRes> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeaders(),
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
        const friendlyMsg = extractErrorMessage(response.status, errorData, endpoint);
        throw new ApiError(friendlyMsg, response.status, errorData);
      }

      return (await response.json()) as TRes;
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof ApiError) throw err;
      if (err instanceof Error && err.name === "AbortError") {
        throw new ApiError(`Koneksi ke backend timed out (${this.timeoutMs / 1000}s)`, 408);
      }
      throw new ApiError(
        err instanceof Error ? err.message : "Terjadi kesalahan jaringan",
        500,
        err
      );
    }
  }

  async put<TReq, TRes>(endpoint: string, body: TReq): Promise<TRes> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeaders(),
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
        const friendlyMsg = extractErrorMessage(response.status, errorData, endpoint);
        throw new ApiError(friendlyMsg, response.status, errorData);
      }

      return (await response.json()) as TRes;
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof ApiError) throw err;
      if (err instanceof Error && err.name === "AbortError") {
        throw new ApiError(`Koneksi ke backend timed out (${this.timeoutMs / 1000}s)`, 408);
      }
      throw new ApiError(
        err instanceof Error ? err.message : "Terjadi kesalahan jaringan",
        500,
        err
      );
    }
  }

  async delete(endpoint: string): Promise<void> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "DELETE",
        headers: {
          ...this.getAuthHeaders(),
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok && response.status !== 204) {
        let errorData: unknown;
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text();
        }
        const friendlyMsg = extractErrorMessage(response.status, errorData, endpoint);
        throw new ApiError(friendlyMsg, response.status, errorData);
      }
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof ApiError) throw err;
      if (err instanceof Error && err.name === "AbortError") {
        throw new ApiError(`Koneksi ke backend timed out (${this.timeoutMs / 1000}s)`, 408);
      }
      throw new ApiError(
        err instanceof Error ? err.message : "Terjadi kesalahan jaringan",
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
          ...this.getAuthHeaders(),
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
        const friendlyMsg = extractErrorMessage(response.status, errorData, endpoint);
        throw new ApiError(friendlyMsg, response.status, errorData);
      }

      return (await response.json()) as TRes;
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof ApiError) throw err;
      if (err instanceof Error && err.name === "AbortError") {
        throw new ApiError(`Koneksi ke backend timed out (${this.timeoutMs / 1000}s)`, 408);
      }
      throw new ApiError(
        err instanceof Error ? err.message : "Terjadi kesalahan jaringan",
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
        const friendlyMsg = extractErrorMessage(response.status, errorData, endpoint);
        throw new ApiError(friendlyMsg, response.status, errorData);
      }

      return (await response.json()) as TRes;
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof ApiError) throw err;
      if (err instanceof Error && err.name === "AbortError") {
        throw new ApiError(`Koneksi ke backend timed out (${this.timeoutMs / 1000}s)`, 408);
      }
      throw new ApiError(
        err instanceof Error ? err.message : "Terjadi kesalahan jaringan",
        500,
        err
      );
    }
  }
}
