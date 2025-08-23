/* eslint-disable react-refresh/only-export-components */
import { FC, ReactNode } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { BloomTaxonomyLevel, BloomLevel, mapSkillToBloomLevel } from "./BloomTaxonomyLevel";
import { LectoGuiaSkill } from "../../../types/lectoguia-types";
import { BloomProgressIndicator } from "./BloomProgressIndicator";

export interface BloomLevelInfo {
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
  tooltip: string;
}

// Export the map for use in other components
export const bloomLevelMap: Record<BloomLevel, BloomLevelInfo> = {
  remember: {
    title: "Recordar",
    description: "Reconocer y recordar informaciÃ³n relevante",
    icon: null, // Will be set in BloomTaxonomyLevel
    color: "bg-blue-500",
    tooltip: "Recordar es reconocer, recuperar, y recordar conocimientos relevantes de la memoria a largo plazo. Incluye actividades como definir, listar, memorizar y repetir."
  },
  understand: {
    title: "Comprender",
    description: "Entender el significado y la interpretaciÃ³n",
    icon: null, // Will be set in BloomTaxonomyLevel
    color: "bg-green-500",
    tooltip: "Comprender es construir significado a partir de mensajes orales, escritos o grÃ¡ficos. Incluye actividades como describir, explicar, parafrasear, resumir e interpretar."
  },
  apply: {
    title: "Aplicar",
    description: "Usar la informaciÃ³n en situaciones concretas",
    icon: null, // Will be set in BloomTaxonomyLevel
    color: "bg-yellow-500",
    tooltip: "Aplicar es usar procedimientos para llevar a cabo ejercicios o resolver problemas. Incluye actividades como implementar, ejecutar, usar y resolver problemas prÃ¡cticos."
  },
  analyze: {
    title: "Analizar",
    description: "Descomponer la informaciÃ³n en sus partes",
    icon: null, // Will be set in BloomTaxonomyLevel
    color: "bg-orange-500",
    tooltip: "Analizar es descomponer material en sus partes constituyentes y detectar cÃ³mo estas partes se relacionan entre sÃ­. Incluye actividades como comparar, contrastar, diferenciar, organizar y distinguir."
  },
  evaluate: {
    title: "Evaluar",
    description: "Hacer juicios basados en criterios",
    icon: null, // Will be set in BloomTaxonomyLevel
    color: "bg-red-500",
    tooltip: "Evaluar es hacer juicios basados en criterios y estÃ¡ndares. Incluye actividades como criticar, juzgar, justificar, argumentar y valorar."
  },
  create: {
    title: "Crear",
    description: "Generar nuevas ideas o soluciones",
    icon: null, // Will be set in BloomTaxonomyLevel
    color: "bg-purple-500",
    tooltip: "Crear es juntar elementos para formar un todo coherente y funcional; reorganizar elementos en un nuevo patrÃ³n o estructura. Incluye actividades como diseÃ±ar, producir, planear, elaborar y generar."
  }
};

interface BloomTaxonomyViewerProps {
  skillLevels: Record<string, number>;
  className?: string;
}

export const BloomTaxonomyViewer: FC<BloomTaxonomyViewerProps> = ({
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
    <div className="space-y-6">
      {/* Visual progress indicator */}
      <BloomProgressIndicator bloomAverages={bloomAverages} />
      
      {/* Detailed level breakdown */}
      <Card className={className}>
        <CardHeader>
          <CardTitle>TaxonomÃ­a de Bloom</CardTitle>
          <CardDescription>
            Tu progreso en los niveles cognitivos, desde habilidades bÃ¡sicas hasta avanzadas
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
    </div>
  );
};

