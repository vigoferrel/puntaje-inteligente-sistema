import React, { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { 
  Dumbbell, 
  Target, 
  Zap, 
  Clock, 
  TrendingUp, 
  Play, 
  CheckCircle,
  Calendar,
  Brain,
  Award
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

const Entrenamiento = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState("personalizado");

  const sessionStats = {
    weeklyProgress: 75,
    weeklyGoal: 10,
    completedSessions: 8,
    streakDays: 5,
    totalSessions: 42,
    averageScore: 85,
    timeSpent: 180 // minutos
  };

  const trainingModes = [
    {
      id: "personalizado",
      title: "Entrenamiento Personalizado",
      description: "Sesiones adaptadas a tus fortalezas y debilidades",
      icon: Target,
      color: "from-blue-500 to-cyan-500",
      sessions: 12,
      difficulty: "Adaptativo"
    },
    {
      id: "intensivo",
      title: "Modo Intensivo",
      description: "Sesiones concentradas para maximizar el aprendizaje",
      icon: Zap,
      color: "from-red-500 to-orange-500",
      sessions: 8,
      difficulty: "Alto"
    },
    {
      id: "repaso",
      title: "Repaso Inteligente",
      description: "Revisión de conceptos con IA espaciada",
      icon: Brain,
      color: "from-purple-500 to-pink-500",
      sessions: 15,
      difficulty: "Medio"
    }
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
              <BreadcrumbLink>Entrenamiento</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <Dumbbell className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Entrenamiento PAES</h1>
              <p className="text-muted-foreground">
                Entrena de forma inteligente con sesiones personalizadas
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Esta Semana</span>
                </div>
                <div className="text-2xl font-bold">{sessionStats.completedSessions}/{sessionStats.weeklyGoal}</div>
                <Progress value={sessionStats.weeklyProgress} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Racha Actual</span>
                </div>
                <div className="text-2xl font-bold">{sessionStats.streakDays} días</div>
                <div className="text-sm text-muted-foreground">¡Sigue así!</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium">Promedio</span>
                </div>
                <div className="text-2xl font-bold">{sessionStats.averageScore}%</div>
                <div className="text-sm text-muted-foreground">Última semana</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium">Tiempo Total</span>
                </div>
                <div className="text-2xl font-bold">{Math.round(sessionStats.timeSpent / 60)}h</div>
                <div className="text-sm text-muted-foreground">Este mes</div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Training Modes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {trainingModes.map((mode, index) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${mode.color} flex items-center justify-center mb-4`}>
                    <mode.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    {mode.title}
                    <Badge variant="secondary">{mode.sessions} sesiones</Badge>
                  </CardTitle>
                  <CardDescription>{mode.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Dificultad:</span>
                    <Badge variant={mode.difficulty === 'Alto' ? 'destructive' : mode.difficulty === 'Medio' ? 'default' : 'secondary'}>
                      {mode.difficulty}
                    </Badge>
                  </div>
                  <Button className="w-full" onClick={() => setActiveTab(mode.id)}>
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar Entrenamiento
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Sesiones Recientes</CardTitle>
            <CardDescription>
              Tu progreso en las últimas sesiones de entrenamiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { subject: "Matemática M1", score: 92, time: "25 min", date: "Hoy" },
                { subject: "Comprensión Lectora", score: 88, time: "30 min", date: "Ayer" },
                { subject: "Ciencias", score: 85, time: "35 min", date: "2 días" },
                { subject: "Historia", score: 90, time: "28 min", date: "3 días" }
              ].map((session, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-medium">{session.subject}</div>
                      <div className="text-sm text-muted-foreground">{session.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{session.score}%</div>
                    <div className="text-sm text-muted-foreground">{session.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Entrenamiento;
