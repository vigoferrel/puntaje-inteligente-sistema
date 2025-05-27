
import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';
import { useSimplifiedCinematic } from '@/contexts/SimplifiedCinematicContext';

interface NavigationOptions {
  transition?: 'fade' | 'slide' | 'scale' | 'blur';
  preload?: boolean;
  replace?: boolean;
}

export const useUnifiedNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { startTransition } = useSimplifiedCinematic();

  const navigateWithTransition = useCallback(async (
    path: string, 
    options: NavigationOptions = {}
  ) => {
    const { transition = 'fade', replace = false } = options;

    // Iniciar transición cinematográfica
    await startTransition(path, transition);

    // Navegar a la nueva ruta
    navigate(path, { replace });
  }, [navigate, startTransition]);

  const getCurrentModule = useCallback(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    return pathSegments[0] || 'hub';
  }, [location.pathname]);

  const isActive = useCallback((path: string) => {
    return location.pathname === path;
  }, [location.pathname]);

  // Navegación específica a módulos
  const goToLectoGuia = useCallback(() => 
    navigateWithTransition('/lectoguia', { transition: 'slide' }), [navigateWithTransition]);
  
  const goToDiagnostic = useCallback(() => 
    navigateWithTransition('/diagnostic', { transition: 'scale' }), [navigateWithTransition]);
  
  const goToPlanning = useCallback(() => 
    navigateWithTransition('/planning', { transition: 'fade' }), [navigateWithTransition]);
  
  const goToUniverse = useCallback(() => 
    navigateWithTransition('/universe', { transition: 'blur' }), [navigateWithTransition]);
  
  const goToFinancial = useCallback(() => 
    navigateWithTransition('/financial', { transition: 'slide' }), [navigateWithTransition]);
  
  const goToAchievements = useCallback(() => 
    navigateWithTransition('/achievements', { transition: 'scale' }), [navigateWithTransition]);

  const goToHub = useCallback(() => 
    navigateWithTransition('/', { transition: 'fade' }), [navigateWithTransition]);

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
