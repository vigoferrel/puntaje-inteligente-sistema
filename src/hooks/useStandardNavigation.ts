
import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

export function useStandardNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extraer herramienta actual de la ruta
  const currentTool = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    return pathSegments[0] || 'dashboard';
  }, [location.pathname]);

  // Navegación simple
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
