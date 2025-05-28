
import { useCallback, useMemo } from 'react';

interface SubjectContext {
  id: string;
  lastVisit?: number;
  visitCount: number;
  averageSessionTime: number;
  successRate: number;
}

export const useIntelligentRecommendations = () => {
  
  // Obtener contexto de usuario para cada materia
  const getSubjectContext = useCallback((subjectId: string): SubjectContext => {
    const stored = localStorage.getItem(`subject_context_${subjectId}`);
    return stored ? JSON.parse(stored) : {
      id: subjectId,
      visitCount: 0,
      averageSessionTime: 0,
      successRate: 0
    };
  }, []);

  // Actualizar contexto después de una sesión
  const updateSubjectContext = useCallback((subjectId: string, sessionData: {
    sessionTime: number;
    success: boolean;
  }) => {
    const context = getSubjectContext(subjectId);
    const newContext = {
      ...context,
      lastVisit: Date.now(),
      visitCount: context.visitCount + 1,
      averageSessionTime: (context.averageSessionTime * context.visitCount + sessionData.sessionTime) / (context.visitCount + 1),
      successRate: ((context.successRate * context.visitCount) + (sessionData.success ? 100 : 0)) / (context.visitCount + 1)
    };
    
    localStorage.setItem(`subject_context_${subjectId}`, JSON.stringify(newContext));
    return newContext;
  }, [getSubjectContext]);

  // Calcular score de recomendación inteligente
  const calculateIntelligentScore = useCallback((subjectId: string, baseMetrics: {
    engagement: number;
    adaptability: number;
    efficiency: number;
  }) => {
    const context = getSubjectContext(subjectId);
    const hour = new Date().getHours();
    
    // Base neural score
    let score = (baseMetrics.engagement + baseMetrics.adaptability) / 2;
    
    // Factor temporal por materia
    const timeMultiplier = getTimeBasedMultiplier(subjectId, hour);
    score *= timeMultiplier;
    
    // Factor de novedad (bonifica materias no visitadas recientemente)
    const noveltyMultiplier = getNoveltyMultiplier(context);
    score *= noveltyMultiplier;
    
    // Factor de éxito histórico
    const successMultiplier = context.successRate > 0 ? 0.8 + (context.successRate / 100) * 0.4 : 1.0;
    score *= successMultiplier;
    
    // Anti-repetición
    const antiRepetitionMultiplier = getAntiRepetitionMultiplier(subjectId);
    score *= antiRepetitionMultiplier;
    
    return Math.round(score);
  }, [getSubjectContext]);

  return {
    getSubjectContext,
    updateSubjectContext,
    calculateIntelligentScore
  };
};

// Funciones auxiliares optimizadas
function getTimeBasedMultiplier(subjectId: string, hour: number): number {
  const timeFactors: Record<string, { optimal: number[]; good: number[]; }> = {
    'matematica-m1': { optimal: [9, 10, 11, 15, 16], good: [8, 12, 14, 17] },
    'matematica-m2': { optimal: [9, 10, 11, 15, 16], good: [8, 12, 14, 17] },
    'ciencias': { optimal: [15, 16, 17, 18], good: [14, 19, 20] },
    'historia': { optimal: [10, 11, 16, 17], good: [9, 12, 15, 18] },
    'competencia-lectora': { optimal: [8, 9, 20, 21], good: [7, 10, 19, 22] }
  };
  
  const factor = timeFactors[subjectId];
  if (!factor) return 1.0;
  
  if (factor.optimal.includes(hour)) return 1.3;
  if (factor.good.includes(hour)) return 1.1;
  return 0.9;
}

function getNoveltyMultiplier(context: SubjectContext): number {
  if (!context.lastVisit) return 1.5; // Nunca visitado
  
  const daysSince = (Date.now() - context.lastVisit) / (1000 * 60 * 60 * 24);
  
  if (daysSince > 7) return 1.4;
  if (daysSince > 3) return 1.2;
  if (daysSince > 1) return 1.1;
  return 0.8; // Visitado recientemente
}

function getAntiRepetitionMultiplier(subjectId: string): number {
  const lastRecommendations = JSON.parse(localStorage.getItem('neural_recommendation_history') || '[]');
  const recentCount = lastRecommendations.slice(-3).filter((id: string) => id === subjectId).length;
  
  if (recentCount >= 2) return 0.5; // Muy repetitivo
  if (recentCount === 1) return 0.8; // Algo repetitivo
  return 1.2; // Fresco
}
