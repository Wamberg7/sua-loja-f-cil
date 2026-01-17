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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, Eye, CheckCircle, XCircle, Wallet, Clock, AlertTriangle, DollarSign } from "lucide-react";

const withdrawals = [
  {
    id: "#SAQ-001",
    store: "Loja Digital Pro",
    owner: "João Silva",
    cpf: "123.456.789-00",
    pixKey: "123.456.789-00",
    pixType: "CPF",
    amount: "R$ 2.500,00",
    availableBalance: "R$ 3.200,00",
    status: "pending",
    requestDate: "15/01/2024 14:30",
  },
  {
    id: "#SAQ-002",
    store: "E-books Master",
    owner: "Maria Santos",
    cpf: "987.654.321-00",
    pixKey: "maria@email.com",
    pixType: "Email",
    amount: "R$ 1.800,00",
    availableBalance: "R$ 2.100,00",
    status: "pending",
    requestDate: "15/01/2024 10:15",
  },
  {
    id: "#SAQ-003",
    store: "Cursos Online",
    owner: "Pedro Costa",
    cpf: "456.789.123-00",
    pixKey: "456.789.123-00",
    pixType: "CPF",
    amount: "R$ 5.000,00",
    availableBalance: "R$ 5.500,00",
    status: "processing",
    requestDate: "14/01/2024 16:45",
  },
  {
    id: "#SAQ-004",
    store: "Templates Hub",
    owner: "Ana Oliveira",
    cpf: "321.654.987-00",
    pixKey: "+5511999999999",
    pixType: "Telefone",
    amount: "R$ 890,00",
    availableBalance: "R$ 1.200,00",
    status: "completed",
    requestDate: "13/01/2024 09:00",
    completedDate: "13/01/2024 11:30",
  },
  {
    id: "#SAQ-005",
    store: "Design Academy",
    owner: "Carlos Mendes",
    cpf: "654.321.987-00",
    pixKey: "654.321.987-00",
    pixType: "CPF",
    amount: "R$ 3.200,00",
    availableBalance: "R$ 3.500,00",
    status: "rejected",
    requestDate: "12/01/2024 14:20",
    rejectReason: "Documentação pendente",
  },
];

const stats = [
  { title: "Pendentes", value: "2", amount: "R$ 4.300", icon: Clock, color: "amber" },
  { title: "Em Processamento", value: "1", amount: "R$ 5.000", icon: AlertTriangle, color: "blue" },
  { title: "Concluídos (mês)", value: "45", amount: "R$ 89.500", icon: CheckCircle, color: "emerald" },
];

export default function AdminWithdrawals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<typeof withdrawals[0] | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    const matchesSearch =
      withdrawal.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || withdrawal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
          {stats.map((stat) => (
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
                    <TableCell className="font-mono font-medium">{withdrawal.id}</TableCell>
                    <TableCell>{withdrawal.store}</TableCell>
                    <TableCell>{withdrawal.owner}</TableCell>
                    <TableCell className="font-semibold">{withdrawal.amount}</TableCell>
                    <TableCell className="text-muted-foreground">{withdrawal.availableBalance}</TableCell>
                    <TableCell>{withdrawal.requestDate}</TableCell>
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
          </CardContent>
        </Card>

        {/* Withdrawal Details Dialog */}
        <Dialog open={!!selectedWithdrawal && !showRejectDialog} onOpenChange={() => setSelectedWithdrawal(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                Pedido de Saque {selectedWithdrawal?.id}
              </DialogTitle>
            </DialogHeader>
            {selectedWithdrawal && (
              <div className="space-y-6">
                {/* Amount Highlight */}
                <div className="p-6 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 text-center">
                  <p className="text-sm text-muted-foreground">Valor Solicitado</p>
                  <p className="text-4xl font-bold text-foreground mt-2">{selectedWithdrawal.amount}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Saldo disponível: {selectedWithdrawal.availableBalance}
                  </p>
                </div>

                {/* Store & Owner Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Loja</p>
                    <p className="font-medium">{selectedWithdrawal.store}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Proprietário</p>
                    <p className="font-medium">{selectedWithdrawal.owner}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">CPF</p>
                    <p className="font-mono font-medium">{selectedWithdrawal.cpf}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Data da Solicitação</p>
                    <p className="font-medium">{selectedWithdrawal.requestDate}</p>
                  </div>
                </div>

                {/* Pix Info */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-3">Dados para Transferência</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Tipo de Chave Pix</p>
                      <p className="font-medium">{selectedWithdrawal.pixType}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Chave Pix</p>
                      <p className="font-mono font-medium">{selectedWithdrawal.pixKey}</p>
                    </div>
                  </div>
                </div>

                {/* Reject Reason if rejected */}
                {selectedWithdrawal.status === "rejected" && selectedWithdrawal.rejectReason && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-sm text-red-500 font-medium">Motivo da Rejeição:</p>
                    <p className="text-red-500">{selectedWithdrawal.rejectReason}</p>
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
                    <Button className="bg-emerald-500 hover:bg-emerald-600">
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
                    <Button className="bg-emerald-500 hover:bg-emerald-600">
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
                <Button variant="destructive" onClick={() => { setShowRejectDialog(false); setSelectedWithdrawal(null); }}>
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
