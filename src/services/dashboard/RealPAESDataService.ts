
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/core/logging/SystemLogger';

interface PAESEvaluationStats {
  lastScore: number;
  targetScore: number;
  improvement: number;
  testsCompleted: number;
  nextTest: string;
  readinessLevel: number;
}

interface SubjectScore {
  subject: string;
  current: number;
  target: number;
  progress: number;
}

interface UpcomingTest {
  date: string;
  type: string;
  duration: string;
  status: string;
}

export class RealPAESDataService {
  static async getEvaluationStats(userId: string): Promise<PAESEvaluationStats> {
    try {
      // Obtener resultados de diagnósticos
      const { data: diagnosticResults, error: diagnosticError } = await supabase
        .from('user_diagnostic_results')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (diagnosticError) throw diagnosticError;

      // Obtener metas del usuario
      const { data: goals, error: goalsError } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .limit(1)
        .single();

      if (goalsError && goalsError.code !== 'PGRST116') throw goalsError;

      // Calcular puntaje promedio del último diagnóstico
      let lastScore = 450; // Puntaje base PAES
      let improvement = 0;

      if (diagnosticResults && diagnosticResults.length > 0) {
        const latestResult = diagnosticResults[0];
        if (latestResult.results && typeof latestResult.results === 'object') {
          const scores = Object.values(latestResult.results) as number[];
          lastScore = Math.round(scores.reduce((acc, score) => acc + score, 0) / scores.length);
        }

        // Calcular mejora comparando con el primer diagnóstico
        if (diagnosticResults.length > 1) {
          const firstResult = diagnosticResults[diagnosticResults.length - 1];
          if (firstResult.results && typeof firstResult.results === 'object') {
            const firstScores = Object.values(firstResult.results) as number[];
            const firstAvg = Math.round(firstScores.reduce((acc, score) => acc + score, 0) / firstScores.length);
            improvement = lastScore - firstAvg;
          }
        }
      }

      const targetScore = goals?.target_score_cl || 700;
      const testsCompleted = diagnosticResults?.length || 0;
      
      // Calcular nivel de preparación basado en progreso hacia la meta
      const readinessLevel = Math.min(100, Math.max(0, 
        ((lastScore - 150) / (targetScore - 150)) * 100
      ));

      // Obtener próximo evento de evaluación
      const { data: nextEvent, error: eventError } = await supabase
        .from('calendar_events')
        .select('start_date')
        .eq('user_id', userId)
        .eq('event_type', 'evaluacion')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(1)
        .single();

      let nextTest = "Sin programar";
      if (!eventError && nextEvent) {
        const eventDate = new Date(nextEvent.start_date);
        const daysUntil = Math.ceil((eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        nextTest = `${daysUntil} días`;
      }

      return {
        lastScore,
        targetScore,
        improvement,
        testsCompleted,
        nextTest,
        readinessLevel: Math.round(readinessLevel)
      };
    } catch (error) {
      logger.error('RealPAESDataService', 'Error fetching evaluation stats', error);
      return {
        lastScore: 450,
        targetScore: 700,
        improvement: 0,
        testsCompleted: 0,
        nextTest: "Sin programar",
        readinessLevel: 0
      };
    }
  }

  static async getSubjectScores(userId: string): Promise<SubjectScore[]> {
    try {
      // Obtener último resultado diagnóstico
      const { data: latestResult, error } = await supabase
        .from('user_diagnostic_results')
        .select('results')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;

      // Obtener metas por materia
      const { data: goals, error: goalsError } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .limit(1)
        .single();

      if (goalsError && goalsError.code !== 'PGRST116') throw goalsError;

      const subjects = [
        { 
          key: 'COMPETENCIA_LECTORA', 
          name: 'Comprensión Lectora',
          targetKey: 'target_score_cl'
        },
        { 
          key: 'MATEMATICA_1', 
          name: 'Matemática M1',
          targetKey: 'target_score_m1'
        },
        { 
          key: 'MATEMATICA_2', 
          name: 'Matemática M2',
          targetKey: 'target_score_m2'
        },
        { 
          key: 'CIENCIAS', 
          name: 'Ciencias',
          targetKey: 'target_score_cs'
        },
        { 
          key: 'HISTORIA', 
          name: 'Historia',
          targetKey: 'target_score_hcs'
        }
      ];

      return subjects.map(subject => {
        const current = latestResult?.results?.[subject.key] || 450;
        const target = goals?.[subject.targetKey] || 700;
        const progress = Math.round(((current - 150) / (target - 150)) * 100);

        return {
          subject: subject.name,
          current,
          target,
          progress: Math.max(0, Math.min(100, progress))
        };
      });
    } catch (error) {
      logger.error('RealPAESDataService', 'Error fetching subject scores', error);
      return [
        { subject: "Comprensión Lectora", current: 450, target: 700, progress: 0 },
        { subject: "Matemática M1", current: 450, target: 700, progress: 0 },
        { subject: "Matemática M2", current: 450, target: 700, progress: 0 },
        { subject: "Ciencias", current: 450, target: 700, progress: 0 },
        { subject: "Historia", current: 450, target: 700, progress: 0 }
      ];
    }
  }

  static async getUpcomingTests(userId: string): Promise<UpcomingTest[]> {
    try {
      const { data: events, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', userId)
        .in('event_type', ['evaluacion', 'diagnostico', 'simulacro'])
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(5);

      if (error) throw error;

      return events?.map(event => ({
        date: event.start_date.split('T')[0],
        type: this.formatEventType(event.event_type),
        duration: this.calculateDuration(event.start_date, event.end_date),
        status: this.getEventStatus(event.start_date)
      })) || [];
    } catch (error) {
      logger.error('RealPAESDataService', 'Error fetching upcoming tests', error);
      return [];
    }
  }

  private static formatEventType(eventType: string): string {
    const typeMap: { [key: string]: string } = {
      'evaluacion': 'Evaluación PAES',
      'diagnostico': 'Diagnóstico Integral',
      'simulacro': 'Simulacro PAES'
    };
    return typeMap[eventType] || 'Evaluación';
  }

  private static calculateDuration(startDate: string, endDate: string | null): string {
    if (!endDate) return '2 horas';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffHours = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    
    return `${diffHours} horas`;
  }

  private static getEventStatus(startDate: string): string {
    const eventDate = new Date(startDate);
    const now = new Date();
    const hoursUntil = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntil < 24) return 'scheduled';
    if (hoursUntil < 72) return 'available';
    return 'pending';
  }
}
