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
import { Search, Eye, Ban, CheckCircle, Users } from "lucide-react";

const users = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@email.com",
    role: "lojista",
    store: "Loja Digital Pro",
    status: "active",
    lastAccess: "Hoje, 14:30",
    createdAt: "15/01/2024",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@email.com",
    role: "lojista",
    store: "E-books Master",
    status: "active",
    lastAccess: "Hoje, 10:15",
    createdAt: "10/01/2024",
  },
  {
    id: 3,
    name: "Pedro Costa",
    email: "pedro@email.com",
    role: "funcionario",
    store: "Cursos Online",
    status: "inactive",
    lastAccess: "05/01/2024",
    createdAt: "05/01/2024",
  },
  {
    id: 4,
    name: "Ana Oliveira",
    email: "ana@email.com",
    role: "lojista",
    store: "Templates Hub",
    status: "active",
    lastAccess: "Ontem, 18:45",
    createdAt: "01/01/2024",
  },
  {
    id: 5,
    name: "Carlos Admin",
    email: "carlos@admin.com",
    role: "admin",
    store: "-",
    status: "active",
    lastAccess: "Hoje, 09:00",
    createdAt: "01/12/2023",
  },
];

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-500/10 text-red-500">Admin</Badge>;
      case "lojista":
        return <Badge className="bg-primary/10 text-primary">Lojista</Badge>;
      case "funcionario":
        return <Badge className="bg-blue-500/10 text-blue-500">Funcionário</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Usuários</h1>
            <p className="text-muted-foreground mt-1">Gerencie todos os usuários da plataforma</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{users.length}</p>
              <p className="text-xs text-muted-foreground">Total de usuários</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Todos os Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Loja</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{user.store}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.status === "active"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {user.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.lastAccess}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          {user.status === "active" ? (
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

        {/* User Details Dialog */}
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Usuário</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="font-medium">{selectedUser.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Função</p>
                    {getRoleBadge(selectedUser.role)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Loja</p>
                    <p className="font-medium">{selectedUser.store}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Último Acesso</p>
                    <p className="font-medium">{selectedUser.lastAccess}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Data de Criação</p>
                    <p className="font-medium">{selectedUser.createdAt}</p>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedUser(null)}>
                    Fechar
                  </Button>
                  <Button variant="destructive">
                    <Ban className="w-4 h-4 mr-2" />
                    Bloquear Usuário
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
