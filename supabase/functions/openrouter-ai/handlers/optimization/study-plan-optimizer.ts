import { callOpenRouter } from "../../services/openrouter-service.ts";
import { createSuccessResponse, createErrorResponse } from "../../utils/response-utils.ts";
import { MonitoringService } from "../../services/monitoring-service.ts";
import { CacheService } from "../../services/cache-service.ts";

/**
 * Optimizador Inteligente de Planes de Estudio
 * Utiliza IA y métricas neurales para crear planes personalizados
 */

interface StudyOptimizationRequest {
  user_id: string;
  current_performance: any[];
  neural_metrics: {
    engagement: number;
    coherence: number;
    consistency: number;
    optimal_hours: number[];
    stress_indicators: number;
  };
  goals: {
    target_subjects: string[];
    timeline: string;
    intensity_preference: 'low' | 'medium' | 'high';
    available_hours_daily: number;
  };
  learning_style: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  current_weaknesses: string[];
  strengths: string[];
}

interface OptimizedStudyPlan {
  weekly_schedule: WeeklySchedule;
  personalized_strategies: string[];
  adaptive_milestones: Milestone[];
  neural_optimization: NeuralOptimization;
  success_probability: number;
  estimated_improvement: {
    subjects: { [key: string]: number };
    timeline: string;
    confidence: number;
  };
}

interface WeeklySchedule {
  [day: string]: StudySession[];
}

interface StudySession {
  time_slot: string;
  subject: string;
  activity_type: 'review' | 'practice' | 'new_content' | 'assessment';
  duration_minutes: number;
  difficulty_level: 'easy' | 'medium' | 'hard';
  neural_optimization_notes: string;
}

interface Milestone {
  week: number;
  goals: string[];
  success_metrics: string[];
  adaptive_adjustments: string[];
}

interface NeuralOptimization {
  peak_performance_hours: string[];
  break_recommendations: string[];
  cognitive_load_management: string[];
  stress_mitigation_strategies: string[];
}

/**
 * Función principal de optimización de plan de estudio
 */
export async function optimizeStudyPlan(payload: StudyOptimizationRequest): Promise<any> {
  const startTime = Date.now();
  MonitoringService.info('Starting study plan optimization', { user_id: payload.user_id });
  
  try {
    // Validación de entrada
    if (!payload.user_id || !payload.neural_metrics || !payload.goals) {
      return createErrorResponse('Datos incompletos para optimización del plan de estudio');
    }
    
    // Cache key único para este usuario y configuración
    const cacheKey = `study_plan_${payload.user_id}_${JSON.stringify(payload.goals).slice(0, 50)}`;
    
    // Verificar cache
    const cached = await CacheService.get(cacheKey);
    if (cached) {
      MonitoringService.info('Study plan optimization cache hit');
      return createSuccessResponse(cached);
    }
    
    // Análisis de patrones neurales
    const neuralAnalysis = analyzeNeuralPatterns(payload.neural_metrics);
    
    // Cálculo de horarios óptimos
    const optimalSchedule = calculateOptimalSchedule(payload);
    
    // Generación del prompt para IA
    const optimizationPrompt = createOptimizationPrompt(payload, neuralAnalysis);
    
    // Llamada a IA para generar plan personalizado
    const aiResult = await callOpenRouter(
      "Eres un especialista en neuroeducación y planificación académica. Genera planes de estudio científicamente optimizados en formato JSON.",
      optimizationPrompt
    );
    
    if (aiResult.error) {
      return createErrorResponse(aiResult.error, 500, generateFallbackPlan(payload));
    }
    
    // Enriquecimiento del plan con datos calculados
    const optimizedPlan = enrichPlanWithCalculations(aiResult.result, payload, neuralAnalysis);
    
    // Guardar en cache por 4 horas
    await CacheService.set(cacheKey, optimizedPlan, { ttl: 14400000 });
    
    MonitoringService.info(`Study plan optimization completed in ${Date.now() - startTime}ms`);
    return createSuccessResponse(optimizedPlan);
    
  } catch (error) {
    MonitoringService.error('Error in study plan optimization:', error);
    return createErrorResponse(`Error optimizando plan de estudio: ${error.message}`, 500);
  }
}

/**
 * Análisis avanzado de patrones neurales
 */
