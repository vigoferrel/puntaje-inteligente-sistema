/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { TrendingUp, Target, Clock, Award, BarChart3 } from 'lucide-react';
import { IntersectionalContext, CrossModuleAction } from '../../../types/intersectional-types';

interface ProgressIntersectionalProps {
  context: IntersectionalContext & { moduleState: unknown };
  onNavigateToTool: (tool: string, context?: unknown) => void;
  onDispatchAction: (action: CrossModuleAction) => void;
}

export const ProgressIntersectional: FC<ProgressIntersectionalProps> = ({
  context,
  onNavigateToTool,
  onDispatchAction
}) => {
  const progressData = [
    {
      subject: 'ComprensiÃ³n Lectora',
      progress: context.crossModuleMetrics.averagePerformance,
      target: 85,
      color: 'blue'
    },
    {
      subject: 'MatemÃ¡tica M1',
      progress: Math.max(0, context.crossModuleMetrics.averagePerformance - 10),
      target: 80,
      color: 'green'
    },
    {
      subject: 'Ciencias',
      progress: Math.max(0, context.crossModuleMetrics.averagePerformance - 15),
      target: 75,
      color: 'purple'
    }
  ];

  const weeklyData = [
    { day: 'Lun', time: 45, exercises: 3 },
    { day: 'Mar', time: 60, exercises: 4 },
    { day: 'MiÃ©', time: 30, exercises: 2 },
    { day: 'Jue', time: 75, exercises: 5 },
    { day: 'Vie', time: 90, exercises: 6 },
    { day: 'SÃ¡b', time: 120, exercises: 8 },
    { day: 'Dom', time: 45, exercises: 3 }
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Progreso Interseccional
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              Racha: {context.crossModuleMetrics.streakDays} dÃ­as
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Nivel: {Math.round(context.crossModuleMetrics.averagePerformance)}%
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* MÃ©tricas principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(context.crossModuleMetrics.totalStudyTime / 60)}h
            </div>
            <div className="text-sm text-gray-600">Tiempo total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {context.crossModuleMetrics.exercisesCompleted}
            </div>
            <div className="text-sm text-gray-600">Ejercicios</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(context.crossModuleMetrics.averagePerformance)}%
            </div>
            <div className="text-sm text-gray-600">Rendimiento</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {context.crossModuleMetrics.streakDays}
            </div>
            <div className="text-sm text-gray-600">Racha</div>
          </div>
        </div>

        {/* Progreso por materia */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Progreso por Materia</h3>
          {progressData.map((subject, index) => (
            <motion.div
              key={subject.subject}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{subject.subject}</span>
                <span className="text-sm text-gray-600">
                  {Math.round(subject.progress)}% / {subject.target}%
                </span>
              </div>
              <div className="flex gap-2">
                <Progress 
                  value={subject.progress} 
                  className="flex-1 h-2"
                />
                <Progress 
                  value={Math.min(100, (subject.progress / subject.target) * 100)} 
                  className="w-16 h-2"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Actividad semanal */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Actividad Esta Semana</h3>
          <div className="grid grid-cols-7 gap-2">
            {weeklyData.map((day, index) => (
              <div key={day.day} className="text-center">
                <div className="text-xs text-gray-600 mb-1">{day.day}</div>
                <div 
                  className={`h-16 rounded flex flex-col justify-end p-1 text-white text-xs ${
                    day.time > 60 ? 'bg-green-500' : 
                    day.time > 30 ? 'bg-yellow-500' : 'bg-gray-300'
                  }`}
                  className="dynamic-height" data-height={Math.max(20, (day.time / 120) * 64)}
                >
                  <div>{day.time}m</div>
                  <div>{day.exercises}ej</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recomendaciones interseccionales */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Recomendaciones Inteligentes</h3>
          
          {context.crossModuleMetrics.averagePerformance < 70 && (
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 text-yellow-800">
                <Target className="w-4 h-4" />
                <span className="font-medium">Foco en Mejora</span>
              </div>
              <p className="text-yellow-700 text-sm mt-1">
                Tu rendimiento actual estÃ¡ por debajo del 70%. Te recomendamos:
              </p>
              <div className="flex gap-2 mt-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onNavigateToTool('diagnostic')}
                  className="text-yellow-700 border-yellow-300"
                >
                  DiagnÃ³stico
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onNavigateToTool('plan')}
                  className="text-yellow-700 border-yellow-300"
                >
                  Crear Plan
                </Button>
              </div>
            </div>
          )}

          {context.crossModuleMetrics.streakDays >= 7 && (
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-green-800">
                <Award className="w-4 h-4" />
                <span className="font-medium">Â¡Excelente racha!</span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                Llevas {context.crossModuleMetrics.streakDays} dÃ­as estudiando consecutivos. 
                Â¡Sigue asÃ­!
              </p>
            </div>
          )}

          {context.financialGoals && (
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 text-purple-800">
                <BarChart3 className="w-4 h-4" />
                <span className="font-medium">Progreso hacia tu meta</span>
              </div>
              <p className="text-purple-700 text-sm mt-1">
                Tu progreso estÃ¡ {context.crossModuleMetrics.averagePerformance >= 80 ? 'bien' : 'regular'} 
                alineado con tu objetivo de acceder a {context.financialGoals.targetCareer}.
              </p>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onNavigateToTool('financial')}
                className="text-purple-700 border-purple-300 mt-2"
              >
                Ver Calculadora
              </Button>
            </div>
          )}
        </div>

        {/* Acciones rÃ¡pidas */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => onNavigateToTool('diagnostic')}
            className="justify-start gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            EvaluaciÃ³n
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigateToTool('plan')}
            className="justify-start gap-2"
          >
            <Clock className="w-4 h-4" />
            Mi Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};


