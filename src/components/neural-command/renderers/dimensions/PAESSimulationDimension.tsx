
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useOptimizedRealNeuralMetrics } from '@/hooks/useOptimizedRealNeuralMetrics';
import { useRealExamDiagnostics } from '@/hooks/useRealExamDiagnostics';

export const PAESSimulationDimension: React.FC = () => {
  const { metrics } = useOptimizedRealNeuralMetrics();
  const { availableExams, generateDiagnosticFromExam, loading } = useRealExamDiagnostics();
  
  const paesAccuracy = metrics?.paes_simulation_accuracy || 75;
  const predictionAccuracy = metrics?.prediction_accuracy || 75;

  const handleStartSimulation = (examCode: string) => {
    console.log('🎭 Iniciando simulación PAES:', examCode);
    generateDiagnosticFromExam(examCode);
  };

  const handleFullSimulation = () => {
    console.log('🚀 Iniciando simulación completa PAES');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div
          animate={{ 
            rotateY: [0, 360],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="text-center"
        >
          <div className="mx-auto w-32 h-32 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-4xl mb-4">
            🎭
          </div>
          <h2 className="text-4xl font-bold text-white">Simulación PAES Avanzada</h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mt-2">
            Simulador con IA evaluadora y predicción de puntajes en condiciones reales
          </p>
        </motion.div>

        {/* Métricas de Simulación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="text-red-400 font-bold text-xl mb-2">🎯 Precisión PAES</h3>
            <div className="text-3xl font-bold text-white mb-2">{Math.round(paesAccuracy)}%</div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${paesAccuracy}%` }}
              />
            </div>
            <div className="text-white/70 text-sm mt-2">Basado en tus últimas simulaciones</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="text-orange-400 font-bold text-xl mb-2">🔮 Predicción IA</h3>
            <div className="text-3xl font-bold text-white mb-2">{Math.round(predictionAccuracy)}%</div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${predictionAccuracy}%` }}
              />
            </div>
            <div className="text-white/70 text-sm mt-2">Exactitud de predicciones</div>
          </div>
        </div>

        {/* Simulación Completa */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-red-900/80 to-orange-900/80 rounded-lg p-8 backdrop-blur-xl border border-red-500/30"
        >
          <div className="text-center space-y-4">
            <div className="text-4xl">🚀</div>
            <h3 className="text-white font-bold text-2xl">Simulación PAES Completa</h3>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Experimenta la PAES real con nuestro simulador IA que replica exactamente las condiciones del examen oficial.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl mb-2">🤖</div>
                <div className="text-white font-bold">IA Evaluadora</div>
                <div className="text-white/70 text-sm">Análisis en tiempo real</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-white font-bold">Predicción Exacta</div>
                <div className="text-white/70 text-sm">Puntaje proyectado</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-white font-bold">Feedback Inmediato</div>
                <div className="text-white/70 text-sm">Mejora continua</div>
              </div>
            </div>

            <Button 
              onClick={handleFullSimulation}
              className="bg-red-600 hover:bg-red-500 text-white px-12 py-4 text-lg font-bold"
            >
              🎭 Comenzar Simulación Completa
            </Button>
          </div>
        </motion.div>

        {/* Exámenes Disponibles */}
        <div>
          <h3 className="text-white font-bold text-2xl mb-4">📋 Simulaciones por Área</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableExams.map((exam, index) => (
              <motion.div
                key={exam.examCode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20"
              >
                <div className="mb-3">
                  <h4 className="text-white font-bold">{exam.title}</h4>
                  <p className="text-white/70 text-sm">{exam.description}</p>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Preguntas:</span>
                    <span className="text-white">{exam.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Año:</span>
                    <span className="text-white">{exam.year}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Estado:</span>
                    <span className={`${exam.status === 'available' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {exam.status === 'available' ? '✅ Disponible' : '⏳ Preparando'}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => handleStartSimulation(exam.examCode)}
                  disabled={loading || exam.status !== 'available'}
                  className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50"
                >
                  {loading ? 'Preparando...' : 'Iniciar Simulación'}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Características del Simulador */}
        <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
          <h3 className="text-white font-bold text-xl mb-4">✨ Características del Simulador</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-red-400 font-bold mb-3">🎯 Precisión Extrema</h4>
              <ul className="space-y-2 text-white/80">
                <li>• Preguntas de exámenes oficiales reales</li>
                <li>• Tiempo exacto de la PAES oficial</li>
                <li>• Condiciones de examen auténticas</li>
                <li>• Interfaz idéntica al sistema oficial</li>
              </ul>
            </div>
            <div>
              <h4 className="text-orange-400 font-bold mb-3">🤖 Inteligencia Artificial</h4>
              <ul className="space-y-2 text-white/80">
                <li>• Análisis de patrones de respuesta</li>
                <li>• Predicción de puntaje final</li>
                <li>• Identificación de fortalezas/debilidades</li>
                <li>• Recomendaciones personalizadas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
