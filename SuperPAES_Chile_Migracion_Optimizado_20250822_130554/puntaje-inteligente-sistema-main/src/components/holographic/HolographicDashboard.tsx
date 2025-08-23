/* eslint-disable react-refresh/only-export-components */
// HolographicDashboard.tsx - Dashboard hologrÃ¡fico avanzado
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RealAdminDataService, AdminMetrics } from '@/services/RealAdminDataService';
import { RealPAESDataService, PAESProgress } from '@/services/RealPAESDataService';
import { CrossModuleAnalytics, CrossModuleData } from '@/services/cross-module-analytics';

interface HolographicDashboardProps {
  userId?: string;
  theme?: 'light' | 'dark' | 'holographic';
}

export const HolographicDashboard: React.FC<HolographicDashboardProps> = ({
  userId = 'default',
  theme = 'holographic'
}) => {
  const [adminMetrics, setAdminMetrics] = useState<AdminMetrics | null>(null);
  const [paesProgress, setPaesProgress] = useState<PAESProgress | null>(null);
  const [moduleData, setModuleData] = useState<CrossModuleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        const [metrics, progress, modules] = await Promise.all([
          RealAdminDataService.getMetrics(),
          RealPAESDataService.getProgress(userId),
          Promise.resolve(CrossModuleAnalytics.getAllMetrics())
        ]);

        setAdminMetrics(metrics);
        setPaesProgress(progress);
        setModuleData(modules);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [userId]);

  const getThemeClasses = () => {
    switch (theme) {
      case 'holographic':
        return 'bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm border-cyan-500/30';
      case 'dark':
        return 'bg-gray-900 border-gray-700';
      default:
        return 'bg-white border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Dashboard HologrÃ¡fico
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Sistema de monitoreo cuÃ¡ntico en tiempo real
        </p>
      </div>

      {/* MÃ©tricas Administrativas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={getThemeClasses()}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-cyan-400">
              Usuarios Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {adminMetrics?.totalUsers || 0}
            </div>
            <Badge variant="secondary" className="mt-2">
              Sistema Activo
            </Badge>
          </CardContent>
        </Card>

        <Card className={getThemeClasses()}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-400">
              Usuarios Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {adminMetrics?.activeUsers || 0}
            </div>
            <Badge variant="outline" className="mt-2 border-purple-400 text-purple-400">
              24h
            </Badge>
          </CardContent>
        </Card>

        <Card className={getThemeClasses()}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-400">
              Salud del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {adminMetrics?.systemHealth || 0}%
            </div>
            <Badge variant="default" className="mt-2 bg-green-500">
              Ã“ptimo
            </Badge>
          </CardContent>
        </Card>

        <Card className={getThemeClasses()}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-400">
              Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {adminMetrics?.performanceScore || 0}%
            </div>
            <Badge variant="outline" className="mt-2 border-yellow-400 text-yellow-400">
              Excelente
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Progreso PAES */}
      <Card className={getThemeClasses()}>
        <CardHeader>
          <CardTitle className="text-cyan-400">Progreso PAES</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-white">
                {paesProgress?.completedExercises || 0}
              </div>
              <div className="text-sm text-gray-400">Ejercicios Completados</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">
                {paesProgress?.averageScore?.toFixed(1) || '0.0'}
              </div>
              <div className="text-sm text-gray-400">Promedio</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">
                {paesProgress?.totalExercises || 0}
              </div>
              <div className="text-sm text-gray-400">Total Ejercicios</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MÃ©tricas de MÃ³dulos */}
      <Card className={getThemeClasses()}>
        <CardHeader>
          <CardTitle className="text-purple-400">Analytics Cross-Module</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {moduleData && Object.entries(moduleData).map(([key, module]) => (
              <div key={key} className="text-center p-4 rounded-lg bg-black/20">
                <div className="text-lg font-bold text-white capitalize">
                  {module.moduleName}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  Uso: {module.usage} | Rendimiento: {module.performance}%
                </div>
                <Badge 
                  variant={module.errors === 0 ? "default" : "destructive"}
                  className="mt-2"
                >
                  {module.errors === 0 ? 'Estable' : `${module.errors} errores`}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HolographicDashboard;
