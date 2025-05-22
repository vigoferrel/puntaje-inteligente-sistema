
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkillRadarChart } from "./SkillRadarChart";
import { SkillProgress } from "@/components/skill-progress";
import { DiagnosticResult } from "@/types/diagnostic";
import { TPAESHabilidad, getHabilidadDisplayName } from "@/types/system-types";
import { ArrowRight, BarChart2, BookOpen, CheckCircle, List } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "../ui/breadcrumb";

interface DetailedResultViewProps {
  results?: DiagnosticResult;
  onRestartDiagnostic: () => void;
  onViewPlan?: () => void;
}

export const DetailedResultView = ({ 
  results, 
  onRestartDiagnostic,
  onViewPlan 
}: DetailedResultViewProps) => {
  if (!results?.results) {
    return (
      <Card className="p-6 text-center">
        <CardTitle className="mb-4">No hay resultados disponibles</CardTitle>
        <CardDescription className="mb-4">
          No se encontraron resultados para mostrar. Intenta completar un diagnóstico primero.
        </CardDescription>
        <Button onClick={onRestartDiagnostic}>Realizar diagnóstico</Button>
      </Card>
    );
  }

  // Calcular el promedio general
  const skillValues = Object.values(results.results);
  const averageScore = skillValues.reduce((sum, val) => sum + val, 0) / skillValues.length;
  
  // Ordenar habilidades por nivel (de mayor a menor)
  const sortedSkills = Object.entries(results.results)
    .sort(([, a], [, b]) => b - a)
    .map(([skill]) => skill as TPAESHabilidad);

  // Identificar fortalezas y áreas de mejora
  const strengths = sortedSkills.slice(0, 2);
  const weaknesses = [...sortedSkills].reverse().slice(0, 2);

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link to="/">Inicio</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link to="/diagnostico">Diagnóstico</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Resultados</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Resultados de tu diagnóstico</h2>
        <p className="text-muted-foreground">
          Completado el {new Date(results.completedAt).toLocaleDateString('es-CL', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="text-blue-600" />
            Diagnóstico completado
          </CardTitle>
          <CardDescription>
            Tu nivel promedio es <span className="font-semibold">{Math.round(averageScore * 100)}%</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <p className="text-sm">
              Basado en tus resultados, hemos identificado tus fortalezas y áreas de mejora.
              Utiliza esta información para enfocar tu preparación en los aspectos que más necesitas trabajar.
            </p>
            <div className="flex justify-end">
              <Button 
                variant="default" 
                onClick={onViewPlan || (() => {})} 
                asChild
                className="group"
              >
                <Link to="/plan">
                  Ver mi plan de estudio personalizado
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList>
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span>Resumen</span>
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            <span>Detalles por habilidad</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Recomendaciones</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SkillRadarChart 
              skillScores={results.results} 
              title="Perfil de Habilidades" 
              description="Visualización de tu nivel en cada habilidad evaluada" 
            />
            
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tus fortalezas</CardTitle>
                  <CardDescription>Habilidades en las que destacas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {strengths.map(skill => (
                    <SkillProgress
                      key={skill}
                      skill={skill}
                      level={results.results[skill]}
                    />
                  ))}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Áreas de mejora</CardTitle>
                  <CardDescription>Habilidades que requieren más atención</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {weaknesses.map(skill => (
                    <SkillProgress
                      key={skill}
                      skill={skill}
                      level={results.results[skill]}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="skills" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Detalle por habilidad</CardTitle>
              <CardDescription>Análisis completo de todas tus habilidades evaluadas</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {sortedSkills.map(skill => (
                <div key={skill} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="mb-2">
                    <h3 className="font-medium">{getHabilidadDisplayName(skill)}</h3>
                    <p className="text-sm text-muted-foreground">Nivel: {Math.round(results.results[skill] * 100)}%</p>
                  </div>
                  <SkillProgress
                    skill={skill}
                    level={results.results[skill]}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones personalizadas</CardTitle>
              <CardDescription>
                Basado en tu diagnóstico, te recomendamos enfocar tu estudio en las siguientes áreas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {weaknesses.map(skill => (
                <div key={skill} className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">{getHabilidadDisplayName(skill)}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Recomendamos enfocarte en mejorar esta habilidad con ejercicios específicos y material de estudio.
                  </p>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/plan">Ver ejercicios recomendados</Link>
                  </Button>
                </div>
              ))}
              
              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={onRestartDiagnostic}>
                  Realizar diagnóstico nuevamente
                </Button>
                <Button asChild>
                  <Link to="/plan">
                    Ir a mi plan de estudio
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
