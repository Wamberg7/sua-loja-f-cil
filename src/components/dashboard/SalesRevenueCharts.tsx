import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { TrendingUp, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

type PeriodType = "7d" | "30d" | "all";

// Mock data generator
const generateData = (days: number) => {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const dayName = date.toLocaleDateString('pt-BR', { 
      day: '2-digit',
      month: days > 14 ? '2-digit' : 'short'
    });
    
    // Generate realistic sales data with some variation
    const baseRevenue = 800 + Math.random() * 1200;
    const weekendMultiplier = [0, 6].includes(date.getDay()) ? 0.6 : 1;
    const revenue = Math.round(baseRevenue * weekendMultiplier);
    const orders = Math.round(revenue / (50 + Math.random() * 30));
    
    data.push({
      date: dayName,
      receita: revenue,
      vendas: orders,
    });
  }
  
  return data;
};

// Pre-generate datasets
const data7Days = generateData(7);
const data30Days = generateData(30);
const dataAll = generateData(90);

const periodLabels: Record<PeriodType, string> = {
  "7d": "Últimos 7 dias",
  "30d": "Últimos 30 dias",
  "all": "Período Total"
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name === 'receita' ? 'Receita' : 'Vendas'}: {' '}
            <span className="font-semibold">
              {entry.name === 'receita' 
                ? `R$ ${entry.value.toLocaleString('pt-BR')}`
                : entry.value
              }
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const SalesRevenueCharts = () => {
  const [period, setPeriod] = useState<PeriodType>("7d");
  
  const chartData = useMemo(() => {
    switch (period) {
      case "7d": return data7Days;
      case "30d": return data30Days;
      case "all": return dataAll;
      default: return data7Days;
    }
  }, [period]);
  
  const totals = useMemo(() => {
    const totalReceita = chartData.reduce((sum, item) => sum + item.receita, 0);
    const totalVendas = chartData.reduce((sum, item) => sum + item.vendas, 0);
    const avgReceita = Math.round(totalReceita / chartData.length);
    
    return { totalReceita, totalVendas, avgReceita };
  }, [chartData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="mb-8"
    >
      {/* Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Evolução de Vendas e Receita</h2>
          <p className="text-sm text-muted-foreground">{periodLabels[period]}</p>
        </div>
        <div className="flex gap-2">
          {(["7d", "30d", "all"] as PeriodType[]).map((p) => (
            <Button
              key={p}
              variant={period === p ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(p)}
              className="text-xs"
            >
              {p === "7d" ? "7 dias" : p === "30d" ? "30 dias" : "Total"}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Receita Total</span>
          </div>
          <p className="text-xl font-bold text-foreground">
            R$ {totals.totalReceita.toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="bg-gradient-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">Total de Vendas</span>
          </div>
          <p className="text-xl font-bold text-foreground">{totals.totalVendas}</p>
        </div>
        <div className="bg-gradient-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-success" />
            <span className="text-sm text-muted-foreground">Média Diária</span>
          </div>
          <p className="text-xl font-bold text-foreground">
            R$ {totals.avgReceita.toLocaleString('pt-BR')}
          </p>
        </div>
      </div>

      {/* Revenue Chart - Full Width */}
      <div className="bg-gradient-card rounded-xl border border-border p-6">
        <h3 className="text-md font-semibold text-foreground mb-4">Receita (R$)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                vertical={false}
              />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                interval={period === "all" ? 6 : period === "30d" ? 4 : 0}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="receita"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorReceita)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default SalesRevenueCharts;
