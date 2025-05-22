
import { useState, useEffect, useCallback } from "react";
import { useDiagnostic } from "@/hooks/use-diagnostic";
import { toast } from "@/components/ui/use-toast";

interface DiagnosticInitializationResult {
  initializing: boolean;
  generatingDiagnostic: boolean;
  error: string | null;
  retryInitialization: () => Promise<void>;
  retryCount: number;
}

export const useDiagnosticInitialization = (): DiagnosticInitializationResult => {
  const [initializing, setInitializing] = useState(true);
  const [generatingDiagnostic, setGeneratingDiagnostic] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Get diagnostic service
  const diagnosticService = useDiagnostic();
  
  // Función mejorada para inicializar diagnósticos con mejor manejo de errores
  const initDiagnostics = useCallback(async () => {
    try {
      // Reset states
      setError(null);
      setInitializing(true);
      
      // Intenta cargar diagnósticos existentes primero
      if (diagnosticService.tests.length === 0) {
        console.log("Intentando cargar diagnósticos locales...");
        // Usar solo diagnósticos locales fallback
        setGeneratingDiagnostic(true);
        const fallbackCreated = await diagnosticService.createLocalFallbackDiagnostics();
        setGeneratingDiagnostic(false);
        
        if (fallbackCreated) {
          toast({
            title: "Diagnósticos básicos cargados",
            description: "Se han cargado diagnósticos básicos predefinidos.",
          });
        } else {
          // Si fallan los diagnósticos locales, intentar con el método por defecto
          const defaultDiagnosticsCreated = await diagnosticService.ensureDefaultDiagnosticsExist();
          
          if (!defaultDiagnosticsCreated) {
            setError("No se pudieron cargar diagnósticos. Por favor, reinicie la aplicación o contacte al administrador.");
          }
        }
      }
    } catch (error) {
      console.error("Error initializing diagnostics:", error);
      setError(error instanceof Error ? error.message : "Error al inicializar diagnósticos");
    } finally {
      setInitializing(false);
    }
  }, [diagnosticService]);

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
    retryCount
  };
};
