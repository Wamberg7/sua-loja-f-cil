import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MoreHorizontal,
  Eye,
  Pause,
  Play,
  Trash2,
  ExternalLink,
  Filter,
  Store,
} from "lucide-react";
import { useState } from "react";

const stores = [
  {
    id: 1,
    name: "GameKeys Pro",
    owner: "Lucas Mendes",
    status: "active",
    products: 45,
    sales: 1234,
    revenue: "R$ 45.230",
    createdAt: "15/01/2024",
    url: "gamekeys-pro",
  },
  {
    id: 2,
    name: "Design Templates",
    owner: "Ana Carolina",
    status: "active",
    products: 23,
    sales: 567,
    revenue: "R$ 28.450",
    createdAt: "22/02/2024",
    url: "design-templates",
  },
  {
    id: 3,
    name: "Pedro VIP Store",
    owner: "Pedro Gamer",
    status: "paused",
    products: 12,
    sales: 890,
    revenue: "R$ 18.900",
    createdAt: "08/03/2024",
    url: "pedro-vip",
  },
  {
    id: 4,
    name: "Cursos Online BR",
    owner: "Maria Santos",
    status: "active",
    products: 8,
    sales: 234,
    revenue: "R$ 52.100",
    createdAt: "01/04/2024",
    url: "cursos-online-br",
  },
  {
    id: 5,
    name: "Digital Assets",
    owner: "João Silva",
    status: "removed",
    products: 0,
    sales: 45,
    revenue: "R$ 3.200",
    createdAt: "10/04/2024",
    url: "digital-assets",
  },
];

const statusConfig = {
  active: { label: "Ativa", className: "bg-success/20 text-success border-success/30" },
  paused: { label: "Pausada", className: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" },
  removed: { label: "Removida", className: "bg-destructive/20 text-destructive border-destructive/30" },
};

const AdminStores = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredStores = stores.filter((store) => {
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || store.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Gerenciamento de Lojas"
        subtitle={`${stores.filter(s => s.status === "active").length} lojas ativas`}
      />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou proprietário..."
              className="pl-9 bg-card border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-card border-border">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="active">Ativas</SelectItem>
              <SelectItem value="paused">Pausadas</SelectItem>
              <SelectItem value="removed">Removidas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stores Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStores.map((store) => (
            <div
              key={store.id}
              className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Store className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{store.name}</h3>
                    <p className="text-xs text-muted-foreground">{store.owner}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2">
                      <Eye className="w-4 h-4" />
                      Ver detalhes
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Abrir loja
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {store.status === "active" ? (
                      <DropdownMenuItem className="gap-2 text-yellow-500">
                        <Pause className="w-4 h-4" />
                        Pausar loja
                      </DropdownMenuItem>
                    ) : store.status === "paused" ? (
                      <DropdownMenuItem className="gap-2 text-success">
                        <Play className="w-4 h-4" />
                        Reativar loja
                      </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuItem className="gap-2 text-destructive">
                      <Trash2 className="w-4 h-4" />
                      Remover loja
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Badge
                variant="outline"
                className={statusConfig[store.status as keyof typeof statusConfig].className}
              >
                {statusConfig[store.status as keyof typeof statusConfig].label}
              </Badge>

              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Produtos</p>
                  <p className="font-semibold">{store.products}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Vendas</p>
                  <p className="font-semibold">{store.sales}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Faturamento</p>
                  <p className="font-semibold text-success">{store.revenue}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span>Criada em {store.createdAt}</span>
                <span className="text-primary">/{store.url}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminStores;
