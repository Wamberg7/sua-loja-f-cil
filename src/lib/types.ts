// Types for the application

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
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
  stock: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  variations?: ProductVariation[];
}

export interface ProductVariation {
  id: string;
  product_id: string;
  name: string;
  price: number;
  stock: number;
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
  customer_name: string;
  customer_phone?: string;
  status: string;
  total: number;
  payment_method?: string;
  payment_status: string;
  notes?: string;
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
  unit_price: number;
  total: number;
  created_at: string;
}

export interface Transaction {
  id: string;
  store_id: string;
  order_id?: string;
  type: string;
  amount: number;
  status: string;
  payment_gateway?: string;
  external_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Withdrawal {
  id: string;
  store_id: string;
  amount: number;
  status: string;
  pix_key?: string;
  pix_key_type?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface WalletBalance {
  available: number;
  pending: number;
  reserved: number;
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
