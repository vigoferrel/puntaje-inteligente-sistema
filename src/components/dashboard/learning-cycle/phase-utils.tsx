
import { 
  BookOpen, 
  BarChart3, 
  Target, 
  Sparkles,
  PenTool, 
  Brain, 
  CheckCircle, 
  ArrowUpRight
} from "lucide-react";
import { TLearningCyclePhase } from "@/types/system-types";
import { LucideIcon } from "lucide-react";

// Map phase to icon
export const getPhaseIcon = (phase: TLearningCyclePhase): LucideIcon => {
  const icons: Record<TLearningCyclePhase, LucideIcon> = {
    DIAGNOSIS: BarChart3,
    PERSONALIZED_PLAN: Target,
    SKILL_TRAINING: Brain,
    CONTENT_STUDY: BookOpen,
    PERIODIC_TESTS: PenTool,
    FEEDBACK_ANALYSIS: Sparkles,
    REINFORCEMENT: CheckCircle,
    FINAL_SIMULATIONS: ArrowUpRight,
  };
  
  return icons[phase] || BookOpen;
};
