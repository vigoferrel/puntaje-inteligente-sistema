/* eslint-disable react-refresh/only-export-components */

import { DiagnosticResult } from "../../types/diagnostic";
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { TPAESHabilidad, getHabilidadDisplayName } from "../../types/system-types";
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
        <CardTitle>AnÃ¡lisis detallado por habilidad</CardTitle>
        <CardDescription>
          Revisa tu nivel en cada una de las habilidades evaluadas y las recomendaciones especÃ­ficas
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

