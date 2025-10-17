import { NextRequest, NextResponse } from "next/server";
import { OrderStatus, OrderSource } from "@/lib/enums";
import type { Order } from "@/lib/types";

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await context.params;
  const id = Number(idParam);
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
