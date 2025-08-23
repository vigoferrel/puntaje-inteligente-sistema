/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Target, BookOpen, Clock, Zap } from 'lucide-react';

interface AnalyticsData {
  personalMetrics: {
    totalExercises: number;
    averageScore: number;
    studyTime: number;
    improvement: number;
    strongestArea: string;
    weakestArea: string;
  };
  performanceBySubject: {
    subject: string;
    score: number;
    exercises: number;
    timeSpent: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  exerciseBank: {
    totalExercises: number;
    byDifficulty: {
      easy: number;
      medium: number;
      hard: number;
    };
    bySubject: {
      matematica: number;
      lenguaje: number;
      ciencias: number;
      historia: number;
    };
    completionRate: number;
  };
  weeklyProgress: {
    week: string;
    exercises: number;
    score: number;
  }[];
}

export const AnalyticsEngine: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'personal' | 'subjects' | 'bank' | 'progress'>('personal');

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      // Simular datos de analytics
      const analyticsData: AnalyticsData = {
        personalMetrics: {
          totalExercises: 247,
          averageScore: 78.5,
          studyTime: 45.2, // horas
          improvement: 12.3, // porcentaje
          strongestArea: 'ComprensiÃ³n Lectora',
          weakestArea: 'MatemÃ¡tica M2'
        },
        performanceBySubject: [
          {
            subject: 'MatemÃ¡tica M1',
            score: 72,
            exercises: 65,
            timeSpent: 12.5,
            trend: 'up'
          },
          {
            subject: 'MatemÃ¡tica M2',
            score: 68,
            exercises: 48,
            timeSpent: 15.2,
            trend: 'stable'
          },
          {
            subject: 'ComprensiÃ³n Lectora',
            score: 85,
            exercises: 72,
            timeSpent: 8.7,
            trend: 'up'
          },
          {
            subject: 'Ciencias',
            score: 75,
            exercises: 42,
            timeSpent: 6.8,
            trend: 'down'
          },
          {
            subject: 'Historia',
            score: 80,
            exercises: 20,
            timeSpent: 2.0,
            trend: 'up'
          }
        ],
        exerciseBank: {
          totalExercises: 1247,
          byDifficulty: {
            easy: 456,
            medium: 523,
            hard: 268
          },
          bySubject: {
            matematica: 387,
            lenguaje: 298,
            ciencias: 312,
            historia: 250
          },
          completionRate: 19.8
        },
        weeklyProgress: [
          { week: 'Sem 1', exercises: 32, score: 72 },
          { week: 'Sem 2', exercises: 45, score: 75 },
          { week: 'Sem 3', exercises: 38, score: 78 },
          { week: 'Sem 4', exercises: 52, score: 81 }
        ]
      };

      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error cargando analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-400" />;
      case 'down': return <TrendingUp className="w-3 h-3 text-red-400 rotate-180" />;
      case 'stable': return <Target className="w-3 h-3 text-yellow-400" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      case 'stable': return 'text-yellow-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full"
        />
      </div>
    );
  } else if (!analytics) { // Usar else if
    return null;
  }

  const renderPersonalMetrics = () => (
    <div className="grid grid-cols-2 gap-3">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/30"
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{analytics.personalMetrics.totalExercises}</div>
          <div className="text-xs text-blue-300">Ejercicios Totales</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30"
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{analytics.personalMetrics.averageScore}%</div>
          <div className="text-xs text-green-300">Promedio General</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30"
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{analytics.personalMetrics.studyTime}h</div>
          <div className="text-xs text-purple-300">Tiempo Estudio</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30"
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-white">+{analytics.personalMetrics.improvement}%</div>
          <div className="text-xs text-yellow-300">Mejora</div>
        </div>
      </motion.div>

      <div className="col-span-2 space-y-2">
        <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/30">
          <div className="text-xs text-green-300">Ãrea MÃ¡s Fuerte</div>
          <div className="text-white font-medium">{analytics.personalMetrics.strongestArea}</div>
        </div>
        <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/30">
          <div className="text-xs text-red-300">Ãrea a Mejorar</div>
          <div className="text-white font-medium">{analytics.personalMetrics.weakestArea}</div>
        </div>
      </div>
    </div>
  );

  const renderSubjectPerformance = () => (
    <div className="space-y-3">
      {analytics.performanceBySubject.map((subject, index) => (
        <motion.div
          key={subject.subject}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-white font-medium text-sm">{subject.subject}</div>
            <div className={`flex items-center space-x-1 ${getTrendColor(subject.trend)}`}>
              {getTrendIcon(subject.trend)}
              <span className="text-xs">{subject.score}%</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-xs text-white/70">
            <div className="flex items-center space-x-1">
              <BookOpen className="w-3 h-3" />
              <span>{subject.exercises} ej.</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{subject.timeSpent}h</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="w-3 h-3" />
              <span>{Math.round(subject.exercises / subject.timeSpent)} ej/h</span>
            </div>
          </div>

          <div className="mt-2 w-full bg-white/20 rounded-full h-1.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${subject.score}%` }}
              transition={{ duration: 1, delay: index * 0.2 }}
              className="bg-gradient-to-r from-orange-500 to-red-500 h-1.5 rounded-full"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderExerciseBank = () => (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30"
      >
        <div className="text-3xl font-bold text-white mb-1">{analytics.exerciseBank.totalExercises}</div>
        <div className="text-cyan-300 text-sm">Ejercicios Disponibles</div>
        <div className="text-xs text-white/60 mt-1">{analytics.exerciseBank.completionRate}% Completado</div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="text-white font-medium text-sm">Por Dificultad</div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-green-400">FÃ¡cil</span>
              <span className="text-white">{analytics.exerciseBank.byDifficulty.easy}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-yellow-400">Medio</span>
              <span className="text-white">{analytics.exerciseBank.byDifficulty.medium}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-red-400">DifÃ­cil</span>
              <span className="text-white">{analytics.exerciseBank.byDifficulty.hard}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-white font-medium text-sm">Por Materia</div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-blue-400">MatemÃ¡tica</span>
              <span className="text-white">{analytics.exerciseBank.bySubject.matematica}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-green-400">Lenguaje</span>
              <span className="text-white">{analytics.exerciseBank.bySubject.lenguaje}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-purple-400">Ciencias</span>
              <span className="text-white">{analytics.exerciseBank.bySubject.ciencias}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-orange-400">Historia</span>
              <span className="text-white">{analytics.exerciseBank.bySubject.historia}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Selector de Vista */}
      <div className="flex space-x-2 overflow-x-auto">
        {[
          { id: 'personal', label: 'Personal', icon: Target },
          { id: 'subjects', label: 'Materias', icon: BookOpen },
          { id: 'bank', label: 'Banco', icon: BarChart3 },
          { id: 'progress', label: 'Progreso', icon: TrendingUp }
        ].map(({ id, label, icon: Icon }) => (
          <motion.button
            key={id}
            onClick={() => setSelectedView(id as any)}
            className={`px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-all ${
              selectedView === id
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                : 'bg-white/10 text-white/70 hover:bg-white/15'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="w-3 h-3 mr-1 inline" />
            {label}
          </motion.button>
        ))}
      </div>

      {/* Contenido segÃºn vista seleccionada */}
      <motion.div
        key={selectedView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {selectedView === 'personal' && renderPersonalMetrics()}
        {selectedView === 'subjects' && renderSubjectPerformance()}
        {selectedView === 'bank' && renderExerciseBank()}
        {selectedView === 'progress' && (
          <div className="text-center text-white/60 py-8">
            <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <div>GrÃ¡fico de progreso semanal prÃ³ximamente</div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

