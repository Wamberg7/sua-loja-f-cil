import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/lib/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const useOrders = () => {
  const { store } = useAuth();

  return useQuery({
    queryKey: ["orders", store?.id],
    queryFn: async () => {
      if (!store?.id) return [];
      
      const { data, error } = await supabase
        .from("orders")
        .select("*, items:order_items(*)")
        .eq("store_id", store.id)
        .order("created_at", { ascending: false });
      
      if (error) throw new Error(error.message);
      return (data || []) as Order[];
    },
    enabled: !!store?.id,
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, items:order_items(*)")
        .eq("id", id)
        .maybeSingle();
      
      if (error) throw new Error(error.message);
      return data as Order | null;
    },
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: Partial<Order>) => {
      const { data, error } = await supabase
        .from("orders")
        .insert({
          store_id: order.store_id,
          customer_email: order.customer_email || "",
          customer_name: order.customer_name || "",
          customer_phone: order.customer_phone,
          total: order.total || 0,
          payment_method: order.payment_method,
          status: order.status || "pending",
          payment_status: order.payment_status || "pending",
          notes: order.notes,
        })
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Pedido criado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao criar pedido");
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Status atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar status");
    },
  });
};
