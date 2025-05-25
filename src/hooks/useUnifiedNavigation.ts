
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
  userIntent?: string;
  timestamp?: string;
  neuralMetrics?: {
    efficiency: number;
    adaptiveScore: number;
  };
}

export function useUnifiedNavigation() {
  const { user } = useAuth();
  const { 
    currentTool, 
    context: routingContext, 
    navigateToTool: routingNavigate, 
    updateContext: routingUpdateContext 
  } = useUnifiedRouting();
  
  const [navigationHistory, setNavigationHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('unified-navigation-history');
    return saved ? JSON.parse(saved) : ['dashboard'];
  });
  
  const [context, setContext] = useState<NavigationContext>(() => {
    const saved = localStorage.getItem('unified-navigation-context');
    return saved ? JSON.parse(saved) : {};
  });

  // Sincronización optimizada con routing context
  useEffect(() => {
    if (routingContext && Object.keys(routingContext).length > 0) {
      setContext(prev => ({ 
        ...prev, 
        ...routingContext,
        timestamp: new Date().toISOString()
      }));
    }
  }, [routingContext]);

  // Persistencia optimizada
  useEffect(() => {
    localStorage.setItem('unified-navigation-history', JSON.stringify(navigationHistory));
  }, [navigationHistory]);

  useEffect(() => {
    localStorage.setItem('unified-navigation-context', JSON.stringify(context));
  }, [context]);

  const navigateToTool = useCallback((
    tool: string, 
    newContext?: NavigationContext,
    updateHistory = true
  ) => {
    console.log(`🧭 Navegación unificada optimizada: ${currentTool} → ${tool}`, { 
      context: newContext, 
      user: user?.id,
      timestamp: new Date().toISOString()
    });
    
    // Contexto enriquecido
    const enrichedContext = {
      ...newContext,
      fromTool: currentTool,
      timestamp: new Date().toISOString(),
      userId: user?.id
    };
    
    // Actualizar contexto local
    if (enrichedContext) {
      setContext(prev => ({ 
        ...prev, 
        ...enrichedContext
      }));
    }
    
    // Actualizar historial con límite inteligente
    if (updateHistory) {
      setNavigationHistory(prev => {
        const newHistory = [...prev.filter(t => t !== tool), tool];
        return newHistory.slice(-15); // Mantener últimos 15
      });
    }
    
    // Delegar a routing con contexto enriquecido
    routingNavigate(tool, enrichedContext);
    
    console.log(`✅ Navegación optimizada completada a ${tool}`);
  }, [currentTool, user?.id, routingNavigate]);

  const goBack = useCallback(() => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      const currentIndex = newHistory.findIndex(t => t === currentTool);
      const previousTool = currentIndex > 0 ? newHistory[currentIndex - 1] : newHistory[newHistory.length - 2];
      
      if (previousTool) {
        // Remover herramienta actual del historial
        const filteredHistory = newHistory.filter((_, index) => index !== currentIndex);
        setNavigationHistory(filteredHistory);
        
        // Navegar sin actualizar historial
        navigateToTool(previousTool, { 
          navigationAction: 'back',
          fromTool: currentTool 
        }, false);
        
        console.log(`⬅️ Navegación hacia atrás: ${currentTool} → ${previousTool}`);
      }
    }
  }, [navigationHistory, currentTool, navigateToTool]);

  const resetNavigation = useCallback(() => {
    setNavigationHistory(['dashboard']);
    setContext({});
    
    localStorage.removeItem('unified-navigation-history');
    localStorage.removeItem('unified-navigation-context');
    
    routingNavigate('dashboard');
    
    console.log('🔄 Navegación reiniciada completamente');
  }, [routingNavigate]);

  const updateContext = useCallback((newContext: Partial<NavigationContext>) => {
    const enrichedUpdate = {
      ...newContext,
      timestamp: new Date().toISOString(),
      lastUpdatedBy: currentTool
    };
    
    setContext(prev => ({ ...prev, ...enrichedUpdate }));
    routingUpdateContext(enrichedUpdate);
    
    console.log('🔧 Contexto actualizado:', enrichedUpdate);
  }, [routingUpdateContext, currentTool]);

  // Función de análisis de navegación
  const getNavigationAnalytics = useCallback(() => {
    const uniqueTools = new Set(navigationHistory);
    const mostVisited = navigationHistory.reduce((acc, tool) => {
      acc[tool] = (acc[tool] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const sortedTools = Object.entries(mostVisited)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
    
    return {
      totalNavigations: navigationHistory.length,
      uniqueToolsVisited: uniqueTools.size,
      mostVisitedTools: sortedTools,
      currentSession: navigationHistory.slice(-10),
      averageSessionLength: Math.round(navigationHistory.length / (uniqueTools.size || 1))
    };
  }, [navigationHistory]);

  return {
    currentTool,
    context,
    navigationHistory,
    navigateToTool,
    goBack,
    resetNavigation,
    updateContext,
    canGoBack: navigationHistory.length > 1,
    getNavigationAnalytics
  };
}
