
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sparkles, BookOpen, TestTube, FileText, Play, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { TLearningCyclePhase } from '@/types/system-types';
import { ExerciseGenerator } from './ExerciseGenerator';
import { StudyContentGenerator } from './StudyContentGenerator';
import { AssessmentGenerator } from './AssessmentGenerator';

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
  const [activeGenerator, setActiveGenerator] = useState<'exercises' | 'content' | 'assessment'>('exercises');
  const [generationMode, setGenerationMode] = useState<'official' | 'ai' | 'hybrid'>('official');

  const handleQuickGeneration = (type: string) => {
    const config = {
      materialType: type,
      subject: selectedSubject,
      phase: currentPhase,
      count: type === 'exercises' ? 5 : 3,
      mode: generationMode,
      useOfficialContent: generationMode !== 'ai'
    };
    
    onGenerate(config);
  };

  const getModeDescription = (mode: string) => {
    switch (mode) {
      case 'official':
        return 'Usa exclusivamente preguntas oficiales de exámenes PAES reales';
      case 'ai':
        return 'Genera contenido nuevo usando IA basado en patrones PAES';
      case 'hybrid':
        return 'Combina preguntas oficiales con contenido generado por IA';
      default:
        return 'Modo de generación';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Hub de Generación de Material</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Contenido oficial PAES y generación inteligente
                </p>
              </div>
            </div>
            
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Fase: {currentPhase}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Selector de Modo de Generación */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3">Modo de Generación</h4>
            <div className="grid grid-cols-3 gap-2">
              {(['official', 'ai', 'hybrid'] as const).map((mode) => (
                <Button
                  key={mode}
                  variant={generationMode === mode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setGenerationMode(mode)}
                  className="flex flex-col h-auto py-3"
                >
                  <div className="flex items-center gap-2">
                    {mode === 'official' && <CheckCircle className="h-4 w-4" />}
                    {mode === 'ai' && <Sparkles className="h-4 w-4" />}
                    {mode === 'hybrid' && <FileText className="h-4 w-4" />}
                    <span className="font-medium">
                      {mode === 'official' ? 'Oficial' : mode === 'ai' ? 'IA' : 'Híbrido'}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 text-center">
                    {getModeDescription(mode)}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="grid grid-cols-3 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => handleQuickGeneration('exercises')}
                disabled={isGenerating}
                className="w-full h-auto py-4 flex flex-col gap-2"
                variant="outline"
              >
                <TestTube className="h-5 w-5" />
                <span>Ejercicios</span>
                <span className="text-xs text-muted-foreground">5 preguntas</span>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => handleQuickGeneration('study_content')}
                disabled={isGenerating}
                className="w-full h-auto py-4 flex flex-col gap-2"
                variant="outline"
              >
                <BookOpen className="h-5 w-5" />
                <span>Contenido</span>
                <span className="text-xs text-muted-foreground">Material teórico</span>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => handleQuickGeneration('assessment')}
                disabled={isGenerating}
                className="w-full h-auto py-4 flex flex-col gap-2"
                variant="outline"
              >
                <FileText className="h-5 w-5" />
                <span>Evaluación</span>
                <span className="text-xs text-muted-foreground">Test diagnóstico</span>
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Generadores Especializados */}
      <Tabs value={activeGenerator} onValueChange={(value) => setActiveGenerator(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="exercises" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Ejercicios
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Contenido
          </TabsTrigger>
          <TabsTrigger value="assessment" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Evaluación
          </TabsTrigger>
        </TabsList>

        <TabsContent value="exercises" className="mt-6">
          <ExerciseGenerator
            selectedSubject={selectedSubject}
            currentPhase={currentPhase}
            onGenerate={(config) => onGenerate({ ...config, mode: generationMode })}
            isGenerating={isGenerating}
            generationMode={generationMode}
          />
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <StudyContentGenerator
            selectedSubject={selectedSubject}
            currentPhase={currentPhase}
            onGenerate={(config) => onGenerate({ ...config, mode: generationMode })}
            isGenerating={isGenerating}
          />
        </TabsContent>

        <TabsContent value="assessment" className="mt-6">
          <AssessmentGenerator
            selectedSubject={selectedSubject}
            currentPhase={currentPhase}
            onGenerate={(config) => onGenerate({ ...config, mode: generationMode })}
            isGenerating={isGenerating}
          />
        </TabsContent>
      </Tabs>

      {/* Recomendaciones Contextuales */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Recomendaciones para {selectedSubject}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">{rec.title || 'Recomendación de material'}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleQuickGeneration(rec.type || 'exercises')}
                    disabled={isGenerating}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Indicador de Contenido Oficial */}
      {generationMode === 'official' && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Usando Contenido Oficial PAES 2024
                </p>
                <p className="text-xs text-green-700">
                  Material validado y extraído de exámenes oficiales reales
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
