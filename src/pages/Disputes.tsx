import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertTriangle,
  Plus,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  FileText
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useDisputes } from "@/hooks/useDisputes";
import { useOrders } from "@/hooks/useOrders";

const statusConfig: Record<string, { label: string; icon: React.ElementType; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pendente", icon: Clock, variant: "secondary" },
  analyzing: { label: "Em Análise", icon: Eye, variant: "default" },
  resolved: { label: "Resolvido", icon: CheckCircle, variant: "outline" },
  rejected: { label: "Rejeitado", icon: XCircle, variant: "destructive" },
};

const reasonOptions = [
  { value: "product_not_received", label: "Produto não recebido" },
  { value: "product_damaged", label: "Produto danificado" },
  { value: "wrong_product", label: "Produto errado" },
  { value: "unauthorized_charge", label: "Cobrança não autorizada" },
  { value: "duplicate_charge", label: "Cobrança duplicada" },
  { value: "refund_not_processed", label: "Reembolso não processado" },
  { value: "other", label: "Outro" },
];

const Disputes = () => {
  const { disputes, isLoading, createDispute } = useDisputes();
  const ordersQuery = useOrders();
  const orders = ordersQuery.data || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<typeof disputes[0] | null>(null);

  // Form state
  const [formOrderId, setFormOrderId] = useState("");
  const [formReason, setFormReason] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formAmount, setFormAmount] = useState("");

  const filteredDisputes = disputes.filter((dispute) => {
    const matchesSearch =
      dispute.order?.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.order?.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || dispute.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreateDispute = async () => {
    if (!formOrderId || !formReason) return;

    await createDispute.mutateAsync({
      order_id: formOrderId,
      reason: formReason,
      description: formDescription || undefined,
      amount: parseInt(formAmount) || 0,
    });

    setIsCreateOpen(false);
    setFormOrderId("");
    setFormReason("");
    setFormDescription("");
    setFormAmount("");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100);
  };

  const getReasonLabel = (reason: string) => {
    return reasonOptions.find(r => r.value === reason)?.label || reason;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Med/Contestações</h1>
            <p className="text-muted-foreground">
              Gerencie disputas e contestações de pagamentos
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Contestação
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Contestação</DialogTitle>
                <DialogDescription>
                  Registre uma nova contestação de pagamento
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Pedido</Label>
                  <Select value={formOrderId} onValueChange={setFormOrderId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um pedido" />
                    </SelectTrigger>
                    <SelectContent>
                      {orders.map((order) => (
                        <SelectItem key={order.id} value={order.id}>
                          #{order.id.slice(0, 8)} - {order.customer_email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Motivo</Label>
                  <Select value={formReason} onValueChange={setFormReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o motivo" />
                    </SelectTrigger>
                    <SelectContent>
                      {reasonOptions.map((reason) => (
                        <SelectItem key={reason.value} value={reason.value}>
                          {reason.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Valor Contestado (em centavos)</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 9900 (R$ 99,00)"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descrição (opcional)</Label>
                  <Textarea
                    placeholder="Descreva os detalhes da contestação..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateDispute} disabled={!formOrderId || !formReason}>
                  Criar Contestação
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {disputes.filter(d => d.status === 'pending').length}
                </p>
                <p className="text-sm text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {disputes.filter(d => d.status === 'analyzing').length}
                </p>
                <p className="text-sm text-muted-foreground">Em Análise</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {disputes.filter(d => d.status === 'resolved').length}
                </p>
                <p className="text-sm text-muted-foreground">Resolvidas</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {disputes.filter(d => d.status === 'rejected').length}
                </p>
                <p className="text-sm text-muted-foreground">Rejeitadas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente ou motivo..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="analyzing">Em Análise</SelectItem>
              <SelectItem value="resolved">Resolvido</SelectItem>
              <SelectItem value="rejected">Rejeitado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              Carregando contestações...
            </div>
          ) : filteredDisputes.length === 0 ? (
            <div className="p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma contestação encontrada</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-[80px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDisputes.map((dispute) => {
                  const config = statusConfig[dispute.status] || statusConfig.pending;
                  const StatusIcon = config.icon;

                  return (
                    <TableRow key={dispute.id}>
                      <TableCell className="font-mono text-sm">
                        #{dispute.order_id.slice(0, 8)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">
                            {dispute.order?.customer_name || "—"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {dispute.order?.customer_email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{getReasonLabel(dispute.reason)}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(dispute.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={config.variant} className="gap-1">
                          <StatusIcon className="w-3 h-3" />
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(dispute.created_at), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedDispute(dispute)}
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Detail Dialog */}
        <Dialog open={!!selectedDispute} onOpenChange={() => setSelectedDispute(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Detalhes da Contestação</DialogTitle>
            </DialogHeader>
            {selectedDispute && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Pedido</p>
                    <p className="font-mono font-medium">#{selectedDispute.order_id.slice(0, 8)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Contestado</p>
                    <p className="font-medium">{formatCurrency(selectedDispute.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={statusConfig[selectedDispute.status]?.variant}>
                      {statusConfig[selectedDispute.status]?.label}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Criado em</p>
                    <p>{format(new Date(selectedDispute.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Motivo</p>
                  <p className="font-medium">{getReasonLabel(selectedDispute.reason)}</p>
                </div>
                {selectedDispute.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">Descrição</p>
                    <p className="text-foreground">{selectedDispute.description}</p>
                  </div>
                )}
                {selectedDispute.resolution && (
                  <div>
                    <p className="text-sm text-muted-foreground">Resolução</p>
                    <p className="text-foreground">{selectedDispute.resolution}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Disputes;
