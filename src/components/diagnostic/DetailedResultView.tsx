
import React from "react";
import { DiagnosticResult } from "@/types/diagnostic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TPAESHabilidad, getHabilidadDisplayName } from "@/types/system-types";
import { SkillCompetencyView } from "./SkillCompetencyView";

interface DetailedResultViewProps {
  results: DiagnosticResult;
}

export const DetailedResultView = ({ results }: DetailedResultViewProps) => {
  // Extract the skill scores from results
  const skillEntries = Object.entries(results.results);
  
  if (skillEntries.length === 0) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Análisis detallado por habilidad</CardTitle>
        <CardDescription>
          Revisa tu nivel en cada una de las habilidades evaluadas y las recomendaciones específicas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {skillEntries.map(([skill, score]) => (
          <SkillCompetencyView
            key={skill}
            skill={skill as TPAESHabilidad}
            score={score}
          />
        ))}
      </CardContent>
    </Card>
  );
};
