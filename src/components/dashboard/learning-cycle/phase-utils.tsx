
import { TLearningCyclePhase } from "@/types/system-types";
import { BookOpen, BrainCircuit, CheckCheck, FileSpreadsheet, BarChart2, 
  ClipboardCheck, Hammer, Timer, Eye, Brain, Zap, Target } from "lucide-react";
import { LucideIcon } from "lucide-react";

/**
 * Returns the appropriate icon for each learning cycle phase
 */
export const getPhaseIcon = (phase: TLearningCyclePhase): LucideIcon => {
  const icons: Record<TLearningCyclePhase, LucideIcon> = {
    DIAGNOSIS: ClipboardCheck,
    PERSONALIZED_PLAN: FileSpreadsheet,
    SKILL_TRAINING: BrainCircuit,
    CONTENT_STUDY: BookOpen,
    PERIODIC_TESTS: CheckCheck,
    FEEDBACK_ANALYSIS: BarChart2,
    REINFORCEMENT: Hammer,
    FINAL_SIMULATIONS: Timer,
    // Fases del Ciclo de Kolb - integradas al sistema unificado
    EXPERIENCIA_CONCRETA: Target,
    OBSERVACION_REFLEXIVA: Eye,
    CONCEPTUALIZACION_ABSTRACTA: Brain,
    EXPERIMENTACION_ACTIVA: Zap,
    // Legacy phases - now redirected to unified system
    diagnostic: ClipboardCheck,
    exploration: Brain,
    practice: BookOpen,
    application: Target
  };
  
  return icons[phase] || BookOpen;
};

/**
 * Get the estimated time required for a phase (in days)
 */
export const getPhaseTimeEstimate = (phase: TLearningCyclePhase): number => {
  const estimates: Record<TLearningCyclePhase, number> = {
    DIAGNOSIS: 1,
    PERSONALIZED_PLAN: 1,
    SKILL_TRAINING: 14,
    CONTENT_STUDY: 30,
    PERIODIC_TESTS: 7,
    FEEDBACK_ANALYSIS: 2,
    REINFORCEMENT: 14,
    FINAL_SIMULATIONS: 7,
    // Fases del Ciclo de Kolb
    EXPERIENCIA_CONCRETA: 3,
    OBSERVACION_REFLEXIVA: 5,
    CONCEPTUALIZACION_ABSTRACTA: 7,
    EXPERIMENTACION_ACTIVA: 4,
    // Legacy phases
    diagnostic: 1,
    exploration: 3,
    practice: 5,
    application: 5
  };
  
  return estimates[phase] || 7;
};

/**
 * Determines if a phase is available based on the current phase
 */
export const isPhaseAvailable = (
  phase: TLearningCyclePhase, 
  currentPhase: TLearningCyclePhase
): boolean => {
  const allPhasesInOrder = [
    "DIAGNOSIS", "PERSONALIZED_PLAN", "SKILL_TRAINING", "CONTENT_STUDY", 
    "PERIODIC_TESTS", "FEEDBACK_ANALYSIS", "REINFORCEMENT", "FINAL_SIMULATIONS"
  ];
  
  const phaseIndex = allPhasesInOrder.indexOf(phase);
  const currentIndex = allPhasesInOrder.indexOf(currentPhase);
  
  return phaseIndex <= currentIndex;
};
