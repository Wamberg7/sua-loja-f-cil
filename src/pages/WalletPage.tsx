import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Wallet,
  TrendingUp,
  Clock,
  Lock,
  Info,
  Loader2,
  ArrowDownToLine,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Banknote,
  Zap,
  ArrowLeft
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWalletBalance } from "@/hooks/useWallet";
import { useSellerWithdrawals, useCreateWithdrawal } from "@/hooks/useSellerWithdrawals";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

type WithdrawType = 'manual' | 'automatic' | null;
type ModalStep = 'select' | 'form';

const WalletPage = () => {
  const { data: wallet, isLoading } = useWalletBalance();
  const { data: withdrawals, isLoading: isLoadingWithdrawals } = useSellerWithdrawals();
  const createWithdrawal = useCreateWithdrawal();

  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>('select');
  const [withdrawType, setWithdrawType] = useState<WithdrawType>(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [pixType, setPixType] = useState("cpf");

  const totalBalance = (wallet?.available || 0) + (wallet?.pending || 0) + (wallet?.reserved || 0);

  const formatCurrency = (value: number) => {
    return (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getAmountInCents = () => {
    const value = withdrawAmount.replace(/\./g, '').replace(',', '.');
    return Math.round(parseFloat(value) * 100) || 0;
  };

  const getFee = () => {
    return withdrawType === 'automatic' ? 350 : 100; // R$3,50 ou R$1,00
  };

  const calculateNetAmount = () => {
    const amountCents = getAmountInCents();
    const fee = getFee();
    return Math.max(0, amountCents - fee);
  };

  const isValidAmount = () => {
    const amountCents = getAmountInCents();
    if (amountCents <= 0) return false;
    if (amountCents > (wallet?.available || 0)) return false;
    if (amountCents > 100000) return false; // Máximo R$1000
    if (amountCents <= getFee()) return false; // Deve ser maior que a taxa
    return true;
  };

  const handleWithdraw = () => {
    const amountCents = getAmountInCents();
    if (!isValidAmount()) return;
    if (!pixKey.trim()) return;

    createWithdrawal.mutate({
      amount: amountCents,
      pix_key: pixKey,
      pix_type: pixType,
    }, {
      onSuccess: () => {
        closeModal();
      }
    });
  };

  const closeModal = () => {
    setIsWithdrawOpen(false);
    setModalStep('select');
    setWithdrawType(null);
    setWithdrawAmount("");
    setPixKey("");
    setPixType("cpf");
  };

  const selectWithdrawType = (type: WithdrawType) => {
    setWithdrawType(type);
    setModalStep('form');
  };

  const goBack = () => {
    setModalStep('select');
    setWithdrawType(null);
    setWithdrawAmount("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
            <AlertCircle className="w-3 h-3" />
            Pendente
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
            <Clock className="w-3 h-3" />
            Processando
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
            <CheckCircle2 className="w-3 h-3" />
            Concluído
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
            <XCircle className="w-3 h-3" />
            Rejeitado
          </span>
        );
      default:
        return status;
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const numValue = parseInt(value) || 0;
    setWithdrawAmount((numValue / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Carteira</h1>
          <p className="text-muted-foreground">Gerencie seus saldos e saques</p>
        </div>
        <Button 
          onClick={() => setIsWithdrawOpen(true)}
          className="bg-gradient-primary hover:opacity-90 gap-2"
          disabled={(wallet?.available || 0) <= 0}
        >
          <ArrowDownToLine className="w-4 h-4" />
          Sacar
        </Button>
      </div>

      {/* Main Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 p-8 mb-6"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Saldo Total</p>
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              ) : (
                <p className="text-4xl font-bold text-white">{formatCurrency(totalBalance)}</p>
              )}
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-300" />
                <span className="text-xs text-white/70">Disponível</span>
              </div>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <p className="text-xl font-semibold text-white">{formatCurrency(wallet?.available || 0)}</p>
              )}
            </div>
            
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-amber-300" />
                <span className="text-xs text-white/70">Pendente</span>
              </div>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <p className="text-xl font-semibold text-white">{formatCurrency(wallet?.pending || 0)}</p>
              )}
            </div>
            
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-blue-300" />
                <span className="text-xs text-white/70">Reservado</span>
              </div>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <p className="text-xl font-semibold text-white">{formatCurrency(wallet?.reserved || 0)}</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-border mb-8"
      >
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">Regras de Liberação</h3>
            <p className="text-sm text-muted-foreground">
              4% das vendas ficam reservados por 15 dias. A maior venda em 24h é reservada por mais 24h.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Withdrawals History */}
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="history">Histórico de Saques</TabsTrigger>
          <TabsTrigger value="releases">Liberações</TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            {isLoadingWithdrawals ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : withdrawals && withdrawals.length > 0 ? (
              <div className="divide-y divide-border">
                {withdrawals.map((withdrawal) => (
                  <div key={withdrawal.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-primary/10">
                          <Banknote className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {formatCurrency(withdrawal.amount)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            PIX {withdrawal.pix_type.toUpperCase()}: {withdrawal.pix_key}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(withdrawal.status)}
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(withdrawal.created_at), "dd MMM yyyy, HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                    {withdrawal.reject_reason && (
                      <div className="mt-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                        <p className="text-sm text-destructive">
                          <strong>Motivo:</strong> {withdrawal.reject_reason}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Banknote className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum saque realizado</h3>
                <p className="text-muted-foreground mb-4">Solicite seu primeiro saque quando tiver saldo disponível.</p>
              </div>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="releases">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-card rounded-xl border border-border"
          >
            <Clock className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma liberação pendente</h3>
            <p className="text-muted-foreground">As liberações aparecerão aqui conforme as vendas forem processadas.</p>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Withdraw Dialog */}
      <Dialog open={isWithdrawOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md">
          {modalStep === 'select' ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ArrowDownToLine className="w-5 h-5 text-primary" />
                  Solicitar Saque
                </DialogTitle>
                <DialogDescription>
                  Escolha o tipo de saque que deseja realizar
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-4">
                {/* Saque Automático */}
                <button
                  onClick={() => selectWithdrawType('automatic')}
                  className="w-full p-4 rounded-xl border-2 border-border hover:border-amber-500/50 hover:bg-amber-500/5 transition-all text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">Saque Automático</h3>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600">
                          Instantâneo
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Taxa de <strong className="text-foreground">R$ 3,50</strong> • Receba em segundos
                      </p>
                    </div>
                  </div>
                </button>

                {/* Saque Manual */}
                <button
                  onClick={() => selectWithdrawType('manual')}
                  className="w-full p-4 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80">
                      <ArrowDownToLine className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">Saque Manual</h3>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          Até 24h
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Taxa de <strong className="text-foreground">R$ 1,00</strong> • Processado em até 24h úteis
                      </p>
                    </div>
                  </div>
                </button>

                <p className="text-xs text-muted-foreground text-center pt-2">
                  Saque máximo: R$ 1.000,00
                </p>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={goBack} className="h-8 w-8">
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <DialogTitle className="flex items-center gap-2">
                    {withdrawType === 'automatic' ? (
                      <>
                        <Zap className="w-5 h-5 text-amber-500" />
                        Saque Automático
                      </>
                    ) : (
                      <>
                        <ArrowDownToLine className="w-5 h-5 text-primary" />
                        Saque Manual
                      </>
                    )}
                  </DialogTitle>
                </div>
                <DialogDescription>
                  Saldo disponível: <strong className="text-foreground">{formatCurrency(wallet?.available || 0)}</strong>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Withdraw Type Info */}
                <div className={cn(
                  "p-3 rounded-lg border",
                  withdrawType === 'automatic' 
                    ? "bg-amber-500/5 border-amber-500/20" 
                    : "bg-primary/5 border-primary/20"
                )}>
                  {withdrawType === 'automatic' ? (
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span className="text-amber-700 dark:text-amber-400">
                        Taxa fixa de <strong>R$ 3,50</strong> • Receba instantaneamente
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm">
                      <ArrowDownToLine className="w-4 h-4 text-primary" />
                      <span className="text-primary">
                        Taxa fixa de <strong>R$ 1,00</strong> • Processado em até 24h úteis
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Valor do saque</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                    <Input
                      id="amount"
                      placeholder="0,00"
                      value={withdrawAmount}
                      onChange={handleAmountChange}
                      className="pl-10"
                    />
                  </div>
                  {withdrawAmount && !isValidAmount() && (
                    <p className="text-xs text-destructive">
                      {getAmountInCents() > (wallet?.available || 0) 
                        ? "Saldo insuficiente"
                        : getAmountInCents() > 100000
                        ? "Valor máximo: R$ 1.000,00"
                        : getAmountInCents() <= getFee()
                        ? `Valor deve ser maior que a taxa (R$ ${(getFee() / 100).toFixed(2).replace('.', ',')})`
                        : "Valor inválido"
                      }
                    </p>
                  )}
                </div>

                {/* Fee Calculator */}
                {withdrawAmount && getAmountInCents() > 0 && (
                  <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Valor solicitado:</span>
                      <span className="font-medium">{formatCurrency(getAmountInCents())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Taxa ({withdrawType === 'automatic' ? 'R$ 3,50' : 'R$ 1,00'}):
                      </span>
                      <span className="font-medium text-destructive">- {formatCurrency(getFee())}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-medium">Você receberá:</span>
                      <span className="font-bold text-success">{formatCurrency(calculateNetAmount())}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="pixType">Tipo de chave PIX</Label>
                  <Select value={pixType} onValueChange={setPixType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cpf">CPF</SelectItem>
                      <SelectItem value="cnpj">CNPJ</SelectItem>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="phone">Telefone</SelectItem>
                      <SelectItem value="random">Chave aleatória</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pixKey">Chave PIX</Label>
                  <Input
                    id="pixKey"
                    placeholder={
                      pixType === 'cpf' ? '000.000.000-00' :
                      pixType === 'cnpj' ? '00.000.000/0000-00' :
                      pixType === 'email' ? 'seu@email.com' :
                      pixType === 'phone' ? '(00) 00000-0000' :
                      'Chave aleatória'
                    }
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                  />
                </div>

                <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <p className="text-sm text-warning flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {withdrawType === 'automatic' 
                      ? "O saque será processado instantaneamente após confirmação."
                      : "O saque será processado em até 24 horas úteis após aprovação."
                    }
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={closeModal} className="flex-1">
                  Cancelar
                </Button>
                <Button 
                  onClick={handleWithdraw} 
                  className={cn(
                    "flex-1",
                    withdrawType === 'automatic' 
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600" 
                      : "bg-gradient-primary"
                  )}
                  disabled={createWithdrawal.isPending || !isValidAmount() || !pixKey.trim()}
                >
                  {createWithdrawal.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Confirmar Saque"
                  )}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default WalletPage;
