/* eslint-disable react-refresh/only-export-components */

import React, { useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../../types/core';
import { motion } from 'framer-motion';
import { useNeuralSystem } from '../../components/neural/useNeuralSystem';
import { useNeuralPAESData } from '../../hooks/neural/useNeuralPAESData';
import { useNeuralEventCapture } from '../../hooks/neural/useNeuralEventCapture';
import { NeuralMetricsDisplay } from './NeuralMetricsDisplay';
import { NeuralPAESCard } from './NeuralPAESCard';
import { NeuralNavigationWidget } from './NeuralNavigationWidget';
import { NeuralRecommendationsPanel } from './NeuralRecommendationsPanel';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Brain, Activity } from 'lucide-react';

interface PAESSubjectNeural {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<unknown>;
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

  // Usar hook personalizado para datos PAES neurales
  const { neuralDimensions, paesSubjects, overallNeuralScore } = useNeuralPAESData(state.metrics);

  // Usar hook personalizado para captura de eventos neurales
  useNeuralEventCapture({
    isInitialized: state.isInitialized,
    actions,
    subjectsCount: paesSubjects.length,
    overallScore: overallNeuralScore
  });

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


