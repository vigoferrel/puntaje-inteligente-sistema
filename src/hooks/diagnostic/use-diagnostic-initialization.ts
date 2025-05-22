
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
  
  // Function to initialize diagnostics
  const initDiagnostics = async () => {
    try {
      // Reset states
      setError(null);
      setInitializing(true);
      
      // This will ensure at least one test exists
      if (diagnosticService.tests.length === 0) {
        setGeneratingDiagnostic(true);
        const success = await diagnosticService.ensureDefaultDiagnosticsExist();
        
        if (success) {
          toast({
            title: "Diagnóstico creado",
            description: "Se ha generado un diagnóstico inicial para ti",
          });
        } else {
          // Try the local fallback if online generation failed
          const fallbackCreated = await diagnosticService.createLocalFallbackDiagnostics();
          
          if (fallbackCreated) {
            toast({
              title: "Diagnóstico básico creado",
              description: "Se ha generado un diagnóstico básico. Algunas funciones pueden estar limitadas.",
            });
          } else {
            setError("No se pudieron crear diagnósticos. Por favor, intenta nuevamente más tarde.");
          }
        }
        setGeneratingDiagnostic(false);
      }
    } catch (error) {
      console.error("Error initializing diagnostics:", error);
      setError(error instanceof Error ? error.message : "Error al inicializar diagnósticos");
      toast({
        title: "Error",
        description: "No se pudieron cargar los diagnósticos iniciales",
        variant: "destructive"
      });
      setGeneratingDiagnostic(false);
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
