import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Globe, CreditCard, Shield, Bell, Users } from "lucide-react";

const AdminSettings = () => {
  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Configurações da Plataforma"
        subtitle="Gerencie as configurações globais"
      />

      <div className="p-6">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="general" className="gap-2">
              <Settings className="w-4 h-4" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="domain" className="gap-2">
              <Globe className="w-4 h-4" />
              Domínio
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2">
              <CreditCard className="w-4 h-4" />
              Pagamentos
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="w-4 h-4" />
              Segurança
            </TabsTrigger>
            <TabsTrigger value="minors" className="gap-2">
              <Users className="w-4 h-4" />
              Menores
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="font-display font-semibold text-lg mb-6">Informações da Plataforma</h3>
              <div className="grid gap-6 max-w-2xl">
                <div className="grid gap-2">
                  <Label>Nome da Plataforma</Label>
                  <Input defaultValue="StoreLab" className="bg-secondary/50" />
                </div>
                <div className="grid gap-2">
                  <Label>Descrição</Label>
                  <Textarea
                    defaultValue="Plataforma SaaS para criação de lojas digitais"
                    className="bg-secondary/50"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Email de Suporte</Label>
                  <Input defaultValue="suporte@storelab.com" className="bg-secondary/50" />
                </div>
                <Button variant="hero" className="w-fit">
                  Salvar Alterações
                </Button>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="font-display font-semibold text-lg mb-6">Limites da Plataforma</h3>
              <div className="grid gap-6 max-w-2xl">
                <div className="grid gap-2">
                  <Label>Máximo de lojas por usuário</Label>
                  <Input type="number" defaultValue="5" className="bg-secondary/50" />
                </div>
                <div className="grid gap-2">
                  <Label>Máximo de produtos por loja</Label>
                  <Input type="number" defaultValue="100" className="bg-secondary/50" />
                </div>
                <div className="grid gap-2">
                  <Label>Tamanho máximo de arquivo (MB)</Label>
                  <Input type="number" defaultValue="50" className="bg-secondary/50" />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Domain Settings */}
          <TabsContent value="domain" className="space-y-6">
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="font-display font-semibold text-lg mb-6">Configurações de Domínio</h3>
              <div className="grid gap-6 max-w-2xl">
                <div className="grid gap-2">
                  <Label>Domínio Principal</Label>
                  <Input defaultValue="storelab.com" className="bg-secondary/50" />
                </div>
                <div className="grid gap-2">
                  <Label>Subdomínio das Lojas</Label>
                  <Input defaultValue=".loja.storelab.com" className="bg-secondary/50" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div>
                    <Label>Permitir domínios personalizados</Label>
                    <p className="text-sm text-muted-foreground">
                      Usuários podem conectar seus próprios domínios
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Payments Settings */}
          <TabsContent value="payments" className="space-y-6">
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="font-display font-semibold text-lg mb-6">Gateway de Pagamento</h3>
              <div className="grid gap-6 max-w-2xl">
                <div className="grid gap-2">
                  <Label>Gateway Ativo</Label>
                  <Select defaultValue="mercadopago">
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mercadopago">Mercado Pago</SelectItem>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="pagarme">Pagar.me</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Taxa da Plataforma (%)</Label>
                  <Input type="number" defaultValue="5" className="bg-secondary/50" />
                </div>
                <div className="grid gap-2">
                  <Label>Taxa por Transação (R$)</Label>
                  <Input type="number" defaultValue="0.50" step="0.01" className="bg-secondary/50" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div>
                    <Label>Saque automático</Label>
                    <p className="text-sm text-muted-foreground">
                      Liberar saque após 14 dias automaticamente
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="font-display font-semibold text-lg mb-6">Métodos de Pagamento</h3>
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div>
                    <Label>PIX</Label>
                    <p className="text-sm text-muted-foreground">Pagamento instantâneo</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div>
                    <Label>Cartão de Crédito</Label>
                    <p className="text-sm text-muted-foreground">Parcelado em até 12x</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div>
                    <Label>Boleto Bancário</Label>
                    <p className="text-sm text-muted-foreground">Vencimento em 3 dias</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="font-display font-semibold text-lg mb-6">Segurança Geral</h3>
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div>
                    <Label>Autenticação 2FA</Label>
                    <p className="text-sm text-muted-foreground">Exigir para administradores</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div>
                    <Label>Verificação de Email</Label>
                    <p className="text-sm text-muted-foreground">Exigir para todos os usuários</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div>
                    <Label>Proteção Anti-Fraude</Label>
                    <p className="text-sm text-muted-foreground">Bloquear transações suspeitas</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div>
                    <Label>Logs de Auditoria</Label>
                    <p className="text-sm text-muted-foreground">Registrar todas as ações admin</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Minors Settings */}
          <TabsContent value="minors" className="space-y-6">
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="font-display font-semibold text-lg mb-6">Configurações para Menores de Idade</h3>
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div>
                    <Label>Permitir cadastro de menores</Label>
                    <p className="text-sm text-muted-foreground">
                      Usuários abaixo de 18 anos podem criar conta
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div>
                    <Label>Exigir autorização dos pais</Label>
                    <p className="text-sm text-muted-foreground">
                      Termo de responsabilidade obrigatório
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="grid gap-2">
                  <Label>Idade mínima</Label>
                  <Input type="number" defaultValue="14" className="bg-secondary/50" />
                </div>
                <div className="grid gap-2">
                  <Label>Limite de faturamento mensal (menores)</Label>
                  <Input defaultValue="R$ 5.000,00" className="bg-secondary/50" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div>
                    <Label>Marcar perfis de menores</Label>
                    <p className="text-sm text-muted-foreground">
                      Exibir badge identificando menores no admin
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminSettings;
