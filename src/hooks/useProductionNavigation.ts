
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useProductionNavigation = () => {
  const navigate = useNavigate();

  const navigateToRoute = useCallback((path: string) => {
    try {
      console.log(`🚀 Navegación directa a: ${path}`);
      navigate(path);
    } catch (error) {
      console.error('Error de navegación:', error);
      // Fallback seguro
      window.location.href = path;
    }
  }, [navigate]);

  // Navegación específica para cada sección
  const goToLectoguia = useCallback(() => navigateToRoute('/lectoguia'), [navigateToRoute]);
  const goToMathematics = useCallback(() => navigateToRoute('/mathematics'), [navigateToRoute]);
  const goToSciences = useCallback(() => navigateToRoute('/sciences'), [navigateToRoute]);
  const goToHistory = useCallback(() => navigateToRoute('/history'), [navigateToRoute]);
  const goToDiagnostic = useCallback(() => navigateToRoute('/diagnostic'), [navigateToRoute]);
  const goToFinancial = useCallback(() => navigateToRoute('/financial'), [navigateToRoute]);
  const goToPAESUniverse = useCallback(() => navigateToRoute('/paes-universe'), [navigateToRoute]);
  const goToUnified = useCallback(() => navigateToRoute('/unified'), [navigateToRoute]);

  return {
    navigateToRoute,
    goToLectoguia,
    goToMathematics,
    goToSciences,
    goToHistory,
    goToDiagnostic,
    goToFinancial,
    goToPAESUniverse,
    goToUnified
  };
};
