
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Download,
  RefreshCw,
  Mail,
  CheckCircle,
  Search,
  GraduationCap
} from 'lucide-react';
import { useUnifiedAnalytics } from '@/hooks/analytics/useUnifiedAnalytics';
import { useToast } from '@/hooks/use-toast';

interface UnifiedInstitutionalDashboardProps {
  institutionId: string;
}

export const UnifiedInstitutionalDashboard: React.FC<UnifiedInstitutionalDashboardProps> = ({
  institutionId
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    texto: '',
    region: '',
    area: ''
  });
  const { toast } = useToast();

  const {
    metrics,
    careerRecommendations,
    isLoading,
    error,
    generateReport,
    searchCareers,
    exportReport,
    clearCache
  } = useUnifiedAnalytics(institutionId);

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    setIsExporting(true);
    try {
      const blob = await exportReport(format);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte-unificado-${institutionId}.${format}`;
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

  const handleSearch = async () => {
    await searchCareers(searchFilters);
  };

  if (isLoading && !metrics) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-slate-600">Cargando sistema unificado de analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-600 mb-2">Error en Sistema Unificado</h3>
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={generateReport} variant="outline">
            Reintentar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Sistema Unificado PAES Master</h1>
          <p className="text-slate-600">Analytics institucional integrado con base de datos de universidades</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            variant="outline"
          >
            <Download className="w-4 h-4 mr-2" />
            PDF
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
            onClick={generateReport}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Métricas principales */}
      {metrics && (
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
      )}

      {/* Buscador de carreras */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Explorar Carreras Universitarias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Buscar carrera o universidad..."
              value={searchFilters.texto}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, texto: e.target.value }))}
              className="flex-1"
            />
            <Input
              placeholder="Región..."
              value={searchFilters.region}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, region: e.target.value }))}
              className="w-48"
            />
            <Input
              placeholder="Área..."
              value={searchFilters.area}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, area: e.target.value }))}
              className="w-48"
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </div>

          {careerRecommendations.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Resultados de búsqueda:</h4>
              {careerRecommendations.map((career, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{career.carrera}</p>
                    <p className="text-sm text-gray-600">{career.universidad}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{career.area_conocimiento}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Distribución de riesgo */}
      {metrics && (
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
                  <Badge variant="destructive">
                    {metrics.totalStudents > 0 ? Math.round((metrics.riskDistribution.high / metrics.totalStudents) * 100) : 0}%
                  </Badge>
                </div>
              </div>
              <Progress 
                value={metrics.totalStudents > 0 ? (metrics.riskDistribution.high / metrics.totalStudents) * 100 : 0} 
                className="h-2" 
              />

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  Riesgo Medio
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{metrics.riskDistribution.medium}</span>
                  <Badge variant="secondary">
                    {metrics.totalStudents > 0 ? Math.round((metrics.riskDistribution.medium / metrics.totalStudents) * 100) : 0}%
                  </Badge>
                </div>
              </div>
              <Progress 
                value={metrics.totalStudents > 0 ? (metrics.riskDistribution.medium / metrics.totalStudents) * 100 : 0} 
                className="h-2" 
              />

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  Bajo Riesgo
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{metrics.riskDistribution.low}</span>
                  <Badge className="bg-green-600">
                    {metrics.totalStudents > 0 ? Math.round((metrics.riskDistribution.low / metrics.totalStudents) * 100) : 0}%
                  </Badge>
                </div>
              </div>
              <Progress 
                value={metrics.totalStudents > 0 ? (metrics.riskDistribution.low / metrics.totalStudents) * 100 : 0} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Acciones rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button onClick={generateReport} variant="outline" disabled={isLoading}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerar Métricas
            </Button>
            <Button onClick={clearCache} variant="outline">
              Limpiar Cache
            </Button>
            <Button onClick={() => handleExport('csv')} variant="outline" disabled={isExporting}>
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
