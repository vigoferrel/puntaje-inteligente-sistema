
import { useState, useEffect } from "react";
import { useDiagnosticGenerator } from "@/hooks/use-diagnostic-generator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useDiagnosticoGenerator = () => {
  const [selectedTestId, setSelectedTestId] = useState<number | undefined>(undefined);
  const [tests, setTests] = useState<{id: number, name: string}[]>([]);
  const [loadingTests, setLoadingTests] = useState(true);
  const [lastError, setLastError] = useState<string | null>(null);
  
  const { 
    loading, 
    diagnostics, 
    generateFullDiagnostic, 
    loadDiagnostics 
  } = useDiagnosticGenerator();
  
  // Cargar los tests disponibles
  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoadingTests(true);
        
        const { data, error } = await supabase
          .from('paes_tests')
          .select('id, name');
        
        if (error) {
          setLastError(`Error al cargar tests: ${error.message}`);
          throw error;
        }
        
        setTests(data || []);
        setLastError(null);
      } catch (error) {
        console.error('Error al cargar tests:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los tests disponibles",
          variant: "destructive"
        });
      } finally {
        setLoadingTests(false);
      }
    };
    
    fetchTests();
  }, []);
  
  // Cargar diagnósticos cuando cambie el test seleccionado
  useEffect(() => {
    const fetchDiagnostics = async () => {
      if (selectedTestId) {
        try {
          await loadDiagnostics(selectedTestId);
        } catch (error) {
          console.error('Error al cargar diagnósticos:', error);
          setLastError(`Error al cargar diagnósticos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
      }
    };
    
    fetchDiagnostics();
  }, [selectedTestId, loadDiagnostics]);
  
  // Manejar la creación de un nuevo diagnóstico con mejor feedback
  const handleCreateDiagnostic = async (
    testId: number,
    title: string,
    description: string
  ) => {
    setLastError(null);
    
    try {
      const diagnosticId = await generateFullDiagnostic(
        testId,
        title || undefined,
        description || undefined
      );
      
      if (diagnosticId) {
        toast({
          title: "Éxito",
          description: "Diagnóstico creado correctamente",
        });
        return diagnosticId;
      } else {
        setLastError("No se pudo crear el diagnóstico (ID no recibido)");
        return null;
      }
    } catch (error) {
      console.error('Error en handleCreateDiagnostic:', error);
      setLastError(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      
      toast({
        title: "Error",
        description: "No se pudo crear el diagnóstico",
        variant: "destructive"
      });
      
      return null;
    }
  };
  
  return {
    tests,
    diagnostics,
    loading,
    loadingTests,
    selectedTestId,
    setSelectedTestId,
    handleCreateDiagnostic,
    lastError
  };
};
