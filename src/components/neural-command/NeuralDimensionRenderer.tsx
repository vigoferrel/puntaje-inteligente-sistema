import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, Target, BarChart3, Calendar, Settings, 
  Trophy, Gamepad2, Zap, Star, Crown, Rocket,
  TrendingUp, PieChart, LineChart, Activity
} from 'lucide-react';

type NeuralDimension = 
  | 'universe_exploration' 
  | 'neural_training' 
  | 'vocational_prediction' 
  | 'progress_analysis' 
  | 'battle_mode'
  | 'financial_center'
  | 'calendar_management'
  | 'settings_control'
  | 'analisis_avanzado'
  | 'entrenamiento_adaptativo';

interface NeuralDimensionRendererProps {
  activeDimension: NeuralDimension;
  selectedGalaxy: string | null;
  neuralMetrics: any;
  onStartTraining: () => void;
  onViewAnalysis: () => void;
  onEnterBattle: () => void;
  onNavigateToAnalysis?: () => void;
  onNavigateToTraining?: () => void;
}

export const NeuralDimensionRenderer: React.FC<NeuralDimensionRendererProps> = ({
  activeDimension,
  selectedGalaxy,
  neuralMetrics,
  onStartTraining,
  onViewAnalysis,
  onEnterBattle,
  onNavigateToAnalysis,
  onNavigateToTraining
}) => {
  const renderDimensionContent = () => {
    switch (activeDimension) {
      case 'analisis_avanzado':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-4 left-4 right-4 z-40 pointer-events-auto"
          >
            <Card className="bg-black/50 backdrop-blur-xl border-emerald-500/30">
              <CardContent className="p-6">
                <div className="text-white">
                  <div className="flex items-center space-x-3 mb-4">
                    <PieChart className="w-8 h-8 text-emerald-400" />
                    <div>
                      <h3 className="text-2xl font-bold">Análisis Neural Avanzado</h3>
                      <p className="text-emerald-300">Métricas predictivas y análisis profundo</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-emerald-500/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-emerald-400">94%</div>
                      <div className="text-sm">Precisión Predictiva</div>
                    </div>
                    <div className="bg-blue-500/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">127</div>
                      <div className="text-sm">Patrones Detectados</div>
                    </div>
                    <div className="bg-purple-500/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-400">89%</div>
                      <div className="text-sm">Coherencia Neural</div>
                    </div>
                    <div className="bg-orange-500/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-orange-400">+15%</div>
                      <div className="text-sm">Mejora Semanal</div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button onClick={onViewAnalysis} className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Análisis Completo
                    </Button>
                    <Button variant="outline" className="border-white/30 text-white">
                      <LineChart className="w-4 h-4 mr-2" />
                      Exportar Datos
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 'entrenamiento_adaptativo':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-4 left-4 right-4 z-40 pointer-events-auto"
          >
            <Card className="bg-black/50 backdrop-blur-xl border-violet-500/30">
              <CardContent className="p-6">
                <div className="text-white">
                  <div className="flex items-center space-x-3 mb-4">
                    <Activity className="w-8 h-8 text-violet-400" />
                    <div>
                      <h3 className="text-2xl font-bold">Entrenamiento Adaptativo Neural</h3>
                      <p className="text-violet-300">IA que se adapta a tu estilo de aprendizaje</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-violet-500/20 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-violet-400">92%</div>
                      <div className="text-sm">Adaptación IA</div>
                    </div>
                    <div className="bg-pink-500/20 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-pink-400">234</div>
                      <div className="text-sm">Sesiones Completadas</div>
                    </div>
                    <div className="bg-indigo-500/20 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-indigo-400">67</div>
                      <div className="text-sm">Días Consecutivos</div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button onClick={onStartTraining} className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600">
                      <Brain className="w-4 h-4 mr-2" />
                      Iniciar Entrenamiento
                    </Button>
                    <Button variant="outline" className="border-white/30 text-white">
                      <Target className="w-4 h-4 mr-2" />
                      Configurar IA
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 'neural_training':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-4 left-4 right-4 z-40 pointer-events-auto"
          >
            <Card className="bg-black/50 backdrop-blur-xl border-cyan-500/30">
              <CardContent className="p-6">
                <div className="text-white">
                  <div className="flex items-center space-x-3 mb-4">
                    <Brain className="w-8 h-8 text-cyan-400" />
                    <div>
                      <h3 className="text-2xl font-bold">Entrenamiento Neural Activo</h3>
                      <p className="text-cyan-300">Potencia tu mente con ejercicios adaptativos</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-purple-500/20 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-purple-400">87%</div>
                      <div className="text-sm">Eficiencia Neural</div>
                    </div>
                    <div className="bg-green-500/20 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-green-400">156</div>
                      <div className="text-sm">Ejercicios Completados</div>
                    </div>
                    <div className="bg-orange-500/20 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-orange-400">42</div>
                      <div className="text-sm">Racha Actual</div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button onClick={onStartTraining} className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600">
                      <Zap className="w-4 h-4 mr-2" />
                      Iniciar Entrenamiento
                    </Button>
                    <Button variant="outline" className="border-white/30 text-white">
                      <Target className="w-4 h-4 mr-2" />
                      Ejercicios Personalizados
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 'battle_mode':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-4 left-4 right-4 z-40 pointer-events-auto"
          >
            <Card className="bg-black/50 backdrop-blur-xl border-red-500/30">
              <CardContent className="p-6">
                <div className="text-white">
                  <div className="flex items-center space-x-3 mb-4">
                    <Gamepad2 className="w-8 h-8 text-red-400" />
                    <div>
                      <h3 className="text-2xl font-bold">Arena de Batalla Neural</h3>
                      <p className="text-red-300">Compite en tiempo real con otros estudiantes</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-red-500/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-red-400">2,456</div>
                      <div className="text-sm">Puntos Batalla</div>
                    </div>
                    <div className="bg-yellow-500/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-400">#287</div>
                      <div className="text-sm">Ranking Nacional</div>
                    </div>
                    <div className="bg-purple-500/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-400">15</div>
                      <div className="text-sm">Victorias Consecutivas</div>
                    </div>
                    <div className="bg-green-500/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">92%</div>
                      <div className="text-sm">Tasa de Victoria</div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button onClick={onEnterBattle} className="flex-1 bg-gradient-to-r from-red-600 to-orange-600">
                      <Crown className="w-4 h-4 mr-2" />
                      Entrar a Batalla
                    </Button>
                    <Button variant="outline" className="border-white/30 text-white">
                      <Trophy className="w-4 h-4 mr-2" />
                      Ver Torneos
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 'progress_analysis':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-4 left-4 right-4 z-40 pointer-events-auto"
          >
            <Card className="bg-black/50 backdrop-blur-xl border-green-500/30">
              <CardContent className="p-6">
                <div className="text-white">
                  <div className="flex items-center space-x-3 mb-4">
                    <BarChart3 className="w-8 h-8 text-green-400" />
                    <div>
                      <h3 className="text-2xl font-bold">Análisis Neural Avanzado</h3>
                      <p className="text-green-300">Métricas inteligentes de tu evolución</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Progreso Global</span>
                        <span className="font-bold">{neuralMetrics.overallProgress}%</span>
                      </div>
                      <Progress value={neuralMetrics.overallProgress} className="h-3" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Eficiencia de Aprendizaje</span>
                        <span className="font-bold">94%</span>
                      </div>
                      <Progress value={94} className="h-3" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Consistencia Neural</span>
                        <span className="font-bold">89%</span>
                      </div>
                      <Progress value={89} className="h-3" />
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button onClick={onViewAnalysis} className="flex-1 bg-gradient-to-r from-green-600 to-teal-600">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Análisis Detallado
                    </Button>
                    <Button variant="outline" className="border-white/30 text-white">
                      <Star className="w-4 h-4 mr-2" />
                      Exportar Reporte
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 'vocational_prediction':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-4 left-4 right-4 z-40 pointer-events-auto"
          >
            <Card className="bg-black/50 backdrop-blur-xl border-purple-500/30">
              <CardContent className="p-6">
                <div className="text-white">
                  <div className="flex items-center space-x-3 mb-4">
                    <Target className="w-8 h-8 text-purple-400" />
                    <div>
                      <h3 className="text-2xl font-bold">Predicción Vocacional IA</h3>
                      <p className="text-purple-300">Descubre tu futuro profesional ideal</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-purple-500/20 p-4 rounded-lg">
                      <div className="text-lg font-bold text-purple-400">Ingeniería</div>
                      <div className="text-sm mb-2">Compatibilidad: 94%</div>
                      <Progress value={94} className="h-2" />
                    </div>
                    <div className="bg-blue-500/20 p-4 rounded-lg">
                      <div className="text-lg font-bold text-blue-400">Medicina</div>
                      <div className="text-sm mb-2">Compatibilidad: 87%</div>
                      <Progress value={87} className="h-2" />
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">
                      <Rocket className="w-4 h-4 mr-2" />
                      Ver Predicción Completa
                    </Button>
                    <Button variant="outline" className="border-white/30 text-white">
                      <Target className="w-4 h-4 mr-2" />
                      Ajustar Preferencias
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {renderDimensionContent()}
    </AnimatePresence>
  );
};
