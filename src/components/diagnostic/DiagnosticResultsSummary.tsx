
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SkillProgress } from "@/components/skill-progress";
import { TPAESHabilidad } from "@/types/system-types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

interface DiagnosticResultsSummaryProps {
  results: Record<TPAESHabilidad, number>;
}

export const DiagnosticResultsSummary = ({ results }: DiagnosticResultsSummaryProps) => {
  // Find the top 3 skills
  const topSkills = Object.entries(results)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([skill]) => skill as TPAESHabilidad);

  // Find the bottom 3 skills
  const bottomSkills = Object.entries(results)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 3)
    .map(([skill]) => skill as TPAESHabilidad);

  // Create chart data
  const chartData = Object.entries(results)
    .map(([skill, level]) => ({
      skill,
      level: Math.round(level * 100),
    }))
    .sort((a, b) => b.level - a.level)
    .slice(0, 6); // Show only top 6 skills in chart for better visibility

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Tus fortalezas</CardTitle>
            <CardDescription>Las habilidades donde muestras mayor dominio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topSkills.map((skill) => (
              <SkillProgress 
                key={skill} 
                skill={skill} 
                level={results[skill] || 0} 
              />
            ))}
          </CardContent>
        </Card>

        {/* Bottom Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Áreas de mejora</CardTitle>
            <CardDescription>Las habilidades que requieren mayor atención</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {bottomSkills.map((skill) => (
              <SkillProgress 
                key={skill} 
                skill={skill} 
                level={results[skill] || 0} 
              />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Skills Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de habilidades</CardTitle>
          <CardDescription>Vista general de tus niveles de habilidad</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer 
              config={{
                skill: {
                  theme: {
                    light: "#3b82f6",
                    dark: "#60a5fa"
                  }
                }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis 
                    dataKey="skill" 
                    tickFormatter={(value) => value.substring(0, 3).toUpperCase()} 
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Nivel']}
                    labelFormatter={(label) => `Habilidad: ${label}`}
                  />
                  <Bar dataKey="level" fill="var(--color-skill)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
