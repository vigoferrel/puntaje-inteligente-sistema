/* eslint-disable react-refresh/only-export-components */

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, ResponsiveContainer, Tooltip } from "recharts";
import '@/styles/CinematicAnimations.css';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { mapSkillToBloomLevel, BloomLevel } from "./BloomTaxonomyLevel";

// Definir colores para cada nivel de bloom
const bloomColors: Record<BloomLevel, string> = {
  remember: "#3b82f6",     // blue-500
  understand: "#22c55e",   // green-500
  apply: "#eab308",        // yellow-500
  analyze: "#f97316",      // orange-500
  evaluate: "#ef4444",     // red-500
  create: "#a855f7"        // purple-500
};

interface SkillRadarProps {
  skills: { name: string; value: number; fullMark?: number; skillKey?: string }[];
  title?: string;
  showLegend?: boolean;
  height?: number;
  colors?: string[];
  className?: string;
  showBloomCategories?: boolean;
}

export const SkillRadar = ({
  skills,
  title = "Habilidades",
  showLegend = true,
  height = 300,
  colors = ["#8884d8", "#82ca9d"],
  className = "",
  showBloomCategories = false
}: SkillRadarProps) => {
  // Asegurarse de que cada habilidad tenga un valor fullMark
  const data = skills.map((skill) => ({
    ...skill,
    fullMark: skill.fullMark || 100
  }));

  // Si queremos mostrar categorÃ­as de Bloom, agrupamos las habilidades
  const groupedData = data;
  let bloomLegend = null;

  if (showBloomCategories && skills.some(s => s.skillKey)) {
    // Agrupar habilidades por nivel de Bloom
    const skillsByBloom: Record<BloomLevel, typeof skills> = {
      remember: [],
      understand: [],
      apply: [],
      analyze: [],
      evaluate: [],
      create: []
    };

    skills.forEach(skill => {
      if (skill.skillKey) {
        const bloomLevel = mapSkillToBloomLevel(skill.skillKey);
        skillsByBloom[bloomLevel].push(skill);
      }
    });

    // Crear la leyenda de niveles de Bloom
    bloomLegend = (
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {Object.entries(bloomColors).map(([level, color]) => (
          <Badge
            key={level}
            variant="outline"
            className="flex items-center gap-1"
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: color }}
            ></span>
            <span className="capitalize">{level}</span>
          </Badge>
        ))}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {showBloomCategories && (
          <CardDescription>
            VisualizaciÃ³n de habilidades categorizadas por niveles cognitivos
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {bloomLegend}
        
        <ResponsiveContainer width="100%" height={height}>
          <RadarChart data={data} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
            <PolarGrid strokeDasharray="3 3" />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            
            {showBloomCategories && skills.some(s => s.skillKey) ? (
              // Mostrar radares por nivel de Bloom
              Object.entries(bloomColors).map(([level, color]) => {
                const bloomSkills = skills.filter(
                  s => s.skillKey && mapSkillToBloomLevel(s.skillKey) === level
                );
                
                if (bloomSkills.length === 0) return null;
                
                return (
                  <Radar
                    key={level}
                    name={level.charAt(0).toUpperCase() + level.slice(1)}
                    dataKey="value"
                    stroke={color}
                    fill={color}
                    fillOpacity={0.5}
                    dot={true}
                  />
                );
              })
            ) : (
              // Mostrar radar simple
              <Radar
                name="Nivel Actual"
                dataKey="value"
                stroke={colors[0]}
                fill={colors[0]}
                fillOpacity={0.5}
              />
            )}
            
            {showLegend && <Legend />}
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};



