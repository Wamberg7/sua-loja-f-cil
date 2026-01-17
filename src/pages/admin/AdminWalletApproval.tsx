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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, Eye, CheckCircle, XCircle, Shield, AlertTriangle, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WalletWithDetails {
  id: string;
  store_id: string;
  is_approved: boolean;
  available: number;
  pending: number;
  reserved: number;
  created_at: string;
  store?: {
    id: string;
    name: string;
    user_id: string;
  };
  profile?: {
    full_name: string | null;
    email: string;
  };
}

export default function AdminWalletApproval() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWallet, setSelectedWallet] = useState<WalletWithDetails | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const { data: wallets, isLoading } = useQuery({
    queryKey: ['wallets-approval'],
    queryFn: async () => {
      const { data: walletsData, error } = await supabase
        .from('wallets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get store and profile info
      const enrichedWallets = await Promise.all(
        (walletsData || []).map(async (wallet) => {
          const { data: storeData } = await supabase
            .from('stores')
            .select('id, name, user_id')
            .eq('id', wallet.store_id)
            .maybeSingle();

          let profileData = null;
          if (storeData) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name, email')
              .eq('user_id', storeData.user_id)
              .maybeSingle();
            profileData = profile;
          }

          return {
            ...wallet,
            store: storeData,
            profile: profileData,
          } as WalletWithDetails;
        })
      );

      return enrichedWallets;
    },
  });

  const approveWallet = useMutation({
    mutationFn: async (walletId: string) => {
      const { error } = await supabase
        .from('wallets')
        .update({ is_approved: true })
        .eq('id', walletId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets-approval'] });
      toast.success("Carteira aprovada!");
      setSelectedWallet(null);
    },
    onError: (error) => {
      toast.error("Erro: " + error.message);
    },
  });

  const pendingWallets = wallets?.filter(w => !w.is_approved) || [];

  const filteredWallets = wallets?.filter(
    (wallet) =>
      wallet.store?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.profile?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusBadge = (isApproved: boolean) => {
    if (isApproved) {
      return <Badge className="bg-emerald-500/10 text-emerald-500">Aprovado</Badge>;
    }
    return <Badge className="bg-amber-500/10 text-amber-500">Pendente</Badge>;
  };

  const handleApprove = () => {
    if (selectedWallet) {
      approveWallet.mutate(selectedWallet.id);
    }
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
              <span className="font-semibold text-amber-500">{pendingWallets.length} pendentes</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por loja, proprietário ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Wallets Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Solicitações de Carteira</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredWallets.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nenhuma carteira encontrada</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loja</TableHead>
                    <TableHead>Proprietário</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWallets.map((wallet) => (
                    <TableRow key={wallet.id}>
                      <TableCell className="font-medium">{wallet.store?.name || "—"}</TableCell>
                      <TableCell>{wallet.profile?.full_name || "—"}</TableCell>
                      <TableCell>{wallet.profile?.email || "—"}</TableCell>
                      <TableCell>
                        {format(new Date(wallet.created_at), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell>{getStatusBadge(wallet.is_approved)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedWallet(wallet)}
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

        {/* Wallet Details Dialog */}
        <Dialog open={!!selectedWallet && !showRejectDialog} onOpenChange={() => setSelectedWallet(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Verificação de Dados - {selectedWallet?.store?.name}
              </DialogTitle>
            </DialogHeader>
            {selectedWallet && (
              <div className="space-y-6">
                {selectedWallet.is_approved && (
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-2 text-emerald-500">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Carteira já aprovada</span>
                    </div>
                  </div>
                )}

                {/* Owner Data */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Dados do Proprietário</h4>
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Nome Completo</p>
                      <p className="font-medium">{selectedWallet.profile?.full_name || "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedWallet.profile?.email || "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Loja</p>
                      <p className="font-medium">{selectedWallet.store?.name || "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Data de Criação</p>
                      <p className="font-medium">
                        {format(new Date(selectedWallet.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {!selectedWallet.is_approved && (
                  <div className="flex justify-end gap-2 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedWallet(null)}
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
                    <Button 
                      className="bg-emerald-500 hover:bg-emerald-600"
                      onClick={handleApprove}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Aprovar Carteira
                    </Button>
                  </div>
                )}

                {selectedWallet.is_approved && (
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => setSelectedWallet(null)}>
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
                <Button variant="destructive" onClick={() => { setShowRejectDialog(false); setSelectedWallet(null); }}>
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
