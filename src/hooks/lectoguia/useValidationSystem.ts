
import { useState, useCallback } from 'react';
import { useDiagnosticSystem } from '@/hooks/diagnostic/useDiagnosticSystem';
import { useLearningPlans } from '@/hooks/learning-plans/use-learning-plans';

interface ValidationStatus {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  lastValidated: Date | null;
  systemHealth: 'excellent' | 'good' | 'fair' | 'poor';
}

export const useValidationSystem = () => {
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>({
    isValid: true,
    errors: [],
    warnings: [],
    lastValidated: null,
    systemHealth: 'good'
  });

  const diagnosticSystem = useDiagnosticSystem();
  const { plans, currentPlan } = useLearningPlans();

  const validateSystemCoherence = useCallback(async () => {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Validar sistema diagnóstico
      if (!diagnosticSystem.isSystemReady) {
        errors.push('Sistema diagnóstico no está listo');
      }

      if (diagnosticSystem.learningNodes.length === 0) {
        warnings.push('No se encontraron nodos de aprendizaje');
      }

      // Validar planes de aprendizaje
      if (plans.length === 0) {
        warnings.push('No se encontraron planes de aprendizaje');
      }

      // Validar coherencia de datos
      const nodesWithoutSubject = diagnosticSystem.learningNodes.filter(node => 
        !node.subjectArea && !node.subject_area
      );
      
      if (nodesWithoutSubject.length > 0) {
        warnings.push(`${nodesWithoutSubject.length} nodos sin área de materia definida`);
      }

      // Calcular salud del sistema
      let systemHealth: ValidationStatus['systemHealth'] = 'excellent';
      
      if (errors.length > 0) {
        systemHealth = 'poor';
      } else if (warnings.length > 2) {
        systemHealth = 'fair';
      } else if (warnings.length > 0) {
        systemHealth = 'good';
      }

      setValidationStatus({
        isValid: errors.length === 0,
        errors,
        warnings,
        lastValidated: new Date(),
        systemHealth
      });

      console.log('🔍 Validación del sistema completada:', {
        isValid: errors.length === 0,
        errors: errors.length,
        warnings: warnings.length,
        systemHealth
      });

    } catch (error) {
      console.error('❌ Error durante validación:', error);
      setValidationStatus(prev => ({
        ...prev,
        errors: [...prev.errors, 'Error durante la validación del sistema'],
        isValid: false,
        systemHealth: 'poor',
        lastValidated: new Date()
      }));
    }
  }, [diagnosticSystem, plans]);

  return {
    validationStatus,
    validateSystemCoherence
  };
};
