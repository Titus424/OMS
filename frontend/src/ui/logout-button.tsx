"use client";

import { useState } from "react";
import { Button } from "@/ui/components";

export function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function onLogout() {
    try {
      setLoading(true);
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={onLogout} variant="outline" disabled={loading}>
      {loading ? "Logging out..." : "Logout"}
    </Button>
  );
}
