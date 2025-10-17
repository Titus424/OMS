import { OrderStatus, OrderAction, OrderSource } from "@/lib/enums";

export interface ShippingAddress {
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  zip?: string;
  country?: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  title: string;
  sku?: string;
  quantity: number;
  price: number;
  variantId?: string;
}

export interface OrderActionLog {
  id: number;
  orderId: number;
  actorUserId?: number;
  action: OrderAction;
  fromStatus?: OrderStatus;
  toStatus: OrderStatus;
  note?: string;
  meta?: Record<string, unknown>;
  createdAt: string;
}

export interface Order {
  id: number;
  shopId: number;
  shopifyOrderId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: ShippingAddress;
  status: OrderStatus;
  source: OrderSource;
  assignedUserId?: number;
  assignedAt?: string;
  syncedAt?: string;
  lastShopifyTagSyncAt?: string;
  totalPrice: number;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  actions?: OrderActionLog[];
}

export interface StaffProfile {
  id: number;
  userId: number;
  phone?: string;
  notes?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  isActive?: boolean;
}

export interface Shop {
  id: number;
  domain: string;
  apiAccessToken: string;
  apiVersion: string;
  isActive: boolean;
}

export type PaginatedResult<T> = {
  data: T[];
  page: number;
  perPage: number;
  total: number;
};
