/* eslint-disable react-refresh/only-export-components */

import React, { useEffect, useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { useOptimizedRealNeuralMetrics } from '../../../../hooks/useOptimizedRealNeuralMetrics';
import { useRealProgressData } from '../../../../hooks/useRealProgressData';
import { useAuth } from '../../../../hooks/useAuth';

interface AIFeedback {
  type: 'strength' | 'improvement' | 'recommendation' | 'warning';
  title: string;
  message: string;
  actionable: boolean;
  priority: 'high' | 'medium' | 'low';
}

export const PersonalizedFeedbackDimension: React.FC = () => {
  const { user } = useAuth();
  const { metrics } = useOptimizedRealNeuralMetrics();
  const { metrics: progressMetrics } = useRealProgressData();
  
  const [feedback, setFeedback] = useState<AIFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const learningVelocity = metrics?.learning_velocity || 70;
  const neuralEfficiency = metrics?.neural_efficiency || 65;
  const adaptiveIntelligence = metrics?.adaptive_intelligence || 62;

  useEffect(() => {
    const generatePersonalizedFeedback = () => {
      if (!progressMetrics || !metrics) return;

      const feedbackList: AIFeedback[] = [];

      // AnÃ¡lisis de rendimiento
      if (progressMetrics.learningVelocity > 80) {
        feedbackList.push({
          type: 'strength',
          title: 'ðŸš€ Velocidad de Aprendizaje Excepcional',
          message: `Tu velocidad de aprendizaje de ${progressMetrics.learningVelocity}% estÃ¡ por encima del promedio. Â¡MantÃ©n este ritmo!`,
          actionable: false,
          priority: 'medium'
        });
      } else if (progressMetrics.learningVelocity < 50) {
        feedbackList.push({
          type: 'improvement',
          title: 'âš¡ Oportunidad de Acelerar',
          message: 'Tu velocidad de aprendizaje puede mejorar. Te sugiero sesiones de estudio mÃ¡s frecuentes pero mÃ¡s cortas.',
          actionable: true,
          priority: 'high'
        });
      }

      // AnÃ¡lisis de retenciÃ³n
      if (progressMetrics.retentionRate < 60) {
        feedbackList.push({
          type: 'warning',
          title: 'ðŸ§  Mejora la RetenciÃ³n',
          message: 'Tu tasa de retenciÃ³n es baja. Implementa tÃ©cnicas de repaso espaciado y mapas conceptuales.',
          actionable: true,
          priority: 'high'
        });
      }

      // AnÃ¡lisis de racha
      if (progressMetrics.streakDays > 7) {
        feedbackList.push({
          type: 'strength',
          title: 'ðŸ”¥ Racha Impresionante',
          message: `Â¡${progressMetrics.streakDays} dÃ­as consecutivos! Tu consistencia es tu mayor fortaleza.`,
          actionable: false,
          priority: 'medium'
        });
      } else if (progressMetrics.streakDays === 0) {
        feedbackList.push({
          type: 'recommendation',
          title: 'ðŸ“… Construye una Rutina',
          message: 'Establecer una rutina diaria de estudio, aunque sea de 15 minutos, mejorarÃ¡ significativamente tu progreso.',
          actionable: true,
          priority: 'high'
        });
      }

      // AnÃ¡lisis por materias
      const subjectProgress = progressMetrics.subjectProgress || {};
      const weakestSubject = Object.entries(subjectProgress).reduce((min, [subject, progress]) => 
        progress < min[1] ? [subject, progress] : min, ['', 100]
      );

      if (weakestSubject[1] < 40) {
        feedbackList.push({
          type: 'improvement',
          title: `ðŸ“š Refuerza ${weakestSubject[0]}`,
          message: `${weakestSubject[0]} necesita atenciÃ³n especial. Dedica 30% mÃ¡s de tiempo a esta Ã¡rea.`,
          actionable: true,
          priority: 'high'
        });
      }

      // AnÃ¡lisis neural
      if (neuralEfficiency > 85) {
        feedbackList.push({
          type: 'strength',
          title: 'ðŸ§¬ Eficiencia Neural Ã“ptima',
          message: 'Tu cerebro estÃ¡ operando a mÃ¡xima eficiencia. Es el momento perfecto para abordar contenidos avanzados.',
          actionable: true,
          priority: 'medium'
        });
      }

      // Recomendaciones generales
      if (progressMetrics.cognitiveLoad > 70) {
        feedbackList.push({
          type: 'warning',
          title: 'ðŸŽ¯ Reduce la Carga Cognitiva',
          message: 'EstÃ¡s saturado. Toma un descanso de 15 minutos cada hora y practica mindfulness.',
          actionable: true,
          priority: 'high'
        });
      }

      // Motivacional
      if (progressMetrics.overallProgress > 50) {
        feedbackList.push({
          type: 'strength',
          title: 'ðŸŽ¯ EstÃ¡s en el Camino Correcto',
          message: `Con ${progressMetrics.overallProgress}% de progreso general, estÃ¡s superando expectativas. Â¡Sigue asÃ­!`,
          actionable: false,
          priority: 'low'
        });
      }

      setFeedback(feedbackList.slice(0, 6)); // Limitar a 6 insights
      setIsLoading(false);
    };

    generatePersonalizedFeedback();
  }, [progressMetrics, metrics, neuralEfficiency]);

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case 'strength': return 'ðŸ’ª';
      case 'improvement': return 'ðŸ“ˆ';
      case 'recommendation': return 'ðŸ’¡';
      case 'warning': return 'âš ï¸';
      default: return 'ðŸ¤–';
    }
  };

  const getFeedbackColor = (type: string) => {
    switch (type) {
      case 'strength': return 'from-green-500 to-emerald-500';
      case 'improvement': return 'from-blue-500 to-cyan-500';
      case 'recommendation': return 'from-purple-500 to-pink-500';
      case 'warning': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Analizando tu progreso...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-center"
        >
          <div className="mx-auto w-32 h-32 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-4xl mb-4">
            ðŸ¤–
          </div>
          <h2 className="text-4xl font-bold text-white">Coach IA Personal</h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mt-2">
            Tu entrenador personal que analiza tu progreso y optimiza tu aprendizaje
          </p>
        </motion.div>

        {/* MÃ©tricas del Coach */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="text-cyan-400 font-bold text-xl mb-2">âš¡ Velocidad</h3>
            <div className="text-3xl font-bold text-white mb-2">{Math.round(learningVelocity)}%</div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-cyan-500 h-2 rounded-full transition-all duration-1000"
                className="dynamic-progress-fill" data-progress={learningVelocity}
              />
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="text-blue-400 font-bold text-xl mb-2">ðŸ§  Eficiencia</h3>
            <div className="text-3xl font-bold text-white mb-2">{Math.round(neuralEfficiency)}%</div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                className="dynamic-progress-fill" data-progress={neuralEfficiency}
              />
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="text-indigo-400 font-bold text-xl mb-2">ðŸŽ¯ Adaptabilidad</h3>
            <div className="text-3xl font-bold text-white mb-2">{Math.round(adaptiveIntelligence)}%</div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-indigo-500 h-2 rounded-full transition-all duration-1000"
                className="dynamic-progress-fill" data-progress={adaptiveIntelligence}
              />
            </div>
          </div>
        </div>

        {/* Feedback Personalizado */}
        <div>
          <h3 className="text-white font-bold text-2xl mb-4">ðŸŽ¯ Insights Personalizados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedback.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-lg p-4 backdrop-blur-sm bg-gradient-to-r ${getFeedbackColor(item.type)}/20 border border-white/20`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{getFeedbackIcon(item.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-bold">{item.title}</h4>
                      {item.priority === 'high' && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                          Urgente
                        </span>
                      )}
                    </div>
                    <p className="text-white/80 text-sm mb-3">{item.message}</p>
                    {item.actionable && (
                      <div className="text-cyan-400 text-xs">
                        âš¡ AcciÃ³n recomendada
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mensaje Motivacional del Coach */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-cyan-900/60 to-blue-900/60 rounded-lg p-6 backdrop-blur-xl text-center"
        >
          <h3 className="text-white font-bold text-xl mb-4">ðŸ’¬ Mensaje del Coach IA</h3>
          <p className="text-white/90 text-lg leading-relaxed">
            "Â¡Hola {user?.email?.split('@')[0] || 'Estudiante'}! 
            {progressMetrics && progressMetrics.streakDays > 0 
              ? ` Tu consistencia de ${progressMetrics.streakDays} dÃ­as es impresionante.` 
              : ' Es momento de establecer una rutina de estudio consistente.'
            }
            {progressMetrics && progressMetrics.learningVelocity > 70 
              ? ' Tu velocidad de aprendizaje estÃ¡ por encima del promedio. Â¡Sigue asÃ­!' 
              : ' PequeÃ±os pasos diarios te llevarÃ¡n a grandes logros.'
            } 
            Recuerda: cada ejercicio completado te acerca mÃ¡s a tu meta PAES. Â¡Estoy aquÃ­ para guiarte! ðŸš€"
          </p>
        </motion.div>

        {/* Progreso Semanal */}
        {progressMetrics && (
          <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-white font-bold text-xl mb-4">ðŸ“Š Resumen Semanal</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">{progressMetrics.totalSessions}</div>
                <div className="text-white/70 text-sm">Sesiones</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{progressMetrics.totalStudyTime}h</div>
                <div className="text-white/70 text-sm">Tiempo Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-400">{progressMetrics.completedNodes}</div>
                <div className="text-white/70 text-sm">Nodos Completados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{Math.round(progressMetrics.retentionRate)}%</div>
                <div className="text-white/70 text-sm">RetenciÃ³n</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};


