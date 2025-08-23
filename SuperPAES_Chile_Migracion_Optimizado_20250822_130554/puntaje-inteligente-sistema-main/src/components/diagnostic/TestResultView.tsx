/* eslint-disable react-refresh/only-export-components */

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { CheckCircle, InfoIcon, Home, RotateCw, BookOpen, BarChart, ArrowRight, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DiagnosticResultsSummary } from "../../components/diagnostic/DiagnosticResultsSummary";
import { TPAESHabilidad } from "../../types/system-types";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface TestResultViewProps {
  onRestartDiagnostic: () => void;
  results?: Record<TPAESHabilidad, number>;
  completedAt?: string;
  diagnosticTitle?: string;
}

export const TestResultView = ({ 
  onRestartDiagnostic, 
  results,
  completedAt,
  diagnosticTitle = "DiagnÃ³stico" 
}: TestResultViewProps) => {
  const navigate = useNavigate();
  
  // Convertir los resultados del rango 0-1 a porcentajes
  const percentageResults = results
    ? Object.entries(results).reduce((acc, [key, value]) => {
        acc[key as TPAESHabilidad] = Math.round(value * 100);
        return acc;
      }, {} as Record<TPAESHabilidad, number>)
    : undefined;
  
  // Formatear la fecha de completado si existe
  const formattedDate = completedAt 
    ? format(new Date(completedAt), "PPP 'a las' p", { locale: es })
    : "Fecha no disponible";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="max-w-4xl mx-auto overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b">
          <motion.div 
            className="flex justify-center mb-2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="rounded-full bg-green-100 dark:bg-green-900/50 p-3">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </motion.div>
          <CardTitle className="text-center text-2xl">Â¡{diagnosticTitle} completado!</CardTitle>
          <CardDescription className="text-center">
            Gracias por completar el diagnÃ³stico. A continuaciÃ³n podrÃ¡s ver un anÃ¡lisis de tus resultados.
          </CardDescription>
          {completedAt && (
            <div className="flex justify-center items-center mt-2 text-xs text-muted-foreground gap-1">
              <Calendar className="h-3 w-3" />
              <span>Completado el {formattedDate}</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Show results summary if available */}
          {percentageResults && Object.keys(percentageResults).length > 0 ? (
            <DiagnosticResultsSummary results={percentageResults} />
          ) : (
            <Alert className="bg-blue-50 border-blue-200">
              <InfoIcon className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-700">Resultados pendientes</AlertTitle>
              <AlertDescription className="text-blue-700">
                Los resultados detallados de tu diagnÃ³stico estarÃ¡n disponibles en breve.
              </AlertDescription>
            </Alert>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Alert className="bg-blue-50 border-blue-200">
              <InfoIcon className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-700">PrÃ³ximos pasos</AlertTitle>
              <AlertDescription className="text-blue-700">
                <p className="mb-2">Con base en tus resultados, te recomendamos:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Revisar tu plan de estudio personalizado que hemos generado basado en tu diagnÃ³stico</li>
                  <li>Concentrarte en las Ã¡reas identificadas para mejorar</li>
                  <li>Realizar ejercicios de prÃ¡ctica con LectoGuÃ­a para reforzar tus conocimientos</li>
                  <li>Programar diagnÃ³sticos periÃ³dicos para seguir tu progreso</li>
                </ul>
              </AlertDescription>
            </Alert>
          </motion.div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 border-t bg-muted/10 p-4">
          <Button 
            variant="outline" 
            onClick={onRestartDiagnostic}
            className="w-full sm:w-auto flex items-center gap-2"
          >
            <RotateCw className="w-4 h-4" />
            Ver otros diagnÃ³sticos
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate("/plan")}
            className="w-full sm:w-auto flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Ver plan de estudio
          </Button>
          <Button 
            onClick={() => navigate("/")}
            className="w-full sm:w-auto flex items-center gap-2 group"
          >
            <BarChart className="w-4 h-4" />
            Ver dashboard
            <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

