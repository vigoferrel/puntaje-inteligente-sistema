
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SkillProgress } from "@/components/skill-progress";
import { TPAESHabilidad } from "@/types/system-types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DiagnosticResultsSummaryProps {
  results: Record<TPAESHabilidad, number>;
}

export const DiagnosticResultsSummary = ({ results }: DiagnosticResultsSummaryProps) => {
  // Find the top 3 skills
  const topSkills = Object.entries(results)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([skill]) => skill as TPAESHabilidad);

  // Find the bottom 3 skills
  const bottomSkills = Object.entries(results)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 3)
    .map(([skill]) => skill as TPAESHabilidad);

  // Create chart data - results are already percentages
  const chartData = Object.entries(results)
    .map(([skill, level]) => ({
      skill,
      level,
      // Traducir la abreviatura de habilidad a un nombre más legible
      skillName: getSkillDisplayName(skill as TPAESHabilidad),
    }))
    .sort((a, b) => b.level - a.level);

  // Calcular promedio general
  const averageScore = 
    Object.values(results).reduce((sum, value) => sum + value, 0) / 
    Object.values(results).length;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="details">Detalles</TabsTrigger>
          <TabsTrigger value="chart">Gráficos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Puntaje promedio */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Puntaje general</CardTitle>
              <CardDescription>Tu desempeño general en el diagnóstico</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-2">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold">{Math.round(averageScore)}</span>
                  <span className="text-sm align-top mt-2 ml-1">%</span>
                </div>
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    className="text-muted-foreground/20" 
                    strokeWidth="10" 
                    stroke="currentColor" 
                    fill="transparent" 
                    r="40" 
                    cx="50" 
                    cy="50" 
                  />
                  <circle 
                    className="text-primary transition-all duration-1000 ease-in-out" 
                    strokeWidth="10" 
                    strokeDasharray={`${averageScore * 2.51327} 251.327`}
                    strokeLinecap="round" 
                    stroke="currentColor" 
                    fill="transparent" 
                    r="40" 
                    cx="50" 
                    cy="50" 
                  />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                {getPerformanceMessage(averageScore)}
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Top Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Tus fortalezas</CardTitle>
                <CardDescription>Las habilidades donde muestras mayor dominio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {topSkills.map((skill) => (
                  <SkillProgress 
                    key={skill} 
                    skill={skill} 
                    level={results[skill] / 100} // Convert percentage back to 0-1 scale for SkillProgress
                  />
                ))}
              </CardContent>
            </Card>

            {/* Bottom Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Áreas de mejora</CardTitle>
                <CardDescription>Las habilidades que requieren mayor atención</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {bottomSkills.map((skill) => (
                  <SkillProgress 
                    key={skill} 
                    skill={skill} 
                    level={results[skill] / 100} // Convert percentage back to 0-1 scale for SkillProgress
                  />
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Detalle de habilidades</CardTitle>
              <CardDescription>Desglose completo de tus resultados por habilidad</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Habilidad</TableHead>
                    <TableHead>Nivel</TableHead>
                    <TableHead className="text-right">Porcentaje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(results)
                    .sort(([, a], [, b]) => b - a)
                    .map(([skill, level]) => (
                      <TableRow key={skill}>
                        <TableCell className="font-medium">{getSkillDisplayName(skill as TPAESHabilidad)}</TableCell>
                        <TableCell>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div 
                              className="bg-primary h-2.5 rounded-full" 
                              style={{ width: `${level}%` }}
                            ></div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{level}%</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle>Visualización de resultados</CardTitle>
              <CardDescription>Gráfico comparativo de tus habilidades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer 
                  config={{
                    skill: {
                      theme: {
                        light: "#3b82f6",
                        dark: "#60a5fa"
                      }
                    }
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis 
                        dataKey="skill" 
                        tickFormatter={(value) => value.substring(0, 3).toUpperCase()} 
                      />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Nivel']}
                        labelFormatter={(label) => `Habilidad: ${getSkillDisplayName(label as TPAESHabilidad)}`}
                      />
                      <Bar dataKey="level" fill="var(--color-skill)" name="Nivel" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Función auxiliar para mostrar nombres de habilidades más amigables
function getSkillDisplayName(skill: TPAESHabilidad): string {
  const skillNames: Record<TPAESHabilidad, string> = {
    SOLVE_PROBLEMS: "Resolución de problemas",
    REPRESENT: "Representación",
    MODEL: "Modelamiento",
    INTERPRET_RELATE: "Interpretación y relación",
    EVALUATE_REFLECT: "Evaluación y reflexión",
    TRACK_LOCATE: "Ubicación y localización",
    ARGUE_COMMUNICATE: "Argumentación y comunicación",
    IDENTIFY_THEORIES: "Identificación de teorías",
    PROCESS_ANALYZE: "Procesamiento y análisis",
    APPLY_PRINCIPLES: "Aplicación de principios",
    SCIENTIFIC_ARGUMENT: "Argumentación científica",
    TEMPORAL_THINKING: "Pensamiento temporal",
    SOURCE_ANALYSIS: "Análisis de fuentes",
    MULTICAUSAL_ANALYSIS: "Análisis multicausal",
    CRITICAL_THINKING: "Pensamiento crítico",
    REFLECTION: "Reflexión"
  };
  
  return skillNames[skill] || skill;
}

// Función para generar un mensaje basado en el rendimiento
function getPerformanceMessage(score: number): string {
  if (score >= 90) {
    return "¡Excelente! Tienes un dominio sobresaliente de estas habilidades.";
  } else if (score >= 75) {
    return "Muy buen desempeño. Dominas bien la mayoría de los conceptos.";
  } else if (score >= 60) {
    return "Buen trabajo. Tienes un dominio adecuado pero hay espacio para mejorar.";
  } else if (score >= 40) {
    return "Hay varias áreas que requieren refuerzo. Trabaja en los conceptos básicos.";
  } else {
    return "Necesitas fortalecer significativamente estas habilidades. Comienza con lo fundamental.";
  }
}
