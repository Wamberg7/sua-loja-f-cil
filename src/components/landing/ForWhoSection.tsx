import { Video, Gamepad2, MessageSquare, Briefcase } from "lucide-react";

const personas = [
  {
    icon: Video,
    title: "Criadores de conteúdo",
    description: "Venda cursos, e-books, presets, templates e materiais exclusivos para sua audiência.",
    examples: ["Cursos online", "E-books", "Presets", "Templates"],
  },
  {
    icon: Gamepad2,
    title: "Gamers e Streamers",
    description: "Comercialize keys, contas, serviços e itens digitais para sua comunidade.",
    examples: ["Game keys", "Contas", "Boosting", "Items"],
  },
  {
    icon: MessageSquare,
    title: "Donos de comunidades",
    description: "Monetize seu servidor Discord com VIPs, acessos exclusivos e benefícios.",
    examples: ["VIP Discord", "Acessos", "Roles", "Benefícios"],
  },
  {
    icon: Briefcase,
    title: "Empreendedores digitais",
    description: "Lance seu negócio digital com infraestrutura pronta e profissional.",
    examples: ["SaaS", "Licenças", "Assinaturas", "Downloads"],
  },
];

const ForWhoSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-discord/10 text-discord text-sm font-medium mb-4">
            Para todos os tipos de vendedores
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Para quem é a plataforma?
          </h2>
          <p className="text-muted-foreground text-lg">
            Independente do seu nicho, você pode vender aqui
          </p>
        </div>

        {/* Personas grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {personas.map((persona) => (
            <div
              key={persona.title}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <persona.icon className="w-7 h-7 text-primary" />
              </div>
              
              <h3 className="font-display text-lg font-semibold mb-2">
                {persona.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {persona.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {persona.examples.map((example) => (
                  <span
                    key={example}
                    className="px-2 py-1 rounded-md bg-secondary text-xs text-muted-foreground"
                  >
                    {example}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ForWhoSection;
