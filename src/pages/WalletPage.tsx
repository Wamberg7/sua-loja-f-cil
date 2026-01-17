import { motion } from "framer-motion";
import { 
  Wallet,
  TrendingUp,
  Clock,
  Lock,
  Info,
  Loader2
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useWalletBalance } from "@/hooks/useWallet";

const WalletPage = () => {
  const { data: wallet, isLoading } = useWalletBalance();

  const totalBalance = (wallet?.available || 0) + (wallet?.pending || 0) + (wallet?.reserved || 0);

  const formatCurrency = (value: number) => {
    return (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Carteira</h1>
        <p className="text-muted-foreground">Acompanhe seus saldos e liberações</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-primary rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="w-5 h-5 text-primary-foreground/80" />
            <span className="text-sm text-primary-foreground/80">Saldo Total</span>
          </div>
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin text-primary-foreground" />
          ) : (
            <p className="text-3xl font-bold text-primary-foreground">{formatCurrency(totalBalance)}</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl p-6 border border-border"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-success" />
            <span className="text-sm text-muted-foreground">Saldo Disponível</span>
          </div>
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          ) : (
            <p className="text-3xl font-bold text-foreground">{formatCurrency(wallet?.available || 0)}</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl p-6 border border-border"
        >
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-warning" />
            <span className="text-sm text-muted-foreground">Saldo Pendente</span>
          </div>
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          ) : (
            <p className="text-3xl font-bold text-foreground">{formatCurrency(wallet?.pending || 0)}</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl p-6 border border-border"
        >
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-5 h-5 text-accent" />
            <span className="text-sm text-muted-foreground">Reservas</span>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Valores temporariamente reservados como garantia.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          ) : (
            <p className="text-3xl font-bold text-foreground">{formatCurrency(wallet?.reserved || 0)}</p>
          )}
        </motion.div>
      </div>

      {/* Rules Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8 p-6 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-border"
      >
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground mb-2">Regras de Liberação</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-lg bg-background">
                <p className="font-medium text-foreground mb-1">Regra 1 - Reserva de 4%</p>
                <p className="text-muted-foreground">4% das vendas dos últimos 15 dias são reservados por 15 dias como garantia.</p>
              </div>
              <div className="p-4 rounded-lg bg-background">
                <p className="font-medium text-foreground mb-1">Regra 2 - Maior Venda 24h</p>
                <p className="text-muted-foreground">A maior venda em 24h é reservada por 24 horas adicionais.</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              * Aplica-se o maior valor entre as duas regras.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="releases" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="releases">Liberações</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="releases">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Clock className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma liberação pendente</h3>
            <p className="text-muted-foreground">As liberações aparecerão aqui conforme as vendas forem processadas.</p>
          </motion.div>
        </TabsContent>

        <TabsContent value="history">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Clock className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Histórico completo</h3>
            <p className="text-muted-foreground">O histórico detalhado de transações estará disponível em breve.</p>
          </motion.div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default WalletPage;
