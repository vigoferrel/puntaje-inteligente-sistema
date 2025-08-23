
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis, Legend } from "recharts";
import { TPAESHabilidad, getHabilidadDisplayName } from "@/types/system-types";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { DiagnosticResult } from "@/types/diagnostic";

interface SkillRadarChartProps {
  skillScores: Record<TPAESHabilidad, number>;
  title?: string;
  description?: string;
  className?: string;
  showLegend?: boolean;
  emptyMessage?: string;
}

// Add a new prop type that accepts DiagnosticResult
export interface DiagnosticResultRadarProps {
  results: DiagnosticResult;
  title?: string;
  description?: string;
  className?: string;
  showLegend?: boolean;
  emptyMessage?: string;
}

export const SkillRadarChart = ({
  skillScores,
  title = "Perfil de Habilidades",
  description = "Visualización de tus niveles por habilidad",
  className = "",
  showLegend = false,
  emptyMessage = "No hay datos de habilidades disponibles"
}: SkillRadarChartProps) => {
  // Convertir datos para el radar chart
  const data = skillScores ? Object.entries(skillScores)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([skill, value]) => ({
      skill: getHabilidadDisplayName(skill as TPAESHabilidad),
      value: value * 100, // Convertir de 0-1 a 0-100
      fullMark: 100
    })) : [];

  if (data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{emptyMessage}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-64 text-center p-6">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius="80%" data={data}>
              <PolarGrid strokeDasharray="3 3" stroke="var(--muted)" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: "var(--foreground)", fontSize: 11 }} />
              <PolarRadiusAxis tickCount={5} domain={[0, 100]} />
              <Radar
                name="Nivel"
                dataKey="value"
                stroke="var(--primary)"
                fill="var(--primary)"
                fillOpacity={0.6}
                animationDuration={1500}
                animationEasing="ease-out"
              />
              {showLegend && <Legend />}
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Add a wrapper component that accepts DiagnosticResult and converts it to the format needed by SkillRadarChart
export const DiagnosticResultRadar = ({
  results,
  title,
  description,
  className,
  showLegend,
  emptyMessage
}: DiagnosticResultRadarProps) => {
  // Extract skill scores from DiagnosticResult
  return (
    <SkillRadarChart
      skillScores={results.results}
      title={title}
      description={description}
      className={className}
      showLegend={showLegend}
      emptyMessage={emptyMessage}
    />
  );
};
