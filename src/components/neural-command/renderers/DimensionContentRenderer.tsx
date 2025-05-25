
import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { NeuralDimension, NeuralDimensionConfig } from '../config/neuralTypes';
import { CinematicSkeletonOptimized } from '@/components/unified-dashboard/CinematicSkeletonOptimized';

// Lazy loading de componentes para optimización
const EducationalUniverse = React.lazy(() => import('@/components/universe/EducationalUniverse').then(module => ({
  default: module.EducationalUniverse
})));

const HolographicDashboard = React.lazy(() => import('@/components/intelligent-dashboard/HolographicDashboard').then(module => ({
  default: module.HolographicDashboard
})));

const LectoGuiaUnifiedCinematic = React.lazy(() => import('@/components/lectoguia/LectoGuiaUnifiedCinematic').then(module => ({
  default: module.LectoGuiaUnifiedCinematic
})));

const DiagnosticControllerCinematic = React.lazy(() => import('@/components/diagnostic/DiagnosticControllerCinematic').then(module => ({
  default: module.DiagnosticControllerCinematic
})));

const PAESFinancialCalculator = React.lazy(() => import('@/components/financial/PAESFinancialCalculator').then(module => ({
  default: module.PAESFinancialCalculator
})));

const StudyCalendarIntegration = React.lazy(() => import('@/components/calendar/StudyCalendarIntegration').then(module => ({
  default: module.StudyCalendarIntegration
})));

interface DimensionContentRendererProps {
  activeDimension: NeuralDimension;
  activeDimensionData?: NeuralDimensionConfig;
}