function analyzeNeuralPatterns(metrics: any) {
  const patterns = {
    peak_focus_periods: [],
    cognitive_fatigue_indicators: [],
    optimal_session_length: 45,
    break_frequency: 15,
    stress_triggers: []
  };
  
  // Análisis de engagement
  if (metrics.engagement > 80) {
    patterns.optimal_session_length = 60;
    patterns.peak_focus_periods.push('morning', 'early-evening');
  } else if (metrics.engagement < 50) {
    patterns.optimal_session_length = 30;
    patterns.break_frequency = 10;
    patterns.stress_triggers.push('long_sessions');
  }
  
  // Análisis de coherencia
  if (metrics.coherence < 60) {
    patterns.cognitive_fatigue_indicators.push('attention_fragmentation');
    patterns.stress_triggers.push('complex_content');
  }
  
  // Análisis de consistencia
  if (metrics.consistency < 50) {
    patterns.stress_triggers.push('irregular_schedule');
  }
  
  return patterns;
}

/**
 * Cálculo de horarios óptimos basado en métricas neurales
 */
function calculateOptimalSchedule(payload: StudyOptimizationRequest) {
  const schedule = {
    daily_sessions: [],
    weekly_distribution: {},
    intensity_mapping: {}
  };
  
  const availableHours = payload.goals.available_hours_daily;
  const intensity = payload.goals.intensity_preference;
  
  // Distribución según intensidad
  switch (intensity) {
    case 'high':
      schedule.daily_sessions = Math.min(3, Math.floor(availableHours / 1.5));
      break;
    case 'medium':
      schedule.daily_sessions = Math.min(2, Math.floor(availableHours / 2));
      break;
    case 'low':
      schedule.daily_sessions = 1;
      break;
  }
  
  // Mapeo de intensidad por día
  schedule.weekly_distribution = {
    'monday': intensity === 'high' ? 0.9 : 0.7,
    'tuesday': 0.8,
    'wednesday': intensity === 'low' ? 0.6 : 0.85,
    'thursday': 0.8,
    'friday': 0.7,
    'saturday': intensity === 'high' ? 0.8 : 0.5,
    'sunday': 0.4 // Día de repaso ligero
  };
  
  return schedule;
}

/**
 * Creación del prompt de optimización para IA
 */
function createOptimizationPrompt(payload: StudyOptimizationRequest, neuralAnalysis: any): string {
  return `Genera un plan de estudio optimizado para este estudiante:

PERFIL DEL ESTUDIANTE:
- Métricas neurales: Engagement ${payload.neural_metrics.engagement}%, Coherencia ${payload.neural_metrics.coherence}%, Consistencia ${payload.neural_metrics.consistency}%
- Estilo de aprendizaje: ${payload.learning_style}
- Horas disponibles diarias: ${payload.goals.available_hours_daily}
- Intensidad preferida: ${payload.goals.intensity_preference}
- Materias objetivo: ${payload.goals.target_subjects.join(', ')}
- Timeline: ${payload.goals.timeline}

DEBILIDADES ACTUALES: ${payload.current_weaknesses.join(', ')}
FORTALEZAS: ${payload.strengths.join(', ')}

ANÁLISIS NEURAL:
- Duración óptima de sesión: ${neuralAnalysis.optimal_session_length} minutos
- Frecuencia de descansos: cada ${neuralAnalysis.break_frequency} minutos
- Indicadores de estrés: ${neuralAnalysis.stress_triggers.join(', ')}

GENERA un plan JSON con esta estructura exacta:
{
  "weekly_schedule": {
    "monday": [{"time_slot": "09:00-10:00", "subject": "string", "activity_type": "practice", "duration_minutes": 60, "difficulty_level": "medium", "neural_optimization_notes": "string"}],
    "tuesday": [...], 
    // ... resto de días
  },
  "personalized_strategies": ["estrategia 1", "estrategia 2", "estrategia 3"],
  "adaptive_milestones": [
    {"week": 1, "goals": ["objetivo 1"], "success_metrics": ["métrica 1"], "adaptive_adjustments": ["ajuste 1"]}
  ],
  "neural_optimization": {
    "peak_performance_hours": ["09:00-11:00", "15:00-17:00"],
    "break_recommendations": ["descanso cada 45min", "ejercicio ligero"],
    "cognitive_load_management": ["técnica 1", "técnica 2"],
    "stress_mitigation_strategies": ["estrategia 1", "estrategia 2"]
  },
  "success_probability": 85,
  "estimated_improvement": {
    "subjects": {"Matemáticas": 15, "Lenguaje": 12},
    "timeline": "4 semanas",
    "confidence": 90
  }
}

IMPORTANTE: Solo responde con el JSON, sin explicaciones adicionales.`;
}

/**
 * Enriquecimiento del plan con cálculos adicionales
 */
