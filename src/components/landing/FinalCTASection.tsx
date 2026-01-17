import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  "Loja profissional em minutos",
  "Entrega automática de produtos",
  "Suporte ao cliente incluído",
  "Sem mensalidade ou taxa fixa",
];

const FinalCTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-30"
          style={{
            background: 'radial-gradient(ellipse at center, hsl(235 86% 65% / 0.3) 0%, transparent 60%)'
          }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] opacity-20"
          style={{
            background: 'radial-gradient(circle, hsl(280 100% 70% / 0.4) 0%, transparent 70%)'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Card */}
          <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />

            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-8">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Comece hoje mesmo</span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Pronto para começar a{" "}
                <span className="gradient-text">vender online</span>?
              </h2>

              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Junte-se a milhares de vendedores que já estão lucrando com nossa plataforma. 
                Crie sua loja em minutos e comece a vender hoje.
              </p>

              {/* Benefits checklist */}
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-10">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="hero" size="xl" className="w-full sm:w-auto" asChild>
                  <Link to="/dashboard">
                    Criar minha loja grátis
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Falar com suporte
                </Button>
              </div>

              <p className="mt-6 text-sm text-muted-foreground">
                ✓ Sem cartão de crédito • ✓ Setup em 5 minutos • ✓ Cancele quando quiser
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
