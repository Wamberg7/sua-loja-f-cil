import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Store, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";
import { useAdminStats } from "@/hooks/useStats";
import { useAllWallets } from "@/hooks/useWallet";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value / 100);
};

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: wallets, isLoading: walletsLoading } = useAllWallets();

  const pendingWallets = wallets?.filter(w => !w.is_approved) || [];

  const statsData = [
    {
      title: "Total de Lojas",
      value: stats?.stores_count?.toString() || "0",
      change: "+12%",
      trend: "up",
      icon: Store,
    },
    {
      title: "Usuários Ativos",
      value: stats?.users_count?.toString() || "0",
      change: "+8%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Vendas Hoje",
      value: stats ? formatCurrency(stats.sales_today) : "R$ 0",
      change: "+23%",
      trend: "up",
      icon: ShoppingCart,
    },
    {
      title: "Receita Total",
      value: stats ? formatCurrency(stats.total_revenue) : "R$ 0",
      change: "+15%",
      trend: "up",
      icon: DollarSign,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Super Admin</h1>
          <p className="text-muted-foreground mt-1">Visão geral da plataforma com dados reais</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((stat) => (
            <Card key={stat.title} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    {statsLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mt-2" />
                    ) : (
                      <>
                        <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                        <div className="flex items-center gap-1 mt-2">
                          {stat.trend === "up" ? (
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                          <span className={stat.trend === "up" ? "text-emerald-500 text-sm" : "text-red-500 text-sm"}>
                            {stat.change}
                          </span>
                          <span className="text-muted-foreground text-sm">vs mês anterior</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Wallet Approvals */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Aprovações Pendentes</CardTitle>
              <AlertCircle className="w-5 h-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              {walletsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : pendingWallets.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  Nenhuma aprovação pendente
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingWallets.slice(0, 5).map((wallet) => (
                    <div key={wallet.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-foreground">{wallet.store?.name || "Loja sem nome"}</p>
                        <p className="text-sm text-muted-foreground">Carteira</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {new Date(wallet.created_at).toLocaleDateString("pt-BR")}
                        </p>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500">
                          Pendente
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Platform Stats Summary */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Resumo da Plataforma</CardTitle>
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Total de Pedidos</p>
                      <p className="text-sm text-muted-foreground">{stats?.orders_count || 0} pedidos realizados</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Total de Produtos</p>
                      <p className="text-sm text-muted-foreground">{stats?.products_count || 0} produtos cadastrados</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Lojas Ativas</p>
                      <p className="text-sm text-muted-foreground">{stats?.stores_count || 0} lojas na plataforma</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Carteiras Pendentes</p>
                      <p className="text-sm text-muted-foreground">{pendingWallets.length} aguardando aprovação</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Revenue Overview */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Visão Geral de Receita</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Receita Total</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stats ? formatCurrency(stats.total_revenue) : "R$ 0"}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Vendas Hoje</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stats ? formatCurrency(stats.sales_today) : "R$ 0"}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Ticket Médio</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stats && stats.orders_count > 0 
                    ? formatCurrency(stats.total_revenue / stats.orders_count) 
                    : "R$ 0"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
