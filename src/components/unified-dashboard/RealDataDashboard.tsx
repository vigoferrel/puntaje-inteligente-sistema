
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Calendar,
  GraduationCap,
  RefreshCw,
  Zap,
  Users,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRealDashboardData } from '@/hooks/dashboard/useRealDashboardData';
import { useRealUserMetrics } from '@/hooks/useRealUserMetrics';
import { useNeuralIntegration } from '@/hooks/use-neural-integration';

interface RealDataDashboardProps {
  userId: string;
}

export const RealDataDashboard: React.FC<RealDataDashboardProps> = ({ userId }) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Hooks de datos reales
  const { 
    metrics: dashboardMetrics, 
    systemStatus, 
    isLoading: dashboardLoading,
    navigateToSection,
    getSmartRecommendations,
    refreshData
  } = useRealDashboardData();
  
  const { 
    metrics: userMetrics, 
    isLoading: userLoading, 
    error: userError 
  } = useRealUserMetrics();
  
  // Sistema neural integrado
  const {
    broadcastUserAction,
    notifyEngagement,
    systemHealth,
    integrationLevel
  } = useNeuralIntegration('dashboard', [
    'real_data_integration',
    'user_metrics_tracking',
    'smart_recommendations',
    'navigation_optimization'
  ]);

  // Actualizar hora cada minuto
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Notificar engagement al sistema neural
  useEffect(() => {
    if (userId) {
      notifyEngagement({
        type: 'dashboard_access',
        user_id: userId,
        integration_level: integrationLevel,
        timestamp: Date.now()
      });
    }
  }, [userId, notifyEngagement, integrationLevel]);

  const handleModuleNavigation = (route: string, context?: any) => {
    broadcastUserAction('MODULE_NAVIGATION', {
      target_route: route,
      context,
      from: 'unified_dashboard'
    });
    navigate(route);
  };

  const smartRecommendations = getSmartRecommendations();

  if (dashboardLoading || userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header con datos reales */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
            <Brain className="w-10 h-10 text-blue-400" />
            Dashboard PAES Master
          </h1>
          <p className="text-white/80 text-xl">
            Sistema Integrado con Datos Reales - {currentTime.toLocaleDateString()}
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-white/60">
            <span>Neural Level: {Math.round(integrationLevel)}%</span>
            <span>•</span>
            <span>Sistema: {systemStatus.neural?.status}</span>
            <span>•</span>
            <span>Última actualización: {new Date().toLocaleTimeString()}</span>
          </div>
        </motion.div>

        {/* Métricas principales con datos reales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Nodos Completados</p>
                  <p className="text-2xl font-bold text-white">{dashboardMetrics.completedNodes}</p>
                </div>
                <div className="p-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-600">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Progreso Semanal</p>
                  <p className="text-2xl font-bold text-white">{dashboardMetrics.weeklyProgress}%</p>
                </div>
                <div className="p-3 rounded-full bg-gradient-to-r from-blue-400 to-indigo-600">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Puntaje Predicho</p>
                  <p className="text-2xl font-bold text-white">{dashboardMetrics.predictedScore}</p>
                </div>
                <div className="p-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-600">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Tiempo Total</p>
                  <p className="text-2xl font-bold text-white">{userMetrics.totalStudyTime}h</p>
                </div>
                <div className="p-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-600">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estado del sistema con datos reales */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Estado del Sistema Neural
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(systemStatus).map(([key, status]) => (
                <div key={key} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${
                    status.status === 'active' ? 'bg-green-400' :
                    status.status === 'ready' ? 'bg-blue-400' :
                    status.status === 'loading' ? 'bg-yellow-400' :
                    'bg-red-400'
                  }`} />
                  <div>
                    <p className="text-white font-medium capitalize">{key}</p>
                    <p className="text-white/70 text-sm">{status.data}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recomendaciones inteligentes */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Recomendaciones Inteligentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {smartRecommendations.map((rec) => (
                <div key={rec.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                     onClick={rec.action}>
                  <div className="flex items-center gap-3">
                    <Badge variant={rec.priority === 'urgent' ? 'destructive' : 'outline'}>
                      {rec.priority}
                    </Badge>
                    <div>
                      <p className="font-semibold text-white">{rec.title}</p>
                      <p className="text-white/80 text-sm">{rec.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/60" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Módulos principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all cursor-pointer group"
                onClick={() => handleModuleNavigation('/lectoguia')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">LectoGuía IA</h3>
                  <p className="text-white/70">Comprensión lectora adaptativa</p>
                </div>
              </div>
              <div className="text-sm text-white/60">
                Actividad Neural: {Math.round(systemHealth.neural_efficiency || 85)}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all cursor-pointer group"
                onClick={() => handleModuleNavigation('/diagnostic')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Diagnóstico Neural</h3>
                  <p className="text-white/70">Evaluación inteligente</p>
                </div>
              </div>
              <div className="text-sm text-white/60">
                Precisión: {Math.round(systemHealth.cross_pollination_rate || 78)}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all cursor-pointer group"
                onClick={() => handleModuleNavigation('/paes-universe')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">PAES Universe</h3>
                  <p className="text-white/70">Universo neural 3D</p>
                </div>
              </div>
              <div className="text-sm text-white/60">
                Integración: {Math.round(integrationLevel)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controles de actualización */}
        <div className="flex justify-center">
          <Button onClick={refreshData} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Actualizar Datos Reales
          </Button>
        </div>

      </div>
    </div>
  );
};
