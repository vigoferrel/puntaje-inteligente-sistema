
export type NodeStatus = 'not_started' | 'in_progress' | 'completed';

export interface NodeProgressUpdate {
  nodeId: string;
  status: NodeStatus;
  progress: number; // 0-100
}

export interface NodeProgressHandlerResult {
  success: boolean;
  error?: string;
}

export interface NodeProgressData {
  [nodeId: string]: {
    status: NodeStatus;
    progress: number;
    lastUpdated?: Date;
  };
}

// Nuevo tipo para el progreso individual de un nodo
export interface NodeProgress {
  nodeId: string;
  status: NodeStatus;
  progress: number; // 0-1 (decimal) o 0-100 (porcentaje)
  timeSpentMinutes?: number;
}
