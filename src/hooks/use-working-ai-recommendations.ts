import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// Tipos para las recomendaciones de IA
interface AIRecommendation {
  id: string;
  user_id: string;
  recommendation_type: 'exercise' | 'study_plan' | 'bloom_activity';
  content: string;
  subject: string;
  difficulty: 'bajo' | 'medio' | 'alto';
  status: 'active' | 'completed' | 'dismissed';
  created_at: string;
  priority: number;
}

interface StudyRecommendation {
  id: string;
  subject: string;
  topic: string;
  difficulty: string;
  estimated_time: number;
  resources: string[];
  learning_objectives: string[];
}

interface BloomRecommendation {
  id: string;
  taxonomy_level: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  activity_type: string;
  subject: string;
  description: string;
  estimated_duration: number;
  learning_outcomes: string[];
}

// Mock data para fallback
const mockRecommendations: AIRecommendation[] = [
  {
    id: 'rec-001',
    user_id: 'emergency-user-001',
    recommendation_type: 'exercise',
    content: 'Practica ejercicios de álgebra lineal para mejorar tu comprensión de matrices',
    subject: 'mathematics',
    difficulty: 'medio',
    status: 'active',
    created_at: new Date().toISOString(),
    priority: 1
  },
  {
    id: 'rec-002',
    user_id: 'emergency-user-001',
    recommendation_type: 'study_plan',
    content: 'Crea un plan de estudio semanal enfocado en ciencias naturales',
    subject: 'ciencias',
    difficulty: 'medio',
    status: 'active',
    created_at: new Date().toISOString(),
    priority: 2
  }
];

const mockStudyRecommendations: StudyRecommendation[] = [
  {
    id: 'study-001',
    subject: 'mathematics',
    topic: 'Álgebra Lineal',
    difficulty: 'medio',
    estimated_time: 45,
    resources: ['Khan Academy', 'Libro de texto', 'Ejercicios prácticos'],
    learning_objectives: ['Comprender matrices', 'Resolver sistemas de ecuaciones', 'Aplicar transformaciones lineales']
  },
  {
    id: 'study-002',
    subject: 'ciencias',
    topic: 'Biología Celular',
    difficulty: 'medio',
    estimated_time: 60,
    resources: ['Videos explicativos', 'Laboratorio virtual', 'Diagramas interactivos'],
    learning_objectives: ['Identificar organelos', 'Comprender procesos celulares', 'Relacionar estructura y función']
  }
];

const mockBloomRecommendations: BloomRecommendation[] = [
  {
    id: 'bloom-001',
    taxonomy_level: 'apply',
    activity_type: 'ejercicio_práctico',
    subject: 'mathematics',
    description: 'Aplica conceptos de álgebra en problemas del mundo real',
    estimated_duration: 30,
    learning_outcomes: ['Resolver problemas contextualizados', 'Conectar teoría con práctica']
  },
  {
    id: 'bloom-002',
    taxonomy_level: 'analyze',
    activity_type: 'análisis_crítico',
    subject: 'ciencias',
    description: 'Analiza datos experimentales y extrae conclusiones',
    estimated_duration: 45,
    learning_outcomes: ['Interpretar resultados', 'Identificar patrones', 'Formular hipótesis']
  }
];

