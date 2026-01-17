import { Link } from "react-router-dom";
import { ArrowLeft, Zap } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">DigitalHub</span>
          </Link>
          <Link 
            to="/" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Termos de Uso</h1>
        <p className="text-muted-foreground mb-8">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Aceitação dos Termos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ao acessar e usar a plataforma DigitalHub, você concorda em cumprir e estar vinculado a estes Termos de Uso. 
              Se você não concordar com qualquer parte destes termos, não poderá acessar ou usar nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Descrição do Serviço</h2>
            <p className="text-muted-foreground leading-relaxed">
              A DigitalHub é uma plataforma de e-commerce especializada na venda de produtos digitais. 
              Oferecemos ferramentas para criação de lojas virtuais, processamento de pagamentos, 
              gestão de produtos e análise de vendas.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Cadastro e Conta</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Para utilizar nossos serviços, você deve:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Ter pelo menos 18 anos de idade ou a maioridade legal em sua jurisdição</li>
              <li>Fornecer informações verdadeiras, precisas e completas durante o cadastro</li>
              <li>Manter suas credenciais de acesso em sigilo</li>
              <li>Ser responsável por todas as atividades realizadas em sua conta</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Uso Aceitável</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Você concorda em não usar a plataforma para:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Vender produtos ilegais, fraudulentos ou que violem direitos de terceiros</li>
              <li>Distribuir malware, vírus ou código malicioso</li>
              <li>Praticar spam, phishing ou qualquer forma de fraude</li>
              <li>Violar leis ou regulamentos aplicáveis</li>
              <li>Infringir direitos de propriedade intelectual</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Pagamentos e Taxas</h2>
            <p className="text-muted-foreground leading-relaxed">
              A DigitalHub cobra taxas sobre as vendas realizadas através da plataforma. 
              As taxas aplicáveis estão descritas na página de preços e podem ser alteradas 
              com aviso prévio de 30 dias. Os pagamentos são processados através de parceiros 
              de pagamento seguros e certificados.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Propriedade Intelectual</h2>
            <p className="text-muted-foreground leading-relaxed">
              Todo o conteúdo da plataforma DigitalHub, incluindo logotipos, textos, gráficos e software, 
              é de propriedade exclusiva da DigitalHub ou de seus licenciadores. Você mantém todos os 
              direitos sobre os produtos que vende através da plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Limitação de Responsabilidade</h2>
            <p className="text-muted-foreground leading-relaxed">
              A DigitalHub não será responsável por danos indiretos, incidentais, especiais ou consequenciais 
              decorrentes do uso ou impossibilidade de uso da plataforma. Nossa responsabilidade total está 
              limitada ao valor pago por você nos últimos 12 meses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Rescisão</h2>
            <p className="text-muted-foreground leading-relaxed">
              Podemos suspender ou encerrar sua conta a qualquer momento por violação destes termos. 
              Você pode encerrar sua conta a qualquer momento através das configurações da plataforma. 
              Após o encerramento, você não terá mais acesso aos dados da sua conta.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Alterações nos Termos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. 
              Notificaremos você sobre alterações significativas por e-mail ou através da plataforma. 
              O uso continuado após as alterações constitui aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contato</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para dúvidas sobre estes Termos de Uso, entre em contato conosco através do e-mail: 
              <a href="mailto:suporte@digitalhub.com" className="text-primary hover:underline ml-1">
                suporte@digitalhub.com
              </a>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} DigitalHub. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default TermsOfService;
