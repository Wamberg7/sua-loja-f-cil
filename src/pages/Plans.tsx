import { useState } from "react";
import { motion } from "framer-motion";
import { 
  CreditCard,
  Check,
  Zap,
  Crown,
  Rocket,
  Clock,
  Download,
  ArrowRight
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Plan {
  id: string;
  name: string;
  price: number;
  period: "monthly" | "yearly";
  icon: React.ElementType;
  popular?: boolean;
  features: string[];
  limits: {
    products: number | "unlimited";
    sales: number | "unlimited";
    support: string;
  };
}

interface Payment {
  id: string;
  date: string;
  plan: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  invoice?: string;
}

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    period: "monthly",
    icon: Zap,
    features: [
      "Até 5 produtos",
      "100 vendas/mês",
      "Taxa: 5% + R$1,00",
      "Suporte por email",
      "Relatórios básicos"
    ],
    limits: {
      products: 5,
      sales: 100,
      support: "Email"
    }
  },
  {
    id: "pro",
    name: "Pro",
    price: 97,
    period: "monthly",
    icon: Crown,
    popular: true,
    features: [
      "Até 50 produtos",
      "1.000 vendas/mês",
      "Taxa: 3% + R$0,80",
      "Suporte prioritário",
      "Relatórios avançados",
      "Cupons ilimitados",
      "Domínio personalizado"
    ],
    limits: {
      products: 50,
      sales: 1000,
      support: "Prioritário"
    }
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 297,
    period: "monthly",
    icon: Rocket,
    features: [
      "Produtos ilimitados",
      "Vendas ilimitadas",
      "Taxa: 2% + R$0,50",
      "Suporte 24/7",
      "API completa",
      "White-label",
      "Gerente de conta",
      "SLA garantido"
    ],
    limits: {
      products: "unlimited",
      sales: "unlimited",
      support: "24/7"
    }
  },
];

const mockPayments: Payment[] = [
  { id: "1", date: "2024-01-15", plan: "Pro", amount: 97, status: "paid", invoice: "#INV-001" },
  { id: "2", date: "2023-12-15", plan: "Pro", amount: 97, status: "paid", invoice: "#INV-002" },
  { id: "3", date: "2023-11-15", plan: "Pro", amount: 97, status: "paid", invoice: "#INV-003" },
];

const Plans = () => {
  const [currentPlan] = useState("pro");
  const [payments] = useState<Payment[]>(mockPayments);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const getYearlyPrice = (monthlyPrice: number) => {
    return Math.round(monthlyPrice * 12 * 0.8); // 20% discount
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Planos</h1>
        <p className="text-muted-foreground">Gerencie sua assinatura e faturas</p>
      </div>

      <Tabs defaultValue="plans" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="plans">Planos</TabsTrigger>
          <TabsTrigger value="billing">Histórico de Faturas</TabsTrigger>
        </TabsList>

        <TabsContent value="plans">
          {/* Current Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <Crown className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Plano Atual</p>
                  <h3 className="text-xl font-bold text-foreground">Pro</h3>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Próxima cobrança</p>
                <p className="font-semibold text-foreground">15 de Fevereiro, 2024</p>
                <p className="text-lg font-bold text-primary">{formatCurrency(97)}/mês</p>
              </div>
            </div>
          </motion.div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-4 p-1 rounded-xl bg-secondary">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  billingCycle === "monthly" 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  billingCycle === "yearly" 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Anual
                <span className="ml-2 px-2 py-0.5 rounded-full bg-success/20 text-success text-xs">
                  -20%
                </span>
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              const isCurrentPlan = plan.id === currentPlan;
              const price = billingCycle === "yearly" ? getYearlyPrice(plan.price) : plan.price;
              
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative rounded-2xl border p-6 ${
                    plan.popular 
                      ? "border-primary bg-gradient-to-b from-primary/5 to-background" 
                      : "border-border bg-card"
                  } ${isCurrentPlan ? "ring-2 ring-primary" : ""}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        Mais Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
                      plan.popular ? "bg-gradient-primary" : "bg-secondary"
                    }`}>
                      <Icon className={`w-7 h-7 ${plan.popular ? "text-primary-foreground" : "text-foreground"}`} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-4xl font-bold text-foreground">
                        {plan.price === 0 ? "Grátis" : formatCurrency(price)}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-muted-foreground">
                          /{billingCycle === "yearly" ? "ano" : "mês"}
                        </span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={isCurrentPlan ? "outline" : plan.popular ? "default" : "outline"}
                    className="w-full"
                    disabled={isCurrentPlan}
                  >
                    {isCurrentPlan ? (
                      "Plano Atual"
                    ) : plan.price === 0 ? (
                      "Fazer Downgrade"
                    ) : (
                      <>
                        {currentPlan === "starter" || (currentPlan === "pro" && plan.id === "enterprise") 
                          ? "Fazer Upgrade" 
                          : "Fazer Downgrade"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              );
            })}
          </div>

          {/* Limits Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Comparação de Limites</h3>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Recurso</th>
                    {plans.map(plan => (
                      <th key={plan.id} className="text-center py-4 px-4 text-sm font-medium text-foreground">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-4 px-4 text-sm text-muted-foreground">Produtos</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="py-4 px-4 text-center text-sm font-medium text-foreground">
                        {plan.limits.products === "unlimited" ? "∞" : plan.limits.products}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-4 px-4 text-sm text-muted-foreground">Vendas/mês</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="py-4 px-4 text-center text-sm font-medium text-foreground">
                        {plan.limits.sales === "unlimited" ? "∞" : plan.limits.sales.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-sm text-muted-foreground">Suporte</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="py-4 px-4 text-center text-sm font-medium text-foreground">
                        {plan.limits.support}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="billing">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Data</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Plano</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Fatura</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Valor</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, index) => (
                    <motion.tr
                      key={payment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="py-4 px-4 text-sm text-foreground">{formatDate(payment.date)}</td>
                      <td className="py-4 px-4 text-sm font-medium text-foreground">{payment.plan}</td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">{payment.invoice}</td>
                      <td className="py-4 px-4 text-right text-sm font-semibold text-foreground">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payment.status === "paid" 
                            ? "bg-success/10 text-success" 
                            : payment.status === "pending"
                            ? "bg-warning/10 text-warning"
                            : "bg-destructive/10 text-destructive"
                        }`}>
                          {payment.status === "paid" ? "Pago" : 
                           payment.status === "pending" ? "Pendente" : "Falhou"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Download className="w-4 h-4" />
                          PDF
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Plans;
