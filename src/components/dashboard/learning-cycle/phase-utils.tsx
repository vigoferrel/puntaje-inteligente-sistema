
import { TLearningCyclePhase } from "@/types/system-types";
import { BookOpen, BrainCircuit, CheckCheck, FileSpreadsheet, BarChart2, 
  ClipboardCheck, Hammer, Timer } from "lucide-react";
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
    FINAL_SIMULATIONS: Timer
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
    FINAL_SIMULATIONS: 7
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
  const phases = [
    "DIAGNOSIS",
    "PERSONALIZED_PLAN",
    "SKILL_TRAINING",
    "CONTENT_STUDY",
    "PERIODIC_TESTS",
    "FEEDBACK_ANALYSIS",
    "REINFORCEMENT",
    "FINAL_SIMULATIONS"
  ] as const;
  
  const currentIndex = phases.indexOf(currentPhase);
  const phaseIndex = phases.indexOf(phase);
  
  return phaseIndex <= currentIndex;
};
