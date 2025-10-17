import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getBackendBaseUrl, joinBackendUrl } from "@/server/backend";
import { OrderStatus, OrderSource } from "@/lib/enums";
import type { Order } from "@/lib/types";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await context.params;
  const id = Number(idParam);
  const backendBase = getBackendBaseUrl();

  if (backendBase) {
    const res = await backendFetch(joinBackendUrl(backendBase, `/api/orders/${id}`));
    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const body = isJson ? await res.json() : await res.text();
    return NextResponse.json(body, { status: res.status });
  }

  const order: Order = {
    id,
    shopId: 1,
    shopifyOrderId: `#10${id}`,
    customerName: "John Doe",
    customerEmail: "john@example.com",
    customerPhone: "+1234567890",
    shippingAddress: { city: "New York", country: "US" },
    status: OrderStatus.New,
    source: OrderSource.Shopify,
    assignedUserId: 2,
    assignedAt: new Date().toISOString(),
    syncedAt: new Date().toISOString(),
    lastShopifyTagSyncAt: new Date().toISOString(),
    totalPrice: 129.99,
    paymentMethod: "COD",
    items: [],
    actions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return NextResponse.json(order);
}
