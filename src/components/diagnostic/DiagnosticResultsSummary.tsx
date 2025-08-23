
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SkillProgress } from "@/components/skill-progress";
import { TPAESHabilidad } from "@/types/system-types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";

interface DiagnosticResultsSummaryProps {
  results: Record<TPAESHabilidad, number>;
}

export const DiagnosticResultsSummary = ({ results }: DiagnosticResultsSummaryProps) => {
  // Check if results are empty or undefined
  const hasResults = results && Object.keys(results).length > 0;
  
  if (!hasResults) {
    return (
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-700">Sin resultados disponibles</AlertTitle>
        <AlertDescription className="text-blue-700">
          No hay resultados para mostrar. Esto puede deberse a que el diagnóstico no ha sido completado
          o hubo un problema al procesar los resultados.
        </AlertDescription>
      </Alert>
    );
  }

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
      skillName: getSkillDisplayName(skill as TPAESHabilidad),
    }))
    .sort((a, b) => b.level - a.level);

  // Calcular promedio general
  const averageScore = 
    Object.values(results).reduce((sum, value) => sum + value, 0) / 
    Object.values(results).length;

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
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
              <motion.div 
                className="relative w-32 h-32 mb-2"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
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
                  <motion.circle 
                    className="text-primary" 
                    strokeWidth="10" 
                    strokeDasharray={`${averageScore * 2.51327} 251.327`}
                    strokeLinecap="round" 
                    stroke="currentColor" 
                    fill="transparent" 
                    r="40" 
                    cx="50" 
                    cy="50" 
                    initial={{ strokeDasharray: "0 251.327" }}
                    animate={{ strokeDasharray: `${averageScore * 2.51327} 251.327` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </svg>
              </motion.div>
              <p className="text-sm text-muted-foreground text-center">
                {getPerformanceMessage(averageScore)}
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Top Skills */}
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Tus fortalezas</CardTitle>
                  <CardDescription>Las habilidades donde muestras mayor dominio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topSkills.map((skill, index) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + (index * 0.1) }}
                    >
                      <SkillProgress 
                        skill={skill} 
                        level={results[skill] / 100} // Convert percentage back to 0-1 scale for SkillProgress
                      />
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Bottom Skills */}
            <motion.div
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Áreas de mejora</CardTitle>
                  <CardDescription>Las habilidades que requieren mayor atención</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {bottomSkills.map((skill, index) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + (index * 0.1) }}
                    >
                      <SkillProgress 
                        skill={skill} 
                        level={results[skill] / 100} // Convert percentage back to 0-1 scale for SkillProgress
                      />
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
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
                    .map(([skill, level], index) => (
                      <motion.tr
                        key={skill}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className="border-b"
                      >
                        <TableCell className="font-medium">{getSkillDisplayName(skill as TPAESHabilidad)}</TableCell>
                        <TableCell>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <motion.div 
                              className="bg-primary h-2.5 rounded-full" 
                              style={{ width: "0%" }}
                              animate={{ width: `${level}%` }}
                              transition={{ duration: 0.8, delay: 0.1 * index }}
                            ></motion.div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{level}%</TableCell>
                      </motion.tr>
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
              <motion.div 
                className="h-[400px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
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
              </motion.div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
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
