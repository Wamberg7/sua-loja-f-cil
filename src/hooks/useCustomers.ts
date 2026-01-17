import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Customer {
  email: string;
  name: string;
  total_spent: number;
  orders_count: number;
  last_purchase: string;
  first_purchase: string;
}

export const useCustomers = () => {
  const { store } = useAuth();

  return useQuery({
    queryKey: ["customers", store?.id],
    queryFn: async () => {
      if (!store?.id) return [];
      
      const { data: orders, error } = await supabase
        .from("orders" as never)
        .select("customer_email, customer_name, total, created_at")
        .eq("store_id", store.id)
        .eq("status", "paid")
        .order("created_at", { ascending: false });
      
      if (error) throw new Error(error.message);

      // Group orders by customer email
      const customerMap = new Map<string, Customer>();
      
      (orders as { customer_email: string; customer_name: string; total: number; created_at: string }[] || []).forEach(order => {
        const existing = customerMap.get(order.customer_email);
        if (existing) {
          existing.total_spent += order.total;
          existing.orders_count += 1;
          // Update last purchase if this order is more recent
          if (new Date(order.created_at) > new Date(existing.last_purchase)) {
            existing.last_purchase = order.created_at;
            existing.name = order.customer_name || existing.name;
          }
          // Update first purchase if this order is older
          if (new Date(order.created_at) < new Date(existing.first_purchase)) {
            existing.first_purchase = order.created_at;
          }
        } else {
          customerMap.set(order.customer_email, {
            email: order.customer_email,
            name: order.customer_name || order.customer_email.split('@')[0],
            total_spent: order.total,
            orders_count: 1,
            last_purchase: order.created_at,
            first_purchase: order.created_at,
          });
        }
      });

      return Array.from(customerMap.values()).sort((a, b) => 
        new Date(b.last_purchase).getTime() - new Date(a.last_purchase).getTime()
      );
    },
    enabled: !!store?.id,
  });
};

export const useCustomerOrders = (email: string) => {
  const { store } = useAuth();

  return useQuery({
    queryKey: ["customer-orders", store?.id, email],
    queryFn: async () => {
      if (!store?.id || !email) return [];
      
      const { data, error } = await supabase
        .from("orders" as never)
        .select("*, items:order_items(*)")
        .eq("store_id", store.id)
        .eq("customer_email", email)
        .order("created_at", { ascending: false });
      
      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: !!store?.id && !!email,
  });
};
