
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DiagnosticResult } from "@/types/diagnostic";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { BarChart, Calendar, CheckCircle, ClipboardList, ExternalLink, HistoryIcon, RefreshCw } from "lucide-react";
import { TPAESHabilidad } from "@/types/system-types";
import { useDiagnosticHistory } from "@/hooks/diagnostic/results/use-diagnostic-history";
import { SkillProgress } from "@/components/skill-progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { motion } from "framer-motion";
import { SkillRadarChart } from "./SkillRadarChart";

interface DiagnosticHistoryProps {
  onSelectResult?: (result: DiagnosticResult) => void;
  className?: string;
}

export const DiagnosticHistory = ({ onSelectResult, className = "" }: DiagnosticHistoryProps) => {
  const { results, loading, error, refreshResults } = useDiagnosticHistory();
  
  // Ordenar resultados por fecha (más reciente primero)
  const sortedResults = [...results].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );
  
  // Obtener el resultado más reciente
  const latestResult = sortedResults.length > 0 ? sortedResults[0] : null;
  
  // Preparar datos para el gráfico de progreso
  const prepareChartData = () => {
    if (results.length === 0) return [];
    
    // Obtener todas las habilidades únicas de todos los resultados
    const allSkills = new Set<TPAESHabilidad>();
    results.forEach(result => {
      Object.keys(result.results).forEach(skill => {
        allSkills.add(skill as TPAESHabilidad);
      });
    });
    
    // Crear datos para el gráfico ordenados por fecha (más antiguo primero)
    return [...results]
      .sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime())
      .map(result => {
        const chartPoint: any = {
          date: format(new Date(result.completedAt), 'dd/MM/yy'),
          timestamp: new Date(result.completedAt).getTime(),
        };
        
        // Añadir cada habilidad como una propiedad
        allSkills.forEach(skill => {
          if (result.results[skill] !== undefined) {
            // Convertir a porcentaje
            chartPoint[skill] = Math.round(result.results[skill] * 100);
          } else {
            chartPoint[skill] = 0;
          }
        });
        
        // Añadir promedio
        const values = Object.values(result.results) as number[];
        chartPoint.average = Math.round(
          values.reduce((sum, val) => sum + val, 0) / values.length * 100
        );
        
        return chartPoint;
      });
  };
  
  const chartData = prepareChartData();
  
  // Obtener colores para cada habilidad
  const getSkillColor = (skill: TPAESHabilidad, index: number): string => {
    const colors = [
      "#3b82f6", // blue-500
      "#f97316", // orange-500
      "#10b981", // emerald-500
      "#8b5cf6", // violet-500
      "#ef4444", // red-500
      "#f59e0b", // amber-500
      "#6366f1", // indigo-500
      "#ec4899", // pink-500
      "#14b8a6", // teal-500
      "#0ea5e9", // sky-500
    ];
    
    // Asignar color según índice o usar un color predeterminado si no hay suficientes
    return colors[index % colors.length];
  };
  
  // Renderizar líneas para cada habilidad
  const renderLines = () => {
    if (chartData.length === 0) return null;
    
    const skills = Object.keys(chartData[0])
      .filter(key => key !== 'date' && key !== 'timestamp' && key !== 'average');
    
    return [
      // Primero la línea de promedio
      <Line
        key="average"
        type="monotone"
        dataKey="average"
        stroke="#9333ea" // violeta
        strokeWidth={2.5}
        dot={{ r: 4 }}
        activeDot={{ r: 6, strokeWidth: 2 }}
        name="Promedio"
      />,
      // Luego todas las demás habilidades
      ...skills.map((skill, index) => (
        <Line
          key={skill}
          type="monotone"
          dataKey={skill}
          stroke={getSkillColor(skill as TPAESHabilidad, index)}
          strokeWidth={1.5}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
          name={skill}
        />
      ))
    ];
  };
  
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-[300px] w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Historial de diagnósticos</CardTitle>
          <CardDescription className="text-destructive">
            {error}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Button 
            variant="outline" 
            onClick={refreshResults}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (results.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HistoryIcon className="h-5 w-5 text-muted-foreground" />
            Historial de diagnósticos
          </CardTitle>
          <CardDescription>
            No hay diagnósticos completados
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center py-8">
          <ClipboardList className="h-16 w-16 text-muted-foreground mb-4 opacity-30" />
          <p className="text-muted-foreground mb-4">
            No has completado ningún diagnóstico todavía. 
            Completa un diagnóstico para ver tu progreso aquí.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HistoryIcon className="h-5 w-5 text-primary" />
            Historial de diagnósticos
          </CardTitle>
          <CardDescription>
            Tu progreso a lo largo del tiempo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="progress">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="progress" className="flex-1 gap-2">
                <BarChart className="h-4 w-4" />
                Progreso
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1 gap-2">
                <ClipboardList className="h-4 w-4" />
                Historial
              </TabsTrigger>
              {latestResult && (
                <TabsTrigger value="latest" className="flex-1 gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Último
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="progress">
              {chartData.length > 1 ? (
                <div className="space-y-4">
                  <div className="h-[300px]">
                    <ChartContainer>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis domain={[0, 100]} />
                          <Tooltip 
                            formatter={(value) => [`${value}%`, '']}
                          />
                          {renderLines()}
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground border-t pt-2">
                    <div className="flex items-center gap-1">
                      <span className="inline-block w-3 h-3 rounded-full bg-purple-500"></span>
                      <span>Promedio general</span>
                    </div>
                    <div>
                      Total: {results.length} diagnóstico{results.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-2">
                    Necesitas al menos 2 diagnósticos para ver tu progreso.
                  </p>
                  {latestResult && (
                    <div className="mt-4">
                      <h3 className="font-medium mb-2">Tu diagnóstico más reciente:</h3>
                      <div className="flex justify-center">
                        <SkillRadarChart 
                          skillScores={latestResult.results}
                          title=""
                          description=""
                          className="max-w-md"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="history">
              <div className="space-y-4">
                {sortedResults.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <div className="p-4 sm:w-2/3">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(result.completedAt), "PPP", { locale: es })}
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            {Object.entries(result.results)
                              .sort(([, a], [, b]) => b - a)
                              .slice(0, 3)
                              .map(([skill, value]) => (
                                <SkillProgress
                                  key={skill}
                                  skill={skill as TPAESHabilidad}
                                  level={value}
                                  showLabel={true}
                                  compact={true}
                                />
                              ))}
                            
                            {Object.keys(result.results).length > 3 && (
                              <p className="text-xs text-muted-foreground text-right">
                                +{Object.keys(result.results).length - 3} más
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="p-4 bg-muted/30 flex flex-col justify-center items-center border-t sm:border-t-0 sm:border-l sm:w-1/3">
                          {onSelectResult && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onSelectResult(result)}
                              className="w-full flex items-center gap-2"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Ver detalles
                            </Button>
                          )}
                          
                          <div className="mt-2 text-center">
                            <div className="text-2xl font-bold">
                              {Math.round(
                                Object.values(result.results)
                                  .reduce((sum, val) => sum + val, 0) / 
                                Object.values(result.results).length * 100
                              )}%
                            </div>
                            <div className="text-xs text-muted-foreground">Promedio</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            
            {latestResult && (
              <TabsContent value="latest">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Último diagnóstico</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(latestResult.completedAt), "PPP 'a las' p", { locale: es })}
                      </p>
                    </div>
                    {onSelectResult && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectResult(latestResult)}
                      >
                        Ver completo
                      </Button>
                    )}
                  </div>
                  
                  <SkillRadarChart
                    skillScores={latestResult.results}
                    title="Resultados recientes"
                    description="Tu perfil de habilidades actual"
                  />
                  
                  <div className="space-y-3">
                    {Object.entries(latestResult.results)
                      .sort(([, a], [, b]) => b - a)
                      .map(([skill, value]) => (
                        <SkillProgress
                          key={skill}
                          skill={skill as TPAESHabilidad}
                          level={value}
                          showLabel={true}
                        />
                      ))}
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
          
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshResults}
              className="text-xs flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              Actualizar
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
