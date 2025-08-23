
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Award,
  BarChart3,
  Users,
  Calendar,
  PlayCircle,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

interface PAESEvaluationDashboardProps {
  onStartDiagnostic?: () => void;
  onViewResults?: () => void;
  onScheduleTest?: () => void;
}

const PAESEvaluationDashboard: React.FC<PAESEvaluationDashboardProps> = ({
  onStartDiagnostic,
  onViewResults,
  onScheduleTest
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'schedule'>('overview');

  const evaluationStats = {
    lastScore: 625,
    targetScore: 700,
    improvement: 45,
    testsCompleted: 8,
    nextTest: "15 días",
    readinessLevel: 78
  };

  const subjectScores = [
    { subject: "Comprensión Lectora", current: 680, target: 720, progress: 85 },
    { subject: "Matemática M1", current: 590, target: 650, progress: 72 },
    { subject: "Matemática M2", current: 610, target: 680, progress: 68 },
    { subject: "Ciencias", current: 640, target: 700, progress: 78 },
    { subject: "Historia", current: 705, target: 750, progress: 88 }
  ];

  const upcomingTests = [
    {
      date: "2024-02-15",
      type: "Diagnóstico Integral",
      duration: "3.5 horas",
      status: "scheduled"
    },
    {
      date: "2024-02-28",
      type: "Simulacro PAES",
      duration: "4 horas",
      status: "available"
    },
    {
      date: "2024-03-15",
      type: "Evaluación Final",
      duration: "4.5 horas",
      status: "pending"
    }
  ];

  const recommendations = [
    {
      priority: "high",
      title: "Reforzar Matemática M1",
      description: "Enfócate en álgebra y funciones para mejorar 60 puntos",
      estimatedGain: 60
    },
    {
      priority: "medium",
      title: "Optimizar tiempo en Ciencias",
      description: "Mejora la velocidad de resolución en química",
      estimatedGain: 35
    },
    {
      priority: "low",
      title: "Mantener nivel en Historia",
      description: "Continúa con ejercicios de repaso regulares",
      estimatedGain: 20
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Puntaje Actual</span>
            </div>
            <div className="text-2xl font-bold">{evaluationStats.lastScore}</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-green-500">+{evaluationStats.improvement} vs inicio</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Meta</span>
            </div>
            <div className="text-2xl font-bold">{evaluationStats.targetScore}</div>
            <div className="text-sm text-muted-foreground">
              {evaluationStats.targetScore - evaluationStats.lastScore} puntos restantes
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium">Próximo Test</span>
            </div>
            <div className="text-2xl font-bold">{evaluationStats.nextTest}</div>
            <div className="text-sm text-muted-foreground">Diagnóstico programado</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Preparación</span>
            </div>
            <div className="text-2xl font-bold">{evaluationStats.readinessLevel}%</div>
            <Progress value={evaluationStats.readinessLevel} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Resumen', icon: BarChart3 },
          { id: 'progress', label: 'Progreso', icon: TrendingUp },
          { id: 'schedule', label: 'Cronograma', icon: Calendar }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab.id as any)}
            className="flex-1 gap-2"
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subject Scores */}
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento por Materia</CardTitle>
              <CardDescription>Puntajes actuales vs objetivos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjectScores.map((subject, index) => (
                  <motion.div
                    key={subject.subject}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{subject.subject}</span>
                      <div className="text-right">
                        <div className="font-bold">{subject.current}</div>
                        <div className="text-xs text-muted-foreground">Meta: {subject.target}</div>
                      </div>
                    </div>
                    <Progress value={subject.progress} className="h-2" />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones IA</CardTitle>
              <CardDescription>Estrategias para maximizar tu puntaje</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 border rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {rec.priority === 'high' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        {rec.priority === 'medium' && <Clock className="w-4 h-4 text-yellow-500" />}
                        {rec.priority === 'low' && <CheckCircle className="w-4 h-4 text-green-500" />}
                        <h4 className="font-medium text-sm">{rec.title}</h4>
                      </div>
                      <Badge variant={rec.priority === 'high' ? 'destructive' : 'default'} className="text-xs">
                        +{rec.estimatedGain}pt
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'schedule' && (
        <Card>
          <CardHeader>
            <CardTitle>Cronograma de Evaluaciones</CardTitle>
            <CardDescription>Próximas evaluaciones y diagnósticos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTests.map((test, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      test.status === 'scheduled' ? 'bg-blue-500/20' :
                      test.status === 'available' ? 'bg-green-500/20' : 'bg-gray-500/20'
                    }`}>
                      <Calendar className={`w-4 h-4 ${
                        test.status === 'scheduled' ? 'text-blue-600' :
                        test.status === 'available' ? 'text-green-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-medium">{test.type}</h4>
                      <div className="text-sm text-muted-foreground">
                        {new Date(test.date).toLocaleDateString()} • {test.duration}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      test.status === 'scheduled' ? 'default' :
                      test.status === 'available' ? 'secondary' : 'outline'
                    }>
                      {test.status === 'scheduled' ? 'Programado' :
                       test.status === 'available' ? 'Disponible' : 'Pendiente'}
                    </Badge>
                    {test.status === 'available' && (
                      <Button size="sm" onClick={onStartDiagnostic}>
                        <PlayCircle className="w-4 h-4 mr-1" />
                        Iniciar
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button onClick={onStartDiagnostic} className="h-16 gap-3">
          <PlayCircle className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Iniciar Diagnóstico</div>
            <div className="text-xs opacity-80">Evaluación adaptativa</div>
          </div>
        </Button>

        <Button variant="outline" onClick={onViewResults} className="h-16 gap-3">
          <BarChart3 className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Ver Resultados</div>
            <div className="text-xs opacity-80">Análisis detallado</div>
          </div>
        </Button>

        <Button variant="outline" onClick={onScheduleTest} className="h-16 gap-3">
          <Calendar className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Programar Test</div>
            <div className="text-xs opacity-80">Planificar evaluación</div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default PAESEvaluationDashboard;
