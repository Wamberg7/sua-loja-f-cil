import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter,
  ShoppingCart,
  Mail,
  RefreshCw,
  Eye,
  X,
  CheckCircle,
  Clock,
  XCircle,
  CreditCard,
  Wallet
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface Order {
  id: string;
  date: string;
  customer: {
    name: string;
    email: string;
  };
  product: {
    name: string;
    variation?: string;
    category: string;
  };
  grossValue: number;
  fee: number;
  netValue: number;
  status: "paid" | "pending" | "cancelled" | "refunded";
  paymentMethod: "pix" | "card";
  walletStatus: "released" | "pending" | "reserved";
  releaseRule: "rule1" | "rule2";
  releaseDate: string;
  emailStatus: "sent" | "pending" | "failed";
  emailLog: string[];
}

const mockOrders: Order[] = [
  {
    id: "#1234",
    date: "2024-01-20T14:30:00",
    customer: { name: "Maria Silva", email: "maria@email.com" },
    product: { name: "Curso de Marketing Digital", variation: "Completo", category: "Cursos Online" },
    grossValue: 297,
    fee: 9.71,
    netValue: 287.29,
    status: "paid",
    paymentMethod: "pix",
    walletStatus: "released",
    releaseRule: "rule1",
    releaseDate: "2024-02-04",
    emailStatus: "sent",
    emailLog: ["2024-01-20 14:31 - Email enviado com sucesso"]
  },
  {
    id: "#1233",
    date: "2024-01-20T10:15:00",
    customer: { name: "João Santos", email: "joao@email.com" },
    product: { name: "Template Premium", category: "Templates" },
    grossValue: 47,
    fee: 2.21,
    netValue: 44.79,
    status: "paid",
    paymentMethod: "card",
    walletStatus: "pending",
    releaseRule: "rule2",
    releaseDate: "2024-01-21",
    emailStatus: "sent",
    emailLog: ["2024-01-20 10:16 - Email enviado com sucesso"]
  },
  {
    id: "#1232",
    date: "2024-01-19T18:45:00",
    customer: { name: "Ana Costa", email: "ana@email.com" },
    product: { name: "E-book Completo", category: "E-books" },
    grossValue: 27,
    fee: 1.61,
    netValue: 25.39,
    status: "pending",
    paymentMethod: "pix",
    walletStatus: "pending",
    releaseRule: "rule1",
    releaseDate: "-",
    emailStatus: "pending",
    emailLog: []
  },
  {
    id: "#1231",
    date: "2024-01-19T09:20:00",
    customer: { name: "Pedro Lima", email: "pedro@email.com" },
    product: { name: "Pack de Icons", category: "Templates" },
    grossValue: 19,
    fee: 1.37,
    netValue: 17.63,
    status: "paid",
    paymentMethod: "card",
    walletStatus: "reserved",
    releaseRule: "rule1",
    releaseDate: "2024-02-03",
    emailStatus: "sent",
    emailLog: ["2024-01-19 09:21 - Email enviado com sucesso"]
  },
  {
    id: "#1230",
    date: "2024-01-18T16:00:00",
    customer: { name: "Carla Mendes", email: "carla@email.com" },
    product: { name: "Curso de Design", variation: "Pro", category: "Cursos Online" },
    grossValue: 197,
    fee: 6.71,
    netValue: 190.29,
    status: "refunded",
    paymentMethod: "pix",
    walletStatus: "pending",
    releaseRule: "rule1",
    releaseDate: "-",
    emailStatus: "failed",
    emailLog: ["2024-01-18 16:01 - Erro ao enviar email", "2024-01-18 16:05 - Tentativa de reenvio falhou"]
  },
];

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [periodFilter, setPeriodFilter] = useState<string>("all");
  const [orders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateStr: string) => {
    if (dateStr === "-") return "-";
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "paid":
        return { label: "Pago", color: "bg-success/10 text-success", icon: CheckCircle };
      case "pending":
        return { label: "Pendente", color: "bg-warning/10 text-warning", icon: Clock };
      case "cancelled":
        return { label: "Cancelado", color: "bg-destructive/10 text-destructive", icon: XCircle };
      case "refunded":
        return { label: "Reembolsado", color: "bg-muted text-muted-foreground", icon: RefreshCw };
      default:
        return { label: status, color: "bg-muted text-muted-foreground", icon: Clock };
    }
  };

  const getWalletStatusConfig = (status: string) => {
    switch (status) {
      case "released":
        return { label: "Liberado", color: "text-success" };
      case "pending":
        return { label: "Pendente", color: "text-warning" };
      case "reserved":
        return { label: "Reservado", color: "text-accent" };
      default:
        return { label: status, color: "text-muted-foreground" };
    }
  };

  const handleResendEmail = (orderId: string) => {
    console.log("Reenviando email para pedido:", orderId);
    // Implementation would go here
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Pedidos</h1>
        <p className="text-muted-foreground">Gerencie todos os pedidos da sua loja</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID, cliente ou produto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="paid">Pagos</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="cancelled">Cancelados</SelectItem>
            <SelectItem value="refunded">Reembolsados</SelectItem>
          </SelectContent>
        </Select>
        <Select value={periodFilter} onValueChange={setPeriodFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="week">Esta semana</SelectItem>
            <SelectItem value="month">Este mês</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum pedido encontrado</h3>
          <p className="text-muted-foreground">Os pedidos aparecerão aqui quando houver vendas</p>
        </motion.div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">ID</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Data</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Cliente</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Produto</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Bruto</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Taxa</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Líquido</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Pagamento</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredOrders.map((order, index) => {
                    const statusConfig = getStatusConfig(order.status);
                    const StatusIcon = statusConfig.icon;
                    return (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                      >
                        <td className="py-4 px-4 font-medium text-foreground">{order.id}</td>
                        <td className="py-4 px-4 text-sm text-muted-foreground">{formatDate(order.date)}</td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-foreground text-sm">{order.customer.name}</p>
                            <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 hidden lg:table-cell">
                          <div>
                            <p className="text-sm text-foreground">{order.product.name}</p>
                            {order.product.variation && (
                              <p className="text-xs text-muted-foreground">{order.product.variation}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right text-sm text-muted-foreground hidden md:table-cell">
                          {formatCurrency(order.grossValue)}
                        </td>
                        <td className="py-4 px-4 text-right text-sm text-destructive hidden md:table-cell">
                          -{formatCurrency(order.fee)}
                        </td>
                        <td className="py-4 px-4 text-right font-semibold text-primary">
                          {formatCurrency(order.netValue)}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="py-4 px-4 hidden sm:table-cell">
                          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                            {order.paymentMethod === "pix" ? (
                              <Wallet className="w-4 h-4" />
                            ) : (
                              <CreditCard className="w-4 h-4" />
                            )}
                            {order.paymentMethod === "pix" ? "Pix" : "Cartão"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Pedido {selectedOrder?.id}
              {selectedOrder && (
                <span className={`text-sm px-2 py-1 rounded-full ${getStatusConfig(selectedOrder.status).color}`}>
                  {getStatusConfig(selectedOrder.status).label}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6 py-4">
              {/* Customer Info */}
              <div className="p-4 rounded-xl bg-secondary/50">
                <h4 className="font-medium text-foreground mb-3">Dados do Cliente</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Nome</p>
                    <p className="font-medium text-foreground">{selectedOrder.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{selectedOrder.customer.email}</p>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 rounded-xl bg-secondary/50">
                <h4 className="font-medium text-foreground mb-3">Produto</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Nome</p>
                    <p className="font-medium text-foreground">{selectedOrder.product.name}</p>
                  </div>
                  {selectedOrder.product.variation && (
                    <div>
                      <p className="text-muted-foreground">Variação</p>
                      <p className="font-medium text-foreground">{selectedOrder.product.variation}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground">Categoria</p>
                    <p className="font-medium text-foreground">{selectedOrder.product.category}</p>
                  </div>
                </div>
              </div>

              {/* Financial Info */}
              <div className="p-4 rounded-xl bg-secondary/50">
                <h4 className="font-medium text-foreground mb-3">Financeiro</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor Bruto</span>
                    <span className="font-medium text-foreground">{formatCurrency(selectedOrder.grossValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxa (3% + R$ 0,80)</span>
                    <span className="font-medium text-destructive">-{formatCurrency(selectedOrder.fee)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="font-medium text-foreground">Valor Líquido</span>
                    <span className="font-bold text-primary">{formatCurrency(selectedOrder.netValue)}</span>
                  </div>
                </div>
              </div>

              {/* Wallet Info */}
              <div className="p-4 rounded-xl bg-secondary/50">
                <h4 className="font-medium text-foreground mb-3">Carteira</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className={`font-medium ${getWalletStatusConfig(selectedOrder.walletStatus).color}`}>
                      {getWalletStatusConfig(selectedOrder.walletStatus).label}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Regra Aplicada</p>
                    <p className="font-medium text-foreground">
                      {selectedOrder.releaseRule === "rule1" ? "Regra 1 - 4% últimos 15 dias" : "Regra 2 - Maior venda 24h"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Data da Venda</p>
                    <p className="font-medium text-foreground">{formatDateTime(selectedOrder.date)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Data de Liberação</p>
                    <p className="font-medium text-foreground">{formatDate(selectedOrder.releaseDate)}</p>
                  </div>
                </div>
              </div>

              {/* Email Info */}
              <div className="p-4 rounded-xl bg-secondary/50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-foreground">Entrega Digital</h4>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleResendEmail(selectedOrder.id)}
                    className="gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Reenviar
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={`font-medium ${
                      selectedOrder.emailStatus === "sent" ? "text-success" :
                      selectedOrder.emailStatus === "pending" ? "text-warning" :
                      "text-destructive"
                    }`}>
                      {selectedOrder.emailStatus === "sent" ? "Enviado" :
                       selectedOrder.emailStatus === "pending" ? "Pendente" :
                       "Falhou"}
                    </span>
                  </div>
                  {selectedOrder.emailLog.length > 0 && (
                    <div className="mt-2 p-3 rounded-lg bg-background text-xs font-mono space-y-1">
                      {selectedOrder.emailLog.map((log, i) => (
                        <p key={i} className="text-muted-foreground">{log}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Orders;
