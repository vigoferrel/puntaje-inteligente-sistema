
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";

export interface GeneratedExercise {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface PerformanceAnalysis {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  nextSteps: string[];
}

export interface ExerciseFeedback {
  feedback: string;
  correctApproach: string;
  tip: string;
}

export const useAIFeatures = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateExercise = async (
    skill: TPAESHabilidad,
    prueba: TPAESPrueba,
    difficulty: 'basic' | 'intermediate' | 'advanced',
    previousExercises: string[] = []
  ): Promise<GeneratedExercise | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: invokeError } = await supabase.functions.invoke('openrouter-ai', {
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

      if (invokeError) throw invokeError;
      
      if (!data.result) {
        throw new Error('No se pudo generar el ejercicio');
      }

      // Parse the JSON string in the result
      let exercise;
      try {
        // The AI might return formatted JSON or just a JSON string
        if (typeof data.result === 'string') {
          exercise = JSON.parse(data.result);
        } else {
          exercise = data.result;
        }
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        throw new Error('Error en el formato de respuesta AI');
      }

      return exercise as GeneratedExercise;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      console.error('Error generating exercise:', err);
      setError(message);
      toast({
        title: "Error",
        description: `No se pudo generar el ejercicio: ${message}`,
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
  ): Promise<PerformanceAnalysis | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: invokeError } = await supabase.functions.invoke('openrouter-ai', {
        body: {
          action: 'analyze_performance',
          payload: {
            userId,
            skillLevels,
            exerciseResults
          }
        }
      });

      if (invokeError) throw invokeError;
      
      if (!data.result) {
        throw new Error('No se pudo analizar el rendimiento');
      }

      // Process the analysis result
      // This would need parsing based on the actual AI response format
      const analysis = {
        strengths: extractListFromAnalysis(data.result, 'strengths'),
        weaknesses: extractListFromAnalysis(data.result, 'areas for improvement'),
        recommendations: extractListFromAnalysis(data.result, 'recommendations'),
        nextSteps: extractListFromAnalysis(data.result, 'next steps')
      };

      return analysis;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      console.error('Error analyzing performance:', err);
      setError(message);
      toast({
        title: "Error",
        description: `No se pudo analizar el rendimiento: ${message}`,
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
  ): Promise<ExerciseFeedback | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: invokeError } = await supabase.functions.invoke('openrouter-ai', {
        body: {
          action: 'provide_feedback',
          payload: {
            exerciseAttempt,
            correctAnswer,
            explanation
          }
        }
      });

      if (invokeError) throw invokeError;
      
      if (!data.result) {
        throw new Error('No se pudo generar la retroalimentación');
      }

      // Simple processing of feedback response
      const feedbackText = data.result as string;
      const sections = feedbackText.split('\n\n');

      const feedback: ExerciseFeedback = {
        feedback: sections[0] || feedbackText,
        correctApproach: sections.length > 1 ? sections[1] : '',
        tip: sections.length > 2 ? sections[2] : ''
      };

      return feedback;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      console.error('Error providing feedback:', err);
      setError(message);
      toast({
        title: "Error",
        description: `No se pudo generar la retroalimentación: ${message}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to extract lists from AI response text
  const extractListFromAnalysis = (text: string, section: string): string[] => {
    try {
      // This is a simple extraction that would need to be adjusted
      // based on the actual format of the AI response
      const lowerText = text.toLowerCase();
      const lowerSection = section.toLowerCase();
      
      // Find the section
      const sectionIndex = lowerText.indexOf(lowerSection);
      if (sectionIndex === -1) return [];
      
      // Get the text after the section heading
      const sectionStart = sectionIndex + lowerSection.length;
      let sectionEnd = lowerText.indexOf(':', sectionStart + 1);
      if (sectionEnd === -1) sectionEnd = text.length;
      
      // Extract the content
      const sectionContent = text.substring(sectionStart, sectionEnd).trim();
      
      // Split by common list indicators and filter out empty items
      return sectionContent
        .split(/[\n\r]+|[•\-*]\s+|\d+\.\s+/)
        .map(item => item.trim())
        .filter(Boolean);
    } catch (error) {
      console.error('Error extracting list from analysis:', error);
      return [];
    }
  };

  return {
    loading,
    error,
    generateExercise,
    analyzePerformance,
    provideFeedback
  };
};
