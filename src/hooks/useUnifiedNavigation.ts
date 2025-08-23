
import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';

interface NavigationOptions {
  transition?: 'fade' | 'slide' | 'scale' | 'blur';
  preload?: boolean;
  replace?: boolean;
}

export const useUnifiedNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateWithTransition = useCallback(async (
    path: string, 
    options: NavigationOptions = {}
  ) => {
    const { replace = false } = options;

    try {
      // Navegar directamente
      navigate(path, { replace });
    } catch (error) {
      console.warn('Navigation failed:', error);
      navigate(path, { replace });
    }
  }, [navigate]);

  const getCurrentModule = useCallback(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    return pathSegments[0] || 'hub';
  }, [location.pathname]);

  const isActive = useCallback((path: string) => {
    return location.pathname === path;
  }, [location.pathname]);

  // Navegación específica a módulos con fallbacks seguros
  const goToCompetenciaLectora = useCallback(() => 
    navigateWithTransition('/lectoguia').catch(() => navigate('/lectoguia')), 
    [navigateWithTransition, navigate]);
  
  const goToMathematics = useCallback(() => 
    navigateWithTransition('/mathematics').catch(() => navigate('/mathematics')), 
    [navigateWithTransition, navigate]);
  
  const goToSciences = useCallback(() => 
    navigateWithTransition('/sciences').catch(() => navigate('/sciences')), 
    [navigateWithTransition, navigate]);
  
  const goToHistory = useCallback(() => 
    navigateWithTransition('/history').catch(() => navigate('/history')), 
    [navigateWithTransition, navigate]);
  
  const goToDiagnostic = useCallback(() => 
    navigateWithTransition('/diagnostic').catch(() => navigate('/diagnostic')), 
    [navigateWithTransition, navigate]);
  
  const goToPlanning = useCallback(() => 
    navigateWithTransition('/planning').catch(() => navigate('/planning')), 
    [navigateWithTransition, navigate]);
  
  const goToFinancial = useCallback(() => 
    navigateWithTransition('/financial').catch(() => navigate('/financial')), 
    [navigateWithTransition, navigate]);

  const goToHub = useCallback(() => 
    navigateWithTransition('/').catch(() => navigate('/')), 
    [navigateWithTransition, navigate]);

  return {
    navigateWithTransition,
    getCurrentModule,
    isActive,
    goToCompetenciaLectora,
    goToMathematics,
    goToSciences,
    goToHistory,
    goToDiagnostic,
    goToPlanning,
    goToFinancial,
    goToHub,
    currentPath: location.pathname
  };
};
