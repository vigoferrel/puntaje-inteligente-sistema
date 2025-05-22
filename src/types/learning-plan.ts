
export interface LearningPlan {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetDate?: string | null;
  createdAt: string;
  updatedAt?: string; // Añadimos el campo faltante
  nodes: LearningPlanNode[];
}

export interface LearningPlanNode {
  id: string;
  nodeId: string;
  position: number;
  nodeName?: string; // Para propósitos de visualización
  nodeDescription?: string; // Para propósitos de visualización
  nodeDifficulty?: string; // Para propósitos de visualización
  nodeSkill?: string; // Para propósitos de visualización
  planId?: string; // Hacemos opcional el planId para compatibilidad
}

export interface PlanProgress {
  totalNodes: number;
  completedNodes: number;
  inProgressNodes: number;
  overallProgress: number;
}
