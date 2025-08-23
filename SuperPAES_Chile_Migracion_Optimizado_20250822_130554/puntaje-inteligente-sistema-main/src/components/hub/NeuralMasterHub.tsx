/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useGlobalCinematic } from '../../hooks/useGlobalCinematic';
import GlobalCinematicProvider from '../../contexts/GlobalCinematicContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import {
  Brain,
  Target,
  Trophy,
  Zap,
  BookOpen,
  Calendar,
  Globe,
  DollarSign,
  TrendingUp,
  Star,
  Users,
  Clock,
  Award,
  Gamepad2
} from 'lucide-react';

// Tipos para el Hub Neural
interface UserProfile {
  id: string;
  type: 'student' | 'institution' | 'parent';
  level: 'beginner' | 'intermediate' | 'advanced';
  preferences: {
    cinematicLevel: 'minimal' | 'moderate' | 'full';
    primaryGoals: string[];
    weakAreas: string[];
    strongAreas: string[];
  };
}

interface CycleRecommendation {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  route: string;
  color: string;
  progress?: number;
}

interface NeuralMetrics {
  efficiency: number;
  engagement: number;
  battleReadiness: number;
  achievementMomentum: number;
  learningVelocity: number;
  neuralCoherence: number;
}

interface ScoringData {
  currentScore: number;
  predictedScore: number;
  improvement: number;
  weakAreas: string[];
  strongAreas: string[];
  recommendations: string[];
}

