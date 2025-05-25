
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Target, 
  Calendar, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Play,
  BarChart3,
  Zap,
  Users,
  Award,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDiagnosticSystem } from '@/hooks/diagnostic/useDiagnosticSystem';
import { useLearningPlans } from '@/hooks/learning-plans/use-learning-plans';
import { useCalendarEvents } from '@/hooks/calendar/useCalendarEvents';
import { useLectoGuiaUnified } from '@/hooks/lectoguia/useLectoGuiaUnified';
import { useAuth } from '@/contexts/AuthContext';

export const CinematicUnifiedDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<string>('overview');
  
  // Hooks para datos reales
  const diagnosticSystem = useDiagnosticSystem();
  const { plans, currentPlan, isLoading: plansLoading } = useLearningPlans();
  const { events, isLoading: eventsLoading } = useCalendarEvents();
  const lectoGuiaSystem = useLectoGuiaUnified(user?.id);

  // Estado local para métricas calculadas
  const [metrics, setMetrics] = useState({
    totalStudyTime: 0,
    completedNodes: 0,
    weeklyProgress: 0,
    nextDeadline: null as Date | null,
    currentStreak: 0,
    skillsImproved: 0
  });

  // Calcular métricas en tiempo real
  useEffect(() => {
    if (diagnosticSystem.isSystemReady && currentPlan && events.length > 0) {
      const completedNodes = diagnosticSystem.learningNodes.filter(
        node => node.progress >= 80
      ).length;
      
      const upcomingEvents = events.filter(
        event => new Date(event.start_date) > new Date()
      );
      
      const nextDeadline = upcomingEvents.length > 0 
        ? new Date(upcomingEvents[0].start_date)
        : null;

      setMetrics({
        totalStudyTime: completedNodes * 45, // Estimación
        completedNodes,
        weeklyProgress: Math.min((completedNodes / diagnosticSystem.learningNodes.length) * 100, 100),
        nextDeadline,
        currentStreak: Math.floor(completedNodes / 5),
        skillsImproved: diagnosticSystem.tier1Nodes.length
      });
    }
  }, [diagnosticSystem, currentPlan, events]);

  const quickActions = [
    {
      id: 'start-session',
      title: 'Iniciar Sesión de Estudio',
      description: 'Continúa con tu nodo recomendado',
      icon: Play,
      color: 'from-blue-500 to-cyan-500',
      action: () => navigate('/lectoguia'),
      urgent: true
    },
    {
      id: 'diagnostic',
      title: 'Diagnóstico Rápido',
      description: 'Evalúa tu progreso actual',
      icon: Brain,
      color: 'from-purple-500 to-violet-500',
      action: () => navigate('/diagnostico')
    },
    {
      id: 'calendar',
      title: 'Ver Calendario',
      description: 'Gestiona tu horario de estudio',
      icon: Calendar,
      color: 'from-green-500 to-emerald-500',
      action: () => navigate('/calendario')
    },
    {
      id: 'plan',
      title: 'Mi Plan de Estudio',
      description: 'Revisa tu progreso y objetivos',
      icon: Target,
      color: 'from-orange-500 to-red-500',
      action: () => navigate('/plan')
    }
  ];

  const systemStatus = {
    diagnostic: {
      status: diagnosticSystem.isSystemReady ? 'ready' : 'loading',
      data: `${diagnosticSystem.learningNodes.length} nodos disponibles`
    },
    plan: {
      status: currentPlan ? 'active' : 'pending',
      data: currentPlan ? currentPlan.title : 'Sin plan activo'
    },
    calendar: {
      status: events.length > 0 ? 'active' : 'empty',
      data: `${events.length} eventos programados`
    },
    lectoguia: {
      status: lectoGuiaSystem.systemState.phase === 'ready' ? 'ready' : 'initializing',
      data: lectoGuiaSystem.validationStatus.isValid ? 'Sistema coherente' : 'Validando...'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header cinemático */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-3xl" />
        <div className="relative z-10 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Centro de Control PAES
            </h1>
            <p className="text-xl text-cyan-200 mb-8">
              Tu comando centralizado para el éxito académico
            </p>
            
            {/* Métricas principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-xl rounded-lg p-4 border border-cyan-500/30"
              >
                <div className="text-2xl font-bold text-cyan-400">{metrics.completedNodes}</div>
                <div className="text-sm text-gray-300">Nodos Completados</div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-xl rounded-lg p-4 border border-blue-500/30"
              >
                <div className="text-2xl font-bold text-blue-400">{Math.round(metrics.weeklyProgress)}%</div>
                <div className="text-sm text-gray-300">Progreso Semanal</div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-xl rounded-lg p-4 border border-purple-500/30"
              >
                <div className="text-2xl font-bold text-purple-400">{metrics.totalStudyTime}m</div>
                <div className="text-sm text-gray-300">Tiempo de Estudio</div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-xl rounded-lg p-4 border border-green-500/30"
              >
                <div className="text-2xl font-bold text-green-400">{metrics.currentStreak}</div>
                <div className="text-sm text-gray-300">Racha Actual</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Panel de navegación */}
      <div className="px-8 py-6">
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {['overview', 'study', 'progress', 'schedule'].map((section) => (
            <Button
              key={section}
              onClick={() => setActiveSection(section)}
              variant={activeSection === section ? 'default' : 'outline'}
              className={`
                px-6 py-3 rounded-lg transition-all duration-300
                ${activeSection === section 
                  ? 'bg-cyan-500 hover:bg-cyan-600 text-white' 
                  : 'border-gray-600 text-gray-300 hover:bg-gray-800'
                }
              `}
            >
              {section === 'overview' && 'Resumen'}
              {section === 'study' && 'Estudio'}
              {section === 'progress' && 'Progreso'}
              {section === 'schedule' && 'Calendario'}
            </Button>
          ))}
        </div>

        {/* Contenido dinámico por sección */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeSection === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Acciones rápidas */}
              <Card className="lg:col-span-2 bg-gray-800/50 backdrop-blur-xl border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Acciones Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quickActions.map((action) => (
                      <motion.div
                        key={action.id}
                        whileHover={{ scale: 1.02 }}
                        className={`
                          relative p-4 rounded-lg cursor-pointer transition-all duration-300
                          bg-gradient-to-r ${action.color} hover:shadow-lg
                          ${action.urgent ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}
                        `}
                        onClick={action.action}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/20 rounded-lg">
                            <action.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white">{action.title}</h4>
                            <p className="text-sm text-white/80">{action.description}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-white/60" />
                        </div>
                        {action.urgent && (
                          <div className="absolute -top-1 -right-1">
                            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Estado del sistema */}
              <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-400" />
                    Estado del Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(systemStatus).map(([system, status]) => (
                    <div key={system} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          status.status === 'ready' || status.status === 'active' 
                            ? 'bg-green-400' 
                            : status.status === 'loading' || status.status === 'initializing'
                            ? 'bg-yellow-400 animate-pulse'
                            : 'bg-gray-400'
                        }`} />
                        <span className="text-white capitalize">{system}</span>
                      </div>
                      <span className="text-sm text-gray-400">{status.data}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'study' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Nodos recomendados */}
              <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    Nodos Recomendados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {diagnosticSystem.tier1Nodes.slice(0, 5).map((node, index) => (
                      <motion.div
                        key={node.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-3 bg-gray-700/50 rounded-lg cursor-pointer border border-gray-600 hover:border-blue-500 transition-all"
                        onClick={() => navigate('/lectoguia')}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-medium">{node.title}</h4>
                            <p className="text-sm text-gray-400">{node.estimatedTimeMinutes} min</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              Prioridad {index + 1}
                            </Badge>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Plan actual */}
              <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-400" />
                    Plan de Estudio Actual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentPlan ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-medium">{currentPlan.title}</h4>
                        <p className="text-sm text-gray-400">{currentPlan.description}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Progreso</span>
                          <span className="text-cyan-400">{currentPlan.progress?.percentage || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                            style={{ width: `${currentPlan.progress?.percentage || 0}%` }}
                          />
                        </div>
                      </div>
                      <Button 
                        onClick={() => navigate('/plan')}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        Ver Plan Completo
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">No tienes un plan de estudio activo</p>
                      <Button 
                        onClick={() => navigate('/plan')}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Crear Plan
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'progress' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Métricas de progreso */}
              <Card className="lg:col-span-2 bg-gray-800/50 backdrop-blur-xl border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Análisis de Progreso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-cyan-400 mb-2">
                        {diagnosticSystem.learningNodes.length}
                      </div>
                      <div className="text-sm text-gray-400">Nodos Totales</div>
                    </div>
                    <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-400 mb-2">
                        {metrics.completedNodes}
                      </div>
                      <div className="text-sm text-gray-400">Completados</div>
                    </div>
                    <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-400 mb-2">
                        {Math.round(metrics.weeklyProgress)}%
                      </div>
                      <div className="text-sm text-gray-400">Progreso Total</div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      onClick={() => navigate('/diagnostico')}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Ver Análisis Detallado
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Logros */}
              <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-400" />
                    Logros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {metrics.currentStreak > 0 && (
                      <div className="flex items-center gap-3 p-2 bg-yellow-500/20 rounded-lg">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-black">{metrics.currentStreak}</span>
                        </div>
                        <div>
                          <div className="text-white font-medium">Racha de Estudio</div>
                          <div className="text-xs text-gray-400">Sesiones consecutivas</div>
                        </div>
                      </div>
                    )}
                    
                    {metrics.completedNodes >= 5 && (
                      <div className="flex items-center gap-3 p-2 bg-blue-500/20 rounded-lg">
                        <CheckCircle className="w-8 h-8 text-blue-400" />
                        <div>
                          <div className="text-white font-medium">Estudiante Dedicado</div>
                          <div className="text-xs text-gray-400">5+ nodos completados</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'schedule' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Próximos eventos */}
              <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    Próximos Eventos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {events.length > 0 ? (
                    <div className="space-y-3">
                      {events.slice(0, 5).map((event) => (
                        <div key={event.id} className="p-3 bg-gray-700/50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-white font-medium">{event.title}</h4>
                              <p className="text-sm text-gray-400">
                                {new Date(event.start_date).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {event.event_type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">No hay eventos programados</p>
                    </div>
                  )}
                  
                  <Button 
                    onClick={() => navigate('/calendario')}
                    className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700"
                  >
                    Gestionar Calendario
                  </Button>
                </CardContent>
              </Card>

              {/* Resumen de tiempo */}
              <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-400" />
                    Gestión del Tiempo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-400 mb-2">
                        {metrics.totalStudyTime}
                      </div>
                      <div className="text-sm text-gray-400">Minutos esta semana</div>
                    </div>
                    
                    {metrics.nextDeadline && (
                      <div className="p-3 bg-red-500/20 rounded-lg border border-red-500/30">
                        <div className="text-red-300 font-medium">Próximo Deadline</div>
                        <div className="text-sm text-red-200">
                          {metrics.nextDeadline.toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
