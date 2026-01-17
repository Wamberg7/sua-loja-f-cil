import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if already logged in and has admin role
  useEffect(() => {
    const checkAdminRole = async () => {
      if (user) {
        const { data: roles } = await supabase.rpc('get_user_roles', { _user_id: user.id });
        if (roles && (roles.includes('admin') || roles.includes('superadmin'))) {
          navigate('/admin');
        }
      }
    };
    checkAdminRole();
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Preencha todos os campos");
      return;
    }

    setIsLoading(true);
    
    const { success, error } = await login(email, password);
    
    if (success) {
      // Verify admin role
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        const { data: roles } = await supabase.rpc('get_user_roles', { _user_id: currentUser.id });
        
        if (roles && (roles.includes('admin') || roles.includes('superadmin'))) {
          toast.success("Login administrativo realizado!");
          navigate("/admin");
        } else {
          await supabase.auth.signOut();
          toast.error("Acesso negado. Você não tem permissão de administrador.");
        }
      }
    } else {
      toast.error(error || "Erro ao fazer login");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <span className="text-xl font-bold text-foreground">DigitalHub</span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Shield className="w-3 h-3" />
                <span>Painel Administrativo</span>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Acesso Restrito</h1>
            <p className="text-muted-foreground text-sm">
              Entre com suas credenciais de administrador
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Email
              </label>
              <Input
                type="email"
                placeholder="admin@digitalhub.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Senha
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Verificando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Acessar Painel
                </span>
              )}
            </Button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-xs text-center text-destructive">
              ⚠️ Esta área é restrita a administradores autorizados.
              <br />
              Tentativas de acesso não autorizado são registradas.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
