
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNeuralBackend } from '@/hooks/useNeuralBackend';
import { Brain, TrendingUp, Award, Lightbulb, RefreshCw } from 'lucide-react';

export const NeuralAnalyticsDashboard: React.FC = () => {
  const {
    analytics,
    achievements,
    recommendations,
    isLoading,
    refreshAnalytics,
    generateRecommendations,
    totalPoints,
    engagementTrend
  } = useNeuralBackend();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Dashboard Neural</h2>
          <p className="text-gray-300">Análisis avanzado de tu progreso neural</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={refreshAnalytics} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={generateRecommendations} size="sm">
            <Lightbulb className="w-4 h-4 mr-2" />
            Generar IA
          </Button>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-sm">Engagement</p>
                  <p className="text-2xl font-bold text-white">
                    {Math.round(analytics?.metrics?.avg_engagement || 0)}%
                  </p>
                </div>
                <Brain className="w-8 h-8 text-blue-400" />
              </div>
              {engagementTrend === 'up' && (
                <Badge variant="secondary" className="mt-2 bg-green-500/20 text-green-300">
                  ↗ Mejorando
                </Badge>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm">Coherencia</p>
                  <p className="text-2xl font-bold text-white">
                    {Math.round(analytics?.metrics?.avg_coherence || 0)}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-300 text-sm">Logros</p>
                  <p className="text-2xl font-bold text-white">{achievements.length}</p>
                </div>
                <Award className="w-8 h-8 text-yellow-400" />
              </div>
              <p className="text-xs text-yellow-300 mt-1">{totalPoints} puntos</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 text-sm">Sesiones</p>
                  <p className="text-2xl font-bold text-white">
                    {analytics?.metrics?.session_count || 0}
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-400/20 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Insights y Recomendaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Insights */}
        <Card className="bg-black/40 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Insights Neurales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics?.insights?.map((insight: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg ${
                    insight.type === 'success' ? 'bg-green-900/30 border-l-4 border-green-500' :
                    insight.type === 'warning' ? 'bg-yellow-900/30 border-l-4 border-yellow-500' :
                    'bg-blue-900/30 border-l-4 border-blue-500'
                  }`}
                >
                  <h4 className="font-semibold text-white mb-1">{insight.title}</h4>
                  <p className="text-sm text-gray-300">{insight.message}</p>
                </motion.div>
              )) || (
                <p className="text-gray-400 text-center py-4">
                  No hay insights disponibles. Continúa usando el sistema para generar análisis.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recomendaciones */}
        <Card className="bg-black/40 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Recomendaciones IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations?.slice(0, 3).map((rec: any, index: number) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg bg-purple-900/20 border border-purple-500/30"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">
                        {rec.content?.title || 'Recomendación'}
                      </h4>
                      <p className="text-sm text-gray-300 mb-2">
                        {rec.content?.description || 'Sin descripción'}
                      </p>
                      {rec.content?.actions && (
                        <div className="flex flex-wrap gap-1">
                          {rec.content.actions.slice(0, 2).map((action: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {action}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <Badge className={`ml-2 ${
                      rec.priority >= 3 ? 'bg-red-500' :
                      rec.priority >= 2 ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}>
                      P{rec.priority}
                    </Badge>
                  </div>
                </motion.div>
              )) || (
                <p className="text-gray-400 text-center py-4">
                  No hay recomendaciones activas.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
