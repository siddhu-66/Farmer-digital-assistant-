import { apiClient } from "@/lib/apiClient";

export interface AuthUser {
  id: string;
  name: string;
  role: "farmer" | "business" | "salesman" | "admin";
  status: string;
  verified: boolean;
  email?: string;
  mobile?: string;
}

export interface LoginResponse {
  success?: boolean;
  token?: string;
  user?: AuthUser;
  message?: string;
}

export interface MeResponse {
  success?: boolean;
  user?: AuthUser;
  message?: string;
}

export const authService = {
  async login(body: {
    identifier?: string;
    email?: string;
    mobile?: string;
    password: string;
  }): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>("/auth/login", body);
  },

  async getMe(): Promise<MeResponse> {
    return apiClient.get<MeResponse>("/auth/me");
  },

  async logout(): Promise<void> {
    await apiClient.logout();
  },
};
