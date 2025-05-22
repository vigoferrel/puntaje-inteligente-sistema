
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ensureLearningNodesExist, initializePAESNodesOnly } from "@/services/learning/initialize-learning-service";
import { useAuth } from "@/contexts/AuthContext";

type DatabaseStatus = {
  learningNodes: 'loading' | 'empty' | 'populated' | 'error' | 'unknown';
  paesSkills: 'loading' | 'empty' | 'populated' | 'error' | 'unknown';
  paesTests: 'loading' | 'empty' | 'populated' | 'error' | 'unknown';
};

export const useDataInitialization = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingPAES, setIsLoadingPAES] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [detailedError, setDetailedError] = useState<string | null>(null);
  const [status, setStatus] = useState<DatabaseStatus>({
    learningNodes: 'unknown',
    paesSkills: 'unknown',
    paesTests: 'unknown',
  });
  const [paesContentStatus, setPaesContentStatus] = useState<'loading' | 'empty' | 'populated' | 'error' | 'unknown'>('unknown');

  const checkDatabaseStatus = useCallback(async () => {
    setIsLoading(true);
    setMessage(null);
    setError(null);
    setDetailedError(null);
    
    try {
      // Update status to loading
      setStatus(prev => ({
        learningNodes: 'loading',
        paesSkills: 'loading',
        paesTests: 'loading',
      }));
      setPaesContentStatus('loading');
      
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
        
      // Check PAES content (nodes with specific content types)
      const { count: paesContentCount, error: paesContentError } = await supabase
        .from('node_content')
        .select('*', { count: 'exact', head: true })
        .in('content_type', ['sistema_principal', 'prueba_principal', 'dimension', 'nodo_critico', 'eje', 'modulo', 'asignatura']);
        
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
      
      setPaesContentStatus(paesContentError
        ? 'error'
        : (paesContentCount && paesContentCount > 0)
          ? 'populated'
          : 'empty');
      
      setMessage("Estado de la base de datos verificado correctamente.");
      
      // Log counts for debugging
      console.log("DB Status Check Results:", {
        learningNodes: learningNodesCount,
        paesSkills: paesSkillsCount,
        paesTests: paesTestsCount,
        paesContent: paesContentCount
      });
    } catch (err: any) {
      console.error("Error checking database status:", err);
      setError("No se pudo verificar el estado de la base de datos.");
      setDetailedError(err.message || JSON.stringify(err));
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const initializeLearningNodes = useCallback(async () => {
    setIsLoading(true);
    setMessage(null);
    setError(null);
    setDetailedError(null);
    
    if (!user) {
      setError("Debes iniciar sesión para inicializar los nodos de aprendizaje.");
      toast({
        title: "Acceso denegado",
        description: "Debes iniciar sesión para inicializar los nodos de aprendizaje.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    try {
      await ensureLearningNodesExist();
      
      setMessage("Nodos de aprendizaje inicializados correctamente.");
      toast({
        title: "¡Éxito!",
        description: "Los nodos de aprendizaje se han inicializado correctamente.",
      });
      
      // Update status after successful initialization
      await checkDatabaseStatus();
    } catch (err: any) {
      console.error("Error initializing learning nodes:", err);
      
      let errorMessage: string;
      let detailedErr: string | null = null;
      
      // Extract error message and details for better diagnostics
      if (typeof err === 'object' && err !== null) {
        detailedErr = JSON.stringify(err, null, 2);
      }
      
      // Handle specific error types
      if (err.message?.includes('AUTH_REQUIRED')) {
        errorMessage = "Necesitas iniciar sesión para inicializar los nodos de aprendizaje.";
        toast({
          title: "Autenticación requerida",
          description: "Necesitas iniciar sesión para inicializar los nodos de aprendizaje.",
          variant: "destructive"
        });
      } else if (err.message?.includes('PERMISSION_DENIED')) {
        errorMessage = "No tienes permisos suficientes para inicializar los nodos de aprendizaje.";
        toast({
          title: "Permisos insuficientes",
          description: "No tienes permisos suficientes para inicializar los nodos de aprendizaje.",
          variant: "destructive"
        });
      } else if (err.message?.includes('DUPLICATE_KEY')) {
        errorMessage = "Los nodos de aprendizaje ya existen con esos identificadores.";
        toast({
          title: "Datos duplicados",
          description: "Los nodos de aprendizaje ya existen con esos identificadores.",
          variant: "destructive"
        });
      } else if (err.message?.includes('FOREIGN_KEY_VIOLATION')) {
        errorMessage = "Error de referencia en los datos. Verifica que las tablas de habilidades y pruebas estén inicializadas.";
        detailedErr = err.message; // Show the specific violation message
        toast({
          title: "Error de referencia",
          description: "Las tablas paes_skills y paes_tests deben estar inicializadas antes de cargar los nodos.",
          variant: "destructive"
        });
      } else if (err.message?.includes('VALIDATION_ERROR')) {
        errorMessage = "Error de validación en los datos.";
        detailedErr = err.message.replace('VALIDATION_ERROR: ', '');
        toast({
          title: "Error de validación",
          description: "Los datos no pasaron la validación previa a la inserción.",
          variant: "destructive"
        });
      } else if (err.message?.includes('MISSING_REFERENCE_DATA')) {
        errorMessage = "No se encontraron datos de referencia necesarios para crear los nodos.";
        toast({
          title: "Datos faltantes",
          description: "No se encontraron habilidades o pruebas en la base de datos.",
          variant: "destructive"
        });
      } else {
        errorMessage = `Error: ${err.message || "Ocurrió un error desconocido"}`;
        toast({
          title: "Error",
          description: "No se pudieron inicializar los nodos de aprendizaje.",
          variant: "destructive"
        });
      }
      
      setError(errorMessage);
      if (detailedErr) {
        setDetailedError(detailedErr);
      }
    } finally {
      setIsLoading(false);
    }
  }, [checkDatabaseStatus, user]);

  // New function for initializing PAES content
  const initializePAESContent = useCallback(async () => {
    setIsLoadingPAES(true);
    setMessage(null);
    setError(null);
    setDetailedError(null);
    
    if (!user) {
      setError("Debes iniciar sesión para inicializar el contenido PAES.");
      toast({
        title: "Acceso denegado",
        description: "Debes iniciar sesión para inicializar el contenido PAES.",
        variant: "destructive"
      });
      setIsLoadingPAES(false);
      return;
    }
    
    try {
      const result = await initializePAESNodesOnly();
      
      if (result.success > 0) {
        setMessage(`Contenido PAES inicializado correctamente. Se han creado ${result.success} nodos.`);
        toast({
          title: "¡Éxito!",
          description: `Se ha inicializado el contenido PAES correctamente (${result.success} nodos creados).`,
        });
      } else if (result.errors[0] === 'PAES nodes already exist') {
        setMessage("El contenido PAES ya estaba inicializado.");
        toast({
          title: "Información",
          description: "El contenido PAES ya estaba inicializado anteriormente.",
        });
      } else if (result.failed > 0) {
        throw new Error(result.errors.join(', '));
      }
      
      // Update status after attempting initialization
      await checkDatabaseStatus();
    } catch (err: any) {
      console.error("Error initializing PAES content:", err);
      
      let errorMessage: string;
      let detailedErr: string | null = null;
      
      if (typeof err === 'object' && err !== null) {
        detailedErr = JSON.stringify(err, null, 2);
      }
      
      if (err.message?.includes('AUTH_REQUIRED')) {
        errorMessage = "Necesitas iniciar sesión para inicializar el contenido PAES.";
        toast({
          title: "Autenticación requerida",
          description: "Necesitas iniciar sesión para inicializar el contenido PAES.",
          variant: "destructive"
        });
      } else if (err.message?.includes('Required data missing')) {
        errorMessage = "Primero debes inicializar los datos base (habilidades y pruebas).";
        toast({
          title: "Datos faltantes",
          description: "Primero debes inicializar los nodos base antes de cargar el contenido PAES.",
          variant: "destructive"
        });
      } else {
        errorMessage = `Error: ${err.message || "Ocurrió un error desconocido"}`;
        toast({
          title: "Error",
          description: "No se pudo inicializar el contenido PAES.",
          variant: "destructive"
        });
      }
      
      setError(errorMessage);
      if (detailedErr) {
        setDetailedError(detailedErr);
      }
    } finally {
      setIsLoadingPAES(false);
    }
  }, [checkDatabaseStatus, user]);

  // Check status on component mount
  useEffect(() => {
    checkDatabaseStatus();
  }, [checkDatabaseStatus]);
  
  return {
    initializeLearningNodes,
    initializePAESContent,
    checkDatabaseStatus,
    status,
    isLoading,
    isLoadingPAES,
    message,
    error,
    detailedError,
    paesContentStatus
  };
};
