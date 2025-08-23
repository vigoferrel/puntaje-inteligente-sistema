
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRealDashboardData } from '@/hooks/dashboard/useRealDashboardData';
import { useRealNeuralData } from '@/hooks/useRealNeuralData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, Target, Zap, TrendingUp, 
  Calendar, BookOpen, Award, RefreshCw, 
  Eye, BarChart3, Sparkles, Globe
} from 'lucide-react';

export const CinematicUnifiedDashboard: React.FC = () => {
  const { 
    metrics, 
    systemStatus, 
    isLoading,
    navigateToSection,
    getSmartRecommendations,
    refreshData
  } = useRealDashboardData();
  
  const { 
    neuralMetrics, 
    realNodes, 
    isLoading: neuralLoading
  } = useRealNeuralData();

  const [activeView, setActiveView] = useState<'overview' | 'metrics' | 'system'>('overview');

  // Sistema listo cuando no está cargando y tenemos datos mínimos
  const isSystemReady = !isLoading && !neuralLoading && realNodes.length > 0;

  if (isLoading || neuralLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-6"></div>
          <div className="text-2xl font-bold">Inicializando Dashboard Cinemático...</div>
          <div className="text-cyan-300 mt-2">Conectando sistemas neurales</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-4">
            <Brain className="w-12 h-12 text-cyan-400" />
            <div>
              <h1 className="text-5xl font-bold text-white">Dashboard Cinemático PAES</h1>
              <p className="text-cyan-300 text-xl">Sistema Neural Integrado</p>
            </div>
            <Sparkles className="w-12 h-12 text-purple-400 animate-pulse" />
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={refreshData}
              variant="outline"
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar Sistema
            </Button>
            <Badge className={`${isSystemReady ? 'bg-green-600' : 'bg-yellow-600'} text-white`}>
              {isSystemReady ? 'Sistema Listo' : 'Inicializando'}
            </Badge>
            <Badge variant="outline" className="text-white border-white">
              {realNodes.length} Nodos Activos
            </Badge>
          </div>
        </motion.div>

        {/* Navegación de vistas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-4"
        >
          {[
            { key: 'overview', label: 'Vista General', icon: Eye },
            { key: 'metrics', label: 'Métricas', icon: BarChart3 },
            { key: 'system', label: 'Sistema', icon: Brain }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              onClick={() => setActiveView(key as any)}
              variant={activeView === key ? 'default' : 'outline'}
              className={`${
                activeView === key 
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white' 
                  : 'border-white/30 text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </Button>
          ))}
        </motion.div>

        {/* Contenido principal */}
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeView === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-black/40 backdrop-blur-xl border-green-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Progreso Global
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{metrics.completedNodes}</div>
                  <div className="text-green-400 text-sm">nodos completados</div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-xl border-blue-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-400 flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Coherencia Neural
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{neuralMetrics.neuralCoherence}%</div>
                  <div className="text-blue-400 text-sm">sistema optimizado</div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-purple-400 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Velocidad
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{neuralMetrics.learningVelocity}%</div>
                  <div className="text-purple-400 text-sm">aprendizaje acelerado</div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-xl border-orange-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-orange-400 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{neuralMetrics.engagementScore}%</div>
                  <div className="text-orange-400 text-sm">+{metrics.currentStreak} días</div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeView === 'metrics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/40 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Métricas de Rendimiento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white">Tiempo de estudio total</span>
                    <span className="text-cyan-400 font-bold">{metrics.totalStudyTime}h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white">Progreso semanal</span>
                    <span className="text-green-400 font-bold">{metrics.weeklyProgress}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white">Puntaje predicho</span>
                    <span className="text-purple-400 font-bold">{metrics.predictedScore}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Recomendaciones Inteligentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {getSmartRecommendations().map((rec, index) => (
                    <div key={rec.id} className="p-3 bg-white/5 rounded-lg">
                      <div className="font-medium text-white">{rec.title}</div>
                      <div className="text-sm text-white/70">{rec.description}</div>
                      <Badge className={`mt-2 ${
                        rec.priority === 'urgent' ? 'bg-red-600' : 'bg-blue-600'
                      }`}>
                        {rec.priority}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {activeView === 'system' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(systemStatus).map(([key, status]) => (
                <Card key={key} className="bg-black/40 backdrop-blur-xl border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium capitalize">{key}</div>
                        <div className="text-gray-400 text-sm">{status.data}</div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        status.status === 'ready' || status.status === 'active' ? 'bg-green-400' :
                        status.status === 'loading' ? 'bg-yellow-400' :
                        'bg-red-400'
                      }`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
