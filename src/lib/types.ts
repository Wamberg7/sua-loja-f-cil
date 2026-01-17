// Types for the application

export interface Profile {
  id: string;
  user_id: string;
  full_name?: string;
  email: string;
  avatar_url?: string;
  is_minor?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  category?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  store_id: string;
  category_id?: string;
  name: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  images?: string[];
  stock?: number;
  download_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  store_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  store_id: string;
  customer_email: string;
  customer_name?: string;
  customer_phone?: string;
  status: string;
  total: number;
  subtotal: number;
  discount: number;
  payment_method?: string;
  payment_id?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product_name: string;
  quantity: number;
  price: number;
  created_at: string;
}

export interface Wallet {
  id: string;
  store_id: string;
  available: number;
  pending: number;
  reserved: number;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface WalletBalance {
  available: number;
  pending: number;
  reserved: number;
}

export interface Coupon {
  id: string;
  store_id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_order_value?: number;
  max_uses?: number;
  uses_count: number;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface StoreStats {
  sales_today: number;
  sales_today_change: number;
  orders_count: number;
  orders_change: number;
  customers_count: number;
  customers_change: number;
  products_count: number;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: "superadmin" | "admin" | "seller";
  created_at: string;
}
