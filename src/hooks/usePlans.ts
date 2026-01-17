import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  max_products: number | null;
  max_monthly_views: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  subscribers_count?: number;
}

export const useAllPlans = () => {
  const queryClient = useQueryClient();

  const { data: plans, isLoading, error } = useQuery({
    queryKey: ['all-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('price', { ascending: true });

      if (error) throw error;
      return data as Plan[];
    },
  });

  const createPlan = useMutation({
    mutationFn: async (plan: Omit<Plan, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('plans')
        .insert(plan)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-plans'] });
      toast.success("Plano criado!");
    },
    onError: (error) => {
      toast.error("Erro: " + error.message);
    },
  });

  const updatePlan = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Plan> & { id: string }) => {
      const { data, error } = await supabase
        .from('plans')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-plans'] });
      toast.success("Plano atualizado!");
    },
    onError: (error) => {
      toast.error("Erro: " + error.message);
    },
  });

  return {
    plans: plans || [],
    isLoading,
    error,
    createPlan,
    updatePlan,
  };
};
