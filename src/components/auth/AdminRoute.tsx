import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { Loader2 } from "lucide-react";

interface AdminRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("superadmin" | "admin")[];
}

export const AdminRoute = ({ 
  children, 
  allowedRoles = ["superadmin", "admin"] 
}: AdminRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { roles, isLoading: rolesLoading, hasRole } = useUserRole();
  const location = useLocation();

  if (isLoading || rolesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasAllowedRole = allowedRoles.some(role => hasRole(role));
  
  if (!hasAllowedRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
