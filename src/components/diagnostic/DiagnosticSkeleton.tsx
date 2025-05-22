
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface DiagnosticSkeletonProps {
  message?: string;
  generating?: boolean;
}

export const DiagnosticSkeleton = ({ 
  message = "Cargando diagnósticos...", 
  generating = false 
}: DiagnosticSkeletonProps) => {
  return (
    <div className="space-y-6">
      {/* Mensaje de carga con animación */}
      <div className="flex justify-center p-4">
        <div className="text-center">
          <div className="animate-pulse mb-4 flex justify-center">
            {generating ? (
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            ) : (
              <svg 
                className="w-10 h-10 text-primary" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            )}
          </div>
          <p className="text-muted-foreground">{message}</p>
          {generating && (
            <p className="text-sm text-muted-foreground mt-2">
              Esto puede tomar hasta 30 segundos mientras generamos ejercicios de calidad...
            </p>
          )}
        </div>
      </div>

      {/* Tarjetas skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="pb-2">
              <Skeleton className="h-4 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
