
import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

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
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [currentTool, setCurrentTool] = useState(() => {
    return searchParams.get('tool') || 'dashboard';
  });
  
  const [navigationHistory, setNavigationHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('navigation-history');
    return saved ? JSON.parse(saved) : ['dashboard'];
  });
  
  const [context, setContext] = useState<NavigationContext>(() => {
    const saved = localStorage.getItem('navigation-context');
    return saved ? JSON.parse(saved) : {};
  });

  // Sync with URL parameters
  useEffect(() => {
    const urlTool = searchParams.get('tool');
    const urlSubject = searchParams.get('subject');
    const urlMode = searchParams.get('mode');
    
    if (urlTool && urlTool !== currentTool) {
      setCurrentTool(urlTool);
    }
    
    if (urlSubject || urlMode) {
      setContext(prev => ({
        ...prev,
        ...(urlSubject && { subject: urlSubject }),
        ...(urlMode && { systemMode: urlMode as 'neural' | 'unified' })
      }));
    }
  }, [searchParams, currentTool]);

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
    
    // Update tool
    setCurrentTool(tool);
    
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
    
    // Update URL
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tool', tool);
    
    if (newContext?.subject) {
      newParams.set('subject', newContext.subject);
    }
    
    if (newContext?.systemMode) {
      newParams.set('mode', newContext.systemMode);
    }
    
    setSearchParams(newParams);
    
    console.log(`✅ Navegación completada a ${tool}`);
  }, [currentTool, user?.id, searchParams, setSearchParams]);

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
    setCurrentTool('dashboard');
    setNavigationHistory(['dashboard']);
    setContext({});
    
    const newParams = new URLSearchParams();
    newParams.set('tool', 'dashboard');
    setSearchParams(newParams);
    
    localStorage.removeItem('navigation-history');
    localStorage.removeItem('navigation-context');
    
    console.log('🔄 Navegación reiniciada');
  }, [setSearchParams]);

  const updateContext = useCallback((newContext: Partial<NavigationContext>) => {
    setContext(prev => ({ ...prev, ...newContext }));
  }, []);

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
