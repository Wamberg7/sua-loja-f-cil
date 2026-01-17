import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Maria Silva",
    role: "Criadora de Cursos",
    avatar: "MS",
    content: "Migrei minha operação para a DigitalHub e triplicei minhas vendas em 3 meses. A entrega automática é game-changer!",
    rating: 5
  },
  {
    name: "João Santos",
    role: "Designer de Templates",
    avatar: "JS",
    content: "A interface é incrivelmente intuitiva. Configurei minha loja em menos de 10 minutos e já estava vendendo.",
    rating: 5
  },
  {
    name: "Ana Costa",
    role: "Produtora de E-books",
    avatar: "AC",
    content: "O suporte é excepcional! Sempre que preciso de ajuda, a equipe responde rapidamente e resolve tudo.",
    rating: 5
  },
  {
    name: "Pedro Lima",
    role: "Desenvolvedor de Software",
    avatar: "PL",
    content: "As taxas são as mais justas do mercado. Com o plano Pro, minha margem de lucro aumentou significativamente.",
    rating: 5
  },
  {
    name: "Carla Mendes",
    role: "Coach Digital",
    avatar: "CM",
    content: "O dashboard me dá todas as métricas que preciso. Consigo tomar decisões baseadas em dados reais.",
    rating: 5
  },
  {
    name: "Lucas Ferreira",
    role: "Fotógrafo",
    avatar: "LF",
    content: "Vendo presets e ações para Lightroom. A plataforma gerencia tudo: pagamento, entrega e até os cupons!",
    rating: 5
  }
];

const TestimonialsSection = () => {
  return (
    <section id="depoimentos" className="py-24 bg-card relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-success/10 text-success text-sm font-medium mb-4">
            +15.000 lojistas satisfeitos
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            O que nossos <span className="text-gradient">clientes dizem</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Histórias reais de empreendedores que transformaram seus negócios digitais.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl bg-background border border-border hover:border-primary/30 transition-all duration-300">
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-primary/30 mb-4" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
