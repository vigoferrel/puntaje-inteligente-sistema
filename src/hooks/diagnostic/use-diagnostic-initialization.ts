
import { useState, useEffect } from "react";
import { useDiagnostic } from "@/hooks/use-diagnostic";
import { toast } from "@/components/ui/use-toast";

interface DiagnosticInitializationResult {
  initializing: boolean;
  generatingDiagnostic: boolean;
}

export const useDiagnosticInitialization = (): DiagnosticInitializationResult => {
  const [initializing, setInitializing] = useState(true);
  const [generatingDiagnostic, setGeneratingDiagnostic] = useState(false);
  
  // Get diagnostic service
  const diagnosticService = useDiagnostic();
  
  // Initialize data
  useEffect(() => {
    const initDiagnostics = async () => {
      try {
        // This will ensure at least one test exists
        setInitializing(true);
        
        // Generate a test if none exist
        if (diagnosticService.tests.length === 0) {
          setGeneratingDiagnostic(true);
          const success = await diagnosticService.ensureDefaultDiagnosticsExist();
          
          if (success) {
            toast({
              title: "Diagnóstico creado",
              description: "Se ha generado un diagnóstico inicial para ti",
            });
          }
          setGeneratingDiagnostic(false);
        }
      } catch (error) {
        console.error("Error initializing diagnostics:", error);
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
    
    initDiagnostics();
  }, [diagnosticService]);

  return {
    initializing,
    generatingDiagnostic
  };
};
