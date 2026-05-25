"use client";

import { getAuthHeaders } from "@/lib/authHeaders";
import { getPublicApiBase } from "@/lib/getPublicApiBase";

const BASE_URL = getPublicApiBase();

type ApiResponse = {
  success?: boolean;
  message?: string;
  httpStatus?: number;
  [key: string]: unknown;
};

async function tryRefresh(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: getAuthHeaders(),
    });

    return response.ok;
  } catch {
    return false;
  }
}

export class ApiClient {
  private async request<T>(
    endpoint: string,
    init: RequestInit,
    retried = false
  ): Promise<T> {
    const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
    try {
      const response = await fetch(url, {
        ...init,
        credentials: "include",
        headers: {
          ...getAuthHeaders(),
          ...(init.headers || {}),
        },
      });

      if (
        response.status === 401 &&
        !retried &&
        !endpoint.includes("/auth/refresh") &&
        !endpoint.includes("/auth/login") &&
        !endpoint.includes("/auth/register")
      ) {
        const refreshed = await tryRefresh();
        if (refreshed) {
          return this.request<T>(endpoint, init, true);
        }
      }

      const text = await response.text();

      let data: ApiResponse = {};
      try {
        data = text ? (JSON.parse(text) as ApiResponse) : {};
      } catch {
        data = {
          success: false,
          message: text || "Invalid JSON from server",
        };
      }

      if (!response.ok) {
        return {
          success: false,
          message: data.message || `HTTP ${response.status} ${response.statusText}`,
          httpStatus: response.status,
          ...data,
        } as T;
      }

      return data as T;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      if (process.env.NODE_ENV === "development") {
        console.warn(`[apiClient] ${error.message} (${url})`);
      }

      return {
        success: false,
        message: `Failed to fetch ${url}. Check backend, port, route, and CORS settings.`,
      } as T;
    }
  }

  get<T = ApiResponse>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  post<T = ApiResponse>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  put<T = ApiResponse>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  patch<T = ApiResponse>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  delete<T = ApiResponse>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  async logout(): Promise<void> {
    await this.post("/auth/logout");
    if (typeof window !== "undefined") {
      localStorage.removeItem("app_token");
    }
  }

  subscribe(_topic: string, _callback: (data: unknown) => void) {
    return () => {};
  }
}

export const apiClient = new ApiClient();
