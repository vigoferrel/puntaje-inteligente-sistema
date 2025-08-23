/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Progress } from "../../../components/ui/progress";
import { TPAESHabilidad, TPAESPrueba, getPruebaDisplayName, getHabilidadDisplayName } from "../../../types/system-types";
import { mapSkillToBloomLevel, BloomLevel } from "./BloomTaxonomyLevel";
import { cn } from "../../../lib/utils";
import { getSkillsByPrueba } from "../../../utils/lectoguia-utils";

interface SkillHierarchyChartProps {
  skillLevels: Record<string, number>;
  selectedTest?: TPAESPrueba;
  className?: string;
}

// Define the colors for each Bloom level
const bloomLevelColors: Record<BloomLevel, string> = {
  remember: "bg-blue-500",
  understand: "bg-green-500",
  apply: "bg-yellow-500",
  analyze: "bg-orange-500",
  evaluate: "bg-red-500",
  create: "bg-purple-500"
};

export const SkillHierarchyChart: FC<SkillHierarchyChartProps> = ({
  skillLevels,
  selectedTest,
  className
}) => {
  // Si no se selecciona una prueba especÃ­fica, mostrar todas las pruebas
  const testsToShow: TPAESPrueba[] = selectedTest 
    ? [selectedTest] 
    : ["COMPETENCIA_LECTORA", "MATEMATICA_1", "MATEMATICA_2", "CIENCIAS", "HISTORIA"];
  
  // Obtener la agrupaciÃ³n de habilidades por prueba
  const skillsByTest = testsToShow.reduce((acc, test) => {
    acc[test] = getSkillsByPrueba(test);
    return acc;
  }, {} as Record<TPAESPrueba, TPAESHabilidad[]>);
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>JerarquÃ­a de Habilidades</CardTitle>
        <CardDescription>
          Habilidades organizadas por prueba y nivel cognitivo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {testsToShow.map((test) => (
            <div key={test} className="space-y-3">
              <h3 className="font-semibold text-lg">{getPruebaDisplayName(test)}</h3>
              
              {/* Group skills by bloom level */}
              {(["remember", "understand", "apply", "analyze", "evaluate", "create"] as BloomLevel[]).map((bloomLevel) => {
                // Filter skills for this test and bloom level
                const skillsForLevel = skillsByTest[test]?.filter(
                  skill => mapSkillToBloomLevel(skill) === bloomLevel
                ) || [];
                
                if (skillsForLevel.length === 0) return null;
                
                return (
                  <div key={`${test}-${bloomLevel}`} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${bloomLevelColors[bloomLevel]}`}></div>
                      <span className="text-sm font-medium capitalize">{bloomLevel}</span>
                    </div>
                    
                    <div className="pl-4 space-y-2 border-l-2 border-dashed">
                      {skillsForLevel.map((skill) => {
                        const skillLevel = skillLevels[skill] || 0;
                        const bloomColor = bloomLevelColors[mapSkillToBloomLevel(skill)];
                        
                        return (
                          <div key={`${test}-${skill}`} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">{getHabilidadDisplayName(skill)}</span>
                              <Badge variant="outline" className={cn("text-xs", 
                                bloomColor.replace("bg-", "text-"))}>
                                {Math.round(skillLevel * 100)}%
                              </Badge>
                            </div>
                            <Progress 
                              value={skillLevel * 100} 
                              className={`h-1.5 ${bloomColor.replace("bg-", "bg-opacity-20")} [&>div]:${bloomColor}`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

