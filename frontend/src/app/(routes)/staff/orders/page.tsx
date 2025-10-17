"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Order, PaginatedResult } from "@/lib/types";
import { OrderAction, OrderStatus } from "@/lib/enums";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Table, TBody, TD, TH, THead, TR } from "@/ui/components";

export default function StaffOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [working, setWorking] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await api.get<PaginatedResult<Order>>("/api/orders?assigned=me");
      if (cancelled) return;
      if (res.ok && res.data) setOrders(res.data.data);
      else setError(res.error || "Failed to load orders");
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function act(orderId: number, action: OrderAction) {
    setWorking(orderId);
    const res = await api.post<Order>(`/api/orders/${orderId}/actions`, { action });
    if (res.ok && res.data) {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? res.data! : o)));
    } else {
      alert(res.error || "Action failed");
    }
    setWorking(null);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">My Orders</h1>
      <Card>
        <CardHeader>
          <CardTitle>Assigned Orders</CardTitle>
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
                  <TH>Customer</TH>
                  <TH>Status</TH>
                  <TH>Actions</TH>
                </TR>
              </THead>
              <TBody>
                {orders.map((o) => (
                  <TR key={o.id}>
                    <TD>#{o.id}</TD>
                    <TD>{o.customerName || "-"}</TD>
                    <TD>
                      <Badge>{o.status.replaceAll("_", " ")}</Badge>
                    </TD>
                    <TD className="space-x-2">
                      {o.status === OrderStatus.New && (
                        <Button disabled={working === o.id} onClick={() => act(o.id, OrderAction.Confirm)}>
                          Confirm
                        </Button>
                      )}
                      {o.status === OrderStatus.Confirmed && (
                        <Button disabled={working === o.id} onClick={() => act(o.id, OrderAction.Pack)}>
                          Mark Packed
                        </Button>
                      )}
                      {o.status === OrderStatus.Packed && (
                        <Button disabled={working === o.id} onClick={() => act(o.id, OrderAction.MarkOutForDelivery)}>
                          Out for delivery
                        </Button>
                      )}
                      {o.status === OrderStatus.OutForDelivery && (
                        <Button disabled={working === o.id} onClick={() => act(o.id, OrderAction.Deliver)}>
                          Mark Delivered
                        </Button>
                      )}
                      {o.status !== OrderStatus.Delivered && (
                        <Button variant="danger" disabled={working === o.id} onClick={() => act(o.id, OrderAction.Cancel)}>
                          Cancel
                        </Button>
                      )}
                      {o.status === OrderStatus.Delivered && (
                        <Button variant="outline" disabled={working === o.id} onClick={() => act(o.id, OrderAction.Return)}>
                          Return
                        </Button>
                      )}
                    </TD>
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
