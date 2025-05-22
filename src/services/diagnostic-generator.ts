
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Exercise } from "@/types/ai-types";
import { DiagnosticTest } from "@/types/diagnostic";
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";
import { mapTestIdToEnum, mapSkillIdToEnum } from "@/utils/supabase-mappers";
import { generateExercisesBatch, generateDiagnostic, saveDiagnostic } from "./openrouter-service";

// Definir tipo para nivel de dificultad aceptado por la base de datos
type DifficultLevel = "basic" | "intermediate" | "advanced";

// Mapear cadenas de dificultad a valores aceptados
const mapDifficulty = (difficulty: string): DifficultLevel => {
  const difficultyLower = difficulty.toLowerCase();
  if (difficultyLower === 'basic' || difficultyLower === 'easy') {
    return 'basic';
  } else if (difficultyLower === 'advanced' || difficultyLower === 'hard') {
    return 'advanced';
  }
  return 'intermediate'; // valor por defecto
};

/**
 * Genera una serie de ejercicios para un nodo específico y los guarda en la base de datos
 */
export const generateExercisesForNode = async (
  nodeId: string,
  skillId: number,
  testId: number,
  count: number = 5
): Promise<boolean> => {
  try {
    // Convertir IDs numéricos a los enums usados en la aplicación
    const skill = mapSkillIdToEnum(skillId);
    
    // Generar los ejercicios usando OpenRouter
    const exercises = await generateExercisesBatch(
      nodeId,
      skill,
      testId,
      count,
      'MIXED' // Mezcla de dificultades
    );
    
    if (!exercises || exercises.length === 0) {
      toast({
        title: "Error",
        description: "No se pudieron generar los ejercicios para el nodo",
        variant: "destructive"
      });
      return false;
    }
    
    // Convertir los ejercicios al formato de la base de datos y asegurar que difficulty sea compatible
    const exercisesData = exercises.map(exercise => {
      // Mapear el string de dificultad a uno de los valores permitidos
      const mappedDifficulty = mapDifficulty(exercise.difficulty || 'intermediate');
      
      return {
        node_id: nodeId,
        test_id: testId,
        skill_id: skillId,
        question: exercise.question,
        options: exercise.options, // Supabase convierte arrays a JSON automáticamente
        correct_answer: exercise.correctAnswer,
        explanation: exercise.explanation || '',
        difficulty: mappedDifficulty
      };
    });
    
    // Guardar los ejercicios en la base de datos uno a uno
    for (const exerciseData of exercisesData) {
      const { error } = await supabase
        .from('exercises')
        .insert(exerciseData);
      
      if (error) {
        console.error('Error al guardar el ejercicio:', error);
        toast({
          title: "Error",
          description: "Error al guardar un ejercicio en la base de datos",
          variant: "destructive"
        });
        return false;
      }
    }
    
    toast({
      title: "Éxito",
      description: `Se generaron ${exercises.length} ejercicios para el nodo`,
    });
    
    return true;
  } catch (error) {
    console.error('Error al generar ejercicios para el nodo:', error);
    toast({
      title: "Error",
      description: "Ocurrió un error al generar los ejercicios",
      variant: "destructive"
    });
    return false;
  }
};

/**
 * Genera un diagnóstico completo para un test específico
 */
export const generateDiagnosticTest = async (
  testId: number,
  title?: string,
  description?: string
): Promise<string | null> => {
  try {
    // Obtener todas las habilidades para el test especificado
    const { data: skills, error: skillsError } = await supabase
      .from('paes_skills')
      .select('id, code')
      .eq('test_id', testId);
    
    if (skillsError) {
      console.error('Error al obtener las habilidades:', skillsError);
      toast({
        title: "Error",
        description: "No se pudieron obtener las habilidades para el test",
        variant: "destructive"
      });
      return null;
    }
    
    if (!skills || skills.length === 0) {
      toast({
        title: "Error",
        description: "No hay habilidades definidas para este test",
        variant: "destructive"
      });
      return null;
    }
    
    // Convertir las skill_id a códigos de habilidades
    const skillCodes = skills.map(skill => skill.code);
    
    // Generar el diagnóstico
    const generatedDiagnostic = await generateDiagnostic(
      testId,
      skillCodes,
      3, // 3 ejercicios por habilidad
      'MIXED' // Mezcla de dificultades
    );
    
    if (!generatedDiagnostic || !generatedDiagnostic.exercises || generatedDiagnostic.exercises.length === 0) {
      toast({
        title: "Error",
        description: "No se pudo generar el diagnóstico",
        variant: "destructive"
      });
      return null;
    }
    
    // Personalizar título y descripción si se proporcionan
    const diagnosticToSave = {
      ...generatedDiagnostic,
      title: title || generatedDiagnostic.title,
      description: description || generatedDiagnostic.description
    };
    
    // Guardar el diagnóstico en la base de datos
    const diagnosticId = await saveDiagnostic(diagnosticToSave, testId);
    
    if (!diagnosticId) {
      toast({
        title: "Error",
        description: "No se pudo guardar el diagnóstico en la base de datos",
        variant: "destructive"
      });
      return null;
    }
    
    toast({
      title: "Éxito",
      description: `Se generó un diagnóstico con ${generatedDiagnostic.exercises.length} ejercicios`,
    });
    
    return diagnosticId;
  } catch (error) {
    console.error('Error al generar diagnóstico:', error);
    toast({
      title: "Error",
      description: "Ocurrió un error al generar el diagnóstico",
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Obtiene los diagnósticos existentes y permite generar uno nuevo
 */
export const fetchAndGenerateDiagnostics = async (
  testId?: number
): Promise<{
  diagnostics: DiagnosticTest[],
  generateNewDiagnostic: (title?: string, description?: string) => Promise<string | null>
}> => {
  try {
    // Obtener los diagnósticos existentes
    let query = supabase.from('diagnostic_tests').select('*');
    
    if (testId) {
      query = query.eq('test_id', testId);
    }
    
    const { data: dbDiagnostics, error } = await query;
    
    if (error) {
      console.error('Error al obtener los diagnósticos:', error);
      toast({
        title: "Error",
        description: "No se pudieron obtener los diagnósticos existentes",
        variant: "destructive"
      });
      return { 
        diagnostics: [], 
        generateNewDiagnostic: async () => null 
      };
    }
    
    // Transformar los datos de la base de datos a nuestro formato DiagnosticTest
    const diagnostics: DiagnosticTest[] = (dbDiagnostics || []).map(diagnostic => ({
      id: diagnostic.id,
      title: diagnostic.title,
      description: diagnostic.description || '',
      testId: diagnostic.test_id,
      questions: [], // Inicialmente vacío, se cargaría con otra consulta si es necesario
      isCompleted: false // Por defecto no completado
    }));
    
    // Función para generar un nuevo diagnóstico
    const generateNewDiagnostic = async (title?: string, description?: string): Promise<string | null> => {
      if (!testId) {
        toast({
          title: "Error",
          description: "Se requiere un ID de test para generar un diagnóstico",
          variant: "destructive"
        });
        return null;
      }
      
      return await generateDiagnosticTest(testId, title, description);
    };
    
    return {
      diagnostics,
      generateNewDiagnostic
    };
  } catch (error) {
    console.error('Error al obtener y preparar generación de diagnósticos:', error);
    toast({
      title: "Error",
      description: "Ocurrió un error al preparar la generación de diagnósticos",
      variant: "destructive"
    });
    return { 
      diagnostics: [], 
      generateNewDiagnostic: async () => null 
    };
  }
};
