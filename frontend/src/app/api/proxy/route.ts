import { NextResponse } from "next/server";
import { backendFetch } from "@/server/backend";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { path: string; method?: string; body?: unknown; headers?: Record<string, string> };
    const method = (body.method || "GET").toUpperCase();
    const res = await backendFetch(body.path, {
      method,
      body: body.body ? JSON.stringify(body.body) : undefined,
      headers: body.headers,
    });
    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const data = isJson ? await res.json() : await res.text();
    return NextResponse.json({ ok: res.ok, status: res.status, data });
  } catch (err) {
    return NextResponse.json({ ok: false, message: (err as Error).message }, { status: 500 });
  }
}
