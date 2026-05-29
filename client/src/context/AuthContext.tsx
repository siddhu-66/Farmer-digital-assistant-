"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/apiClient";
import { authService } from "@/services/authService";

type Role = "farmer" | "business" | "salesman" | "admin" | null;
type Status = "pending" | "approved" | "rejected" | null;

interface AuthUserPayload {
  id: string;
  name: string;
  role: Role;
  status: Status;
  verified: boolean;
  email?: string;
  mobile?: string;
  country?: string;
  currency?: string;
  language?: string;
  timezone?: string;
  cropUnit?: string;
}

interface AuthContextType {
  role: Role;
  userId: string | null;
  userName: string | null;
  status: Status;
  verified: boolean;
  authReady: boolean;
  user: AuthUserPayload | null;
  setRole: (role: Role) => void;
  setAuth: (
    role: Role,
    token: string | null,
    id: string,
    name: string,
    status: Status,
    verified: boolean,
    extras?: { email?: string; mobile?: string }
  ) => void;
  logout: () => void;
  refreshSession: () => Promise<void>;
  updateUser: (userData: Partial<AuthUserPayload>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function persistProfile(
  role: Role,
  id: string,
  name: string,
  status: Status,
  verified: boolean,
  token: string | null
) {
  if (typeof window === "undefined") return;
  if (role && id) {
    localStorage.setItem("app_role", role);
    localStorage.setItem("app_user_id", id);
    localStorage.setItem("app_user_name", name);
    localStorage.setItem("app_status", status || "");
    localStorage.setItem("app_verified", String(verified));
    if (token) localStorage.setItem("app_token", token);
    else localStorage.removeItem("app_token");
  } else {
    localStorage.removeItem("app_role");
    localStorage.removeItem("app_user_id");
    localStorage.removeItem("app_user_name");
    localStorage.removeItem("app_status");
    localStorage.removeItem("app_verified");
    localStorage.removeItem("app_token");
  }
}

function clearAuthState(
  setters: {
    setRole: (r: Role) => void;
    setUserId: (id: string | null) => void;
    setUserName: (n: string | null) => void;
    setStatus: (s: Status) => void;
    setVerified: (v: boolean) => void;
    setUser: (u: AuthUserPayload | null) => void;
  }
) {
  setters.setRole(null);
  setters.setUserId(null);
  setters.setUserName(null);
  setters.setStatus(null);
  setters.setVerified(false);
  setters.setUser(null);
  persistProfile(null, "", "", null, false, null);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>(null);
  const [userId, setUserIdState] = useState<string | null>(null);
  const [userName, setUserNameState] = useState<string | null>(null);
  const [status, setStatusState] = useState<Status>(null);
  const [verified, setVerifiedState] = useState<boolean>(false);
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<AuthUserPayload | null>(null);

  const applyUser = useCallback((u: AuthUserPayload, token: string | null) => {
    setRoleState(u.role);
    setUserIdState(u.id);
    setUserNameState(u.name);
    setStatusState(u.status);
    setVerifiedState(u.verified);
    setUser(u);
    persistProfile(u.role, u.id, u.name, u.status, u.verified, token);
  }, []);

  const refreshSession = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("app_token") : null;

    try {
      const data = await authService.getMe();
      if (data.success === false || !data.user) {
        clearAuthState({
          setRole: setRoleState,
          setUserId: setUserIdState,
          setUserName: setUserNameState,
          setStatus: setStatusState,
          setVerified: setVerifiedState,
          setUser,
        });
        return;
      }

      applyUser(
        {
          id: data.user.id,
          name: data.user.name,
          role: data.user.role as Role,
          status: data.user.status as Status,
          verified: Boolean(data.user.verified),
          email: data.user.email,
          mobile: data.user.mobile,
        },
        token
      );
    } catch {
      /* not logged in */
    }
  }, [applyUser]);

  useEffect(() => {
    const savedRole = localStorage.getItem("app_role") as Role;
    const savedUserId = localStorage.getItem("app_user_id");
    const savedUserName = localStorage.getItem("app_user_name");
    const savedStatus = localStorage.getItem("app_status") as Status;
    const savedVerified = localStorage.getItem("app_verified") === "true";

    if (savedRole) setRoleState(savedRole);
    if (savedUserId) setUserIdState(savedUserId);
    if (savedUserName) setUserNameState(savedUserName);
    if (savedStatus) setStatusState(savedStatus);
    setVerifiedState(savedVerified);

    void refreshSession().finally(() => setAuthReady(true));
  }, [refreshSession]);

  const setAuth = (
    newRole: Role,
    token: string | null,
    id: string,
    name: string,
    newStatus: Status,
    isVerified: boolean,
    extras?: { email?: string; mobile?: string }
  ) => {
    setRoleState(newRole);
    setUserIdState(id);
    setUserNameState(name);
    setStatusState(newStatus);
    setVerifiedState(isVerified);
    setUser({
      id,
      name,
      role: newRole,
      status: newStatus,
      verified: isVerified,
      email: extras?.email,
      mobile: extras?.mobile,
    });
    persistProfile(newRole, id, name, newStatus, isVerified, token);
  };

  const updateUser = useCallback((userData: Partial<AuthUserPayload>) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : null));
  }, []);

  const logout = async () => {
    await apiClient.logout();
    clearAuthState({
      setRole: setRoleState,
      setUserId: setUserIdState,
      setUserName: setUserNameState,
      setStatus: setStatusState,
      setVerified: setVerifiedState,
      setUser,
    });
    window.location.href = "/signin";
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        userId,
        userName,
        status,
        verified,
        authReady,
        user,
        updateUser,
        setRole: setRoleState,
        setAuth,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
