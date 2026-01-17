import { useState } from "react";
import { motion } from "framer-motion";
import { 
  CreditCard,
  Check,
  Zap,
  Crown,
  Rocket,
  ArrowRight,
  Loader2
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlans } from "@/hooks/usePlans";

const Plans = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const { data: plans = [], isLoading } = usePlans();

  // Current plan would come from user's subscription
  const currentPlan = "starter"; // This would be fetched from user data

  const formatCurrency = (value: number) => {
    return (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getYearlyPrice = (monthlyPrice: number) => {
    return Math.round(monthlyPrice * 12 * 0.8); // 20% discount
  };

  const getIcon = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes("enterprise") || name.includes("premium")) return Rocket;
    if (name.includes("pro") || name.includes("profissional")) return Crown;
    return Zap;
  };

  const isPopular = (planName: string) => {
    const name = planName.toLowerCase();
    return name.includes("pro") || name.includes("profissional");
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

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-16">
              <CreditCard className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum plano disponível</h3>
              <p className="text-muted-foreground">Os planos aparecerão aqui quando forem configurados.</p>
            </div>
          ) : (
            /* Plans Grid */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan, index) => {
                const Icon = getIcon(plan.name);
                const isCurrentPlan = plan.name.toLowerCase() === currentPlan.toLowerCase();
                const popular = isPopular(plan.name);
                const price = billingCycle === "yearly" ? getYearlyPrice(plan.price) : plan.price;
                
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative rounded-2xl border p-6 ${
                      popular 
                        ? "border-primary bg-gradient-to-b from-primary/5 to-background" 
                        : "border-border bg-card"
                    } ${isCurrentPlan ? "ring-2 ring-primary" : ""}`}
                  >
                    {popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                          Mais Popular
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
                        popular ? "bg-gradient-primary" : "bg-secondary"
                      }`}>
                        <Icon className={`w-7 h-7 ${popular ? "text-primary-foreground" : "text-foreground"}`} />
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
                      {plan.features?.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                      {plan.max_products && (
                        <li className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-foreground">Até {plan.max_products} produtos</span>
                        </li>
                      )}
                      {plan.max_monthly_views && (
                        <li className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-foreground">{plan.max_monthly_views.toLocaleString()} visitas/mês</span>
                        </li>
                      )}
                    </ul>

                    <Button
                      variant={isCurrentPlan ? "outline" : popular ? "default" : "outline"}
                      className="w-full"
                      disabled={isCurrentPlan}
                    >
                      {isCurrentPlan ? (
                        "Plano Atual"
                      ) : plan.price === 0 ? (
                        "Selecionar"
                      ) : (
                        <>
                          Fazer Upgrade
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Limits Comparison */}
          {plans.length > 0 && (
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
                          {plan.max_products ? plan.max_products : "∞"}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-4 px-4 text-sm text-muted-foreground">Visitas/mês</td>
                      {plans.map(plan => (
                        <td key={plan.id} className="py-4 px-4 text-center text-sm font-medium text-foreground">
                          {plan.max_monthly_views ? plan.max_monthly_views.toLocaleString() : "∞"}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="billing">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <CreditCard className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma fatura</h3>
            <p className="text-muted-foreground">O histórico de faturas aparecerá aqui.</p>
          </motion.div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Plans;
