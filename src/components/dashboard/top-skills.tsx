
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SkillProgress } from "@/components/skill-progress";
import { TPAESHabilidad } from "@/types/system-types";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles } from "lucide-react";

interface TopSkillsProps {
  loading: boolean;
  topSkills: TPAESHabilidad[];
  skillLevels: Record<TPAESHabilidad, number>;
  skills?: TPAESHabilidad[];
  className?: string;
}

export const TopSkills = ({ loading, topSkills, skillLevels, skills, className }: TopSkillsProps) => {
  // Use skills prop if provided, otherwise use topSkills
  const skillsToDisplay = skills || topSkills;
  
  // Get skill display name
  const getSkillDisplayName = (skill: TPAESHabilidad): string => {
    const skillNames: Record<TPAESHabilidad, string> = {
      'TRACK_LOCATE': 'Rastrear-Localizar',
      'INTERPRET_RELATE': 'Interpretar-Relacionar',
      'EVALUATE_REFLECT': 'Evaluar-Reflexionar',
      'SOLVE_PROBLEMS': 'Resolver Problemas',
      'USE_MODELS': 'Usar Modelos',
      'REPRESENT': 'Representar',
      'ARGUE': 'Argumentar',
      'COMMUNICATE': 'Comunicar',
      'ALGORITHMIZE': 'Algoritmizar'
    };
    
    return skillNames[skill] || skill;
  };

  // Get suggestion based on skill level
  const getSkillSuggestion = (skill: TPAESHabilidad, level: number): string => {
    const suggestions: Record<TPAESHabilidad, string[]> = {
      'TRACK_LOCATE': [
        'Ejercicios de identificación de información explícita',
        'Práctica de lectura rápida',
        'Uso de LectoGuía AI'
      ],
      'INTERPRET_RELATE': [
        'Análisis de textos con LectoGuía',
        'Práctica de inferencias',
        'Ejercicios de conexiones textuales'
      ],
      'EVALUATE_REFLECT': [
        'Cuestionamiento crítico de textos',
        'Análisis de argumentos',
        'Debates y discusiones de puntos de vista'
      ]
    };
    
    if (level < 40) return suggestions[skill]?.[0] || 'Realizar más ejercicios';
    if (level < 70) return suggestions[skill]?.[1] || 'Profundizar conceptos';
    return suggestions[skill]?.[2] || 'Practicar con ejemplos avanzados';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Tus Habilidades Top
        </CardTitle>
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
            <div key={skill} className="space-y-1">
              <SkillProgress 
                skill={skill} 
                label={getSkillDisplayName(skill)}
                level={skillLevels[skill] || 0} 
              />
              <p className="text-xs text-muted-foreground ml-1">
                Sugerencia: {getSkillSuggestion(skill, skillLevels[skill] || 0)}
              </p>
            </div>
          ))
        )}
        <div className="flex justify-between items-center mt-4">
          <Button 
            variant="outline" 
            className="w-full"
            size="sm"
            asChild
          >
            <Link to="/diagnostico">
              Ver todas las habilidades
            </Link>
          </Button>

          <Button 
            variant="outline" 
            className="ml-2"
            size="sm"
            asChild
          >
            <Link to="/lectoguia">
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
