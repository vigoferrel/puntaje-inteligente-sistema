
import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
  AreaChart, Area, LineChart, Line 
} from 'recharts';
import { 
  Target, Clock, Award, Calendar, TrendingUp, BookOpen, 
  Brain, Zap, Trophy, Play, ChevronRight 
} from 'lucide-react';
import { useDashboardStats } from '@/hooks/use-dashboard-stats';
import { useLearningNodes } from '@/hooks/use-learning-nodes';
import { useAuth } from '@/contexts/AuthContext';

export const StudentModernDashboard: React.FC = () => {
  const { profile } = useAuth();
  const { 
    loading, 
    stats, 
    completedExercises, 
    accuracyPercentage, 
    totalTimeMinutes,
    skillLevels,
    topSkills 
  } = useDashboardStats();
  const { currentPhase, nodes, nodeProgress } = useLearningNodes();

  const MetricCard = ({ 
    title, 
    value, 
    subtitle, 
    icon, 
    gradient = "from-blue-500 to-blue-600", 
    trend,
    onClick 
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    gradient?: string;
    trend?: string;
    onClick?: () => void;
  }) => (
    <motion.div
      className={`relative bg-gradient-to-br ${gradient} rounded-2xl p-6 text-white shadow-xl cursor-pointer group`}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
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
        <div className="bg-white/20 p-3 rounded-xl group-hover:bg-white/30 transition-colors">
          {icon}
        </div>
      </div>
      <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );

  // Mock subject data - in real app this would come from your PAES system
  const subjectProgress = [
    { subject: 'Competencia Lectora', current: 85, target: 80, nodes: 30, completed: 18 },
    { subject: 'Matemática M1', current: 72, target: 75, nodes: 25, completed: 12 },
    { subject: 'Matemática M2', current: 65, target: 70, nodes: 22, completed: 8 },
    { subject: 'Historia', current: 78, target: 75, nodes: 65, completed: 35 },
    { subject: 'Ciencias', current: 88, target: 85, nodes: 135, completed: 67 }
  ];

  const studyPlan = [
    { day: 'Lun', subject: 'Matemática M2', time: '16:00-17:30', status: 'completed', color: 'bg-green-500' },
    { day: 'Mar', subject: 'Comp. Lectora', time: '16:00-17:00', status: 'completed', color: 'bg-green-500' },
    { day: 'Mié', subject: 'Historia', time: '16:00-17:30', status: 'in-progress', color: 'bg-yellow-500' },
    { day: 'Jue', subject: 'Ciencias', time: '16:00-17:00', status: 'pending', color: 'bg-gray-400' },
    { day: 'Vie', subject: 'Simulacro', time: '15:00-18:00', status: 'scheduled', color: 'bg-blue-500' }
  ];

  const recentActivity = [
    { activity: 'Completó 5 nodos de Álgebra', date: '2025-01-18', score: 82, type: 'exercise' },
    { activity: 'Simulacro Competencia Lectora', date: '2025-01-17', score: 78, type: 'test' },
    { activity: 'Práctica Historia Chile', date: '2025-01-16', score: 85, type: 'practice' }
  ];

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

  const projectedScore = Math.round(400 + (accuracyPercentage / 100) * 450);
  const studyStreak = 12; // This would come from real data
  const daysToExam = 287;

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <motion.div 
        className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-black/10 rounded-3xl" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-5xl mr-6">👨‍🎓</div>
            <div>
              <h1 className="text-3xl font-bold mb-2">¡Hola, {profile?.name || 'Estudiante'}!</h1>
              <p className="text-indigo-100 text-lg mb-1">4° Medio • Preparación PAES 2024</p>
              <div className="flex items-center text-indigo-200">
                <Zap className="w-4 h-4 mr-2" />
                <span>Nivel Avanzado • {studyStreak} días seguidos</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold mb-1">{Math.round((stats.completedNodes / stats.totalNodes) * 100)}%</div>
            <div className="text-indigo-200">Progreso General</div>
            <div className="text-sm text-indigo-300 mt-1">
              {stats.completedNodes} de {stats.totalNodes} nodos
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Puntaje Predicho"
          value={projectedScore}
          subtitle="Meta: 700 puntos"
          icon={<Target className="w-6 h-6" />}
          gradient="from-blue-500 to-blue-600"
          trend="+12 pts esta semana"
        />
        <MetricCard
          title="Horas de Estudio"
          value={`${Math.round(totalTimeMinutes / 60)}h`}
          subtitle="Total acumuladas"
          icon={<Clock className="w-6 h-6" />}
          gradient="from-green-500 to-green-600"
          trend="+5h esta semana"
        />
        <MetricCard
          title="Racha Actual"
          value={`${studyStreak} días`}
          subtitle="¡Sigue así!"
          icon={<Award className="w-6 h-6" />}
          gradient="from-yellow-500 to-orange-500"
          trend="Récord personal"
        />
        <MetricCard
          title="Días para PAES"
          value={daysToExam}
          subtitle="1 Dic 2025"
          icon={<Calendar className="w-6 h-6" />}
          gradient="from-red-500 to-pink-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Subject Progress */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Progreso por Materia</h2>
            <BookOpen className="w-5 h-5 text-gray-600" />
          </div>
          <div className="space-y-4">
            {subjectProgress.map((subject, index) => (
              <motion.div 
                key={index}
                className="group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">{subject.subject}</span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-800">{subject.current}%</span>
                    <span className="text-xs text-gray-500 ml-1">/ {subject.target}%</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div 
                      className={`h-3 rounded-full ${
                        subject.current >= subject.target 
                          ? 'bg-gradient-to-r from-green-500 to-green-600' 
                          : subject.current >= subject.target * 0.8
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                          : 'bg-gradient-to-r from-red-500 to-red-600'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.current}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                  <div 
                    className="absolute top-0 w-1 h-3 bg-gray-400 rounded-full"
                    style={{ left: `${subject.target}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{subject.completed} de {subject.nodes} nodos</span>
                  <span>Meta: {subject.target}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Competence Radar */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Radar de Competencias</h2>
            <Brain className="w-5 h-5 text-gray-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={subjectProgress}>
              <PolarGrid gridType="polygon" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis angle={0} domain={[0, 100]} tick={false} />
              <Radar
                name="Actual"
                dataKey="current"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Radar
                name="Meta"
                dataKey="target"
                stroke="#10B981"
                fill="none"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Study Plan */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Plan de Estudio</h2>
            <Calendar className="w-5 h-5 text-gray-600" />
          </div>
          <div className="space-y-3">
            {studyPlan.map((plan, index) => (
              <motion.div 
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all cursor-pointer group"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-4 ${plan.color}`} />
                  <div>
                    <div className="font-medium text-gray-800">{plan.day}</div>
                    <div className="text-sm text-gray-600">{plan.subject}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-sm text-gray-500 mr-2">{plan.time}</div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Actividad Reciente</h2>
            <Trophy className="w-5 h-5 text-gray-600" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div 
                key={index}
                className="flex justify-between items-center p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                whileHover={{ x: 5 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${
                    activity.type === 'exercise' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'test' ? 'bg-purple-100 text-purple-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {activity.type === 'exercise' ? <Brain className="w-4 h-4" /> :
                     activity.type === 'test' ? <Target className="w-4 h-4" /> :
                     <BookOpen className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{activity.activity}</div>
                    <div className="text-sm text-gray-500">{activity.date}</div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  activity.score >= 80 ? 'bg-green-100 text-green-800' :
                  activity.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {activity.score}%
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div 
        className="flex flex-wrap gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <motion.button 
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Play className="w-5 h-5 mr-2 inline" />
          Continuar Estudiando
        </motion.button>
        <motion.button 
          className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Target className="w-5 h-5 mr-2 inline" />
          Tomar Simulacro
        </motion.button>
        <motion.button 
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Brain className="w-5 h-5 mr-2 inline" />
          Ver Recomendaciones
        </motion.button>
      </motion.div>
    </div>
  );
};
