
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { TPAESHabilidad, getHabilidadDisplayName } from "@/types/system-types";

interface SkillRadarChartProps {
  skillScores: Record<TPAESHabilidad, number>;
  title?: string;
  description?: string;
  className?: string;
}

export const SkillRadarChart = ({
  skillScores,
  title = "Perfil de Habilidades",
  description = "Visualización de tus niveles por habilidad",
  className = ""
}: SkillRadarChartProps) => {
  // Convertir datos para el radar chart
  const data = Object.entries(skillScores)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([skill, value]) => ({
      skill: getHabilidadDisplayName(skill as TPAESHabilidad),
      value: value * 100, // Convertir de 0-1 a 0-100
      fullMark: 100
    }));

  if (data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>No hay datos de habilidades disponibles</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="skill" />
            <Radar
              name="Nivel"
              dataKey="value"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
