/* eslint-disable react-refresh/only-export-components */
import { FC, ReactNode } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell 
} from 'recharts';
import { 
  DollarSign, TrendingUp, AlertTriangle, Users, Activity, 
  Clock, CheckCircle, XCircle, Target, Settings
} from 'lucide-react';
import { useAdminAnalytics } from '../../hooks/useAdminAnalytics';

export const AdminCostDashboard: FC = () => {
  const { analytics, isLoading, error, resolveAlert, setUserLimits } = useAdminAnalytics();

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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar mÃ©tricas</h3>
        <p className="text-gray-600">{error || 'No se pudieron cargar los datos'}</p>
      </div>
    );
  }

  const CostMetricCard = ({ 
    title, 
    value, 
    subtitle, 
    icon, 
    gradient = "from-blue-600 to-blue-700", 
    trend,
    alertCount = 0
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: ReactNode;
    gradient?: string;
    trend?: string;
    alertCount?: number;
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
          <p className="text-3xl font-bold mt-2">${typeof value === 'number' ? value.toFixed(4) : value}</p>
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
      {alertCount > 0 && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-white">{alertCount}</span>
        </div>
      )}
    </motion.div>
  );

  const moduleColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="relative bg-gradient-to-r from-slate-800 via-slate-900 to-black rounded-3xl p-8 text-white overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Panel de Costos OpenRouter</h1>
              <p className="text-gray-300 text-lg">Monitoreo de uso y costos de Gemini Flash 1.5</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">
                ${analytics.monthlyMetrics.totalCost.toFixed(2)}
              </div>
              <div className="text-gray-300">Costo mensual</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* MÃ©tricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CostMetricCard
          title="Costo Diario"
          value={analytics.dailyMetrics.totalCost.toFixed(4)}
          subtitle={`${analytics.dailyMetrics.totalRequests} requests`}
          icon={<DollarSign className="w-6 h-6" />}
          gradient="from-green-600 to-green-700"
        />
        <CostMetricCard
          title="Costo Semanal"
          value={analytics.weeklyMetrics.totalCost.toFixed(3)}
          subtitle={`${analytics.weeklyMetrics.totalRequests} requests`}
          icon={<TrendingUp className="w-6 h-6" />}
          gradient="from-blue-600 to-blue-700"
        />
        <CostMetricCard
          title="Usuarios Activos"
          value={analytics.topUsers.length}
          subtitle="Este mes"
          icon={<Users className="w-6 h-6" />}
          gradient="from-purple-600 to-purple-700"
        />
        <CostMetricCard
          title="Alertas Activas"
          value={analytics.alerts.length}
          subtitle="Requieren atenciÃ³n"
          icon={<AlertTriangle className="w-6 h-6" />}
          gradient="from-red-600 to-red-700"
          alertCount={analytics.alerts.filter(a => a.severity === 'high').length}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tendencias de costo */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Tendencias de Costo (30 dÃ­as)</h2>
            <Activity className="w-5 h-5 text-gray-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.costTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentclassName="dynamic-bg" data-bg={'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }
              />
              <Line 
                type="monotone" 
                dataKey="cost" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Rendimiento por mÃ³dulo */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Rendimiento por MÃ³dulo</h2>
            <Target className="w-5 h-5 text-gray-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.modulePerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="module" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentclassName="dynamic-bg" data-bg={'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }
              />
              <Bar dataKey="cost" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top usuarios */}
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
            {analytics.topUsers.slice(0, 10).map((user, index) => (
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

        {/* Alertas activas */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Alertas Activas</h2>
            <AlertTriangle className="w-5 h-5 text-gray-600" />
          </div>
          <div className="space-y-4">
            {analytics.alerts.slice(0, 10).map((alert, index) => (
              <motion.div 
                key={alert.id}
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  alert.severity === 'high' ? 'bg-red-50 border-red-200' :
                  alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-blue-50 border-blue-200'
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex-grow">
                  <div className={`font-medium ${
                    alert.severity === 'high' ? 'text-red-800' :
                    alert.severity === 'medium' ? 'text-yellow-800' :
                    'text-blue-800'
                  }`}>
                    {alert.alert_type.replace('_', ' ')}
                  </div>
                  <div className={`text-sm ${
                    alert.severity === 'high' ? 'text-red-600' :
                    alert.severity === 'medium' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`}>
                    {alert.message}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(alert.triggered_at).toLocaleString()}
                  </div>
                </div>
                <motion.button
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    alert.severity === 'high' ? 'bg-red-600 text-white hover:bg-red-700' :
                    alert.severity === 'medium' ? 'bg-yellow-600 text-white hover:bg-yellow-700' :
                    'bg-blue-600 text-white hover:bg-blue-700'
                  } transition-colors`}
                  onClick={() => resolveAlert(alert.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Resolver
                </motion.button>
              </motion.div>
            ))}
            {analytics.alerts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                <p>No hay alertas activas</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};


