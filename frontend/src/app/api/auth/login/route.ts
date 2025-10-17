import { NextResponse } from "next/server";
import { cookies } from "next/headers";

type LoginRequestBody = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  let body: LoginRequestBody = {};
  try {
    body = (await request.json()) as LoginRequestBody;
  } catch {
    // ignore JSON parse error; handled by validation below
  }

  const email = (body.email || "").trim();
  const password = (body.password || "").trim();

  if (!email || !password) {
    return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
  }

  // NOTE: Replace this with real backend auth.
  // For now, accept any non-empty credentials and set a session cookie.
  const randomToken = Math.random().toString(36).slice(2) + Date.now().toString(36);

  const cookieStore = await cookies();
  cookieStore.set("session", randomToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return NextResponse.json({ ok: true });
}
