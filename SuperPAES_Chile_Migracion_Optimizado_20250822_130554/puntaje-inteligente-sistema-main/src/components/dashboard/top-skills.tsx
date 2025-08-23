/* eslint-disable react-refresh/only-export-components */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Button } from "../../components/ui/button";
import { SkillProgress } from "../../components/skill-progress";
import { TPAESHabilidad } from "../../types/system-types";
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
  // Use skills prop if provided, otherwise use topSkills, ensure it's always an array
  const skillsToDisplay = skills || topSkills || [];

  // Get suggestion based on skill level
  const getSkillSuggestion = (skill: TPAESHabilidad, level: number): string => {
    // Definimos sugerencias para algunas habilidades especÃ­ficas
    const suggestions: Partial<Record<TPAESHabilidad, string[]>> = {
      'TRACK_LOCATE': [
        'Ejercicios de identificaciÃ³n de informaciÃ³n explÃ­cita',
        'PrÃ¡ctica de lectura rÃ¡pida',
        'Uso de LectoGuÃ­a AI'
      ],
      'INTERPRET_RELATE': [
        'AnÃ¡lisis de textos con LectoGuÃ­a',
        'PrÃ¡ctica de inferencias',
        'Ejercicios de conexiones textuales'
      ],
      'EVALUATE_REFLECT': [
        'Cuestionamiento crÃ­tico de textos',
        'AnÃ¡lisis de argumentos',
        'Debates y discusiones de puntos de vista'
      ],
      'SOLVE_PROBLEMS': [
        'Ejercicios bÃ¡sicos de resoluciÃ³n de problemas',
        'PrÃ¡ctica con problemas de dificultad media',
        'DesafÃ­os avanzados de resoluciÃ³n de problemas'
      ]
    };
    
    const skillSuggestions = suggestions[skill];
    if (!skillSuggestions) {
      // Si no hay sugerencias especÃ­ficas para esta habilidad
      if (level < 40) return 'Realizar mÃ¡s ejercicios bÃ¡sicos';
      if (level < 70) return 'Continuar con ejercicios de nivel intermedio';
      return 'Practicar con ejemplos avanzados';
    }
    
    if (level < 40) return skillSuggestions[0] || 'Realizar mÃ¡s ejercicios';
    if (level < 70) return skillSuggestions[1] || 'Profundizar conceptos';
    return skillSuggestions[2] || 'Practicar con ejemplos avanzados';
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
        ) : skillsToDisplay.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No se han detectado habilidades todavÃ­a</p>
            <p className="text-sm mt-2">Completa ejercicios para identificar tus fortalezas</p>
          </div>
        ) : (
          skillsToDisplay.map((skill) => (
            <div key={skill} className="space-y-1">
              <SkillProgress 
                skill={skill} 
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

