import { NextResponse } from "next/server";
import { OrderStatus, OrderSource } from "@/lib/enums";
import type { Order } from "@/lib/types";

export function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
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
