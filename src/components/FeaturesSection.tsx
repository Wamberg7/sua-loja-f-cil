import { 
  Zap, 
  Palette, 
  MessageSquare, 
  Shield, 
  CreditCard, 
  BarChart3 
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Setup em 5 minutos",
    description: "Configure sua loja completa rapidamente. Sem código, sem complicação.",
    color: "text-primary",
  },
  {
    icon: Palette,
    title: "Templates premium",
    description: "Escolha entre dezenas de templates profissionais e personalizáveis.",
    color: "text-accent",
  },
  {
    icon: MessageSquare,
    title: "Integração Discord",
    description: "Bot completo para gerenciar pedidos e entregas diretamente no Discord.",
    color: "text-discord",
  },
  {
    icon: Shield,
    title: "Pagamentos seguros",
    description: "PIX, cartão e boleto com processamento automático e seguro.",
    color: "text-success",
  },
  {
    icon: CreditCard,
    title: "Produtos digitais",
    description: "Venda keys, contas, serviços, downloads e muito mais.",
    color: "text-neon-pink",
  },
  {
    icon: BarChart3,
    title: "Analytics completo",
    description: "Dashboard com métricas de vendas, conversões e comportamento.",
    color: "text-neon-blue",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Tudo que você precisa para{" "}
            <span className="gradient-text">vender online</span>
          </h2>
          <p className="text-muted-foreground">
            Recursos poderosos para criar, gerenciar e escalar sua loja digital
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-xl bg-card border border-border card-glow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
