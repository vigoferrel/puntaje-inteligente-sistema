
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, BookOpen, Target, TrendingUp, 
  Zap, Users, Award, Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNeuralIntegration } from '@/hooks/use-neural-integration';
import { useIntersectional } from '@/contexts/IntersectionalProvider';
import { NeuralDashboard } from '@/components/intersectional-nexus/NeuralDashboard';
import { Link } from 'react-router-dom';

export const SimplifiedDashboard: React.FC = () => {
  const { user } = useAuth();
  const { isIntersectionalReady, neuralHealth, generateIntersectionalInsights } = useIntersectional();
  
  // Integración neurológica del dashboard
  const neural = useNeuralIntegration('dashboard', [
    'user_navigation',
    'progress_tracking',
    'recommendation_engine'
  ], {
    currentPage: 'dashboard',
    userEngagement: 'active',
    lastActivity: Date.now()
  });

  const insights = generateIntersectionalInsights();

  // Datos simulados mejorados con neural feedback
  const dashboardData = {
    globalProgress: Math.round(neuralHealth.adaptive_learning_score || 68),
    completedActivities: 24,
    weeklyGoal: 85,
    nextRecommendation: insights[0] || {
      title: 'Continuar diagnóstico',
      description: 'Completa tu evaluación inicial',
      level: 'high'
    }
  };

  const handleNavigation = (destination: string, context?: any) => {
    neural.broadcastUserAction('NAVIGATE', {
      destination,
      context,
      from: 'dashboard',
      user_intent: 'exploration'
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header con estado neurológico */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <Brain className="w-8 h-8 text-purple-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Dashboard PAES Neural
          </h1>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Badge 
            className={isIntersectionalReady ? 'bg-green-500' : 'bg-yellow-500'}
          >
            {isIntersectionalReady ? '🧠 Sistema Neural Activo' : '⚡ Activando Red Neural'}
          </Badge>
          <Badge variant="outline">
            Armonía UX: {Math.round(neuralHealth.user_experience_harmony || 85)}%
          </Badge>
        </div>
      </motion.div>

      {/* Métricas principales con feedback neurológico */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-300">Progreso Neural</p>
                <p className="text-3xl font-bold text-white">{dashboardData.globalProgress}%</p>
              </div>
              <TrendingUp className="h-10 w-10 text-blue-400" />
            </div>
            <p className="text-xs text-blue-200 mt-2">
              Aprendizaje adaptativo: {Math.round(neuralHealth.adaptive_learning_score || 85)}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-300">Actividades</p>
                <p className="text-3xl font-bold text-white">{dashboardData.completedActivities}</p>
              </div>
              <Target className="h-10 w-10 text-green-400" />
            </div>
            <p className="text-xs text-green-200 mt-2">
              Eficiencia: {Math.round(neuralHealth.neural_efficiency || 90)}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-300">Meta Semanal</p>
                <p className="text-3xl font-bold text-white">{dashboardData.weeklyGoal}%</p>
              </div>
              <Award className="h-10 w-10 text-purple-400" />
            </div>
            <p className="text-xs text-purple-200 mt-2">
              Cross-pollination: {Math.round(neuralHealth.cross_pollination_rate || 75)}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-300">Insights</p>
                <p className="text-3xl font-bold text-white">{insights.length}</p>
              </div>
              <Brain className="h-10 w-10 text-orange-400" />
            </div>
            <p className="text-xs text-orange-200 mt-2">
              Nuevos patrones detectados
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Navegación inteligente con recomendaciones neurológicas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link to="/lectoguia" onClick={() => handleNavigation('lectoguia')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                LectoGuía Neural
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Sistema de comprensión lectora con IA adaptativa
              </p>
              <Badge className="mt-2 bg-blue-100 text-blue-800">
                Recomendado por IA
              </Badge>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link to="/diagnostico" onClick={() => handleNavigation('diagnostico')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                Diagnóstico Adaptativo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Evaluación inteligente que se adapta a tu nivel
              </p>
              <Badge className="mt-2 bg-green-100 text-green-800">
                {dashboardData.nextRecommendation.level === 'high' ? 'Prioridad Alta' : 'Disponible'}
              </Badge>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link to="/plan" onClick={() => handleNavigation('plan')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                Planes Inteligentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Planes de estudio generados por IA neurológica
              </p>
              <Badge className="mt-2 bg-purple-100 text-purple-800">
                Auto-optimización
              </Badge>
            </CardContent>
          </Link>
        </Card>
      </motion.div>

      {/* Dashboard Neural Completo */}
      {isIntersectionalReady && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <NeuralDashboard />
        </motion.div>
      )}

      {/* Insights Interseccionales */}
      {insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Insights Neurológicos Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.slice(0, 3).map((insight, index) => (
                  <div 
                    key={index}
                    className="p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-gray-100"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {insight.description}
                        </p>
                      </div>
                      <Badge 
                        variant={insight.level === 'excellent' ? 'default' : 
                                insight.level === 'good' ? 'secondary' : 'destructive'}
                      >
                        {insight.level}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
