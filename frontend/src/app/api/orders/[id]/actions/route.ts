import { NextResponse } from "next/server";
import { OrderAction, OrderStatus, OrderSource } from "@/lib/enums";
import type { Order } from "@/lib/types";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const { action } = (await req.json()) as { action: OrderAction };

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
