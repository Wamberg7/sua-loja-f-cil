import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Wallet,
  TrendingUp,
  Clock,
  Lock,
  Info,
  CheckCircle,
  Timer
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Release {
  id: string;
  orderId: string;
  value: number;
  rule: "rule1" | "rule2";
  saleDate: string;
  releaseDate: string;
  status: "released" | "pending" | "reserved";
}

const mockReleases: Release[] = [
  { id: "1", orderId: "#1234", value: 287.29, rule: "rule1", saleDate: "2024-01-20", releaseDate: "2024-02-04", status: "released" },
  { id: "2", orderId: "#1233", value: 44.79, rule: "rule2", saleDate: "2024-01-20", releaseDate: "2024-01-21", status: "pending" },
  { id: "3", orderId: "#1231", value: 17.63, rule: "rule1", saleDate: "2024-01-19", releaseDate: "2024-02-03", status: "reserved" },
  { id: "4", orderId: "#1230", value: 190.29, rule: "rule1", saleDate: "2024-01-18", releaseDate: "2024-02-02", status: "pending" },
  { id: "5", orderId: "#1229", value: 97.00, rule: "rule2", saleDate: "2024-01-17", releaseDate: "2024-01-18", status: "released" },
];

const WalletPage = () => {
  const [releases] = useState<Release[]>(mockReleases);

  const totalBalance = 4850;
  const releasedBalance = 3200;
  const pendingBalance = 1270;
  const reservedBalance = 380;

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const getTimeRemaining = (releaseDate: string) => {
    const now = new Date();
    const release = new Date(releaseDate);
    const diff = release.getTime() - now.getTime();
    
    if (diff <= 0) return "Disponível";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "released":
        return { label: "Liberado", color: "bg-success/10 text-success", icon: CheckCircle };
      case "pending":
        return { label: "Pendente", color: "bg-warning/10 text-warning", icon: Clock };
      case "reserved":
        return { label: "Reservado", color: "bg-accent/10 text-accent", icon: Lock };
      default:
        return { label: status, color: "bg-muted text-muted-foreground", icon: Clock };
    }
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
          <p className="text-3xl font-bold text-primary-foreground">{formatCurrency(totalBalance)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl p-6 border border-border"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-success" />
            <span className="text-sm text-muted-foreground">Saldo Liberado</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{formatCurrency(releasedBalance)}</p>
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
          <p className="text-3xl font-bold text-foreground">{formatCurrency(pendingBalance)}</p>
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
          <p className="text-3xl font-bold text-foreground">{formatCurrency(reservedBalance)}</p>
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
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Origem</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Valor</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Regra</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Data Venda</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Data Liberação</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Contador</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {releases.map((release, index) => {
                    const statusConfig = getStatusConfig(release.status);
                    const StatusIcon = statusConfig.icon;
                    return (
                      <motion.tr
                        key={release.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                      >
                        <td className="py-4 px-4 font-medium text-foreground">{release.orderId}</td>
                        <td className="py-4 px-4 text-right font-semibold text-primary">
                          {formatCurrency(release.value)}
                        </td>
                        <td className="py-4 px-4 text-sm text-muted-foreground hidden md:table-cell">
                          {release.rule === "rule1" ? "Regra 1" : "Regra 2"}
                        </td>
                        <td className="py-4 px-4 text-sm text-muted-foreground hidden sm:table-cell">
                          {formatDate(release.saleDate)}
                        </td>
                        <td className="py-4 px-4 text-sm text-foreground">
                          {formatDate(release.releaseDate)}
                        </td>
                        <td className="py-4 px-4 hidden md:table-cell">
                          {release.status !== "released" && (
                            <div className="flex items-center gap-2 text-sm">
                              <Timer className="w-4 h-4 text-warning" />
                              <span className="text-warning font-medium">
                                {getTimeRemaining(release.releaseDate)}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
