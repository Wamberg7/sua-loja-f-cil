import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    description: "Ideal para quem está começando",
    price: "0",
    period: "para sempre",
    features: [
      "Até 10 produtos",
      "Taxa de 5% + R$0,80 por venda",
      "Checkout básico",
      "Suporte por email",
      "Dashboard básico"
    ],
    cta: "Começar Grátis",
    popular: false
  },
  {
    name: "Pro",
    description: "Para criadores em crescimento",
    price: "49",
    period: "/mês",
    features: [
      "Produtos ilimitados",
      "Taxa de 3% + R$0,80 por venda",
      "Checkout personalizado",
      "Suporte prioritário",
      "Dashboard avançado",
      "Cupons de desconto",
      "Área do cliente"
    ],
    cta: "Começar Agora",
    popular: true
  },
  {
    name: "Business",
    description: "Para negócios em escala",
    price: "149",
    period: "/mês",
    features: [
      "Tudo do Pro +",
      "Taxa de 2% + R$0,80 por venda",
      "Multi-usuários",
      "API completa",
      "Gerente de conta",
      "SLA 99.9%",
      "Integrações avançadas",
      "Relatórios personalizados"
    ],
    cta: "Falar com Vendas",
    popular: false
  }
];

const PricingSection = () => {
  return (
    <section id="planos" className="py-24 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[300px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Preços Transparentes
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Escolha seu <span className="text-gradient">plano ideal</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comece gratuitamente e escale conforme seu negócio cresce.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                plan.popular 
                  ? 'bg-gradient-to-b from-primary/20 to-card border-2 border-primary shadow-glow' 
                  : 'bg-gradient-card border border-border'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold">
                    <Star className="w-4 h-4 fill-current" />
                    Mais Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2 text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-muted-foreground">R$</span>
                  <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      plan.popular ? 'bg-primary/20' : 'bg-secondary'
                    }`}>
                      <Check className={`w-3 h-3 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link to="/cadastro">
                <Button 
                  variant={plan.popular ? "hero" : "outline"} 
                  size="lg"
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Platform Fee Notice */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-12"
        >
          * Todas as transações incluem taxa de processamento de pagamento.
        </motion.p>
      </div>
    </section>
  );
};

export default PricingSection;
