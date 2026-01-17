import { motion } from "framer-motion";
import { 
  Zap, 
  CreditCard, 
  Mail, 
  BarChart3, 
  Shield, 
  Palette,
  Clock,
  Users
} from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Criação Instantânea",
    description: "Monte sua loja em menos de 5 minutos. Sem código, sem complicação.",
    color: "primary"
  },
  {
    icon: CreditCard,
    title: "Pagamentos Integrados",
    description: "Pix e cartão de crédito com aprovação instantânea e taxas competitivas.",
    color: "accent"
  },
  {
    icon: Mail,
    title: "Entrega Automática",
    description: "Seus clientes recebem o produto automaticamente por email após a compra.",
    color: "success"
  },
  {
    icon: BarChart3,
    title: "Dashboard Completo",
    description: "Acompanhe vendas, clientes e métricas em tempo real.",
    color: "primary"
  },
  {
    icon: Shield,
    title: "Segurança Total",
    description: "Proteção de dados e transações com criptografia de ponta.",
    color: "warning"
  },
  {
    icon: Palette,
    title: "Personalização",
    description: "Customize sua loja com sua marca e identidade visual.",
    color: "accent"
  },
  {
    icon: Clock,
    title: "Suporte 24/7",
    description: "Equipe dedicada pronta para ajudar a qualquer momento.",
    color: "success"
  },
  {
    icon: Users,
    title: "Multi-Usuários",
    description: "Adicione funcionários com permissões personalizadas.",
    color: "primary"
  }
];

const BenefitsSection = () => {
  return (
    <section id="recursos" className="py-24 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
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
            Por que escolher a DigitalHub?
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Tudo que você precisa para{" "}
            <span className="text-gradient">vender mais</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ferramentas poderosas e intuitivas para impulsionar suas vendas de produtos digitais.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl bg-gradient-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
                <div 
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    benefit.color === 'primary' ? 'bg-primary/10' :
                    benefit.color === 'accent' ? 'bg-accent/10' :
                    benefit.color === 'success' ? 'bg-success/10' :
                    'bg-warning/10'
                  }`}
                >
                  <benefit.icon 
                    className={`w-6 h-6 ${
                      benefit.color === 'primary' ? 'text-primary' :
                      benefit.color === 'accent' ? 'text-accent' :
                      benefit.color === 'success' ? 'text-success' :
                      'text-warning'
                    }`} 
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
