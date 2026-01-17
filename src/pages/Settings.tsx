import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Settings as SettingsIcon,
  Store,
  User,
  Globe,
  Mail,
  Bell,
  Shield,
  Save,
  Eye,
  EyeOff,
  Plug,
  Key,
  RefreshCw,
  Copy,
  Check,
  Bot
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const Settings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  
  // Discord bot settings
  const [discordEnabled, setDiscordEnabled] = useState(false);
  const [discordData, setDiscordData] = useState({
    botToken: "",
    serverId: "",
    ownerId: "",
    botId: ""
  });
  const [showBotToken, setShowBotToken] = useState(false);
  
  // Store settings
  const [storeData, setStoreData] = useState({
    name: "Minha Loja Digital",
    slug: "minha-loja",
    category: "cursos",
    description: "Vendemos os melhores produtos digitais do mercado."
  });

  // User settings
  const [userData, setUserData] = useState({
    name: "João Silva",
    email: "joao@email.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // General settings
  const [generalData, setGeneralData] = useState({
    language: "pt-BR",
    currency: "BRL",
    timezone: "America/Sao_Paulo"
  });

  // Email settings
  const [emailData, setEmailData] = useState({
    senderName: "Minha Loja Digital",
    senderEmail: "contato@minhaloja.com",
    emailTemplate: "Olá {nome},\n\nObrigado pela sua compra!\n\nAcesse seu produto aqui: {link}\n\nAtenciosamente,\nMinha Loja Digital"
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    newSale: true,
    refund: true,
    lowStock: false,
    weeklyReport: true,
    marketingEmails: false
  });

  const handleSave = (section: string) => {
    toast.success(`Configurações de ${section} salvas com sucesso!`);
  };

  const generateApiKey = () => {
    const newKey = `dhk_${Array.from({ length: 32 }, () => 
      Math.random().toString(36).charAt(2)
    ).join('')}`;
    setApiKey(newKey);
    toast.success("Nova chave de API gerada com sucesso!");
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setApiKeyCopied(true);
    toast.success("Chave copiada para a área de transferência!");
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  const handleSaveDiscord = () => {
    if (discordEnabled && (!discordData.botToken || !discordData.serverId || !discordData.botId)) {
      toast.error("Preencha todos os campos obrigatórios do bot");
      return;
    }
    toast.success("Configurações do Discord salvas com sucesso!");
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as configurações da sua loja</p>
      </div>

      <Tabs defaultValue="store" className="w-full">
        <TabsList className="mb-8 flex-wrap h-auto gap-2">
          <TabsTrigger value="store" className="gap-2">
            <Store className="w-4 h-4" />
            Loja
          </TabsTrigger>
          <TabsTrigger value="user" className="gap-2">
            <User className="w-4 h-4" />
            Conta
          </TabsTrigger>
          <TabsTrigger value="general" className="gap-2">
            <Globe className="w-4 h-4" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="w-4 h-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Plug className="w-4 h-4" />
            Integrações
          </TabsTrigger>
        </TabsList>

        {/* Store Settings */}
        <TabsContent value="store">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" />
              Dados da Loja
            </h2>

            <div className="space-y-6 max-w-xl">
              <div>
                <Label htmlFor="storeName">Nome da Loja</Label>
                <Input
                  id="storeName"
                  value={storeData.name}
                  onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="storeSlug">URL da Loja</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">digitalhub.com/</span>
                  <Input
                    id="storeSlug"
                    value={storeData.slug}
                    onChange={(e) => setStoreData({ ...storeData, slug: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="storeCategory">Categoria Principal</Label>
                <Select 
                  value={storeData.category} 
                  onValueChange={(value) => setStoreData({ ...storeData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cursos">Cursos Online</SelectItem>
                    <SelectItem value="ebooks">E-books</SelectItem>
                    <SelectItem value="templates">Templates</SelectItem>
                    <SelectItem value="software">Software</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="storeDescription">Descrição</Label>
                <Textarea
                  id="storeDescription"
                  value={storeData.description}
                  onChange={(e) => setStoreData({ ...storeData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <Button onClick={() => handleSave("loja")} className="gap-2">
                <Save className="w-4 h-4" />
                Salvar Alterações
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        {/* User Settings */}
        <TabsContent value="user">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Dados da Conta
            </h2>

            <div className="space-y-6 max-w-xl">
              <div>
                <Label htmlFor="userName">Nome Completo</Label>
                <Input
                  id="userName"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="userEmail">Email</Label>
                <Input
                  id="userEmail"
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                />
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Alterar Senha
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Senha Atual</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        value={userData.currentPassword}
                        onChange={(e) => setUserData({ ...userData, currentPassword: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={userData.newPassword}
                      onChange={(e) => setUserData({ ...userData, newPassword: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={userData.confirmPassword}
                      onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={() => handleSave("conta")} className="gap-2">
                <Save className="w-4 h-4" />
                Salvar Alterações
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        {/* General Settings */}
        <TabsContent value="general">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Configurações Gerais
            </h2>

            <div className="space-y-6 max-w-xl">
              <div>
                <Label htmlFor="language">Idioma</Label>
                <Select 
                  value={generalData.language} 
                  onValueChange={(value) => setGeneralData({ ...generalData, language: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="currency">Moeda</Label>
                <Select 
                  value={generalData.currency} 
                  onValueChange={(value) => setGeneralData({ ...generalData, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRL">Real (R$)</SelectItem>
                    <SelectItem value="USD">Dólar ($)</SelectItem>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timezone">Fuso Horário</Label>
                <Select 
                  value={generalData.timezone} 
                  onValueChange={(value) => setGeneralData({ ...generalData, timezone: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                    <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                    <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={() => handleSave("geral")} className="gap-2">
                <Save className="w-4 h-4" />
                Salvar Alterações
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Configurações de Email
            </h2>

            <div className="space-y-6 max-w-xl">
              <div>
                <Label htmlFor="senderName">Nome do Remetente</Label>
                <Input
                  id="senderName"
                  value={emailData.senderName}
                  onChange={(e) => setEmailData({ ...emailData, senderName: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="senderEmail">Email do Remetente</Label>
                <Input
                  id="senderEmail"
                  type="email"
                  value={emailData.senderEmail}
                  onChange={(e) => setEmailData({ ...emailData, senderEmail: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="emailTemplate">Template de Email de Entrega</Label>
                <Textarea
                  id="emailTemplate"
                  value={emailData.emailTemplate}
                  onChange={(e) => setEmailData({ ...emailData, emailTemplate: e.target.value })}
                  rows={8}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Variáveis disponíveis: {"{nome}"}, {"{email}"}, {"{produto}"}, {"{link}"}
                </p>
              </div>

              <Button onClick={() => handleSave("email")} className="gap-2">
                <Save className="w-4 h-4" />
                Salvar Alterações
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Preferências de Notificação
            </h2>

            <div className="space-y-6 max-w-xl">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium text-foreground">Nova Venda</p>
                  <p className="text-sm text-muted-foreground">Receba notificações a cada nova venda</p>
                </div>
                <Switch
                  checked={notifications.newSale}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, newSale: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium text-foreground">Reembolsos</p>
                  <p className="text-sm text-muted-foreground">Seja notificado sobre pedidos de reembolso</p>
                </div>
                <Switch
                  checked={notifications.refund}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, refund: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium text-foreground">Estoque Baixo</p>
                  <p className="text-sm text-muted-foreground">Alerta quando um produto estiver com estoque baixo</p>
                </div>
                <Switch
                  checked={notifications.lowStock}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, lowStock: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium text-foreground">Relatório Semanal</p>
                  <p className="text-sm text-muted-foreground">Receba um resumo semanal das suas vendas</p>
                </div>
                <Switch
                  checked={notifications.weeklyReport}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReport: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-foreground">Emails de Marketing</p>
                  <p className="text-sm text-muted-foreground">Novidades, dicas e promoções da plataforma</p>
                </div>
                <Switch
                  checked={notifications.marketingEmails}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, marketingEmails: checked })}
                />
              </div>

              <Button onClick={() => handleSave("notificações")} className="gap-2">
                <Save className="w-4 h-4" />
                Salvar Preferências
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* API Key Card */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" />
                Chave de API
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Use sua chave de API para integrar sua loja com outros sistemas e automações.
              </p>

              <div className="space-y-4 max-w-xl">
                {apiKey ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="apiKey">Sua Chave de API</Label>
                      <div className="flex gap-2 mt-1">
                        <div className="relative flex-1">
                          <Input
                            id="apiKey"
                            type={showApiKey ? "text" : "password"}
                            value={apiKey}
                            readOnly
                            className="pr-10 font-mono text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <Button variant="outline" size="icon" onClick={copyApiKey}>
                          {apiKeyCopied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={generateApiKey} className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Gerar Nova Chave
                      </Button>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                      <p className="text-sm text-warning">
                        <strong>Atenção:</strong> Ao gerar uma nova chave, a chave anterior será invalidada imediatamente.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Key className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-medium text-foreground mb-2">Nenhuma chave gerada</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Gere uma chave de API para começar a integrar sua loja.
                    </p>
                    <Button onClick={generateApiKey} className="gap-2">
                      <Key className="w-4 h-4" />
                      Gerar Chave de API
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Discord Bot Card */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Bot className="w-5 h-5 text-[#5865F2]" />
                  Bot do Discord
                </h2>
                <Switch
                  checked={discordEnabled}
                  onCheckedChange={setDiscordEnabled}
                />
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Configure um bot do Discord para receber notificações e gerenciar sua loja via Discord.
              </p>

              {discordEnabled ? (
                <div className="space-y-6 max-w-xl">
                  <div>
                    <Label htmlFor="botToken">Token do Bot *</Label>
                    <div className="relative mt-1">
                      <Input
                        id="botToken"
                        type={showBotToken ? "text" : "password"}
                        value={discordData.botToken}
                        onChange={(e) => setDiscordData({ ...discordData, botToken: e.target.value })}
                        placeholder="MTIzNDU2Nzg5MDEyMzQ1Njc4OQ..."
                        className="pr-10 font-mono text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowBotToken(!showBotToken)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showBotToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Encontre no Discord Developer Portal → Bot → Token
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="serverId">ID do Servidor *</Label>
                    <Input
                      id="serverId"
                      value={discordData.serverId}
                      onChange={(e) => setDiscordData({ ...discordData, serverId: e.target.value })}
                      placeholder="123456789012345678"
                      className="font-mono text-sm mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Clique com botão direito no servidor → Copiar ID do Servidor
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="ownerId">ID do Dono do Bot</Label>
                    <Input
                      id="ownerId"
                      value={discordData.ownerId}
                      onChange={(e) => setDiscordData({ ...discordData, ownerId: e.target.value })}
                      placeholder="123456789012345678"
                      className="font-mono text-sm mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Seu ID de usuário do Discord (opcional)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="botId">ID do Bot *</Label>
                    <Input
                      id="botId"
                      value={discordData.botId}
                      onChange={(e) => setDiscordData({ ...discordData, botId: e.target.value })}
                      placeholder="123456789012345678"
                      className="font-mono text-sm mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Discord Developer Portal → Application → General Information → Application ID
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-[#5865F2]/10 border border-[#5865F2]/20">
                    <p className="text-sm text-[#5865F2]">
                      <strong>Dica:</strong> Ative o "Developer Mode" nas configurações do Discord para copiar IDs facilmente.
                    </p>
                  </div>

                  <Button onClick={handleSaveDiscord} className="gap-2">
                    <Save className="w-4 h-4" />
                    Salvar Configurações
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-[#5865F2]/10 flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-8 h-8 text-[#5865F2]" />
                  </div>
                  <h3 className="font-medium text-foreground mb-2">Bot desativado</h3>
                  <p className="text-sm text-muted-foreground">
                    Ative o bot para configurar a integração com Discord e receber notificações de vendas em tempo real.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Settings;
