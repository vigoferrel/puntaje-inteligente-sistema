
import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';
import { useGlobalCinematic } from '@/contexts/GlobalCinematicContext';

interface NavigationOptions {
  transition?: 'fade' | 'slide' | 'scale' | 'blur';
  preload?: boolean;
  replace?: boolean;
}

export const useUnifiedNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { startTransition } = useGlobalCinematic();

  const navigateWithTransition = useCallback(async (
    path: string, 
    options: NavigationOptions = {}
  ) => {
    const { replace = false } = options;

    try {
      // Iniciar transición cinematográfica
      await startTransition(path);

      // Navegar a la nueva ruta
      navigate(path, { replace });
    } catch (error) {
      // Fallback: navegar sin transición
      console.warn('Navigation transition failed, falling back to direct navigation:', error);
      navigate(path, { replace });
    }
  }, [navigate, startTransition]);

  const getCurrentModule = useCallback(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    return pathSegments[0] || 'hub';
  }, [location.pathname]);

  const isActive = useCallback((path: string) => {
    return location.pathname === path;
  }, [location.pathname]);

  // Navegación específica a módulos con fallbacks seguros
  const goToLectoGuia = useCallback(() => 
    navigateWithTransition('/lectoguia').catch(() => navigate('/lectoguia')), 
    [navigateWithTransition, navigate]);
  
  const goToDiagnostic = useCallback(() => 
    navigateWithTransition('/diagnostic').catch(() => navigate('/diagnostic')), 
    [navigateWithTransition, navigate]);
  
  const goToPlanning = useCallback(() => 
    navigateWithTransition('/planning').catch(() => navigate('/planning')), 
    [navigateWithTransition, navigate]);
  
  const goToUniverse = useCallback(() => 
    navigateWithTransition('/universe').catch(() => navigate('/universe')), 
    [navigateWithTransition, navigate]);
  
  const goToFinancial = useCallback(() => 
    navigateWithTransition('/financial').catch(() => navigate('/financial')), 
    [navigateWithTransition, navigate]);
  
  const goToAchievements = useCallback(() => 
    navigateWithTransition('/achievements').catch(() => navigate('/achievements')), 
    [navigateWithTransition, navigate]);

  const goToHub = useCallback(() => 
    navigateWithTransition('/').catch(() => navigate('/')), 
    [navigateWithTransition, navigate]);

  return {
    navigateWithTransition,
    getCurrentModule,
    isActive,
    goToLectoGuia,
    goToDiagnostic,
    goToPlanning,
    goToUniverse,
    goToFinancial,
    goToAchievements,
    goToHub,
    currentPath: location.pathname
  };
};
