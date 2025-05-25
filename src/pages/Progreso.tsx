
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Brain, Target, BookOpen, Award, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Progreso: React.FC = () => {
  const { user } = useAuth();

  // Datos simulados de progreso
  const progressData = {
    globalProgress: 68,
    strengths: ['Análisis Crítico', 'Resolución de Problemas', 'Comprensión Lectora'],
    improvements: ['Matemáticas Avanzadas', 'Ciencias Naturales'],
    weeklyGoal: 85,
    currentStreak: 12,
    completedNodes: 24,
    totalNodes: 45
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Mi Progreso PAES
          </h1>
          <p className="text-gray-300">
            Seguimiento detallado de tu avance académico
          </p>
        </motion.div>

        {/* Métricas principales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-300">Progreso Global</p>
                  <p className="text-2xl font-bold text-white">{progressData.globalProgress}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-400" />
              </div>
              <Progress value={progressData.globalProgress} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-300">Racha Actual</p>
                  <p className="text-2xl font-bold text-white">{progressData.currentStreak} días</p>
                </div>
                <Calendar className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-300">Nodos Completados</p>
                  <p className="text-2xl font-bold text-white">{progressData.completedNodes}/{progressData.totalNodes}</p>
                </div>
                <Target className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-300">Meta Semanal</p>
                  <p className="text-2xl font-bold text-white">{progressData.weeklyGoal}%</p>
                </div>
                <Award className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Fortalezas y Áreas de Mejora */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card className="bg-black/20 border-green-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Brain className="h-5 w-5" />
                Fortalezas Identificadas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {progressData.strengths.map((strength, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-300">{strength}</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Fuerte
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-orange-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-400">
                <BookOpen className="h-5 w-5" />
                Áreas de Mejora
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {progressData.improvements.map((improvement, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-300">{improvement}</span>
                  <Badge variant="destructive" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                    Mejorar
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Progreso por Materia */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-black/20 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-purple-400">Progreso por Materia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { subject: 'Comprensión Lectora', progress: 78, color: 'blue' },
                { subject: 'Matemática M1', progress: 65, color: 'green' },
                { subject: 'Matemática M2', progress: 52, color: 'yellow' },
                { subject: 'Historia', progress: 71, color: 'purple' },
                { subject: 'Ciencias', progress: 58, color: 'red' }
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-300">{item.subject}</span>
                    <span className="text-sm text-gray-400">{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Progreso;
