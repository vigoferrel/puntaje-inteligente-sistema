
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DiagnosticResult } from "@/types/diagnostic";
import { fetchDiagnosticResults } from "@/services/diagnostic";
import { toast } from "@/components/ui/use-toast";
import { TPAESHabilidad } from "@/types/system-types";

export const useDiagnosticHistory = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useAuth();
  
  const fetchResults = async () => {
    if (!profile?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      const fetchedResults = await fetchDiagnosticResults(profile.id);
      
      // Validar que los resultados tengan la estructura correcta
      const validatedResults = fetchedResults.map(result => {
        // Asegurarse de que result.results contenga todas las habilidades
        const defaultSkills: Record<TPAESHabilidad, number> = {
          SOLVE_PROBLEMS: 0,
          REPRESENT: 0,
          MODEL: 0,
          INTERPRET_RELATE: 0,
          EVALUATE_REFLECT: 0,
          TRACK_LOCATE: 0,
          ARGUE_COMMUNICATE: 0,
          IDENTIFY_THEORIES: 0,
          PROCESS_ANALYZE: 0,
          APPLY_PRINCIPLES: 0,
          SCIENTIFIC_ARGUMENT: 0,
          TEMPORAL_THINKING: 0,
          SOURCE_ANALYSIS: 0,
          MULTICAUSAL_ANALYSIS: 0,
          CRITICAL_THINKING: 0,
          REFLECTION: 0
        };
        
        // Combinar con los resultados existentes
        return {
          ...result,
          results: { ...defaultSkills, ...result.results }
        };
      });
      
      setResults(validatedResults);
    } catch (err) {
      console.error("Error fetching diagnostic history:", err);
      setError("No se pudieron cargar los resultados de diagnósticos anteriores");
      toast({
        title: "Error",
        description: "No se pudieron cargar los resultados de diagnósticos anteriores",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (profile?.id) {
      fetchResults();
    }
  }, [profile?.id]);
  
  const refreshResults = () => {
    fetchResults();
  };
  
  return {
    results,
    loading,
    error,
    refreshResults
  };
};
