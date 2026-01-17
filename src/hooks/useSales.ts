import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SaleWithDetails {
  id: string;
  store_id: string;
  customer_name: string | null;
  customer_email: string;
  total: number;
  subtotal: number;
  discount: number;
  status: string;
  payment_method: string | null;
  created_at: string;
  store?: {
    id: string;
    name: string;
  };
  items?: {
    id: string;
    product_name: string;
    price: number;
    quantity: number;
  }[];
}

export const useAllSales = () => {
  const { data: sales, isLoading, error } = useQuery({
    queryKey: ['all-sales'],
    queryFn: async () => {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Get store info for each order
      const enrichedSales = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: storeData } = await supabase
            .from('stores')
            .select('id, name')
            .eq('id', order.store_id)
            .maybeSingle();

          return {
            ...order,
            store: storeData,
          } as SaleWithDetails;
        })
      );

      return enrichedSales;
    },
  });

  // Calculate platform fee (3% + R$0.80)
  const calculateFee = (total: number) => {
    return Math.round(total * 0.03 + 80);
  };

  const stats = {
    totalToday: sales?.filter(s => {
      const today = new Date();
      const saleDate = new Date(s.created_at);
      return saleDate.toDateString() === today.toDateString() && s.status === 'approved';
    }).reduce((acc, s) => acc + s.total, 0) || 0,
    feesToday: sales?.filter(s => {
      const today = new Date();
      const saleDate = new Date(s.created_at);
      return saleDate.toDateString() === today.toDateString() && s.status === 'approved';
    }).reduce((acc, s) => acc + calculateFee(s.total), 0) || 0,
    avgTicket: sales && sales.length > 0 
      ? Math.round(sales.filter(s => s.status === 'approved').reduce((acc, s) => acc + s.total, 0) / sales.filter(s => s.status === 'approved').length) 
      : 0,
  };

  return {
    sales: sales || [],
    isLoading,
    error,
    calculateFee,
    stats,
  };
};
