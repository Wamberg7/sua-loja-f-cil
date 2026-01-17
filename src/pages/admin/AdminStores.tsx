import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Eye, Ban, CheckCircle, Store as StoreIcon, Loader2 } from "lucide-react";
import { useAllStores, useToggleStoreStatus } from "@/hooks/useStore";
import { Store } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface StoreWithDetails extends Store {
  owner?: {
    full_name: string | null;
    email: string;
  } | null;
  total_sales?: number;
  orders_count?: number;
  products_count?: number;
}

export default function AdminStores() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState<StoreWithDetails | null>(null);
  const toggleStatus = useToggleStoreStatus();

  // Fetch stores with additional data
  const { data: stores, isLoading } = useQuery({
    queryKey: ["stores", "admin-list"],
    queryFn: async () => {
      // Get all stores
      const { data: storesData, error: storesError } = await supabase
        .from("stores" as never)
        .select("*")
        .order("created_at", { ascending: false });

      if (storesError) throw new Error(storesError.message);

      // Get profiles for owners
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, full_name, email");

      if (profilesError) throw new Error(profilesError.message);

      // Get orders for each store
      const { data: orders, error: ordersError } = await supabase
        .from("orders" as never)
        .select("store_id, total, status");

      if (ordersError) throw new Error(ordersError.message);

      // Get products count for each store
      const { data: products, error: productsError } = await supabase
        .from("products" as never)
        .select("store_id");

      if (productsError) throw new Error(productsError.message);

      // Combine data
      const storesWithDetails: StoreWithDetails[] = ((storesData || []) as Store[]).map((store) => {
        const owner = (profiles || []).find((p) => p.user_id === store.user_id);
        const storeOrders = ((orders || []) as { store_id: string; total: number; status: string }[]).filter(
          (o) => o.store_id === store.id
        );
        const paidOrders = storeOrders.filter((o) => o.status === "paid");
        const storeProducts = ((products || []) as { store_id: string }[]).filter(
          (p) => p.store_id === store.id
        );

        return {
          ...store,
          owner: owner ? { full_name: owner.full_name, email: owner.email } : null,
          total_sales: paidOrders.reduce((sum, o) => sum + Number(o.total), 0),
          orders_count: storeOrders.length,
          products_count: storeProducts.length,
        };
      });

      return storesWithDetails;
    },
  });

  const filteredStores = (stores || []).filter(
    (store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (store.owner?.full_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (store.owner?.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100);
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: ptBR,
    });
  };

  const handleToggleStatus = async (store: StoreWithDetails) => {
    await toggleStatus.mutateAsync({
      id: store.id,
      is_active: !store.is_active,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Lojas</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie todas as lojas da plataforma
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <StoreIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stores?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Total de lojas</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por nome da loja ou proprietário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stores Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Todas as Lojas</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredStores.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                Nenhuma loja encontrada
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loja</TableHead>
                    <TableHead>Proprietário</TableHead>
                    <TableHead>Produtos</TableHead>
                    <TableHead>Pedidos</TableHead>
                    <TableHead>Vendas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criada</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStores.map((store) => (
                    <TableRow key={store.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{store.name}</p>
                          <p className="text-sm text-muted-foreground">{store.slug}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{store.owner?.full_name || "Sem nome"}</p>
                          <p className="text-sm text-muted-foreground">
                            {store.owner?.email || "-"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{store.products_count || 0}</TableCell>
                      <TableCell>{store.orders_count || 0}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(store.total_sales || 0)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            store.is_active
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-red-500/10 text-red-500"
                          }
                        >
                          {store.is_active ? "Ativa" : "Inativa"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(store.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedStore(store)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleStatus(store)}
                            disabled={toggleStatus.isPending}
                          >
                            {store.is_active ? (
                              <Ban className="w-4 h-4 text-red-500" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Store Details Dialog */}
        <Dialog open={!!selectedStore} onOpenChange={() => setSelectedStore(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes da Loja</DialogTitle>
            </DialogHeader>
            {selectedStore && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Nome da Loja</p>
                    <p className="font-medium">{selectedStore.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Slug</p>
                    <p className="font-medium">{selectedStore.slug}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Proprietário</p>
                    <p className="font-medium">
                      {selectedStore.owner?.full_name || "Sem nome"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedStore.owner?.email || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total de Produtos</p>
                    <p className="font-medium">{selectedStore.products_count || 0}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total de Pedidos</p>
                    <p className="font-medium">{selectedStore.orders_count || 0}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total em Vendas</p>
                    <p className="font-medium text-lg">
                      {formatCurrency(selectedStore.total_sales || 0)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Data de Criação</p>
                    <p className="font-medium">
                      {new Date(selectedStore.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-sm text-muted-foreground">Descrição</p>
                    <p className="font-medium">
                      {selectedStore.description || "Sem descrição"}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedStore(null)}>
                    Fechar
                  </Button>
                  <Button
                    variant={selectedStore.is_active ? "destructive" : "default"}
                    onClick={() => {
                      handleToggleStatus(selectedStore);
                      setSelectedStore(null);
                    }}
                  >
                    {selectedStore.is_active ? (
                      <>
                        <Ban className="w-4 h-4 mr-2" />
                        Desativar Loja
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Ativar Loja
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
