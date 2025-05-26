
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  GraduationCap, 
  TrendingUp, 
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  BookOpen,
  DollarSign
} from 'lucide-react';
import { useUnifiedEducation } from '@/hooks/unified/useUnifiedEducation';

interface UnifiedDashboardProps {
  userId: string;
}

export const UnifiedDashboard: React.FC<UnifiedDashboardProps> = ({ userId }) => {
  const {
    dashboard,
    isLoading,
    error,
    loadDashboard,
    refreshAlerts
  } = useUnifiedEducation(userId);

  if (isLoading) {
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-400" />
            <h2 className="text-xl font-bold mb-2">Error al cargar el dashboard</h2>
            <p className="text-white/80 mb-4">{error}</p>
            <Button onClick={loadDashboard} variant="outline">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!dashboard) {
    return <div>No hay datos disponibles</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header con información personal */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-8"
        >
          <h1 className="text-4xl font-bold text-white">
            Dashboard Unificado PAES 🎯
          </h1>
          {dashboard.personalInfo && (
            <p className="text-white/80 text-xl">
              Bienvenido, {dashboard.personalInfo.name} - Meta: {dashboard.personalInfo.targetScore} puntos
            </p>
          )}
        </motion.div>

        {/* Alertas Importantes */}
        {dashboard.alerts && dashboard.alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {dashboard.alerts.slice(0, 3).map((alert) => (
              <Card key={alert.id} className={`border-2 ${
                alert.priority === 'urgent' ? 'border-red-500 bg-red-50/10' :
                alert.priority === 'high' ? 'border-orange-500 bg-orange-50/10' :
                'border-blue-500 bg-blue-50/10'
              } backdrop-blur-md`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {alert.priority === 'urgent' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                      {alert.priority === 'high' && <Clock className="w-5 h-5 text-orange-500" />}
                      {alert.priority === 'medium' && <CheckCircle className="w-5 h-5 text-blue-500" />}
                      <div>
                        <h3 className="font-semibold text-white">{alert.title}</h3>
                        <p className="text-white/80 text-sm">{alert.message}</p>
                      </div>
                    </div>
                    <Badge variant={alert.priority === 'urgent' ? 'destructive' : 'outline'}>
                      {alert.priority}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Progreso General</p>
                    <p className="text-2xl font-bold">{Math.round(dashboard.analytics.averageProgress * 100)}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
                <Progress value={dashboard.analytics.averageProgress * 100} className="mt-3" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Preparación PAES</p>
                    <p className="text-2xl font-bold">{Math.round(dashboard.analytics.paesReadiness * 100)}%</p>
                  </div>
                  <Target className="w-8 h-8 text-blue-400" />
                </div>
                <Progress value={dashboard.analytics.paesReadiness * 100} className="mt-3" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Beneficios Financieros</p>
                    <p className="text-2xl font-bold">${dashboard.scholarships.length > 0 ? Math.round((dashboard.scholarships[0].potentialSavings || 0) / 1000000) : 0}M</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-yellow-400" />
                </div>
                <p className="text-xs text-white/60 mt-2">{dashboard.scholarships.length > 0 ? dashboard.scholarships[0].compatibleBenefits || 0 : 0} becas compatibles</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Carreras Compatibles</p>
                    <p className="text-2xl font-bold">{dashboard.careers.length > 0 ? dashboard.careers[0].compatibleCareers || 0 : 0}</p>
                  </div>
                  <GraduationCap className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-xs text-white/60 mt-2">{dashboard.careers.length > 0 ? (dashboard.careers[0].recommendations?.length || 0) : 0} recomendaciones</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Timeline de Fechas Críticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Fechas Críticas PAES
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboard.timeline.length > 0 && dashboard.timeline[0].nextCriticalDate && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">🚨 Próxima fecha crítica</h4>
                  <p className="text-white/90">{dashboard.timeline[0].nextCriticalDate.proceso}</p>
                  <p className="text-white/70 text-sm">{dashboard.timeline[0].nextCriticalDate.descripcion}</p>
                  <p className="text-red-300 font-semibold mt-2">
                    ⏰ {dashboard.timeline[0].nextCriticalDate.dias_restantes} días restantes
                  </p>
                </div>
              )}
              
              <div className="space-y-3">
                <h4 className="font-semibold text-white">Próximas fechas importantes:</h4>
                {dashboard.timeline.length > 0 && dashboard.timeline[0].upcomingDates ? 
                  dashboard.timeline[0].upcomingDates.slice(0, 5).map((evento) => (
                    <div key={evento.fecha_id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <h5 className="font-medium text-white">{evento.proceso}</h5>
                        <p className="text-white/70 text-sm">{evento.descripcion}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">{evento.dias_restantes} días</p>
                        <p className="text-white/60 text-xs">{new Date(evento.fecha_inicio).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )) :
                  <p className="text-white/60">No hay fechas programadas</p>
                }
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Análisis de Fortalezas y Debilidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Fortalezas Identificadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dashboard.analytics.subjectStrengths.map((strength, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-white">{strength}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  Áreas de Mejora
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dashboard.analytics.areasForImprovement.map((area, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span className="text-white">{area}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Preparación PAES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5" />
                Estado de Preparación PAES
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/80">Preparación General</span>
                    <span className="text-white font-semibold">{Math.round(dashboard.analytics.paesReadiness * 100)}%</span>
                  </div>
                  <Progress value={dashboard.analytics.paesReadiness * 100} className="h-3" />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{dashboard.analytics.totalStudents}</p>
                    <p className="text-white/60 text-sm">Total estudiantes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{dashboard.analytics.activeStudents}</p>
                    <p className="text-white/60 text-sm">Estudiantes activos</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recomendaciones de Carreras */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Carreras Recomendadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboard.careers.length > 0 && dashboard.careers[0].recommendations ? 
                  dashboard.careers[0].recommendations.slice(0, 3).map((career) => (
                    <div key={career.carrera_id} className="p-4 bg-white/5 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-white">{career.nombre_carrera}</h4>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(career.probabilidad_ingreso * 100)}% prob.
                        </Badge>
                      </div>
                      <p className="text-white/70 text-sm">{career.universidad}</p>
                      <div className="flex justify-between text-xs text-white/60 mt-2">
                        <span>Puntaje corte: {career.puntaje_corte}</span>
                        <span>Vacantes: {career.vacantes}</span>
                      </div>
                    </div>
                  )) :
                  <p className="text-white/60">No hay recomendaciones disponibles</p>
                }
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Beneficios Financieros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="w-5 h-5" />
                Beneficios Financieros Disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboard.scholarships.length > 0 && dashboard.scholarships[0].compatibleBenefits ? 
                  dashboard.scholarships.slice(0, 3).map((beca) => (
                    <div key={beca.beneficio_id} className="p-4 bg-white/5 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-white">{beca.nombre}</h4>
                        <Badge variant="outline" className="text-xs">
                          {beca.compatibilidad}% compatible
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Categoría: {beca.categoria}</span>
                        {beca.monto_anual > 0 && (
                          <span className="text-green-400 font-semibold">
                            ${Math.round(beca.monto_anual / 1000000)}M/año
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/60 mt-1">
                        Cierre: {new Date(beca.fecha_cierre).toLocaleDateString()}
                      </p>
                    </div>
                  )) :
                  <p className="text-white/60">No hay beneficios disponibles</p>
                }
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Botones de Acción */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="flex gap-4 justify-center"
        >
          <Button onClick={loadDashboard} className="bg-blue-600 hover:bg-blue-700">
            <BookOpen className="w-4 h-4 mr-2" />
            Actualizar Dashboard
          </Button>
          <Button onClick={refreshAlerts} variant="outline">
            Refrescar Alertas
          </Button>
        </motion.div>

      </div>
    </div>
  );
};
