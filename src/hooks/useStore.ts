import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Store } from "@/lib/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const useMyStore = () => {
  const { store, user } = useAuth();

  return useQuery({
    queryKey: ["store", "me", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("stores" as never)
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (error) throw new Error(error.message);
      return data as unknown as Store | null;
    },
    enabled: !!user?.id,
    initialData: store,
  });
};

export const useAllStores = () => {
  return useQuery({
    queryKey: ["stores", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stores" as never)
        .select("*, owner:profiles!stores_user_id_fkey(full_name, email)")
        .order("created_at", { ascending: false });
      
      if (error) throw new Error(error.message);
      return (data || []) as unknown as Store[];
    },
  });
};

export const useUpdateStore = () => {
  const queryClient = useQueryClient();
  const { store, refreshProfile } = useAuth();

  return useMutation({
    mutationFn: async (storeData: Partial<Store>) => {
      if (!store?.id) throw new Error("Loja não encontrada");
      
      const { data, error } = await supabase
        .from("stores" as never)
        .update({
          name: storeData.name,
          slug: storeData.slug,
          description: storeData.description,
          logo_url: storeData.logo_url,
          category: storeData.category,
          is_active: storeData.is_active,
        } as never)
        .eq("id", store.id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data as unknown as Store;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["store"] });
      await refreshProfile();
      toast.success("Loja atualizada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar loja");
    },
  });
};

export const useCreateStore = () => {
  const queryClient = useQueryClient();
  const { user, refreshProfile } = useAuth();

  return useMutation({
    mutationFn: async (storeData: Partial<Store>) => {
      if (!user?.id) throw new Error("Usuário não autenticado");
      
      const { data, error } = await supabase
        .from("stores" as never)
        .insert({
          user_id: user.id,
          name: storeData.name || "",
          slug: storeData.slug || "",
          description: storeData.description,
          logo_url: storeData.logo_url,
          category: storeData.category,
          is_active: true,
        } as never)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data as unknown as Store;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["store"] });
      await refreshProfile();
      toast.success("Loja criada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao criar loja");
    },
  });
};

export const useToggleStoreStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { data, error } = await supabase
        .from("stores" as never)
        .update({ is_active } as never)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data as unknown as Store;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      toast.success("Status da loja atualizado!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar status");
    },
  });
};
