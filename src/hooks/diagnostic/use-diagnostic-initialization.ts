
import { useState, useEffect } from "react";
import { useDiagnostic } from "@/hooks/use-diagnostic";
import { toast } from "@/components/ui/use-toast";

interface DiagnosticInitializationResult {
  initializing: boolean;
  generatingDiagnostic: boolean;
  error: string | null;
  retryInitialization: () => Promise<void>;
}

export const useDiagnosticInitialization = (): DiagnosticInitializationResult => {
  const [initializing, setInitializing] = useState(true);
  const [generatingDiagnostic, setGeneratingDiagnostic] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get diagnostic service
  const diagnosticService = useDiagnostic();
  
  // Modified function to initialize diagnostics WITHOUT automatic generation
  const initDiagnostics = async () => {
    try {
      // Reset states
      setError(null);
      setInitializing(true);
      
      // Instead of generating new diagnostics, just try to load existing ones
      if (diagnosticService.tests.length === 0) {
        // Use only local fallback diagnostics - no API calls
        const fallbackCreated = await diagnosticService.createLocalFallbackDiagnostics();
        
        if (fallbackCreated) {
          toast({
            title: "Diagnosticos básicos cargados",
            description: "Se han cargado diagnósticos básicos predefinidos.",
          });
        } else {
          setError("No se pudieron cargar diagnósticos. Por favor, contacte al administrador.");
        }
      }
    } catch (error) {
      console.error("Error initializing diagnostics:", error);
      setError(error instanceof Error ? error.message : "Error al inicializar diagnósticos");
    } finally {
      setInitializing(false);
    }
  };

  // Initialize data
  useEffect(() => {
    initDiagnostics();
  }, [diagnosticService]);

  // Function to retry initialization
  const retryInitialization = async () => {
    await initDiagnostics();
  };

  return {
    initializing,
    generatingDiagnostic,
    error,
    retryInitialization
  };
};
