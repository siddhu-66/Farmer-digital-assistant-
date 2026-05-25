/**
 * Central API helpers — all requests go to the Express backend.
 */
import { apiClient } from "@/lib/apiClient";
import { getBackendOrigin, getPublicApiBase } from "@/lib/getPublicApiBase";

export { getBackendOrigin, getPublicApiBase };

export type ApiResult<T> = {
  data: T | null;
  error: string | null;
  ok: boolean;
};

async function wrap<T>(promise: Promise<T>): Promise<ApiResult<T>> {
  try {
    const data = await promise;
    const record = data as Record<string, unknown> | null;
    if (record && record.success === false) {
      return {
        data: null,
        error: String(record.message || "Request failed"),
        ok: false,
      };
    }
    return { data, error: null, ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Request failed";
    return { data: null, error: message, ok: false };
  }
}

export const api = {
  get: <T = unknown>(endpoint: string) => wrap(apiClient.get<T>(endpoint)),
  post: <T = unknown>(endpoint: string, body?: unknown) =>
    wrap(apiClient.post<T>(endpoint, body)),
  put: <T = unknown>(endpoint: string, body?: unknown) =>
    wrap(apiClient.put<T>(endpoint, body)),
  patch: <T = unknown>(endpoint: string, body?: unknown) =>
    wrap(apiClient.patch<T>(endpoint, body)),
  delete: <T = unknown>(endpoint: string) => wrap(apiClient.delete<T>(endpoint)),
};

/** Health check against Express backend */
export async function checkBackendHealth(): Promise<{
  ok: boolean;
  message: string;
  raw?: unknown;
}> {
  const url = `${getPublicApiBase()}/health`;
  try {
    const res = await fetch(url, { credentials: "include" });
    const raw = await res.json().catch(() => ({}));
    const record = raw as Record<string, unknown>;
    const ok =
      res.ok &&
      (record.success === true || record.status === "OK");
    return {
      ok,
      message: String(
        record.message ||
          (ok ? "Backend connected" : record.status || res.statusText)
      ),
      raw,
    };
  } catch (err) {
    return {
      ok: false,
      message:
        err instanceof Error
          ? err.message
          : `Cannot reach backend at ${url}`,
    };
  }
}

export { apiClient };
