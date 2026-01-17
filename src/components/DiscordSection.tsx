import { Button } from "@/components/ui/button";
import { MessageSquare, Bell, Package, Bot } from "lucide-react";

const DiscordSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-discord/10 via-transparent to-accent/10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-discord/20 border border-discord/30 mb-6">
              <MessageSquare className="w-4 h-4 text-discord" />
              <span className="text-sm text-discord">Integração Discord</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">
              Gerencie tudo pelo{" "}
              <span className="text-discord">Discord</span>
            </h2>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              Nosso bot completo permite que você gerencie pedidos, envie produtos 
              automaticamente e mantenha sua comunidade engajada sem sair do Discord.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-discord/20 flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5 text-discord" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Notificações em tempo real</h4>
                  <p className="text-sm text-muted-foreground">
                    Receba alertas de vendas, estoque baixo e mais
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Entrega automática</h4>
                  <p className="text-sm text-muted-foreground">
                    Produtos enviados automaticamente após pagamento
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Comandos personalizados</h4>
                  <p className="text-sm text-muted-foreground">
                    Crie comandos para check stock, cupons e mais
                  </p>
                </div>
              </div>
            </div>

            <Button variant="discord" size="lg">
              <MessageSquare className="w-4 h-4" />
              Adicionar bot ao servidor
            </Button>
          </div>

          {/* Discord mockup */}
          <div className="relative">
            <div className="gradient-border p-1 rounded-2xl">
              <div className="bg-[#36393f] rounded-xl overflow-hidden">
                {/* Discord header */}
                <div className="px-4 py-3 bg-[#2f3136] flex items-center gap-2">
                  <span className="text-muted-foreground">#</span>
                  <span className="font-medium">vendas</span>
                </div>

                {/* Messages */}
                <div className="p-4 space-y-4">
                  {/* Bot message */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-primary">StoreLab</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-discord text-white">BOT</span>
                        <span className="text-xs text-muted-foreground">Hoje às 14:32</span>
                      </div>
                      <div className="p-3 rounded-lg bg-[#2f3136] max-w-sm">
                        <div className="flex items-center gap-2 text-success mb-2">
                          <Package className="w-4 h-4" />
                          <span className="font-semibold">Nova venda!</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Premium VIP</strong> • R$ 49,90
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Produto entregue automaticamente ✅
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Another message */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-primary">StoreLab</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-discord text-white">BOT</span>
                        <span className="text-xs text-muted-foreground">Hoje às 14:35</span>
                      </div>
                      <div className="p-3 rounded-lg bg-[#2f3136] max-w-sm">
                        <p className="text-sm">
                          📊 <strong>Resumo do dia:</strong><br />
                          <span className="text-muted-foreground">
                            12 vendas • R$ 487,60 faturado
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-discord/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscordSection;
