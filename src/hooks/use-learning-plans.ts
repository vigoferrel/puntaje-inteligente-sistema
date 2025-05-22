
import { useState, useEffect, useCallback } from "react";
import { LearningPlan, PlanProgress } from "@/types/learning-plan";
import { TPAESHabilidad } from "@/types/system-types";
import { 
  fetchLearningPlans as fetchPlans,
  createLearningPlan as createPlan,
  updatePlanProgress as updateProgress
} from "@/services/plan-service";
import { ensureUserHasLearningPlan } from "@/services/learning/plan-generator-service";
import { toast } from "@/components/ui/use-toast";

export { type LearningPlan, type LearningPlanNode } from "@/types/learning-plan";

// Clave para almacenamiento en sessionStorage
const CACHE_KEYS = {
  PLANS: 'cached_learning_plans',
  CURRENT_PLAN: 'cached_current_plan',
  PLAN_PROGRESS: 'cached_plan_progress',
  CACHE_TIMESTAMP: 'cached_plans_timestamp',
};

// Tiempo de expiración de la caché en milisegundos (5 minutos)
const CACHE_EXPIRY_TIME = 5 * 60 * 1000;

export const useLearningPlans = () => {
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<LearningPlan | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [planProgress, setPlanProgress] = useState<Record<string, PlanProgress>>({});
  
  // Cargar datos desde la caché al inicializar
  useEffect(() => {
    const loadFromCache = () => {
      try {
        // Verificar si la caché está vigente
        const timestamp = sessionStorage.getItem(CACHE_KEYS.CACHE_TIMESTAMP);
        if (!timestamp || Date.now() - Number(timestamp) > CACHE_EXPIRY_TIME) {
          return;
        }
        
        // Cargar planes
        const cachedPlans = sessionStorage.getItem(CACHE_KEYS.PLANS);
        if (cachedPlans) {
          const parsedPlans = JSON.parse(cachedPlans) as LearningPlan[];
          setPlans(parsedPlans);
        }
        
        // Cargar plan actual
        const cachedCurrentPlan = sessionStorage.getItem(CACHE_KEYS.CURRENT_PLAN);
        if (cachedCurrentPlan) {
          setCurrentPlan(JSON.parse(cachedCurrentPlan));
        }
        
        // Cargar progreso de planes
        const cachedProgress = sessionStorage.getItem(CACHE_KEYS.PLAN_PROGRESS);
        if (cachedProgress) {
          setPlanProgress(JSON.parse(cachedProgress));
        }
      } catch (error) {
        console.error('Error loading data from cache:', error);
        // Si hay un error al cargar la caché, limpiamos para evitar problemas
        clearCache();
      }
    };
    
    loadFromCache();
  }, []);
  
  // Guardar datos en la caché
  const updateCache = useCallback(() => {
    try {
      sessionStorage.setItem(CACHE_KEYS.PLANS, JSON.stringify(plans));
      if (currentPlan) {
        sessionStorage.setItem(CACHE_KEYS.CURRENT_PLAN, JSON.stringify(currentPlan));
      }
      sessionStorage.setItem(CACHE_KEYS.PLAN_PROGRESS, JSON.stringify(planProgress));
      sessionStorage.setItem(CACHE_KEYS.CACHE_TIMESTAMP, Date.now().toString());
    } catch (error) {
      console.error('Error updating cache:', error);
    }
  }, [plans, currentPlan, planProgress]);
  
  // Actualizar la caché cuando cambian los datos
  useEffect(() => {
    if (plans.length > 0) {
      updateCache();
    }
  }, [plans, currentPlan, planProgress, updateCache]);
  
  // Limpiar caché
  const clearCache = useCallback(() => {
    Object.values(CACHE_KEYS).forEach(key => sessionStorage.removeItem(key));
  }, []);
  
  /**
   * Fetches all learning plans for a user with improved error handling and retry logic
   */
  const fetchLearningPlans = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const startTime = performance.now();
      console.log('Iniciando carga de planes de estudio...');
      
      // Ejecutar las operaciones en paralelo para optimizar
      const initPromise = ensureUserHasLearningPlan(userId);
      const plansPromise = fetchPlans(userId);
      
      // Esperar a que se completen las operaciones en paralelo
      const [plansWithNodes] = await Promise.all([
        plansPromise,
        initPromise
      ]);
      
      if (plansWithNodes.length > 0) {
        setPlans(plansWithNodes);
        
        // Set current plan to the most recently created one
        const mostRecent = plansWithNodes.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];
        setCurrentPlan(mostRecent);
        
        const endTime = performance.now();
        console.log(`Planes cargados exitosamente en ${(endTime - startTime).toFixed(2)}ms`);
      } else {
        // Si no hay planes después de asegurar, hay un problema
        console.warn("No se encontraron planes después de ensureUserHasLearningPlan");
        
        // Si hay datos en caché, los mantenemos para mostrar algo al usuario
        if (plans.length === 0) {
          clearCache(); // Solo limpiamos la caché si realmente no hay planes
        }
      }
      
      return plansWithNodes;
    } catch (error) {
      console.error('Error fetching learning plans:', error);
      setError("No se pudieron cargar los planes de aprendizaje. Por favor, intente de nuevo.");
      
      // No mostramos toast si ya tenemos datos en caché
      if (plans.length === 0) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los planes de aprendizaje",
          variant: "destructive"
        });
      }
      
      // Si hay un error pero tenemos datos en caché, los conservamos
      return plans;
    } finally {
      setLoading(false);
    }
  }, [plans, clearCache]);

  /**
   * Retry fetching plans on error with exponential backoff
   */
  const retryFetchPlans = useCallback((userId: string) => {
    setRetryCount(prev => {
      const newCount = prev + 1;
      const delay = Math.min(2 ** newCount * 500, 5000); // Exponential backoff capped at 5 seconds
      
      console.log(`Reintentando carga de planes (intento ${newCount}) en ${delay}ms`);
      
      setTimeout(() => {
        fetchLearningPlans(userId);
      }, delay);
      
      return newCount;
    });
  }, [fetchLearningPlans]);

  /**
   * Creates a new learning plan for a user
   */
  const createLearningPlan = async (
    userId: string,
    title: string,
    description?: string,
    targetDate?: string,
    skillPriorities?: Record<TPAESHabilidad, number>
  ) => {
    try {
      setLoading(true);
      setError(null);
      const newPlan = await createPlan(userId, title, description, targetDate, skillPriorities);
      
      if (newPlan) {
        // Update state
        setPlans(prev => [...prev, newPlan]);
        setCurrentPlan(newPlan);
        // Limpiar el progreso para este plan
        setPlanProgress(prev => ({
          ...prev,
          [newPlan.id]: {
            totalNodes: newPlan.nodes.length,
            completedNodes: 0,
            inProgressNodes: 0,
            overallProgress: 0,
            nodeProgress: {}
          }
        }));
        return newPlan;
      } else {
        throw new Error("No se pudo crear el plan de aprendizaje");
      }
    } catch (error) {
      console.error('Error creating learning plan:', error);
      setError("No se pudo crear el plan de aprendizaje. Por favor, intente de nuevo.");
      toast({
        title: "Error",
        description: "No se pudo crear el plan de aprendizaje",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates progress for a learning plan with improved caching
   */
  const updatePlanProgress = async (userId: string, planId: string): Promise<PlanProgress | false> => {
    try {
      console.log(`Actualizando progreso para plan ${planId}`);
      
      // Primero verificamos si tenemos datos en caché
      if (planProgress[planId]) {
        console.log('Usando datos de progreso en caché mientras se actualiza');
      }
      
      const progress = await updateProgress(userId, planId);
      if (!progress) {
        throw new Error("No se pudo actualizar el progreso del plan");
      }
      
      // Actualizar el estado con el nuevo progreso
      setPlanProgress(prev => ({
        ...prev,
        [planId]: progress
      }));
      
      return progress;
    } catch (error) {
      console.error('Error updating plan progress:', error);
      // Si hay datos en caché, los devolvemos en caso de error
      if (planProgress[planId]) {
        console.log('Devolviendo datos de progreso en caché debido al error');
        return planProgress[planId];
      }
      
      toast({
        title: "Error",
        description: "No se pudo actualizar el progreso del plan",
        variant: "destructive"
      });
      
      return false;
    }
  };

  /**
   * Carga el progreso de un plan específico
   */
  const loadPlanProgress = useCallback(async (userId: string, planId: string): Promise<PlanProgress | false> => {
    if (!userId || !planId) return false;
    
    try {
      // Verificar si ya tenemos el progreso en caché
      const cachedProgress = getPlanProgress(planId);
      if (cachedProgress) {
        console.log('Usando progreso en caché mientras se actualiza');
      }
      
      return await updatePlanProgress(userId, planId);
    } catch (error) {
      console.error("Error loading plan progress:", error);
      return false;
    }
  }, [updatePlanProgress]);

  /**
   * Gets a plan by ID
   */
  const getPlanById = (planId: string): LearningPlan | undefined => {
    return plans.find(plan => plan.id === planId);
  };
  
  /**
   * Gets progress for a plan
   */
  const getPlanProgress = (planId: string): PlanProgress | null => {
    return planProgress[planId] || null;
  };

  return {
    plans,
    loading,
    error,
    currentPlan,
    retryCount,
    fetchLearningPlans,
    retryFetchPlans,
    createLearningPlan,
    updatePlanProgress,
    loadPlanProgress,
    setCurrentPlan,
    getPlanById,
    getPlanProgress,
    clearCache
  };
};
