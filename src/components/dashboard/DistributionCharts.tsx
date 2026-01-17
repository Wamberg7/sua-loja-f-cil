import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// Category distribution data
const categoryData = [
  { name: "Cursos", value: 45, color: "hsl(var(--primary))" },
  { name: "E-books", value: 25, color: "hsl(var(--accent))" },
  { name: "Templates", value: 18, color: "hsl(var(--success))" },
  { name: "Outros", value: 12, color: "hsl(var(--warning))" },
];

// Payment method distribution data
const paymentData = [
  { name: "Pix", value: 58, color: "hsl(var(--primary))" },
  { name: "Cartão Crédito", value: 32, color: "hsl(var(--accent))" },
  { name: "Cartão Débito", value: 10, color: "hsl(var(--success))" },
];

// Site visits data (last 7 days)
const visitsData = [
  { day: "Seg", visitas: 1250, unicos: 890 },
  { day: "Ter", visitas: 1480, unicos: 1020 },
  { day: "Qua", visitas: 1320, unicos: 950 },
  { day: "Qui", visitas: 1650, unicos: 1180 },
  { day: "Sex", visitas: 1890, unicos: 1340 },
  { day: "Sáb", visitas: 980, unicos: 720 },
  { day: "Dom", visitas: 850, unicos: 620 },
];

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">
          {payload[0].name}: <span className="font-bold">{payload[0].value}%</span>
        </p>
      </div>
    );
  }
  return null;
};

const CustomVisitsTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name === 'visitas' ? 'Total' : 'Únicos'}: {' '}
            <span className="font-semibold">{entry.value.toLocaleString('pt-BR')}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.1) return null;

  return (
    <text
      x={x}
      y={y}
      fill="hsl(var(--foreground))"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-semibold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const DistributionCharts = () => {
  const totalVisits = visitsData.reduce((sum, item) => sum + item.visitas, 0);
  const totalUnique = visitsData.reduce((sum, item) => sum + item.unicos, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="mb-8"
    >
      <h2 className="text-lg font-semibold text-foreground mb-6">Distribuição e Visitas</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Distribution */}
        <div className="bg-gradient-card rounded-xl border border-border p-6">
          <h3 className="text-md font-semibold text-foreground mb-4">Vendas por Categoria</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomLabel}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method Distribution */}
        <div className="bg-gradient-card rounded-xl border border-border p-6">
          <h3 className="text-md font-semibold text-foreground mb-4">Métodos de Pagamento</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomLabel}
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {paymentData.map((item, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Site Visits Chart */}
        <div className="bg-gradient-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-semibold text-foreground">Visitas no Site</h3>
            <span className="text-xs text-muted-foreground">Últimos 7 dias</span>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-secondary/50 rounded-lg p-2.5">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total</p>
              <p className="text-lg font-bold text-foreground">{totalVisits.toLocaleString('pt-BR')}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-2.5">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Únicos</p>
              <p className="text-lg font-bold text-foreground">{totalUnique.toLocaleString('pt-BR')}</p>
            </div>
          </div>

          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitsData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="hsl(var(--border))" 
                  vertical={false}
                />
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                  width={35}
                />
                <Tooltip content={<CustomVisitsTooltip />} />
                <Line
                  type="monotone"
                  dataKey="visitas"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="unicos"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--accent))', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex gap-4 justify-center mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">Total</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-accent" />
              <span className="text-xs text-muted-foreground">Únicos</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DistributionCharts;
