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
        .from("stores")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (error) throw new Error(error.message);
      return data as Store | null;
    },
    enabled: !!user?.id,
    initialData: store,
  });
};

export const useUpdateStore = () => {
  const queryClient = useQueryClient();
  const { store, refreshProfile } = useAuth();

  return useMutation({
    mutationFn: async (storeData: Partial<Store>) => {
      if (!store?.id) throw new Error("Loja não encontrada");
      
      const { data, error } = await supabase
        .from("stores")
        .update({
          name: storeData.name,
          slug: storeData.slug,
          description: storeData.description,
          logo_url: storeData.logo_url,
          category: storeData.category,
          is_active: storeData.is_active,
        })
        .eq("id", store.id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data as Store;
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
        .from("stores")
        .insert({
          user_id: user.id,
          name: storeData.name || "",
          slug: storeData.slug || "",
          description: storeData.description,
          logo_url: storeData.logo_url,
          category: storeData.category,
          is_active: true,
        })
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data as Store;
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

export const useRegenerateApiKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Generate a new API key (UUID-based)
      const newApiKey = crypto.randomUUID();
      return { api_key: newApiKey };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store", "me"] });
      toast.success("Nova chave de API gerada!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao gerar nova chave");
    },
  });
};
