import { cookies } from "next/headers";

export function getBackendBaseUrl(): string | null {
  const raw = process.env.OMS_API_BASE_URL || process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!raw) return null;
  try {
    // Basic validation
    const u = new URL(raw);
    return u.origin + u.pathname.replace(/\/$/, "");
  } catch {
    return null;
  }
}

export async function getAuthToken(): Promise<string | null> {
  const store = await cookies();
  const token = store.get("session")?.value;
  return token || null;
}

export function joinBackendUrl(base: string, path: string): string {
  const baseClean = base.replace(/\/$/, "");
  const pathClean = path.startsWith("/") ? path : `/${path}`;
  return baseClean + pathClean;
}

export async function backendFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const base = getBackendBaseUrl();
  if (!base) throw new Error("Backend base URL not configured");
  const token = await getAuthToken();
  const url = joinBackendUrl(base, path);
  const headers = new Headers(init.headers || {});
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
  return fetch(url, { ...init, headers });
}
