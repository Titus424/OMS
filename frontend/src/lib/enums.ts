export enum OrderStatus {
  New = "new",
  Confirmed = "confirmed",
  Packed = "packed",
  OutForDelivery = "out_for_delivery",
  Delivered = "delivered",
  Cancelled = "cancelled",
  Returned = "returned",
}

export enum OrderAction {
  Confirm = "confirm",
  Pack = "pack",
  MarkOutForDelivery = "mark_out_for_delivery",
  Deliver = "deliver",
  Cancel = "cancel",
  Return = "return",
  AutoAssigned = "auto_assigned",
}

export enum OrderSource {
  Shopify = "shopify",
}
