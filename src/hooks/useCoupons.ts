import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Coupon } from "@/lib/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const useCoupons = () => {
  const { store } = useAuth();

  return useQuery({
    queryKey: ["coupons", store?.id],
    queryFn: async () => {
      if (!store?.id) return [];
      
      const { data, error } = await supabase
        .from("coupons" as never)
        .select("*")
        .eq("store_id", store.id)
        .order("created_at", { ascending: false });
      
      if (error) throw new Error(error.message);
      return (data || []) as unknown as Coupon[];
    },
    enabled: !!store?.id,
  });
};

export const useCoupon = (id: string) => {
  return useQuery({
    queryKey: ["coupons", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coupons" as never)
        .select("*")
        .eq("id", id)
        .maybeSingle();
      
      if (error) throw new Error(error.message);
      return data as unknown as Coupon | null;
    },
    enabled: !!id,
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  const { store } = useAuth();

  return useMutation({
    mutationFn: async (coupon: Partial<Coupon>) => {
      if (!store?.id) throw new Error("Loja não encontrada");
      
      const { data, error } = await supabase
        .from("coupons" as never)
        .insert({
          store_id: store.id,
          code: coupon.code?.toUpperCase() || "",
          discount_type: coupon.discount_type || "percentage",
          discount_value: coupon.discount_value || 0,
          min_order_value: coupon.min_order_value,
          max_uses: coupon.max_uses,
          expires_at: coupon.expires_at,
          is_active: coupon.is_active ?? true,
        } as never)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data as unknown as Coupon;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("Cupom criado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao criar cupom");
    },
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...coupon }: Partial<Coupon> & { id: string }) => {
      const { data, error } = await supabase
        .from("coupons" as never)
        .update({
          code: coupon.code?.toUpperCase(),
          discount_type: coupon.discount_type,
          discount_value: coupon.discount_value,
          min_order_value: coupon.min_order_value,
          max_uses: coupon.max_uses,
          expires_at: coupon.expires_at,
          is_active: coupon.is_active,
        } as never)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data as unknown as Coupon;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("Cupom atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar cupom");
    },
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("coupons" as never)
        .delete()
        .eq("id", id);
      
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("Cupom excluído com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao excluir cupom");
    },
  });
};