export const NeuralMasterHub: React.FC = () => {
  const { user } = useAuth();
  const { state, updatePreferences } = useGlobalCinematic();
  
  // Estados del Hub Neural
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [neuralMetrics, setNeuralMetrics] = useState<NeuralMetrics>({
    efficiency: 0,
    engagement: 0,
    battleReadiness: 0,
    achievementMomentum: 0,
    learningVelocity: 0,
    neuralCoherence: 0
  });
  const [scoringData, setScoringData] = useState<ScoringData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startTime] = useState(Date.now());
  const [activeInsight, setActiveInsight] = useState(0);

  // InicializaciÃ³n del perfil adaptativo
  useEffect(() => {
    const initializeProfile = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        
        // Simular carga de perfil (en producciÃ³n vendrÃ­a de la base de datos)
        const profile: UserProfile = {
          id: user.id,
          type: 'student', // Detectar automÃ¡ticamente
          level: 'intermediate',
          preferences: {
            cinematicLevel: 'full',
            primaryGoals: ['PAES', 'vocational'],
            weakAreas: ['MatemÃ¡tica', 'FÃ­sica'],
            strongAreas: ['Lenguaje', 'Historia']
          }
        };
        
        setUserProfile(profile);
        
        // Cargar mÃ©tricas neurales
        const metrics = await loadNeuralMetrics(user.id);
        setNeuralMetrics(metrics);
        
        // Cargar datos de scoring (simulado por ahora)
        const scoring: ScoringData = {
          currentScore: Math.floor(Math.random() * 200) + 600,
          predictedScore: Math.floor(Math.random() * 100) + 700,
          improvement: Math.floor(Math.random() * 50) + 25,
          weakAreas: ['MatemÃ¡tica', 'FÃ­sica'],
          strongAreas: ['Lenguaje', 'Historia'],
          recommendations: [
            'Practica mÃ¡s ejercicios de Ã¡lgebra',
            'Refuerza conceptos de fÃ­sica mecÃ¡nica',
            'MantÃ©n tu nivel en comprensiÃ³n lectora'
          ]
        };
        setScoringData(scoring);
        
      } catch (error) {
        console.error('Error inicializando perfil:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeProfile();
  }, [user?.id]);

  // EMERGENCY_TIMEOUT - Forzar carga despuÃ©s de 5 segundos
  useEffect(() => {
    const emergencyTimeout = setTimeout(() => {
      console.warn('ðŸš¨ EMERGENCY: Forcing component load after 5 seconds');
      setIsLoading(false);
    }, 3000);
    
    return () => clearTimeout(emergencyTimeout);
  }, []);

  // FunciÃ³n para cargar mÃ©tricas neurales
  const loadNeuralMetrics = async (userId: string): Promise<NeuralMetrics> => {
    // Simular carga de mÃ©tricas reales
    return {
      efficiency: Math.floor(Math.random() * 40) + 60,
      engagement: Math.floor(Math.random() * 30) + 70,
      battleReadiness: Math.floor(Math.random() * 50) + 50,
      achievementMomentum: Math.floor(Math.random() * 35) + 65,
      learningVelocity: Math.floor(Math.random() * 25) + 75,
      neuralCoherence: Math.floor(Math.random() * 20) + 80
    };
  };

  // Recomendaciones de ciclos basadas en perfil
  const cycleRecommendations = useMemo((): CycleRecommendation[] => {
    if (!userProfile) return [];

    const recommendations: CycleRecommendation[] = [
      {
        id: 'paes-intensive',
        name: 'Ciclo PAES Intensivo',
        description: 'PreparaciÃ³n completa con IA predictiva',
        icon: Target,
        priority: 'high',
        estimatedTime: '45-60 min',
        route: '/diagnostic',
        color: 'from-blue-500 to-cyan-500',
        progress: 65
      },
      {
        id: 'vocational-exploration',
        name: 'ExploraciÃ³n Vocacional',
        description: 'SuperPAES + Universo 3D de carreras',
        icon: Brain,
        priority: 'high',
        estimatedTime: '30-45 min',
        route: '/superpaes',
        color: 'from-purple-500 to-pink-500',
        progress: 40
      },
      {
        id: 'gamified-practice',
        name: 'PrÃ¡ctica Gamificada',
        description: 'Batallas PvP + Sistema de logros',
        icon: Gamepad2,
        priority: 'medium',
        estimatedTime: '20-30 min',
        route: '/gamification',
        color: 'from-green-500 to-emerald-500',
        progress: 80
      },
      {
        id: 'financial-planning',
        name: 'PlanificaciÃ³n Financiera',
        description: 'Becas FUAS + Calculadora inteligente',
        icon: DollarSign,
        priority: 'medium',
        estimatedTime: '15-25 min',
        route: '/financial-center',
        color: 'from-yellow-500 to-orange-500',
        progress: 25
      }
    ];

    // Filtrar y ordenar por prioridad y perfil
    return recommendations
      .filter(rec => {
        if (userProfile.preferences.primaryGoals.includes('PAES')) {
          return rec.id === 'paes-intensive' || rec.id === 'vocational-exploration';
        }
        return true;
      })
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
  }, [userProfile]);

  // Insights inteligentes rotativos
  const intelligentInsights = useMemo(() => {
    if (!scoringData || !neuralMetrics) return [];

    return [
      {
        title: 'PredicciÃ³n de Rendimiento',
        content: `Tu puntaje PAES proyectado es ${scoringData.predictedScore}. Con tu ritmo actual, podrÃ­as mejorar ${scoringData.improvement} puntos mÃ¡s.`,
        icon: TrendingUp,
        color: 'text-blue-400'
      },
      {
        title: 'Eficiencia Neural',
        content: `Tu eficiencia de aprendizaje es del ${neuralMetrics.efficiency}%. Recomendamos sesiones de 45 minutos para optimizar retenciÃ³n.`,
        icon: Brain,
        color: 'text-purple-400'
      },
      {
        title: 'Momentum de Logros',
        content: `Tienes un momentum del ${neuralMetrics.achievementMomentum}%. Â¡Es el momento perfecto para una batalla PvP!`,
        icon: Trophy,
        color: 'text-yellow-400'
      },
      {
        title: 'Ãreas de Mejora',
        content: `EnfÃ³cate en ${scoringData.weakAreas.join(' y ')} para maximizar tu crecimiento acadÃ©mico.`,
        icon: Target,
        color: 'text-red-400'
      }
    ];
  }, [scoringData, neuralMetrics]);

  // RotaciÃ³n automÃ¡tica de insights
  useEffect(() => {
    if (intelligentInsights.length === 0) return;
    
    const interval = setInterval(() => {
      setActiveInsight(prev => (prev + 1) % intelligentInsights.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [intelligentInsights.length]);

  // NavegaciÃ³n inteligente
  const navigate = useNavigate();
  
  const handleCycleNavigation = (route: string) => {
    console.log(`ðŸ§  Hub Neural: Navegando a ${route}`);
    navigate(route);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Inicializando Hub Neural</h2>
          <p className="text-purple-300">Cargando tu ecosistema educativo personalizado...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <GlobalCinematicProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
          {/* Header Adaptativo con Efectos CinematogrÃ¡ficos */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Hub Neural Maestro
                </h1>
                <p className="text-purple-300">
                  Bienvenido, {user?.email} â€¢ Perfil: {userProfile?.type} â€¢ Nivel: {userProfile?.level}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="border-purple-400 text-purple-300">
                  <Brain className="w-4 h-4 mr-2" />
                  Neural Activo
                </Badge>
                <Badge variant="outline" className="border-green-400 text-green-300">
                  <Zap className="w-4 h-4 mr-2" />
                  CinematogrÃ¡fico Full
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* MÃ©tricas Neurales en Tiempo Real con HolografÃ­a */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
          >
            {Object.entries(neuralMetrics).map(([key, value], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-xl p-4 hover:border-purple-400/60 transition-all duration-300"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{value}%</div>
                  <div className="text-xs text-purple-300 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <Progress value={value} className="h-1 mt-2" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Router de Ciclos Inteligente con Transiciones 3D */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Target className="w-6 h-6 text-purple-400" />
                  Ciclos Recomendados
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cycleRecommendations.map((cycle, index) => (
                    <motion.div
                      key={cycle.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="group cursor-pointer"
                      onClick={() => handleCycleNavigation(cycle.route)}
                    >
                      <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 overflow-hidden">
                        <div className={`h-2 bg-gradient-to-r ${cycle.color}`} />
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <cycle.icon className="w-8 h-8 text-purple-400" />
                            <Badge
                              variant={cycle.priority === 'high' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {cycle.priority}
                            </Badge>
                          </div>
                          <CardTitle className="text-white text-lg">{cycle.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-purple-300 text-sm mb-4">{cycle.description}</p>
                          <div className="flex items-center justify-between text-xs text-purple-400 mb-3">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {cycle.estimatedTime}
                            </span>
                            {cycle.progress && (
                              <span>{cycle.progress}% completado</span>
                            )}
                          </div>
                          {cycle.progress && (
                            <Progress value={cycle.progress} className="h-2 mb-3" />
                          )}
                          <Button 
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                            size="sm"
                          >
                            Iniciar Ciclo
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Recomendaciones IA con Asistente Contextual */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-400" />
                  Insights IA
                </h2>
                
                <AnimatePresence mode="wait">
                  {intelligentInsights.length > 0 && (
                    <motion.div
                      key={activeInsight}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30 mb-4">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-3">
                            {React.createElement(intelligentInsights[activeInsight].icon, {
                              className: `w-6 h-6 ${intelligentInsights[activeInsight].color} mt-1`
                            })}
                            <div>
                              <h3 className="font-semibold text-white mb-2">
                                {intelligentInsights[activeInsight].title}
                              </h3>
                              <p className="text-purple-300 text-sm">
                                {intelligentInsights[activeInsight].content}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Acceso RÃ¡pido con NavegaciÃ³n Inmersiva */}
                <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      Acceso RÃ¡pido
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      { name: 'Calendario', icon: Calendar, route: '/calendario' },
                      { name: 'Universo 3D', icon: Globe, route: '/universe' },
                      { name: 'Logros', icon: Award, route: '/achievements' },
                      { name: 'LectoGuÃ­a', icon: BookOpen, route: '/lectoguia' }
                    ].map((item) => (
                      <Button
                        key={item.name}
                        variant="ghost"
                        className="w-full justify-start text-purple-300 hover:text-white hover:bg-purple-600/20"
                        onClick={() => handleCycleNavigation(item.route)}
                      >
                        <item.icon className="w-4 h-4 mr-2" />
                        {item.name}
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Footer con Estado del Sistema */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-purple-400 text-sm"
          >
            <p>Sistema Neural HolÃ­stico â€¢ {cycleRecommendations.length} ciclos disponibles â€¢ Ãšltima actualizaciÃ³n: {new Date().toLocaleTimeString()}</p>
          </motion.div>
      </div>
    </GlobalCinematicProvider>
  );
};

export default NeuralMasterHub;
