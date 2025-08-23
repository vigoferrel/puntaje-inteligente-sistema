/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// ðŸ§  Interfaces para el sistema de navegaciÃ³n cuÃ¡ntico
interface NavigationState {
  history: string[];
  currentIndex: number;
  canGoBack: boolean;
  canGoForward: boolean;
  currentRoute: string;
  previousRoute: string | null;
}

interface NavigationContextType {
  state: NavigationState;
  navigateTo: (path: string) => void;
  goBack: () => void;
  goForward: () => void;
  clearHistory: () => void;
  addToHistory: (path: string) => void;
}

// Context cuÃ¡ntico
const NavigationContext = createContext<NavigationContextType | null>(null);

interface QuantumNavigationProviderProps {
  children: React.ReactNode;
}

// ðŸŒŒ Provider de NavegaciÃ³n CuÃ¡ntica con Context7 + Pensamiento Secuencial
export const QuantumNavigationProvider: React.FC<QuantumNavigationProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estado cuÃ¡ntico de navegaciÃ³n
  const [history, setHistory] = useState<string[]>([location.pathname]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousRoute, setPreviousRoute] = useState<string | null>(null);

  // Efecto para sincronizar con cambios de ubicaciÃ³n
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Solo agregar al historial si es diferente al Ãºltimo
    setHistory(prev => {
      const lastPath = prev[prev.length - 1];
      if (lastPath !== currentPath) {
        setPreviousRoute(lastPath);
        return [...prev, currentPath];
      }
      return prev;
    });
    
    setCurrentIndex(prev => {
      const newHistory = history[history.length - 1] !== currentPath 
        ? [...history, currentPath] 
        : history;
      return newHistory.length - 1;
    });
  }, [location.pathname, history]);

  // NavegaciÃ³n cuÃ¡ntica inteligente
  const navigateTo = useCallback((path: string) => {
    console.log('ðŸŒŒ NavegaciÃ³n cuÃ¡ntica a:', path);
    navigate(path);
  }, [navigate]);

  // NavegaciÃ³n hacia atrÃ¡s
  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const targetPath = history[newIndex];
      
      console.log('ðŸ”™ NavegaciÃ³n cuÃ¡ntica hacia atrÃ¡s a:', targetPath);
      setCurrentIndex(newIndex);
      navigate(targetPath);
    }
  }, [currentIndex, history, navigate]);

  // NavegaciÃ³n hacia adelante
  const goForward = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      const targetPath = history[newIndex];
      
      console.log('ðŸ”œ NavegaciÃ³n cuÃ¡ntica hacia adelante a:', targetPath);
      setCurrentIndex(newIndex);
      navigate(targetPath);
    }
  }, [currentIndex, history, navigate]);

  // Limpiar historial cuÃ¡ntico
  const clearHistory = useCallback(() => {
    console.log('ðŸ§¹ Limpiando historial cuÃ¡ntico');
    setHistory([location.pathname]);
    setCurrentIndex(0);
    setPreviousRoute(null);
  }, [location.pathname]);

  // Agregar ruta al historial manualmente
  const addToHistory = // eslint-disable-next-line react-hooks/exhaustive-depsuseCallback((path: string) => {
    setHistory(prev => [...prev, path]);
    setCurrentIndex(prev => prev + 1);
  }, []);useCallback((path: string) => {
    setHistory(prev => [...prev, path]);
    setCurrentIndex(prev => prev + 1);
  }, []);

  // Estado cuÃ¡ntico calculado
  const state: NavigationState = {
    history,
    currentIndex,
    canGoBack: currentIndex > 0,
    canGoForward: currentIndex < history.length - 1,
    currentRoute: location.pathname,
    previousRoute
  };

  // Context value cuÃ¡ntico
  const contextValue: NavigationContextType = {
    state,
    navigateTo,
    goBack,
    goForward,
    clearHistory,
    addToHistory
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};

// Hook para usar navegaciÃ³n cuÃ¡ntica
export const useQuantumNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  
  if (!context) {
    throw new Error(
      'useQuantumNavigation debe usarse dentro de QuantumNavigationProvider. ' +
      'AsegÃºrate de que el componente estÃ© envuelto en el provider cuÃ¡ntico.'
    );
  }
  
  return context;
};

// Hook simplificado para navegaciÃ³n bÃ¡sica
export const useQuantumNavigate = () => {
  const { navigateTo } = useQuantumNavigation();
  return navigateTo;
};

// Hook para obtener estado de navegaciÃ³n
export const useQuantumNavigationState = () => {
  const { state } = useQuantumNavigation();
  return state;
};

export default QuantumNavigationProvider;

