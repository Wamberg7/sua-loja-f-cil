import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WalletBalance, Wallet } from "@/lib/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const useWalletBalance = () => {
  const { store } = useAuth();

  return useQuery({
    queryKey: ["wallet", "balance", store?.id],
    queryFn: async (): Promise<WalletBalance> => {
      if (!store?.id) return { available: 0, pending: 0, reserved: 0 };
      
      const { data, error } = await supabase
        .from("wallets" as never)
        .select("*")
        .eq("store_id", store.id)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching wallet:", error);
        return { available: 0, pending: 0, reserved: 0 };
      }
      
      if (!data) {
        return { available: 0, pending: 0, reserved: 0 };
      }

      const wallet = data as unknown as Wallet;
      
      return {
        available: wallet.available || 0,
        pending: wallet.pending || 0,
        reserved: wallet.reserved || 0,
      };
    },
    enabled: !!store?.id,
  });
};

export const useWallet = () => {
  const { store } = useAuth();

  return useQuery({
    queryKey: ["wallet", store?.id],
    queryFn: async () => {
      if (!store?.id) return null;
      
      const { data, error } = await supabase
        .from("wallets" as never)
        .select("*")
        .eq("store_id", store.id)
        .maybeSingle();
      
      if (error) throw new Error(error.message);
      return data as unknown as Wallet | null;
    },
    enabled: !!store?.id,
  });
};

export const useAllWallets = () => {
  return useQuery({
    queryKey: ["wallets", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wallets" as never)
        .select("*, store:stores(name, slug)")
        .order("created_at", { ascending: false });
      
      if (error) throw new Error(error.message);
      return (data || []) as unknown as (Wallet & { store: { name: string; slug: string } })[];
    },
  });
};

export const useApproveWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (walletId: string) => {
      const { data, error } = await supabase
        .from("wallets" as never)
        .update({ is_approved: true } as never)
        .eq("id", walletId)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data as unknown as Wallet;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      toast.success("Carteira aprovada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao aprovar carteira");
    },
  });
};
