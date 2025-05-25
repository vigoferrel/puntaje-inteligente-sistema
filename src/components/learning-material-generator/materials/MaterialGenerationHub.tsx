
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, BookOpen, TestTube, Map, Target } from 'lucide-react';
import { TLearningCyclePhase, MaterialType } from '@/types/system-types';
import { ExerciseGenerator } from './ExerciseGenerator';
import { StudyContentGenerator } from './StudyContentGenerator';
import { AssessmentGenerator } from './AssessmentGenerator';
import { SmartRecommendationEngine } from './SmartRecommendationEngine';

interface MaterialGenerationHubProps {
  selectedSubject: string;
  currentPhase: TLearningCyclePhase;
  recommendations: any[];
  onGenerate: (config: any) => void;
  isGenerating: boolean;
}

export const MaterialGenerationHub: React.FC<MaterialGenerationHubProps> = ({
  selectedSubject,
  currentPhase,
  recommendations,
  onGenerate,
  isGenerating
}) => {
  const [selectedMaterialType, setSelectedMaterialType] = useState<MaterialType>('exercises');

  const materialTypes = [
    {
      type: 'exercises' as MaterialType,
      name: 'Ejercicios',
      icon: BookOpen,
      description: 'Preguntas tipo PAES para practicar'
    },
    {
      type: 'study_content' as MaterialType,
      name: 'Contenido de Estudio',
      icon: TestTube,
      description: 'Material teórico y explicaciones'
    },
    {
      type: 'diagnostic_tests' as MaterialType,
      name: 'Evaluaciones',
      icon: Target,
      description: 'Tests para medir progreso'
    },
    {
      type: 'practice_guides' as MaterialType,
      name: 'Guías de Práctica',
      icon: Map,
      description: 'Ejercicios paso a paso'
    }
  ];

  const getRecommendedMaterials = () => {
    const phaseRecommendations: Record<TLearningCyclePhase, MaterialType[]> = {
      'DIAGNOSIS': ['diagnostic_tests', 'exercises'],
      'SKILL_TRAINING': ['exercises', 'practice_guides'],
      'CONTENT_STUDY': ['study_content', 'practice_guides'],
      'PERIODIC_TESTS': ['diagnostic_tests', 'exercises'],
      'FINAL_SIMULATIONS': ['simulations', 'exercises'],
      'PERSONALIZED_PLAN': ['study_content'],
      'FEEDBACK_ANALYSIS': ['diagnostic_tests'],
      'REINFORCEMENT': ['exercises', 'practice_guides'],
      'diagnostic': ['diagnostic_tests'],
      'exploration': ['study_content'],
      'practice': ['exercises'],
      'application': ['simulations']
    };
    return phaseRecommendations[currentPhase] || ['exercises'];
  };

  const recommendedMaterials = getRecommendedMaterials();

  return (
    <div className="space-y-6">
      {/* Header con Recomendaciones de Fase */}
      <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Generación Inteligente de Material</h3>
              <p className="text-muted-foreground">
                Optimizado para la fase: <span className="font-medium">{currentPhase}</span>
              </p>
            </div>
            <div className="flex gap-2">
              {recommendedMaterials.map(material => (
                <Badge key={material} variant="outline" className="text-xs">
                  Recomendado: {material}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selector de Tipo de Material */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {materialTypes.map(materialType => {
          const Icon = materialType.icon;
          const isRecommended = recommendedMaterials.includes(materialType.type);
          const isSelected = selectedMaterialType === materialType.type;

          return (
            <Button
              key={materialType.type}
              onClick={() => setSelectedMaterialType(materialType.type)}
              variant={isSelected ? "default" : "outline"}
              className={`h-auto p-4 flex flex-col gap-2 ${
                isRecommended ? 'ring-2 ring-primary/20' : ''
              }`}
            >
              <Icon className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium text-sm">{materialType.name}</div>
                <div className="text-xs text-muted-foreground">
                  {materialType.description}
                </div>
              </div>
              {isRecommended && (
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Recomendado
                </Badge>
              )}
            </Button>
          );
        })}
      </div>

      {/* Generadores Específicos */}
      <Tabs value={selectedMaterialType} onValueChange={(value) => setSelectedMaterialType(value as MaterialType)}>
        <TabsContent value="exercises">
          <ExerciseGenerator
            selectedSubject={selectedSubject}
            currentPhase={currentPhase}
            onGenerate={onGenerate}
            isGenerating={isGenerating}
          />
        </TabsContent>

        <TabsContent value="study_content">
          <StudyContentGenerator
            selectedSubject={selectedSubject}
            currentPhase={currentPhase}
            onGenerate={onGenerate}
            isGenerating={isGenerating}
          />
        </TabsContent>

        <TabsContent value="diagnostic_tests">
          <AssessmentGenerator
            selectedSubject={selectedSubject}
            currentPhase={currentPhase}
            onGenerate={onGenerate}
            isGenerating={isGenerating}
          />
        </TabsContent>

        <TabsContent value="practice_guides">
          <Card>
            <CardHeader>
              <CardTitle>Guías de Práctica</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Las guías de práctica paso a paso estarán disponibles pronto.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Motor de Recomendaciones Inteligentes */}
      <SmartRecommendationEngine
        currentPhase={currentPhase}
        selectedMaterialType={selectedMaterialType}
        recommendations={recommendations}
        onApplyRecommendation={onGenerate}
      />
    </div>
  );
};