export const DimensionContentRenderer: React.FC<DimensionContentRendererProps> = ({
  activeDimension,
  activeDimensionData
}) => {
  const renderDimensionContent = () => {
    switch (activeDimension) {
      // Centro Neural
      case 'neural_command':
        return (
          <Suspense fallback={<CinematicSkeletonOptimized variant="dashboard" />}>
            <HolographicDashboard 
              metrics={{
                totalNodes: 277,
                completedNodes: 89,
                averagePerformance: 87,
                learningVelocity: 0.85,
                predictionAccuracy: 92,
                totalStudyTime: 3240,
                nodesCompleted: 89
              }} 
              patterns={{}} 
            />
          </Suspense>
        );

      // Universe 3D (Navegación Principal)
      case 'educational_universe':
      case 'universe_exploration': // Backwards compatibility
      case 'paes_universe': // Backwards compatibility
        return (
          <Suspense fallback={<CinematicSkeletonOptimized variant="universe" />}>
            <EducationalUniverse 
              initialMode="overview"
              activeSubject="COMPETENCIA_LECTORA"
            />
          </Suspense>
        );

      // SuperPAES Coordinador
      case 'superpaes_coordinator':
      case 'intelligence_hub': // Backwards compatibility
        return (
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  SuperPAES Coordinador IA
                </h2>
                <p className="text-white/70 text-lg">
                  Sistema de predicción vocacional y análisis de competencias avanzado
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Análisis Vocacional */}
                <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-xl border border-yellow-500/30 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-yellow-400 mb-3">Predicción Vocacional</h3>
                  <p className="text-white/70 text-sm">Análisis predictivo basado en tu progreso en tiempo real</p>
                </div>
                
                {/* Análisis de Competencias */}
                <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-xl border border-orange-500/30 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-orange-400 mb-3">Competencias 3D</h3>
                  <p className="text-white/70 text-sm">Visualización tridimensional de fortalezas y áreas de mejora</p>
                </div>
                
                {/* Recomendaciones Inteligentes */}
                <div className="bg-gradient-to-br from-red-600/20 to-pink-600/20 backdrop-blur-xl border border-red-500/30 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-red-400 mb-3">IA Recomendaciones</h3>
                  <p className="text-white/70 text-sm">Sugerencias personalizadas para optimizar tu plan de estudio</p>
                </div>
              </div>
            </motion.div>
          </div>
        );

      // Entrenamiento Neural
      case 'neural_training':
        return (
          <Suspense fallback={<CinematicSkeletonOptimized variant="training" />}>
            <LectoGuiaUnifiedCinematic
              initialSubject="COMPETENCIA_LECTORA"
              onSubjectChange={() => {}}
              onNavigateToTool={() => {}}
            />
          </Suspense>
        );

      // Análisis de Progreso / Diagnóstico
      case 'progress_analysis':
      case 'matrix_diagnostics': // Backwards compatibility
        return (
          <Suspense fallback={<CinematicSkeletonOptimized variant="diagnostic" />}>
            <DiagnosticControllerCinematic
              onNavigateToTool={() => {}}
            />
          </Suspense>
        );

      // Simulación PAES Real
      case 'paes_simulation':
        return (
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  Simulación PAES Real
                </h2>
                <p className="text-white/70 text-lg">
                  Ambiente de examen oficial con tracking de progreso en tiempo real
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-red-600/20 to-orange-600/20 backdrop-blur-xl border border-red-500/30 rounded-lg p-8">
                <h3 className="text-xl font-bold text-red-400 mb-4">🎯 Simulacro Oficial PAES</h3>
                <p className="text-white/70 mb-6">
                  Experimenta las condiciones reales del examen PAES con preguntas oficiales de Supabase,
                  cronómetro oficial y análisis detallado de desempeño.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-white/60">📊 Métricas en Tiempo Real</div>
                    <div className="text-sm text-white/60">⏱️ Cronómetro Oficial</div>
                    <div className="text-sm text-white/60">📈 Tracking de Progreso</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-white/60">🎯 Preguntas Reales</div>
                    <div className="text-sm text-white/60">🧠 Análisis Inteligente</div>
                    <div className="text-sm text-white/60">💪 Feedback Personalizado</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        );

      // Feedback Personalizado
      case 'personalized_feedback':
      case 'holographic_analytics': // Backwards compatibility
        return (
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Feedback Personalizado IA
                </h2>
                <p className="text-white/70 text-lg">
                  Análisis inteligente basado en tus metas personales y plan de estudio
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-xl border border-green-500/30 rounded-lg p-8">
                <h3 className="text-xl font-bold text-green-400 mb-4">🧠 Análisis Inteligente Personalizado</h3>
                <p className="text-white/70 mb-6">
                  Recibe feedback detallado y recomendaciones adaptativas basadas en tu desempeño,
                  metas vocacionales y progreso en el plan de estudio.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center space-y-2">
                    <div className="text-2xl">📊</div>
                    <div className="text-sm font-medium text-green-400">Análisis de Desempeño</div>
                    <div className="text-xs text-white/60">Conectado a nodos de aprendizaje</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-2xl">🎯</div>
                    <div className="text-sm font-medium text-green-400">Recomendaciones Adaptativas</div>
                    <div className="text-xs text-white/60">Basadas en metas personales</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-2xl">⚡</div>
                    <div className="text-sm font-medium text-green-400">Ajustes Automáticos</div>
                    <div className="text-xs text-white/60">Plan de estudio dinámico</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        );

      // Modo Batalla (Gamificación)
      case 'battle_mode':
        return (
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Modo Batalla PAES
                </h2>
                <p className="text-white/70 text-lg">
                  Competencia gamificada con logros reales y progresión visible
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-pink-600/20 to-purple-600/20 backdrop-blur-xl border border-pink-500/30 rounded-lg p-8">
                <h3 className="text-xl font-bold text-pink-400 mb-4">⚔️ Arena de Combate Académico</h3>
                <p className="text-white/70 mb-6">
                  Participa en desafíos competitivos, gana logros reales y avanza en rankings
                  basados en tu desempeño real en ejercicios PAES.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-pink-400">🏆</span>
                      <span className="text-white font-medium">Torneos Semanales</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-pink-400">⭐</span>
                      <span className="text-white font-medium">Sistema de Rankings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-pink-400">🎯</span>
                      <span className="text-white font-medium">Duelos 1v1</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400">💎</span>
                      <span className="text-white font-medium">Logros Especiales</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400">🔥</span>
                      <span className="text-white font-medium">Rachas de Victoria</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400">🌟</span>
                      <span className="text-white font-medium">Recompensas Premium</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        );

      // Centro Financiero
      case 'financial_center':
        return (
          <Suspense fallback={<CinematicSkeletonOptimized variant="financial" />}>
            <PAESFinancialCalculator />
          </Suspense>
        );

      // Calendario
      case 'calendar_management':
        return (
          <Suspense fallback={<CinematicSkeletonOptimized variant="calendar" />}>
            <StudyCalendarIntegration />
          </Suspense>
        );

      // Sistema de Logros
      case 'achievement_system':
        return (
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  Sistema de Logros
                </h2>
                <p className="text-white/70 text-lg">
                  Progresión visible conectada al Universe 3D con logros reales
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 backdrop-blur-xl border border-purple-500/30 rounded-lg p-8">
                <h3 className="text-xl font-bold text-purple-400 mb-4">🏆 Galería de Logros</h3>
                <p className="text-white/70 mb-6">
                  Cada logro desbloqueado se refleja en tu progreso del Universe 3D y
                  contribuye a tu perfil académico integral.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">🌟</div>
                    <div className="text-sm font-medium text-purple-400">Explorador Cósmico</div>
                    <div className="text-xs text-white/60 mt-1">Universe 3D completado</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">🧠</div>
                    <div className="text-sm font-medium text-purple-400">Maestro Neural</div>
                    <div className="text-xs text-white/60 mt-1">IA dominada</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">⚡</div>
                    <div className="text-sm font-medium text-purple-400">SuperPAES Elite</div>
                    <div className="text-xs text-white/60 mt-1">Coordinador maximizado</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        );

      // Predicción Vocacional
      case 'vocational_prediction':
        return (
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Predicción Vocacional IA
                </h2>
                <p className="text-white/70 text-lg">
                  Análisis predictivo integrado con centro financiero y plan de carrera
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-xl border border-blue-500/30 rounded-lg p-8">
                <h3 className="text-xl font-bold text-blue-400 mb-4">🎯 Análisis Predictivo Avanzado</h3>
                <p className="text-white/70 mb-6">
                  Utilizando tu progreso real en PAES, predecimos las carreras más compatibles
                  con tu perfil académico y te conectamos con el centro financiero para planificar tu futuro.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-blue-400">🔮 Predicciones IA</h4>
                    <div className="space-y-2 text-sm text-white/70">
                      <div>• Compatibilidad vocacional basada en fortalezas</div>
                      <div>• Probabilidades de ingreso por carrera</div>
                      <div>• Análisis de brechas académicas</div>
                      <div>• Recomendaciones de especialización</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-cyan-400">💰 Integración Financiera</h4>
                    <div className="space-y-2 text-sm text-white/70">
                      <div>• Costos estimados por carrera</div>
                      <div>• ROI proyectado post-graduación</div>
                      <div>• Opciones de financiamiento</div>
                      <div>• Planificación económica integral</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        );

      // Control de Sistema
      case 'settings_control':
        return (
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-400 to-slate-400 bg-clip-text text-transparent">
                  Control del Ecosistema Neural
                </h2>
                <p className="text-white/70 text-lg">
                  Configuración avanzada de todos los módulos del sistema
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-600/20 to-slate-600/20 backdrop-blur-xl border border-gray-500/30 rounded-lg p-8">
                <h3 className="text-xl font-bold text-gray-400 mb-4">⚙️ Configuración del Sistema</h3>
                <p className="text-white/70 mb-6">
                  Personaliza la experiencia del ecosistema neural, ajusta preferencias de IA,
                  configura notificaciones y optimiza el rendimiento del sistema.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-400 mb-2">🧠 Configuración Neural</h4>
                    <div className="text-sm text-white/60">Ajustes de IA y algoritmos</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-400 mb-2">🌌 Universe 3D</h4>
                    <div className="text-sm text-white/60">Preferencias de navegación</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-400 mb-2">🎮 Gamificación</h4>
                    <div className="text-sm text-white/60">Niveles de dificultad</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-400 mb-2">🔔 Notificaciones</h4>
                    <div className="text-sm text-white/60">Alertas y recordatorios</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-400 mb-2">📊 Analytics</h4>
                    <div className="text-sm text-white/60">Métricas y reportes</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-400 mb-2">🔐 Privacidad</h4>
                    <div className="text-sm text-white/60">Datos y seguridad</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        );

      default:
        return (
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <h2 className="text-2xl font-bold text-white">
                Dimensión Neural: {activeDimensionData?.name || activeDimension}
              </h2>
              <p className="text-white/70">
                {activeDimensionData?.description || 'Configurando módulo...'}
              </p>
              <div className="bg-white/5 rounded-lg p-8">
                <p className="text-white/60">
                  Este módulo está siendo optimizado para la experiencia neural unificada.
                </p>
              </div>
            </motion.div>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      {renderDimensionContent()}
    </motion.div>
  );
};
