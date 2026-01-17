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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, FileText, AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

const logs = [
  {
    id: 1,
    type: "info",
    action: "Login realizado",
    user: "joao@email.com",
    details: "IP: 189.10.45.123",
    timestamp: "15/01/2024 14:30:45",
  },
  {
    id: 2,
    type: "success",
    action: "Saque aprovado",
    user: "admin@digitalhub.com",
    details: "Saque #SAQ-001 - R$ 2.500,00 - Loja Digital Pro",
    timestamp: "15/01/2024 14:25:12",
  },
  {
    id: 3,
    type: "warning",
    action: "Tentativa de login bloqueada",
    user: "suspicious@email.com",
    details: "3 tentativas falhas em 5 minutos",
    timestamp: "15/01/2024 14:20:33",
  },
  {
    id: 4,
    type: "error",
    action: "Falha no pagamento",
    user: "maria@email.com",
    details: "Erro: Cartão recusado - Gateway timeout",
    timestamp: "15/01/2024 14:15:22",
  },
  {
    id: 5,
    type: "info",
    action: "Produto criado",
    user: "pedro@email.com",
    details: "Produto: Curso de Design - Loja Templates Hub",
    timestamp: "15/01/2024 14:10:55",
  },
  {
    id: 6,
    type: "success",
    action: "Carteira aprovada",
    user: "admin@digitalhub.com",
    details: "Loja: E-books Master - CPF verificado",
    timestamp: "15/01/2024 14:05:18",
  },
  {
    id: 7,
    type: "info",
    action: "Plano alterado",
    user: "ana@email.com",
    details: "Starter → Pro - Templates Hub",
    timestamp: "15/01/2024 14:00:00",
  },
  {
    id: 8,
    type: "warning",
    action: "Limite de produtos atingido",
    user: "carlos@email.com",
    details: "Plano Starter - 5/5 produtos",
    timestamp: "15/01/2024 13:55:42",
  },
];

export default function AdminLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || log.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "success":
        return <Badge className="bg-emerald-500/10 text-emerald-500">Sucesso</Badge>;
      case "warning":
        return <Badge className="bg-amber-500/10 text-amber-500">Aviso</Badge>;
      case "error":
        return <Badge className="bg-red-500/10 text-red-500">Erro</Badge>;
      default:
        return <Badge className="bg-blue-500/10 text-blue-500">Info</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Logs & Auditoria</h1>
            <p className="text-muted-foreground mt-1">Histórico de atividades da plataforma</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{logs.length}</p>
              <p className="text-xs text-muted-foreground">Registros hoje</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por ação, usuário ou detalhes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Sucesso</SelectItem>
                  <SelectItem value="warning">Aviso</SelectItem>
                  <SelectItem value="error">Erro</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">Exportar</Button>
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Histórico de Atividades</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Detalhes</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data/Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{getTypeIcon(log.type)}</TableCell>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {log.details}
                    </TableCell>
                    <TableCell>{getTypeBadge(log.type)}</TableCell>
                    <TableCell className="text-muted-foreground">{log.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