function enrichPlanWithCalculations(plan: any, payload: StudyOptimizationRequest, neuralAnalysis: any) {
  // Añadir métricas calculadas
  plan.optimization_metadata = {
    generated_at: new Date().toISOString(),
    user_id: payload.user_id,
    neural_compatibility_score: calculateNeuralCompatibility(payload.neural_metrics),
    adaptation_triggers: generateAdaptationTriggers(payload),
    performance_predictions: generatePerformancePredictions(payload)
  };
  
  // Añadir sistema de seguimiento
  plan.tracking_system = {
    daily_checkpoints: generateDailyCheckpoints(),
    weekly_assessments: generateWeeklyAssessments(),
    adaptation_rules: generateAdaptationRules(neuralAnalysis)
  };
  
  return plan;
}

/**
 * Plan de respaldo en caso de error de IA
 */
function generateFallbackPlan(payload: StudyOptimizationRequest): OptimizedStudyPlan {
  const baseSchedule: WeeklySchedule = {};
  const subjects = payload.goals.target_subjects;
  const hoursDaily = payload.goals.available_hours_daily;
  
  // Generar horario básico
  ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].forEach(day => {
    baseSchedule[day] = subjects.slice(0, Math.floor(hoursDaily)).map((subject, index) => ({
      time_slot: `${9 + index * 2}:00-${10 + index * 2}:00`,
      subject,
      activity_type: 'practice' as const,
      duration_minutes: 60,
      difficulty_level: 'medium' as const,
      neural_optimization_notes: 'Plan básico generado automáticamente'
    }));
  });
  
  return {
    weekly_schedule: baseSchedule,
    personalized_strategies: [
      'Estudiar en bloques de 45 minutos',
      'Tomar descansos de 15 minutos',
      'Revisar material antes de dormir'
    ],
    adaptive_milestones: [
      {
        week: 1,
        goals: ['Establecer rutina de estudio'],
        success_metrics: ['Cumplir 80% del horario'],
        adaptive_adjustments: ['Ajustar horarios según preferencias']
      }
    ],
    neural_optimization: {
      peak_performance_hours: ['09:00-11:00', '15:00-17:00'],
      break_recommendations: ['Descanso cada 45 minutos', 'Ejercicio ligero'],
      cognitive_load_management: ['Alternar materias difíciles con fáciles'],
      stress_mitigation_strategies: ['Técnicas de respiración', 'Ejercicio regular']
    },
    success_probability: 70,
    estimated_improvement: {
      subjects: subjects.reduce((acc, subject) => ({ ...acc, [subject]: 10 }), {}),
      timeline: payload.goals.timeline,
      confidence: 75
    }
  };
}

// Funciones auxiliares
function calculateNeuralCompatibility(metrics: any): number {
  const engagement = metrics.engagement || 50;
  const coherence = metrics.coherence || 50;
  const consistency = metrics.consistency || 50;
  
  return Math.round((engagement * 0.4 + coherence * 0.35 + consistency * 0.25));
}

function generateAdaptationTriggers(payload: StudyOptimizationRequest): string[] {
  const triggers = [];
  
  if (payload.neural_metrics.engagement < 60) {
    triggers.push('Bajo engagement - considerar cambio de metodología');
  }
  
  if (payload.neural_metrics.stress_indicators > 70) {
    triggers.push('Alto estrés - reducir intensidad del plan');
  }
  
  return triggers;
}

function generatePerformancePredictions(payload: StudyOptimizationRequest) {
  return {
    short_term: '10-15% mejora en 2 semanas',
    medium_term: '25-30% mejora en 1 mes',
    long_term: '40-50% mejora en 2 meses',
    risk_factors: payload.current_weaknesses.slice(0, 3),
    success_indicators: payload.strengths.slice(0, 3)
  };
}

function generateDailyCheckpoints(): string[] {
  return [
    'Verificar nivel de energía antes del estudio',
    'Evaluar comprensión al final de cada sesión',
    'Registrar tiempo efectivo de concentración',
    'Identificar distracciones principales'
  ];
}

function generateWeeklyAssessments(): string[] {
  return [
    'Autoevaluación de progreso por materia',
    'Análisis de horarios más/menos productivos',
    'Evaluación de estrategias de estudio',
    'Ajuste de metas para la siguiente semana'
  ];
}

function generateAdaptationRules(neuralAnalysis: any): string[] {
  const rules = [
    'Si el engagement baja <50%, reducir duración de sesiones',
    'Si coherencia baja <40%, aumentar frecuencia de descansos'
  ];
  
  if (neuralAnalysis.stress_triggers.includes('long_sessions')) {
    rules.push('Limitar sesiones a máximo 30 minutos si hay indicadores de estrés');
  }
  
  return rules;
}
