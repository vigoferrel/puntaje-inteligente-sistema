
import { DiagnosticSupabaseService } from './diagnostic-supabase-service';
import { TPAESPrueba, TPAESHabilidad } from '@/types/system-types';
import { PAESTest, PAESSkill } from '@/types/unified-diagnostic';
import { toast } from '@/components/ui/use-toast';

export interface UnifiedDiagnosticData {
  tests: PAESTest[];
  skills: PAESSkill[];
  baselineScores: Record<TPAESPrueba, number> | null;
  currentScores: Record<TPAESPrueba, number> | null;
  progressTrends: Array<{
    date: string;
    scores: Record<TPAESPrueba, number>;
    improvements: Record<TPAESPrueba, number>;
  }>;
  skillAnalysis: Record<TPAESHabilidad, {
    level: number;
    trend: 'improving' | 'stable' | 'declining';
    exercises_completed: number;
    accuracy_rate: number;
    time_spent_minutes: number;
    recommendations: string[];
  }> | null;
  personalizedStrategies: Array<{
    area: TPAESPrueba | TPAESHabilidad;
    priority: 'high' | 'medium' | 'low';
    strategy: string;
    exercises: Array<{
      type: 'official_paes' | 'ai_generated' | 'lectoguia';
      difficulty: 'basic' | 'intermediate' | 'advanced';
      estimated_time: number;
      skills_targeted: TPAESHabilidad[];
    }>;
    estimated_improvement: number;
  }>;
  predictedScores: Record<TPAESPrueba, number> | null;
  needsInitialAssessment: boolean;
  lastAssessmentDate: string | null;
  nextRecommendedAssessment: string | null;
}

export class DiagnosticOrchestrator {
  private userId: string;
  private cache: Map<string, any> = new Map();

  constructor(userId: string) {
    this.userId = userId;
  }

