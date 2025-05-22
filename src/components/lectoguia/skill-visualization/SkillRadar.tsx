
import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SkillRadarProps {
  skills: { name: string; value: number; fullMark?: number }[];
  title?: string;
  showLegend?: boolean;
  height?: number;
  colors?: string[];
  className?: string;
}

export const SkillRadar = ({
  skills,
  title = "Habilidades",
  showLegend = true,
  height = 300,
  colors = ["#8884d8", "#82ca9d"],
  className = "",
}: SkillRadarProps) => {
  // Asegurarse de que cada habilidad tenga un valor fullMark
  const data = skills.map((skill) => ({
    ...skill,
    fullMark: skill.fullMark || 100,
  }));

  return (
    <Card className={className}>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RadarChart data={data} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
            <PolarGrid strokeDasharray="3 3" />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar
              name="Nivel Actual"
              dataKey="value"
              stroke={colors[0]}
              fill={colors[0]}
              fillOpacity={0.5}
            />
            {showLegend && <Legend />}
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
