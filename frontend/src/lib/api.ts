const DEFAULT_TIMEOUT_MS = 15000;

export type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
  status?: number;
};

function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    const env = (window as unknown as { __ENV__?: { API_BASE_URL?: string } }).__ENV__?.API_BASE_URL;
    if (env) return env;
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
}

async function request<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  try {
    const res = await fetch(`${getBaseUrl()}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
      signal: controller.signal,
    });
    clearTimeout(id);
    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const body = isJson ? await res.json() : await res.text();
    if (!res.ok) {
      return { ok: false, error: typeof body === "string" ? body : body?.message || "Request failed", status: res.status };
    }
    return { ok: true, data: body as T, status: res.status };
  } catch (error: unknown) {
    clearTimeout(id);
    const message = error instanceof Error ? error.message : "Network error";
    return { ok: false, error: message };
  }
}

export const api = {
  get: request,
  post: <T, B = unknown>(path: string, body?: B) => request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T, B = unknown>(path: string, body?: B) => request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  patch: <T, B = unknown>(path: string, body?: B) => request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