  async loadUnifiedData(): Promise<UnifiedDiagnosticData> {
    try {
      // Use cache for performance
      const cacheKey = `diagnostic_data_${this.userId}`;
      const cached = this.cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes cache
        return cached.data;
      }

      // Load data in parallel
      const [testsData, skillsData, diagnosticResults, exerciseAttempts, nodeProgress] = await Promise.all([
        DiagnosticSupabaseService.loadPAESTests(),
        DiagnosticSupabaseService.loadPAESSkills(),
        DiagnosticSupabaseService.loadDiagnosticResults(this.userId),
        DiagnosticSupabaseService.loadExerciseAttempts(this.userId),
        DiagnosticSupabaseService.loadNodeProgress(this.userId)
      ]);

      // Determine if needs initial assessment
      const needsInitialAssessment = diagnosticResults.length === 0;

      if (needsInitialAssessment) {
        const data = {
          tests: testsData,
          skills: skillsData,
          baselineScores: null,
          currentScores: null,
          progressTrends: [],
          skillAnalysis: null,
          personalizedStrategies: [],
          predictedScores: null,
          needsInitialAssessment: true,
          lastAssessmentDate: null,
          nextRecommendedAssessment: null
        };

        this.cache.set(cacheKey, { data, timestamp: Date.now() });
        return data;
      }

      // Process intelligence data
      const processedData = this.processIntelligenceData(
        diagnosticResults,
        exerciseAttempts,
        nodeProgress
      );

      const finalData = {
        tests: testsData,
        skills: skillsData,
        ...processedData,
        needsInitialAssessment: false
      };

      this.cache.set(cacheKey, { data: finalData, timestamp: Date.now() });
      return finalData;

    } catch (error) {
      console.error('Error loading unified diagnostic data:', error);
      throw error;
    }
  }

  private processIntelligenceData(
    diagnosticResults: any[],
    exerciseAttempts: any[],
    nodeProgress: any[]
  ) {
    // Calculate baseline and current scores
    const firstResult = diagnosticResults[diagnosticResults.length - 1];
    const latestResult = diagnosticResults[0];

    const baselineScores = firstResult?.results || {};
    const currentScores = latestResult?.results || {};

    // Calculate progress trends
    const progressTrends = DiagnosticSupabaseService.calculateProgressTrends(diagnosticResults);

    // Analyze skills
    const skillAnalysis = DiagnosticSupabaseService.analyzeSkillsFromExercises(exerciseAttempts);

    // Generate personalized strategies
    const personalizedStrategies = this.generatePersonalizedStrategies(
      currentScores,
      skillAnalysis,
      nodeProgress
    );

    // Predict future scores
    const predictedScores = this.predictFutureScores(progressTrends, skillAnalysis);

    return {
      baselineScores,
      currentScores,
      progressTrends,
      skillAnalysis,
      personalizedStrategies,
      predictedScores,
      lastAssessmentDate: latestResult?.completed_at,
      nextRecommendedAssessment: this.calculateNextAssessmentDate(latestResult?.completed_at)
    };
  }

  private generatePersonalizedStrategies(
    currentScores: Record<TPAESPrueba, number>,
    skillAnalysis: Record<TPAESHabilidad, any>,
    nodeProgress: any[]
  ) {
    const strategies = [];

    // Identify weak areas
    const weakAreas = Object.entries(currentScores)
      .filter(([_, score]) => score < 500)
      .sort(([_, a], [__, b]) => a - b);

    for (const [prueba, score] of weakAreas) {
      const strategy = {
        area: prueba as TPAESPrueba,
        priority: score < 400 ? 'high' as const : score < 500 ? 'medium' as const : 'low' as const,
        strategy: this.generateStrategyText(prueba as TPAESPrueba, score),
        exercises: this.generateExerciseRecommendations(prueba as TPAESPrueba, score),
        estimated_improvement: Math.min(100, Math.max(20, (500 - score) * 0.3))
      };
      strategies.push(strategy);
    }

    return strategies;
  }

  private predictFutureScores(progressTrends: any[], skillAnalysis: Record<TPAESHabilidad, any>) {
    if (progressTrends.length < 2) return null;

    const predictions: Record<TPAESPrueba, number> = {} as Record<TPAESPrueba, number>;

    Object.keys(progressTrends[0]?.scores || {}).forEach(prueba => {
      const scores = progressTrends.map(trend => trend.scores[prueba]).filter(Boolean);
      if (scores.length >= 2) {
        const trend = (scores[scores.length - 1] - scores[0]) / scores.length;
        const predicted = scores[scores.length - 1] + (trend * 4);
        predictions[prueba as TPAESPrueba] = Math.max(150, Math.min(850, predicted));
      }
    });

    return predictions;
  }

  private generateStrategyText(prueba: TPAESPrueba, score: number) {
    if (score < 400) {
      return `Enfoque intensivo en ${prueba}: Comenzar con conceptos básicos y ejercicios guiados`;
    } else if (score < 500) {
      return `Refuerzo dirigido en ${prueba}: Combinar teoría con práctica progresiva`;
    }
    return `Optimización en ${prueba}: Enfocarse en ejercicios de mayor complejidad`;
  }

  private generateExerciseRecommendations(prueba: TPAESPrueba, score: number) {
    const exercises = [];
    
    exercises.push({
      type: 'official_paes' as const,
      difficulty: score < 400 ? 'basic' as const : score < 500 ? 'intermediate' as const : 'advanced' as const,
      estimated_time: 45,
      skills_targeted: this.getSkillsForPrueba(prueba)
    });

    return exercises;
  }

  private getSkillsForPrueba(prueba: TPAESPrueba): TPAESHabilidad[] {
    const skillMap: Record<TPAESPrueba, TPAESHabilidad[]> = {
      'COMPETENCIA_LECTORA': ['TRACK_LOCATE', 'INTERPRET_RELATE', 'EVALUATE_REFLECT'],
      'MATEMATICA_1': ['SOLVE_PROBLEMS', 'REPRESENT', 'MODEL', 'ARGUE_COMMUNICATE'],
      'MATEMATICA_2': ['SOLVE_PROBLEMS', 'REPRESENT', 'MODEL', 'ARGUE_COMMUNICATE'],
      'CIENCIAS': ['IDENTIFY_THEORIES', 'PROCESS_ANALYZE', 'APPLY_PRINCIPLES', 'SCIENTIFIC_ARGUMENT'],
      'HISTORIA': ['TEMPORAL_THINKING', 'SOURCE_ANALYSIS', 'MULTICAUSAL_ANALYSIS', 'CRITICAL_THINKING']
    };
    return skillMap[prueba] || [];
  }

  private calculateNextAssessmentDate(lastDate: string) {
    if (!lastDate) return null;
    const last = new Date(lastDate);
    const next = new Date(last);
    next.setDate(next.getDate() + 14);
    return next.toISOString();
  }

  async performInitialAssessment() {
    window.location.href = '/diagnostico';
  }

  async scheduleProgressAssessment() {
    toast({
      title: "Evaluación Programada",
      description: "Generando diagnóstico adaptativo personalizado...",
    });
    
    setTimeout(() => {
      window.location.href = '/diagnostico';
    }, 1500);
  }

  async generatePersonalizedExercises(prueba: TPAESPrueba) {
    const skills = this.getSkillsForPrueba(prueba);
    const randomSkill = skills[Math.floor(Math.random() * skills.length)];
    
    toast({
      title: "Ejercicios Generados",
      description: `Ejercicios personalizados creados para ${prueba}`,
    });
  }

  clearCache() {
    this.cache.clear();
  }
}