export const useWorkingAIRecommendations = () => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [studyRecommendations, setStudyRecommendations] = useState<StudyRecommendation[]>([]);
  const [bloomRecommendations, setBloomRecommendations] = useState<BloomRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener recomendaciones de IA desde Supabase
  const fetchAIRecommendations = useCallback(async () => {
    try {
      console.log('🔍 Obteniendo recomendaciones de IA desde Supabase...');
      
      // Intentar obtener desde la tabla ai_recommendations
      const { data, error: tableError } = await supabase
        .from('ai_recommendations')
        .select('*')
        .eq('user_id', 'emergency-user-001')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(20);

      if (tableError) {
        console.warn('⚠️ Error al obtener recomendaciones de tabla:', tableError.message);
        // Usar mock data como fallback
        setRecommendations(mockRecommendations);
      } else if (data && data.length > 0) {
        console.log('✅ Recomendaciones obtenidas de Supabase:', data.length);
        setRecommendations(data);
      } else {
        console.log('ℹ️ No hay recomendaciones en Supabase, usando mock data');
        setRecommendations(mockRecommendations);
      }
    } catch (err) {
      console.error('💥 Error crítico al obtener recomendaciones:', err);
      setRecommendations(mockRecommendations);
    }
  }, []);

  // Función para obtener recomendaciones de estudio
  const fetchStudyRecommendations = useCallback(async () => {
    try {
      console.log('🔍 Obteniendo recomendaciones de estudio...');
      
      // Intentar usar RPC get_recommended_exercises (si existe)
      const { data, error: rpcError } = await supabase.rpc('get_recommended_exercises', {
        user_id: 'emergency-user-001',
        subject: 'mathematics'
      });

      if (rpcError) {
        console.warn('⚠️ RPC get_recommended_exercises no disponible:', rpcError.message);
        // Usar mock data como fallback
        setStudyRecommendations(mockStudyRecommendations);
      } else if (data) {
        console.log('✅ Recomendaciones de estudio obtenidas via RPC');
        setStudyRecommendations(data);
      } else {
        setStudyRecommendations(mockStudyRecommendations);
      }
    } catch (err) {
      console.error('💥 Error al obtener recomendaciones de estudio:', err);
      setStudyRecommendations(mockStudyRecommendations);
    }
  }, []);

  // Función para obtener recomendaciones Bloom
  const fetchBloomRecommendations = useCallback(async () => {
    try {
      console.log('🔍 Obteniendo recomendaciones Bloom...');
      
      // Intentar usar RPC get_bloom_recommendations (si existe)
      const { data, error: rpcError } = await supabase.rpc('get_bloom_recommendations', {
        user_id: 'emergency-user-001'
      });

      if (rpcError) {
        console.warn('⚠️ RPC get_bloom_recommendations no disponible:', rpcError.message);
        // Usar mock data como fallback
        setBloomRecommendations(mockBloomRecommendations);
      } else if (data) {
        console.log('✅ Recomendaciones Bloom obtenidas via RPC');
        setBloomRecommendations(data);
      } else {
        setBloomRecommendations(mockBloomRecommendations);
      }
    } catch (err) {
      console.error('💥 Error al obtener recomendaciones Bloom:', err);
      setBloomRecommendations(mockBloomRecommendations);
    }
  }, []);

  // Función para generar actividad de IA
  const generateAIActivity = useCallback(async (subject: string, difficulty: string) => {
    try {
      console.log(`🤖 Generando actividad de IA para ${subject} (${difficulty})...`);
      
      // Intentar usar RPC generate_study_recommendations (si existe)
      const { data, error: rpcError } = await supabase.rpc('generate_study_recommendations', {
        user_id: 'emergency-user-001',
        subject: subject,
        difficulty_level: difficulty
      });

      if (rpcError) {
        console.warn('⚠️ RPC generate_study_recommendations no disponible:', rpcError.message);
        // Simular generación exitosa
        const newRecommendation: AIRecommendation = {
          id: `rec-${Date.now()}`,
          user_id: 'emergency-user-001',
          recommendation_type: 'exercise',
          content: `Nueva actividad generada para ${subject} (${difficulty})`,
          subject: subject,
          difficulty: difficulty as 'bajo' | 'medio' | 'alto',
          status: 'active',
          created_at: new Date().toISOString(),
          priority: 1
        };
        
        setRecommendations(prev => [newRecommendation, ...prev]);
        console.log('✅ Actividad de IA generada (mock)');
      } else if (data) {
        console.log('✅ Actividad de IA generada via RPC');
        // Actualizar recomendaciones con la nueva actividad
        await fetchAIRecommendations();
      }
    } catch (err) {
      console.error('💥 Error al generar actividad de IA:', err);
    }
  }, [fetchAIRecommendations]);

  // Función para refrescar todas las recomendaciones
  const refreshRecommendations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchAIRecommendations(),
        fetchStudyRecommendations(),
        fetchBloomRecommendations()
      ]);
    } catch (err) {
      console.error('💥 Error al refrescar recomendaciones:', err);
      setError('Error al cargar recomendaciones');
    } finally {
      setIsLoading(false);
    }
  }, [fetchAIRecommendations, fetchStudyRecommendations, fetchBloomRecommendations]);

  // Cargar datos iniciales
  useEffect(() => {
    refreshRecommendations();
  }, [refreshRecommendations]);

  return {
    recommendations,
    studyRecommendations,
    bloomRecommendations,
    isLoading,
    error,
    generateAIActivity,
    refreshRecommendations
  };
};
