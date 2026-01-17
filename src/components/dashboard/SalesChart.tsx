import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", vendas: 4000, lucro: 2400 },
  { name: "Fev", vendas: 3000, lucro: 1398 },
  { name: "Mar", vendas: 5000, lucro: 3800 },
  { name: "Abr", vendas: 2780, lucro: 1908 },
  { name: "Mai", vendas: 6890, lucro: 4800 },
  { name: "Jun", vendas: 7390, lucro: 5300 },
  { name: "Jul", vendas: 8490, lucro: 6100 },
];

export function SalesChart() {
  return (
    <div className="p-6 rounded-xl bg-card border border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display font-semibold text-lg">Faturamento</h3>
          <p className="text-sm text-muted-foreground">Últimos 7 meses</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Vendas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-muted-foreground">Lucro</span>
          </div>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(235, 86%, 65%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(235, 86%, 65%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(280, 100%, 70%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(280, 100%, 70%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(228, 15%, 20%)" />
            <XAxis
              dataKey="name"
              stroke="hsl(215, 20%, 65%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(215, 20%, 65%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(228, 15%, 12%)",
                border: "1px solid hsl(228, 15%, 20%)",
                borderRadius: "8px",
                color: "hsl(210, 40%, 98%)",
              }}
              formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, ""]}
            />
            <Area
              type="monotone"
              dataKey="vendas"
              stroke="hsl(235, 86%, 65%)"
              fillOpacity={1}
              fill="url(#colorVendas)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="lucro"
              stroke="hsl(280, 100%, 70%)"
              fillOpacity={1}
              fill="url(#colorLucro)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
