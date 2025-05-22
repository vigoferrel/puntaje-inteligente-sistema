
import { useState, useEffect, useCallback } from "react";
import { useDiagnostic } from "@/hooks/use-diagnostic";
import { toast } from "@/components/ui/use-toast";

interface DiagnosticInitializationResult {
  initializing: boolean;
  generatingDiagnostic: boolean;
  error: string | null;
  retryInitialization: () => Promise<void>;
  retryCount: number;
  progress: number;
  loadingStep: string;
}

export const useDiagnosticInitialization = (): DiagnosticInitializationResult => {
  const [initializing, setInitializing] = useState(true);
  const [generatingDiagnostic, setGeneratingDiagnostic] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState("Inicializando");
  
  // Get diagnostic service
  const diagnosticService = useDiagnostic();
  
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
  
  // Función mejorada para inicializar diagnósticos con mejor manejo de errores
  const initDiagnostics = useCallback(async () => {
    try {
      // Reset states
      setError(null);
      setInitializing(true);
      
      // Comenzar animación de progreso
      const clearSimulation = simulateLoadingProgress();
      
      // Intenta cargar diagnósticos existentes primero
      if (diagnosticService.tests.length === 0) {
        console.log("Intentando cargar diagnósticos locales...");
        
        // Usar solo diagnósticos locales fallback
        setGeneratingDiagnostic(true);
        setLoadingStep("Generando diagnósticos básicos");
        
        const fallbackCreated = await diagnosticService.createLocalFallbackDiagnostics();
        
        if (fallbackCreated) {
          toast({
            title: "Diagnósticos básicos cargados",
            description: "Se han cargado diagnósticos básicos predefinidos.",
          });
          completeLoadingProgress();
        } else {
          // Si fallan los diagnósticos locales, intentar con el método por defecto
          setLoadingStep("Intentando método alternativo");
          const defaultDiagnosticsCreated = await diagnosticService.ensureDefaultDiagnosticsExist();
          
          if (!defaultDiagnosticsCreated) {
            clearSimulation();
            setError("No se pudieron cargar diagnósticos. Por favor, reinicie la aplicación o contacte al administrador.");
          } else {
            completeLoadingProgress();
          }
        }
        
        setGeneratingDiagnostic(false);
      } else {
        // Ya hay diagnósticos cargados
        console.log("Diagnósticos ya están cargados:", diagnosticService.tests.length);
        completeLoadingProgress();
      }
    } catch (error) {
      console.error("Error initializing diagnostics:", error);
      setError(error instanceof Error ? error.message : "Error al inicializar diagnósticos");
      setProgress(0);
    } finally {
      setInitializing(false);
    }
  }, [diagnosticService, simulateLoadingProgress, completeLoadingProgress]);

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
    loadingStep
  };
};
