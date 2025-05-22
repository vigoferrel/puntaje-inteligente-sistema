
import { useState, useEffect, useCallback } from "react";
import { useDiagnostic } from "@/hooks/use-diagnostic";
import { toast } from "@/components/ui/use-toast";
import { useDemonstrationMode } from "./use-demonstration-mode";

interface DiagnosticInitializationResult {
  initializing: boolean;
  generatingDiagnostic: boolean;
  error: string | null;
  retryInitialization: () => Promise<void>;
  retryCount: number;
  progress: number;
  loadingStep: string;
  isDemoMode: boolean;
}

export const useDiagnosticInitialization = (): DiagnosticInitializationResult => {
  const [initializing, setInitializing] = useState(true);
  const [generatingDiagnostic, setGeneratingDiagnostic] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState("Inicializando");
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  // Get diagnostic service
  const diagnosticService = useDiagnostic();
  
  // Get demo mode hook
  const demoMode = useDemonstrationMode();
  
  // Función para simular progreso de carga visual
  const simulateLoadingProgress = useCallback(() => {
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        
        const newProgress = prev + Math.random() * 5;
        
        // Actualizar el paso según el progreso
        if (newProgress > 25 && newProgress < 50) {
          setLoadingStep("Preparando diagnósticos");
        } else if (newProgress >= 50 && newProgress < 75) {
          setLoadingStep("Cargando ejercicios");
        } else if (newProgress >= 75) {
          setLoadingStep("Finalizando");
        }
        
        return newProgress;
      });
    }, 200);
    
    return () => clearInterval(interval);
  }, []);
  
  // Finalizar la simulación de progreso y marcar como completado
  const completeLoadingProgress = useCallback(() => {
    setProgress(100);
    setLoadingStep("Completado");
  }, []);
  
  // Función para activar el modo demostración
  const activateDemonstrationMode = useCallback(() => {
    // Activar el modo demo
    demoMode.activateDemoMode();
    setIsDemoMode(true);
    
    // Sustituir los tests del servicio con tests de demostración
    diagnosticService.tests = demoMode.getDemoDiagnosticTests();
    
    // Notificar al usuario que estamos en modo demostración
    toast({
      title: "Modo demostración activado",
      description: "Se han cargado diagnósticos de demostración para visualización",
    });
    
    completeLoadingProgress();
    setError(null);
  }, [demoMode, diagnosticService, completeLoadingProgress]);
  
  // Función mejorada para inicializar diagnósticos con mejor manejo de errores
  const initDiagnostics = useCallback(async () => {
    try {
      // Reset states
      setError(null);
      setInitializing(true);
      
      // Comenzar animación de progreso
      const clearSimulation = simulateLoadingProgress();
      
      // Intenta cargar diagnósticos existentes primero
      const hasTests = diagnosticService.tests.length > 0;
      
      if (!hasTests) {
        console.log("Intentando cargar diagnósticos locales...");
        
        try {
          // Usar solo diagnósticos locales fallback
          setGeneratingDiagnostic(true);
          setLoadingStep("Generando diagnósticos básicos");
          
          // Primer intento: crear diagnósticos fallback
          const fallbackCreated = await diagnosticService.createLocalFallbackDiagnostics();
          
          if (fallbackCreated) {
            toast({
              title: "Diagnósticos básicos cargados",
              description: "Se han cargado diagnósticos básicos predefinidos.",
            });
            
            // Intentar cargar la lista de diagnósticos otra vez
            await diagnosticService.fetchDiagnosticTests("auto-generated");
            
            completeLoadingProgress();
          } else {
            // Si fallan los diagnósticos locales, activar el modo demostración
            console.log("Fallback local falló, activando modo demostración");
            activateDemonstrationMode();
          }
        } catch (innerError) {
          console.error("Error en la generación de diagnósticos locales:", innerError);
          activateDemonstrationMode();
        } finally {
          setGeneratingDiagnostic(false);
        }
      } else {
        // Ya hay diagnósticos cargados
        console.log("Diagnósticos ya están cargados:", diagnosticService.tests.length);
        completeLoadingProgress();
      }
    } catch (error) {
      console.error("Error initializing diagnostics:", error);
      setError(error instanceof Error ? error.message : "Error al inicializar diagnósticos");
      
      // Activar el modo demostración como último recurso
      console.log("Error crítico, activando modo demostración");
      activateDemonstrationMode();
    } finally {
      setInitializing(false);
    }
  }, [
    diagnosticService, 
    simulateLoadingProgress, 
    completeLoadingProgress,
    activateDemonstrationMode
  ]);

  // Initialize data
  useEffect(() => {
    initDiagnostics();
  }, [initDiagnostics]);

  // Function to retry initialization with count tracking
  const retryInitialization = async () => {
    setRetryCount(prev => prev + 1);
    await initDiagnostics();
  };

  return {
    initializing,
    generatingDiagnostic,
    error,
    retryInitialization,
    retryCount,
    progress,
    loadingStep,
    isDemoMode
  };
};
