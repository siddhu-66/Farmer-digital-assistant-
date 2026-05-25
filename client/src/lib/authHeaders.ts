/**
 * Auth headers for Express JWT (cookie and/or bearer).
 * Cross-origin dev (3000 → 5000) requires the token header; cookies work when using same-origin /api proxy.
 */
export function getAuthHeaders(
  extra: Record<string, string> = {}
): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...extra,
  };

  if (typeof window === "undefined") return headers;

  const token = localStorage.getItem("app_token");
  if (token) {
    headers["x-auth-token"] = token;
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}
