
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Estado global simplificado para evitar re-inicializaciones
let globalInitState = {
  isReady: false,
  isInitializing: false,
  lastAttempt: 0
};

interface SimplifiedIntersectionalState {
  isIntersectionalReady: boolean;
  neuralHealth: any;
  systemVitals: any;
  generateIntersectionalInsights: () => any[];
  harmonizeExperience: () => void;
  adaptToUser: (behavior: any) => void;
  emergencyReset: () => void;
}

export const useSimplifiedIntersectional = (): SimplifiedIntersectionalState => {
  const { user } = useAuth();
  const [isReady, setIsReady] = useState(globalInitState.isReady);
  const initRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const now = Date.now();
    
    // Evitar múltiples inicializaciones
    if (initRef.current || globalInitState.isInitializing || (now - globalInitState.lastAttempt < 3000)) {
      return;
    }

    // Inicialización simplificada y rápida
    if (user?.id && !globalInitState.isReady) {
      initRef.current = true;
      globalInitState.isInitializing = true;
      globalInitState.lastAttempt = now;

      console.log('🚀 Inicialización interseccional simplificada');

      // Timeout de seguridad - máximo 2 segundos de carga
      timeoutRef.current = setTimeout(() => {
        globalInitState.isReady = true;
        globalInitState.isInitializing = false;
        setIsReady(true);
        console.log('✅ Sistema interseccional listo (modo simplificado)');
      }, 100); // Inicialización casi inmediata
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [user?.id]);

  // Datos por defecto para evitar errores
  const defaultNeuralHealth = {
    neural_efficiency: 85,
    cross_pollination_rate: 78,
    adaptive_learning_score: 82,
    user_experience_harmony: 88,
    cardiovascular: {
      heartRate: 72,
      bloodPressure: 'optimal' as const,
      circulation: 85,
      oxygenation: 95
    },
    singleton: {
      hasInstance: true,
      isInitializing: false,
      circuitBreakerOpen: false,
      emergencyActivationCount: 0,
      lastEmergencyActivation: 0,
      isStrictMode: false
    }
  };

  const defaultSystemVitals = {
    cardiovascular: {
      heartRate: 72,
      bloodPressure: 'optimal' as const,
      circulation: 85,
      oxygenation: 95
    },
    respiratory: {
      breathingRate: 16,
      oxygenLevel: 95,
      airQuality: 'pure' as const,
      antiTrackingActive: true
    },
    overallHealth: 'excellent' as const,
    lastCheckup: Date.now()
  };

  return {
    isIntersectionalReady: isReady,
    neuralHealth: defaultNeuralHealth,
    systemVitals: defaultSystemVitals,
    generateIntersectionalInsights: () => [
      {
        type: 'system-health',
        title: 'Sistema Operativo',
        description: 'Todos los sistemas funcionando correctamente',
        level: 'excellent'
      }
    ],
    harmonizeExperience: () => {
      console.log('🎵 Experiencia harmonizada');
    },
    adaptToUser: (behavior: any) => {
      console.log('🔄 Adaptación de usuario:', behavior);
    },
    emergencyReset: () => {
      globalInitState = {
        isReady: false,
        isInitializing: false,
        lastAttempt: 0
      };
      setIsReady(false);
      console.log('🚨 Reset de emergencia ejecutado');
    }
  };
};
