import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { ProductsTable } from "@/components/dashboard/ProductsTable";
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Visão Geral"
        subtitle="Bem-vindo de volta! Aqui está o resumo da sua loja."
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Faturamento Total"
            value="R$ 45.231"
            change="+20.1%"
            changeType="positive"
            icon={DollarSign}
            iconColor="text-success"
          />
          <StatsCard
            title="Pedidos"
            value="356"
            change="+12.5%"
            changeType="positive"
            icon={ShoppingCart}
            iconColor="text-primary"
          />
          <StatsCard
            title="Clientes"
            value="2,350"
            change="+8.2%"
            changeType="positive"
            icon={Users}
            iconColor="text-accent"
          />
          <StatsCard
            title="Taxa de Conversão"
            value="3.2%"
            change="-0.4%"
            changeType="negative"
            icon={TrendingUp}
            iconColor="text-neon-pink"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesChart />
          <RecentOrders />
        </div>

        {/* Products Table */}
        <ProductsTable />
      </div>
    </div>
  );
};

export default Dashboard;
