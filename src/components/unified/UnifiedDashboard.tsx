
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calendar,
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Download,
  RefreshCw,
  Target,
  GraduationCap,
  DollarSign,
  Clock,
  CheckCircle2,
  Award
} from 'lucide-react';
import { CentralizedEducationService, UnifiedDashboardData, PersonalizedAlert } from '@/services/unified/CentralizedEducationService';
import { useToast } from '@/hooks/use-toast';

interface UnifiedDashboardProps {
  userId: string;
}

export const UnifiedDashboard: React.FC<UnifiedDashboardProps> = ({ userId }) => {
  const [dashboardData, setDashboardData] = useState<UnifiedDashboardData | null>(null);
  const [alerts, setAlerts] = useState<PersonalizedAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, [userId]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [data, alertsData] = await Promise.all([
        CentralizedEducationService.getUnifiedDashboard(userId),
        CentralizedEducationService.getPersonalizedAlerts(userId)
      ]);
      setDashboardData(data);
      setAlerts(alertsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar el dashboard",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'excel' | 'json') => {
    try {
      setIsExporting(true);
      const blob = await CentralizedEducationService.exportCompleteReport(userId, format);
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `paes-master-reporte-${userId}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Exportación exitosa",
        description: `Reporte exportado en formato ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Error de exportación",
        description: "No se pudo exportar el reporte",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
        <div className="text-center text-white">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Cargando sistema unificado PAES Master...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
        <Card className="max-w-md mx-auto mt-20">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-600 mb-2">Error del Sistema</h3>
            <p className="text-gray-600 mb-4">No se pudo cargar la información del dashboard</p>
            <Button onClick={loadDashboardData} variant="outline">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { personalInfo, timeline, scholarships, careers, analytics } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Unificado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">PAES Master Unificado</h1>
            <p className="text-blue-200">Sistema centralizado de preparación y orientación</p>
            <Badge className="mt-2 bg-blue-600">
              Fase: {personalInfo.currentPhase.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => handleExport('json')} disabled={isExporting} variant="outline" className="text-white border-white">
              <Download className="w-4 h-4 mr-2" />
              JSON
            </Button>
            <Button onClick={() => handleExport('excel')} disabled={isExporting} variant="outline" className="text-white border-white">
              <Download className="w-4 h-4 mr-2" />
              Excel
            </Button>
            <Button onClick={loadDashboardData} disabled={isLoading} className="bg-white text-blue-900 hover:bg-blue-50">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </motion.div>

        {/* Alertas Urgentes */}
        {alerts.filter(a => a.priority === 'high').length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-3"
          >
            {alerts.filter(a => a.priority === 'high').slice(0, 3).map((alert) => (
              <Alert key={alert.id} className="border-red-500 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-700">
                  <strong>{alert.title}</strong>: {alert.message}
                </AlertDescription>
              </Alert>
            ))}
          </motion.div>
        )}

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Progreso General</p>
                    <p className="text-3xl font-bold">{analytics.overallProgress}%</p>
                    <Progress value={analytics.overallProgress} className="mt-2 bg-blue-400" />
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Preparación PAES</p>
                    <p className="text-3xl font-bold">{analytics.paesReadiness}%</p>
                    <Progress value={analytics.paesReadiness} className="mt-2 bg-green-400" />
                  </div>
                  <Target className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Ahorro Potencial</p>
                    <p className="text-2xl font-bold">${(scholarships.potentialSavings / 1000000).toFixed(1)}M</p>
                    <p className="text-sm text-purple-200">{scholarships.compatibleBenefits.length} becas compatibles</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Carreras Compatible</p>
                    <p className="text-3xl font-bold">{careers.compatibleCareers.length}</p>
                    <p className="text-sm text-orange-200">{careers.recommendations.length} recomendadas</p>
                  </div>
                  <GraduationCap className="w-8 h-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Timeline y Cronograma */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Calendar className="w-5 h-5" />
                  Próximas Fechas Críticas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeline.nextCriticalDate && (
                    <div className="p-4 bg-red-500/20 rounded-lg border border-red-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-red-400" />
                        <span className="text-red-300 font-medium">PRÓXIMA FECHA CRÍTICA</span>
                      </div>
                      <h4 className="font-bold text-white">{timeline.nextCriticalDate.proceso}</h4>
                      <p className="text-gray-300 text-sm">{timeline.nextCriticalDate.descripcion}</p>
                      <p className="text-red-300 font-medium mt-2">
                        {timeline.nextCriticalDate.dias_restantes} días restantes
                      </p>
                    </div>
                  )}
                  
                  {timeline.upcomingDates.slice(0, 4).map((fecha, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="font-medium text-white">{fecha.proceso}</p>
                        <p className="text-sm text-gray-300">{fecha.descripcion}</p>
                      </div>
                      <Badge variant="outline" className="text-blue-300 border-blue-300">
                        {fecha.dias_restantes}d
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Award className="w-5 h-5" />
                  Análisis Académico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-green-300 mb-2">Fortalezas Detectadas</h4>
                    <div className="flex flex-wrap gap-2">
                      {analytics.subjectStrengths.map((strength, index) => (
                        <Badge key={index} className="bg-green-600 text-white">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-yellow-300 mb-2">Áreas de Mejora</h4>
                    <div className="flex flex-wrap gap-2">
                      {analytics.areasForImprovement.map((area, index) => (
                        <Badge key={index} variant="outline" className="text-yellow-300 border-yellow-300">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="flex justify-between text-sm text-gray-300 mb-2">
                      <span>Preparación PAES</span>
                      <span>{analytics.paesReadiness}%</span>
                    </div>
                    <Progress value={analytics.paesReadiness} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recomendaciones de Carrera */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <GraduationCap className="w-5 h-5" />
                Recomendaciones de Carrera Personalizadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {careers.recommendations.slice(0, 6).map((carrera, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h4 className="font-medium text-white mb-2">{carrera.nombre}</h4>
                    <p className="text-sm text-gray-300 mb-2">{carrera.universidad}</p>
                    <div className="flex justify-between items-center">
                      <Badge className="bg-blue-600 text-white">
                        {carrera.area_conocimiento}
                      </Badge>
                      <span className="text-sm text-blue-300">
                        {carrera.puntaje_corte_2024} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Beneficios y Becas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <DollarSign className="w-5 h-5" />
                Beneficios Disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scholarships.compatibleBenefits.slice(0, 6).map((beneficio, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white">{beneficio.nombre}</h4>
                      <Badge 
                        className={
                          beneficio.compatibilidad >= 90 ? "bg-green-600" :
                          beneficio.compatibilidad >= 70 ? "bg-yellow-600" : "bg-gray-600"
                        }
                      >
                        {beneficio.compatibilidad}%
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{beneficio.categoria}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-300">
                        ${(beneficio.monto_anual / 1000000).toFixed(1)}M/año
                      </span>
                      <Badge variant="outline" className="text-green-300 border-green-300">
                        {beneficio.estado_postulacion}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Acciones Rápidas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Acciones del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button onClick={loadDashboardData} variant="outline" className="text-white border-white">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Actualizar Datos
                </Button>
                <Button onClick={() => handleExport('pdf')} variant="outline" className="text-white border-white" disabled={isExporting}>
                  <Download className="w-4 h-4 mr-2" />
                  Reporte PDF
                </Button>
                <Button 
                  onClick={() => CentralizedEducationService.clearCache()} 
                  variant="outline" 
                  className="text-white border-white"
                >
                  Limpiar Cache
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
};
