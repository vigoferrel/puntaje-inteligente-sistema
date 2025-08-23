/* eslint-disable react-refresh/only-export-components */

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Button } from "../../components/ui/button";
import { ClipboardCheck, Clock, BarChart2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "../../components/ui/progress";
import { DiagnosticResult } from "../../types/diagnostic";
import { TPAESHabilidad } from "../../types/system-types";
import { SkillProgress } from "../../components/skill-progress";

interface DiagnosticSummaryProps {
  loading: boolean;
  latestResult?: DiagnosticResult;
  hasAvailableDiagnostics: boolean;
  pendingDiagnostics: number;
  className?: string;
}

export const DiagnosticSummary = ({
  loading,
  latestResult,
  hasAvailableDiagnostics,
  pendingDiagnostics,
  className
}: DiagnosticSummaryProps) => {
  // Calcula el promedio de las habilidades si hay resultados
  const averageScore = latestResult 
    ? Object.values(latestResult.results).reduce((sum, val) => sum + val, 0) / 
      Object.values(latestResult.results).length * 100
    : 0;
  
  // Obtener las 2 mejores habilidades
  const topSkills = latestResult 
    ? Object.entries(latestResult.results)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 2)
        .map(([skill]) => skill as TPAESHabilidad)
    : [];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es', { 
      day: 'numeric', 
      month: 'short',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardTitle className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-primary" />
          DiagnÃ³stico
        </CardTitle>
        <CardDescription>
          EvaluaciÃ³n de tus habilidades y conocimientos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {loading ? (
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 animate-pulse rounded" />
            <div className="h-16 bg-gray-200 animate-pulse rounded" />
            <div className="h-4 bg-gray-200 animate-pulse rounded" />
          </div>
        ) : latestResult ? (
          <>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span>Nivel promedio</span>
                <span className="font-medium">{Math.round(averageScore)}%</span>
              </div>
              <Progress value={averageScore} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Ãšltimo diagnÃ³stico completado: {formatDate(latestResult.completedAt)}
              </p>
            </div>
            
            {topSkills.length > 0 && (
              <div className="space-y-2 mt-4">
                <h4 className="text-sm font-medium">Tus mejores habilidades</h4>
                {topSkills.map(skill => (
                  <SkillProgress 
                    key={skill}
                    skill={skill}
                    level={latestResult.results[skill]}
                  />
                ))}
              </div>
            )}
          </>
        ) : hasAvailableDiagnostics ? (
          <div className="text-center py-4">
            <Clock className="w-12 h-12 text-muted-foreground opacity-50 mx-auto mb-3" />
            <h3 className="text-lg font-medium">DiagnÃ³stico pendiente</h3>
            <p className="text-sm text-muted-foreground mt-2">
              No has completado ningÃºn diagnÃ³stico. Realiza tu primera evaluaciÃ³n para obtener un plan personalizado.
            </p>
          </div>
        ) : (
          <div className="text-center py-4">
            <BarChart2 className="w-12 h-12 text-muted-foreground opacity-50 mx-auto mb-3" />
            <h3 className="text-lg font-medium">Sin diagnÃ³sticos disponibles</h3>
            <p className="text-sm text-muted-foreground mt-2">
              No hay diagnÃ³sticos disponibles en este momento. Pronto aÃ±adiremos nuevos diagnÃ³sticos para ti.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t bg-muted/40 p-4">
        <Button 
          asChild 
          className="w-full group"
          variant={latestResult ? "outline" : "default"}
        >
          <Link to="/diagnostico">
            {latestResult 
              ? "Ver todos los diagnÃ³sticos" 
              : pendingDiagnostics > 0 
                ? `Realizar diagnÃ³stico${pendingDiagnostics > 1 ? 's' : ''} (${pendingDiagnostics})` 
                : "Explorar diagnÃ³sticos"
            }
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

