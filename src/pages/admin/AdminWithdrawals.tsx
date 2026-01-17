import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, Eye, CheckCircle, XCircle, Wallet, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { useAllWithdrawals, Withdrawal } from "@/hooks/useWithdrawals";

export default function AdminWithdrawals() {
  const { withdrawals, isLoading, updateWithdrawal, stats } = useAllWithdrawals();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    const matchesSearch =
      withdrawal.store?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || withdrawal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-500/10 text-emerald-500">Concluído</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/10 text-amber-500">Pendente</Badge>;
      case "processing":
        return <Badge className="bg-blue-500/10 text-blue-500">Processando</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/10 text-red-500">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleApprove = async () => {
    if (!selectedWithdrawal) return;
    await updateWithdrawal.mutateAsync({ id: selectedWithdrawal.id, status: 'processing' });
    setSelectedWithdrawal(null);
  };

  const handleComplete = async () => {
    if (!selectedWithdrawal) return;
    await updateWithdrawal.mutateAsync({ id: selectedWithdrawal.id, status: 'completed' });
    setSelectedWithdrawal(null);
  };

  const handleReject = async () => {
    if (!selectedWithdrawal) return;
    await updateWithdrawal.mutateAsync({ 
      id: selectedWithdrawal.id, 
      status: 'rejected',
      reject_reason: rejectReason 
    });
    setShowRejectDialog(false);
    setSelectedWithdrawal(null);
    setRejectReason("");
  };

  const statsCards = [
    { title: "Pendentes", value: stats.pending.toString(), amount: formatCurrency(stats.pendingAmount), icon: Clock, color: "amber" },
    { title: "Em Processamento", value: stats.processing.toString(), amount: formatCurrency(stats.processingAmount), icon: AlertTriangle, color: "blue" },
    { title: "Concluídos", value: stats.completed.toString(), amount: formatCurrency(stats.completedAmount), icon: CheckCircle, color: "emerald" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pedidos de Saque</h1>
          <p className="text-muted-foreground mt-1">Gerencie as solicitações de saque dos lojistas</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statsCards.map((stat) => (
            <Card key={stat.title} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    <p className={`text-sm mt-1 ${
                      stat.color === "amber" ? "text-amber-500" :
                      stat.color === "blue" ? "text-blue-500" :
                      "text-emerald-500"
                    }`}>
                      {stat.amount}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    stat.color === "amber" ? "bg-amber-500/10" :
                    stat.color === "blue" ? "bg-blue-500/10" :
                    "bg-emerald-500/10"
                  }`}>
                    <stat.icon className={`w-6 h-6 ${
                      stat.color === "amber" ? "text-amber-500" :
                      stat.color === "blue" ? "text-blue-500" :
                      "text-emerald-500"
                    }`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por ID, loja ou proprietário..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="processing">Processando</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="rejected">Rejeitado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawals Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Solicitações de Saque</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredWithdrawals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum saque encontrado
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Loja</TableHead>
                    <TableHead>Proprietário</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Saldo Disponível</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWithdrawals.map((withdrawal) => (
                    <TableRow key={withdrawal.id}>
                      <TableCell className="font-mono font-medium">
                        #{withdrawal.id.slice(0, 8)}
                      </TableCell>
                      <TableCell>{withdrawal.store?.name || "—"}</TableCell>
                      <TableCell>{withdrawal.profile?.full_name || withdrawal.profile?.email || "—"}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(withdrawal.amount)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {withdrawal.wallet ? formatCurrency(withdrawal.wallet.available) : "—"}
                      </TableCell>
                      <TableCell>
                        {format(new Date(withdrawal.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </TableCell>
                      <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedWithdrawal(withdrawal)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Withdrawal Details Dialog */}
        <Dialog open={!!selectedWithdrawal && !showRejectDialog} onOpenChange={() => setSelectedWithdrawal(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                Pedido de Saque #{selectedWithdrawal?.id.slice(0, 8)}
              </DialogTitle>
            </DialogHeader>
            {selectedWithdrawal && (
              <div className="space-y-6">
                {/* Amount Highlight */}
                <div className="p-6 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 text-center">
                  <p className="text-sm text-muted-foreground">Valor Solicitado</p>
                  <p className="text-4xl font-bold text-foreground mt-2">
                    {formatCurrency(selectedWithdrawal.amount)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Saldo disponível: {selectedWithdrawal.wallet ? formatCurrency(selectedWithdrawal.wallet.available) : "—"}
                  </p>
                </div>

                {/* Store & Owner Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Loja</p>
                    <p className="font-medium">{selectedWithdrawal.store?.name || "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Proprietário</p>
                    <p className="font-medium">{selectedWithdrawal.profile?.full_name || "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedWithdrawal.profile?.email || "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Data da Solicitação</p>
                    <p className="font-medium">
                      {format(new Date(selectedWithdrawal.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </div>

                {/* Pix Info */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-3">Dados para Transferência</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Tipo de Chave Pix</p>
                      <p className="font-medium capitalize">{selectedWithdrawal.pix_type}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Chave Pix</p>
                      <p className="font-mono font-medium">{selectedWithdrawal.pix_key}</p>
                    </div>
                  </div>
                </div>

                {/* Reject Reason if rejected */}
                {selectedWithdrawal.status === "rejected" && selectedWithdrawal.reject_reason && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-sm text-red-500 font-medium">Motivo da Rejeição:</p>
                    <p className="text-red-500">{selectedWithdrawal.reject_reason}</p>
                  </div>
                )}

                {/* Actions */}
                {selectedWithdrawal.status === "pending" && (
                  <div className="flex justify-end gap-2 pt-4 border-t border-border">
                    <Button variant="outline" onClick={() => setSelectedWithdrawal(null)}>
                      Cancelar
                    </Button>
                    <Button variant="destructive" onClick={() => setShowRejectDialog(true)}>
                      <XCircle className="w-4 h-4 mr-2" />
                      Rejeitar
                    </Button>
                    <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={handleApprove}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Aprovar Saque
                    </Button>
                  </div>
                )}

                {selectedWithdrawal.status === "processing" && (
                  <div className="flex justify-end gap-2 pt-4 border-t border-border">
                    <Button variant="outline" onClick={() => setSelectedWithdrawal(null)}>
                      Fechar
                    </Button>
                    <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={handleComplete}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marcar como Concluído
                    </Button>
                  </div>
                )}

                {(selectedWithdrawal.status === "completed" || selectedWithdrawal.status === "rejected") && (
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => setSelectedWithdrawal(null)}>
                      Fechar
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rejeitar Saque</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Motivo da Rejeição</Label>
                <Textarea
                  placeholder="Informe o motivo da rejeição..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleReject}>
                  Confirmar Rejeição
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
