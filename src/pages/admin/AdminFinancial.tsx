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
import { DollarSign, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";

const stats = [
  {
    title: "Receita Total (Taxas)",
    value: "R$ 45.890,00",
    change: "+18%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Receita Mensal",
    value: "R$ 12.340,00",
    change: "+12%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "Saques Pendentes",
    value: "R$ 8.500,00",
    change: "5 pedidos",
    trend: "neutral",
    icon: Wallet,
  },
];

const recentTransactions = [
  {
    id: 1,
    type: "income",
    description: "Taxa de venda - Loja Digital Pro",
    value: "R$ 15,71",
    date: "Hoje, 14:30",
  },
  {
    id: 2,
    type: "income",
    description: "Taxa de venda - E-books Master",
    value: "R$ 2,21",
    date: "Hoje, 12:15",
  },
  {
    id: 3,
    type: "expense",
    description: "Saque aprovado - Templates Hub",
    value: "R$ 2.500,00",
    date: "Ontem, 18:45",
  },
  {
    id: 4,
    type: "income",
    description: "Taxa de venda - Cursos Online",
    value: "R$ 6,71",
    date: "Ontem, 10:20",
  },
  {
    id: 5,
    type: "income",
    description: "Assinatura Pro - Loja XYZ",
    value: "R$ 99,00",
    date: "13/01/2024",
  },
];

const monthlyRevenue = [
  { month: "Jan", revenue: "R$ 12.340", fees: "R$ 8.500", subscriptions: "R$ 3.840" },
  { month: "Dez", revenue: "R$ 10.890", fees: "R$ 7.200", subscriptions: "R$ 3.690" },
  { month: "Nov", revenue: "R$ 9.750", fees: "R$ 6.100", subscriptions: "R$ 3.650" },
  { month: "Out", revenue: "R$ 8.900", fees: "R$ 5.400", subscriptions: "R$ 3.500" },
];

export default function AdminFinancial() {
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
            </CardContent>
          </Card>

          {/* Monthly Revenue */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Receita Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mês</TableHead>
                    <TableHead>Taxas</TableHead>
                    <TableHead>Assinaturas</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyRevenue.map((row) => (
                    <TableRow key={row.month}>
                      <TableCell className="font-medium">{row.month}</TableCell>
                      <TableCell>{row.fees}</TableCell>
                      <TableCell>{row.subscriptions}</TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        {row.revenue}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart Placeholder */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Evolução da Receita</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">Gráfico de evolução será exibido aqui</p>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Receita por Fonte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span>Taxas de Vendas (3% + R$0,80)</span>
                  </div>
                  <span className="font-semibold">68%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-secondary" />
                    <span>Assinaturas de Planos</span>
                  </div>
                  <span className="font-semibold">32%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Top Lojas por Receita</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Loja Digital Pro", "E-books Master", "Templates Hub"].map((store, index) => (
                  <div key={store} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                        {index + 1}
                      </span>
                      <span className="font-medium">{store}</span>
                    </div>
                    <Badge variant="outline">R$ {(1500 - index * 300).toLocaleString()}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
