import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StoreStats } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";

export const useStoreStats = () => {
  const { store } = useAuth();

  return useQuery({
    queryKey: ["stats", "store", store?.id],
    queryFn: async (): Promise<StoreStats> => {
      if (!store?.id) {
        return {
          sales_today: 0,
          sales_today_change: 0,
          orders_count: 0,
          orders_change: 0,
          customers_count: 0,
          customers_change: 0,
          products_count: 0,
        };
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayIso = today.toISOString();

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayIso = yesterday.toISOString();

      // Sales today
      const { data: salesToday } = await supabase
        .from("orders")
        .select("total")
        .eq("store_id", store.id)
        .eq("payment_status", "paid")
        .gte("created_at", todayIso);

      const salesTodayTotal = (salesToday || []).reduce((sum, o) => sum + Number(o.total), 0);

      // Sales yesterday
      const { data: salesYesterday } = await supabase
        .from("orders")
        .select("total")
        .eq("store_id", store.id)
        .eq("payment_status", "paid")
        .gte("created_at", yesterdayIso)
        .lt("created_at", todayIso);

      const salesYesterdayTotal = (salesYesterday || []).reduce((sum, o) => sum + Number(o.total), 0);

      // Orders count
      const { count: ordersCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("store_id", store.id);

      // Orders today
      const { count: ordersTodayCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("store_id", store.id)
        .gte("created_at", todayIso);

      // Orders yesterday
      const { count: ordersYesterdayCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("store_id", store.id)
        .gte("created_at", yesterdayIso)
        .lt("created_at", todayIso);

      // Unique customers
      const { data: customers } = await supabase
        .from("orders")
        .select("customer_email")
        .eq("store_id", store.id);

      const uniqueCustomers = new Set((customers || []).map(c => c.customer_email)).size;

      // Products count
      const { count: productsCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("store_id", store.id);

      // Calculate changes
      const salesChange = salesYesterdayTotal > 0 
        ? Math.round(((salesTodayTotal - salesYesterdayTotal) / salesYesterdayTotal) * 100)
        : salesTodayTotal > 0 ? 100 : 0;

      const ordersChange = (ordersYesterdayCount || 0) > 0
        ? Math.round((((ordersTodayCount || 0) - (ordersYesterdayCount || 0)) / (ordersYesterdayCount || 1)) * 100)
        : (ordersTodayCount || 0) > 0 ? 100 : 0;

      return {
        sales_today: salesTodayTotal * 100, // Convert to cents
        sales_today_change: salesChange,
        orders_count: ordersCount || 0,
        orders_change: ordersChange,
        customers_count: uniqueCustomers,
        customers_change: 0,
        products_count: productsCount || 0,
      };
    },
    enabled: !!store?.id,
  });
};

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["stats", "admin"],
    queryFn: async () => {
      // Get total stores
      const { count: storesCount } = await supabase
        .from("stores")
        .select("*", { count: "exact", head: true });

      // Get total orders
      const { count: ordersCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });

      // Get total products
      const { count: productsCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      // Get total revenue
      const { data: orders } = await supabase
        .from("orders")
        .select("total")
        .eq("payment_status", "paid");

      const totalRevenue = (orders || []).reduce((sum, o) => sum + Number(o.total), 0);

      return {
        stores_count: storesCount || 0,
        orders_count: ordersCount || 0,
        products_count: productsCount || 0,
        total_revenue: totalRevenue,
      };
    },
  });
};
