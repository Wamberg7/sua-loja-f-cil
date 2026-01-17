import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const orders = [
  {
    id: "#12345",
    customer: "João Silva",
    product: "Premium VIP",
    amount: "R$ 49,90",
    status: "completed",
    time: "2 min atrás",
  },
  {
    id: "#12344",
    customer: "Maria Santos",
    product: "Key Especial",
    amount: "R$ 19,90",
    status: "completed",
    time: "15 min atrás",
  },
  {
    id: "#12343",
    customer: "Pedro Costa",
    product: "Pack Ultimate",
    amount: "R$ 99,90",
    status: "pending",
    time: "32 min atrás",
  },
  {
    id: "#12342",
    customer: "Ana Oliveira",
    product: "Premium VIP",
    amount: "R$ 49,90",
    status: "completed",
    time: "1h atrás",
  },
  {
    id: "#12341",
    customer: "Lucas Lima",
    product: "Key Especial",
    amount: "R$ 19,90",
    status: "failed",
    time: "2h atrás",
  },
];

const statusConfig = {
  completed: { label: "Concluído", variant: "default" as const, className: "bg-success/20 text-success border-success/30" },
  pending: { label: "Pendente", variant: "outline" as const, className: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" },
  failed: { label: "Falhou", variant: "destructive" as const, className: "bg-destructive/20 text-destructive border-destructive/30" },
};

export function RecentOrders() {
  return (
    <div className="p-6 rounded-xl bg-card border border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display font-semibold text-lg">Pedidos Recentes</h3>
          <p className="text-sm text-muted-foreground">Últimas transações</p>
        </div>
        <a href="/dashboard/orders" className="text-sm text-primary hover:underline">
          Ver todos
        </a>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary/20 text-primary text-sm">
                  {order.customer
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{order.customer}</p>
                <p className="text-xs text-muted-foreground">
                  {order.product} • {order.time}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-sm">{order.amount}</span>
              <Badge
                variant={statusConfig[order.status as keyof typeof statusConfig].variant}
                className={statusConfig[order.status as keyof typeof statusConfig].className}
              >
                {statusConfig[order.status as keyof typeof statusConfig].label}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
