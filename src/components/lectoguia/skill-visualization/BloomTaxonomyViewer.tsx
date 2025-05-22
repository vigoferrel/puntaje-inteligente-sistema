
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BloomTaxonomyLevel, BloomLevel, mapSkillToBloomLevel } from "./BloomTaxonomyLevel";
import { LectoGuiaSkill } from "@/types/lectoguia-types";

interface BloomTaxonomyViewerProps {
  skillLevels: Record<string, number>;
  className?: string;
}

export const BloomTaxonomyViewer: React.FC<BloomTaxonomyViewerProps> = ({
  skillLevels,
  className
}) => {
  // Aggregate skills by Bloom level
  const bloomLevels: Record<BloomLevel, number[]> = {
    remember: [],
    understand: [],
    apply: [],
    analyze: [],
    evaluate: [],
    create: []
  };
  
  // Map each skill to its Bloom level and collect values
  Object.entries(skillLevels).forEach(([skill, value]) => {
    const bloomLevel = mapSkillToBloomLevel(skill);
    bloomLevels[bloomLevel].push(value);
  });
  
  // Calculate average for each Bloom level
  const bloomAverages = Object.entries(bloomLevels).reduce((acc, [level, values]) => {
    acc[level as BloomLevel] = values.length > 0 
      ? values.reduce((sum, val) => sum + val, 0) / values.length 
      : 0;
    return acc;
  }, {} as Record<BloomLevel, number>);
  
  // Sort levels by cognitive complexity (Bloom's taxonomy order)
  const orderedLevels: BloomLevel[] = ["remember", "understand", "apply", "analyze", "evaluate", "create"];
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Taxonomía de Bloom</CardTitle>
        <CardDescription>
          Tu progreso en los niveles cognitivos, desde habilidades básicas hasta avanzadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orderedLevels.map((level) => (
            <BloomTaxonomyLevel 
              key={level} 
              level={level} 
              value={bloomAverages[level] || 0} 
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
