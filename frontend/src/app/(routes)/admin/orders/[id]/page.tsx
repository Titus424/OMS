"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import type { Order } from "@/lib/types";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/ui/components";

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = Number(params?.id);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await api.get<Order>(`/api/orders/${id}`);
      if (cancelled) return;
      if (res.ok && res.data) setOrder(res.data);
      else setError(res.error || "Failed to load order");
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!order && !error) return <div>Loading…</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!order) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Order #{order.id}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-foreground/60">Customer</div>
                <div>{order.customerName || "-"}</div>
              </div>
              <div>
                <div className="text-foreground/60">Status</div>
                <div>
                  <Badge>{order.status.replaceAll("_", " ")}</Badge>
                </div>
              </div>
              <div>
                <div className="text-foreground/60">Total</div>
                <div>${order.totalPrice.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-foreground/60">Shopify</div>
                <div>{order.shopifyOrderId}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Assignee</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">{order.assignedUserId ? `User ${order.assignedUserId}` : "Unassigned"}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
