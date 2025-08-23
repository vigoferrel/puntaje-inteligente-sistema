import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { BloomLevel } from "./BloomTaxonomyLevel";
import { bloomLevelMap } from "./BloomTaxonomyViewer";
import { CheckIcon, ArrowRightIcon } from "lucide-react";

interface BloomProgressIndicatorProps {
  bloomAverages: Record<BloomLevel, number>;
  className?: string;
}

export const BloomProgressIndicator: React.FC<BloomProgressIndicatorProps> = ({
  bloomAverages,
  className
}) => {
  // Sort levels by cognitive complexity (Bloom's taxonomy order)
  const orderedLevels: BloomLevel[] = ["remember", "understand", "apply", "analyze", "evaluate", "create"];
  
  // Calculate overall progress through the hierarchy
  const bloomProgress = orderedLevels.reduce((progress, level, index) => {
    const threshold = 0.7; // 70% proficiency to consider a level mastered
    
    if (bloomAverages[level] >= threshold) {
      return (index + 1) / orderedLevels.length;
    }
    return progress;
  }, 0);
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Progreso Cognitivo</CardTitle>
        <CardDescription>
          Tu avance a través de los niveles de pensamiento de Bloom
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall progress bar */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Progreso General</div>
          <Progress value={bloomProgress * 100} className="h-2" />
          <div className="text-sm text-muted-foreground text-right">
            {Math.round(bloomProgress * 100)}% completado
          </div>
        </div>
        
        {/* Level progression path */}
        <div className="flex justify-between">
          {orderedLevels.map((level, index) => {
            const threshold = 0.7; // 70% proficiency
            const isCompleted = bloomAverages[level] >= threshold;
            const isActive = bloomAverages[level] > 0 && bloomAverages[level] < threshold;
            const isNext = index > 0 && 
              bloomAverages[orderedLevels[index - 1]] >= threshold && 
              bloomAverages[level] < threshold;
            
            // Get colors and styles based on state
            const colorClass = isCompleted 
              ? "bg-green-500 text-white" 
              : isActive
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-500";
                
            const sizeClass = isNext ? "w-10 h-10" : "w-8 h-8";
            
            return (
              <React.Fragment key={level}>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="flex flex-col items-center cursor-help">
                      <div 
                        className={cn(
                          "rounded-full flex items-center justify-center", 
                          sizeClass, colorClass
                        )}
                      >
                        {isCompleted ? <CheckIcon className="h-4 w-4" /> : index + 1}
                      </div>
                      <div className="text-xs mt-1 capitalize">{level}</div>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="space-y-2">
                      <h4 className="font-medium">{level === "remember" ? "Recordar" : 
                        level === "understand" ? "Comprender" : 
                        level === "apply" ? "Aplicar" : 
                        level === "analyze" ? "Analizar" :
                        level === "evaluate" ? "Evaluar" : "Crear"}</h4>
                      <p className="text-sm">
                        {bloomLevelMap?.[level]?.tooltip || `Nivel cognitivo: ${level}`}
                      </p>
                      <div className="text-sm font-medium flex justify-between">
                        <span>Progreso:</span>
                        <span>{Math.round(bloomAverages[level] * 100)}%</span>
                      </div>
                      <Progress value={bloomAverages[level] * 100} className="h-1.5" />
                    </div>
                  </HoverCardContent>
                </HoverCard>
                
                {index < orderedLevels.length - 1 && (
                  <div className="flex items-center">
                    <ArrowRightIcon className="h-4 w-4 text-gray-300" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
