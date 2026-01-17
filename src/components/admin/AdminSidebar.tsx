import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  CreditCard,
  FileText,
  Settings,
  Shield,
  Bell,
  MessageSquare,
  Activity,
  Webhook,
  Crown,
} from "lucide-react";

const mainMenuItems = [
  { title: "Visão Geral", url: "/admin", icon: LayoutDashboard },
  { title: "Usuários", url: "/admin/users", icon: Users },
  { title: "Lojas", url: "/admin/stores", icon: Store },
  { title: "Produtos", url: "/admin/products", icon: Package },
  { title: "Pedidos", url: "/admin/orders", icon: FileText },
];

const systemMenuItems = [
  { title: "Pagamentos", url: "/admin/payments", icon: CreditCard },
  { title: "Integrações", url: "/admin/integrations", icon: Webhook },
  { title: "Logs & Auditoria", url: "/admin/logs", icon: Activity },
  { title: "Tickets", url: "/admin/tickets", icon: MessageSquare },
];

const settingsMenuItems = [
  { title: "Configurações", url: "/admin/settings", icon: Settings },
  { title: "Segurança", url: "/admin/security", icon: Shield },
  { title: "Notificações", url: "/admin/notifications", icon: Bell },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-card/50">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shrink-0">
            <Crown className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <span className="font-display font-bold text-lg">SuperAdmin</span>
              <p className="text-[10px] text-muted-foreground">Painel de Controle</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent>
        {/* Main Menu */}
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Principal</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <NavLink to={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System Menu */}
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Sistema</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {systemMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <NavLink to={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Menu */}
        <SidebarGroup className="mt-auto">
          {!collapsed && <SidebarGroupLabel>Configurações</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <NavLink to={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
