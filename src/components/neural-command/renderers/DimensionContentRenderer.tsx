import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { NeuralDimension, NeuralDimensionConfig } from '../config/neuralTypes';
import { CinematicSkeletonOptimized } from '@/components/unified-dashboard/CinematicSkeletonOptimized';

// Lazy loading de componentes existentes
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

// Lazy loading de las NUEVAS dimensiones avanzadas
const BattleModeInterface = React.lazy(() => import('../dimensions/BattleModeInterface').then(module => ({
  default: module.BattleModeInterface
})));

const AchievementEngine = React.lazy(() => import('../dimensions/AchievementEngine').then(module => ({
  default: module.AchievementEngine
})));

const VocationalAIPredictor = React.lazy(() => import('../dimensions/VocationalAIPredictor').then(module => ({
  default: module.VocationalAIPredictor
})));

const PersonalizedFeedback = React.lazy(() => import('../dimensions/PersonalizedFeedback').then(module => ({
  default: module.PersonalizedFeedback
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

      // Universe 3D
      case 'educational_universe':
        return (
          <Suspense fallback={<CinematicSkeletonOptimized variant="universe" />}>
            <EducationalUniverse 
              initialMode="overview"
              activeSubject="COMPETENCIA_LECTORA"
            />
          </Suspense>
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

      // Análisis de Progreso
      case 'progress_analysis':
        return (
          <Suspense fallback={<CinematicSkeletonOptimized variant="diagnostic" />}>
            <DiagnosticControllerCinematic>
              {(props) => (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Análisis de Progreso</h2>
                  <p className="text-white/70">
                    Sistema de diagnóstico neural activado para análisis completo.
                  </p>
                </div>
              )}
            </DiagnosticControllerCinematic>
          </Suspense>
        );

      // NUEVA: Modo Batalla - Sistema PvP épico
      case 'battle_mode':
        return (
          <Suspense fallback={<CinematicSkeletonOptimized variant="battle" message="Cargando Arena de Batalla..." />}>
            <BattleModeInterface
              onEnterBattle={(arenaId) => console.log('🔥 Entrando a batalla:', arenaId)}
              onSpectate={(arenaId) => console.log('👁️ Observando batalla:', arenaId)}
            />
          </Suspense>
        );

      // NUEVA: Sistema de Logros - Gamificación avanzada
      case 'achievement_system':
        return (
          <Suspense fallback={<CinematicSkeletonOptimized variant="achievements" message="Cargando Sistema de Logros..." />}>
            <AchievementEngine
              onClaimReward={(achievementId) => console.log('🏆 Reclamando recompensa:', achievementId)}
            />
          </Suspense>
        );

      // NUEVA: Predicción Vocacional - IA avanzada
      case 'vocational_prediction':
        return (
          <Suspense fallback={<CinematicSkeletonOptimized variant="ai" message="Cargando Predictor Vocacional IA..." />}>
            <VocationalAIPredictor
              userMetrics={{
                performance: 87,
                strengths: ['mathematics', 'logic', 'analysis'],
                interests: ['technology', 'science', 'innovation']
              }}
            />
          </Suspense>
        );

      // NUEVA: Feedback Personalizado - Coach IA
      case 'personalized_feedback':
        return (
          <Suspense fallback={<CinematicSkeletonOptimized variant="feedback" message="Cargando Coach IA Personal..." />}>
            <PersonalizedFeedback
              userProgress={{
                currentLevel: 23,
                streak: 12,
                performance: 87
              }}
              recentActivities={[]}
            />
          </Suspense>
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

      // Simulación PAES - placeholder mejorado
      case 'paes_simulation':
        return (
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <h2 className="text-3xl font-bold text-white">🎭 Simulación PAES Avanzada</h2>
              <p className="text-white/70 text-lg">
                Simulador con IA evaluadora y predicción de puntajes en desarrollo
              </p>
              <div className="bg-gradient-to-r from-red-900/60 to-orange-900/60 rounded-lg p-8 backdrop-blur-xl">
                <p className="text-white/80 mb-4">
                  Próximamente: Simulaciones reales con IA que evalúa y predice tu rendimiento PAES
                </p>
                <div className="flex justify-center gap-4">
                  <span className="px-3 py-1 bg-white/20 rounded-lg text-white text-sm">IA Evaluadora</span>
                  <span className="px-3 py-1 bg-white/20 rounded-lg text-white text-sm">Predicción de Puntajes</span>
                  <span className="px-3 py-1 bg-white/20 rounded-lg text-white text-sm">Análisis de Rendimiento</span>
                </div>
              </div>
            </motion.div>
          </div>
        );

      // Control de Configuración - placeholder mejorado
      case 'settings_control':
        return (
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <h2 className="text-3xl font-bold text-white">⚙️ Centro de Configuración Neural</h2>
              <p className="text-white/70 text-lg">
                Panel de control avanzado y personalización del ecosistema
              </p>
              <div className="bg-gradient-to-r from-gray-800/60 to-slate-900/60 rounded-lg p-8 backdrop-blur-xl">
                <p className="text-white/80 mb-4">
                  Próximamente: Configuración avanzada, personalización de IA, gestión de datos
                </p>
                <div className="flex justify-center gap-4">
                  <span className="px-3 py-1 bg-white/20 rounded-lg text-white text-sm">Configuración IA</span>
                  <span className="px-3 py-1 bg-white/20 rounded-lg text-white text-sm">Personalización</span>
                  <span className="px-3 py-1 bg-white/20 rounded-lg text-white text-sm">Gestión de Datos</span>
                </div>
              </div>
            </motion.div>
          </div>
        );

      // Fallback mejorado para dimensiones no implementadas
      default:
        return (
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <h2 className="text-2xl font-bold text-white">
                🧠 Dimensión Neural: {activeDimensionData?.title || activeDimension}
              </h2>
              <p className="text-white/70">
                {activeDimensionData?.description || 'Configurando módulo avanzado...'}
              </p>
              <div className="bg-white/5 rounded-lg p-8">
                <p className="text-white/60">
                  Este módulo está siendo optimizado para la experiencia neural unificada.
                  <br />
                  🚀 Funcionalidades avanzadas en desarrollo activo.
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
