import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Check } from "lucide-react";

const products = [
  {
    name: "Premium VIP",
    price: "R$ 49,90",
    tag: "Popular",
    features: ["Acesso vitalício", "Suporte prioritário", "Benefícios exclusivos"],
  },
  {
    name: "Key Especial",
    price: "R$ 19,90",
    tag: null,
    features: ["Entrega instantânea", "Garantia 24h", "Ativação simples"],
  },
  {
    name: "Pack Ultimate",
    price: "R$ 99,90",
    tag: "Novo",
    features: ["Todos os benefícios", "Bônus exclusivo", "Acesso antecipado"],
  },
];

const StorePreview = () => {
  return (
    <section id="templates" className="py-24 relative">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-20"
          style={{
            background: 'radial-gradient(circle, hsl(280 100% 70% / 0.3) 0%, transparent 70%)'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Sua loja vai ficar{" "}
            <span className="gradient-text">assim</span>
          </h2>
          <p className="text-muted-foreground">
            Preview de como sua loja aparecerá para seus clientes
          </p>
        </div>

        {/* Store preview mockup */}
        <div className="max-w-4xl mx-auto">
          <div className="gradient-border p-1 rounded-2xl glow-effect">
            <div className="bg-card rounded-xl overflow-hidden">
              {/* Store header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="font-display text-2xl font-bold">S</span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold">Sua Loja</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span>4.9 (1.2k avaliações)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products grid */}
              <div className="p-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <div
                      key={product.name}
                      className="p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/50 transition-colors group"
                    >
                      {product.tag && (
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary mb-3">
                          {product.tag}
                        </span>
                      )}
                      <h4 className="font-display font-semibold mb-2">{product.name}</h4>
                      <ul className="space-y-1 mb-4">
                        {product.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Check className="w-3 h-3 text-success" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center justify-between">
                        <span className="font-display text-lg font-bold">{product.price}</span>
                        <Button size="sm" variant="glow" className="gap-1">
                          <ShoppingCart className="w-3 h-3" />
                          Comprar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorePreview;
