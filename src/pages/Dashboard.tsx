import { motion } from "framer-motion";
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SalesRevenueCharts from "@/components/dashboard/SalesRevenueCharts";
import DistributionCharts from "@/components/dashboard/DistributionCharts";
import { useStoreStats } from "@/hooks/useStats";
import { useWalletBalance } from "@/hooks/useWallet";
import { useOrders } from "@/hooks/useOrders";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value / 100);
};

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useStoreStats();
  const { data: wallet, isLoading: walletLoading } = useWalletBalance();
  const { data: orders, isLoading: ordersLoading } = useOrders();

  const recentOrders = orders?.slice(0, 5) || [];

  const statsData = [
    {
      title: "Vendas Hoje",
      value: stats ? formatCurrency(stats.sales_today) : "R$ 0",
      change: stats ? `${stats.sales_today_change >= 0 ? '+' : ''}${stats.sales_today_change}%` : "0%",
      trend: stats?.sales_today_change >= 0 ? "up" : "down",
      icon: DollarSign,
      color: "primary"
    },
    {
      title: "Pedidos",
      value: stats?.orders_count?.toString() || "0",
      change: stats ? `${stats.orders_change >= 0 ? '+' : ''}${stats.orders_change}%` : "0%",
      trend: stats?.orders_change >= 0 ? "up" : "down",
      icon: ShoppingCart,
      color: "accent"
    },
    {
      title: "Clientes",
      value: stats?.customers_count?.toString() || "0",
      change: stats ? `${stats.customers_change >= 0 ? '+' : ''}${stats.customers_change}%` : "0%",
      trend: stats?.customers_change >= 0 ? "up" : "down",
      icon: Users,
      color: "success"
    },
    {
      title: "Produtos Ativos",
      value: stats?.products_count?.toString() || "0",
      change: "0%",
      trend: "neutral" as const,
      icon: Package,
      color: "warning"
    }
  ];

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Pendente",
      paid: "Pago",
      cancelled: "Cancelado",
      refunded: "Reembolsado"
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    if (status === "paid") return "bg-success/10 text-success";
    if (status === "pending") return "bg-warning/10 text-warning";
    return "bg-muted text-muted-foreground";
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo de volta! Aqui está um resumo da sua loja.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-gradient-card rounded-xl p-6 border border-border hover:border-primary/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div 
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  stat.color === 'primary' ? 'bg-primary/10' :
                  stat.color === 'accent' ? 'bg-accent/10' :
                  stat.color === 'success' ? 'bg-success/10' :
                  'bg-warning/10'
                }`}
              >
                <stat.icon 
                  className={`w-6 h-6 ${
                    stat.color === 'primary' ? 'text-primary' :
                    stat.color === 'accent' ? 'text-accent' :
                    stat.color === 'success' ? 'text-success' :
                    'text-warning'
                  }`} 
                />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                stat.trend === 'up' ? 'text-success' : 
                stat.trend === 'down' ? 'text-destructive' : 
                'text-muted-foreground'
              }`}>
                {stat.trend === 'up' && <ArrowUpRight className="w-4 h-4" />}
                {stat.trend === 'down' && <ArrowDownRight className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            {statsLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </>
            )}
          </motion.div>
        ))}
      </div>

      {/* Sales & Revenue Charts */}
      <SalesRevenueCharts />

      {/* Distribution & Visits Charts */}
      <DistributionCharts />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="lg:col-span-2 bg-gradient-card rounded-xl border border-border p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Pedidos Recentes</h2>
            <a href="/dashboard/pedidos" className="text-sm text-primary hover:underline">
              Ver todos
            </a>
          </div>
          
          <div className="overflow-x-auto">
            {ordersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : recentOrders.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">Nenhum pedido encontrado</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">ID</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Cliente</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Valor</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                      <td className="py-3 px-2 text-sm font-medium text-foreground">#{order.id.slice(0, 8)}</td>
                      <td className="py-3 px-2 text-sm text-muted-foreground">{order.customer_name || order.customer_email}</td>
                      <td className="py-3 px-2 text-sm font-medium text-foreground">{formatCurrency(order.total)}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        {/* Wallet Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="bg-gradient-card rounded-xl border border-border p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-6">Carteira</h2>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-primary">
              <p className="text-sm text-primary-foreground/80 mb-1">Saldo Disponível</p>
              {walletLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-primary-foreground" />
              ) : (
                <p className="text-3xl font-bold text-primary-foreground">
                  {formatCurrency(wallet?.available || 0)}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-secondary">
                <p className="text-xs text-muted-foreground mb-1">Pendente</p>
                <p className="text-lg font-bold text-foreground">
                  {formatCurrency(wallet?.pending || 0)}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-secondary">
                <p className="text-xs text-muted-foreground mb-1">Reservado</p>
                <p className="text-lg font-bold text-foreground">
                  {formatCurrency(wallet?.reserved || 0)}
                </p>
              </div>
            </div>

            <a 
              href="/dashboard/carteira"
              className="block w-full py-3 text-center text-sm font-medium text-primary hover:underline"
            >
              Ver detalhes da carteira →
            </a>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="mt-6 p-6 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-border"
      >
        <h3 className="font-semibold text-foreground mb-4">Ações Rápidas</h3>
        <div className="flex flex-wrap gap-3">
          <a href="/dashboard/produtos" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            + Novo Produto
          </a>
          <a href="/dashboard/cupons" className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">
            + Novo Cupom
          </a>
          <a href="/dashboard/categorias" className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">
            + Nova Categoria
          </a>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
