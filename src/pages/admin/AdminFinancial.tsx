import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { useAllSales } from "@/hooks/useSales";
import { useAllWithdrawals } from "@/hooks/useWithdrawals";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AdminFinancial() {
  const { sales, isLoading: salesLoading, calculateFee } = useAllSales();
  const { withdrawals, isLoading: withdrawalsLoading, stats: withdrawalStats } = useAllWithdrawals();

  const isLoading = salesLoading || withdrawalsLoading;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100);
  };

  // Calculate total revenue from fees
  const totalFees = sales
    .filter(s => s.status === 'approved')
    .reduce((acc, s) => acc + calculateFee(s.total), 0);

  // Calculate this month's revenue
  const thisMonth = new Date();
  const monthlyFees = sales
    .filter(s => {
      const saleDate = new Date(s.created_at);
      return saleDate.getMonth() === thisMonth.getMonth() && 
             saleDate.getFullYear() === thisMonth.getFullYear() &&
             s.status === 'approved';
    })
    .reduce((acc, s) => acc + calculateFee(s.total), 0);

  const stats = [
    {
      title: "Receita Total (Taxas)",
      value: formatCurrency(totalFees),
      change: "+18%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Receita Mensal",
      value: formatCurrency(monthlyFees),
      change: "+12%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Saques Pendentes",
      value: formatCurrency(withdrawalStats.pendingAmount),
      change: `${withdrawalStats.pending} pedidos`,
      trend: "neutral",
      icon: Wallet,
    },
  ];

  // Build recent transactions from sales and withdrawals
  const recentTransactions = [
    ...sales.slice(0, 5).map(sale => ({
      id: sale.id,
      type: "income" as const,
      description: `Taxa de venda - ${sale.store?.name || 'Loja'}`,
      value: formatCurrency(calculateFee(sale.total)),
      date: format(new Date(sale.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR }),
      timestamp: new Date(sale.created_at).getTime(),
    })),
    ...withdrawals.filter(w => w.status === 'completed').slice(0, 5).map(w => ({
      id: w.id,
      type: "expense" as const,
      description: `Saque aprovado - ${w.store?.name || 'Loja'}`,
      value: formatCurrency(w.amount),
      date: format(new Date(w.completed_at || w.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR }),
      timestamp: new Date(w.completed_at || w.created_at).getTime(),
    })),
  ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 8);

  // Calculate monthly revenue breakdown
  const getMonthlyData = () => {
    const months: Record<string, { fees: number; total: number }> = {};
    
    sales.filter(s => s.status === 'approved').forEach(sale => {
      const date = new Date(sale.created_at);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!months[key]) {
        months[key] = { fees: 0, total: 0 };
      }
      months[key].fees += calculateFee(sale.total);
      months[key].total += sale.total;
    });

    return Object.entries(months)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 4)
      .map(([key, data]) => {
        const [year, month] = key.split('-').map(Number);
        const date = new Date(year, month);
        return {
          month: format(date, "MMM", { locale: ptBR }),
          fees: formatCurrency(data.fees),
          total: formatCurrency(data.total),
        };
      });
  };

  const monthlyRevenue = getMonthlyData();

  // Top stores by revenue
  const getTopStores = () => {
    const storeRevenue: Record<string, { name: string; revenue: number }> = {};
    
    sales.filter(s => s.status === 'approved').forEach(sale => {
      const storeId = sale.store_id;
      const storeName = sale.store?.name || 'Loja';
      if (!storeRevenue[storeId]) {
        storeRevenue[storeId] = { name: storeName, revenue: 0 };
      }
      storeRevenue[storeId].revenue += calculateFee(sale.total);
    });

    return Object.values(storeRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3);
  };

  const topStores = getTopStores();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financeiro</h1>
          <p className="text-muted-foreground mt-1">Receita e movimentações da plataforma</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.trend === "up" && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                      <span className={stat.trend === "up" ? "text-emerald-500 text-sm" : "text-muted-foreground text-sm"}>
                        {stat.change}
                      </span>
                    </div>
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
          {/* Recent Transactions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Movimentações Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : recentTransactions.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Nenhuma movimentação</p>
              ) : (
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            transaction.type === "income"
                              ? "bg-emerald-500/10"
                              : "bg-red-500/10"
                          }`}
                        >
                          {transaction.type === "income" ? (
                            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                      <span
                        className={`font-semibold ${
                          transaction.type === "income" ? "text-emerald-500" : "text-red-500"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}{transaction.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monthly Revenue */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Receita Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : monthlyRevenue.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Sem dados</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mês</TableHead>
                      <TableHead>Taxas</TableHead>
                      <TableHead className="text-right">Total Vendas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyRevenue.map((row) => (
                      <TableRow key={row.month}>
                        <TableCell className="font-medium capitalize">{row.month}</TableCell>
                        <TableCell className="text-primary font-semibold">{row.fees}</TableCell>
                        <TableCell className="text-right">{row.total}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Stores */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Top Lojas por Receita (Taxa)</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : topStores.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Sem dados</p>
            ) : (
              <div className="space-y-3">
                {topStores.map((store, index) => (
                  <div key={store.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                        {index + 1}
                      </span>
                      <span className="font-medium">{store.name}</span>
                    </div>
                    <Badge variant="outline">{formatCurrency(store.revenue)}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
