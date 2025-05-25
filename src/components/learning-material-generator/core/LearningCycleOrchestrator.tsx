
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MaterialGenerationHub } from '../materials/MaterialGenerationHub';
import { PhaseNavigator } from './PhaseNavigator';
import { UserProgressAnalyzer } from './UserProgressAnalyzer';
import { AdaptiveRecommendationEngine } from './AdaptiveRecommendationEngine';
import { TLearningCyclePhase, TPAESPrueba } from '@/types/system-types';
import { useMaterialGeneration } from '@/hooks/use-material-generation';
import { Brain, Sparkles } from 'lucide-react';

interface LearningCycleOrchestratorProps {
  selectedSubject: string;
  subjects: any;
  onGenerate: (config: any) => void;
  isGenerating: boolean;
}

export const LearningCycleOrchestrator: React.FC<LearningCycleOrchestratorProps> = ({
  selectedSubject,
  subjects,
  onGenerate,
  isGenerating: externalIsGenerating
}) => {
  const [currentPhase, setCurrentPhase] = useState<TLearningCyclePhase>('DIAGNOSIS');
  
  const {
    isGenerating: internalIsGenerating,
    generatedMaterials,
    recommendations,
    generateMaterial,
    generateRecommendations,
    getMockUserProgress
  } = useMaterialGeneration();

  const isGenerating = externalIsGenerating || internalIsGenerating;

  // Mapeo de materias a pruebas PAES
  const subjectToPruebaMap: Record<string, TPAESPrueba> = {
    'competencia-lectora': 'COMPETENCIA_LECTORA',
    'matematica-m1': 'MATEMATICA_1',
    'matematica-m2': 'MATEMATICA_2',
    'historia': 'HISTORIA',
    'ciencias': 'CIENCIAS'
  };

  useEffect(() => {
    // Generar recomendaciones cuando cambia la materia o fase
    const userProgress = getMockUserProgress(selectedSubject);
    userProgress.currentPhase = currentPhase;
    generateRecommendations(userProgress, selectedSubject);
  }, [selectedSubject, currentPhase, generateRecommendations, getMockUserProgress]);

  const handleMaterialGeneration = async (config: any) => {
    const prueba = subjectToPruebaMap[selectedSubject] || 'COMPETENCIA_LECTORA';
    
    const fullConfig = {
      ...config,
      prueba,
      phase: currentPhase,
      subject: selectedSubject
    };

    // Usar el sistema interno de generación
    const materials = await generateMaterial(fullConfig);
    
    // También llamar al callback externo para compatibilidad
    if (onGenerate) {
      onGenerate(fullConfig);
    }

    return materials;
  };

  const phaseInfo = {
    'EXPERIENCIA_CONCRETA': {
      name: 'Experiencia Concreta',
      description: 'Práctica inicial con ejercicios básicos',
      color: 'bg-blue-100 text-blue-800'
    },
    'OBSERVACION_REFLEXIVA': {
      name: 'Observación Reflexiva',
      description: 'Análisis de patrones y estrategias',
      color: 'bg-green-100 text-green-800'
    },
    'CONCEPTUALIZACION_ABSTRACTA': {
      name: 'Conceptualización Abstracta',
      description: 'Teoría profunda y conceptos avanzados',
      color: 'bg-purple-100 text-purple-800'
    },
    'EXPERIMENTACION_ACTIVA': {
      name: 'Experimentación Activa',
      description: 'Aplicación práctica y simulacros',
      color: 'bg-orange-100 text-orange-800'
    },
    'DIAGNOSIS': {
      name: 'Diagnóstico',
      description: 'Evaluación del nivel actual',
      color: 'bg-red-100 text-red-800'
    }
  };

  const currentPhaseInfo = phaseInfo[currentPhase] || phaseInfo['DIAGNOSIS'];

  return (
    <div className="space-y-6">
      {/* Header con información de fase */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Sistema de Generación de Material PAES</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Ciclo de Aprendizaje Kolb • {subjects[selectedSubject]?.name}
                </p>
              </div>
            </div>
            <Badge className={currentPhaseInfo.color}>
              {currentPhaseInfo.name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {currentPhaseInfo.description}
          </p>
          
          {/* Navegador de fases */}
          <PhaseNavigator 
            currentPhase={currentPhase}
            onPhaseChange={setCurrentPhase}
          />
        </CardContent>
      </Card>

      {/* Analizador de progreso */}
      <UserProgressAnalyzer 
        selectedSubject={selectedSubject}
        currentPhase={currentPhase}
      />

      {/* Motor de recomendaciones */}
      <AdaptiveRecommendationEngine 
        recommendations={recommendations}
        onRecommendationSelect={handleMaterialGeneration}
        isGenerating={isGenerating}
      />

      {/* Hub principal de generación */}
      <MaterialGenerationHub
        selectedSubject={selectedSubject}
        currentPhase={currentPhase}
        recommendations={recommendations}
        onGenerate={handleMaterialGeneration}
        isGenerating={isGenerating}
      />

      {/* Resultados generados */}
      {generatedMaterials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Material Generado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {generatedMaterials.map((material) => (
                <div key={material.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{material.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {material.metadata.source}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {material.type === 'exercises' ? 
                      `Pregunta: ${material.content.question?.substring(0, 100)}...` :
                      `Tema: ${material.content.topic || 'Material de estudio'}`
                    }
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>⏱️ {material.metadata.estimatedTime} min</span>
                    <span>📊 {material.metadata.difficulty}</span>
                    <span>🎯 {material.metadata.skill}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
