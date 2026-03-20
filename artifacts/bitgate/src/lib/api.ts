/**
 * Resolves the base URL for all API requests.
 *
 * Priority:
 * 1. VITE_API_URL  — set this in your deployment environment
 *    e.g. https://your-api.railway.app/api
 * 2. Replit path-routing fallback (used automatically when running on Replit)
 */
export const API_BASE: string = (() => {
  const explicit = import.meta.env.VITE_API_URL as string | undefined;
  if (explicit) return explicit.replace(/\/$/, "");

  return import.meta.env.BASE_URL.replace(/\/$/, "").replace(
    /\/bitgate$/,
    "/api-server"
  );
})();
