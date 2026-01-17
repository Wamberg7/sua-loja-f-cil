import { UserPlus, Store, Package, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Cadastre-se grátis",
    description: "Crie sua conta em segundos. Sem cartão de crédito, sem complicação.",
  },
  {
    number: "02",
    icon: Store,
    title: "Personalize sua loja",
    description: "Escolha um template, adicione seu logo e cores. Sua loja estará pronta.",
  },
  {
    number: "03",
    icon: Package,
    title: "Adicione produtos",
    description: "Cadastre seus produtos digitais com entrega automática configurada.",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Comece a vender",
    description: "Compartilhe sua loja e receba pagamentos. É simples assim!",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="como-funciona" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Simples e rápido
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Como funciona?
          </h2>
          <p className="text-muted-foreground text-lg">
            Em 4 passos simples você estará vendendo online
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}

              <div className="text-center">
                {/* Number badge */}
                <div className="relative inline-flex mb-6">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/20">
                    <step.icon className="w-10 h-10 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground font-display font-bold text-sm flex items-center justify-center">
                    {step.number}
                  </span>
                </div>

                <h3 className="font-display text-xl font-semibold mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
