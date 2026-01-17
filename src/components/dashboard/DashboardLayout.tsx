import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Ticket,
  ShoppingCart,
  Wallet,
  Trophy,
  CreditCard,
  Users,
  Settings,
  Zap,
  Menu,
  X,
  Bell,
  ChevronDown,
  AlertTriangle,
  Target
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const menuGroups = [
  {
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
      { icon: FolderTree, label: "Categorias", href: "/dashboard/categorias" },
      { icon: Package, label: "Produtos", href: "/dashboard/produtos" },
      { icon: Ticket, label: "Cupons", href: "/dashboard/cupons" },
    ]
  },
  {
    label: "FINANCEIRO",
    items: [
      { icon: Wallet, label: "Carteira", href: "/dashboard/carteira" },
      { icon: Users, label: "Clientes", href: "/dashboard/clientes" },
      { icon: ShoppingCart, label: "Pedidos", href: "/dashboard/pedidos" },
      { icon: AlertTriangle, label: "Med/Contestações", href: "/dashboard/contestacoes" },
    ]
  },
  {
    label: "CONFIGURAÇÕES",
    items: [
      { icon: Trophy, label: "Metas & Premiações", href: "/dashboard/metas" },
      { icon: Target, label: "Missões", href: "/dashboard/missoes" },
      { icon: CreditCard, label: "Planos", href: "/dashboard/planos" },
      { icon: Settings, label: "Configurações", href: "/dashboard/configuracoes" },
    ]
  },
];

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { profile, store } = useAuth();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(href);
  };

  const userInitials = profile?.full_name 
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : profile?.email?.slice(0, 2).toUpperCase() || 'US';

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-sidebar-foreground">DigitalHub</span>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-sidebar-foreground/60 hover:text-sidebar-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex} className={groupIndex > 0 ? "mt-6" : ""}>
                {group.label && (
                  <div className="px-4 mb-2">
                    <span className="text-xs font-semibold text-sidebar-foreground/40 tracking-wider">
                      {group.label}
                    </span>
                  </div>
                )}
                <ul className="space-y-1 px-2">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          isActive(item.href)
                            ? 'bg-primary text-primary-foreground'
                            : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="bg-sidebar-accent rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-accent-foreground font-bold">
                  {userInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sidebar-foreground text-sm truncate">
                    {profile?.full_name || profile?.email || 'Usuário'}
                  </p>
                  <p className="text-xs text-sidebar-foreground/60">Plano Starter</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-sidebar-foreground/60">Produtos</span>
                <span className="text-sidebar-foreground font-medium">
                  {store ? '–' : '0'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
          <div className="h-full px-4 flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search - Desktop */}
            <div className="hidden md:flex items-center flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full h-10 px-4 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-muted-foreground hover:text-foreground">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
              </button>

              {/* User Menu */}
              <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  {userInitials}
                </div>
                <span className="hidden sm:block text-sm font-medium text-foreground">
                  {profile?.full_name?.split(' ')[0] || 'Usuário'}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
