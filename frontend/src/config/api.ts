// Centralized API base URL configuration
// Priority:
// 1. REACT_APP_API_BASE_URL environment variable at build time
// 2. Runtime global window.__BACKEND_URL__ (can be injected via script tag before bundle)
// 3. Fallback localhost dev URL

export const API_BASE_URL: string =
  (process.env.REACT_APP_API_BASE_URL as string) ||
  (typeof window !== "undefined" && (window as any).__BACKEND_URL__) ||
  "http://localhost:5000/api";

// Helper to prefix paths safely (avoids double slashes)
export const apiPath = (path: string) => {
  if (!path.startsWith("/")) path = "/" + path;
  return API_BASE_URL.replace(/\/$/, "") + path;
};
