
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SkillProgress } from "@/components/skill-progress";
import { TPAESHabilidad } from "@/types/system-types";

interface TopSkillsProps {
  loading: boolean;
  topSkills: TPAESHabilidad[];
  skillLevels: Record<TPAESHabilidad, number>;
}

export const TopSkills = ({ loading, topSkills, skillLevels }: TopSkillsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tus Habilidades Top</CardTitle>
        <CardDescription>
          Las habilidades donde muestras mayor dominio
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 animate-pulse rounded" />
            <div className="h-10 bg-gray-200 animate-pulse rounded" />
            <div className="h-10 bg-gray-200 animate-pulse rounded" />
          </div>
        ) : (
          topSkills.map((skill) => (
            <SkillProgress 
              key={skill} 
              skill={skill} 
              level={skillLevels[skill] || 0} 
            />
          ))
        )}
        <Button 
          variant="outline" 
          className="w-full mt-2"
          size="sm"
        >
          Ver todas las habilidades
        </Button>
      </CardContent>
    </Card>
  );
};
