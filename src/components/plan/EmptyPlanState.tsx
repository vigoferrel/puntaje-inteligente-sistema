
import React from "react";
import { PlanGeneratorCard } from "@/components/plan-generator";
import { motion } from "framer-motion";

interface EmptyPlanStateProps {
  onCreatePlan: () => void;
}

export const EmptyPlanState = ({ onCreatePlan }: EmptyPlanStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-8"
    >
      <PlanGeneratorCard 
        onPlanCreated={onCreatePlan}
        className="max-w-md mx-auto"
      />
    </motion.div>
  );
};
