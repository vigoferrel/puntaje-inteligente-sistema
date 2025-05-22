
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
  
  // Función para activar el modo demostración de forma simplificada
  const activateDemonstrationMode = useCallback(() => {
    // Activar el modo demo si no está ya activado
    if (!demoMode.demoActivated) {
      // Activar el modo demo
      demoMode.activateDemoMode();
      setIsDemoMode(true);
      
      // Sustituir los tests del servicio con tests de demostración
      diagnosticService.tests = demoMode.getDemoDiagnosticTests();
      
      console.log("Modo demostración activado, tests cargados:", diagnosticService.tests.length);
      
      // Notificar al usuario que estamos en modo demostración
      toast({
        title: "Modo demostración activado",
        description: "Se han cargado diagnósticos de demostración para visualización",
      });
      
      setProgress(100);
      setError(null);
    }
    
    // Finalizar inicialización
    setInitializing(false);
    setGeneratingDiagnostic(false);
  }, [demoMode, diagnosticService]);
  
  // Función simplificada para inicializar diagnósticos
  const initDiagnostics = useCallback(async () => {
    try {
      // Reset states
      setError(null);
      setInitializing(true);
      setProgress(30);
      
      // Verificar si ya hay diagnósticos cargados
      const hasTests = diagnosticService.tests && diagnosticService.tests.length > 0;
      
      if (hasTests) {
        // Si ya hay diagnósticos, simplemente completamos
        console.log("Diagnósticos ya están cargados:", diagnosticService.tests.length);
        setProgress(100);
        setInitializing(false);
        return;
      }
      
      // Si no hay diagnósticos, activamos el modo demostración directamente
      // para evitar múltiples llamadas a la base de datos
      console.log("No hay diagnósticos cargados, activando modo demostración");
      activateDemonstrationMode();
      
    } catch (error) {
      console.error("Error initializing diagnostics:", error);
      
      // En caso de cualquier error, activar modo demostración
      activateDemonstrationMode();
    }
  }, [diagnosticService, activateDemonstrationMode]);

  // Inicializar datos solo una vez al cargar
  useEffect(() => {
    initDiagnostics();
    // No incluimos dependencias para que solo se ejecute al montar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Función para reintentar inicialización
  const retryInitialization = async () => {
    setRetryCount(prev => prev + 1);
    // Si ya hemos reintentado más de una vez, vamos directo al modo demo
    if (retryCount >= 1) {
      activateDemonstrationMode();
    } else {
      await initDiagnostics();
    }
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
