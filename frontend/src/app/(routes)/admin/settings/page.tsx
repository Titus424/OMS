"use client";

import { useEffect, useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/ui/components";
import { api } from "@/lib/api";

type ShopifySettings = {
  shopDomain: string;
  accessToken: string;
  apiVersion?: string;
} | null;

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shopDomain, setShopDomain] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [apiVersion, setApiVersion] = useState("2024-10");
  const [backendStatus, setBackendStatus] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/settings/shopify");
        const data = await res.json();
        const settings: ShopifySettings = data?.settings ?? null;
        if (settings) {
          setShopDomain(settings.shopDomain || "");
          setAccessToken(settings.accessToken || "");
          setApiVersion(settings.apiVersion || "2024-10");
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load settings");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/settings/shopify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopDomain, accessToken, apiVersion }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to save");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="text-foreground/70">Shopify API config, tag mapping, cron, and more.</p>

      <Card>
        <CardHeader>
          <CardTitle>Backend Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                setBackendStatus("Checking…");
                const res = await api.get<{ ok: boolean; time?: string }>("/health");
                if (res.ok) {
                  setBackendStatus(`OK ${res.data?.time ? `@ ${res.data.time}` : ""}`);
                } else {
                  setBackendStatus(`Failed (${res.status || "network"})`);
                }
              }}
            >
              Check Backend
            </Button>
            {backendStatus ? <div className="text-sm text-foreground/70">{backendStatus}</div> : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shopify API</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-sm text-foreground/60">Loading…</div>
          ) : (
            <form className="space-y-4" onSubmit={onSave}>
              <div className="space-y-2">
                <label className="block text-sm">Shop Domain</label>
                <input
                  required
                  placeholder="example.myshopify.com"
                  className="w-full rounded-md border px-3 h-9 bg-background"
                  value={shopDomain}
                  onChange={(e) => setShopDomain(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm">Access Token</label>
                <input
                  required
                  type="password"
                  className="w-full rounded-md border px-3 h-9 bg-background"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm">API Version</label>
                <input
                  className="w-full rounded-md border px-3 h-9 bg-background"
                  value={apiVersion}
                  onChange={(e) => setApiVersion(e.target.value)}
                />
              </div>
              {error ? <div className="text-sm text-red-600">{error}</div> : null}
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
