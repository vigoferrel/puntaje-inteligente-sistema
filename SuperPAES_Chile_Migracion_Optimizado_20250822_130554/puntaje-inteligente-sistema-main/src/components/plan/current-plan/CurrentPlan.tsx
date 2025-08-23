/* eslint-disable react-refresh/only-export-components */
import { Card } from "../../../components/ui/card";
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { LearningPlan, PlanProgress } from "../../../types/learning-plan";
import { motion } from "framer-motion";
import { EmptyPlanState } from "./EmptyPlanState";
import { PlanHeader } from "./PlanHeader";
import { PlanProgress as PlanProgressComponent } from "./PlanProgress";
import { PlanFooter } from "./PlanFooter";
import { PlanNodesList } from "../PlanNodesList";
import { PlanSkeleton } from "./PlanSkeleton";

interface CurrentPlanProps {
  plan: LearningPlan | null;
  loading: boolean;
  progress: PlanProgress | null;
  recommendedNodeId: string | null;
  onUpdateProgress: () => void;
  onCreatePlan: () => void;
}

export (...args: unknown[]) => unknown CurrentPlan({
  plan,
  loading,
  progress,
  recommendedNodeId,
  onUpdateProgress,
  onCreatePlan
}: CurrentPlanProps) {
  if (loading) {
    return <PlanSkeleton />;
  }

  if (!plan) {
    return <EmptyPlanState onCreatePlan={onCreatePlan} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-2 hover:border-primary/20 transition-all duration-300">
        <PlanHeader plan={plan} />
        
        <PlanProgressComponent 
          progress={progress} 
          plan={plan} 
        />
        
        <div className="px-6 py-4">
          <PlanNodesList
            nodes={plan.nodes || []}
            recommendedNodeId={recommendedNodeId}
            progress={progress}
          />
        </div>
        
        <PlanFooter 
          loading={loading} 
          onUpdateProgress={onUpdateProgress} 
        />
      </Card>
    </motion.div>
  );
}


