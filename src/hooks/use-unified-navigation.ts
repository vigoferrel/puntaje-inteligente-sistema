
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface NavigationContext {
  subject?: string;
  nodeId?: string;
  testId?: string;
  fromTool?: string;
  data?: any;
}

export function useUnifiedNavigation() {
  const { user } = useAuth();
  const [currentTool, setCurrentTool] = useState('dashboard');
  const [navigationHistory, setNavigationHistory] = useState<string[]>(['dashboard']);
  const [context, setContext] = useState<NavigationContext>({});

  const navigateToTool = useCallback((
    tool: string, 
    newContext?: NavigationContext,
    updateHistory = true
  ) => {
    console.log(`🧭 Navegando a: ${tool}`, { context: newContext, user: user?.id });
    
    // Actualizar herramienta actual
    setCurrentTool(tool);
    
    // Actualizar contexto
    if (newContext) {
      setContext(prev => ({ ...prev, ...newContext, fromTool: currentTool }));
    }
    
    // Actualizar historial
    if (updateHistory) {
      setNavigationHistory(prev => [...prev, tool]);
    }
    
    // Log para debugging
    console.log(`✅ Navegación completada a ${tool}`);
  }, [currentTool, user?.id]);

  const goBack = useCallback(() => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Remover herramienta actual
      const previousTool = newHistory[newHistory.length - 1];
      
      setNavigationHistory(newHistory);
      setCurrentTool(previousTool);
      
      console.log(`⬅️ Regresando a: ${previousTool}`);
    }
  }, [navigationHistory]);

  const resetNavigation = useCallback(() => {
    setCurrentTool('dashboard');
    setNavigationHistory(['dashboard']);
    setContext({});
    console.log('🔄 Navegación reiniciada');
  }, []);

  const updateContext = useCallback((newContext: Partial<NavigationContext>) => {
    setContext(prev => ({ ...prev, ...newContext }));
  }, []);

  const getNavigationState = useCallback(() => {
    return {
      currentTool,
      context,
      history: navigationHistory,
      canGoBack: navigationHistory.length > 1
    };
  }, [currentTool, context, navigationHistory]);

  return {
    currentTool,
    context,
    navigationHistory,
    navigateToTool,
    goBack,
    resetNavigation,
    updateContext,
    getNavigationState,
    canGoBack: navigationHistory.length > 1
  };
}
