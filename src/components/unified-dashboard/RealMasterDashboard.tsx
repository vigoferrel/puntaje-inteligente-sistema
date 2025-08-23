import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Trophy, 
  BarChart3, 
  Music, 
  Eye, 
  Zap, 
  Target,
  TrendingUp,
  Users,
  Award,
  Clock,
  BookOpen,
  Lightbulb,
  Sparkles,
  Activity
} from 'lucide-react';

// Hooks reales con Supabase
import { useWorkingGamification } from '@/hooks/use-working-gamification';
import { useWorkingAIRecommendations } from '@/hooks/use-working-ai-recommendations';
import { useWorkingAnalytics } from '@/hooks/use-working-analytics';

// Componentes simplificados como fallback
import { SimpleLoadingScreen } from '@/components/SimpleLoadingScreen';

interface RealMasterDashboardProps {
  userId: string;
}

const RealMasterDashboard: React.FC<RealMasterDashboardProps> = ({ userId }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ai' | 'gamification' | 'analytics'>('all');
  const [refreshInterval, setRefreshInterval] = useState(60000); // 1 minute
  
  // Hooks reales con funcionalidad de Supabase
  const { 
    achievements, 
    gameStats, 
    rankings, 
    isLoading: gamificationLoading,
    error: gamificationError,
    refreshGamificationData,
    updateUserExperience,
    autoCheckAchievements
  } = useWorkingGamification();

  const { 
    recommendations, 
    studyRecommendations,
    bloomRecommendations,
    isLoading: aiLoading,
    error: aiError,
    generateAIActivity,
    refreshRecommendations
  } = useWorkingAIRecommendations();

  const { 
    metrics, 
    userAnalytics,
    predictions,
    engagementData,
    isLoading: analyticsLoading,
    error: analyticsError,
    refreshAnalytics,
    trackActivity
  } = useWorkingAnalytics();

  // Estado de carga general
  const isLoading = gamificationLoading || aiLoading || analyticsLoading;
  const hasErrors = gamificationError || aiError || analyticsError;

  // Auto-refresh de datos
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Auto-refreshing real dashboard data...');
      refreshGamificationData();
      refreshRecommendations();
      refreshAnalytics();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, refreshGamificationData, refreshRecommendations, refreshAnalytics]);

  // Función para simular actividad de estudio
  const simulateStudyActivity = async () => {
    await trackActivity('study_session', 'mathematics', 45);
    await updateUserExperience(50);
    await autoCheckAchievements();
  };

  // Función para generar actividad de IA
  const handleGenerateAIActivity = async () => {
    await generateAIActivity('mathematics', 'medio');
  };

  if (isLoading) {
    return <SimpleLoadingScreen />;
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header con información del usuario */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🚀 Dashboard PAES Inteligente</h1>
            <p className="text-lg opacity-90">Sistema Neural Avanzado - Funcionalidad Real</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{gameStats?.totalPoints || 0}</div>
            <div className="text-sm opacity-80">Puntos Totales</div>
          </div>
        </div>
        
        {/* Indicadores de estado */}
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Sistema Neural Activo</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-sm">IA Recomendaciones: {recommendations.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Analytics en Tiempo Real</span>
          </div>
        </div>
      </motion.div>

      {/* Filtros de categoría */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
        <div className="flex space-x-2">
          {[
            { id: 'all', label: 'Todo', icon: Target },
            { id: 'ai', label: 'IA & Recomendaciones', icon: Brain },
            { id: 'gamification', label: 'Gamificación', icon: Trophy },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de widgets principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Widget de Gamificación Real */}
        {(selectedCategory === 'all' || selectedCategory === 'gamification') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg text-white mr-3">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Gamificación Real</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Conectado a Supabase</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{gameStats?.level || 1}</div>
                  <div className="text-sm text-gray-600">Nivel</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{achievements.filter(a => a.unlocked).length}</div>
                  <div className="text-sm text-gray-600">Logros</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Experiencia</span>
                  <span>{gameStats?.experience || 0}/{gameStats?.maxExperience || 1000}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                    style={{ width: `${((gameStats?.experience || 0) / (gameStats?.maxExperience || 1000)) * 100}%` }}
                  />
                </div>
              </div>
              
              <button
                onClick={simulateStudyActivity}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-blue-700 transition-colors"
              >
                Simular Sesión de Estudio
              </button>
            </div>
          </motion.div>
        )}

        {/* Widget de Recomendaciones de IA Real */}
        {(selectedCategory === 'all' || selectedCategory === 'ai') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg text-white mr-3">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">IA Recomendaciones</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Neural Network Activo</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-purple-600">{recommendations.length}</div>
                  <div className="text-xs text-gray-600">General</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">{studyRecommendations.length}</div>
                  <div className="text-xs text-gray-600">Estudio</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">{bloomRecommendations.length}</div>
                  <div className="text-xs text-gray-600">Bloom</div>
                </div>
              </div>
              
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {recommendations.slice(0, 3).map((rec, index) => (
                  <div key={rec.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm font-medium">{rec.title}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{rec.description}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {rec.priority}
                      </span>
                      <span className="text-xs text-gray-500">{rec.confidence}% confianza</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={handleGenerateAIActivity}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors"
              >
                Generar Actividad IA
              </button>
            </div>
          </motion.div>
        )}

        {/* Widget de Analytics en Tiempo Real */}
        {(selectedCategory === 'all' || selectedCategory === 'analytics') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg text-white mr-3">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Analytics Real</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tiempo Real</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{metrics?.engagementScore || 0}</div>
                  <div className="text-sm text-gray-600">Engagement</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{userAnalytics?.exercisesCompleted || 0}</div>
                  <div className="text-sm text-gray-600">Ejercicios</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tiempo de Estudio</span>
                  <span>{Math.floor((userAnalytics?.totalStudyTime || 0) / 60)}h {(userAnalytics?.totalStudyTime || 0) % 60}m</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Promedio Score</span>
                  <span>{(userAnalytics?.averageScore || 0).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tendencia</span>
                  <span className={`${
                    userAnalytics?.improvementTrend === 'improving' ? 'text-green-600' :
                    userAnalytics?.improvementTrend === 'declining' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {userAnalytics?.improvementTrend === 'improving' ? '📈 Mejorando' :
                     userAnalytics?.improvementTrend === 'declining' ? '📉 Declinando' :
                     '➡️ Estable'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Predicciones IA</h4>
                {predictions.slice(0, 2).map((prediction, index) => (
                  <div key={prediction.id} className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-xs font-medium">{prediction.title}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{prediction.prediction}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Widget de Métricas del Sistema */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg text-white mr-3">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Sistema Neural</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Estado del Sistema</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{metrics?.activeUsers || 0}</div>
                <div className="text-sm text-gray-600">Usuarios Activos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{metrics?.totalSessions || 0}</div>
                <div className="text-sm text-gray-600">Sesiones</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tasa Completación</span>
                <span>{(metrics?.completionRate || 0).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full"
                  style={{ width: `${metrics?.completionRate || 0}%` }}
                />
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-xs text-gray-500">
                Última actualización: {metrics?.lastUpdated ? new Date(metrics.lastUpdated).toLocaleTimeString() : 'N/A'}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Widget de Errores y Estado */}
        {hasErrors && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-red-500 rounded-lg text-white mr-3">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-red-800 dark:text-red-200">Estado del Sistema</h2>
                <p className="text-sm text-red-600 dark:text-red-400">Algunos servicios tienen problemas</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              {gamificationError && (
                <div className="text-red-600 dark:text-red-400">🎮 Gamificación: {gamificationError}</div>
              )}
              {aiError && (
                <div className="text-red-600 dark:text-red-400">🧠 IA: {aiError}</div>
              )}
              {analyticsError && (
                <div className="text-red-600 dark:text-red-400">📊 Analytics: {analyticsError}</div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Panel de Control de Desarrollo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 border-2 border-dashed border-gray-300 dark:border-gray-600"
      >
        <div className="flex items-center mb-4">
          <div className="p-3 bg-gray-500 rounded-lg text-white mr-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Panel de Desarrollo</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Controles para testing y desarrollo</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setRefreshInterval(10000)}
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Refresh Rápido (10s)
          </button>
          <button
            onClick={() => setRefreshInterval(60000)}
            className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Refresh Normal (1m)
          </button>
          <button
            onClick={() => {
              refreshGamificationData();
              refreshRecommendations();
              refreshAnalytics();
            }}
            className="p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Refrescar Todo
          </button>
        </div>
        
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          <p>✅ Conectado a Supabase con {rankings.length} usuarios en ranking</p>
          <p>✅ Sistema neural con {predictions.length} predicciones activas</p>
          <p>✅ {engagementData.length} puntos de datos de engagement</p>
        </div>
      </motion.div>
    </div>
  );
};

export default RealMasterDashboard;
