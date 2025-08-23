
import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, TrendingUp } from 'lucide-react';
import { useIntersectionalState } from '@/hooks/lectoguia/useIntersectionalState';
import { crossModuleAnalytics } from '@/services/lectoguia/cross-module-analytics';
import { ChatIntersectional } from '../modules/ChatIntersectional';
import { ExerciseIntersectional } from '../modules/ExerciseIntersectional';
import { ProgressIntersectional } from '../modules/ProgressIntersectional';
import { SubjectIntersectional } from '../modules/SubjectIntersectional';

interface LectoGuiaOrchestratorProps {
  userId?: string;
  initialSubject?: string;
  onNavigateToTool?: (tool: string, context?: any) => void;
}

/**
 * Orquestador central de LectoGuía
 * Coordina todos los módulos y mantiene la coherencia interseccional
 */
export const LectoGuiaOrchestrator: React.FC<LectoGuiaOrchestratorProps> = ({
  userId,
  initialSubject = 'COMPETENCIA_LECTORA',
  onNavigateToTool
}) => {
  const {
    intersectionalState,
    updateContext,
    activateModule,
    dispatchCrossModuleAction,
    getChatContext,
    getExerciseContext,
    getProgressContext,
    getSubjectContext
  } = useIntersectionalState(userId);

  // Inicializar contexto
  useEffect(() => {
    updateContext({
      currentSubject: initialSubject,
      userId: userId || ''
    });
  }, [initialSubject, userId, updateContext]);

  // Análisis interseccional automático
  useEffect(() => {
    const interval = setInterval(() => {
      const analytics = crossModuleAnalytics.calculateSyncMetrics(intersectionalState);
      
      console.log('📊 Métricas interseccionales:', {
        sync: analytics.overallSync,
        health: analytics.ecosystemHealth,
        patterns: crossModuleAnalytics.detectIntersectionalPatterns(intersectionalState)
      });
      
      // Auto-correcciones basadas en análisis
      if (analytics.overallSync < 50) {
        dispatchCrossModuleAction({
          type: 'SYNC_METRICS',
          source: 'orchestrator',
          target: 'all',
          payload: { forceSync: true },
          priority: 'medium'
        });
      }
    }, 10000); // Cada 10 segundos

    return () => clearInterval(interval);
  }, [intersectionalState, dispatchCrossModuleAction]);

  // Manejo de navegación entre módulos
  const handleModuleNavigation = useCallback((module: 'chat' | 'exercise' | 'progress' | 'subject') => {
    activateModule(module);
    
    // Notificar cambio a otros módulos
    dispatchCrossModuleAction({
      type: 'UPDATE_CONTEXT',
      source: 'orchestrator',
      target: module,
      payload: { activeModule: module },
      priority: 'high'
    });
  }, [activateModule, dispatchCrossModuleAction]);

  // Navegación a herramientas externas con contexto
  const handleExternalNavigation = useCallback((tool: string, context?: any) => {
    const enrichedContext = {
      ...context,
      fromLectoguia: true,
      currentState: intersectionalState,
      recommendations: crossModuleAnalytics.generateRecommendations(intersectionalState)
    };
    
    onNavigateToTool?.(tool, enrichedContext);
  }, [intersectionalState, onNavigateToTool]);

  const currentModule = intersectionalState.context.activeModule;
  const syncMetrics = crossModuleAnalytics.calculateSyncMetrics(intersectionalState);

  return (
    <div className="space-y-6">
      {/* Header Interseccional */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-4">
          <div className="relative">
            <div className="p-4 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full"
            />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              LectoGuía Interseccional
            </h1>
            <p className="text-gray-600">Ecosistema educativo unificado e inteligente</p>
          </div>
          
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
              Sync: {Math.round(syncMetrics.overallSync)}%
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
              Health: {Math.round(syncMetrics.ecosystemHealth)}%
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Navegación de Módulos */}
      <Card className="p-4">
        <div className="flex justify-center gap-4">
          {[
            { id: 'chat', label: 'Chat IA', icon: Brain, color: 'purple' },
            { id: 'exercise', label: 'Ejercicios', icon: Zap, color: 'blue' },
            { id: 'progress', label: 'Progreso', icon: TrendingUp, color: 'green' },
            { id: 'subject', label: 'Materias', icon: Brain, color: 'orange' }
          ].map((module) => {
            const Icon = module.icon;
            const isActive = currentModule === module.id;
            const moduleState = intersectionalState.modules[module.id as keyof typeof intersectionalState.modules];
            
            return (
              <motion.button
                key={module.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleModuleNavigation(module.id as any)}
                className={`relative p-4 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? `bg-${module.color}-500 text-white shadow-lg` 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <Icon className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">{module.label}</div>
                
                {/* Indicador de estado */}
                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                  moduleState.needsAttention ? 'bg-red-400 animate-pulse' : 'bg-green-400'
                }`} />
                
                {/* Métricas del módulo */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs text-gray-600 shadow-md"
                  >
                    {Math.round(moduleState.performance)}%
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </Card>

      {/* Contenido del Módulo Activo */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentModule}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentModule === 'chat' && (
            <ChatIntersectional
              context={getChatContext()}
              onNavigateToTool={handleExternalNavigation}
              onDispatchAction={dispatchCrossModuleAction}
            />
          )}
          
          {currentModule === 'exercise' && (
            <ExerciseIntersectional
              context={getExerciseContext()}
              onNavigateToTool={handleExternalNavigation}
              onDispatchAction={dispatchCrossModuleAction}
            />
          )}
          
          {currentModule === 'progress' && (
            <ProgressIntersectional
              context={getProgressContext()}
              onNavigateToTool={handleExternalNavigation}
              onDispatchAction={dispatchCrossModuleAction}
            />
          )}
          
          {currentModule === 'subject' && (
            <SubjectIntersectional
              context={getSubjectContext()}
              onNavigateToTool={handleExternalNavigation}
              onDispatchAction={dispatchCrossModuleAction}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Panel de Recomendaciones Interseccionales */}
      {syncMetrics.recommendations.length > 0 && (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Recomendaciones Interseccionales
          </h3>
          <div className="space-y-2">
            {syncMetrics.recommendations.slice(0, 3).map((rec) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200"
              >
                <div>
                  <div className="font-medium text-gray-900">{rec.title}</div>
                  <div className="text-sm text-gray-600">{rec.description}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {rec.estimatedTime}min
                  </Badge>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={rec.action}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    Aplicar
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
