import { 
  Rocket, 
  Package, 
  CreditCard, 
  MessageSquare, 
  LayoutDashboard, 
  Users,
  Sparkles,
  ShieldCheck
} from "lucide-react";

const benefits = [
  {
    icon: Rocket,
    title: "Loja pronta em minutos",
    description: "Configure sua loja digital personalizada sem precisar de conhecimento técnico.",
    color: "text-primary",
  },
  {
    icon: Package,
    title: "Entrega 100% automática",
    description: "Seus produtos são enviados automaticamente após confirmação do pagamento.",
    color: "text-success",
  },
  {
    icon: CreditCard,
    title: "Pagamentos integrados",
    description: "PIX, cartão e boleto com processamento seguro e saque rápido.",
    color: "text-accent",
  },
  {
    icon: MessageSquare,
    title: "Integração com Discord",
    description: "Bot completo para gerenciar vendas e entregar produtos na sua comunidade.",
    color: "text-discord",
  },
  {
    icon: LayoutDashboard,
    title: "Painel intuitivo",
    description: "Dashboard simples e completo para gerenciar vendas, produtos e clientes.",
    color: "text-neon-blue",
  },
  {
    icon: Users,
    title: "Para todos os níveis",
    description: "Ideal para iniciantes, profissionais e até menores de idade.",
    color: "text-neon-pink",
  },
  {
    icon: Sparkles,
    title: "Sem burocracia",
    description: "Comece a vender hoje mesmo, sem documentos complexos ou aprovações.",
    color: "text-yellow-500",
  },
  {
    icon: ShieldCheck,
    title: "Segurança total",
    description: "Seus dados e transações protegidos com criptografia de ponta.",
    color: "text-primary",
  },
];

const BenefitsSection = () => {
  return (
    <section id="beneficios" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Por que escolher nossa plataforma?
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Tudo que você precisa para{" "}
            <span className="gradient-text">vender online</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Recursos poderosos em uma plataforma simples e acessível
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.2)]"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
