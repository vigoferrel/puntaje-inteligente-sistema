
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, HelpCircle, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface DiagnosticErrorViewProps {
  error?: string;
  message?: string;
  onRetry: () => void;
  retryCount?: number;
}

export const DiagnosticErrorView = ({
  error = "Se produjo un error al cargar los diagnósticos",
  message = "Por favor, intenta nuevamente más tarde o contacta con soporte si el problema persiste.",
  onRetry,
  retryCount = 0
}: DiagnosticErrorViewProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
    >
      <Card className="border-destructive/30 bg-destructive/5 overflow-hidden">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-destructive/20 p-3">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-center text-destructive mb-1">Error en el diagnóstico</CardTitle>
          <CardDescription className="text-center text-destructive/90">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">{message}</p>
            
            {retryCount > 2 && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
                <div className="flex items-start">
                  <HelpCircle className="h-5 w-5 mr-2 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">¿Problemas persistentes?</h4>
                    <p>Has intentado {retryCount} veces. Puede ser un problema temporal del sistema. Intenta recargar la página completa o volver más tarde.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="outline" 
            onClick={onRetry}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4" />
            {retryCount > 1 ? "Intentar nuevamente" : "Reintentar"}
          </Button>
          
          <Button 
            variant="default"
            className="flex items-center gap-2 w-full sm:w-auto"
            asChild
          >
            <Link to="/">
              <Home className="h-4 w-4" />
              Ir al inicio
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
