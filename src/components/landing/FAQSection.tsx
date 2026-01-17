import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Preciso ter um site próprio?",
    answer: "Não! A plataforma oferece uma loja online completa e profissional para você. Basta criar sua conta, personalizar sua loja e começar a vender. Você recebe um link exclusivo para compartilhar com seus clientes.",
  },
  {
    question: "É difícil configurar a loja?",
    answer: "De jeito nenhum! O processo é super simples e intuitivo. Em menos de 5 minutos você configura sua loja, adiciona produtos e já pode começar a vender. Não precisa de conhecimento técnico.",
  },
  {
    question: "Como funciona a entrega automática?",
    answer: "Após o cliente realizar o pagamento e ele ser confirmado, o produto é enviado automaticamente por email e/ou Discord. Você cadastra o conteúdo uma vez e o sistema cuida do resto. Funciona 24 horas por dia, 7 dias por semana.",
  },
  {
    question: "Tem taxas ou mensalidade?",
    answer: "Você pode começar gratuitamente! Cobramos apenas uma pequena taxa por venda realizada, sem mensalidades ou custos fixos. Você só paga quando vende. Temos planos premium com taxas menores para quem vende mais.",
  },
  {
    question: "Posso vender sendo menor de idade?",
    answer: "Sim! Nossa plataforma permite que menores de idade vendam produtos digitais. Basta ter autorização dos responsáveis e seguir nossos termos de uso. É uma ótima forma de começar a empreender cedo.",
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer: "Aceitamos PIX (aprovação instantânea), cartão de crédito (parcelado em até 12x) e boleto bancário. Seus clientes têm flexibilidade para pagar como preferirem.",
  },
  {
    question: "Como recebo meu dinheiro?",
    answer: "O saldo fica disponível na sua conta após o período de segurança (geralmente 14 dias para cartão e instantâneo para PIX). Você pode sacar para qualquer conta bancária ou PIX.",
  },
  {
    question: "A plataforma é segura?",
    answer: "Sim! Utilizamos criptografia de ponta a ponta, proteção contra fraudes e seguimos todas as normas de segurança do mercado. Seus dados e os dos seus clientes estão sempre protegidos.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Tire suas dúvidas
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Perguntas frequentes
          </h2>
          <p className="text-muted-foreground text-lg">
            Tudo que você precisa saber para começar
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-xl px-6 bg-card data-[state=open]:border-primary/30 transition-colors"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
