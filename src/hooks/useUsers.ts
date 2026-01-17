import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile, UserRole } from "@/lib/types";
import { toast } from "sonner";

export interface UserWithDetails extends Profile {
  roles: UserRole[];
  store?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export const useAllUsers = () => {
  return useQuery({
    queryKey: ["users", "all"],
    queryFn: async () => {
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw new Error(profilesError.message);

      // Get all user roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw new Error(rolesError.message);

      // Get all stores
      const { data: stores, error: storesError } = await supabase
        .from("stores" as never)
        .select("id, name, slug, user_id");

      if (storesError) throw new Error(storesError.message);

      // Combine the data
      const usersWithDetails: UserWithDetails[] = (profiles || []).map((profile) => {
        const userRoles = (roles || []).filter((r) => r.user_id === profile.user_id);
        const userStore = ((stores || []) as { id: string; name: string; slug: string; user_id: string }[]).find(
          (s) => s.user_id === profile.user_id
        );

        return {
          ...profile,
          roles: userRoles as UserRole[],
          store: userStore ? { id: userStore.id, name: userStore.name, slug: userStore.slug } : null,
        };
      });

      return usersWithDetails;
    },
  });
};

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ["users", userId],
    queryFn: async () => {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (profileError) throw new Error(profileError.message);
      if (!profile) return null;

      const { data: roles } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", userId);

      const { data: store } = await supabase
        .from("stores" as never)
        .select("id, name, slug")
        .eq("user_id", userId)
        .maybeSingle();

      return {
        ...profile,
        roles: (roles || []) as UserRole[],
        store: store as { id: string; name: string; slug: string } | null,
      } as UserWithDetails;
    },
    enabled: !!userId,
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      role,
      action,
    }: {
      userId: string;
      role: "superadmin" | "admin" | "seller";
      action: "add" | "remove";
    }) => {
      if (action === "add") {
        const { error } = await supabase.from("user_roles").insert({
          user_id: userId,
          role,
        });
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", role);
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Role atualizada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar role");
    },
  });
};

export const useBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, blocked }: { userId: string; blocked: boolean }) => {
      // We'll use a custom field or just remove all roles to "block"
      // For now, we'll just invalidate queries - in production you'd want a proper blocked field
      if (blocked) {
        // Remove all roles except seller
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .neq("role", "seller");
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuário atualizado!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar usuário");
    },
  });
};
