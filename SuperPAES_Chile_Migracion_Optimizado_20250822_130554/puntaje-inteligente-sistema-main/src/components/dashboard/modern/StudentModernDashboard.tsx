/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { Button } from '../../../components/ui/button';
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Clock,
  Award,
  Brain,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useRealProgressData } from '../../../hooks/useRealProgressData';
import { useAuth } from '../../../hooks/useAuth';

export const StudentModernDashboard: FC = () => {
  const { user } = useAuth();
  const { metrics, isLoading } = useRealProgressData();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-6">
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-amber-800 mb-1">Comienza tu PreparaciÃ³n</h3>
            <p className="text-amber-600 mb-4">
              No tienes datos de progreso aÃºn. Â¡Comienza estudiando para ver tu avance!
            </p>
            <Button>
              <BookOpen className="w-4 h-4 mr-2" />
              Comenzar DiagnÃ³stico
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getProgressMessage = () => {
    if (metrics.overallProgress < 20) {
      return "Â¡EstÃ¡s comenzando tu preparaciÃ³n! MantÃ©n la constancia.";
    } else if (metrics.overallProgress < 50) {
      return "Vas por buen camino. Sigue asÃ­ para alcanzar tus metas.";
    } else if (metrics.overallProgress < 80) {
      return "Â¡Excelente progreso! EstÃ¡s cerca de completar tu preparaciÃ³n.";
    } else {
      return "Â¡IncreÃ­ble! EstÃ¡s muy bien preparado para la PAES.";
    }
  };

  const getProgressColor = () => {
    if (metrics.overallProgress < 30) return "text-red-600";
    if (metrics.overallProgress < 60) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header personalizado */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Â¡Hola, {user?.email?.split('@')[0] || 'Estudiante'}! ðŸ‘‹
        </h1>
        <p className={`text-lg ${getProgressColor()}`}>
          {getProgressMessage()}
        </p>
      </div>

      {/* MÃ©tricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Progreso General</p>
                <p className="text-2xl font-bold text-blue-700">{metrics.overallProgress}%</p>
                <p className="text-xs text-blue-500">
                  {metrics.completedNodes}/{metrics.totalNodes} nodos
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Racha de Estudio</p>
                <p className="text-2xl font-bold text-green-700">{metrics.streakDays}</p>
                <p className="text-xs text-green-500">dÃ­as consecutivos</p>
              </div>
              <Award className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Velocidad</p>
                <p className="text-2xl font-bold text-purple-700">{metrics.learningVelocity}%</p>
                <p className="text-xs text-purple-500">aprendizaje</p>
              </div>
              <Brain className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Tiempo Total</p>
                <p className="text-2xl font-bold text-orange-700">{metrics.totalStudyTime}h</p>
                <p className="text-xs text-orange-500">estudiadas</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progreso por materia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-600" />
            Progreso por Materia PAES
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(metrics.subjectProgress).map(([subject, progress]) => (
            <div key={subject} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {subject.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                <Badge variant={progress >= 70 ? "default" : progress >= 40 ? "secondary" : "destructive"}>
                  {progress}%
                </Badge>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Acciones rÃ¡pidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Brain className="w-12 h-12 text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">DiagnÃ³stico</h3>
            <p className="text-sm text-gray-600 mb-4">
              EvalÃºa tu nivel actual en cada materia
            </p>
            <Button variant="outline" className="w-full">
              Hacer DiagnÃ³stico
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <BookOpen className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Ejercicios</h3>
            <p className="text-sm text-gray-600 mb-4">
              Practica con ejercicios personalizados
            </p>
            <Button variant="outline" className="w-full">
              Practicar
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Calendar className="w-12 h-12 text-purple-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Plan de Estudio</h3>
            <p className="text-sm text-gray-600 mb-4">
              Organiza tu preparaciÃ³n de forma eficiente
            </p>
            <Button variant="outline" className="w-full">
              Ver Plan
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Insights personalizados */}
      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-700">
            <TrendingUp className="w-5 h-5" />
            Tu Progreso Esta Semana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-600 mb-1">
                {metrics.weeklyGrowth}%
              </div>
              <p className="text-sm text-cyan-700">Crecimiento semanal</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-600 mb-1">
                {metrics.retentionRate}%
              </div>
              <p className="text-sm text-cyan-700">RetenciÃ³n</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-600 mb-1">
                {100 - metrics.cognitiveLoad}%
              </div>
              <p className="text-sm text-cyan-700">Confianza</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white rounded-lg border border-cyan-200">
            <p className="text-sm text-cyan-800">
              <strong>RecomendaciÃ³n:</strong> {' '}
              {metrics.weeklyGrowth < 20 
                ? "Dedica 15 minutos mÃ¡s al dÃ­a para acelerar tu progreso."
                : metrics.retentionRate < 60
                ? "Repasa los conceptos anteriores para mejorar tu retenciÃ³n."
                : "Â¡Excelente ritmo! MantÃ©n la constancia para alcanzar tus metas."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

