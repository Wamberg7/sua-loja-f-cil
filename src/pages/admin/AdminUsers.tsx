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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, Shield, Users, Loader2, UserCheck, UserX } from "lucide-react";
import { useAllUsers, useUpdateUserRole, UserWithDetails } from "@/hooks/useUsers";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(null);
  const { data: users, isLoading } = useAllUsers();
  const updateRole = useUpdateUserRole();

  const filteredUsers = (users || []).filter(
    (user) =>
      (user.full_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (roles: UserWithDetails["roles"]) => {
    if (roles.some((r) => r.role === "superadmin")) {
      return <Badge className="bg-red-500/10 text-red-500">Super Admin</Badge>;
    }
    if (roles.some((r) => r.role === "admin")) {
      return <Badge className="bg-orange-500/10 text-orange-500">Admin</Badge>;
    }
    if (roles.some((r) => r.role === "seller")) {
      return <Badge className="bg-primary/10 text-primary">Vendedor</Badge>;
    }
    return <Badge variant="outline">Sem role</Badge>;
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const user = users?.find((u) => u.user_id === userId);
    if (!user) return;

    // Remove current roles and add new one
    for (const role of user.roles) {
      await updateRole.mutateAsync({ userId, role: role.role, action: "remove" });
    }

    if (newRole !== "none") {
      await updateRole.mutateAsync({
        userId,
        role: newRole as "superadmin" | "admin" | "seller",
        action: "add",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: ptBR,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Usuários</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie todos os usuários da plataforma
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{users?.length || 0}</p>
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
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                Nenhum usuário encontrado
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Loja</TableHead>
                    <TableHead>Menor de Idade</TableHead>
                    <TableHead>Criado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.full_name || "Sem nome"}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.roles)}</TableCell>
                      <TableCell>
                        {user.store ? (
                          <span className="text-foreground">{user.store.name}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.is_minor ? (
                          <Badge className="bg-amber-500/10 text-amber-500">Menor</Badge>
                        ) : (
                          <span className="text-muted-foreground">Não</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(user.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Eye className="w-4 h-4" />
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
                    <p className="font-medium">{selectedUser.full_name || "Sem nome"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Role Atual</p>
                    {getRoleBadge(selectedUser.roles)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Loja</p>
                    <p className="font-medium">
                      {selectedUser.store?.name || "Sem loja"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Menor de Idade</p>
                    <p className="font-medium">{selectedUser.is_minor ? "Sim" : "Não"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Data de Criação</p>
                    <p className="font-medium">
                      {new Date(selectedUser.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Alterar Role
                  </p>
                  <Select
                    defaultValue={
                      selectedUser.roles.some((r) => r.role === "superadmin")
                        ? "superadmin"
                        : selectedUser.roles.some((r) => r.role === "admin")
                        ? "admin"
                        : selectedUser.roles.some((r) => r.role === "seller")
                        ? "seller"
                        : "none"
                    }
                    onValueChange={(value) =>
                      handleRoleChange(selectedUser.user_id, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="superadmin">Super Admin</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="seller">Vendedor</SelectItem>
                      <SelectItem value="none">Sem role</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedUser(null)}>
                    Fechar
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
