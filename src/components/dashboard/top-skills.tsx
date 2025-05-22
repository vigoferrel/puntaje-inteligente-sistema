
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SkillProgress } from "@/components/skill-progress";
import { TPAESHabilidad } from "@/types/system-types";

interface TopSkillsProps {
  loading: boolean;
  topSkills: TPAESHabilidad[];
  skillLevels: Record<TPAESHabilidad, number>;
  skills?: TPAESHabilidad[]; // Added to support the new prop usage
  className?: string;
}

export const TopSkills = ({ loading, topSkills, skillLevels, skills, className }: TopSkillsProps) => {
  // Use skills prop if provided, otherwise use topSkills
  const skillsToDisplay = skills || topSkills;

  return (
    <Card className={className}>
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
          skillsToDisplay.map((skill) => (
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
