
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Download,
  RefreshCw,
  Mail,
  CheckCircle
} from 'lucide-react';
import { useEnhancedInstitutionalAnalytics } from '@/hooks/analytics/useEnhancedInstitutionalAnalytics';
import { useToast } from '@/hooks/use-toast';

interface EnhancedInstitutionalDashboardProps {
  institutionId: string;
}

export const EnhancedInstitutionalDashboard: React.FC<EnhancedInstitutionalDashboardProps> = ({
  institutionId
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isSendingReports, setIsSendingReports] = useState(false);
  const { toast } = useToast();

  const {
    metrics,
    isLoading,
    error,
    generateReport,
    generateParentReports,
    exportReport,
    clearCache
  } = useEnhancedInstitutionalAnalytics(institutionId);

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    setIsExporting(true);
    try {
      const blob = await exportReport(format);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte-institucional-${institutionId}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Exportación exitosa",
          description: `Reporte exportado en formato ${format.toUpperCase()}`,
        });
      }
    } catch (err) {
      toast({
        title: "Error de exportación",
        description: "No se pudo exportar el reporte",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleSendParentReports = async () => {
    setIsSendingReports(true);
    try {
      await generateParentReports();
      toast({
        title: "Reportes enviados",
        description: "Los reportes para padres han sido generados y enviados",
      });
    } catch (err) {
      toast({
        title: "Error enviando reportes",
        description: "No se pudieron enviar los reportes a los padres",
        variant: "destructive",
      });
    } finally {
      setIsSendingReports(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-slate-600">Generando analytics avanzados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-600 mb-2">Error en Analytics</h3>
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={generateReport} variant="outline">
            Reintentar
          </Button>
        </div>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">No hay datos disponibles</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con acciones */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Analytics Institucional Avanzado</h1>
          <p className="text-slate-600">Sistema unificado con métricas predictivas</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            variant="outline"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
          <Button 
            onClick={() => handleExport('excel')}
            disabled={isExporting}
            variant="outline"
          >
            <Download className="w-4 h-4 mr-2" />
            Excel
          </Button>
          <Button 
            onClick={handleSendParentReports}
            disabled={isSendingReports}
            className="bg-green-600 hover:bg-green-700"
          >
            <Mail className="w-4 h-4 mr-2" />
            {isSendingReports ? 'Enviando...' : 'Enviar Reportes'}
          </Button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Estudiantes</p>
                  <p className="text-3xl font-bold">{metrics.totalStudents}</p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Estudiantes Activos</p>
                  <p className="text-3xl font-bold">{metrics.activeStudents}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Engagement Promedio</p>
                  <p className="text-3xl font-bold">{Math.round(metrics.averageEngagement * 100)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Progreso General</p>
                  <p className="text-3xl font-bold">{Math.round(metrics.overallProgress * 100)}%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Distribución de riesgo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Riesgo Académico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  Riesgo Alto
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{metrics.riskDistribution.high}</span>
                  <Badge variant="destructive">{Math.round((metrics.riskDistribution.high / metrics.totalStudents) * 100)}%</Badge>
                </div>
              </div>
              <Progress value={(metrics.riskDistribution.high / metrics.totalStudents) * 100} className="h-2" />

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  Riesgo Medio
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{metrics.riskDistribution.medium}</span>
                  <Badge variant="secondary">{Math.round((metrics.riskDistribution.medium / metrics.totalStudents) * 100)}%</Badge>
                </div>
              </div>
              <Progress value={(metrics.riskDistribution.medium / metrics.totalStudents) * 100} className="h-2" />

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  Bajo Riesgo
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{metrics.riskDistribution.low}</span>
                  <Badge className="bg-green-600">{Math.round((metrics.riskDistribution.low / metrics.totalStudents) * 100)}%</Badge>
                </div>
              </div>
              <Progress value={(metrics.riskDistribution.low / metrics.totalStudents) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Rendimiento por materia */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento por Materia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(metrics.subjectPerformance).map(([subject, performance]) => (
                <div key={subject} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{subject}</span>
                    <span className="font-bold">{Math.round(performance * 100)}%</span>
                  </div>
                  <Progress value={performance * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Métricas predictivas (si están disponibles) */}
      {(metrics as any).predictive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="text-blue-800">Métricas Predictivas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-blue-600">Tendencia de Rendimiento</p>
                  <Badge className={`
                    ${(metrics as any).predictive.performanceTrend === 'increasing' ? 'bg-green-500' : 
                      (metrics as any).predictive.performanceTrend === 'stable' ? 'bg-yellow-500' : 'bg-red-500'}
                  `}>
                    {(metrics as any).predictive.performanceTrend === 'increasing' ? '↗ Mejorando' :
                     (metrics as any).predictive.performanceTrend === 'stable' ? '→ Estable' : '↘ Disminuyendo'}
                  </Badge>
                </div>
                <div className="text-center">
                  <p className="text-sm text-blue-600">Estudiantes en Riesgo de Deserción</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {(metrics as any).predictive.riskPrediction.predictedDropouts}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-blue-600">Probabilidad de Éxito</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {Math.round((metrics as any).predictive.goalProjection.successProbability)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Acciones rápidas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button onClick={generateReport} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar Datos
              </Button>
              <Button onClick={clearCache} variant="outline">
                Limpiar Cache
              </Button>
              <Button onClick={() => handleExport('csv')} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
