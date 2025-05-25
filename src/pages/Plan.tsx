
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, MapPin, Zap, Target, Calendar, Clock, PlayCircle, CheckCircle } from 'lucide-react';
import { useIntersectional } from '@/contexts/IntersectionalProvider';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Plan() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    isIntersectionalReady,
    neuralHealth,
    generateIntersectionalInsights,
    adaptToUser
  } = useIntersectional();

  // Métricas de estrategia neural adaptativa
  const strategicMetrics = React.useMemo(() => ({
    strategicEfficiency: Math.round(neuralHealth.neural_efficiency),
    adaptiveIndex: Math.round(neuralHealth.adaptive_learning_score),
    goalAlignment: Math.round(neuralHealth.user_experience_harmony),
    executionRate: Math.round(neuralHealth.cross_pollination_rate),
    activePlans: Math.floor(neuralHealth.neural_efficiency / 25),
    completedMilestones: Math.floor(neuralHealth.adaptive_learning_score / 20)
  }), [neuralHealth]);

  const handlePlanAction = (actionType: string, planId?: string) => {
    adaptToUser({
      plan_action: actionType,
      plan_id: planId,
      strategic_context: 'neural_optimization',
      efficiency_level: strategicMetrics.strategicEfficiency
    });
    
    console.log(`🎯 Acción de plan: ${actionType}`, { planId });
  };

  const strategicPlans = [
    {
      id: 'comprehensive_paes',
      title: 'Plan Integral PAES',
      description: 'Estrategia neurológica completa para optimización de resultados',
      icon: Target,
      color: 'from-blue-500 to-purple-500',
      status: 'active',
      progress: strategicMetrics.strategicEfficiency,
      duration: '16 semanas',
      priority: 'high'
    },
    {
      id: 'cognitive_optimization',
      title: 'Optimización Cognitiva',
      description: 'Mejora adaptativa de patrones de pensamiento',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      status: 'active',
      progress: strategicMetrics.adaptiveIndex,
      duration: '12 semanas',
      priority: 'high'
    },
    {
      id: 'skill_reinforcement',
      title: 'Refuerzo de Habilidades',
      description: 'Fortalecimiento específico de áreas débiles',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      status: 'planning',
      progress: strategicMetrics.goalAlignment,
      duration: '8 semanas',
      priority: 'medium'
    },
    {
      id: 'strategic_review',
      title: 'Revisión Estratégica',
      description: 'Análisis y ajuste periódico de objetivos',
      icon: MapPin,
      color: 'from-green-500 to-teal-500',
      status: 'scheduled',
      progress: strategicMetrics.executionRate,
      duration: '4 semanas',
      priority: 'low'
    }
  ];

  const weeklySchedule = [
    { day: 'Lunes', focus: 'Comprensión Lectora', intensity: 85, duration: '2h' },
    { day: 'Martes', focus: 'Matemática M1', intensity: 92, duration: '2.5h' },
    { day: 'Miércoles', focus: 'Ciencias', intensity: 78, duration: '2h' },
    { day: 'Jueves', focus: 'Matemática M2', intensity: 88, duration: '2.5h' },
    { day: 'Viernes', focus: 'Historia', intensity: 81, duration: '2h' },
    { day: 'Sábado', focus: 'Evaluación Integral', intensity: 95, duration: '3h' },
    { day: 'Domingo', focus: 'Revisión y Descanso', intensity: 45, duration: '1h' }
  ];

  const insights = generateIntersectionalInsights();

  if (!isIntersectionalReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-blue-900 flex items-center justify-center">
        <motion.div
          className="text-center text-white space-y-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full mx-auto animate-spin" />
          <div className="text-xl font-bold">Activando Estrategia Neural</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-blue-900 text-white">
      <div className="container mx-auto py-8 px-4">
        {/* Header Estratégico Neural */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <MapPin className="w-10 h-10 text-green-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Estrategia Neural Adaptativa
            </h1>
          </div>
          <p className="text-green-200 text-lg">
            Planificación Inteligente Personalizada • {user?.email || 'Usuario'}
          </p>
          <Badge className="mt-2 bg-green-600 text-white">
            Eficiencia Estratégica: {strategicMetrics.strategicEfficiency}%
          </Badge>
        </motion.div>

        {/* Métricas Estratégicas */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {[
            { label: 'Eficiencia', value: `${strategicMetrics.strategicEfficiency}%`, icon: Target, color: 'text-green-400' },
            { label: 'Adaptación', value: `${strategicMetrics.adaptiveIndex}%`, icon: Brain, color: 'text-blue-400' },
            { label: 'Alineación', value: `${strategicMetrics.goalAlignment}%`, icon: MapPin, color: 'text-purple-400' },
            { label: 'Planes Activos', value: strategicMetrics.activePlans, icon: Calendar, color: 'text-yellow-400' },
            { label: 'Hitos Logrados', value: strategicMetrics.completedMilestones, icon: CheckCircle, color: 'text-pink-400' }
          ].map((metric, index) => (
            <Card key={metric.label} className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <metric.icon className={`w-6 h-6 mx-auto mb-2 ${metric.color}`} />
                <div className="text-xl font-bold text-white">{metric.value}</div>
                <div className="text-xs text-white/70">{metric.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Planes Estratégicos */}
        <motion.div 
          className="grid md:grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {strategicPlans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <Card key={plan.id} className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${plan.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={
                        plan.status === 'active' ? "bg-green-600" :
                        plan.status === 'planning' ? "bg-yellow-600" : "bg-blue-600"
                      }>
                        {plan.status === 'active' ? 'Activo' :
                         plan.status === 'planning' ? 'Planeando' : 'Programado'}
                      </Badge>
                      <Badge variant="outline" className={
                        plan.priority === 'high' ? "border-red-400 text-red-400" :
                        plan.priority === 'medium' ? "border-yellow-400 text-yellow-400" : "border-green-400 text-green-400"
                      }>
                        {plan.priority === 'high' ? 'Alta' :
                         plan.priority === 'medium' ? 'Media' : 'Baja'}
                      </Badge>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{plan.title}</h3>
                  <p className="text-white/70 text-sm mb-4">{plan.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Progreso:</span>
                      <span className="text-white">{plan.progress}%</span>
                    </div>
                    <Progress value={plan.progress} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Duración:</span>
                      <span className="text-white">{plan.duration}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handlePlanAction('view', plan.id)}
                      size="sm"
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/20"
                    >
                      Ver Detalles
                    </Button>
                    {plan.status === 'active' && (
                      <Button 
                        onClick={() => handlePlanAction('continue', plan.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <PlayCircle className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Cronograma Semanal y Análisis */}
        <motion.div 
          className="grid lg:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-400" />
                Cronograma Neural Semanal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weeklySchedule.map((schedule, index) => (
                  <div key={schedule.day} className="bg-white/5 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-white">{schedule.day}</span>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-white/60" />
                        <span className="text-sm text-white/70">{schedule.duration}</span>
                      </div>
                    </div>
                    <div className="text-sm text-white/80 mb-2">{schedule.focus}</div>
                    <div className="flex items-center gap-2">
                      <Progress value={schedule.intensity} className="flex-1 h-2" />
                      <span className="text-xs text-white/60">{schedule.intensity}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Análisis Estratégico Neural
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.slice(0, 3).map((insight, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-purple-200 font-medium text-sm">{insight.title}</span>
                      <Badge className={
                        insight.level === 'excellent' ? "bg-green-600" :
                        insight.level === 'good' ? "bg-blue-600" : "bg-orange-600"
                      }>
                        {insight.level === 'excellent' ? 'Óptimo' :
                         insight.level === 'good' ? 'Bien' : 'Ajustar'}
                      </Badge>
                    </div>
                    <div className="text-xs text-white/70">
                      {insight.description}
                    </div>
                  </div>
                ))}
                
                <div className="pt-4 border-t border-white/10">
                  <Button 
                    onClick={() => handlePlanAction('optimize')}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Optimizar Estrategia Neural
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
