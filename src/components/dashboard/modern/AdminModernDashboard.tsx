
import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  Users, TrendingUp, AlertTriangle, Settings, Download, Eye, 
  Server, Activity, Shield, Bell, Target, Award 
} from 'lucide-react';
import { useDashboardStats } from '@/hooks/use-dashboard-stats';

export const AdminModernDashboard: React.FC = () => {
  const { loading, stats } = useDashboardStats();

  // Mock admin data - in real app this would come from your admin analytics
  const systemMetrics = {
    totalUsers: 15847,
    activeUsers: 12453,
    completionRate: 87.2,
    avgScore: 673,
    totalExams: 45672,
    systemHealth: 98.5,
    serverLoad: 34.2,
    responseTime: 145
  };

  const usersByGrade = [
    { grade: '1° Medio', count: 2847, active: 2234, percentage: 78.5 },
    { grade: '2° Medio', count: 3521, active: 2876, percentage: 81.7 },
    { grade: '3° Medio', count: 4982, active: 4123, percentage: 82.8 },
    { grade: '4° Medio', count: 4497, active: 3220, percentage: 71.6 }
  ];

  const skillsPerformance = [
    { skill: 'Competencia Lectora', avg: 678, trend: '+3.2%', students: 8342 },
    { skill: 'Matemática M1', avg: 642, trend: '+1.8%', students: 7234 },
    { skill: 'Matemática M2', avg: 598, trend: '+2.1%', students: 6891 },
    { skill: 'Historia', avg: 656, trend: '+4.1%', students: 5672 },
    { skill: 'Ciencias', avg: 671, trend: '+2.9%', students: 6234 }
  ];

  const systemAlerts = [
    { type: 'warning', title: 'Servidor de Simulacros', message: 'Latencia elevada (450ms)', priority: 'medium' },
    { type: 'success', title: 'Engagement Estudiantil', message: '+15% esta semana', priority: 'low' },
    { type: 'info', title: 'Actualización Pendiente', message: 'Nuevos nodos de Historia disponibles', priority: 'low' },
    { type: 'error', title: 'Base de Datos', message: 'Conexión inestable detectada', priority: 'high' }
  ];

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

  if (loading) {
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
                <span>277 nodos activos • 15.8k usuarios registrados</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end mb-2">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse" />
              <span className="text-2xl font-bold text-green-400">{systemMetrics.systemHealth}%</span>
            </div>
            <div className="text-gray-300">Salud del Sistema</div>
            <div className="text-sm text-gray-400 mt-1">
              {systemMetrics.serverLoad}% carga • {systemMetrics.responseTime}ms
            </div>
          </div>
        </div>
      </motion.div>

      {/* Admin Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminMetricCard
          title="Usuarios Totales"
          value={systemMetrics.totalUsers.toLocaleString()}
          subtitle={`${systemMetrics.activeUsers.toLocaleString()} activos`}
          icon={<Users className="w-6 h-6" />}
          gradient="from-blue-600 to-blue-700"
          trend="+12.5% este mes"
        />
        <AdminMetricCard
          title="Tasa de Finalización"
          value={`${systemMetrics.completionRate}%`}
          subtitle="Promedio mensual"
          icon={<Target className="w-6 h-6" />}
          gradient="from-green-600 to-green-700"
          trend="+2.3% vs mes anterior"
        />
        <AdminMetricCard
          title="Puntaje Promedio"
          value={systemMetrics.avgScore}
          subtitle="Todas las materias"
          icon={<Award className="w-6 h-6" />}
          gradient="from-yellow-600 to-orange-600"
          trend="+8 puntos"
        />
        <AdminMetricCard
          title="Carga del Servidor"
          value={`${systemMetrics.serverLoad}%`}
          subtitle={`${systemMetrics.responseTime}ms respuesta`}
          icon={<Server className="w-6 h-6" />}
          gradient="from-purple-600 to-purple-700"
          status={systemMetrics.serverLoad > 80 ? 'warning' : 'normal'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Users by Grade */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Distribución por Curso</h2>
            <Users className="w-5 h-5 text-gray-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={usersByGrade}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="grade" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }}
              />
              <Bar dataKey="count" fill="#3B82F6" name="Total" radius={[4, 4, 0, 0]} />
              <Bar dataKey="active" fill="#10B981" name="Activos" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Skills Performance */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Rendimiento por Materia</h2>
            <TrendingUp className="w-5 h-5 text-gray-600" />
          </div>
          <div className="space-y-4">
            {skillsPerformance.map((skill, index) => (
              <motion.div 
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div>
                  <div className="font-medium text-gray-800">{skill.skill}</div>
                  <div className="text-2xl font-bold text-blue-600">{skill.avg}</div>
                  <div className="text-sm text-gray-500">{skill.students.toLocaleString()} estudiantes</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    skill.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {skill.trend}
                  </div>
                  <div className="text-sm text-gray-500">vs mes anterior</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Alerts */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Alertas del Sistema</h2>
            <Bell className="w-5 h-5 text-gray-600" />
          </div>
          <div className="space-y-4">
            {systemAlerts.map((alert, index) => (
              <motion.div 
                key={index}
                className={`flex items-center p-4 rounded-xl border ${
                  alert.type === 'error' ? 'bg-red-50 border-red-200' :
                  alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                  alert.type === 'success' ? 'bg-green-50 border-green-200' :
                  'bg-blue-50 border-blue-200'
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className={`p-2 rounded-lg mr-3 ${
                  alert.type === 'error' ? 'bg-red-100' :
                  alert.type === 'warning' ? 'bg-yellow-100' :
                  alert.type === 'success' ? 'bg-green-100' :
                  'bg-blue-100'
                }`}>
                  {alert.type === 'error' ? <AlertTriangle className="w-5 h-5 text-red-600" /> :
                   alert.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-yellow-600" /> :
                   alert.type === 'success' ? <TrendingUp className="w-5 h-5 text-green-600" /> :
                   <Bell className="w-5 h-5 text-blue-600" />}
                </div>
                <div className="flex-grow">
                  <div className={`font-medium ${
                    alert.type === 'error' ? 'text-red-800' :
                    alert.type === 'warning' ? 'text-yellow-800' :
                    alert.type === 'success' ? 'text-green-800' :
                    'text-blue-800'
                  }`}>
                    {alert.title}
                  </div>
                  <div className={`text-sm ${
                    alert.type === 'error' ? 'text-red-600' :
                    alert.type === 'warning' ? 'text-yellow-600' :
                    alert.type === 'success' ? 'text-green-600' :
                    'text-blue-600'
                  }`}>
                    {alert.message}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                  alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {alert.priority}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
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
              className="flex items-center p-4 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-900 hover:to-black transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Settings className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Configuración Sistema</div>
                <div className="text-sm text-gray-300">Ajustar parámetros globales</div>
              </div>
            </motion.button>
            
            <motion.button 
              className="flex items-center p-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Exportar Datos</div>
                <div className="text-sm text-blue-100">Descargar reportes analíticos</div>
              </div>
            </motion.button>
            
            <motion.button 
              className="flex items-center p-4 rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Eye className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Ver Logs del Sistema</div>
                <div className="text-sm text-green-100">Monitorear actividad en tiempo real</div>
              </div>
            </motion.button>
            
            <motion.button 
              className="flex items-center p-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Users className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Gestionar Usuarios</div>
                <div className="text-sm text-purple-100">Administrar cuentas y permisos</div>
              </div>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
