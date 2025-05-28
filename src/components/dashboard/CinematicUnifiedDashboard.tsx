
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealDashboardData } from '@/hooks/dashboard/useRealDashboardData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, Target, Zap, TrendingUp, Calendar, 
  BookOpen, Award, RefreshCw, Eye, BarChart3, 
  Sparkles, MessageSquare, CheckCircle
} from 'lucide-react';

export const CinematicUnifiedDashboard: React.FC = () => {
  const { 
    metrics, 
    systemStatus, 
    isLoading,
    isSystemReady,
    diagnosticData,
    planData,
    calendarData,
    lectoGuiaData,
    navigateToSection,
    getSmartRecommendations,
    refreshData
  } = useRealDashboardData();

  const [activeView, setActiveView] = useState<'overview' | 'metrics' | 'recommendations'>('overview');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-6"></div>
          <div className="text-2xl font-bold">Inicializando Dashboard Cinemático...</div>
          <div className="text-cyan-300 mt-2">Conectando con datos reales desde Supabase</div>
        </div>
      </div>
    );
  }

  const smartRecommendations = getSmartRecommendations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8 pb-8">
        
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
              <p className="text-cyan-300 text-xl">Sistema Inteligente Unificado</p>
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
              Actualizar Datos
            </Button>
            <Badge className={isSystemReady ? "bg-green-600 text-white" : "bg-yellow-600 text-white"}>
              {isSystemReady ? 'Sistema Activo' : 'Inicializando...'}
            </Badge>
          </div>
        </motion.div>

        {/* Navegación de Vistas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-4"
        >
          <Button
            onClick={() => setActiveView('overview')}
            variant={activeView === 'overview' ? 'default' : 'outline'}
            className={activeView === 'overview' 
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600' 
              : 'border-white/30 text-white hover:bg-white/10'
            }
          >
            <Eye className="w-4 h-4 mr-2" />
            Resumen General
          </Button>
          <Button
            onClick={() => setActiveView('metrics')}
            variant={activeView === 'metrics' ? 'default' : 'outline'}
            className={activeView === 'metrics' 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
              : 'border-white/30 text-white hover:bg-white/10'
            }
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Métricas Detalladas
          </Button>
          <Button
            onClick={() => setActiveView('recommendations')}
            variant={activeView === 'recommendations' ? 'default' : 'outline'}
            className={activeView === 'recommendations' 
              ? 'bg-gradient-to-r from-yellow-600 to-orange-600' 
              : 'border-white/30 text-white hover:bg-white/10'
            }
          >
            <Award className="w-4 h-4 mr-2" />
            Recomendaciones IA
          </Button>
        </motion.div>

        {/* Contenido Principal */}
        <motion.div
          key={activeView}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {activeView === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {/* Métricas Principales */}
                <Card className="bg-black/40 backdrop-blur-xl border-green-500/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-green-400 flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Progreso
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{metrics.completedNodes}</div>
                    <div className="text-green-400 text-sm">nodos completados</div>
                    <Progress value={diagnosticData.overallScore} className="mt-2" />
                  </CardContent>
                </Card>

                <Card className="bg-black/40 backdrop-blur-xl border-blue-500/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-blue-400 flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      Diagnóstico
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{diagnosticData.overallScore}%</div>
                    <div className="text-blue-400 text-sm">rendimiento general</div>
                    <div className="text-xs text-white/60 mt-1">
                      {diagnosticData.weakAreas.length} áreas débiles
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-purple-400 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Planificación
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{planData.planProgress}%</div>
                    <div className="text-purple-400 text-sm">plan completado</div>
                    <div className="text-xs text-white/60 mt-1">
                      {calendarData.upcomingEvents} eventos próximos
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 backdrop-blur-xl border-orange-500/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-orange-400 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      LectoGuía
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{lectoGuiaData.conversationCount}</div>
                    <div className="text-orange-400 text-sm">conversaciones</div>
                    <div className="text-xs text-white/60 mt-1">
                      {lectoGuiaData.averageRating}★ promedio
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeView === 'metrics' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <Card className="bg-black/40 backdrop-blur-xl border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Métricas Detalladas del Sistema</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-white font-medium mb-3">Rendimiento Académico</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-white/70">Nodos Completados</span>
                            <span className="text-white font-bold">{metrics.completedNodes}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/70">Tiempo de Estudio</span>
                            <span className="text-white font-bold">{metrics.totalStudyTime}h</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/70">Racha Actual</span>
                            <span className="text-white font-bold">{metrics.currentStreak} días</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/70">Puntaje Predicho</span>
                            <span className="text-green-400 font-bold">{metrics.predictedScore}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-3">Estado del Sistema</h4>
                        <div className="space-y-3">
                          {Object.entries(systemStatus).map(([key, status]) => (
                            <div key={key} className="flex justify-between items-center">
                              <span className="text-white/70 capitalize">{key}</span>
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  status.status === 'ready' || status.status === 'active' ? 'bg-green-400' :
                                  status.status === 'loading' ? 'bg-yellow-400' : 'bg-red-400'
                                }`} />
                                <span className="text-white text-sm">{status.data}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeView === 'recommendations' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {smartRecommendations.map((rec, index) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-black/40 backdrop-blur-xl border-white/20 hover:border-white/40 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-bold text-white mb-2">{rec.title}</h4>
                            <p className="text-white/80 text-sm mb-3">{rec.description}</p>
                            <Badge variant="outline" className={`text-xs ${
                              rec.priority === 'urgent' ? 'border-red-400 text-red-400' :
                              rec.priority === 'high' ? 'border-yellow-400 text-yellow-400' :
                              'border-blue-400 text-blue-400'
                            }`}>
                              {rec.priority === 'urgent' ? 'Urgente' :
                               rec.priority === 'high' ? 'Alta' : 'Media'}
                            </Badge>
                          </div>
                          <Button
                            onClick={rec.action}
                            size="sm"
                            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-90"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Ejecutar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};
