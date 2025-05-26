
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Hook para limpiar rutas legacy y redirigir al sistema unificado
 */
export const useLegacyRouteCleanup = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Mapeo de rutas legacy a rutas del sistema unificado
    const legacyRouteMap: Record<string, string> = {
      '/reforzamiento': '/dashboard',
      '/entrenamiento': '/lectoguia',
      '/contenido': '/lectoguia',
      '/evaluaciones': '/diagnostico',
      '/analisis': '/dashboard',
      '/simulaciones': '/diagnostico'
    };

    const currentPath = location.pathname;
    const unifiedRoute = legacyRouteMap[currentPath];

    if (unifiedRoute) {
      console.log(`🧹 Limpieza de ruta legacy: ${currentPath} → ${unifiedRoute}`);
      navigate(unifiedRoute, { replace: true });
    }
  }, [location.pathname, navigate]);

  return {
    isLegacyRoute: (path: string) => {
      const legacyRoutes = [
        '/reforzamiento', '/entrenamiento', '/contenido', 
        '/evaluaciones', '/analisis', '/simulaciones'
      ];
      return legacyRoutes.includes(path);
    }
  };
};
