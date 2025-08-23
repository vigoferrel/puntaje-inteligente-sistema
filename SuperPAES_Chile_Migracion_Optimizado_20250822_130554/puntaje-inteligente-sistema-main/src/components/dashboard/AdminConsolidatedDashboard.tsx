/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Settings,
  Database,
  Users,
  Activity,
  FileText,
  BarChart3,
  Clock,
  Shield,
  Zap
} from 'lucide-react';
import { RealAdminDataService } from '../../services/dashboard/RealAdminDataService';

type AdminViewMode = 'cost' | 'system' | 'users';

interface AdminConsolidatedDashboardProps {
  initialMode?: AdminViewMode;
  className?: string;
}

export const AdminConsolidatedDashboard: React.FC<AdminConsolidatedDashboardProps> = ({ 
  initialMode = 'cost',
  className 
}) => {
  const [currentMode, setCurrentMode] = useState<AdminViewMode>(initialMode);
  const [costData, setCostData] = useState<unknown>(null);
  const [systemData, setSystemData] = useState<unknown>(null);
  const [userData, setUserData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  const loadRealData = async () => {
    try {
      setLoading(true);
      const [cost, system, users] = await Promise.all([
        RealAdminDataService.getCostData(),
        RealAdminDataService.getSystemData(),
        RealAdminDataService.getUserData()
      ]);

      setCostData(cost);
      setSystemData(system);
      setUserData(users);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-depsuseEffect(() => {
    loadRealData();
  }, []);useEffect(() => {
    loadRealData();
  }, []);

  const handleModeSwitch = (mode: AdminViewMode) => {
    setCurrentMode(mode);
  };

  // Cost Management Mode with real data
  const renderCostMode = () => (
    <div className="space-y-6">
      {/* Cost Overview with real data */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-white">Gasto Mensual</span>
            </div>
            <div className="text-2xl font-bold text-white">
              ${costData?.monthlySpent || 0}
            </div>
            <div className="text-sm text-gray-400">
              de ${costData?.monthlyBudget || 1200} presupuestado
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-white">Promedio Diario</span>
            </div>
            <div className="text-2xl font-bold text-white">
              ${costData?.dailyAverage || 0}
            </div>
            <div className="text-sm text-green-400">Tiempo real</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-white">Uso Presupuesto</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {costData ? Math.round((costData.monthlySpent / costData.monthlyBudget) * 100) : 0}%
            </div>
            <Progress 
              value={costData ? (costData.monthlySpent / costData.monthlyBudget) * 100 : 0} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-white">Alertas</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {costData?.alerts?.length || 0}
            </div>
            <div className="text-sm text-yellow-400">Activas</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Models Usage with real data */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Modelos MÃ¡s Usados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {costData?.topModels?.length > 0 ? costData.topModels.map((model: unknown, index: number) => (
              <div key={model.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <div className="text-white font-medium">{model.name}</div>
                  <div className="text-sm text-gray-400">{model.usage.toLocaleString()} tokens</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">${model.cost.toFixed(2)}</div>
                  <Badge variant="outline" className="text-xs">
                    #{index + 1}
                  </Badge>
                </div>
              </div>
            )) : (
              <div className="text-center text-gray-400 py-4">
                No hay datos de modelos disponibles
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Alerts with real data */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Alertas de Costos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {costData?.alerts?.length > 0 ? costData.alerts.map((alert: unknown, index: number) => (
              <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${
                alert.type === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/30' :
                'bg-blue-500/10 border border-blue-500/30'
              }`}>
                <AlertTriangle className={`w-4 h-4 ${
                  alert.type === 'warning' ? 'text-yellow-400' : 'text-blue-400'
                }`} />
                <span className="text-white">{alert.message}</span>
              </div>
            )) : (
              <div className="text-center text-gray-400 py-4">
                No hay alertas activas
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // System Management Mode
  const renderSystemMode = () => (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-white">Uptime</span>
            </div>
            <div className="text-2xl font-bold text-white">{systemData.uptime}%</div>
            <div className="text-sm text-green-400">99.9% objetivo</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-white">Usuarios Activos</span>
            </div>
            <div className="text-2xl font-bold text-white">{systemData.activeUsers.toLocaleString()}</div>
            <div className="text-sm text-blue-400">En las Ãºltimas 24h</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-white">Requests Hoy</span>
            </div>
            <div className="text-2xl font-bold text-white">{systemData.requestsToday.toLocaleString()}</div>
            <div className="text-sm text-purple-400">+15% vs ayer</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-white">Error Rate</span>
            </div>
            <div className="text-2xl font-bold text-white">{systemData.errorRate}%</div>
            <div className="text-sm text-green-400">Dentro del objetivo</div>
          </CardContent>
        </Card>
      </div>

      {/* Services Status */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Estado de Servicios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemData.services.map((service) => (
              <div key={service.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    service.status === 'active' ? 'bg-green-400' :
                    service.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                  }`} />
                  <span className="text-white font-medium">{service.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-white">{service.latency}ms</div>
                  <Badge variant={service.status === 'active' ? 'default' : 'destructive'}>
                    {service.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // User Management Mode
  const renderUsersMode = () => (
    <div className="space-y-6">
      {/* User Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-white">Total Usuarios</span>
            </div>
            <div className="text-2xl font-bold text-white">{userData.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-blue-400">Registrados</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-white">Activos Hoy</span>
            </div>
            <div className="text-2xl font-bold text-white">{userData.activeToday}</div>
            <div className="text-sm text-green-400">+8% vs ayer</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-white">Nuevos (7d)</span>
            </div>
            <div className="text-2xl font-bold text-white">{userData.newThisWeek}</div>
            <div className="text-sm text-purple-400">Esta semana</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-white">RetenciÃ³n</span>
            </div>
            <div className="text-2xl font-bold text-white">{userData.retention}%</div>
            <Progress value={userData.retention} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Top Activities */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Actividades MÃ¡s Populares</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userData.topActivities.map((activity, index) => (
              <div key={activity.activity} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <div className="text-white font-medium">{activity.activity}</div>
                  <div className="text-sm text-gray-400">Usuarios Ãºnicos</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">{activity.users}</div>
                  <Badge variant="outline" className="text-xs">
                    #{index + 1}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      );
    }

    switch (currentMode) {
      case 'cost':
        return renderCostMode();
      case 'system':
        return renderSystemMode();
      case 'users':
        return renderUsersMode();
      default:
        return renderCostMode();
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-orange-900 p-6 ${className || ''}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <Card className="bg-black/40 backdrop-blur-xl border-red-500/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Settings className="w-12 h-12 text-red-400" />
                <div>
                  <CardTitle className="text-white text-4xl">Panel Administrativo</CardTitle>
                  <p className="text-red-300 text-lg">Control y monitoreo del sistema</p>
                </div>
              </div>
              
              {/* Mode Selector */}
              <div className="flex gap-2">
                <Button
                  variant={currentMode === 'cost' ? 'default' : 'outline'}
                  onClick={() => handleModeSwitch('cost')}
                  size="sm"
                >
                  Costos
                </Button>
                <Button
                  variant={currentMode === 'system' ? 'default' : 'outline'}
                  onClick={() => handleModeSwitch('system')}
                  size="sm"
                >
                  Sistema
                </Button>
                <Button
                  variant={currentMode === 'users' ? 'default' : 'outline'}
                  onClick={() => handleModeSwitch('users')}
                  size="sm"
                >
                  Usuarios
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Content */}
        <motion.div
          key={currentMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </motion.div>
    </div>
  );
};


