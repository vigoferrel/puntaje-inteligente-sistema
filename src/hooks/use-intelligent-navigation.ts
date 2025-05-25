
import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface NavigationState {
  currentTool: string;
  activeSubject: string;
  toolContext: any;
  history: string[];
  recommendations: string[];
}

interface NavigationRecommendation {
  tool: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  context?: any;
}

export function useIntelligentNavigation(initialTool = 'dashboard') {
  const [searchParams, setSearchParams] = useSearchParams();
  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentTool: initialTool,
    activeSubject: 'COMPETENCIA_LECTORA',
    toolContext: {},
    history: [initialTool],
    recommendations: []
  });

  // Sincronizar con URL
  useEffect(() => {
    const urlTool = searchParams.get('tool');
    const urlSubject = searchParams.get('subject');
    
    if (urlTool && urlTool !== navigationState.currentTool) {
      updateNavigationState({ currentTool: urlTool });
    }
    
    if (urlSubject && urlSubject !== navigationState.activeSubject) {
      updateNavigationState({ activeSubject: urlSubject });
    }
  }, [searchParams]);

  const updateNavigationState = useCallback((updates: Partial<NavigationState>) => {
    setNavigationState(prev => ({ ...prev, ...updates }));
  }, []);

  const navigateToTool = useCallback((tool: string, context?: any) => {
    console.log(`🧭 Navegación inteligente: ${tool}`, context);
    
    // Actualizar estado
    const newHistory = [...navigationState.history, tool];
    updateNavigationState({
      currentTool: tool,
      toolContext: context || {},
      history: newHistory
    });
    
    // Actualizar URL
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tool', tool);
    
    if (context?.subject) {
      newParams.set('subject', context.subject);
      updateNavigationState({ activeSubject: context.subject });
    }
    
    setSearchParams(newParams);
    
    // Generar recomendaciones contextuales
    setTimeout(() => {
      generateRecommendations(tool, context);
    }, 1000);
  }, [navigationState.history, searchParams, setSearchParams, updateNavigationState]);

  const generateRecommendations = useCallback((currentTool: string, context?: any): NavigationRecommendation[] => {
    const recommendations: NavigationRecommendation[] = [];
    
    switch (currentTool) {
      case 'diagnostic':
        recommendations.push({
          tool: 'plan',
          reason: 'Crear plan personalizado basado en resultados del diagnóstico',
          priority: 'high',
          context: { fromDiagnostic: true }
        });
        recommendations.push({
          tool: 'lectoguia',
          reason: 'Obtener consejos específicos sobre áreas débiles',
          priority: 'medium'
        });
        break;
        
      case 'plan':
        recommendations.push({
          tool: 'exercises',
          reason: 'Generar ejercicios específicos para tu plan de estudio',
          priority: 'high',
          context: { planBased: true }
        });
        recommendations.push({
          tool: 'lectoguia',
          reason: 'Discutir estrategias de estudio con IA',
          priority: 'medium'
        });
        break;
        
      case 'exercises':
        recommendations.push({
          tool: 'lectoguia',
          reason: 'Revisar respuestas y obtener explicaciones adicionales',
          priority: 'medium'
        });
        recommendations.push({
          tool: 'diagnostic',
          reason: 'Evaluar progreso después de la práctica',
          priority: 'low'
        });
        break;
        
      case 'lectoguia':
        recommendations.push({
          tool: 'exercises',
          reason: 'Practicar con ejercicios generados por IA',
          priority: 'high'
        });
        recommendations.push({
          tool: 'plan',
          reason: 'Crear o ajustar plan de estudio',
          priority: 'medium'
        });
        break;
    }
    
    console.log(`💡 Recomendaciones generadas para ${currentTool}:`, recommendations);
    updateNavigationState({ recommendations: recommendations.map(r => r.reason) });
    
    return recommendations;
  }, [updateNavigationState]);

  const goBack = useCallback(() => {
    if (navigationState.history.length > 1) {
      const newHistory = [...navigationState.history];
      newHistory.pop();
      const previousTool = newHistory[newHistory.length - 1];
      
      navigateToTool(previousTool);
      updateNavigationState({ history: newHistory });
    }
  }, [navigationState.history, navigateToTool, updateNavigationState]);

  const changeSubject = useCallback((subject: string) => {
    updateNavigationState({ activeSubject: subject });
    
    const newParams = new URLSearchParams(searchParams);
    newParams.set('subject', subject);
    setSearchParams(newParams);
  }, [searchParams, setSearchParams, updateNavigationState]);

  return {
    navigationState,
    navigateToTool,
    goBack,
    changeSubject,
    generateRecommendations,
    canGoBack: navigationState.history.length > 1
  };
}
