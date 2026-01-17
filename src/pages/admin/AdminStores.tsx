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
import { Search, Eye, Ban, CheckCircle, Store } from "lucide-react";

const stores = [
  {
    id: 1,
    name: "Loja Digital Pro",
    owner: "João Silva",
    email: "joao@email.com",
    plan: "Pro",
    status: "active",
    sales: "R$ 45.890",
    createdAt: "15/01/2024",
  },
  {
    id: 2,
    name: "E-books Master",
    owner: "Maria Santos",
    email: "maria@email.com",
    plan: "Business",
    status: "active",
    sales: "R$ 32.450",
    createdAt: "10/01/2024",
  },
  {
    id: 3,
    name: "Cursos Online",
    owner: "Pedro Costa",
    email: "pedro@email.com",
    plan: "Starter",
    status: "suspended",
    sales: "R$ 12.300",
    createdAt: "05/01/2024",
  },
  {
    id: 4,
    name: "Templates Hub",
    owner: "Ana Oliveira",
    email: "ana@email.com",
    plan: "Pro",
    status: "active",
    sales: "R$ 28.900",
    createdAt: "01/01/2024",
  },
];

export default function AdminStores() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState<typeof stores[0] | null>(null);

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Lojas</h1>
            <p className="text-muted-foreground mt-1">Gerencie todas as lojas da plataforma</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Store className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stores.length}</p>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loja</TableHead>
                  <TableHead>Proprietário</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Vendas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criada em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStores.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell className="font-medium">{store.name}</TableCell>
                    <TableCell>
                      <div>
                        <p>{store.owner}</p>
                        <p className="text-sm text-muted-foreground">{store.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{store.plan}</Badge>
                    </TableCell>
                    <TableCell>{store.sales}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          store.status === "active"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-red-500/10 text-red-500"
                        }
                      >
                        {store.status === "active" ? "Ativa" : "Suspensa"}
                      </Badge>
                    </TableCell>
                    <TableCell>{store.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedStore(store)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          {store.status === "active" ? (
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
                    <p className="text-sm text-muted-foreground">Proprietário</p>
                    <p className="font-medium">{selectedStore.owner}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedStore.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Plano</p>
                    <p className="font-medium">{selectedStore.plan}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total em Vendas</p>
                    <p className="font-medium">{selectedStore.sales}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Data de Criação</p>
                    <p className="font-medium">{selectedStore.createdAt}</p>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedStore(null)}>
                    Fechar
                  </Button>
                  <Button variant="destructive">
                    <Ban className="w-4 h-4 mr-2" />
                    Suspender Loja
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
