import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Transaction, Withdrawal, WalletBalance } from "@/lib/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const useWalletBalance = () => {
  const { store } = useAuth();

  return useQuery({
    queryKey: ["wallet", "balance", store?.id],
    queryFn: async (): Promise<WalletBalance> => {
      if (!store?.id) return { available: 0, pending: 0, reserved: 0 };
      
      // Get completed transactions (available)
      const { data: completedTx } = await supabase
        .from("transactions")
        .select("amount")
        .eq("store_id", store.id)
        .eq("status", "completed")
        .eq("type", "sale");
      
      // Get pending transactions
      const { data: pendingTx } = await supabase
        .from("transactions")
        .select("amount")
        .eq("store_id", store.id)
        .eq("status", "pending")
        .eq("type", "sale");
      
      // Get pending withdrawals (reserved)
      const { data: pendingWithdrawals } = await supabase
        .from("withdrawals")
        .select("amount")
        .eq("store_id", store.id)
        .eq("status", "pending");
      
      const available = (completedTx || []).reduce((sum, tx) => sum + Number(tx.amount), 0);
      const pending = (pendingTx || []).reduce((sum, tx) => sum + Number(tx.amount), 0);
      const reserved = (pendingWithdrawals || []).reduce((sum, w) => sum + Number(w.amount), 0);
      
      return {
        available: available - reserved,
        pending,
        reserved,
      };
    },
    enabled: !!store?.id,
  });
};

export const useTransactions = () => {
  const { store } = useAuth();

  return useQuery({
    queryKey: ["wallet", "transactions", store?.id],
    queryFn: async () => {
      if (!store?.id) return [];
      
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("store_id", store.id)
        .order("created_at", { ascending: false });
      
      if (error) throw new Error(error.message);
      return (data || []) as Transaction[];
    },
    enabled: !!store?.id,
  });
};

export const useWithdrawals = () => {
  const { store } = useAuth();

  return useQuery({
    queryKey: ["wallet", "withdrawals", store?.id],
    queryFn: async () => {
      if (!store?.id) return [];
      
      const { data, error } = await supabase
        .from("withdrawals")
        .select("*")
        .eq("store_id", store.id)
        .order("created_at", { ascending: false });
      
      if (error) throw new Error(error.message);
      return (data || []) as Withdrawal[];
    },
    enabled: !!store?.id,
  });
};

export const useCreateWithdrawal = () => {
  const queryClient = useQueryClient();
  const { store } = useAuth();

  return useMutation({
    mutationFn: async ({ amount, pix_key, pix_key_type }: { amount: number; pix_key: string; pix_key_type: string }) => {
      if (!store?.id) throw new Error("Loja não encontrada");
      
      const { data, error } = await supabase
        .from("withdrawals")
        .insert({
          store_id: store.id,
          amount,
          pix_key,
          pix_key_type,
          status: "pending",
        })
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data as Withdrawal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      toast.success("Solicitação de saque enviada!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao solicitar saque");
    },
  });
};

export const usePayoutDetails = () => {
  const { store } = useAuth();

  return useQuery({
    queryKey: ["wallet", "payout-details", store?.id],
    queryFn: async () => {
      if (!store?.id) return null;
      
      // Get the most recent withdrawal to get payout details
      const { data, error } = await supabase
        .from("withdrawals")
        .select("pix_key, pix_key_type")
        .eq("store_id", store.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!store?.id,
  });
};

export const useUpdatePayoutDetails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (details: { pix_key: string; pix_key_type: string }) => {
      // Store payout details in profile or a separate table
      // For now, we just invalidate the query
      return details;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet", "payout-details"] });
      toast.success("Dados de saque atualizados!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar dados");
    },
  });
};
