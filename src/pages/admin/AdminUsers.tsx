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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  MoreHorizontal,
  Eye,
  Ban,
  Shield,
  Mail,
  UserCheck,
  UserX,
  Filter,
} from "lucide-react";
import { useState } from "react";

const users = [
  {
    id: 1,
    name: "Lucas Mendes",
    email: "lucas@email.com",
    avatar: "LM",
    role: "seller",
    status: "active",
    stores: 2,
    sales: 156,
    revenue: "R$ 12.450",
    createdAt: "15/01/2024",
    isMinor: false,
  },
  {
    id: 2,
    name: "Ana Carolina",
    email: "ana@email.com",
    avatar: "AC",
    role: "seller",
    status: "active",
    stores: 1,
    sales: 89,
    revenue: "R$ 8.320",
    createdAt: "22/02/2024",
    isMinor: false,
  },
  {
    id: 3,
    name: "Pedro Gamer",
    email: "pedro@email.com",
    avatar: "PG",
    role: "seller",
    status: "suspended",
    stores: 1,
    sales: 234,
    revenue: "R$ 18.900",
    createdAt: "08/03/2024",
    isMinor: true,
  },
  {
    id: 4,
    name: "Maria Santos",
    email: "maria@email.com",
    avatar: "MS",
    role: "admin",
    status: "active",
    stores: 0,
    sales: 0,
    revenue: "-",
    createdAt: "01/01/2024",
    isMinor: false,
  },
  {
    id: 5,
    name: "João Silva",
    email: "joao@email.com",
    avatar: "JS",
    role: "seller",
    status: "banned",
    stores: 1,
    sales: 45,
    revenue: "R$ 3.200",
    createdAt: "10/04/2024",
    isMinor: false,
  },
];

const statusConfig = {
  active: { label: "Ativo", className: "bg-success/20 text-success border-success/30" },
  suspended: { label: "Suspenso", className: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" },
  banned: { label: "Banido", className: "bg-destructive/20 text-destructive border-destructive/30" },
};

const roleConfig = {
  seller: { label: "Vendedor", className: "bg-primary/20 text-primary border-primary/30" },
  admin: { label: "Admin", className: "bg-accent/20 text-accent border-accent/30" },
};

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Gerenciamento de Usuários"
        subtitle={`${users.length} usuários cadastrados`}
      />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
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
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="suspended">Suspensos</SelectItem>
              <SelectItem value="banned">Banidos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Users Table */}
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Lojas
                  </th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Vendas
                  </th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Faturamento
                  </th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Cadastro
                  </th>
                  <th className="text-right py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-sm font-bold">
                            {user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{user.name}</span>
                            {user.isMinor && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
                                -18
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className={roleConfig[user.role as keyof typeof roleConfig].className}>
                        {roleConfig[user.role as keyof typeof roleConfig].label}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className={statusConfig[user.status as keyof typeof statusConfig].className}>
                        {statusConfig[user.status as keyof typeof statusConfig].label}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">{user.stores}</td>
                    <td className="py-4 px-4 text-muted-foreground">{user.sales}</td>
                    <td className="py-4 px-4 font-medium">{user.revenue}</td>
                    <td className="py-4 px-4 text-muted-foreground text-sm">{user.createdAt}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end">
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
                              <Mail className="w-4 h-4" />
                              Enviar email
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Shield className="w-4 h-4" />
                              Alterar permissões
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === "active" ? (
                              <DropdownMenuItem className="gap-2 text-yellow-500">
                                <UserX className="w-4 h-4" />
                                Suspender
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="gap-2 text-success">
                                <UserCheck className="w-4 h-4" />
                                Reativar
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="gap-2 text-destructive">
                              <Ban className="w-4 h-4" />
                              Banir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
