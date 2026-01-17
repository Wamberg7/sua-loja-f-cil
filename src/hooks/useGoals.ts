import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Goal {
  id: string;
  name: string;
  target_amount: number;
  reward_type: string;
  reward_description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  participants_count?: number;
  achieved_count?: number;
}

export const useAllGoals = () => {
  const queryClient = useQueryClient();

  const { data: goals, isLoading, error } = useQuery({
    queryKey: ['all-goals'],
    queryFn: async () => {
      const { data: goalsData, error: goalsError } = await supabase
        .from('goals')
        .select('*')
        .order('target_amount', { ascending: true });

      if (goalsError) throw goalsError;

      // Get user_goals stats for each goal
      const enrichedGoals = await Promise.all(
        (goalsData || []).map(async (goal) => {
          const { count: participantsCount } = await supabase
            .from('user_goals')
            .select('*', { count: 'exact', head: true })
            .eq('goal_id', goal.id);

          const { count: achievedCount } = await supabase
            .from('user_goals')
            .select('*', { count: 'exact', head: true })
            .eq('goal_id', goal.id)
            .not('achieved_at', 'is', null);

          return {
            ...goal,
            participants_count: participantsCount || 0,
            achieved_count: achievedCount || 0,
          } as Goal;
        })
      );

      return enrichedGoals;
    },
  });

  const createGoal = useMutation({
    mutationFn: async (goal: Omit<Goal, 'id' | 'created_at' | 'updated_at' | 'participants_count' | 'achieved_count'>) => {
      const { data, error } = await supabase
        .from('goals')
        .insert(goal)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-goals'] });
      toast.success("Meta criada!");
    },
    onError: (error) => {
      toast.error("Erro: " + error.message);
    },
  });

  const updateGoal = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Goal> & { id: string }) => {
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-goals'] });
      toast.success("Meta atualizada!");
    },
    onError: (error) => {
      toast.error("Erro: " + error.message);
    },
  });

  const totalAchieved = goals?.reduce((acc, g) => acc + (g.achieved_count || 0), 0) || 0;

  return {
    goals: goals || [],
    isLoading,
    error,
    createGoal,
    updateGoal,
    totalAchieved,
  };
};
