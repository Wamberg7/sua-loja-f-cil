import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminStatsCard } from "@/components/admin/AdminStatsCard";
import {
  Users,
  Store,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Package,
  Activity,
  AlertTriangle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const revenueData = [
  { name: "Jan", valor: 45000 },
  { name: "Fev", valor: 52000 },
  { name: "Mar", valor: 48000 },
  { name: "Abr", valor: 61000 },
  { name: "Mai", valor: 55000 },
  { name: "Jun", valor: 78000 },
  { name: "Jul", valor: 92000 },
];

const categoryData = [
  { name: "Keys", value: 35, color: "hsl(235, 86%, 65%)" },
  { name: "Cursos", value: 25, color: "hsl(280, 100%, 70%)" },
  { name: "Licenças", value: 20, color: "hsl(142, 76%, 36%)" },
  { name: "Acessos", value: 15, color: "hsl(200, 100%, 60%)" },
  { name: "Outros", value: 5, color: "hsl(215, 20%, 65%)" },
];

const recentActivities = [
  { action: "Nova loja criada", user: "Lucas Silva", time: "2 min", type: "store" },
  { action: "Usuário suspenso", user: "Admin", time: "15 min", type: "warning" },
  { action: "Pagamento processado", user: "Sistema", time: "32 min", type: "payment" },
  { action: "Novo usuário registrado", user: "Maria Santos", time: "1h", type: "user" },
  { action: "Ticket de suporte", user: "Pedro Costa", time: "2h", type: "ticket" },
];

const AdminDashboard = () => {
  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Dashboard SuperAdmin"
        subtitle="Visão geral da plataforma"
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatsCard
            title="Usuários Totais"
            value="12.458"
            change="+342 este mês"
            changeType="positive"
            icon={Users}
            iconBg="bg-primary/10"
            iconColor="text-primary"
          />
          <AdminStatsCard
            title="Lojas Ativas"
            value="5.231"
            change="+89 esta semana"
            changeType="positive"
            icon={Store}
            iconBg="bg-accent/10"
            iconColor="text-accent"
          />
          <AdminStatsCard
            title="Faturamento Total"
            value="R$ 2.4M"
            change="+18.5% vs mês anterior"
            changeType="positive"
            icon={DollarSign}
            iconBg="bg-success/10"
            iconColor="text-success"
          />
          <AdminStatsCard
            title="Pedidos Hoje"
            value="1.847"
            change="+12% vs ontem"
            changeType="positive"
            icon={ShoppingCart}
            iconBg="bg-neon-blue/10"
            iconColor="text-neon-blue"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatsCard
            title="Taxa de Conversão"
            value="4.8%"
            change="+0.3% esta semana"
            changeType="positive"
            icon={TrendingUp}
            iconBg="bg-yellow-500/10"
            iconColor="text-yellow-500"
          />
          <AdminStatsCard
            title="Produtos Ativos"
            value="28.943"
            change="Em 5.231 lojas"
            changeType="neutral"
            icon={Package}
            iconBg="bg-neon-pink/10"
            iconColor="text-neon-pink"
          />
          <AdminStatsCard
            title="Uptime"
            value="99.98%"
            change="Últimos 30 dias"
            changeType="positive"
            icon={Activity}
            iconBg="bg-success/10"
            iconColor="text-success"
          />
          <AdminStatsCard
            title="Tickets Pendentes"
            value="23"
            change="5 urgentes"
            changeType="negative"
            icon={AlertTriangle}
            iconBg="bg-destructive/10"
            iconColor="text-destructive"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 p-6 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display font-semibold text-lg">Faturamento da Plataforma</h3>
                <p className="text-sm text-muted-foreground">Últimos 7 meses</p>
              </div>
              <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                +18.5%
              </Badge>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(235, 86%, 65%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(235, 86%, 65%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(228, 15%, 20%)" />
                  <XAxis dataKey="name" stroke="hsl(215, 20%, 65%)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(215, 20%, 65%)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(228, 15%, 12%)",
                      border: "1px solid hsl(228, 15%, 20%)",
                      borderRadius: "8px",
                      color: "hsl(210, 40%, 98%)",
                    }}
                    formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, "Faturamento"]}
                  />
                  <Area type="monotone" dataKey="valor" stroke="hsl(235, 86%, 65%)" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="mb-6">
              <h3 className="font-display font-semibold text-lg">Categorias de Produtos</h3>
              <p className="text-sm text-muted-foreground">Distribuição por tipo</p>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(228, 15%, 12%)",
                      border: "1px solid hsl(228, 15%, 20%)",
                      borderRadius: "8px",
                      color: "hsl(210, 40%, 98%)",
                    }}
                    formatter={(value: number) => [`${value}%`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-muted-foreground">{cat.name}</span>
                  </div>
                  <span className="font-medium">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display font-semibold text-lg">Atividade Recente</h3>
                <p className="text-sm text-muted-foreground">Últimas ações do sistema</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/logs">Ver todos</Link>
              </Button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === "warning" ? "bg-yellow-500" :
                      activity.type === "payment" ? "bg-success" :
                      activity.type === "store" ? "bg-primary" :
                      "bg-muted-foreground"
                    }`} />
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.user}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="mb-6">
              <h3 className="font-display font-semibold text-lg">Ações Rápidas</h3>
              <p className="text-sm text-muted-foreground">Acesso direto às principais funções</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/admin/users">
                  <Users className="w-5 h-5 text-primary" />
                  <span>Gerenciar Usuários</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/admin/stores">
                  <Store className="w-5 h-5 text-accent" />
                  <span>Gerenciar Lojas</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/admin/payments">
                  <DollarSign className="w-5 h-5 text-success" />
                  <span>Pagamentos</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/admin/settings">
                  <Activity className="w-5 h-5 text-neon-pink" />
                  <span>Configurações</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
