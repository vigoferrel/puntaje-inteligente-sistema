
import { useState, useCallback, useRef } from 'react';
import { useDiagnosticSystem } from '@/hooks/diagnostic/useDiagnosticSystem';
import { useLearningPlans } from '@/hooks/learning-plans/use-learning-plans';

interface ValidationStatus {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  lastValidated: Date | null;
  systemHealth: 'excellent' | 'good' | 'fair' | 'poor';
}

interface ValidationCache {
  result: ValidationStatus;
  timestamp: number;
}

export const useValidationSystem = () => {
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>({
    isValid: true,
    errors: [],
    warnings: [],
    lastValidated: null,
    systemHealth: 'good'
  });

  // Cache de validación más agresivo - 30 minutos
  const validationCache = useRef<ValidationCache | null>(null);
  const isValidating = useRef(false);

  const diagnosticSystem = useDiagnosticSystem();
  const { plans, currentPlan } = useLearningPlans();

  const validateSystemCoherence = useCallback(async () => {
    // Evitar validaciones concurrentes
    if (isValidating.current) {
      console.log('🔍 Validación ya en progreso, saltando...');
      return;
    }

    // Usar cache si es reciente (30 minutos)
    const now = Date.now();
    if (validationCache.current && 
        (now - validationCache.current.timestamp) < 1800000) {
      console.log('🔍 Usando validación en cache');
      setValidationStatus(validationCache.current.result);
      return;
    }

    isValidating.current = true;
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Validaciones básicas y rápidas
      if (!diagnosticSystem.isSystemReady) {
        warnings.push('Sistema diagnóstico inicializando...');
      }

      if (diagnosticSystem.learningNodes.length === 0) {
        warnings.push('Cargando nodos de aprendizaje...');
      }

      if (plans.length === 0) {
        warnings.push('Generando planes de aprendizaje...');
      }

      // Validación optimizada de nodos
      const nodesWithoutSubject = diagnosticSystem.learningNodes.filter(node => 
        !node.subjectArea
      );
      
      if (nodesWithoutSubject.length > 0 && nodesWithoutSubject.length < 10) {
        warnings.push(`${nodesWithoutSubject.length} nodos requieren configuración`);
      }

      // Calcular salud del sistema
      let systemHealth: ValidationStatus['systemHealth'] = 'excellent';
      
      if (errors.length > 0) {
        systemHealth = 'poor';
      } else if (warnings.length > 3) {
        systemHealth = 'fair';
      } else if (warnings.length > 0) {
        systemHealth = 'good';
      }

      const result: ValidationStatus = {
        isValid: errors.length === 0,
        errors,
        warnings,
        lastValidated: new Date(),
        systemHealth
      };

      // Guardar en cache
      validationCache.current = {
        result,
        timestamp: now
      };

      setValidationStatus(result);

      console.log('🔍 Validación completada:', {
        isValid: errors.length === 0,
        errores: errors.length,
        advertencias: warnings.length,
        health: systemHealth
      });

    } catch (error) {
      console.error('❌ Error durante validación:', error);
      
      const errorResult: ValidationStatus = {
        isValid: false,
        errors: ['Error durante la validación del sistema'],
        warnings: [],
        lastValidated: new Date(),
        systemHealth: 'poor'
      };

      setValidationStatus(errorResult);
    } finally {
      isValidating.current = false;
    }
  }, [diagnosticSystem, plans]);

  return {
    validationStatus,
    validateSystemCoherence
  };
};
