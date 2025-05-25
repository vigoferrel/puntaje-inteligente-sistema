
import React, { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { 
  BarChart2, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Brain, 
  Clock,
  Award,
  AlertTriangle,
  CheckCircle,
  Zap
} from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

const Analisis = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const analysisData = {
    overallScore: 78,
    improvement: 12,
    weakAreas: ["Geometría", "Comprensión Inferencial"],
    strongAreas: ["Álgebra", "Historia de Chile"],
    timeEfficiency: 85,
    consistency: 92
  };

  const subjectAnalysis = [
    {
      name: "Matemática M1",
      score: 85,
      trend: "up",
      improvement: 8,
      timeSpent: 120,
      areas: ["Álgebra", "Funciones", "Probabilidades"]
    },
    {
      name: "Comprensión Lectora",
      score: 72,
      trend: "down",
      improvement: -3,
      timeSpent: 95,
      areas: ["Inferencia", "Síntesis", "Vocabulario"]
    },
    {
      name: "Ciencias",
      score: 79,
      trend: "up",
      improvement: 15,
      timeSpent: 140,
      areas: ["Biología", "Química", "Física"]
    },
    {
      name: "Historia",
      score: 88,
      trend: "up",
      improvement: 5,
      timeSpent: 80,
      areas: ["Chile", "Mundial", "Cívica"]
    }
  ];

  const recommendations = [
    {
      type: "critical",
      title: "Mejorar Comprensión Inferencial",
      description: "Dedica 30 min diarios a ejercicios de inferencia textual",
      priority: "Alta"
    },
    {
      type: "important",
      title: "Reforzar Geometría",
      description: "Revisar conceptos básicos de figuras y transformaciones",
      priority: "Media"
    },
    {
      type: "suggestion",
      title: "Optimizar Tiempo de Estudio",
      description: "Considera sesiones más cortas pero frecuentes",
      priority: "Baja"
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
              <BreadcrumbLink>Análisis</BreadcrumbLink>
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
              <BarChart2 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Análisis de Retroalimentación</h1>
              <p className="text-muted-foreground">
                Análisis detallado de tu desempeño y recomendaciones personalizadas
              </p>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Puntaje General</span>
                </div>
                <div className="text-2xl font-bold">{analysisData.overallScore}%</div>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-green-500">+{analysisData.improvement}% vs mes anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium">Eficiencia</span>
                </div>
                <div className="text-2xl font-bold">{analysisData.timeEfficiency}%</div>
                <Progress value={analysisData.timeEfficiency} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium">Consistencia</span>
                </div>
                <div className="text-2xl font-bold">{analysisData.consistency}%</div>
                <div className="text-sm text-muted-foreground">Muy estable</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">Áreas Fuertes</span>
                </div>
                <div className="text-lg font-bold">{analysisData.strongAreas.length}</div>
                <div className="text-sm text-muted-foreground">dominadas</div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subject Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Análisis por Materia</CardTitle>
              <CardDescription>
                Rendimiento detallado en cada área PAES
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjectAnalysis.map((subject, index) => (
                  <motion.div
                    key={subject.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{subject.name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{subject.score}%</Badge>
                        {subject.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    <Progress value={subject.score} className="mb-2" />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{subject.timeSpent} min esta semana</span>
                      <span className={subject.improvement > 0 ? 'text-green-500' : 'text-red-500'}>
                        {subject.improvement > 0 ? '+' : ''}{subject.improvement}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones IA</CardTitle>
              <CardDescription>
                Sugerencias personalizadas para mejorar tu rendimiento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      {rec.type === 'critical' && <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />}
                      {rec.type === 'important' && <Zap className="w-5 h-5 text-yellow-500 mt-0.5" />}
                      {rec.type === 'suggestion' && <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-medium">{rec.title}</h5>
                          <Badge 
                            variant={rec.priority === 'Alta' ? 'destructive' : rec.priority === 'Media' ? 'default' : 'secondary'}
                          >
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <Button className="w-full mt-4">
                <Brain className="w-4 h-4 mr-2" />
                Generar Plan de Mejora
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Areas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Áreas Fuertes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysisData.strongAreas.map((area, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-medium">{area}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Áreas de Mejora</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysisData.weakAreas.map((area, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-red-50 rounded">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="font-medium">{area}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Analisis;
