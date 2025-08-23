/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Brain, 
  Target, 
  TrendingUp,
  FileText,
  Clock,
  CheckCircle
} from 'lucide-react';

export const CompetenciaLectoraIntegration: FC = () => {
  const competenciaData = {
    progress: 75,
    projectedScore: 670,
    completedSessions: 24,
    totalSessions: 40,
    strengths: ['ComprensiÃ³n literal', 'Vocabulario', 'SÃ­ntesis'],
    weaknesses: ['Inferencias complejas', 'AnÃ¡lisis crÃ­tico'],
    recentActivities: [
      { type: 'Texto expositivo', score: 85, date: '2024-01-15' },
      { type: 'Texto argumentativo', score: 78, date: '2024-01-14' },
      { type: 'Texto narrativo', score: 92, date: '2024-01-13' }
    ]
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Progreso General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white">Completado</span>
                <span className="text-white font-semibold">{competenciaData.progress}%</span>
              </div>
              <Progress value={competenciaData.progress} className="h-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{competenciaData.projectedScore}</div>
              <div className="text-white/70 text-sm">Puntaje Proyectado</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              Sesiones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {competenciaData.completedSessions}/{competenciaData.totalSessions}
              </div>
              <div className="text-white/70 text-sm">Completadas</div>
            </div>
            <Progress 
              value={(competenciaData.completedSessions / competenciaData.totalSessions) * 100} 
              className="h-2" 
            />
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {competenciaData.recentActivities.slice(0, 3).map((activity, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-white/70">{activity.type}</span>
                  <Badge variant={activity.score >= 80 ? 'default' : 'secondary'}>
                    {activity.score}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Fortalezas Identificadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {competenciaData.strengths.map((strength, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white/80 text-sm">{strength}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-400" />
              Ãreas de Mejora
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {competenciaData.weaknesses.map((weakness, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-orange-400" />
                  <span className="text-white/80 text-sm">{weakness}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyan-400" />
            Acciones Recomendadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <FileText className="w-4 h-4 mr-2" />
              PrÃ¡ctica Dirigida
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Clock className="w-4 h-4 mr-2" />
              Simulacro Cronometrado
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              AnÃ¡lisis de Errores
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

