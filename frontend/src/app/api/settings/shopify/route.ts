import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type ShopifySettings = {
  shopDomain: string;
  accessToken: string;
  apiVersion?: string;
};

const DATA_DIR = path.join(process.cwd(), ".data");
const SETTINGS_FILE = path.join(DATA_DIR, "shopify-settings.json");

async function readSettings(): Promise<ShopifySettings | null> {
  try {
    const raw = await readFile(SETTINGS_FILE, "utf8");
    const json = JSON.parse(raw) as ShopifySettings;
    if (!json || typeof json !== "object") return null;
    return json;
  } catch {
    return null;
  }
}

async function writeSettings(settings: ShopifySettings): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf8");
}

export async function GET() {
  const settings = await readSettings();
  return NextResponse.json({ ok: true, settings: settings ?? null });
}

export async function POST(request: Request) {
  let body: Partial<ShopifySettings> = {};
  try {
    body = (await request.json()) as Partial<ShopifySettings>;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  const shopDomain = (body.shopDomain || "").trim();
  const accessToken = (body.accessToken || "").trim();
  const apiVersion = (body.apiVersion || "2024-10").trim();

  if (!shopDomain || !accessToken) {
    return NextResponse.json({ ok: false, message: "shopDomain and accessToken are required" }, { status: 400 });
  }

  await writeSettings({ shopDomain, accessToken, apiVersion });
  return NextResponse.json({ ok: true });
}
