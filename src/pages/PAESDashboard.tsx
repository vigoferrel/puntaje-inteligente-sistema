
import React from 'react';
import { motion } from 'framer-motion';
import { HolographicMetricsDisplay } from '@/components/cinematic/HolographicMetricsDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Brain, 
  TrendingUp, 
  Award, 
  BookOpen, 
  Calendar,
  Clock,
  Zap
} from 'lucide-react';

const PAESDashboard: React.FC = () => {
  const paesMetrics = [
    {
      id: 'paes-score',
      title: 'Puntaje PAES Actual',
      value: 685,
      unit: 'pts',
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      trend: 'up' as const,
      trendValue: 45
    },
    {
      id: 'study-time',
      title: 'Tiempo de Estudio',
      value: 142,
      unit: 'hrs',
      icon: Clock,
      color: 'from-blue-500 to-cyan-500',
      trend: 'up' as const,
      trendValue: 28
    },
    {
      id: 'practice-tests',
      title: 'Ensayos Completados',
      value: 12,
      unit: '',
      icon: BookOpen,
      color: 'from-green-500 to-emerald-500',
      trend: 'up' as const,
      trendValue: 4
    },
    {
      id: 'streak',
      title: 'Racha de Estudio',
      value: 15,
      unit: 'días',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      trend: 'up' as const,
      trendValue: 7
    }
  ];

  const subjects = [
    { name: 'Competencia Lectora', score: 720, target: 750, color: 'bg-purple-500' },
    { name: 'Competencia Matemática M1', score: 680, target: 700, color: 'bg-blue-500' },
    { name: 'Historia y Ciencias Sociales', score: 650, target: 680, color: 'bg-green-500' },
    { name: 'Ciencias', score: 675, target: 700, color: 'bg-yellow-500' }
  ];

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header cinematográfico */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
          <Target className="w-10 h-10 text-purple-400" />
          Dashboard PAES Avanzado
        </h1>
        <p className="text-white/80 text-xl">
          Monitoreo integral de tu preparación PAES
        </p>
      </motion.div>

      {/* Métricas holográficas principales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <HolographicMetricsDisplay 
          metrics={paesMetrics}
          layout="grid"
        />
      </motion.div>

      {/* Progreso por materias */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card className="bg-black/40 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Progreso por Materia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="space-y-3"
              >
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">{subject.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-lg font-bold">{subject.score}</span>
                    <span className="text-white/60 text-sm">/ {subject.target}</span>
                  </div>
                </div>
                <div className="relative">
                  <Progress 
                    value={(subject.score / subject.target) * 100} 
                    className="h-3 bg-white/10"
                  />
                  <div 
                    className={`absolute inset-0 ${subject.color} rounded-full h-3`}
                    style={{ width: `${(subject.score / subject.target) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-white/60">
                  Faltan {subject.target - subject.score} puntos para el objetivo
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Calendario de estudios */}
        <Card className="bg-black/40 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-400" />
              Calendario de Estudios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { date: 'Hoy', task: 'Ensayo Competencia Lectora', time: '14:00' },
                { date: 'Mañana', task: 'Repaso Matemática M1', time: '16:00' },
                { date: 'Miércoles', task: 'Simulacro Historia', time: '15:30' },
                { date: 'Jueves', task: 'Práctica Ciencias', time: '17:00' }
              ].map((event, index) => (
                <motion.div
                  key={event.date}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="w-3 h-3 bg-cyan-400 rounded-full" />
                  <div className="flex-1">
                    <div className="text-white font-medium">{event.task}</div>
                    <div className="text-white/60 text-sm">{event.date} - {event.time}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Acciones rápidas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-wrap gap-4 justify-center"
      >
        {[
          { label: 'Iniciar Ensayo', icon: Target, color: 'from-purple-500 to-pink-500' },
          { label: 'Ver Estadísticas', icon: TrendingUp, color: 'from-blue-500 to-cyan-500' },
          { label: 'Configurar Objetivos', icon: Award, color: 'from-green-500 to-emerald-500' },
          { label: 'Modo Estudio', icon: Brain, color: 'from-yellow-500 to-orange-500' }
        ].map((action, index) => (
          <motion.div
            key={action.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className={`bg-gradient-to-r ${action.color} hover:opacity-90 text-white px-6 py-3 h-auto`}
            >
              <action.icon className="w-5 h-5 mr-2" />
              {action.label}
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default PAESDashboard;
