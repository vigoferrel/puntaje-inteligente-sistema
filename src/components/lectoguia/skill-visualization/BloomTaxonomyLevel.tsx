
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUp, Brain, BookOpen, Glasses, Lightbulb, Zap } from "lucide-react";

export type BloomLevel = "remember" | "understand" | "apply" | "analyze" | "evaluate" | "create";

interface BloomTaxonomyLevelProps {
  level: BloomLevel;
  value: number;
  className?: string;
}

// Map Bloom levels to display properties
const bloomLevelMap: Record<BloomLevel, {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}> = {
  remember: {
    title: "Recordar",
    description: "Reconocer y recordar información relevante",
    icon: <BookOpen className="h-5 w-5" />,
    color: "bg-blue-500"
  },
  understand: {
    title: "Comprender",
    description: "Entender el significado y la interpretación",
    icon: <Glasses className="h-5 w-5" />,
    color: "bg-green-500"
  },
  apply: {
    title: "Aplicar",
    description: "Usar la información en situaciones concretas",
    icon: <Brain className="h-5 w-5" />,
    color: "bg-yellow-500"
  },
  analyze: {
    title: "Analizar",
    description: "Descomponer la información en sus partes",
    icon: <Zap className="h-5 w-5" />,
    color: "bg-orange-500"
  },
  evaluate: {
    title: "Evaluar",
    description: "Hacer juicios basados en criterios",
    icon: <Lightbulb className="h-5 w-5" />,
    color: "bg-red-500"
  },
  create: {
    title: "Crear",
    description: "Generar nuevas ideas o soluciones",
    icon: <ArrowUp className="h-5 w-5" />,
    color: "bg-purple-500"
  }
};

export const BloomTaxonomyLevel: React.FC<BloomTaxonomyLevelProps> = ({
  level,
  value,
  className
}) => {
  const levelInfo = bloomLevelMap[level];

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <div className="flex items-center gap-2">
        <div className={cn("p-1.5 rounded-md", levelInfo.color.replace("bg-", "bg-opacity-20"))}>
          <span className={cn("text-", levelInfo.color.replace("bg-", "text-"))}>
            {levelInfo.icon}
          </span>
        </div>
        <div>
          <div className="font-medium">{levelInfo.title}</div>
          <div className="text-xs text-muted-foreground">{levelInfo.description}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Progress value={value * 100} className="h-2 flex-1" />
        <span className="text-sm font-medium">{Math.round(value * 100)}%</span>
      </div>
    </div>
  );
};

// Map our skills to Bloom's taxonomy levels
export const mapSkillToBloomLevel = (skill: string): BloomLevel => {
  const bloomMap: Record<string, BloomLevel> = {
    // Comprensión lectora
    "TRACK_LOCATE": "remember",        // Rastrear y Localizar (información básica)
    "INTERPRET_RELATE": "understand",  // Interpretar y Relacionar (comprensión)
    "EVALUATE_REFLECT": "evaluate",    // Evaluar y Reflexionar (juicio)
    
    // Matemáticas
    "SOLVE_PROBLEMS": "apply",        // Resolver problemas (aplicar conocimiento)
    "REPRESENT": "understand",        // Representar (comprensión)
    "MODEL": "create",                // Modelar (crear modelos)
    "ARGUE_COMMUNICATE": "evaluate",  // Argumentar y Comunicar (evaluación)
    "ALGEBRA": "apply",               // Álgebra (aplicación)
    
    // Ciencias
    "IDENTIFY_THEORIES": "remember",    // Identificar Teorías (conocimiento básico)
    "PROCESS_ANALYZE": "analyze",       // Procesar y Analizar (análisis)
    "APPLY_PRINCIPLES": "apply",        // Aplicar Principios (aplicación)
    "SCIENTIFIC_ARGUMENT": "evaluate",  // Argumentación Científica (evaluación)
    "PHYSICS": "apply",                 // Física (aplicación)
    
    // Historia
    "TEMPORAL_THINKING": "understand",   // Pensamiento Temporal (comprensión)
    "SOURCE_ANALYSIS": "analyze",        // Análisis de Fuentes (análisis)
    "MULTICAUSAL_ANALYSIS": "analyze",   // Análisis Multicausal (análisis)
    "CRITICAL_THINKING": "evaluate",     // Pensamiento Crítico (evaluación)
    "REFLECTION": "evaluate",            // Reflexión (evaluación) 
    "HISTORY": "understand"              // Historia (comprensión)
  };
  
  return bloomMap[skill] || "understand";
};

