
import { supabase } from "@/integrations/supabase/client";

// Cache simple en memoria para evitar regeneración constante
const planCache = new Map<string, any>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

interface CachedPlan {
  data: any;
  timestamp: number;
}

export const getCachedPlan = (userId: string) => {
  const cached = planCache.get(userId) as CachedPlan;
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    console.log('📦 Usando plan en cache');
    return cached.data;
  }
  return null;
};

export const setCachedPlan = (userId: string, plan: any) => {
  planCache.set(userId, {
    data: plan,
    timestamp: Date.now()
  });
  console.log('💾 Plan guardado en cache');
};

export const generateSimplePlan = async (userId: string) => {
  try {
    // Verificar cache primero
    const cached = getCachedPlan(userId);
    if (cached) return cached;

    console.log('🔄 Generando plan simple para:', userId);
    
    // Plan estático simple para evitar consultas complejas
    const simplePlan = {
      id: `simple-plan-${userId}`,
      title: "Plan de Estudio PAES",
      description: "Plan personalizado de preparación",
      nodes: [
        { id: '1', title: 'Competencia Lectora', completed: false },
        { id: '2', title: 'Matemática M1', completed: false },
        { id: '3', title: 'Historia', completed: false }
      ],
      progress: {
        completed: 0,
        total: 3,
        percentage: 0
      },
      createdAt: new Date().toISOString()
    };

    // Guardar en cache
    setCachedPlan(userId, simplePlan);
    
    return simplePlan;
  } catch (error) {
    console.error('Error generando plan simple:', error);
    return null;
  }
};
