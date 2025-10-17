"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Order, PaginatedResult } from "@/lib/types";
import { OrderStatus } from "@/lib/enums";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Table, TBody, TD, TH, THead, TR } from "@/ui/components";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await api.get<PaginatedResult<Order>>("/api/orders");
      if (cancelled) return;
      if (res.ok && res.data) {
        setOrders(res.data.data);
      } else {
        setError(res.error || "Failed to load orders");
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <div className="flex gap-2">
          <Button variant="outline">Refresh</Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading…</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>ID</TH>
                  <TH>Shopify</TH>
                  <TH>Customer</TH>
                  <TH>Status</TH>
                  <TH>Total</TH>
                  <TH>Assigned</TH>
                </TR>
              </THead>
              <TBody>
                {orders.map((o) => (
                  <TR key={o.id}>
                    <TD>#{o.id}</TD>
                    <TD>{o.shopifyOrderId}</TD>
                    <TD>{o.customerName || "-"}</TD>
                    <TD>
                      <StatusBadge status={o.status} />
                    </TD>
                    <TD>${o.totalPrice.toFixed(2)}</TD>
                    <TD>{o.assignedUserId ? `User ${o.assignedUserId}` : "Unassigned"}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const color =
    status === OrderStatus.New
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : status === OrderStatus.Confirmed
      ? "bg-violet-50 text-violet-700 border-violet-200"
      : status === OrderStatus.Packed
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : status === OrderStatus.OutForDelivery
      ? "bg-cyan-50 text-cyan-700 border-cyan-200"
      : status === OrderStatus.Delivered
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === OrderStatus.Cancelled
      ? "bg-red-50 text-red-700 border-red-200"
      : "bg-gray-50 text-gray-700 border-gray-200";
  return <Badge className={color}>{status.replaceAll("_", " ")}</Badge>;
}
