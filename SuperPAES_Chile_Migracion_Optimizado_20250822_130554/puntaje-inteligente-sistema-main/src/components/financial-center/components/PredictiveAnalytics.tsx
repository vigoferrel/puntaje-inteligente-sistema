/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import '@/styles/CinematicAnimations.css';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Progress } from '../../../components/ui/progress';
import { Badge } from '../../../components/ui/badge';
import { 
  TrendingUp, 
  Brain, 
  Target, 
  Zap,
  Trophy,
  Star,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface PredictiveAnalyticsProps {
  metrics: unknown;
}

export const PredictiveAnalytics: FC<PredictiveAnalyticsProps> = ({
  metrics
}) => {
  const progressData = [
    { week: 'Sem 1', current: 650, projected: 680, target: 750 },
    { week: 'Sem 2', current: 665, projected: 695, target: 750 },
    { week: 'Sem 3', current: 680, projected: 710, target: 750 },
    { week: 'Sem 4', current: 695, projected: 725, target: 750 },
    { week: 'Sem 5', current: 710, projected: 740, target: 750 },
    { week: 'Sem 6', current: 725, projected: 750, target: 750 }
  ];

  const scholarshipDistribution = [
    { name: 'Gratuidad', value: 40, color: '#10B981' },
    { name: 'V. Profesor', value: 25, color: '#3B82F6' },
    { name: 'Excelencia', value: 15, color: '#8B5CF6' },
    { name: 'MÃ©rito', value: 20, color: '#F59E0B' }
  ];

  const predictions = [
    {
      title: "Probabilidad Gratuidad",
      current: 75,
      projected: 90,
      trend: "up",
      icon: Trophy,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Puntaje Proyectado",
      current: 665,
      projected: 750,
      trend: "up",
      icon: Target,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Ahorro Estimado",
      current: 2.5,
      projected: 4.5,
      trend: "up",
      icon: Star,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "DÃ­as OptimizaciÃ³n",
      current: 45,
      projected: 30,
      trend: "down",
      icon: Zap,
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
          <Brain className="w-8 h-8 mr-3 text-violet-400" />
          Analytics Predictivo IA
        </h2>
        <p className="text-violet-200">
          Inteligencia artificial proyectando tu Ã©xito financiero
        </p>
      </motion.div>

      {/* MÃ©tricas predictivas principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {predictions.map((prediction, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-black/60 backdrop-blur-lg border-white/20 overflow-hidden">
              <CardContent className="p-4">
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${prediction.color} opacity-10`}
                  animate={{ opacity: [0.05, 0.15, 0.05] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="relative">
                  <prediction.icon className={`w-6 h-6 mb-2 ${
                    prediction.color.includes('green') ? 'text-green-400' :
                    prediction.color.includes('blue') ? 'text-blue-400' :
                    prediction.color.includes('purple') ? 'text-purple-400' :
                    'text-orange-400'
                  }`} />
                  <div className="text-2xl font-bold text-white mb-1">
                    {prediction.title.includes('Ahorro') ? `$${prediction.projected}M` : 
                     prediction.title.includes('Probabilidad') ? `${prediction.projected}%` :
                     prediction.projected}
                  </div>
                  <div className="text-xs text-white/70 mb-2">{prediction.title}</div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className={`w-3 h-3 ${
                      prediction.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`} />
                    <span className={`text-xs ${
                      prediction.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {prediction.trend === 'up' ? '+' : '-'}
                      {Math.abs(prediction.projected - prediction.current)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* GrÃ¡fico de progreso proyectado */}
        <Card className="bg-black/60 backdrop-blur-lg border-violet-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-violet-400" />
              ProyecciÃ³n de Puntajes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="week" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" domain={[600, 800]} />
                <Tooltip 
                  contentclassName="dynamic-bg" data-style="{"--dynamic-bg": '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#FFFFFF'
                  }" 
                />
                <Line 
                  type="monotone" 
                  dataKey="current" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  name="Progreso Actual"
                />
                <Line 
                  type="monotone" 
                  dataKey="projected" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  name="ProyecciÃ³n IA"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  strokeDasharray="10 5"
                  dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
                  name="Meta"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* DistribuciÃ³n de probabilidades de becas */}
        <Card className="bg-black/60 backdrop-blur-lg border-violet-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Star className="w-5 h-5 mr-2 text-violet-400" />
              Probabilidades de Becas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={scholarshipDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {scholarshipDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentclassName="dynamic-bg" data-style="{"--dynamic-bg": '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#FFFFFF'
                  }" 
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              {scholarshipDistribution.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    className="dynamic-bg" data-style="{"--dynamic-bg": item.color }"
                  />
                  <span className="text-white/80 text-sm">{item.name}</span>
                  <span className="text-white font-bold text-sm">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recomendaciones de IA */}
      <Card className="bg-black/60 backdrop-blur-lg border-violet-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Brain className="w-5 h-5 mr-2 text-violet-400" />
            Recomendaciones Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-green-500/20 rounded-lg p-4 border border-green-400/30"
            >
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h4 className="text-green-400 font-bold">OptimizaciÃ³n Alta</h4>
              </div>
              <p className="text-green-200 text-sm">
                Aumenta 2h/dÃ­a de estudio en MatemÃ¡tica M1 para mejorar 85 puntos y asegurar Beca VocaciÃ³n Profesor.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-yellow-500/20 rounded-lg p-4 border border-yellow-400/30"
            >
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h4 className="text-yellow-400 font-bold">Alerta Temporal</h4>
              </div>
              <p className="text-yellow-200 text-sm">
                Completar FUAS antes del 13 marzo. Tiempo crÃ­tico para maximizar beneficios disponibles.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-500/20 rounded-lg p-4 border border-blue-400/30"
            >
              <div className="flex items-center space-x-2 mb-3">
                <Target className="w-5 h-5 text-blue-400" />
                <h4 className="text-blue-400 font-bold">Estrategia Ã“ptima</h4>
              </div>
              <p className="text-blue-200 text-sm">
                Priorizar Competencia Lectora. 50 puntos adicionales garantizan Gratuidad + Excelencia AcadÃ©mica.
              </p>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};



