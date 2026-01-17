import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Users,
  Eye,
  Mail,
  ShoppingBag,
  DollarSign,
  Calendar,
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
import { useCustomers, useCustomerOrders } from "@/hooks/useCustomers";

interface SelectedCustomer {
  email: string;
  name: string;
  total_spent: number;
  orders_count: number;
  last_purchase: string;
  first_purchase: string;
}

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<SelectedCustomer | null>(null);

  const { data: customers = [], isLoading } = useCustomers();
  const { data: customerOrders = [] } = useCustomerOrders(selectedCustomer?.email || "");

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((acc, c) => acc + c.total_spent, 0);
  const totalOrders = customers.reduce((acc, c) => acc + c.orders_count, 0);
  const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Clientes</h1>
        <p className="text-muted-foreground">Visualize e gerencie seus clientes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl p-6 border border-border"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Clientes</p>
              <p className="text-2xl font-bold text-foreground">{totalCustomers}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl p-6 border border-border"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Receita Total</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl p-6 border border-border"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ticket Médio</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(avgTicket)}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Customers List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredCustomers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Users className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum cliente encontrado</h3>
          <p className="text-muted-foreground">Os clientes aparecerão aqui após a primeira venda</p>
        </motion.div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Cliente</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Total Gasto</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Pedidos</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Última Compra</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredCustomers.map((customer, index) => (
                    <motion.tr
                      key={customer.email}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                            {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{customer.name}</p>
                            <p className="text-sm text-muted-foreground">{customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-semibold text-primary">{formatCurrency(customer.total_spent)}</span>
                      </td>
                      <td className="py-4 px-4 text-right text-foreground hidden sm:table-cell">
                        {customer.orders_count}
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground hidden md:table-cell">
                        {formatDate(customer.last_purchase)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-6 py-4">
              {/* Customer Info */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
                <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                  {selectedCustomer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground">{selectedCustomer.name}</h3>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {selectedCustomer.email}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-secondary/50">
                  <p className="text-2xl font-bold text-primary">{formatCurrency(selectedCustomer.total_spent)}</p>
                  <p className="text-sm text-muted-foreground">Total Gasto</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-secondary/50">
                  <p className="text-2xl font-bold text-foreground">{selectedCustomer.orders_count}</p>
                  <p className="text-sm text-muted-foreground">Pedidos</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-secondary/50">
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(selectedCustomer.total_spent / selectedCustomer.orders_count)}
                  </p>
                  <p className="text-sm text-muted-foreground">Ticket Médio</p>
                </div>
              </div>

              {/* Dates */}
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Cliente desde: {formatDate(selectedCustomer.first_purchase)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Última compra: {formatDate(selectedCustomer.last_purchase)}</span>
                </div>
              </div>

              {/* Orders History */}
              {customerOrders.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Histórico de Pedidos</h4>
                  <div className="space-y-2">
                    {customerOrders.map((order: { id: string; created_at: string; total: number; status: string }) => (
                      <div 
                        key={order.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm text-muted-foreground">#{order.id.slice(0, 8)}</span>
                          <div>
                            <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">{formatCurrency(order.total)}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            order.status === "paid" ? "bg-success/10 text-success" :
                            order.status === "pending" ? "bg-warning/10 text-warning" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {order.status === "paid" ? "Pago" : 
                             order.status === "pending" ? "Pendente" : "Reembolsado"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Customers;
