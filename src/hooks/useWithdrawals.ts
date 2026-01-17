import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  store?: {
    id: string;
    name: string;
    user_id: string;
  };
  profile?: {
    full_name: string | null;
    email: string;
  };
  wallet?: {
    available: number;
  };
}

export const useAllWithdrawals = () => {
  const queryClient = useQueryClient();

  const { data: withdrawals, isLoading, error } = useQuery({
    queryKey: ['all-withdrawals'],
    queryFn: async () => {
      // First get withdrawals with store info
      const { data: withdrawalsData, error: withdrawalsError } = await supabase
        .from('withdrawals')
        .select('*')
        .order('created_at', { ascending: false });

      if (withdrawalsError) throw withdrawalsError;

      // Get store and profile info for each withdrawal
      const enrichedWithdrawals = await Promise.all(
        (withdrawalsData || []).map(async (withdrawal) => {
          const { data: storeData } = await supabase
            .from('stores')
            .select('id, name, user_id')
            .eq('id', withdrawal.store_id)
            .maybeSingle();

          let profileData = null;
          let walletData = null;

          if (storeData) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name, email')
              .eq('user_id', storeData.user_id)
              .maybeSingle();
            profileData = profile;

            const { data: wallet } = await supabase
              .from('wallets')
              .select('available')
              .eq('store_id', storeData.id)
              .maybeSingle();
            walletData = wallet;
          }

          return {
            ...withdrawal,
            store: storeData,
            profile: profileData,
            wallet: walletData,
          } as Withdrawal;
        })
      );

      return enrichedWithdrawals;
    },
  });

  const updateWithdrawal = useMutation({
    mutationFn: async ({ id, status, reject_reason }: { id: string; status: string; reject_reason?: string }) => {
      const updates: Record<string, unknown> = { status };
      if (reject_reason) updates.reject_reason = reject_reason;
      if (status === 'completed') updates.completed_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('withdrawals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-withdrawals'] });
      toast.success("Saque atualizado!");
    },
    onError: (error) => {
      toast.error("Erro: " + error.message);
    },
  });

  const stats = {
    pending: withdrawals?.filter(w => w.status === 'pending').length || 0,
    pendingAmount: withdrawals?.filter(w => w.status === 'pending').reduce((acc, w) => acc + w.amount, 0) || 0,
    processing: withdrawals?.filter(w => w.status === 'processing').length || 0,
    processingAmount: withdrawals?.filter(w => w.status === 'processing').reduce((acc, w) => acc + w.amount, 0) || 0,
    completed: withdrawals?.filter(w => w.status === 'completed').length || 0,
    completedAmount: withdrawals?.filter(w => w.status === 'completed').reduce((acc, w) => acc + w.amount, 0) || 0,
  };

  return {
    withdrawals: withdrawals || [],
    isLoading,
    error,
    updateWithdrawal,
    stats,
  };
};
