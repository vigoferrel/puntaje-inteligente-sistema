
import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

export function useSimpleNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extraer herramienta actual de la ruta de manera simple
  const currentTool = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    return pathSegments[0] || 'dashboard';
  }, [location.pathname]);

  // Navegación simple sin complejidad artificial
  const navigateToTool = useCallback((tool: string, params?: Record<string, string>) => {
    let path = tool === 'dashboard' ? '/' : `/${tool}`;
    
    if (params) {
      const searchParams = new URLSearchParams(params);
      path += `?${searchParams.toString()}`;
    }
    
    navigate(path);
  }, [navigate]);

  return {
    currentTool,
    navigateToTool
  };
}
