
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  DollarSign, 
  Zap, 
  Brain,
  CheckCircle2,
  Clock,
  Award,
  BarChart3
} from 'lucide-react';
import { contentOrchestrator } from '@/services/content-optimization/ContentOrchestrator';
import { useAuth } from '@/contexts/AuthContext';

interface OptimizedDashboardProps {
  onNavigateToTool: (tool: string, context?: any) => void;
}

export const OptimizedDashboard: React.FC<OptimizedDashboardProps> = ({ onNavigateToTool }) => {
  const { user } = useAuth();
  const [optimizationMetrics, setOptimizationMetrics] = useState<any>(null);
  const [systemStats, setSystemStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Obtener métricas de optimización
      const metrics = contentOrchestrator.getOptimizationMetrics();
      setOptimizationMetrics(metrics);

      // Simular stats del sistema
      const stats = {
        totalStudyTime: 125,
        exercisesCompleted: 45,
        averageScore: 78,
        streak: 7,
        officialContentUsed: 87,
        costSavings: 2.34,
        nextGoal: 'Matemática M1 - 85%',
        weeklyProgress: [65, 72, 68, 75, 78, 82, 78],
        subjects: [
          { name: 'Comprensión Lectora', progress: 82, source: 'oficial' },
          { name: 'Matemática M1', progress: 75, source: 'hibrido' },
          { name: 'Ciencias', progress: 68, source: 'oficial' },
          { name: 'Historia', progress: 71, source: 'oficial' }
        ]
      };
      setSystemStats(stats);

    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full mx-auto animate-spin mb-4" />
          <p className="text-xl font-semibold">Cargando dashboard optimizado...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-6">
      {/* Header principal */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 cinematic-text-glow">
            SuperPAES Optimizado
          </h1>
          <p className="text-xl text-purple-200 mb-6">
            Sistema inteligente con contenido oficial PAES + IA contextual
          </p>
          
          {/* Métricas de optimización principales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
              <div className="text-3xl font-bold text-green-400">
                {systemStats?.officialContentUsed || 0}%
              </div>
              <div className="text-green-200 text-sm">Contenido Oficial</div>
            </div>
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-400">
                ${systemStats?.costSavings?.toFixed(2) || '0.00'}
              </div>
              <div className="text-blue-200 text-sm">Ahorro API</div>
            </div>
            <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-400">
                {systemStats?.exercisesCompleted || 0}
              </div>
              <div className="text-purple-200 text-sm">Ejercicios</div>
            </div>
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="text-3xl font-bold text-yellow-400">
                {systemStats?.averageScore || 0}%
              </div>
              <div className="text-yellow-200 text-sm">Rendimiento</div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progreso por materias */}
          <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Progreso Optimizado por Materia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemStats?.subjects?.map((subject: any, index: number) => (
                  <motion.div
                    key={subject.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{subject.name}</span>
                        <Badge 
                          variant="outline"
                          className={`text-xs ${
                            subject.source === 'oficial' 
                              ? 'bg-green-500/20 text-green-300 border-green-500/30'
                              : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          }`}
                        >
                          {subject.source === 'oficial' ? '🏛️ Oficial' : '🧠 Híbrido'}
                        </Badge>
                      </div>
                      <span className="text-purple-300 text-sm">{subject.progress}%</span>
                    </div>
                    <Progress value={subject.progress} className="h-2" />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Herramientas principales */}
          <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Herramientas Inteligentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  onClick={() => onNavigateToTool('lectoguia')}
                  className="h-24 bg-purple-600 hover:bg-purple-700 flex flex-col items-center justify-center space-y-2"
                >
                  <Brain className="w-8 h-8" />
                  <div className="text-center">
                    <div className="font-semibold">LectoGuía Optimizado</div>
                    <div className="text-xs opacity-80">Contenido oficial + IA</div>
                  </div>
                </Button>

                <Button
                  onClick={() => onNavigateToTool('diagnostic')}
                  className="h-24 bg-blue-600 hover:bg-blue-700 flex flex-col items-center justify-center space-y-2"
                >
                  <Target className="w-8 h-8" />
                  <div className="text-center">
                    <div className="font-semibold">Diagnóstico Inteligente</div>
                    <div className="text-xs opacity-80">90% oficial + 10% IA</div>
                  </div>
                </Button>

                <Button
                  onClick={() => onNavigateToTool('exercises')}
                  className="h-24 bg-green-600 hover:bg-green-700 flex flex-col items-center justify-center space-y-2"
                >
                  <BookOpen className="w-8 h-8" />
                  <div className="text-center">
                    <div className="font-semibold">Ejercicios PAES</div>
                    <div className="text-xs opacity-80">Banco oficial + explicaciones IA</div>
                  </div>
                </Button>

                <Button
                  onClick={() => onNavigateToTool('financial')}
                  className="h-24 bg-yellow-600 hover:bg-yellow-700 flex flex-col items-center justify-center space-y-2"
                >
                  <DollarSign className="w-8 h-8" />
                  <div className="text-center">
                    <div className="font-semibold">Centro Financiero</div>
                    <div className="text-xs opacity-80">Becas + simulaciones</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Progreso semanal */}
          <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Progreso Esta Semana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => {
                  const progress = systemStats?.weeklyProgress?.[index] || 0;
                  return (
                    <div key={day} className="text-center">
                      <div className="text-xs text-slate-400 mb-1">{day}</div>
                      <div 
                        className={`h-16 rounded flex items-end justify-center p-1 text-white text-xs font-bold ${
                          progress > 75 ? 'bg-green-500' : 
                          progress > 50 ? 'bg-yellow-500' : 'bg-slate-600'
                        }`}
                        style={{ height: `${Math.max(20, (progress / 100) * 64)}px` }}
                      >
                        {progress}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna lateral */}
        <div className="space-y-6">
          {/* Resumen de optimización */}
          <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Zap className="w-5 h-5 text-purple-400" />
                Optimización de Recursos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-1">
                    {optimizationMetrics?.costSavingsProjected?.toFixed(2) || '0.00'}$
                  </div>
                  <div className="text-sm text-green-200">Ahorro Total API</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Contenido Oficial:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400 font-medium">
                        {optimizationMetrics?.officialContentUsage || 0}
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Uso de IA:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400 font-medium">
                        {optimizationMetrics?.aiUsage || 0}
                      </span>
                      <Brain className="w-4 h-4 text-blue-400" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Cache Hit Rate:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400 font-medium">
                        {optimizationMetrics?.cacheHitRate?.toFixed(0) || 0}%
                      </span>
                      <Zap className="w-4 h-4 text-purple-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/50 p-3 rounded-lg">
                  <div className="text-xs text-slate-300 mb-2">Eficiencia del Sistema</div>
                  <Progress value={85} className="h-2 mb-2" />
                  <div className="text-xs text-green-300">85% - Excelente optimización</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Próximos objetivos */}
          <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Award className="w-5 h-5 text-purple-400" />
                Próximos Objetivos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-3">
                  <div className="text-purple-300 text-sm font-medium mb-1">Meta Principal</div>
                  <div className="text-white">{systemStats?.nextGoal}</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-slate-300">Completar 50 ejercicios</span>
                    <span className="text-green-400 ml-auto">{systemStats?.exercisesCompleted}/50</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span className="text-slate-300">Racha de 10 días</span>
                    <span className="text-yellow-400 ml-auto">{systemStats?.streak}/10</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-blue-400" />
                    <span className="text-slate-300">Promedio 80%</span>
                    <span className="text-blue-400 ml-auto">{systemStats?.averageScore}%/80%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acciones rápidas */}
          <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  onClick={() => onNavigateToTool('lectoguia')}
                  className="w-full justify-start bg-purple-600 hover:bg-purple-700"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Practicar con LectoGuía
                </Button>
                <Button
                  onClick={() => onNavigateToTool('diagnostic')}
                  variant="outline"
                  className="w-full justify-start border-purple-500/30 text-purple-300 hover:bg-purple-800"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Nuevo Diagnóstico
                </Button>
                <Button
                  onClick={() => onNavigateToTool('plan')}
                  variant="outline"
                  className="w-full justify-start border-purple-500/30 text-purple-300 hover:bg-purple-800"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Ver Mi Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
