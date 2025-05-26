
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Calendar, 
  GraduationCap, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Target,
  RefreshCw
} from 'lucide-react';
import { useUnifiedEducation } from '@/hooks/unified/useUnifiedEducation';

interface UnifiedDashboardProps {
  userId: string;
}

// Componente optimizado con memoización
const MetricCard = memo<{
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  index: number;
}>(({ title, value, icon: Icon, color, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className={`p-3 rounded-full bg-gradient-to-r ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
));

MetricCard.displayName = 'MetricCard';

// Loading component optimizado
const LoadingSpinner = memo(() => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
    />
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

// Error component optimizado
const ErrorDisplay = memo<{ error: string; onRetry: () => void }>(({ error, onRetry }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardContent className="p-8 text-center">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-400" />
        <h2 className="text-xl font-bold text-white mb-2">Error en el Sistema</h2>
        <p className="text-white/70 mb-4">{error}</p>
        <Button onClick={onRetry} variant="outline">
          Reintentar
        </Button>
      </CardContent>
    </Card>
  </div>
));

ErrorDisplay.displayName = 'ErrorDisplay';

export const UnifiedDashboard: React.FC<UnifiedDashboardProps> = memo(({ userId }) => {
  const {
    dashboard,
    optimalPath,
    alerts,
    isLoading,
    error,
    loadDashboard,
    calculateOptimalPath,
    refreshAlerts
  } = useUnifiedEducation(userId);

  if (isLoading && !dashboard) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={loadDashboard} />;
  }

  // Métricas optimizadas
  const metrics = dashboard ? [
    {
      title: 'Estudiantes Total',
      value: dashboard.analytics.totalStudents,
      icon: Users,
      color: 'from-blue-400 to-indigo-600'
    },
    {
      title: 'Estudiantes Activos',
      value: dashboard.analytics.activeStudents,
      icon: CheckCircle,
      color: 'from-green-400 to-emerald-600'
    },
    {
      title: 'Engagement Promedio',
      value: `${Math.round(dashboard.analytics.averageEngagement * 100)}%`,
      icon: TrendingUp,
      color: 'from-purple-400 to-pink-600'
    },
    {
      title: 'Progreso General',
      value: `${Math.round(dashboard.analytics.overallProgress * 100)}%`,
      icon: Target,
      color: 'from-yellow-400 to-orange-600'
    }
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header optimizado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-8"
        >
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
            <Brain className="w-10 h-10 text-blue-400" />
            Sistema PAES Master Unificado
          </h1>
          <p className="text-white/80 text-xl">
            Plataforma Integral de Preparación PAES con IA
          </p>
        </motion.div>

        {/* Métricas con memoización */}
        {dashboard && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <MetricCard key={metric.title} {...metric} index={index} />
            ))}
          </div>
        )}

        {/* Información del Calendario optimizada */}
        {dashboard?.calendar && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Calendario PAES
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-white/90 space-y-2">
                <p>Próxima fecha crítica: {new Date(dashboard.calendar.nextCriticalDate).toLocaleDateString()}</p>
                <p>Eventos próximos: {dashboard.calendar.totalEvents}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Información de Becas optimizada */}
        {dashboard?.scholarships && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Becas Disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-white/90 space-y-2">
                <p>Becas disponibles: {dashboard.scholarships.availableCount}</p>
                <p>Monto total: ${dashboard.scholarships.totalAmount.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alertas optimizadas */}
        {alerts.length > 0 && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Alertas Personalizadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <Badge variant={alert.priority === 'urgent' ? 'destructive' : 'outline'}>
                      {alert.priority}
                    </Badge>
                    <div className="flex-1">
                      <p className="font-semibold text-white">{alert.title}</p>
                      <p className="text-white/80 text-sm">{alert.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Acciones optimizadas */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Acciones del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button onClick={loadDashboard} disabled={isLoading}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar Dashboard
              </Button>
              <Button onClick={() => calculateOptimalPath()} disabled={isLoading}>
                Calcular Ruta Óptima
              </Button>
              <Button onClick={refreshAlerts} disabled={isLoading}>
                Refrescar Alertas
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
});

UnifiedDashboard.displayName = 'UnifiedDashboard';
