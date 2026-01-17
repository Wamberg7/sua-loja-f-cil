import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface WithdrawalRequest {
  amount: number;
  pix_key: string;
  pix_type: string;
}

export interface Withdrawal {
  id: string;
  store_id: string;
  amount: number;
  pix_key: string;
  pix_type: string;
  status: string;
  reject_reason: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export const useSellerWithdrawals = () => {
  const { store } = useAuth();

  return useQuery({
    queryKey: ["withdrawals", store?.id],
    queryFn: async () => {
      if (!store?.id) return [];

      const { data, error } = await supabase
        .from("withdrawals")
        .select("*")
        .eq("store_id", store.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Withdrawal[];
    },
    enabled: !!store?.id,
  });
};

export const useCreateWithdrawal = () => {
  const { store } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (withdrawal: WithdrawalRequest) => {
      if (!store?.id) throw new Error("Loja não encontrada");

      const { data, error } = await supabase
        .from("withdrawals")
        .insert({
          store_id: store.id,
          amount: withdrawal.amount,
          pix_key: withdrawal.pix_key,
          pix_type: withdrawal.pix_type,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data as Withdrawal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      toast.success("Solicitação de saque enviada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao solicitar saque");
    },
  });
};
