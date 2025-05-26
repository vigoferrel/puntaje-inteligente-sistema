import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

export interface NavigationContext {
  subject?: string;
  nodeId?: string;
  testId?: string;
  fromTool?: string;
  data?: any;
  systemMode?: 'neural' | 'unified';
  userIntent?: string;
  timestamp?: string;
  navigationAction?: string;
}

export interface NavigationState {
  currentTool: string;
  context: NavigationContext;
  navigationHistory: string[];
  canGoBack: boolean;
}

export function useUnifiedNavigation() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extraer herramienta actual de la ruta
  const currentTool = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    return pathSegments[0] || 'dashboard';
  }, [location.pathname]);

  // Estado de navegación con persistencia optimizada
  const [navigationHistory, setNavigationHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('unified-navigation-history');
      return saved ? JSON.parse(saved) : ['dashboard'];
    } catch {
      return ['dashboard'];
    }
  });
  
  const [context, setContext] = useState<NavigationContext>(() => {
    try {
      const saved = localStorage.getItem('unified-navigation-context');
      const urlParams = new URLSearchParams(location.search);
      
      const contextFromUrl = {
        subject: urlParams.get('subject') || undefined,
        nodeId: urlParams.get('nodeId') || undefined,
        testId: urlParams.get('testId') || undefined,
      };
      
      return saved ? { ...JSON.parse(saved), ...contextFromUrl } : contextFromUrl;
    } catch {
      return {};
    }
  });

  // Sincronización con URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlContext = {
      subject: params.get('subject') || undefined,
      nodeId: params.get('nodeId') || undefined,
      testId: params.get('testId') || undefined,
    };
    
    if (Object.values(urlContext).some(Boolean)) {
      setContext(prev => ({ ...prev, ...urlContext }));
    }
  }, [location.search]);

  // Persistencia optimizada
  useEffect(() => {
    try {
      localStorage.setItem('unified-navigation-history', JSON.stringify(navigationHistory.slice(-10)));
    } catch {
      // Silently fail
    }
  }, [navigationHistory]);

  useEffect(() => {
    try {
      localStorage.setItem('unified-navigation-context', JSON.stringify(context));
    } catch {
      // Silently fail
    }
  }, [context]);

  // Navegación principal optimizada
  const navigateToTool = useCallback((
    tool: string, 
    newContext?: NavigationContext,
    updateHistory = true
  ) => {
    console.log(`🧭 Navegación unificada: ${currentTool} → ${tool}`);
    
    // Construir nueva ruta
    let newPath = `/${tool}`;
    if (tool === 'dashboard') newPath = '/';
    
    // Construir parámetros de URL
    const params = new URLSearchParams();
    const finalContext = { ...context, ...newContext };
    
    if (finalContext.subject) params.set('subject', finalContext.subject);
    if (finalContext.nodeId) params.set('nodeId', finalContext.nodeId);
    if (finalContext.testId) params.set('testId', finalContext.testId);
    
    // Actualizar contexto
    if (newContext) {
      setContext(prev => ({ 
        ...prev, 
        ...newContext,
        fromTool: currentTool,
        timestamp: new Date().toISOString()
      }));
    }
    
    // Actualizar historial
    if (updateHistory && tool !== currentTool) {
      setNavigationHistory(prev => {
        const newHistory = prev.filter(t => t !== tool);
        newHistory.push(tool);
        return newHistory.slice(-10); // Mantener últimos 10
      });
    }
    
    // Navegar
    const queryString = params.toString();
    const fullPath = queryString ? `${newPath}?${queryString}` : newPath;
    navigate(fullPath);
    
    console.log(`✅ Navegación completada a ${tool}`);
  }, [currentTool, context, navigate]);

  // Navegación hacia atrás
  const goBack = useCallback(() => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Remover actual
      const previousTool = newHistory[newHistory.length - 1] || 'dashboard';
      
      setNavigationHistory(newHistory);
      navigateToTool(previousTool, { 
        navigationAction: 'back',
        fromTool: currentTool 
      }, false);
      
      console.log(`⬅️ Navegación hacia atrás: ${currentTool} → ${previousTool}`);
    }
  }, [navigationHistory, currentTool, navigateToTool]);

  // Actualizar contexto sin navegar
  const updateContext = useCallback((newContext: Partial<NavigationContext>) => {
    setContext(prev => ({ 
      ...prev, 
      ...newContext,
      timestamp: new Date().toISOString()
    }));
    
    // Actualizar URL con nuevo contexto
    const params = new URLSearchParams(location.search);
    if (newContext.subject) params.set('subject', newContext.subject);
    if (newContext.nodeId) params.set('nodeId', newContext.nodeId);
    if (newContext.testId) params.set('testId', newContext.testId);
    
    const newUrl = `${location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [location]);

  // Reset completo
  const resetNavigation = useCallback(() => {
    setNavigationHistory(['dashboard']);
    setContext({});
    localStorage.removeItem('unified-navigation-history');
    localStorage.removeItem('unified-navigation-context');
    navigate('/');
    console.log('🔄 Navegación reiniciada');
  }, [navigate]);

  return {
    currentTool,
    context,
    navigationHistory,
    canGoBack: navigationHistory.length > 1,
    navigateToTool,
    goBack,
    updateContext,
    resetNavigation
  };
}
