
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useOptimizedRealNeuralMetrics } from '@/hooks/useOptimizedRealNeuralMetrics';
import { useRealProgressData } from '@/hooks/useRealProgressData';
import { useRealDiagnosticData } from '@/hooks/useRealDiagnosticData';

interface CareerPrediction {
  name: string;
  compatibility: number;
  requiredScore: number;
  university: string;
  probability: number;
  reasons: string[];
}

export const VocationalPredictionDimension: React.FC = () => {
  const { metrics } = useOptimizedRealNeuralMetrics();
  const { metrics: progressMetrics } = useRealProgressData();
  const { metrics: diagnosticMetrics } = useRealDiagnosticData();
  
  const [predictions, setPredictions] = useState<CareerPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const vocationalAlignment = metrics?.vocational_alignment || 58;
  const analyticalPrecision = metrics?.analytical_precision || 75;
  const creativeSynthesis = metrics?.creative_synthesis || 65;

  useEffect(() => {
    const generatePredictions = () => {
      if (!progressMetrics || !diagnosticMetrics) return;

      // Análisis basado en métricas reales
      const mathStrength = progressMetrics.subjectProgress?.MATEMATICA_1 || 0;
      const scienceStrength = progressMetrics.subjectProgress?.CIENCIAS || 0;
      const readingStrength = progressMetrics.subjectProgress?.COMPETENCIA_LECTORA || 0;
      const overallPerformance = progressMetrics.overallProgress || 0;

      const basePredictions: CareerPrediction[] = [
        {
          name: 'Ingeniería Civil',
          compatibility: Math.min(95, mathStrength * 0.4 + analyticalPrecision * 0.4 + overallPerformance * 0.2),
          requiredScore: 650,
          university: 'Universidad de Chile',
          probability: Math.min(90, (mathStrength + analyticalPrecision) / 2),
          reasons: ['Alta capacidad matemática', 'Pensamiento analítico desarrollado', 'Resolución de problemas complejos']
        },
        {
          name: 'Medicina',
          compatibility: Math.min(95, scienceStrength * 0.5 + analyticalPrecision * 0.3 + overallPerformance * 0.2),
          requiredScore: 720,
          university: 'Pontificia Universidad Católica',
          probability: Math.min(85, (scienceStrength + analyticalPrecision + readingStrength) / 3),
          reasons: ['Fuerte base científica', 'Comprensión lectora avanzada', 'Dedicación al estudio']
        },
        {
          name: 'Psicología',
          compatibility: Math.min(95, readingStrength * 0.4 + creativeSynthesis * 0.3 + vocationalAlignment * 0.3),
          requiredScore: 580,
          university: 'Universidad de Santiago',
          probability: Math.min(88, (readingStrength + creativeSynthesis) / 2),
          reasons: ['Excelente comprensión lectora', 'Creatividad y síntesis', 'Habilidades interpersonales']
        },
        {
          name: 'Administración y Economía',
          compatibility: Math.min(95, mathStrength * 0.3 + analyticalPrecision * 0.4 + overallPerformance * 0.3),
          requiredScore: 600,
          university: 'Universidad Adolfo Ibáñez',
          probability: Math.min(82, (mathStrength + analyticalPrecision + overallPerformance) / 3),
          reasons: ['Capacidad analítica', 'Pensamiento estratégico', 'Rendimiento consistente']
        },
        {
          name: 'Periodismo',
          compatibility: Math.min(95, readingStrength * 0.5 + creativeSynthesis * 0.4 + vocationalAlignment * 0.1),
          requiredScore: 550,
          university: 'Universidad Católica',
          probability: Math.min(90, readingStrength * 1.1),
          reasons: ['Comprensión lectora excepcional', 'Creatividad narrativa', 'Análisis crítico']
        }
      ];

      // Ordenar por compatibilidad
      const sortedPredictions = basePredictions
        .sort((a, b) => b.compatibility - a.compatibility)
        .slice(0, 4);

      setPredictions(sortedPredictions);
      setIsLoading(false);
    };

    generatePredictions();
  }, [progressMetrics, diagnosticMetrics, vocationalAlignment, analyticalPrecision, creativeSynthesis]);

  if (isLoading) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Analizando tu perfil vocacional...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div
          animate={{ 
            rotateY: [0, 180, 360],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 6, repeat: Infinity }}
          className="text-center"
        >
          <div className="mx-auto w-32 h-32 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-4xl mb-4">
            🧬
          </div>
          <h2 className="text-4xl font-bold text-white">Predictor Vocacional IA</h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mt-2">
            Descubre tu camino profesional ideal basado en tu rendimiento y habilidades
          </p>
        </motion.div>

        {/* Métricas Vocacionales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="text-indigo-400 font-bold text-xl mb-2">🎯 Alineación Vocacional</h3>
            <div className="text-3xl font-bold text-white mb-2">{Math.round(vocationalAlignment)}%</div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-indigo-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${vocationalAlignment}%` }}
              />
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="text-purple-400 font-bold text-xl mb-2">🔬 Precisión Analítica</h3>
            <div className="text-3xl font-bold text-white mb-2">{Math.round(analyticalPrecision)}%</div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${analyticalPrecision}%` }}
              />
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="text-pink-400 font-bold text-xl mb-2">🎨 Síntesis Creativa</h3>
            <div className="text-3xl font-bold text-white mb-2">{Math.round(creativeSynthesis)}%</div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-pink-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${creativeSynthesis}%` }}
              />
            </div>
          </div>
        </div>

        {/* Predicciones de Carrera */}
        <div>
          <h3 className="text-white font-bold text-2xl mb-4">🚀 Carreras Recomendadas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {predictions.map((prediction, index) => (
              <motion.div
                key={prediction.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white/10 rounded-lg p-6 backdrop-blur-sm border border-white/20"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-white font-bold text-xl">{prediction.name}</h4>
                    <p className="text-white/70">{prediction.university}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-400">
                      {Math.round(prediction.compatibility)}%
                    </div>
                    <div className="text-white/60 text-sm">Compatibilidad</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/70">Puntaje Requerido:</span>
                    <span className="text-white font-bold">{prediction.requiredScore}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-white/70">Probabilidad de Ingreso:</span>
                    <span className="text-green-400 font-bold">{Math.round(prediction.probability)}%</span>
                  </div>

                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${prediction.compatibility}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-white/70 text-sm mb-2">Fortalezas identificadas:</div>
                  <div className="space-y-1">
                    {prediction.reasons.map((reason, i) => (
                      <div key={i} className="text-white/80 text-sm flex items-center">
                        <span className="text-green-400 mr-2">✓</span>
                        {reason}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recomendaciones de Mejora */}
        <div className="bg-gradient-to-r from-indigo-900/60 to-purple-900/60 rounded-lg p-6 backdrop-blur-xl">
          <h3 className="text-white font-bold text-xl mb-4">💡 Recomendaciones Personalizadas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-purple-400 font-bold mb-2">📈 Para Mejorar tus Chances</h4>
              <ul className="space-y-2 text-white/80">
                <li>• Enfócate en matemáticas para carreras STEM</li>
                <li>• Desarrolla comprensión lectora para humanidades</li>
                <li>• Practica ciencias para carreras de salud</li>
                <li>• Mantén consistencia en todas las áreas</li>
              </ul>
            </div>
            <div>
              <h4 className="text-pink-400 font-bold mb-2">🎯 Próximos Pasos</h4>
              <ul className="space-y-2 text-white/80">
                <li>• Toma simulacros PAES específicos</li>
                <li>• Explora universidades y programas</li>
                <li>• Conecta con profesionales del área</li>
                <li>• Considera becas y financiamiento</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
