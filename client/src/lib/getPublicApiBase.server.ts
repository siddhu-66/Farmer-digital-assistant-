/**
 * Backend origin for server-side calls and Next.js rewrites (no trailing slash, no /api).
 */
export function getBackendOrigin(): string {
  const raw = (
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000"
  )
    .replace(/\/$/, "")
    .replace(/\/api$/, "");

  return raw;
}
