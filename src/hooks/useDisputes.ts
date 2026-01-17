import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Dispute {
  id: string;
  order_id: string;
  store_id: string;
  reason: string;
  description: string | null;
  status: string;
  resolution: string | null;
  evidence_urls: string[];
  amount: number;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  order?: {
    id: string;
    customer_name: string | null;
    customer_email: string;
    total: number;
    status: string;
    created_at: string;
  };
}

export const useDisputes = () => {
  const { store } = useAuth();
  const queryClient = useQueryClient();

  const { data: disputes, isLoading, error } = useQuery({
    queryKey: ['disputes', store?.id],
    queryFn: async () => {
      if (!store?.id) return [];
      
      const { data, error } = await supabase
        .from('disputes')
        .select(`
          *,
          order:orders(id, customer_name, customer_email, total, status, created_at)
        `)
        .eq('store_id', store.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Dispute[];
    },
    enabled: !!store?.id,
  });

  const createDispute = useMutation({
    mutationFn: async (dispute: {
      order_id: string;
      reason: string;
      description?: string;
      amount: number;
    }) => {
      if (!store?.id) throw new Error("Loja não encontrada");

      const { data, error } = await supabase
        .from('disputes')
        .insert({
          ...dispute,
          store_id: store.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disputes'] });
      toast.success("Contestação criada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar contestação: " + error.message);
    },
  });

  const updateDispute = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Dispute> & { id: string }) => {
      const { data, error } = await supabase
        .from('disputes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disputes'] });
      toast.success("Contestação atualizada!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar contestação: " + error.message);
    },
  });

  return {
    disputes: disputes || [],
    isLoading,
    error,
    createDispute,
    updateDispute,
  };
};

// Hook for admin to view all disputes
export const useAllDisputes = () => {
  const queryClient = useQueryClient();

  const { data: disputes, isLoading, error } = useQuery({
    queryKey: ['all-disputes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('disputes')
        .select(`
          *,
          order:orders(id, customer_name, customer_email, total, status, created_at)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Dispute[];
    },
  });

  const resolveDispute = useMutation({
    mutationFn: async ({ id, status, resolution }: { id: string; status: string; resolution: string }) => {
      const { data, error } = await supabase
        .from('disputes')
        .update({
          status,
          resolution,
          resolved_at: status !== 'pending' ? new Date().toISOString() : null,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-disputes'] });
      toast.success("Contestação resolvida!");
    },
    onError: (error) => {
      toast.error("Erro ao resolver contestação: " + error.message);
    },
  });

  return {
    disputes: disputes || [],
    isLoading,
    error,
    resolveDispute,
  };
};
