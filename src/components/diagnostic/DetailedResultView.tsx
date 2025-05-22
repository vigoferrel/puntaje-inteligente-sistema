
import React, { useState } from "react";
import { TestResultView } from "./TestResultView";
import { Button } from "@/components/ui/button";
import { DiagnosticResult } from "@/types/diagnostic";
import { SkillRadarChart } from "./SkillRadarChart";
import { TPAESHabilidad } from "@/types/system-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, Brain, Lightbulb, Target } from "lucide-react";
import { motion } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DetailedResultViewProps {
  onRestartDiagnostic: () => void;
  results?: Record<TPAESHabilidad, number>;
  completedAt?: string;
  testTitle?: string;
  showRecommendations?: boolean;
}

export const DetailedResultView = ({
  onRestartDiagnostic,
  results,
  completedAt,
  testTitle = "Diagnóstico PAES",
  showRecommendations = true
}: DetailedResultViewProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("results");
  
  // Estructura para recomendaciones basadas en habilidades
  const getRecommendations = () => {
    if (!results) return [];
    
    // Determinar áreas de mejora (habilidades con puntuación menor a 60%)
    const areasToImprove = Object.entries(results)
      .filter(([_, score]) => score < 0.6)
      .map(([skill]) => skill as TPAESHabilidad);
    
    // Generar recomendaciones específicas para cada área
    return areasToImprove.map(skill => {
      const recommendations = {
        SOLVE_PROBLEMS: {
          title: "Mejora tu resolución de problemas",
          activities: [
            "Practica con problemas matemáticos en contextos reales",
            "Enfócate en entender el enunciado antes de intentar resolver",
            "Utiliza distintas estrategias para el mismo problema"
          ]
        },
        REPRESENT: {
          title: "Refuerza tu representación matemática",
          activities: [
            "Practica la conversión entre representaciones diferentes",
            "Trabaja con gráficos y tablas de datos",
            "Relaciona expresiones algebraicas con representaciones visuales"
          ]
        },
        MODEL: {
          title: "Desarrolla tu modelamiento matemático",
          activities: [
            "Practica la creación de modelos matemáticos para situaciones cotidianas",
            "Analiza modelos existentes y su aplicación",
            "Verifica y ajusta modelos con datos reales"
          ]
        },
        INTERPRET_RELATE: {
          title: "Mejora tu interpretación de textos",
          activities: [
            "Practica la lectura activa subrayando ideas principales",
            "Conecta información de diferentes párrafos",
            "Identifica la intención comunicativa del autor"
          ]
        },
        EVALUATE_REFLECT: {
          title: "Desarrolla tu capacidad de evaluación y reflexión",
          activities: [
            "Practica el análisis crítico de textos argumentativos",
            "Evalúa la validez de argumentos y evidencias",
            "Relaciona el contenido con tu conocimiento previo"
          ]
        },
        TRACK_LOCATE: {
          title: "Refuerza tu ubicación de información",
          activities: [
            "Practica la búsqueda de datos específicos en textos",
            "Identifica rápidamente secciones relevantes",
            "Utiliza estrategias de escaneo de información"
          ]
        },
        ARGUE_COMMUNICATE: {
          title: "Mejora tu argumentación",
          activities: [
            "Practica la construcción de argumentos con evidencias",
            "Desarrolla conclusiones basadas en premisas",
            "Ejercita la comunicación de ideas matemáticas con precisión"
          ]
        }
      };
      
      // Devolver recomendación para la habilidad o una genérica si no existe
      return recommendations[skill as keyof typeof recommendations] || {
        title: `Refuerza tu ${skill.toLowerCase().replace('_', ' ')}`,
        activities: [
          "Practica ejercicios específicos para esta habilidad",
          "Revisa conceptos básicos relacionados",
          "Aplica lo aprendido en contextos diversos"
        ]
      };
    });
  };
  
  const recommendations = getRecommendations();
  
  return (
    <div className="space-y-6">
      <TestResultView 
        onRestartDiagnostic={onRestartDiagnostic} 
        results={results} 
        completedAt={completedAt}
        diagnosticTitle={testTitle}
      />
      
      {showRecommendations && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-4">
              <TabsTrigger value="results" className="flex-1 gap-2">
                <Target className="h-4 w-4" />
                Resultados
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="flex-1 gap-2">
                <Lightbulb className="h-4 w-4" />
                Recomendaciones
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="results" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Radar chart of skills */}
                <SkillRadarChart 
                  skillScores={results || {}}
                  title="Visualización de habilidades" 
                  description="Representación visual de tus niveles en cada habilidad"
                  showLegend={true}
                />
                
                {/* Study tips card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      Estrategias de estudio recomendadas
                    </CardTitle>
                    <CardDescription>
                      Basadas en tu perfil de resultados
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="bg-blue-100 text-blue-800 rounded-full p-1 mt-0.5 shrink-0">
                          <span className="block h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                        </div>
                        <span>Enfócate primero en las habilidades con menor puntaje</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-blue-100 text-blue-800 rounded-full p-1 mt-0.5 shrink-0">
                          <span className="block h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                        </div>
                        <span>Dedica sesiones de estudio más cortas pero frecuentes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-blue-100 text-blue-800 rounded-full p-1 mt-0.5 shrink-0">
                          <span className="block h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                        </div>
                        <span>Alterna entre distintos tipos de ejercicios</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-blue-100 text-blue-800 rounded-full p-1 mt-0.5 shrink-0">
                          <span className="block h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                        </div>
                        <span>Realiza nuevos diagnósticos regularmente para medir tu progreso</span>
                      </li>
                    </ul>
                    
                    <Button 
                      className="w-full mt-4 group" 
                      onClick={() => navigate("/plan")}
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Ver mi plan de estudio
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="recommendations">
              {recommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">{rec.title}</CardTitle>
                          <CardDescription>
                            Actividades recomendadas para mejorar
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {rec.activities.map((activity, actIndex) => (
                              <li key={actIndex} className="flex items-start gap-2">
                                <div className="bg-primary/10 text-primary rounded-full p-1 mt-0.5 shrink-0">
                                  <span className="block h-1.5 w-1.5 rounded-full bg-primary"></span>
                                </div>
                                <span>{activity}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertTitle>No hay recomendaciones disponibles</AlertTitle>
                  <AlertDescription>
                    No se encontraron áreas específicas que requieran mejora prioritaria. 
                    Continúa practicando con tu plan de estudio para mantener tus habilidades.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      )}
    </div>
  );
};
