import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type AppRole = "superadmin" | "admin" | "seller";

export const useUserRole = () => {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["user-roles", user?.id],
    queryFn: async (): Promise<AppRole[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching user roles:", error);
        return [];
      }

      return (data || []).map((r) => r.role as AppRole);
    },
    enabled: !!user?.id,
  });

  const hasRole = (role: AppRole): boolean => {
    return query.data?.includes(role) ?? false;
  };

  const isAdmin = (): boolean => {
    return hasRole("admin") || hasRole("superadmin");
  };

  const isSuperAdmin = (): boolean => {
    return hasRole("superadmin");
  };

  return {
    roles: query.data ?? [],
    isLoading: query.isLoading,
    hasRole,
    isAdmin,
    isSuperAdmin,
  };
};
