
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DiagnosticResult } from "@/types/diagnostic";
import { fetchDiagnosticResults } from "@/services/diagnostic";
import { toast } from "@/components/ui/use-toast";

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
      setResults(fetchedResults);
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
