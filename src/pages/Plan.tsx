
import React, { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { PlanInteligenteGenerator } from "@/components/plan/PlanInteligenteGenerator";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Clock,
  Zap,
  Settings
} from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

const Plan = () => {
  const [activeView, setActiveView] = useState<'generator' | 'current' | 'history'>('generator');
  const [isGenerating, setIsGenerating] = useState(false);

  const currentPlan = {
    title: "Plan Integral PAES 2024",
    progress: 65,
    totalWeeks: 12,
    currentWeek: 8,
    completedNodes: 45,
    totalNodes: 70,
    estimatedCompletion: "15 marzo 2024"
  };

  const handleGeneratePlan = async (config: any) => {
    setIsGenerating(true);
    // Simular generación
    setTimeout(() => {
      setIsGenerating(false);
      setActiveView('current');
    }, 3000);
  };

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
              <BreadcrumbLink>Plan Inteligente</BreadcrumbLink>
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
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Brain className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Plan Inteligente PAES</h1>
              <p className="text-muted-foreground">
                Genera tu plan de estudio personalizado con IA
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {[
              { id: 'generator', label: 'Generar Plan', icon: Zap },
              { id: 'current', label: 'Plan Actual', icon: Target },
              { id: 'history', label: 'Historial', icon: Calendar }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeView === tab.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView(tab.id as any)}
                className="gap-2"
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        {activeView === 'generator' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <PlanInteligenteGenerator 
              onGeneratePlan={handleGeneratePlan}
              isGenerating={isGenerating}
            />
          </motion.div>
        )}

        {activeView === 'current' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Plan Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      {currentPlan.title}
                    </CardTitle>
                    <CardDescription>
                      Semana {currentPlan.currentWeek} de {currentPlan.totalWeeks} • 
                      Completar para el {currentPlan.estimatedCompletion}
                    </CardDescription>
                  </div>
                  <Badge variant="default" className="bg-green-600">
                    {currentPlan.progress}% completado
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress value={currentPlan.progress} className="h-3" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {currentPlan.completedNodes}
                      </div>
                      <div className="text-sm text-blue-700">Nodos completados</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {currentPlan.totalNodes - currentPlan.completedNodes}
                      </div>
                      <div className="text-sm text-orange-700">Nodos restantes</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {currentPlan.totalWeeks - currentPlan.currentWeek}
                      </div>
                      <div className="text-sm text-green-700">Semanas restantes</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Week */}
            <Card>
              <CardHeader>
                <CardTitle>Semana Actual - Semana {currentPlan.currentWeek}</CardTitle>
                <CardDescription>Objetivos y actividades para esta semana</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { day: "Lunes", subject: "Comprensión Lectora", status: "completed", time: "45 min" },
                    { day: "Martes", subject: "Matemática M1", status: "completed", time: "60 min" },
                    { day: "Miércoles", subject: "Ciencias", status: "in_progress", time: "50 min" },
                    { day: "Jueves", subject: "Historia", status: "pending", time: "40 min" },
                    { day: "Viernes", subject: "Matemática M2", status: "pending", time: "55 min" }
                  ].map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          session.status === 'completed' ? 'bg-green-500' :
                          session.status === 'in_progress' ? 'bg-yellow-500' : 'bg-gray-300'
                        }`} />
                        <div>
                          <div className="font-medium">{session.day}</div>
                          <div className="text-sm text-muted-foreground">{session.subject}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{session.time}</span>
                        {session.status === 'completed' && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        {session.status === 'in_progress' && (
                          <Clock className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeView === 'history' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Historial de Planes</CardTitle>
                <CardDescription>Planes de estudio anteriores y sus resultados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Plan Diagnóstico Inicial", completion: 100, duration: "4 semanas", result: "+35 puntos" },
                    { name: "Plan Refuerzo Matemática", completion: 85, duration: "6 semanas", result: "+28 puntos" },
                    { name: "Plan Integral Actual", completion: 65, duration: "12 semanas", result: "En progreso" }
                  ].map((plan, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{plan.name}</h4>
                        <Badge variant={plan.completion === 100 ? 'default' : 'secondary'}>
                          {plan.completion}%
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {plan.duration} • {plan.result}
                      </div>
                      <Progress value={plan.completion} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default Plan;
