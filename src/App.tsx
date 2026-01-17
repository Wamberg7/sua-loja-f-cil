import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";
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
import Disputes from "./pages/Disputes";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
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
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/termos" element={<TermsOfService />} />
            <Route path="/privacidade" element={<PrivacyPolicy />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Register />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Protected Seller Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/produtos" element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/categorias" element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/cupons" element={
              <ProtectedRoute>
                <Coupons />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/pedidos" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/carteira" element={
              <ProtectedRoute>
                <WalletPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/metas" element={
              <ProtectedRoute>
                <Goals />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/planos" element={
              <ProtectedRoute>
                <Plans />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/clientes" element={
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/configuracoes" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/contestacoes" element={
              <ProtectedRoute>
                <Disputes />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes - Protected by role */}
            <Route path="/admin" element={
              <AdminRoute allowedRoles={["superadmin", "admin"]}>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/lojas" element={
              <AdminRoute allowedRoles={["superadmin", "admin"]}>
                <AdminStores />
              </AdminRoute>
            } />
            <Route path="/admin/usuarios" element={
              <AdminRoute allowedRoles={["superadmin", "admin"]}>
                <AdminUsers />
              </AdminRoute>
            } />
            <Route path="/admin/vendas" element={
              <AdminRoute allowedRoles={["superadmin", "admin"]}>
                <AdminSales />
              </AdminRoute>
            } />
            <Route path="/admin/financeiro" element={
              <AdminRoute allowedRoles={["superadmin", "admin"]}>
                <AdminFinancial />
              </AdminRoute>
            } />
            <Route path="/admin/planos" element={
              <AdminRoute allowedRoles={["superadmin", "admin"]}>
                <AdminPlans />
              </AdminRoute>
            } />
            <Route path="/admin/metas" element={
              <AdminRoute allowedRoles={["superadmin", "admin"]}>
                <AdminGoals />
              </AdminRoute>
            } />
            <Route path="/admin/logs" element={
              <AdminRoute allowedRoles={["superadmin", "admin"]}>
                <AdminLogs />
              </AdminRoute>
            } />
            <Route path="/admin/aprovacao-carteira" element={
              <AdminRoute allowedRoles={["superadmin", "admin"]}>
                <AdminWalletApproval />
              </AdminRoute>
            } />
            <Route path="/admin/saques" element={
              <AdminRoute allowedRoles={["superadmin", "admin"]}>
                <AdminWithdrawals />
              </AdminRoute>
            } />
            <Route path="/admin/configuracoes" element={
              <AdminRoute allowedRoles={["superadmin"]}>
                <AdminSettings />
              </AdminRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
