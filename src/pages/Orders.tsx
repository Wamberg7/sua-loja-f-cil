import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter,
  ShoppingCart,
  Mail,
  RefreshCw,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  CreditCard,
  Wallet,
  Loader2
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
import { useOrders } from "@/hooks/useOrders";
import { Order } from "@/lib/types";

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [periodFilter, setPeriodFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: orders = [], isLoading } = useOrders();

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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

  // Calculate fee and net value (3% + R$ 0,80)
  const calculateFee = (total: number) => {
    return Math.round(total * 0.03) + 80; // 3% + R$ 0,80 (80 centavos)
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
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredOrders.length === 0 ? (
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
                    const fee = calculateFee(order.total);
                    const netValue = order.total - fee;
                    return (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                      >
                        <td className="py-4 px-4 font-medium text-foreground">#{order.id.slice(0, 8)}</td>
                        <td className="py-4 px-4 text-sm text-muted-foreground">{formatDate(order.created_at)}</td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-foreground text-sm">{order.customer_name || "-"}</p>
                            <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right text-sm text-muted-foreground hidden md:table-cell">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="py-4 px-4 text-right text-sm text-destructive hidden md:table-cell">
                          -{formatCurrency(fee)}
                        </td>
                        <td className="py-4 px-4 text-right font-semibold text-primary">
                          {formatCurrency(netValue)}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="py-4 px-4 hidden sm:table-cell">
                          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                            {order.payment_method === "pix" ? (
                              <Wallet className="w-4 h-4" />
                            ) : (
                              <CreditCard className="w-4 h-4" />
                            )}
                            {order.payment_method === "pix" ? "Pix" : order.payment_method === "card" ? "Cartão" : "-"}
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
              Pedido #{selectedOrder?.id.slice(0, 8)}
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
                    <p className="font-medium text-foreground">{selectedOrder.customer_name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{selectedOrder.customer_email}</p>
                  </div>
                  {selectedOrder.customer_phone && (
                    <div>
                      <p className="text-muted-foreground">Telefone</p>
                      <p className="font-medium text-foreground">{selectedOrder.customer_phone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Info */}
              <div className="p-4 rounded-xl bg-secondary/50">
                <h4 className="font-medium text-foreground mb-3">Financeiro</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-foreground">{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Desconto</span>
                      <span className="font-medium text-success">-{formatCurrency(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor Bruto</span>
                    <span className="font-medium text-foreground">{formatCurrency(selectedOrder.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxa (3% + R$ 0,80)</span>
                    <span className="font-medium text-destructive">-{formatCurrency(calculateFee(selectedOrder.total))}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="font-medium text-foreground">Valor Líquido</span>
                    <span className="font-bold text-primary">{formatCurrency(selectedOrder.total - calculateFee(selectedOrder.total))}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="p-4 rounded-xl bg-secondary/50">
                  <h4 className="font-medium text-foreground mb-3">Itens do Pedido</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-foreground">
                          {item.quantity}x {item.product_name}
                        </span>
                        <span className="font-medium text-foreground">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Info */}
              <div className="p-4 rounded-xl bg-secondary/50">
                <h4 className="font-medium text-foreground mb-3">Informações do Pedido</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Data do Pedido</p>
                    <p className="font-medium text-foreground">{formatDateTime(selectedOrder.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Método de Pagamento</p>
                    <p className="font-medium text-foreground">
                      {selectedOrder.payment_method === "pix" ? "Pix" : 
                       selectedOrder.payment_method === "card" ? "Cartão" : "-"}
                    </p>
                  </div>
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
