
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ensureLearningNodesExist } from "@/services/learning/initialize-learning-service";

type DatabaseStatus = {
  learningNodes: 'loading' | 'empty' | 'populated' | 'error' | 'unknown';
  paesSkills: 'loading' | 'empty' | 'populated' | 'error' | 'unknown';
  paesTests: 'loading' | 'empty' | 'populated' | 'error' | 'unknown';
};

export const useDataInitialization = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<DatabaseStatus>({
    learningNodes: 'unknown',
    paesSkills: 'unknown',
    paesTests: 'unknown',
  });

  const checkDatabaseStatus = useCallback(async () => {
    setIsLoading(true);
    setMessage(null);
    setError(null);
    
    try {
      // Update status to loading
      setStatus(prev => ({
        learningNodes: 'loading',
        paesSkills: 'loading',
        paesTests: 'loading',
      }));
      
      // Check learning nodes
      const { count: learningNodesCount, error: learningNodesError } = await supabase
        .from('learning_nodes')
        .select('*', { count: 'exact', head: true });
        
      // Check PAES skills
      const { count: paesSkillsCount, error: paesSkillsError } = await supabase
        .from('paes_skills')
        .select('*', { count: 'exact', head: true });
        
      // Check PAES tests
      const { count: paesTestsCount, error: paesTestsError } = await supabase
        .from('paes_tests')
        .select('*', { count: 'exact', head: true });
        
      // Update status based on results
      setStatus({
        learningNodes: learningNodesError 
          ? 'error' 
          : (learningNodesCount && learningNodesCount > 0) 
            ? 'populated' 
            : 'empty',
        paesSkills: paesSkillsError 
          ? 'error' 
          : (paesSkillsCount && paesSkillsCount > 0) 
            ? 'populated' 
            : 'empty',
        paesTests: paesTestsError 
          ? 'error' 
          : (paesTestsCount && paesTestsCount > 0) 
            ? 'populated' 
            : 'empty',
      });
      
      setMessage("Estado de la base de datos verificado correctamente.");
    } catch (err) {
      console.error("Error checking database status:", err);
      setError("No se pudo verificar el estado de la base de datos.");
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const initializeLearningNodes = useCallback(async () => {
    setIsLoading(true);
    setMessage(null);
    setError(null);
    
    try {
      // First check if there's an admin policy for learning_nodes
      // This is needed because we're seeing RLS errors in the logs
      const { data: policies, error: policiesError } = await supabase
        .rpc('get_policies_for_table', { table_name: 'learning_nodes' });
        
      if (policiesError) {
        console.error("Error checking policies:", policiesError);
      }
      
      // Try to create learning nodes
      const success = await ensureLearningNodesExist();
      
      if (success) {
        setMessage("Nodos de aprendizaje inicializados correctamente.");
        toast({
          title: "¡Éxito!",
          description: "Los nodos de aprendizaje se han inicializado correctamente.",
        });
        
        // Update status after successful initialization
        await checkDatabaseStatus();
      } else {
        setError("No se pudieron inicializar los nodos de aprendizaje. Revisar los permisos de la base de datos.");
        toast({
          title: "Error",
          description: "No se pudieron inicializar los nodos de aprendizaje.",
          variant: "destructive"
        });
      }
    } catch (err: any) {
      console.error("Error initializing learning nodes:", err);
      setError(`Error: ${err.message || "Ocurrió un error desconocido"}`);
      toast({
        title: "Error",
        description: "No se pudieron inicializar los nodos de aprendizaje.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [checkDatabaseStatus]);

  // Check status on component mount
  useEffect(() => {
    checkDatabaseStatus();
  }, [checkDatabaseStatus]);

  return {
    initializeLearningNodes,
    checkDatabaseStatus,
    status,
    isLoading,
    message,
    error
  };
};
