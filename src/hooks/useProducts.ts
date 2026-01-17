import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/lib/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const useProducts = () => {
  const { store } = useAuth();

  return useQuery({
    queryKey: ["products", store?.id],
    queryFn: async () => {
      if (!store?.id) return [];
      
      const { data, error } = await supabase
        .from("products")
        .select("*, variations:product_variations(*)")
        .eq("store_id", store.id)
        .order("created_at", { ascending: false });
      
      if (error) throw new Error(error.message);
      return (data || []) as Product[];
    },
    enabled: !!store?.id,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, variations:product_variations(*)")
        .eq("id", id)
        .maybeSingle();
      
      if (error) throw new Error(error.message);
      return data as Product | null;
    },
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { store } = useAuth();

  return useMutation({
    mutationFn: async (product: Partial<Product>) => {
      if (!store?.id) throw new Error("Loja não encontrada");
      
      const { data, error } = await supabase
        .from("products")
        .insert({
          store_id: store.id,
          name: product.name || "",
          description: product.description,
          price: product.price || 0,
          stock: product.stock || 0,
          image_url: product.image_url,
          category_id: product.category_id,
          is_active: product.is_active ?? true,
        })
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produto criado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao criar produto");
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...product }: Partial<Product> & { id: string }) => {
      const { data, error } = await supabase
        .from("products")
        .update({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          image_url: product.image_url,
          category_id: product.category_id,
          is_active: product.is_active,
        })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produto atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar produto");
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);
      
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produto excluído com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao excluir produto");
    },
  });
};
