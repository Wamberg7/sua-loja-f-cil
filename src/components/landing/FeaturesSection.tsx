import { 
  Store, 
  Zap, 
  CreditCard, 
  FileText, 
  Bell, 
  Lock,
  BarChart3,
  Palette
} from "lucide-react";

const features = [
  {
    icon: Store,
    title: "Loja online pronta",
    description: "Tenha sua loja profissional sem precisar de site próprio ou hospedagem.",
  },
  {
    icon: Zap,
    title: "Entrega automática",
    description: "Produtos enviados instantaneamente após confirmação do pagamento.",
  },
  {
    icon: CreditCard,
    title: "Gateway próprio",
    description: "Aceite PIX, cartão de crédito e boleto com taxas competitivas.",
  },
  {
    icon: FileText,
    title: "Histórico de pedidos",
    description: "Acompanhe todas as vendas, clientes e transações em um só lugar.",
  },
  {
    icon: Bell,
    title: "Notificações em tempo real",
    description: "Receba alertas de vendas no Discord, email ou diretamente no painel.",
  },
  {
    icon: Lock,
    title: "Segurança avançada",
    description: "Proteção contra fraudes e criptografia de dados sensíveis.",
  },
  {
    icon: BarChart3,
    title: "Analytics completo",
    description: "Métricas de vendas, conversão e comportamento dos clientes.",
  },
  {
    icon: Palette,
    title: "Personalização total",
    description: "Customize cores, logo, banners e deixe sua loja com sua identidade.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="recursos" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-success/10 text-success text-sm font-medium mb-4">
            Recursos completos
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Tudo em uma{" "}
            <span className="gradient-text">única plataforma</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Ferramentas profissionais para você vender mais
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex items-start gap-4 p-5 rounded-xl bg-card/50 border border-border hover:bg-card hover:border-primary/20 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
