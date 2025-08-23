import React, { useState, useEffect, useCallback } from 'react';
import { OpenAIService } from '../services/OpenAIService';
import { BloomLevelDetector } from '../bloom-assessment/BloomLevelDetector';
import { ProgressiveAssessment } from '../bloom-assessment/ProgressiveAssessment';
import AssessmentInterface from './AssessmentInterface';
import ResultsDashboard from './ResultsDashboard';
import LoadingSpinner from './LoadingSpinner';
import type { TechDomain, WidgetResults, WidgetProgress } from '../types/bloom';

interface WidgetAppProps {
  widgetId: string;
  techDomain: string;
  theme: string;
  onComplete?: (results: WidgetResults) => void;
  onProgress?: (progress: WidgetProgress) => void;
  onMount?: (instance: any) => void;
  customBranding?: boolean;
  maxQuestions?: number;
  timeLimit?: number;
}

type WidgetState = 'loading' | 'ready' | 'assessing' | 'completed' | 'error';

const WidgetApp: React.FC<WidgetAppProps> = ({
  widgetId,
  techDomain,
  theme,
  onComplete,
  onProgress,
  onMount,
  customBranding = false,
  maxQuestions = 5,
  timeLimit = 900
}) => {
  const [state, setState] = useState<WidgetState>('loading');
  const [error, setError] = useState<string | null>(null);
  const [assessmentService, setAssessmentService] = useState<ProgressiveAssessment | null>(null);
  const [results, setResults] = useState<WidgetResults | null>(null);
  const [progress, setProgress] = useState<WidgetProgress>({
    currentQuestion: 0,
    totalQuestions: maxQuestions,
    percentage: 0,
    timeElapsed: 0,
    estimatedTimeRemaining: timeLimit
  });

  // Initialize assessment services
  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Check if OpenAI API key is available
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
        if (!apiKey) {
          throw new Error('OpenAI API key not configured');
        }

        // Initialize services
        const openAIService = new OpenAIService({ apiKey });
        const bloomDetector = new BloomLevelDetector(openAIService);
        const assessmentService = new ProgressiveAssessment(bloomDetector, {
          maxQuestions,
          confidenceThreshold: 0.8,
          adaptiveStrategy: 'balanced'
        });

        setAssessmentService(assessmentService);
        setState('ready');

        console.log(`Widget ${widgetId} services initialized for ${techDomain}`);
      } catch (error) {
        console.error('Failed to initialize widget services:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        setState('error');
      }
    };

    initializeServices();
  }, [widgetId, techDomain, maxQuestions]);

  // Register widget instance with parent
  useEffect(() => {
    if (onMount) {
      onMount({
        getResults: () => results,
        getProgress: () => progress,
        getState: () => state,
        restart: handleRestart
      });
    }
  }, [onMount, results, progress, state]);

  const handleAssessmentStart = useCallback(async () => {
    if (!assessmentService) {
      setError('Assessment service not initialized');
      return;
    }

    setState('assessing');
    setError(null);

    const startTime = Date.now();
    
    try {
      // Create tech domain object
      const domain: TechDomain = {
        id: techDomain,
        name: techDomain.charAt(0).toUpperCase() + techDomain.slice(1),
        description: `Technical assessment for ${techDomain}`,
        bloomCriteria: {}
      };

      // Start assessment
      const assessmentResult = await assessmentService.conductAdaptiveAssessment(
        `user-${widgetId}`,
        domain
      );

      // Process results
      const widgetResults: WidgetResults = {
        bloomLevel: assessmentResult.finalBloomLevel,
        confidence: assessmentResult.overallConfidence,
        skillBreakdown: {
          strong: extractStrongSkills(assessmentResult.session),
          weak: extractWeakSkills(assessmentResult.session)
        },
        learningPath: generateLearningPath(assessmentResult),
        recommendations: assessmentResult.recommendations,
        assessmentData: {
          dominantLevel: assessmentResult.finalBloomLevel,
          confidence: assessmentResult.overallConfidence,
          reasoning: `Assessment completed with ${assessmentResult.session.responses.length} questions`,
          keyIndicators: extractKeyIndicators(assessmentResult.session),
          suggestions: assessmentResult.recommendations.join('; '),
          skillBreakdown: {
            strong: extractStrongSkills(assessmentResult.session),
            weak: extractWeakSkills(assessmentResult.session)
          }
        }
      };

      setResults(widgetResults);
      setState('completed');

      // Notify parent
      if (onComplete) {
        onComplete(widgetResults);
      }

      console.log(`Assessment completed for widget ${widgetId}:`, widgetResults);

    } catch (error) {
      console.error('Assessment failed:', error);
      setError(`Assessment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setState('error');
    }
  }, [assessmentService, techDomain, widgetId, onComplete]);

  const handleProgressUpdate = useCallback((newProgress: Partial<WidgetProgress>) => {
    setProgress(prev => {
      const updated = { ...prev, ...newProgress };
      if (onProgress) {
        onProgress(updated);
      }
      return updated;
    });
  }, [onProgress]);

  const handleRestart = useCallback(() => {
    setResults(null);
    setError(null);
    setProgress({
      currentQuestion: 0,
      totalQuestions: maxQuestions,
      percentage: 0,
      timeElapsed: 0,
      estimatedTimeRemaining: timeLimit
    });
    setState('ready');
  }, [maxQuestions, timeLimit]);

  // Helper functions with proper type assertions
  const extractStrongSkills = (session: any): string[] => {
    if (!session?.responses || !Array.isArray(session.responses)) {
      return [];
    }
    
    const strongSkills: string[] = [];
    
    for (const response of session.responses) {
      const skills = response?.bloomAssessment?.skillBreakdown?.strong;
      if (Array.isArray(skills)) {
        const validSkills = skills.filter((skill: unknown): skill is string => 
          typeof skill === 'string' && skill.trim().length > 0
        );
        strongSkills.push(...validSkills);
      }
    }
    
    return [...new Set(strongSkills)].slice(0, 5);
  };

  const extractWeakSkills = (session: any): string[] => {
    if (!session?.responses || !Array.isArray(session.responses)) {
      return [];
    }
    
    const weakSkills: string[] = [];
    
    for (const response of session.responses) {
      const skills = response?.bloomAssessment?.skillBreakdown?.weak;
      if (Array.isArray(skills)) {
        const validSkills = skills.filter((skill: unknown): skill is string => 
          typeof skill === 'string' && skill.trim().length > 0
        );
        weakSkills.push(...validSkills);
      }
    }
    
    return [...new Set(weakSkills)].slice(0, 3);
  };

  const extractKeyIndicators = (session: any): string[] => {
    if (!session?.responses || !Array.isArray(session.responses)) {
      return [];
    }
    
    const indicators: string[] = [];
    
    for (const response of session.responses) {
      const responseIndicators = response?.bloomAssessment?.keyIndicators;
      if (Array.isArray(responseIndicators)) {
        const validIndicators = responseIndicators.filter((indicator: unknown): indicator is string => 
          typeof indicator === 'string' && indicator.trim().length > 0
        );
        indicators.push(...validIndicators);
      }
    }
    
    return [...new Set(indicators)].slice(0, 5);
  };

  const generateLearningPath = (assessmentResult: any): any => {
    // Simplified learning path generation
    const currentLevel = assessmentResult.finalBloomLevel;
    const nextLevel = Math.min(5, currentLevel + 1);
    
    return {
      pathId: `path-${Date.now()}`,
      currentBloomLevel: currentLevel,
      targetBloomLevel: nextLevel,
      learningModules: generateModulesForLevel(nextLevel, techDomain),
      estimatedDuration: calculateEstimatedDuration(currentLevel, nextLevel),
      milestones: generateMilestones(currentLevel, nextLevel)
    };
  };

  const generateModulesForLevel = (level: number, domain: string): any[] => {
    const moduleTemplates: Record<number, any[]> = {
      2: [
        { id: 'understand-concepts', title: `Understanding ${domain} Concepts`, bloomLevel: 2, estimatedHours: 8 },
        { id: 'explain-relationships', title: 'Explaining Technology Relationships', bloomLevel: 2, estimatedHours: 6 }
      ],
      3: [
        { id: 'practical-implementation', title: `Implementing ${domain} Solutions`, bloomLevel: 3, estimatedHours: 12 },
        { id: 'hands-on-projects', title: 'Hands-on Project Development', bloomLevel: 3, estimatedHours: 16 }
      ],
      4: [
        { id: 'debugging-optimization', title: 'Debugging and Optimization', bloomLevel: 4, estimatedHours: 10 },
        { id: 'comparative-analysis', title: 'Comparative Solution Analysis', bloomLevel: 4, estimatedHours: 8 }
      ],
      5: [
        { id: 'architecture-evaluation', title: 'Architecture Evaluation', bloomLevel: 5, estimatedHours: 12 },
        { id: 'best-practices-review', title: 'Best Practices and Code Review', bloomLevel: 5, estimatedHours: 10 }
      ]
    };

    return moduleTemplates[level] || moduleTemplates[3];
  };

  const calculateEstimatedDuration = (currentLevel: number, targetLevel: number): number => {
    const baseDuration = 20; // Base hours
    const levelDifference = targetLevel - currentLevel;
    return baseDuration + (levelDifference * 15);
  };

  const generateMilestones = (currentLevel: number, targetLevel: number): any[] => {
    return [
      {
        id: 'milestone-1',
        title: `Master Level ${currentLevel} Skills`,
        description: `Demonstrate consistent proficiency at Bloom Level ${currentLevel}`,
        bloomLevel: currentLevel,
        completionCriteria: ['Complete practice exercises', 'Pass skill assessment'],
        estimatedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week
      },
      {
        id: 'milestone-2',
        title: `Advance to Level ${targetLevel}`,
        description: `Successfully demonstrate Bloom Level ${targetLevel} capabilities`,
        bloomLevel: targetLevel,
        completionCriteria: ['Complete advanced projects', 'Peer code review'],
        estimatedCompletion: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) // 3 weeks
      }
    ];
  };

  // Render based on current state
  const renderContent = () => {
    switch (state) {
      case 'loading':
        return (
          <div className="skillnest-widget">
            <div className="skillnest-widget-header">
              <h1>Skillnest Bloom Assessment</h1>
              <p>Evaluación cognitiva de habilidades técnicas powered by AI</p>
            </div>
            <LoadingSpinner message="Inicializando evaluación Bloom..." />
          </div>
        );
      
      case 'ready':
        return (
          <div className="skillnest-widget">
            <div className="skillnest-widget-header">
              <h1>Skillnest Bloom Assessment</h1>
              <p>Descubre tu nivel cognitivo en {techDomain} en 15 minutos</p>
            </div>
            <AssessmentInterface
              techDomain={techDomain}
              onStart={handleAssessmentStart}
              onProgress={handleProgressUpdate}
              maxQuestions={maxQuestions}
              timeLimit={timeLimit}
              customBranding={customBranding}
            />
          </div>
        );
      
      case 'assessing':
        return (
          <div className="skillnest-widget">
            <div className="skillnest-widget-header">
              <h1>Evaluación en Progreso</h1>
              <p>Analizando tus respuestas con IA avanzada...</p>
            </div>
            <LoadingSpinner message="Procesando evaluación cognitiva..." />
          </div>
        );
      
      case 'completed':
        return results ? (
          <div className="skillnest-widget">
            <ResultsDashboard
              results={results}
              onRestart={handleRestart}
              theme={theme}
            />
          </div>
        ) : null;
      
      case 'error':
        return (
          <div className="skillnest-widget">
            <div className="skillnest-widget-header">
              <h1>Error en la Evaluación</h1>
              <p>Ocurrió un problema durante el proceso</p>
            </div>
            <div className="skillnest-error">
              <h3>Error de Evaluación</h3>
              <p>{error}</p>
              <button 
                className="skillnest-btn skillnest-btn-primary"
                onClick={handleRestart}
                style={{ marginTop: '1rem' }}
              >
                Intentar Nuevamente
              </button>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="skillnest-widget">
            <LoadingSpinner message="Cargando..." />
          </div>
        );
    }
  };

  return renderContent();
};

export default WidgetApp;
