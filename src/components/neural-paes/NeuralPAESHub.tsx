
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNeuralSystem } from '@/components/neural/NeuralSystemProvider';
import { NeuralMetricsDisplay } from './NeuralMetricsDisplay';
import { NeuralPAESCard } from './NeuralPAESCard';
import { NeuralNavigationWidget } from './NeuralNavigationWidget';
import { NeuralRecommendationsPanel } from './NeuralRecommendationsPanel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Activity, BookOpen, Calculator, FlaskConical, Scroll } from 'lucide-react';

interface NeuralDimension {
  id: string;
  name: string;
  value: number;
  status: 'optimal' | 'warning' | 'critical';
  description: string;
}

interface PAESSubjectNeural {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  progress: number;
  color: string;
  projectedScore: number;
  neuralMetrics: {
    engagement: number;
    coherence: number;
    efficiency: number;
    adaptability: number;
  };
  route: string;
}

export const NeuralPAESHub: React.FC = () => {
  const { state, actions } = useNeuralSystem();
  const [activeSubject, setActiveSubject] = useState<PAESSubjectNeural | null>(null);

  // Dimensiones neurales del sistema
  const neuralDimensions: NeuralDimension[] = [
    {
      id: 'engagement',
      name: 'Engagement Neural',
      value: state.metrics.real_time_engagement,
      status: state.metrics.real_time_engagement > 70 ? 'optimal' : 'warning',
      description: 'Nivel de compromiso cognitivo'
    },
    {
      id: 'coherence',
      name: 'Coherencia Neural',
      value: state.metrics.neural_coherence,
      status: state.metrics.neural_coherence > 80 ? 'optimal' : 'critical',
      description: 'Sincronización de procesos'
    },
    {
      id: 'learning_effectiveness',
      name: 'Efectividad Aprendizaje',
      value: state.metrics.learning_effectiveness,
      status: state.metrics.learning_effectiveness > 75 ? 'optimal' : 'warning',
      description: 'Eficiencia del aprendizaje'
    },
    {
      id: 'session_quality',
      name: 'Calidad Sesión',
      value: state.metrics.session_quality,
      status: state.metrics.session_quality > 70 ? 'optimal' : 'warning',
      description: 'Calidad de la sesión actual'
    },
    {
      id: 'user_satisfaction',
      name: 'Satisfacción Usuario',
      value: state.metrics.user_satisfaction_index,
      status: state.metrics.user_satisfaction_index > 80 ? 'optimal' : 'critical',
      description: 'Índice de satisfacción'
    },
    {
      id: 'adaptive_intelligence',
      name: 'IA Adaptativa',
      value: state.metrics.adaptive_intelligence_score,
      status: state.metrics.adaptive_intelligence_score > 85 ? 'optimal' : 'warning',
      description: 'Puntuación de inteligencia adaptativa'
    }
  ];

  // Sujetos PAES con métricas neurales
  const paesSubjects: PAESSubjectNeural[] = [
    {
      id: 'competencia-lectora',
      name: 'Competencia Lectora',
      description: 'Comprensión y análisis textual',
      icon: BookOpen,
      progress: 75,
      color: 'from-blue-500 to-blue-600',
      projectedScore: 670,
      neuralMetrics: {
        engagement: Math.round(state.metrics.real_time_engagement * 0.9),
        coherence: Math.round(state.metrics.neural_coherence * 0.85),
        efficiency: Math.round(state.metrics.learning_effectiveness * 0.8),
        adaptability: Math.round(state.metrics.adaptive_intelligence_score * 0.7)
      },
      route: '/lectoguia'
    },
    {
      id: 'matematica-m1',
      name: 'Matemática M1',
      description: '7° básico a 2° medio',
      icon: Calculator,
      progress: 68,
      color: 'from-green-500 to-green-600',
      projectedScore: 645,
      neuralMetrics: {
        engagement: Math.round(state.metrics.real_time_engagement * 0.8),
        coherence: Math.round(state.metrics.neural_coherence * 0.9),
        efficiency: Math.round(state.metrics.learning_effectiveness * 0.7),
        adaptability: Math.round(state.metrics.adaptive_intelligence_score * 0.8)
      },
      route: '/mathematics'
    },
    {
      id: 'matematica-m2',
      name: 'Matemática M2',
      description: '3° y 4° medio',
      icon: Calculator,
      progress: 58,
      color: 'from-emerald-500 to-emerald-600',
      projectedScore: 590,
      neuralMetrics: {
        engagement: Math.round(state.metrics.real_time_engagement * 0.7),
        coherence: Math.round(state.metrics.neural_coherence * 0.8),
        efficiency: Math.round(state.metrics.learning_effectiveness * 0.6),
        adaptability: Math.round(state.metrics.adaptive_intelligence_score * 0.9)
      },
      route: '/mathematics'
    },
    {
      id: 'ciencias',
      name: 'Ciencias',
      description: 'Física, Química y Biología',
      icon: FlaskConical,
      progress: 72,
      color: 'from-purple-500 to-purple-600',
      projectedScore: 680,
      neuralMetrics: {
        engagement: Math.round(state.metrics.real_time_engagement * 0.85),
        coherence: Math.round(state.metrics.neural_coherence * 0.7),
        efficiency: Math.round(state.metrics.learning_effectiveness * 0.9),
        adaptability: Math.round(state.metrics.adaptive_intelligence_score * 0.75)
      },
      route: '/sciences'
    },
    {
      id: 'historia',
      name: 'Historia y C. Sociales',
      description: 'Pensamiento crítico e histórico',
      icon: Scroll,
      progress: 63,
      color: 'from-amber-500 to-amber-600',
      projectedScore: 620,
      neuralMetrics: {
        engagement: Math.round(state.metrics.real_time_engagement * 0.75),
        coherence: Math.round(state.metrics.neural_coherence * 0.85),
        efficiency: Math.round(state.metrics.learning_effectiveness * 0.75),
        adaptability: Math.round(state.metrics.adaptive_intelligence_score * 0.8)
      },
      route: '/history'
    }
  ];

  // Calcular puntuación neural global
  const overallNeuralScore = Math.round(
    neuralDimensions.reduce((sum, dim) => sum + dim.value, 0) / neuralDimensions.length
  );

  // Capturar eventos neurales
  useEffect(() => {
    if (state.isInitialized) {
      actions.captureEvent({
        type: 'neural_paes_hub_load',
        data: {
          subjects_count: paesSubjects.length,
          overall_score: overallNeuralScore,
          timestamp: Date.now()
        }
      });
    }
  }, [state.isInitialized, actions, overallNeuralScore]);

  const handleSubjectNavigation = (subject: PAESSubjectNeural) => {
    setActiveSubject(subject);
    actions.captureEvent({
      type: 'neural_subject_selection',
      data: {
        subject_id: subject.id,
        neural_metrics: subject.neuralMetrics,
        timestamp: Date.now()
      }
    });
  };

  if (!state.isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white space-y-4">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto animate-spin" />
          <div className="text-xl font-bold">Inicializando Sistema Neural</div>
          <div className="text-sm text-cyan-200">Conectando telemetría PAES...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      <ScrollArea className="h-full w-full">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Neural */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                <Brain className="w-8 h-8 text-cyan-400" />
                Hub PAES Neural 2025
              </h1>
              <p className="text-white/70 text-lg mb-4">
                Sistema Neural Integrado con Telemetría en Tiempo Real
              </p>
              
              {/* Estado Neural Global */}
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full">
                  <Activity className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-medium">Sistema Neural Activo</span>
                </div>
                <div className="text-cyan-400 font-bold text-lg">
                  Puntuación Global: {overallNeuralScore}%
                </div>
              </div>
            </motion.div>

            {/* Métricas Neurales Principales */}
            <div className="mb-8">
              <NeuralMetricsDisplay 
                dimensions={neuralDimensions}
                overallScore={overallNeuralScore}
              />
            </div>

            {/* Grid de Sujetos PAES Neurales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paesSubjects.map((subject, index) => (
                <NeuralPAESCard
                  key={subject.id}
                  subject={subject}
                  index={index}
                  onSelect={handleSubjectNavigation}
                  neuralState={state}
                />
              ))}
            </div>

            {/* Panel de Navegación y Recomendaciones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
              <NeuralNavigationWidget
                subjects={paesSubjects}
                onNavigate={handleSubjectNavigation}
              />
              
              <NeuralRecommendationsPanel
                neuralMetrics={neuralDimensions}
                subjects={paesSubjects}
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
