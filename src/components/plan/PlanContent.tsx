import React from "react";
import { LearningPlan } from "@/types/learning-plan";
import { EmptyPlanState } from "./EmptyPlanState";
import { CurrentPlan } from "./CurrentPlan";
import { PlanSelector } from "./PlanSelector";
import { motion, AnimatePresence } from "framer-motion";

interface PlanContentProps {
  plans: LearningPlan[];
  currentPlan: LearningPlan | null;
  currentPlanProgress: any;
  progressLoading: boolean;
  recommendedNodeId: string | null;
  onCreatePlan: () => void;
  onSelectPlan: (plan: LearningPlan) => void;
  onUpdateProgress: () => void;
}

export const PlanContent = ({
  plans,
  currentPlan,
  currentPlanProgress,
  progressLoading,
  recommendedNodeId,
  onCreatePlan,
  onSelectPlan,
  onUpdateProgress
}: PlanContentProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key="plan-content"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {plans.length === 0 ? (
          <EmptyPlanState onCreatePlan={onCreatePlan} />
        ) : (
          <>
            {/* Current Plan Details */}
            {currentPlan && (
              <CurrentPlan 
                plan={currentPlan}
                loading={progressLoading}
                progress={currentPlanProgress}
                recommendedNodeId={recommendedNodeId}
                onUpdateProgress={onUpdateProgress}
                onCreatePlan={onCreatePlan}
              />
            )}
            
            {/* Other Plans List */}
            <PlanSelector 
              plans={plans} 
              currentPlanId={currentPlan?.id} 
              onSelectPlan={onSelectPlan} 
            />
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
