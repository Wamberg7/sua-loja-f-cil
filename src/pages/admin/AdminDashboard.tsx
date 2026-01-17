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
  CheckCircle
} from "lucide-react";

const stats = [
  {
    title: "Total de Lojas",
    value: "1,247",
    change: "+12%",
    trend: "up",
    icon: Store,
  },
  {
    title: "Usuários Ativos",
    value: "8,432",
    change: "+8%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Vendas Hoje",
    value: "R$ 45.890",
    change: "+23%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Receita Plataforma",
    value: "R$ 12.340",
    change: "+15%",
    trend: "up",
    icon: DollarSign,
  },
];

const pendingApprovals = [
  { id: 1, store: "Loja Digital Pro", type: "Carteira", date: "Hoje, 14:30" },
  { id: 2, store: "E-books Master", type: "Saque", date: "Hoje, 12:15" },
  { id: 3, store: "Cursos Online", type: "Carteira", date: "Ontem, 18:45" },
  { id: 4, store: "Templates Hub", type: "Saque", date: "Ontem, 10:20" },
];

const recentActivity = [
  { id: 1, action: "Nova loja criada", details: "Design Academy", time: "5 min atrás" },
  { id: 2, action: "Saque aprovado", details: "R$ 2.500 - Loja XYZ", time: "15 min atrás" },
  { id: 3, action: "Carteira aprovada", details: "E-books Master", time: "1h atrás" },
  { id: 4, action: "Upgrade de plano", details: "Cursos Online → Pro", time: "2h atrás" },
  { id: 5, action: "Nova venda", details: "R$ 890 - Templates Hub", time: "3h atrás" },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Super Admin</h1>
          <p className="text-muted-foreground mt-1">Visão geral da plataforma</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
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
          {/* Pending Approvals */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Aprovações Pendentes</CardTitle>
              <AlertCircle className="w-5 h-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-foreground">{item.store}</p>
                      <p className="text-sm text-muted-foreground">{item.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500">
                        Pendente
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Atividade Recente</CardTitle>
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.action}</p>
                      <p className="text-sm text-muted-foreground">{item.details}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Revenue Chart Placeholder */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Receita da Plataforma (Últimos 30 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">Gráfico de receita será exibido aqui</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
