
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface RealInsight {
  id: string;
  type: 'improvement' | 'strength' | 'warning' | 'achievement';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  metric_value?: number;
}

export const useRealNeuralInsights = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<RealInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const generateRealInsights = async () => {
      try {
        setIsLoading(true);

        // Fetch real user data for insights
        const [progressData, attemptsData, diagnosticsData] = await Promise.all([
          supabase
            .from('user_node_progress')
            .select('*, learning_nodes(*)')
            .eq('user_id', user.id),
          
          supabase
            .from('user_exercise_attempts')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(50),
          
          supabase
            .from('user_diagnostic_results')
            .select('*')
            .eq('user_id', user.id)
            .order('completed_at', { ascending: false })
            .limit(5)
        ]);

        const userProgress = progressData.data || [];
        const recentAttempts = attemptsData.data || [];
        const diagnostics = diagnosticsData.data || [];

        const realInsights: RealInsight[] = [];

        // Generate insights based on real data
        
        // 1. Progress-based insights
        const completedNodes = userProgress.filter(p => p.status === 'completed');
        const inProgressNodes = userProgress.filter(p => p.status === 'in_progress');
        
        if (completedNodes.length > 5) {
          realInsights.push({
            id: 'progress-achievement',
            type: 'achievement',
            title: 'Excelente Progreso',
            description: `Has completado ${completedNodes.length} nodos de aprendizaje. ¡Sigue así!`,
            priority: 'high',
            actionable: false,
            metric_value: completedNodes.length
          });
        }

        if (inProgressNodes.length > 3) {
          realInsights.push({
            id: 'focus-recommendation',
            type: 'improvement',
            title: 'Enfoque Recomendado',
            description: `Tienes ${inProgressNodes.length} nodos en progreso. Considera enfocarte en completar algunos antes de comenzar nuevos.`,
            priority: 'medium',
            actionable: true
          });
        }

        // 2. Performance-based insights
        const recentCorrect = recentAttempts.filter(a => a.is_correct).length;
        const recentTotal = recentAttempts.length;
        
        if (recentTotal > 0) {
          const successRate = (recentCorrect / recentTotal) * 100;
          
          if (successRate > 80) {
            realInsights.push({
              id: 'high-performance',
              type: 'strength',
              title: 'Alto Rendimiento',
              description: `Tu tasa de éxito reciente es del ${Math.round(successRate)}%. ¡Excelente trabajo!`,
              priority: 'high',
              actionable: false,
              metric_value: Math.round(successRate)
            });
          } else if (successRate < 50) {
            realInsights.push({
              id: 'performance-concern',
              type: 'warning',
              title: 'Área de Mejora',
              description: `Tu tasa de éxito reciente es del ${Math.round(successRate)}%. Considera revisar los conceptos fundamentales.`,
              priority: 'high',
              actionable: true,
              metric_value: Math.round(successRate)
            });
          }
        }

        // 3. Diagnostic-based insights
        if (diagnostics.length > 0) {
          const latestDiagnostic = diagnostics[0];
          const overallScore = latestDiagnostic.results?.overall_score || 0;
          
          if (overallScore > 600) {
            realInsights.push({
              id: 'diagnostic-strength',
              type: 'strength',
              title: 'Buen Rendimiento Diagnóstico',
              description: `Tu último diagnóstico muestra un puntaje de ${overallScore}. Estás en buen camino.`,
              priority: 'medium',
              actionable: false,
              metric_value: overallScore
            });
          } else if (overallScore < 400) {
            realInsights.push({
              id: 'diagnostic-improvement',
              type: 'improvement',
              title: 'Oportunidad de Mejora',
              description: `Tu último diagnóstico indica áreas para reforzar. Puntaje actual: ${overallScore}.`,
              priority: 'high',
              actionable: true,
              metric_value: overallScore
            });
          }
        }

        // 4. Study pattern insights
        const recentActivity = userProgress.filter(p => {
          const lastActivity = new Date(p.last_activity_at);
          const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
          return lastActivity > threeDaysAgo;
        });

        if (recentActivity.length === 0) {
          realInsights.push({
            id: 'activity-reminder',
            type: 'warning',
            title: 'Retoma tu Estudio',
            description: 'No has tenido actividad reciente. La constancia es clave para el éxito.',
            priority: 'medium',
            actionable: true
          });
        } else if (recentActivity.length > 5) {
          realInsights.push({
            id: 'consistency-praise',
            type: 'achievement',
            title: 'Excelente Constancia',
            description: 'Has mantenido actividad constante en los últimos días. ¡Sigue así!',
            priority: 'medium',
            actionable: false
          });
        }

        // If no insights, add a default encouraging one
        if (realInsights.length === 0) {
          realInsights.push({
            id: 'welcome-message',
            type: 'improvement',
            title: 'Comienza tu Viaje',
            description: 'Inicia con algunos ejercicios de diagnóstico para generar insights personalizados.',
            priority: 'medium',
            actionable: true
          });
        }

        setInsights(realInsights);
      } catch (error) {
        console.error('Error generating real insights:', error);
        setInsights([]);
      } finally {
        setIsLoading(false);
      }
    };

    generateRealInsights();
  }, [user?.id]);

  return { insights, isLoading };
};
