import { Link } from "react-router-dom";
import { ArrowLeft, Zap } from "lucide-react";

const PrivacyPolicy = () => {
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
        <h1 className="text-4xl font-bold text-foreground mb-8">Política de Privacidade</h1>
        <p className="text-muted-foreground mb-8">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introdução</h2>
            <p className="text-muted-foreground leading-relaxed">
              A DigitalHub está comprometida em proteger sua privacidade. Esta Política de Privacidade 
              explica como coletamos, usamos, armazenamos e protegemos suas informações pessoais em 
              conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Dados que Coletamos</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Coletamos os seguintes tipos de dados:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Dados de identificação:</strong> nome, e-mail, CPF/CNPJ, telefone</li>
              <li><strong>Dados de pagamento:</strong> informações bancárias para recebimento de vendas</li>
              <li><strong>Dados de uso:</strong> páginas visitadas, cliques, tempo de sessão</li>
              <li><strong>Dados de dispositivo:</strong> IP, navegador, sistema operacional</li>
              <li><strong>Dados de transação:</strong> histórico de vendas, produtos, valores</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Finalidade do Tratamento</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Utilizamos seus dados para:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Fornecer e melhorar nossos serviços</li>
              <li>Processar pagamentos e transações</li>
              <li>Enviar comunicações sobre sua conta e transações</li>
              <li>Prevenir fraudes e garantir a segurança da plataforma</li>
              <li>Cumprir obrigações legais e regulatórias</li>
              <li>Personalizar sua experiência na plataforma</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Base Legal</h2>
            <p className="text-muted-foreground leading-relaxed">
              O tratamento de dados pessoais é realizado com base nas seguintes hipóteses legais da LGPD: 
              execução de contrato, cumprimento de obrigação legal, legítimo interesse do controlador, 
              e mediante consentimento quando aplicável.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Compartilhamento de Dados</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Podemos compartilhar seus dados com:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Processadores de pagamento:</strong> para realizar transações financeiras</li>
              <li><strong>Prestadores de serviço:</strong> que auxiliam na operação da plataforma</li>
              <li><strong>Autoridades:</strong> quando exigido por lei ou ordem judicial</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Não vendemos seus dados pessoais a terceiros.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Seus Direitos (LGPD)</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Conforme a LGPD, você tem direito a:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Confirmar a existência de tratamento de seus dados</li>
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
              <li>Solicitar anonimização, bloqueio ou eliminação de dados desnecessários</li>
              <li>Solicitar a portabilidade dos dados</li>
              <li>Revogar o consentimento a qualquer momento</li>
              <li>Solicitar informações sobre o compartilhamento de dados</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Segurança dos Dados</h2>
            <p className="text-muted-foreground leading-relaxed">
              Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados, 
              incluindo criptografia, controle de acesso, firewalls e monitoramento contínuo. 
              Entretanto, nenhum sistema é 100% seguro, e não podemos garantir segurança absoluta.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Retenção de Dados</h2>
            <p className="text-muted-foreground leading-relaxed">
              Mantemos seus dados pelo tempo necessário para cumprir as finalidades descritas nesta 
              política ou conforme exigido por lei. Dados de transações financeiras são mantidos 
              por no mínimo 5 anos conforme legislação fiscal.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar 
              o uso da plataforma e personalizar conteúdo. Você pode gerenciar suas preferências 
              de cookies através das configurações do seu navegador.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Alterações nesta Política</h2>
            <p className="text-muted-foreground leading-relaxed">
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você 
              sobre alterações significativas por e-mail ou através de aviso na plataforma. 
              Recomendamos revisar esta página regularmente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contato do Encarregado (DPO)</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para exercer seus direitos ou esclarecer dúvidas sobre o tratamento de dados, 
              entre em contato com nosso Encarregado de Proteção de Dados:
            </p>
            <p className="text-muted-foreground mt-4">
              E-mail: <a href="mailto:privacidade@digitalhub.com" className="text-primary hover:underline">privacidade@digitalhub.com</a>
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

export default PrivacyPolicy;
