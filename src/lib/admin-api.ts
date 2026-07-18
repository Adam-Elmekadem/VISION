import { authHeaders } from "@/store/auth";

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1");

async function req<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/admin${path}`, {
    ...opts,
    headers: { ...authHeaders(), ...(opts?.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

// ── Types ──────────────────────────────────────────────────────────────────────

export interface AdminStats {
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  total_products: number;
  low_stock: number;
  recent_orders: AdminOrderRow[];
}

export interface AdminOrderRow {
  id: number;
  order_number: string;
  customer_name: string;
  total: string;
  status: string;
  payment_status: string;
  created_at: string;
}

export interface AdminOrder extends AdminOrderRow {
  customer_email: string;
  customer_phone?: string;
  city?: string;
  country: string;
  postal_code?: string;
  shipping_address?: Record<string, string>;
  subtotal: string;
  shipping_cost: string;
  payment_method: string;
  notes?: string;
  items: AdminOrderItem[];
}

export interface AdminOrderItem {
  id: number;
  product_name: string;
  product_sku?: string;
  color?: string;
  size?: string;
  quantity: number;
  unit_price: string;
  total_price: string;
  product_image?: string;
}

export interface AdminProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  compare_price?: string;
  stock: number;
  sku?: string;
  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
  is_limited: boolean;
  cover_image?: string;
  images?: string[];
  description?: string;
  short_description?: string;
  category_id?: number;
  category?: { id: number; name: string };
  collection_slug?: string;
  colors?: AdminColor[];
  sizes?: AdminSize[];
  created_at: string;
}

export interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
  products_count?: number;
}

export interface AdminColor {
  id: number;
  name: string;
  hex_code: string;
  is_active: boolean;
}

export interface AdminSize {
  id: number;
  name: string;
  code: string;
  is_active: boolean;
  sort_order: number;
}

export interface Paginated<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// ── Dashboard ──────────────────────────────────────────────────────────────────

export const adminApi = {
  stats: () => req<AdminStats>("/stats"),

  // Orders
  orders: (params?: { page?: number; status?: string; search?: string }) =>
    req<Paginated<AdminOrderRow>>(`/orders?${new URLSearchParams(params as Record<string, string> ?? {})}`),
  order: (id: number) => req<AdminOrder>(`/orders/${id}`),
  updateOrder: (id: number, data: Partial<{ status: string; payment_status: string; notes: string }>) =>
    req<AdminOrder>(`/orders/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  // Products
  products: (params?: { page?: number; search?: string }) =>
    req<Paginated<AdminProduct>>(`/products?${new URLSearchParams(params as Record<string, string> ?? {})}`),
  product: (id: number) => req<AdminProduct>(`/products/${id}`),
  createProduct: (data: Partial<AdminProduct> & { color_ids?: number[]; size_ids?: number[] }) =>
    req<AdminProduct>("/products", { method: "POST", body: JSON.stringify(data) }),
  updateProduct: (id: number, data: Partial<AdminProduct> & { color_ids?: number[]; size_ids?: number[] }) =>
    req<AdminProduct>(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProduct: (id: number) =>
    req<{ message: string }>(`/products/${id}`, { method: "DELETE" }),

  // Categories
  categories: () => req<AdminCategory[]>("/categories"),
  createCategory: (data: Partial<AdminCategory>) =>
    req<AdminCategory>("/categories", { method: "POST", body: JSON.stringify(data) }),
  updateCategory: (id: number, data: Partial<AdminCategory>) =>
    req<AdminCategory>(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCategory: (id: number) =>
    req<{ message: string }>(`/categories/${id}`, { method: "DELETE" }),

  // Colors
  colors: () => req<AdminColor[]>("/colors"),
  createColor: (data: Omit<AdminColor, "id">) =>
    req<AdminColor>("/colors", { method: "POST", body: JSON.stringify(data) }),
  updateColor: (id: number, data: Partial<AdminColor>) =>
    req<AdminColor>(`/colors/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteColor: (id: number) =>
    req<{ message: string }>(`/colors/${id}`, { method: "DELETE" }),

  // Sizes
  sizes: () => req<AdminSize[]>("/sizes"),
  createSize: (data: Omit<AdminSize, "id">) =>
    req<AdminSize>("/sizes", { method: "POST", body: JSON.stringify(data) }),
  updateSize: (id: number, data: Partial<AdminSize>) =>
    req<AdminSize>(`/sizes/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteSize: (id: number) =>
    req<{ message: string }>(`/sizes/${id}`, { method: "DELETE" }),
};
