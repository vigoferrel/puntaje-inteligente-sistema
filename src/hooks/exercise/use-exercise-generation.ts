
import { useState } from 'react';
import { Exercise } from '@/types/ai-types';
import { generateExercise as genExerciseFromAPI, generateExercisesBatch } from '@/services/openrouter/exercise-generation';
import { TPAESHabilidad, TPAESPrueba, TLearningNode } from '@/types/system-types';
import { ExerciseContentValidator } from '@/utils/exercise-content-validator';
import { EducationalExerciseBank } from '@/utils/educational-exercise-bank';
import { toast } from '@/components/ui/use-toast';

/**
 * Hook para manejar la generación de ejercicios con validación de contenido educativo
 */
export function useExerciseGeneration() {
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Generar un ejercicio nuevo con validación
  const generateExercise = async (
    skill: TPAESHabilidad, 
    prueba?: TPAESPrueba, 
    difficulty: string = "INTERMEDIATE"
  ): Promise<Exercise | null> => {
    try {
      setIsLoading(true);
      
      console.log(`Generando ejercicio educativo - skill=${skill}, prueba=${prueba || 'inferida'}, difficulty=${difficulty}`);
      
      // Si no se especifica una prueba, inferir según la habilidad
      const effectivePrueba = prueba || inferPruebaFromSkill(skill);
      
      // Intentar generar ejercicio
      const exercise = await genExerciseFromAPI(
        skill, 
        effectivePrueba, 
        difficulty as 'BASIC' | 'INTERMEDIATE' | 'ADVANCED'
      );
      
      if (exercise) {
        // Validar contenido
        const validation = ExerciseContentValidator.validateExercise(exercise);
        
        if (validation.isValid) {
          // Ejercicio válido
          exercise.prueba = effectivePrueba;
          setCurrentExercise(exercise);
          
          toast({
            title: "Ejercicio generado",
            description: "Se ha creado un ejercicio educativo apropiado para tu nivel."
          });
          
          return exercise;
        } else {
          // Ejercicio inválido, usar respaldo
          console.warn('Ejercicio generado inválido, usando respaldo educativo:', validation.errors);
          
          const fallback = EducationalExerciseBank.getFallbackExercise(skill, effectivePrueba, difficulty);
          if (fallback) {
            setCurrentExercise(fallback);
            
            toast({
              title: "Ejercicio educativo",
              description: "Se ha proporcionado un ejercicio de nuestro banco educativo verificado."
            });
            
            return fallback;
          }
        }
      }
      
      // Si todo falla, generar respaldo garantizado
      const emergency = EducationalExerciseBank.getFallbackExercise(skill, effectivePrueba, difficulty);
      if (emergency) {
        setCurrentExercise(emergency);
        
        toast({
          title: "Ejercicio de respaldo",
          description: "Se ha proporcionado un ejercicio educativo de nuestro banco de contenido.",
          variant: "default"
        });
        
        return emergency;
      }
      
      // Último recurso
      toast({
        title: "Error",
        description: "No se pudo generar un ejercicio apropiado en este momento. Por favor intenta más tarde.",
        variant: "destructive"
      });
      
      return null;
      
    } catch (error) {
      console.error("Error al generar ejercicio:", error);
      
      // Siempre intentar proporcionar respaldo en caso de error
      const effectivePrueba = prueba || inferPruebaFromSkill(skill);
      const fallback = EducationalExerciseBank.getFallbackExercise(skill, effectivePrueba, difficulty);
      
      if (fallback) {
        setCurrentExercise(fallback);
        
        toast({
          title: "Ejercicio de respaldo",
          description: "Se ha proporcionado un ejercicio educativo verificado de nuestro banco de contenido."
        });
        
        return fallback;
      }
      
      toast({
        title: "Error",
        description: "Ocurrió un error al generar el ejercicio. Por favor intenta de nuevo.",
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generar un ejercicio para un nodo de aprendizaje
  const generateExerciseForNode = async (node: TLearningNode): Promise<Exercise | null> => {
    if (!node || !node.skill || !node.prueba) {
      console.error("Información insuficiente en el nodo para generar ejercicio");
      
      toast({
        title: "Error",
        description: "No se puede generar un ejercicio para este nodo. Información insuficiente.",
        variant: "destructive"
      });
      
      return null;
    }
    
    try {
      setIsLoading(true);
      
      // Generar ejercicio utilizando la información del nodo
      const exercise = await generateExercise(
        node.skill,
        node.prueba,
        node.difficulty || 'INTERMEDIATE'
      );
      
      if (exercise) {
        // Vincular el ejercicio con el nodo
        exercise.nodeId = node.id;
        exercise.nodeName = node.title;
        exercise.prueba = node.prueba;
        
        setCurrentExercise(exercise);
        return exercise;
      }
      
      return null;
    } catch (error) {
      console.error("Error al generar ejercicio para nodo:", error);
      
      toast({
        title: "Error",
        description: "No se pudo generar un ejercicio para este nodo.",
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Inferir el tipo de prueba según la habilidad
  const inferPruebaFromSkill = (skill: TPAESHabilidad): TPAESPrueba => {
    const skillToPruebaMap: Record<TPAESHabilidad, TPAESPrueba> = {
      'TRACK_LOCATE': 'COMPETENCIA_LECTORA',
      'INTERPRET_RELATE': 'COMPETENCIA_LECTORA',
      'EVALUATE_REFLECT': 'COMPETENCIA_LECTORA',
      'SOLVE_PROBLEMS': 'MATEMATICA_1',
      'REPRESENT': 'MATEMATICA_1',
      'MODEL': 'MATEMATICA_2',
      'ARGUE_COMMUNICATE': 'MATEMATICA_2',
      'IDENTIFY_THEORIES': 'CIENCIAS',
      'PROCESS_ANALYZE': 'CIENCIAS',
      'APPLY_PRINCIPLES': 'CIENCIAS',
      'SCIENTIFIC_ARGUMENT': 'CIENCIAS',
      'TEMPORAL_THINKING': 'HISTORIA',
      'SOURCE_ANALYSIS': 'HISTORIA',
      'MULTICAUSAL_ANALYSIS': 'HISTORIA',
      'CRITICAL_THINKING': 'HISTORIA',
      'REFLECTION': 'HISTORIA'
    };
    
    return skillToPruebaMap[skill] || 'COMPETENCIA_LECTORA';
  };

  return {
    currentExercise,
    setCurrentExercise,
    generateExercise,
    generateExerciseForNode,
    isLoading
  };
}
