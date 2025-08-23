
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Loader2, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface DiagnosticSkeletonProps {
  message?: string;
  generating?: boolean;
  progress?: number;
  step?: string;
}

export const DiagnosticSkeleton = ({ 
  message = "Cargando diagnósticos...", 
  generating = false,
  progress = 0,
  step = "Preparando diagnósticos"
}: DiagnosticSkeletonProps) => {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Mensaje de carga con animación */}
      <Card className="border border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <div className="animate-pulse mb-4 flex justify-center">
            {generating ? (
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            ) : (
              <Brain className="w-12 h-12 text-primary animate-pulse" />
            )}
          </div>
          <h3 className="text-xl font-medium text-center">{message}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground mb-4">
            {generating ? 
              "Esto puede tomar hasta 30 segundos mientras generamos ejercicios de calidad..." : 
              "Estamos preparando tu experiencia de diagnóstico..."
            }
          </p>
          
          {progress > 0 && (
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{step}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-primary/10" />
            </div>
          )}
          
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div className="h-2 bg-primary/10 rounded animate-pulse"></div>
            <div className="h-2 bg-primary/20 rounded animate-pulse delay-150"></div>
            <div className="h-2 bg-primary/10 rounded animate-pulse delay-300"></div>
          </div>
        </CardContent>
      </Card>

      {/* Tarjetas skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden border-dashed border-gray-200 bg-gray-50/50">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4 mb-2 bg-gray-200" />
              <Skeleton className="h-4 w-full bg-gray-200" />
            </CardHeader>
            <CardContent className="pb-2">
              <Skeleton className="h-4 w-1/3 mb-2 bg-gray-200" />
              <Skeleton className="h-4 w-1/2 bg-gray-200" />
              <div className="mt-3">
                <Skeleton className="h-2 w-full bg-primary/5" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full bg-gray-200" />
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center">
        <div className="h-2 w-16 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </motion.div>
  );
};
