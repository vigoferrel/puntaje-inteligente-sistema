
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { TestTube, Play, Settings, CheckCircle, Sparkles } from 'lucide-react';
import { TLearningCyclePhase, TPAESHabilidad, TPAESPrueba } from '@/types/system-types';

interface ExerciseGeneratorProps {
  selectedSubject: string;
  currentPhase: TLearningCyclePhase;
  onGenerate: (config: any) => void;
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
      'TRACK_LOCATE': 'Localizar Información',
      'INTERPRET_RELATE': 'Interpretar y Relacionar',
      'EVALUATE_REFLECT': 'Evaluar y Reflexionar',
      'SOLVE_PROBLEMS': 'Resolución de Problemas',
      'REPRESENT': 'Representación',
      'MODEL': 'Modelamiento',
      'ARGUE_COMMUNICATE': 'Argumentación y Comunicación',
      'IDENTIFY_THEORIES': 'Identificación de Teorías',
      'PROCESS_ANALYZE': 'Procesar y Analizar',
      'APPLY_PRINCIPLES': 'Aplicar Principios',
      'SCIENTIFIC_ARGUMENT': 'Argumentación Científica',
      'TEMPORAL_THINKING': 'Pensamiento Temporal',
      'SOURCE_ANALYSIS': 'Análisis de Fuentes',
      'MULTICAUSAL_ANALYSIS': 'Análisis Multicausal',
      'CRITICAL_THINKING': 'Pensamiento Crítico',
      'REFLECTION': 'Reflexión'
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
        {/* Descripción del Modo */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            {generationMode === 'official' && <CheckCircle className="h-4 w-4 text-green-600" />}
            {generationMode === 'ai' && <Sparkles className="h-4 w-4 text-blue-600" />}
            {generationMode === 'hybrid' && <Settings className="h-4 w-4 text-purple-600" />}
            <span className="font-medium text-sm">
              {generationMode === 'official' ? 'Contenido Oficial PAES' : 
               generationMode === 'ai' ? 'Generación con IA' : 'Modo Híbrido'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {generationMode === 'official' ? 
              'Ejercicios extraídos directamente de exámenes oficiales PAES 2024 con contextos reales' :
              generationMode === 'ai' ?
              'Ejercicios generados por IA siguiendo patrones y estándares PAES' :
              'Combina preguntas oficiales con ejercicios generados por IA'}
          </p>
        </div>

        {/* Configuración de Ejercicios */}
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
            <Select value={difficulty} onValueChange={(value) => setDifficulty(value as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BASICO">Básico - Preguntas 1-20</SelectItem>
                <SelectItem value="INTERMEDIO">Intermedio - Preguntas 21-45</SelectItem>
                <SelectItem value="AVANZADO">Avanzado - Preguntas 46-65</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Habilidad Específica */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Habilidad PAES</label>
            <Select value={skillFocus} onValueChange={(value) => setSkillFocus(value as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AUTO">Automático (según fase)</SelectItem>
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
                'Incluye gráficos, tablas y contexto visual'}
            </p>
          </div>
        </div>

        {/* Información de la Configuración */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-sm text-blue-800 mb-2">Configuración Actual</h4>
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
              <span className="text-blue-600">Habilidad:</span> {skillFocus === 'AUTO' ? 'Automática' : getSkillDisplayName(skillFocus as TPAESHabilidad)}
            </div>
          </div>
        </div>

        {/* Botón de Generación */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full"
          size="lg"
        >
          <Play className="w-4 h-4 mr-2" />
          {isGenerating ? 'Generando...' : `Generar ${exerciseCount[0]} Ejercicios`}
        </Button>

        {/* Información Adicional */}
        {generationMode === 'official' && (
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Los ejercicios provienen de exámenes oficiales PAES 2024</p>
            <p>• Se mantiene el formato y contexto original</p>
            <p>• Las preguntas están validadas por el DEMRE</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
