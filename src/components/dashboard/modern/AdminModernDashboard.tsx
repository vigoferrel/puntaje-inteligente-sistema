
import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  Users, TrendingUp, AlertTriangle, Settings, Download, Eye, 
  Server, Activity, Shield, Bell, Target, Award, DollarSign 
} from 'lucide-react';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';

export const AdminModernDashboard: React.FC = () => {
  const { analytics, isLoading, error } = useAdminAnalytics();

  const AdminMetricCard = ({ 
    title, 
    value, 
    subtitle, 
    icon, 
    gradient = "from-gray-600 to-gray-700", 
    trend,
    status = 'normal'
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    gradient?: string;
    trend?: string;
    status?: 'normal' | 'warning' | 'error';
  }) => (
    <motion.div
      className={`relative bg-gradient-to-br ${gradient} rounded-2xl p-6 text-white shadow-xl`}
      whileHover={{ scale: 1.02, y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {subtitle && <p className="text-white/70 text-sm mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">{trend}</span>
            </div>
          )}
        </div>
        <div className="bg-white/20 p-3 rounded-xl">
          {icon}
        </div>
      </div>
      {status !== 'normal' && (
        <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
          status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
        } animate-pulse`} />
      )}
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse space-y-6">
          <div className="h-48 bg-white/50 rounded-2xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-white/50 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar métricas</h3>
        <p className="text-gray-600">{error || 'No se pudieron cargar los datos'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Admin Hero Header */}
      <motion.div 
        className="relative bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-3xl p-8 text-white overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mr-6">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
              <p className="text-gray-300 text-lg">Sistema PAES Pro • Monitoreo en tiempo real</p>
              <div className="flex items-center text-gray-400 mt-1">
                <Activity className="w-4 h-4 mr-2" />
                <span>OpenRouter + Gemini Flash 1.5 • {analytics.topUsers.length} usuarios activos</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end mb-2">
              <DollarSign className="w-6 h-6 mr-2 text-green-400" />
              <span className="text-2xl font-bold text-green-400">
                ${analytics.monthlyMetrics.totalCost.toFixed(2)}
              </span>
            </div>
            <div className="text-gray-300">Costo Mensual</div>
            <div className="text-sm text-gray-400 mt-1">
              {analytics.monthlyMetrics.totalRequests} requests totales
            </div>
          </div>
        </div>
      </motion.div>

      {/* Admin Metrics con datos reales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminMetricCard
          title="Costo Diario"
          value={`$${analytics.dailyMetrics.totalCost.toFixed(4)}`}
          subtitle={`${analytics.dailyMetrics.totalRequests} requests`}
          icon={<DollarSign className="w-6 h-6" />}
          gradient="from-green-600 to-green-700"
          trend={`${analytics.dailyMetrics.successRate.toFixed(1)}% éxito`}
        />
        <AdminMetricCard
          title="Usuarios Activos"
          value={analytics.topUsers.length}
          subtitle="Este mes"
          icon={<Users className="w-6 h-6" />}
          gradient="from-blue-600 to-blue-700"
          trend="Mes activo"
        />
        <AdminMetricCard
          title="Tiempo Respuesta"
          value={`${analytics.monthlyMetrics.avgResponseTime.toFixed(0)}ms`}
          subtitle="Promedio mensual"
          icon={<Activity className="w-6 h-6" />}
          gradient="from-yellow-600 to-orange-600"
          trend="Optimizado"
        />
        <AdminMetricCard
          title="Alertas Activas"
          value={analytics.alerts.length}
          subtitle={`${analytics.alerts.filter(a => a.severity === 'high').length} críticas`}
          icon={<AlertTriangle className="w-6 h-6" />}
          gradient="from-red-600 to-red-700"
          status={analytics.alerts.length > 0 ? 'warning' : 'normal'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tendencias de costo en tiempo real */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Tendencias de Costo (30 días)</h2>
            <TrendingUp className="w-5 h-5 text-gray-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.costTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="cost" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Rendimiento por módulo con datos reales */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Rendimiento por Módulo</h2>
            <Target className="w-5 h-5 text-gray-600" />
          </div>
          <div className="space-y-4">
            {analytics.modulePerformance.map((module, index) => (
              <motion.div 
                key={module.module}
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div>
                  <div className="font-medium text-gray-800 capitalize">
                    {module.module.replace('_', ' ')}
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    ${module.cost.toFixed(4)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {module.requests} requests • {module.avgResponseTime}ms
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    module.successRate > 90 ? 'text-green-600' : 
                    module.successRate > 70 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {module.successRate.toFixed(1)}% éxito
                  </div>
                  <div className="text-sm text-gray-500">tasa de éxito</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top usuarios con datos reales */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Top Usuarios (Costo)</h2>
            <Users className="w-5 h-5 text-gray-600" />
          </div>
          <div className="space-y-4">
            {analytics.topUsers.slice(0, 8).map((user, index) => (
              <motion.div 
                key={user.userId}
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-600">${user.totalCost.toFixed(4)}</div>
                  <div className="text-sm text-gray-500">{user.totalRequests} requests</div>
                  <div className="text-xs text-green-600">Q: {user.avgQuality.toFixed(2)}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Acciones rápidas actualizadas */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Acciones Rápidas</h2>
            <Settings className="w-5 h-5 text-gray-600" />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <motion.button 
              className="flex items-center p-4 rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <DollarSign className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Configurar Límites</div>
                <div className="text-sm text-green-100">Establecer presupuestos por usuario</div>
              </div>
            </motion.button>
            
            <motion.button 
              className="flex items-center p-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Exportar Métricas</div>
                <div className="text-sm text-blue-100">Descargar reportes de costos</div>
              </div>
            </motion.button>
            
            <motion.button 
              className="flex items-center p-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Eye className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Monitor en Tiempo Real</div>
                <div className="text-sm text-purple-100">Ver actividad de OpenRouter</div>
              </div>
            </motion.button>
            
            <motion.button 
              className="flex items-center p-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <AlertTriangle className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Gestionar Alertas</div>
                <div className="text-sm text-red-100">
                  {analytics.alerts.length} alertas activas
                </div>
              </div>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
