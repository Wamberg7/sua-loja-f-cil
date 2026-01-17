import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-30"
          style={{
            background: 'radial-gradient(ellipse at center, hsl(235 86% 65% / 0.3) 0%, transparent 70%)'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm">Comece gratuitamente</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">
            Pronto para criar sua{" "}
            <span className="gradient-text">loja digital</span>?
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Junte-se a milhares de vendedores que já estão lucrando com nossa plataforma. 
            Sem taxas ocultas, sem complicação.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl">
              Criar loja grátis
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="xl">
              Falar com vendas
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            ✓ Grátis para começar • ✓ Sem cartão de crédito • ✓ Setup em 5 minutos
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
