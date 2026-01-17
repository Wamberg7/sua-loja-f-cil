import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/lib/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const useCategories = () => {
  const { store } = useAuth();

  return useQuery({
    queryKey: ["categories", store?.id],
    queryFn: async () => {
      if (!store?.id) return [];
      
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("store_id", store.id)
        .order("name", { ascending: true });
      
      if (error) throw new Error(error.message);
      return (data || []) as Category[];
    },
    enabled: !!store?.id,
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      
      if (error) throw new Error(error.message);
      return data as Category | null;
    },
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { store } = useAuth();

  return useMutation({
    mutationFn: async (category: Partial<Category>) => {
      if (!store?.id) throw new Error("Loja não encontrada");
      
      const { data, error } = await supabase
        .from("categories")
        .insert({
          store_id: store.id,
          name: category.name || "",
          description: category.description,
          is_active: category.is_active ?? true,
        })
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data as Category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoria criada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao criar categoria");
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...category }: Partial<Category> & { id: string }) => {
      const { data, error } = await supabase
        .from("categories")
        .update({
          name: category.name,
          description: category.description,
          is_active: category.is_active,
        })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data as Category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoria atualizada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar categoria");
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);
      
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoria excluída com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao excluir categoria");
    },
  });
};
