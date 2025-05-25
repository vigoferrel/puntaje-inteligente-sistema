
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ValidationStatus {
  isValid: boolean;
  issuesCount: number;
  lastValidation?: Date;
  issuesByType?: Record<string, number>;
}

/**
 * Hook para validación inteligente del sistema educativo
 */
export const useValidationSystem = () => {
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>({
    isValid: true,
    issuesCount: 0,
    lastValidation: undefined,
    issuesByType: {}
  });

  // Validar coherencia general del sistema
  const validateSystemCoherence = useCallback(async () => {
    try {
      console.log('🔍 Validando coherencia del sistema...');

      const { data: validationResults, error } = await supabase
        .rpc('validate_nodes_coherence');

      if (error) {
        console.error('Error en validación:', error);
        return;
      }

      // Procesar resultados de validación
      const issuesByType: Record<string, number> = {};
      let totalIssues = 0;

      validationResults?.forEach((result: any) => {
        if (result.node_count > 0) {
          issuesByType[result.issue_type] = result.node_count;
          totalIssues += result.node_count;
        }
      });

      const isValid = totalIssues === 0;

      setValidationStatus({
        isValid,
        issuesCount: totalIssues,
        lastValidation: new Date(),
        issuesByType
      });

      console.log(`✅ Validación completada: ${isValid ? 'Sistema coherente' : `${totalIssues} problemas detectados`}`);

    } catch (error) {
      console.error('❌ Error validando sistema:', error);
    }
  }, []);

  // Validar mapeo de nodos específico
  const validateNodeMapping = useCallback(async () => {
    try {
      const { data: mappingIssues } = await supabase
        .from('learning_nodes')
        .select('id, test_id, skill_id, code')
        .or('test_id.is.null,skill_id.is.null');

      const issues = mappingIssues?.length || 0;
      
      if (issues > 0) {
        console.warn(`⚠️ ${issues} nodos con mapeo incompleto detectados`);
      }

      return issues === 0;
    } catch (error) {
      console.error('❌ Error validando mapeo de nodos:', error);
      return false;
    }
  }, []);

  // Validar integridad de diagnósticos
  const validateDiagnosticIntegrity = useCallback(async () => {
    try {
      const { data: diagnosticTests } = await supabase
        .from('diagnostic_tests')
        .select('id, test_id, total_questions, questions_per_skill');

      const { data: exercises } = await supabase
        .from('exercises')
        .select('id, diagnostic_id, test_id')
        .not('diagnostic_id', 'is', null);

      // Validar que cada diagnóstico tenga ejercicios asociados
      const diagnosticsWithoutExercises = diagnosticTests?.filter(diag => 
        !exercises?.some(ex => ex.diagnostic_id === diag.id)
      );

      const issues = diagnosticsWithoutExercises?.length || 0;
      
      if (issues > 0) {
        console.warn(`⚠️ ${issues} diagnósticos sin ejercicios asociados`);
      }

      return issues === 0;
    } catch (error) {
      console.error('❌ Error validando integridad diagnóstica:', error);
      return false;
    }
  }, []);

  return {
    validationStatus,
    validateSystemCoherence,
    validateNodeMapping,
    validateDiagnosticIntegrity
  };
};
