
import React from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, BarChart, Bar 
} from 'recharts';
import { 
  TrendingUp, Bell, Calendar, Award, User, Heart, 
  BookOpen, Target, Clock, MessageCircle, AlertTriangle 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const ParentModernDashboard: React.FC = () => {
  const { profile } = useAuth();

  // Mock parent data - in real app this would come from your parent analytics
  const studentData = {
    studentName: "María González",
    parentName: "Carmen González",
    relationship: "Madre",
    notifications: 3,
    lastLogin: "2025-01-18 14:30",
    weeklyReport: {
      studyHours: 12.5,
      sessionsCompleted: 8,
      avgScore: 78.2,
      improvement: '+5.3%'
    }
  };

  const monthlyProgress = [
    { month: 'Oct', score: 650, hours: 45, sessions: 28 },
    { month: 'Nov', score: 665, hours: 52, sessions: 32 },
    { month: 'Dec', score: 678, hours: 48, sessions: 30 },
    { month: 'Ene', score: 685, hours: 38, sessions: 24 }
  ];

  const concerns = [
    { area: 'Matemática M2', level: 'medio', message: 'Necesita refuerzo en funciones', priority: 'medium' },
    { area: 'Tiempo de estudio', level: 'bajo', message: 'Menos horas esta semana', priority: 'low' },
    { area: 'Simulacros', level: 'alto', message: 'Bajo rendimiento en últimos tests', priority: 'high' }
  ];

  const achievements = [
    { title: 'Racha de 10 días', date: '2025-01-15', icon: '🔥', type: 'streak' },
    { title: 'Mejor puntaje en Historia', date: '2025-01-12', icon: '🏆', type: 'score' },
    { title: 'Completó módulo Ciencias', date: '2025-01-08', icon: '🧬', type: 'completion' }
  ];

  const upcomingEvents = [
    { event: 'Simulacro Nacional', date: '25 ENE', description: 'Inscripción hasta el 22', type: 'exam' },
    { event: 'Reunión Padres', date: '2 FEB', description: 'Progreso académico', type: 'meeting' },
    { event: 'PAES Oficial', date: '1 DIC', description: '287 días restantes', type: 'official' }
  ];

  const ParentMetricCard = ({ 
    title, 
    value, 
    subtitle, 
    icon, 
    gradient = "from-green-500 to-green-600", 
    trend,
    concern = false
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    gradient?: string;
    trend?: string;
    concern?: boolean;
  }) => (
    <motion.div
      className={`relative bg-gradient-to-br ${gradient} rounded-2xl p-6 text-white shadow-xl ${
        concern ? 'border-2 border-yellow-300' : ''
      }`}
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
      {concern && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
      )}
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Parent Hero Header */}
      <motion.div 
        className="relative bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-black/10 rounded-3xl" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-5xl mr-6">👩‍👧</div>
            <div>
              <h1 className="text-3xl font-bold mb-2">¡Hola, {studentData.parentName}!</h1>
              <p className="text-green-100 text-lg">Seguimiento de {studentData.studentName}</p>
              <div className="flex items-center text-green-200 mt-1">
                <Heart className="w-4 h-4 mr-2" />
                <span>Último acceso: {studentData.lastLogin}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold mb-1">{studentData.weeklyReport.avgScore.toFixed(1)}%</div>
            <div className="text-green-200">Promedio Semanal</div>
            <div className="text-green-100 text-sm mt-1">{studentData.weeklyReport.improvement}</div>
          </div>
        </div>
      </motion.div>

      {/* Parent Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ParentMetricCard
          title="Mejora General"
          value={studentData.weeklyReport.improvement}
          subtitle="vs semana anterior"
          icon={<TrendingUp className="w-6 h-6" />}
          gradient="from-purple-500 to-purple-600"
        />
        <ParentMetricCard
          title="Horas de Estudio"
          value={`${studentData.weeklyReport.studyHours}h`}
          subtitle="Esta semana"
          icon={<Clock className="w-6 h-6" />}
          gradient="from-blue-500 to-blue-600"
        />
        <ParentMetricCard
          title="Sesiones Completadas"
          value={studentData.weeklyReport.sessionsCompleted}
          subtitle="de 10 programadas"
          icon={<BookOpen className="w-6 h-6" />}
          gradient="from-green-500 to-green-600"
        />
        <ParentMetricCard
          title="Notificaciones"
          value={studentData.notifications}
          subtitle="Sin leer"
          icon={<Bell className="w-6 h-6" />}
          gradient="from-red-500 to-red-600"
          concern={studentData.notifications > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Evolution */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Evolución Mensual</h2>
            <TrendingUp className="w-5 h-5 text-gray-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis domain={[600, 720]} tick={{ fontSize: 12 }} />
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
                dataKey="score" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.3}
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-between text-sm text-gray-600">
            <span>Puntaje inicial: 650</span>
            <span>Puntaje actual: 685</span>
            <span className="text-green-600 font-medium">+35 puntos</span>
          </div>
        </motion.div>

        {/* Areas of Concern */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Áreas de Atención</h2>
            <AlertTriangle className="w-5 h-5 text-gray-600" />
          </div>
          <div className="space-y-4">
            {concerns.map((concern, index) => (
              <motion.div 
                key={index}
                className={`p-4 rounded-xl border-l-4 ${
                  concern.priority === 'high' ? 'bg-red-50 border-red-400' :
                  concern.priority === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                  'bg-blue-50 border-blue-400'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">{concern.area}</div>
                    <div className="text-sm text-gray-600 mt-1">{concern.message}</div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    concern.priority === 'high' ? 'bg-red-100 text-red-800' :
                    concern.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {concern.level}
                  </div>
                </div>
              </motion.div>
            ))}
            <div className="p-4 rounded-xl bg-green-50 border-l-4 border-green-400">
              <div className="flex items-center">
                <div className="text-green-600 mr-3">✓</div>
                <div>
                  <div className="font-medium text-green-800">Competencia Lectora</div>
                  <div className="text-sm text-green-600">Excelente progreso, mantener el ritmo</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Achievements */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Logros Recientes</h2>
            <Award className="w-5 h-5 text-gray-600" />
          </div>
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <motion.div 
                key={index}
                className="flex items-center p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 hover:shadow-md transition-all"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="text-3xl mr-4">{achievement.icon}</div>
                <div className="flex-grow">
                  <div className="font-medium text-gray-800">{achievement.title}</div>
                  <div className="text-sm text-gray-600">{achievement.date}</div>
                </div>
                <div className={`p-2 rounded-lg ${
                  achievement.type === 'streak' ? 'bg-red-100' :
                  achievement.type === 'score' ? 'bg-yellow-100' :
                  'bg-green-100'
                }`}>
                  <Award className="w-4 h-4 text-yellow-600" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Home Recommendations */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recomendaciones</h2>
            <Target className="w-5 h-5 text-gray-600" />
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <div className="flex items-start">
                <div className="text-blue-600 mr-3 mt-1">💡</div>
                <div>
                  <div className="font-medium text-blue-800">Horario de Estudio</div>
                  <div className="text-sm text-blue-600">Establecer rutina fija de 2 horas diarias entre 16:00-18:00</div>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-green-50 border border-green-200">
              <div className="flex items-start">
                <div className="text-green-600 mr-3 mt-1">📚</div>
                <div>
                  <div className="font-medium text-green-800">Refuerzo Matemáticas</div>
                  <div className="text-sm text-green-600">Considerar clases particulares para Matemática M2</div>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
              <div className="flex items-start">
                <div className="text-purple-600 mr-3 mt-1">🎯</div>
                <div>
                  <div className="font-medium text-purple-800">Motivación</div>
                  <div className="text-sm text-purple-600">Celebrar pequeños logros para mantener motivación alta</div>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
              <div className="flex items-start">
                <div className="text-orange-600 mr-3 mt-1">⚖️</div>
                <div>
                  <div className="font-medium text-orange-800">Balance</div>
                  <div className="text-sm text-orange-600">Asegurar tiempo para descanso y actividades recreativas</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Upcoming Important Dates */}
      <motion.div 
        className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 border border-purple-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-xl font-bold mb-6 text-purple-800">Fechas Importantes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingEvents.map((event, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center mb-2">
                <Calendar className={`w-5 h-5 mr-2 ${
                  event.type === 'official' ? 'text-red-600' :
                  event.type === 'exam' ? 'text-purple-600' :
                  'text-blue-600'
                }`} />
                <span className="font-medium text-gray-800">{event.event}</span>
              </div>
              <div className={`text-2xl font-bold ${
                event.type === 'official' ? 'text-red-600' :
                event.type === 'exam' ? 'text-purple-600' :
                'text-blue-600'
              }`}>
                {event.date}
              </div>
              <div className="text-sm text-gray-600">{event.description}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Communication */}
      <motion.div 
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Comunicación Rápida</h2>
          <MessageCircle className="w-5 h-5 text-gray-600" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3 text-gray-700">Enviar Mensaje al Tutor</h3>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={4}
              placeholder="Escriba su consulta o comentario..."
            />
            <motion.button 
              className="mt-3 px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Enviar Mensaje
            </motion.button>
          </div>
          <div>
            <h3 className="font-medium mb-3 text-gray-700">Solicitudes Rápidas</h3>
            <div className="space-y-2">
              {[
                { icon: '📊', text: 'Solicitar reporte detallado de progreso' },
                { icon: '📅', text: 'Agendar reunión con tutor' },
                { icon: '🎯', text: 'Ajustar metas de estudio' },
                { icon: '⚙️', text: 'Cambiar configuración de notificaciones' }
              ].map((item, index) => (
                <motion.button 
                  key={index}
                  className="w-full text-left p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="mr-2">{item.icon}</span>
                  <span className="text-sm text-gray-700">{item.text}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
