
import React, { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { LectoGuiaAIChat } from '@/components/lectoguia/LectoGuiaAIChat';
import { 
  Brain, 
  MessageCircle, 
  BookOpen, 
  Target,
  TrendingUp,
  Lightbulb,
  Zap
} from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

const LectoGuia: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'chat' | 'exercises' | 'analysis'>('chat');

  const aiStats = {
    conversationsToday: 12,
    exercisesGenerated: 8,
    conceptsExplained: 15,
    studyTimeOptimized: 45
  };

  const recentTopics = [
    { topic: "Funciones cuadráticas", interactions: 5, lastUsed: "Hace 2 horas" },
    { topic: "Comprensión inferencial", interactions: 8, lastUsed: "Hace 30 min" },
    { topic: "Célula eucariota", interactions: 3, lastUsed: "Ayer" },
    { topic: "Independencia de Chile", interactions: 6, lastUsed: "Hace 1 hora" }
  ];

  return (
    <AppLayout>
      <div className="container py-8">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/">Inicio</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>LectoGuía IA</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">LectoGuía IA</h1>
              <p className="text-muted-foreground">
                Tu asistente inteligente de estudio PAES
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Conversaciones</span>
                </div>
                <div className="text-2xl font-bold">{aiStats.conversationsToday}</div>
                <div className="text-sm text-muted-foreground">Hoy</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Ejercicios</span>
                </div>
                <div className="text-2xl font-bold">{aiStats.exercisesGenerated}</div>
                <div className="text-sm text-muted-foreground">Generados</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">Conceptos</span>
                </div>
                <div className="text-2xl font-bold">{aiStats.conceptsExplained}</div>
                <div className="text-sm text-muted-foreground">Explicados</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium">Tiempo Optimizado</span>
                </div>
                <div className="text-2xl font-bold">{aiStats.studyTimeOptimized}min</div>
                <div className="text-sm text-muted-foreground">Esta semana</div>
              </CardContent>
            </Card>
          </div>

          {/* Mode Selection */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {[
              { id: 'chat', label: 'Chat IA', icon: MessageCircle },
              { id: 'exercises', label: 'Ejercicios', icon: Target },
              { id: 'analysis', label: 'Análisis', icon: TrendingUp }
            ].map((mode) => (
              <Button
                key={mode.id}
                variant={activeMode === mode.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveMode(mode.id as any)}
                className="gap-2"
              >
                <mode.icon className="w-4 h-4" />
                {mode.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeMode === 'chat' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="h-[600px]">
                  <LectoGuiaAIChat 
                    onNavigateToExercise={(nodeId) => console.log('Navigate to exercise:', nodeId)}
                    onNavigateToDiagnostic={() => console.log('Navigate to diagnostic')}
                    onNavigateToPlan={() => console.log('Navigate to plan')}
                  />
                </Card>
              </motion.div>
            )}

            {activeMode === 'exercises' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Ejercicios Generados por IA</CardTitle>
                    <CardDescription>
                      Ejercicios personalizados basados en tu nivel y necesidades
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { subject: "Matemática", topic: "Funciones lineales", difficulty: "Intermedio", generated: "Hace 1 hora" },
                        { subject: "Comprensión Lectora", topic: "Inferencias", difficulty: "Avanzado", generated: "Hace 2 horas" },
                        { subject: "Ciencias", topic: "Mitosis", difficulty: "Básico", generated: "Hace 3 horas" }
                      ].map((exercise, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">{exercise.subject}</h4>
                              <p className="text-sm text-muted-foreground">{exercise.topic}</p>
                            </div>
                            <Badge variant="outline">{exercise.difficulty}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">{exercise.generated}</span>
                            <Button size="sm" variant="outline">
                              <Target className="w-4 h-4 mr-1" />
                              Practicar
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeMode === 'analysis' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Análisis de Interacciones IA</CardTitle>
                    <CardDescription>
                      Insights sobre tu uso de LectoGuía IA
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-3">Patrones de Estudio</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <div className="text-sm text-blue-700">Hora más activa</div>
                            <div className="font-bold text-blue-900">20:00 - 22:00</div>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <div className="text-sm text-green-700">Materia favorita</div>
                            <div className="font-bold text-green-900">Historia</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Efectividad IA</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Precisión de respuestas</span>
                            <span className="text-sm font-medium">94%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Tiempo de respuesta promedio</span>
                            <span className="text-sm font-medium">1.2s</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Satisfacción del usuario</span>
                            <span className="text-sm font-medium">4.8/5</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Temas Recientes</CardTitle>
                <CardDescription>Conceptos que has explorado recientemente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTopics.map((topic, index) => (
                    <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="font-medium text-sm">{topic.topic}</div>
                      <div className="text-xs text-muted-foreground">
                        {topic.interactions} interacciones • {topic.lastUsed}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <BookOpen className="w-4 h-4" />
                  Explicar concepto
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <Target className="w-4 h-4" />
                  Generar ejercicio
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Analizar progreso
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <Zap className="w-4 h-4" />
                  Estrategia de estudio
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default LectoGuia;
