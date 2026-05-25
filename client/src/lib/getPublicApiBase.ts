import { getBackendOrigin } from "./getPublicApiBase.server";

/**
 * API base URL for fetch calls.
 * - Browser: same-origin `/api` (Next.js rewrites → Express) so httpOnly cookies work on localhost:3000.
 * - Server: direct backend URL from env.
 */
export function getPublicApiBase(): string {
  if (typeof window !== "undefined") {
    return "/api";
  }
  return `${getBackendOrigin()}/api`;
}

export { getBackendOrigin } from "./getPublicApiBase.server";
