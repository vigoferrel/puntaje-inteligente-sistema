
import { useState, useCallback } from 'react';
import { MaterialGenerationConfig, GeneratedMaterial, AdaptiveRecommendation, UserProgressData } from '@/types/material-generation';
import { OfficialContentService } from '@/services/material-generation/official-content-service';
import { AdaptiveRecommendationEngine } from '@/services/material-generation/adaptive-recommendation-engine';
import { toast } from '@/hooks/use-toast';

export const useMaterialGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMaterials, setGeneratedMaterials] = useState<GeneratedMaterial[]>([]);
  const [recommendations, setRecommendations] = useState<AdaptiveRecommendation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateMaterial = useCallback(async (config: MaterialGenerationConfig) => {
    setIsGenerating(true);
    setError(null);

    try {
      console.log('🎯 Generando material:', config);

      let materials: GeneratedMaterial[] = [];

      switch (config.materialType) {
        case 'exercises':
          materials = await OfficialContentService.generateOfficialExercises(config);
          break;
        case 'study_content':
          materials = await OfficialContentService.generateStudyContent(config);
          break;
        case 'assessment':
          materials = await OfficialContentService.generateOfficialExercises({
            ...config,
            materialType: 'exercises'
          });
          break;
        default:
          throw new Error(`Tipo de material no soportado: ${config.materialType}`);
      }

      setGeneratedMaterials(materials);

      toast({
        title: "Material generado exitosamente",
        description: `Se generaron ${materials.length} elementos de ${config.materialType}`,
      });

      console.log('✅ Material generado:', materials.length, 'elementos');
      return materials;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('❌ Error generando material:', err);
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: `No se pudo generar el material: ${errorMessage}`,
        variant: "destructive"
      });

      return [];
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generateRecommendations = useCallback((userProgress: UserProgressData, subject: string) => {
    try {
      const newRecommendations = AdaptiveRecommendationEngine.generateRecommendations(userProgress, subject);
      setRecommendations(newRecommendations);
      return newRecommendations;
    } catch (err) {
      console.error('❌ Error generando recomendaciones:', err);
      return [];
    }
  }, []);

  const clearMaterials = useCallback(() => {
    setGeneratedMaterials([]);
    setRecommendations([]);
    setError(null);
  }, []);

  const getMockUserProgress = useCallback((subject: string): UserProgressData => {
    return {
      userId: 'user-123',
      currentPhase: 'DIAGNOSIS',
      completedNodes: [],
      weakAreas: ['INTERPRET_RELATE', 'SOLVE_PROBLEMS'],
      strongAreas: ['TRACK_LOCATE'],
      overallProgress: 0.25,
      lastActivity: new Date()
    };
  }, []);

  return {
    isGenerating,
    generatedMaterials,
    recommendations,
    error,
    generateMaterial,
    generateRecommendations,
    clearMaterials,
    getMockUserProgress
  };
};
