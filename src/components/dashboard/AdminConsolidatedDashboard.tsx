
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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

  // Mock data - en producción vendría de APIs reales
  const costData = {
    monthlySpent: 847.32,
    monthlyBudget: 1200,
    dailyAverage: 28.24,
    topModels: [
      { name: 'GPT-4', cost: 234.56, usage: 15234 },
      { name: 'Claude-3', cost: 187.43, usage: 12456 },
      { name: 'Gemini Pro', cost: 156.78, usage: 9876 }
    ],
    alerts: [
      { type: 'warning', message: 'Consumo alto en GPT-4 este mes' },
      { type: 'info', message: 'Nuevo modelo disponible: Claude-3.5' }
    ]
  };

  const systemData = {
    uptime: 99.8,
    activeUsers: 1247,
    requestsToday: 45632,
    errorRate: 0.12,
    services: [
      { name: 'OpenRouter API', status: 'active', latency: 145 },
      { name: 'Supabase', status: 'active', latency: 87 },
      { name: 'Neural Engine', status: 'warning', latency: 234 }
    ]
  };

  const userData = {
    totalUsers: 2847,
    activeToday: 342,
    newThisWeek: 89,
    retention: 73.5,
    topActivities: [
      { activity: 'LectoGuía Chat', users: 892 },
      { activity: 'Diagnósticos', users: 567 },
      { activity: 'Plan Estudios', users: 445 }
    ]
  };

  const handleModeSwitch = (mode: AdminViewMode) => {
    setCurrentMode(mode);
  };

  // Cost Management Mode
  const renderCostMode = () => (
    <div className="space-y-6">
      {/* Cost Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-white">Gasto Mensual</span>
            </div>
            <div className="text-2xl font-bold text-white">${costData.monthlySpent}</div>
            <div className="text-sm text-gray-400">
              de ${costData.monthlyBudget} presupuestado
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-white">Promedio Diario</span>
            </div>
            <div className="text-2xl font-bold text-white">${costData.dailyAverage}</div>
            <div className="text-sm text-green-400">-12% vs mes anterior</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-white">Uso Presupuesto</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {Math.round((costData.monthlySpent / costData.monthlyBudget) * 100)}%
            </div>
            <Progress 
              value={(costData.monthlySpent / costData.monthlyBudget) * 100} 
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
            <div className="text-2xl font-bold text-white">{costData.alerts.length}</div>
            <div className="text-sm text-yellow-400">Requieren atención</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Models Usage */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Modelos Más Usados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {costData.topModels.map((model, index) => (
              <div key={model.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <div className="text-white font-medium">{model.name}</div>
                  <div className="text-sm text-gray-400">{model.usage.toLocaleString()} tokens</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">${model.cost}</div>
                  <Badge variant="outline" className="text-xs">
                    #{index + 1}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Alertas de Costos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {costData.alerts.map((alert, index) => (
              <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${
                alert.type === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/30' :
                'bg-blue-500/10 border border-blue-500/30'
              }`}>
                <AlertTriangle className={`w-4 h-4 ${
                  alert.type === 'warning' ? 'text-yellow-400' : 'text-blue-400'
                }`} />
                <span className="text-white">{alert.message}</span>
              </div>
            ))}
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
            <div className="text-sm text-blue-400">En las últimas 24h</div>
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
              <span className="text-sm font-medium text-white">Retención</span>
            </div>
            <div className="text-2xl font-bold text-white">{userData.retention}%</div>
            <Progress value={userData.retention} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Top Activities */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Actividades Más Populares</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userData.topActivities.map((activity, index) => (
              <div key={activity.activity} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <div className="text-white font-medium">{activity.activity}</div>
                  <div className="text-sm text-gray-400">Usuarios únicos</div>
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
