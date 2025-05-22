
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { generateDiagnostic, saveDiagnostic } from "@/services/openrouter-service";
import { DiagnosticTest } from "@/types/diagnostic";
import { DiagnosticGeneratorService } from "./types";

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
