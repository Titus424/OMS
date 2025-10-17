import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getBackendBaseUrl, joinBackendUrl } from "@/server/backend";
import { OrderStatus, OrderSource } from "@/lib/enums";
import type { Order } from "@/lib/types";

function mockOrders(): Order[] {
  const base: Omit<Order, "id" | "createdAt" | "updatedAt"> = {
    shopId: 1,
    shopifyOrderId: "#1001",
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
  };
  return Array.from({ length: 8 }).map((_, idx) => ({
    ...base,
    id: idx + 1,
    shopifyOrderId: `#10${idx + 1}`,
    status: (Object.values(OrderStatus) as OrderStatus[])[idx % 7],
    createdAt: new Date(Date.now() - idx * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - idx * 43200000).toISOString(),
  }));
}

export async function GET(req: NextRequest) {
  const backendBase = getBackendBaseUrl();
  if (backendBase) {
    const url = new URL(req.url);
    const query = url.search ? url.search : "";
    const res = await backendFetch(joinBackendUrl(backendBase, `/api/orders${query}`));
    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const body = isJson ? await res.json() : await res.text();
    return NextResponse.json(body, { status: res.status });
  }

  const url = new URL(req.url);
  const assignedFilter = url.searchParams.get("assigned");
  let data = mockOrders();
  if (assignedFilter === "me") {
    data = data.filter((o) => o.assignedUserId === 2);
  }
  return NextResponse.json({ data, page: 1, perPage: data.length, total: data.length });
}
