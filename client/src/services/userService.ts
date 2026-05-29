import { authService, type AuthUser } from "@/services/authService";

export type CurrentUser = AuthUser;

export const userService = {
  async getCurrentUser(): Promise<CurrentUser | null> {
    const data = await authService.getMe();
    if (data.success === false || !data.user) return null;
    return data.user;
  },
};
