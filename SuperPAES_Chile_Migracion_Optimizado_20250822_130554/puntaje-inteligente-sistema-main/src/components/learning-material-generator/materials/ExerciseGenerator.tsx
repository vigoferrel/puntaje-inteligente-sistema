/* eslint-disable react-refresh/only-export-components */

import React, { useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Slider } from '../../../components/ui/slider';
import { Badge } from '../../../components/ui/badge';
import { TestTube, Play, Settings, CheckCircle, Sparkles } from 'lucide-react';
import { TLearningCyclePhase, TPAESHabilidad, TPAESPrueba } from '../../../types/system-types';

interface ExerciseGeneratorProps {
  selectedSubject: string;
  currentPhase: TLearningCyclePhase;
  onGenerate: (config: unknown) => void;
  isGenerating: boolean;
  generationMode: 'official' | 'ai' | 'hybrid';
}

export const ExerciseGenerator: React.FC<ExerciseGeneratorProps> = ({
  selectedSubject,
  currentPhase,
  onGenerate,
  isGenerating,
  generationMode
}) => {
  const [exerciseCount, setExerciseCount] = useState([5]);
  const [difficulty, setDifficulty] = useState<'BASICO' | 'INTERMEDIO' | 'AVANZADO'>('INTERMEDIO');
  const [skillFocus, setSkillFocus] = useState<TPAESHabilidad | 'AUTO'>('AUTO');
  const [includeContext, setIncludeContext] = useState(true);

  // Mapeo de materias a pruebas PAES
  const subjectToPruebaMap: Record<string, TPAESPrueba> = {
    'competencia-lectora': 'COMPETENCIA_LECTORA',
    'matematica-m1': 'MATEMATICA_1',
    'matematica-m2': 'MATEMATICA_2',
    'historia': 'HISTORIA',
    'ciencias': 'CIENCIAS'
  };

  // Habilidades por materia
  const skillsBySubject: Record<string, TPAESHabilidad[]> = {
    'competencia-lectora': ['TRACK_LOCATE', 'INTERPRET_RELATE', 'EVALUATE_REFLECT'],
    'matematica-m1': ['SOLVE_PROBLEMS', 'REPRESENT', 'ARGUE_COMMUNICATE'],
    'matematica-m2': ['REPRESENT', 'MODEL', 'SOLVE_PROBLEMS'],
    'historia': ['TEMPORAL_THINKING', 'SOURCE_ANALYSIS', 'MULTICAUSAL_ANALYSIS', 'CRITICAL_THINKING'],
    'ciencias': ['IDENTIFY_THEORIES', 'PROCESS_ANALYZE', 'APPLY_PRINCIPLES', 'SCIENTIFIC_ARGUMENT']
  };

  const availableSkills = skillsBySubject[selectedSubject] || [];

  const handleGenerate = () => {
    const prueba = subjectToPruebaMap[selectedSubject] || 'COMPETENCIA_LECTORA';
    const selectedSkill = skillFocus === 'AUTO' ? availableSkills[0] : skillFocus;
    
    const config = {
      materialType: 'exercises',
      subject: selectedSubject,
      prueba,
      skill: selectedSkill,
      phase: currentPhase,
      count: exerciseCount[0],
      difficulty,
      includeContext,
      mode: generationMode,
      useOfficialContent: generationMode !== 'ai'
    };
    
    onGenerate(config);
  };

  const getSkillDisplayName = (skill: TPAESHabilidad): string => {
    const skillNames: Record<TPAESHabilidad, string> = {
      'TRACK_LOCATE': 'Localizar InformaciÃ³n',
      'INTERPRET_RELATE': 'Interpretar y Relacionar',
      'EVALUATE_REFLECT': 'Evaluar y Reflexionar',
      'SOLVE_PROBLEMS': 'ResoluciÃ³n de Problemas',
      'REPRESENT': 'RepresentaciÃ³n',
      'MODEL': 'Modelamiento',
      'ARGUE_COMMUNICATE': 'ArgumentaciÃ³n y ComunicaciÃ³n',
      'IDENTIFY_THEORIES': 'IdentificaciÃ³n de TeorÃ­as',
      'PROCESS_ANALYZE': 'Procesar y Analizar',
      'APPLY_PRINCIPLES': 'Aplicar Principios',
      'SCIENTIFIC_ARGUMENT': 'ArgumentaciÃ³n CientÃ­fica',
      'TEMPORAL_THINKING': 'Pensamiento Temporal',
      'SOURCE_ANALYSIS': 'AnÃ¡lisis de Fuentes',
      'MULTICAUSAL_ANALYSIS': 'AnÃ¡lisis Multicausal',
      'CRITICAL_THINKING': 'Pensamiento CrÃ­tico',
      'REFLECTION': 'ReflexiÃ³n'
    };
    return skillNames[skill] || skill;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Generador de Ejercicios
          {generationMode === 'official' && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Oficial PAES
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* DescripciÃ³n del Modo */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            {generationMode === 'official' && <CheckCircle className="h-4 w-4 text-green-600" />}
            {generationMode === 'ai' && <Sparkles className="h-4 w-4 text-blue-600" />}
            {generationMode === 'hybrid' && <Settings className="h-4 w-4 text-purple-600" />}
            <span className="font-medium text-sm">
              {generationMode === 'official' ? 'Contenido Oficial PAES' : 
               generationMode === 'ai' ? 'GeneraciÃ³n con IA' : 'Modo HÃ­brido'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {generationMode === 'official' ? 
              'Ejercicios extraÃ­dos directamente de exÃ¡menes oficiales PAES 2024 con contextos reales' :
              generationMode === 'ai' ?
              'Ejercicios generados por IA siguiendo patrones y estÃ¡ndares PAES' :
              'Combina preguntas oficiales con ejercicios generados por IA'}
          </p>
        </div>

        {/* ConfiguraciÃ³n de Ejercicios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cantidad */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Cantidad de Ejercicios</label>
            <div className="px-3">
              <Slider
                value={exerciseCount}
                onValueChange={setExerciseCount}
                max={20}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1</span>
                <span className="font-medium">{exerciseCount[0]} ejercicios</span>
                <span>20</span>
              </div>
            </div>
          </div>

          {/* Dificultad */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Nivel de Dificultad</label>
            <Select value={difficulty} onValueChange={(value) => setDifficulty(value as unknown)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BASICO">BÃ¡sico - Preguntas 1-20</SelectItem>
                <SelectItem value="INTERMEDIO">Intermedio - Preguntas 21-45</SelectItem>
                <SelectItem value="AVANZADO">Avanzado - Preguntas 46-65</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Habilidad EspecÃ­fica */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Habilidad PAES</label>
            <Select value={skillFocus} onValueChange={(value) => setSkillFocus(value as unknown)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AUTO">AutomÃ¡tico (segÃºn fase)</SelectItem>
                {availableSkills.map(skill => (
                  <SelectItem key={skill} value={skill}>
                    {getSkillDisplayName(skill)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Incluir Contexto */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Opciones</label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="includeContext"
                checked={includeContext}
                onChange={(e) => setIncludeContext(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="includeContext" className="text-sm">
                Incluir contexto completo
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedSubject === 'competencia-lectora' ? 
                'Incluye textos completos de 200-400 palabras' :
                'Incluye grÃ¡ficos, tablas y contexto visual'}
            </p>
          </div>
        </div>

        {/* InformaciÃ³n de la ConfiguraciÃ³n */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-sm text-blue-800 mb-2">ConfiguraciÃ³n Actual</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-blue-600">Materia:</span> {selectedSubject}
            </div>
            <div>
              <span className="text-blue-600">Prueba PAES:</span> {subjectToPruebaMap[selectedSubject]}
            </div>
            <div>
              <span className="text-blue-600">Fase:</span> {currentPhase}
            </div>
            <div>
              <span className="text-blue-600">Habilidad:</span> {skillFocus === 'AUTO' ? 'AutomÃ¡tica' : getSkillDisplayName(skillFocus as TPAESHabilidad)}
            </div>
          </div>
        </div>

        {/* BotÃ³n de GeneraciÃ³n */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full"
          size="lg"
        >
          <Play className="w-4 h-4 mr-2" />
          {isGenerating ? 'Generando...' : `Generar ${exerciseCount[0]} Ejercicios`}
        </Button>

        {/* InformaciÃ³n Adicional */}
        {generationMode === 'official' && (
          <div className="text-xs text-muted-foreground space-y-1">
            <p>â€¢ Los ejercicios provienen de exÃ¡menes oficiales PAES 2024</p>
            <p>â€¢ Se mantiene el formato y contexto original</p>
            <p>â€¢ Las preguntas estÃ¡n validadas por el DEMRE</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

