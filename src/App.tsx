import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Coupons from "./pages/Coupons";
import Orders from "./pages/Orders";
import WalletPage from "./pages/WalletPage";
import Goals from "./pages/Goals";
import Plans from "./pages/Plans";
import Customers from "./pages/Customers";
import Settings from "./pages/Settings";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStores from "./pages/admin/AdminStores";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSales from "./pages/admin/AdminSales";
import AdminFinancial from "./pages/admin/AdminFinancial";
import AdminPlans from "./pages/admin/AdminPlans";
import AdminGoals from "./pages/admin/AdminGoals";
import AdminLogs from "./pages/admin/AdminLogs";
import AdminWalletApproval from "./pages/admin/AdminWalletApproval";
import AdminWithdrawals from "./pages/admin/AdminWithdrawals";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/termos" element={<TermsOfService />} />
          <Route path="/privacidade" element={<PrivacyPolicy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/produtos" element={<Products />} />
          <Route path="/dashboard/categorias" element={<Categories />} />
          <Route path="/dashboard/cupons" element={<Coupons />} />
          <Route path="/dashboard/pedidos" element={<Orders />} />
          <Route path="/dashboard/carteira" element={<WalletPage />} />
          <Route path="/dashboard/metas" element={<Goals />} />
          <Route path="/dashboard/planos" element={<Plans />} />
          <Route path="/dashboard/clientes" element={<Customers />} />
          <Route path="/dashboard/configuracoes" element={<Settings />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/lojas" element={<AdminStores />} />
          <Route path="/admin/usuarios" element={<AdminUsers />} />
          <Route path="/admin/vendas" element={<AdminSales />} />
          <Route path="/admin/financeiro" element={<AdminFinancial />} />
          <Route path="/admin/planos" element={<AdminPlans />} />
          <Route path="/admin/metas" element={<AdminGoals />} />
          <Route path="/admin/logs" element={<AdminLogs />} />
          <Route path="/admin/aprovacao-carteira" element={<AdminWalletApproval />} />
          <Route path="/admin/saques" element={<AdminWithdrawals />} />
          
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
