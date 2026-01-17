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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, Eye, CheckCircle, XCircle, Shield, AlertTriangle } from "lucide-react";

const walletRequests = [
  {
    id: 1,
    store: "Loja Digital Pro",
    owner: "João Silva",
    cpf: "123.456.789-00",
    email: "joao@email.com",
    pixKey: "123.456.789-00",
    pixType: "CPF",
    status: "pending",
    requestDate: "15/01/2024 10:30",
    documents: true,
  },
  {
    id: 2,
    store: "E-books Master",
    owner: "Maria Santos",
    cpf: "987.654.321-00",
    email: "maria@email.com",
    pixKey: "maria@email.com",
    pixType: "Email",
    status: "pending",
    requestDate: "14/01/2024 15:45",
    documents: true,
  },
  {
    id: 3,
    store: "Cursos Online",
    owner: "Pedro Costa",
    cpf: "456.789.123-00",
    email: "pedro@email.com",
    pixKey: "456.789.123-00",
    pixType: "CPF",
    status: "rejected",
    requestDate: "13/01/2024 09:20",
    documents: false,
    rejectReason: "CPF não confere com dados informados",
  },
  {
    id: 4,
    store: "Templates Hub",
    owner: "Ana Oliveira",
    cpf: "321.654.987-00",
    email: "ana@email.com",
    pixKey: "+5511999999999",
    pixType: "Telefone",
    status: "approved",
    requestDate: "12/01/2024 14:00",
    documents: true,
    approvedDate: "12/01/2024 16:30",
  },
];

export default function AdminWalletApproval() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<typeof walletRequests[0] | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const pendingRequests = walletRequests.filter((r) => r.status === "pending");

  const filteredRequests = walletRequests.filter(
    (request) =>
      request.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.cpf.includes(searchTerm)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-emerald-500/10 text-emerald-500">Aprovado</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/10 text-amber-500">Pendente</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/10 text-red-500">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const validateCpfMatch = (cpf: string, pixKey: string, pixType: string) => {
    if (pixType === "CPF") {
      return cpf === pixKey;
    }
    return true;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Aprovação de Carteira</h1>
            <p className="text-muted-foreground mt-1">Verifique e aprove solicitações de carteira</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span className="font-semibold text-amber-500">{pendingRequests.length} pendentes</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por loja, proprietário ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Solicitações de Carteira</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loja</TableHead>
                  <TableHead>Proprietário</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Chave Pix</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.store}</TableCell>
                    <TableCell>
                      <div>
                        <p>{request.owner}</p>
                        <p className="text-sm text-muted-foreground">{request.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{request.cpf}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-mono">{request.pixKey}</p>
                        <p className="text-sm text-muted-foreground">{request.pixType}</p>
                      </div>
                    </TableCell>
                    <TableCell>{request.requestDate}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedRequest(request)}
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

        {/* Request Details Dialog */}
        <Dialog open={!!selectedRequest && !showRejectDialog} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Verificação de Dados - {selectedRequest?.store}
              </DialogTitle>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-6">
                {/* CPF Match Warning */}
                {!validateCpfMatch(selectedRequest.cpf, selectedRequest.pixKey, selectedRequest.pixType) && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="flex items-center gap-2 text-red-500">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-semibold">ATENÇÃO: CPF não confere com a chave Pix!</span>
                    </div>
                  </div>
                )}

                {validateCpfMatch(selectedRequest.cpf, selectedRequest.pixKey, selectedRequest.pixType) && selectedRequest.pixType === "CPF" && (
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-2 text-emerald-500">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">CPF confere com a chave Pix</span>
                    </div>
                  </div>
                )}

                {/* Owner Data */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Dados do Proprietário</h4>
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Nome Completo</p>
                      <p className="font-medium">{selectedRequest.owner}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">CPF</p>
                      <p className="font-mono font-medium">{selectedRequest.cpf}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedRequest.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Loja</p>
                      <p className="font-medium">{selectedRequest.store}</p>
                    </div>
                  </div>
                </div>

                {/* Pix Data */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Dados do Pix</h4>
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Tipo de Chave</p>
                      <p className="font-medium">{selectedRequest.pixType}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Chave Pix</p>
                      <p className="font-mono font-medium">{selectedRequest.pixKey}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {selectedRequest.status === "pending" && (
                  <div className="flex justify-end gap-2 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedRequest(null)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setShowRejectDialog(true)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Rejeitar
                    </Button>
                    <Button className="bg-emerald-500 hover:bg-emerald-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Aprovar Carteira
                    </Button>
                  </div>
                )}

                {selectedRequest.status !== "pending" && (
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => setSelectedRequest(null)}>
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
              <DialogTitle>Rejeitar Solicitação</DialogTitle>
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
                <Button variant="destructive" onClick={() => { setShowRejectDialog(false); setSelectedRequest(null); }}>
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
