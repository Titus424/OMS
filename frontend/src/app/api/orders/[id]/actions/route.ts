import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getBackendBaseUrl, joinBackendUrl } from "@/server/backend";
import { OrderAction, OrderStatus, OrderSource } from "@/lib/enums";
import type { Order } from "@/lib/types";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await context.params;
  const id = Number(idParam);
  const backendBase = getBackendBaseUrl();

  if (backendBase) {
    const res = await backendFetch(joinBackendUrl(backendBase, `/api/orders/${id}/actions`), {
      method: "POST",
      body: await req.text(),
      headers: { "Content-Type": req.headers.get("content-type") || "application/json" },
    });
    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const body = isJson ? await res.json() : await res.text();
    return NextResponse.json(body, { status: res.status });
  }

  const body = (await req.json()) as unknown;
  const action = (body as { action?: OrderAction })?.action ?? OrderAction.Confirm;

  // Very simple state progression mock
  let nextStatus: OrderStatus = OrderStatus.New;
  switch (action) {
    case OrderAction.Confirm:
      nextStatus = OrderStatus.Confirmed; break;
    case OrderAction.Pack:
      nextStatus = OrderStatus.Packed; break;
    case OrderAction.MarkOutForDelivery:
      nextStatus = OrderStatus.OutForDelivery; break;
    case OrderAction.Deliver:
      nextStatus = OrderStatus.Delivered; break;
    case OrderAction.Cancel:
      nextStatus = OrderStatus.Cancelled; break;
    case OrderAction.Return:
      nextStatus = OrderStatus.Returned; break;
    default:
      nextStatus = OrderStatus.New;
  }

  const order: Order = {
    id,
    shopId: 1,
    shopifyOrderId: `#10${id}`,
    customerName: "John Doe",
    status: nextStatus,
    source: OrderSource.Shopify,
    totalPrice: 129.99,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customerEmail: "john@example.com",
    customerPhone: "+1234567890",
    items: [],
    actions: [],
  } as Order;

  return NextResponse.json(order);
}
