import { AdminHeader } from "@/components/admin/AdminHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Download, Eye } from "lucide-react";
import { useState } from "react";

const logs = [
  {
    id: 1,
    action: "Usuário banido",
    actor: "SuperAdmin",
    target: "João Silva",
    type: "security",
    ip: "192.168.1.1",
    timestamp: "17/01/2024 14:32:45",
    details: "Motivo: Violação dos termos de uso",
  },
  {
    id: 2,
    action: "Loja pausada",
    actor: "Admin Maria",
    target: "Digital Assets",
    type: "moderation",
    ip: "192.168.1.2",
    timestamp: "17/01/2024 13:21:12",
    details: "Produtos suspeitos detectados",
  },
  {
    id: 3,
    action: "Configuração alterada",
    actor: "SuperAdmin",
    target: "Taxa da plataforma",
    type: "config",
    ip: "192.168.1.1",
    timestamp: "17/01/2024 11:45:30",
    details: "Alterado de 4.5% para 5%",
  },
  {
    id: 4,
    action: "Usuário reativado",
    actor: "Admin Maria",
    target: "Pedro Gamer",
    type: "moderation",
    ip: "192.168.1.2",
    timestamp: "17/01/2024 10:15:22",
    details: "Suspensão removida após revisão",
  },
  {
    id: 5,
    action: "Gateway atualizado",
    actor: "SuperAdmin",
    target: "Mercado Pago",
    type: "config",
    ip: "192.168.1.1",
    timestamp: "16/01/2024 18:33:10",
    details: "Chaves de API atualizadas",
  },
  {
    id: 6,
    action: "Tentativa de login suspeita",
    actor: "Sistema",
    target: "lucas@email.com",
    type: "security",
    ip: "45.123.67.89",
    timestamp: "16/01/2024 16:22:05",
    details: "5 tentativas falhas em 2 minutos",
  },
  {
    id: 7,
    action: "Novo admin criado",
    actor: "SuperAdmin",
    target: "maria@storelab.com",
    type: "admin",
    ip: "192.168.1.1",
    timestamp: "16/01/2024 09:10:45",
    details: "Permissões: moderação, suporte",
  },
];

const typeConfig = {
  security: { label: "Segurança", className: "bg-destructive/20 text-destructive border-destructive/30" },
  moderation: { label: "Moderação", className: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" },
  config: { label: "Configuração", className: "bg-primary/20 text-primary border-primary/30" },
  admin: { label: "Admin", className: "bg-accent/20 text-accent border-accent/30" },
};

const AdminLogs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || log.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Logs & Auditoria"
        subtitle="Histórico de ações administrativas"
      />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ação, ator ou alvo..."
              className="pl-9 bg-card border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-card border-border">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="security">Segurança</SelectItem>
              <SelectItem value="moderation">Moderação</SelectItem>
              <SelectItem value="config">Configuração</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>

        {/* Logs List */}
        <div className="space-y-4">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge
                      variant="outline"
                      className={typeConfig[log.type as keyof typeof typeConfig].className}
                    >
                      {typeConfig[log.type as keyof typeof typeConfig].label}
                    </Badge>
                    <span className="font-semibold">{log.action}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span>Por: <strong className="text-foreground">{log.actor}</strong></span>
                    <span>Alvo: <strong className="text-foreground">{log.target}</strong></span>
                    <span>IP: {log.ip}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{log.details}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {log.timestamp}
                  </span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminLogs;
