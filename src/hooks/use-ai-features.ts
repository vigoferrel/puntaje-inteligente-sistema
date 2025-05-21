
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";
import { mapEnumToSkillId, mapEnumToTestId } from "@/utils/supabase-mappers";

interface Exercise {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface AIAnalysis {
  strengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
  nextSteps: string[];
}

interface AIFeedback {
  positive: string;
  corrections: string;
  explanation: string;
  tip: string;
}

export const useAIFeatures = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const generateExercise = async (
    skill: TPAESHabilidad,
    prueba: TPAESPrueba,
    difficulty: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED',
    previousExercises: Exercise[] = []
  ): Promise<Exercise | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.functions.invoke('openrouter-ai', {
        body: {
          action: 'generate_exercise',
          payload: {
            skill,
            prueba,
            difficulty,
            previousExercises
          }
        }
      });
      
      if (error) throw new Error(error.message);
      
      let exercise: Exercise | null = null;
      
      try {
        // Parse the result from the AI response
        if (data && data.result) {
          const parsedResult = typeof data.result === 'string'
            ? JSON.parse(data.result)
            : data.result;
            
          exercise = {
            question: parsedResult.question,
            options: parsedResult.options,
            correctAnswer: parsedResult.correctAnswer,
            explanation: parsedResult.explanation
          };
        }
      } catch (parseError) {
        console.error('Error parsing AI result:', parseError);
        throw new Error('No se pudo interpretar la respuesta de la IA');
      }
      
      return exercise;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al generar ejercicio';
      console.error('Error generating exercise:', err);
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const analyzePerformance = async (
    userId: string,
    skillLevels: Record<TPAESHabilidad, number>,
    exerciseResults: any[]
  ): Promise<AIAnalysis | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.functions.invoke('openrouter-ai', {
        body: {
          action: 'analyze_performance',
          payload: {
            userId,
            skillLevels,
            exerciseResults
          }
        }
      });
      
      if (error) throw new Error(error.message);
      
      let analysis: AIAnalysis | null = null;
      
      try {
        if (data && data.result) {
          const parsedResult = typeof data.result === 'string'
            ? JSON.parse(data.result)
            : data.result;
            
          analysis = {
            strengths: parsedResult.strengths || [],
            areasForImprovement: parsedResult.areasForImprovement || [],
            recommendations: parsedResult.recommendations || [],
            nextSteps: parsedResult.nextSteps || []
          };
        }
      } catch (parseError) {
        console.error('Error parsing AI analysis:', parseError);
        throw new Error('No se pudo interpretar el análisis de la IA');
      }
      
      return analysis;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al analizar rendimiento';
      console.error('Error analyzing performance:', err);
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const provideFeedback = async (
    exerciseAttempt: { question: string; answer: string },
    correctAnswer: string,
    explanation: string
  ): Promise<AIFeedback | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.functions.invoke('openrouter-ai', {
        body: {
          action: 'provide_feedback',
          payload: {
            exerciseAttempt,
            correctAnswer,
            explanation
          }
        }
      });
      
      if (error) throw new Error(error.message);
      
      let feedback: AIFeedback | null = null;
      
      try {
        if (data && data.result) {
          const parsedResult = typeof data.result === 'string'
            ? JSON.parse(data.result)
            : data.result;
            
          feedback = {
            positive: parsedResult.positive || '',
            corrections: parsedResult.corrections || '',
            explanation: parsedResult.explanation || '',
            tip: parsedResult.tip || ''
          };
        }
      } catch (parseError) {
        console.error('Error parsing AI feedback:', parseError);
        throw new Error('No se pudo interpretar la retroalimentación de la IA');
      }
      
      return feedback;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al generar retroalimentación';
      console.error('Error providing feedback:', err);
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    generateExercise,
    analyzePerformance,
    provideFeedback,
    loading,
    error
  };
};
