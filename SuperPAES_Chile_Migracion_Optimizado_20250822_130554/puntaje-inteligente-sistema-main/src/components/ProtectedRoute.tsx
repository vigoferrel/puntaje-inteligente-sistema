/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

// ðŸ›¡ï¸ Componente de Ruta Protegida CuÃ¡ntica
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = false
}) => {
  const location = useLocation();
  
  // Intentar obtener auth de forma segura
  let user: { id: string; name: string; email: string } | null = null;
  let isAuthenticated = false;
  
  try {
    const authContext = useAuth();
    user = authContext?.user || null;
    isAuthenticated = authContext?.isAuthenticated || false;
  } catch (error) {
    console.warn('ðŸŒŒ ProtectedRoute: Auth no disponible, permitiendo acceso');
    // En modo bypass, permitir acceso
    return <>{children}</>;
  }

  // Si requiere auth y no estÃ¡ autenticado, redirigir a login
  if (requireAuth && !isAuthenticated && !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Renderizar children
  return <>{children}</>;
};

export default ProtectedRoute;
