import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Lucas Mendes",
    role: "Criador de conteúdo",
    avatar: "LM",
    content: "Em 1 semana já tinha vendido mais de R$ 2.000 em cursos. A entrega automática é incrível!",
    rating: 5,
  },
  {
    name: "Ana Carolina",
    role: "Designer",
    avatar: "AC",
    content: "Finalmente uma plataforma fácil de usar. Vendo meus templates e presets sem complicação.",
    rating: 5,
  },
  {
    name: "Pedro Gamer",
    role: "Streamer",
    avatar: "PG",
    content: "A integração com Discord mudou tudo! Minha comunidade ama a experiência de compra.",
    rating: 5,
  },
];

const stats = [
  { value: "5.000+", label: "Vendedores ativos" },
  { value: "R$ 2M+", label: "Em vendas processadas" },
  { value: "50.000+", label: "Produtos entregues" },
  { value: "99.9%", label: "De uptime" },
];

const SocialProofSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-6 rounded-2xl bg-card border border-border">
              <p className="font-display text-3xl sm:text-4xl font-bold gradient-text mb-2">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-yellow-500/10 text-yellow-500 text-sm font-medium mb-4">
            Depoimentos reais
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            O que dizem nossos vendedores
          </h2>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="p-6 rounded-2xl bg-card border border-border relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10" />
              
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
