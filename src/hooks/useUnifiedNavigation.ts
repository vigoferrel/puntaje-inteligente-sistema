
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUnifiedRouting } from './useUnifiedRouting';

export interface NavigationContext {
  subject?: string;
  nodeId?: string;
  testId?: string;
  fromTool?: string;
  data?: any;
  systemMode?: 'neural' | 'unified';
}

export function useUnifiedNavigation() {
  const { user } = useAuth();
  const { currentTool, context: routingContext, navigateToTool: routingNavigate, updateContext: routingUpdateContext } = useUnifiedRouting();
  
  const [navigationHistory, setNavigationHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('navigation-history');
    return saved ? JSON.parse(saved) : ['dashboard'];
  });
  
  const [context, setContext] = useState<NavigationContext>(() => {
    const saved = localStorage.getItem('navigation-context');
    return saved ? JSON.parse(saved) : {};
  });

  // Sync with routing context
  useEffect(() => {
    if (routingContext && Object.keys(routingContext).length > 0) {
      setContext(prev => ({ ...prev, ...routingContext }));
    }
  }, [routingContext]);

  // Persist state
  useEffect(() => {
    localStorage.setItem('navigation-history', JSON.stringify(navigationHistory));
  }, [navigationHistory]);

  useEffect(() => {
    localStorage.setItem('navigation-context', JSON.stringify(context));
  }, [context]);

  const navigateToTool = useCallback((
    tool: string, 
    newContext?: NavigationContext,
    updateHistory = true
  ) => {
    console.log(`🧭 Navegación unificada: ${currentTool} → ${tool}`, { 
      context: newContext, 
      user: user?.id 
    });
    
    // Update context
    if (newContext) {
      setContext(prev => ({ 
        ...prev, 
        ...newContext, 
        fromTool: currentTool 
      }));
    }
    
    // Update history
    if (updateHistory) {
      setNavigationHistory(prev => {
        const newHistory = [...prev, tool];
        return newHistory.slice(-10); // Keep last 10
      });
    }
    
    // Delegate to routing
    routingNavigate(tool, newContext);
    
    console.log(`✅ Navegación completada a ${tool}`);
  }, [currentTool, user?.id, routingNavigate]);

  const goBack = useCallback(() => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Remove current
      const previousTool = newHistory[newHistory.length - 1];
      
      setNavigationHistory(newHistory);
      navigateToTool(previousTool, undefined, false);
      
      console.log(`⬅️ Regresando a: ${previousTool}`);
    }
  }, [navigationHistory, navigateToTool]);

  const resetNavigation = useCallback(() => {
    setNavigationHistory(['dashboard']);
    setContext({});
    
    localStorage.removeItem('navigation-history');
    localStorage.removeItem('navigation-context');
    
    routingNavigate('dashboard');
    
    console.log('🔄 Navegación reiniciada');
  }, [routingNavigate]);

  const updateContext = useCallback((newContext: Partial<NavigationContext>) => {
    setContext(prev => ({ ...prev, ...newContext }));
    routingUpdateContext(newContext);
  }, [routingUpdateContext]);

  return {
    currentTool,
    context,
    navigationHistory,
    navigateToTool,
    goBack,
    resetNavigation,
    updateContext,
    canGoBack: navigationHistory.length > 1
  };
}
