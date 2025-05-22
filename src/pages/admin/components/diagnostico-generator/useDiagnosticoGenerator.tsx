
import { useState, useEffect } from "react";
import { useDiagnosticGenerator } from "@/hooks/use-diagnostic-generator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useDiagnosticoGenerator = () => {
  const [selectedTestId, setSelectedTestId] = useState<number | undefined>(undefined);
  const [tests, setTests] = useState<{id: number, name: string}[]>([]);
  const [loadingTests, setLoadingTests] = useState(true);
  
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
        
        if (error) throw error;
        
        setTests(data || []);
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
    if (selectedTestId) {
      loadDiagnostics(selectedTestId);
    }
  }, [selectedTestId, loadDiagnostics]);
  
  // Manejar la creación de un nuevo diagnóstico
  const handleCreateDiagnostic = async (
    testId: number,
    title: string,
    description: string
  ) => {
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
    }
  };
  
  return {
    tests,
    diagnostics,
    loading,
    loadingTests,
    selectedTestId,
    setSelectedTestId,
    handleCreateDiagnostic
  };
};
