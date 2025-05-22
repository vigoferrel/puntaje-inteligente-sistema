
/**
 * Types related to learning node progress tracking
 */

export interface NodeProgress {
  nodeId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  timeSpentMinutes: number;
  learningPhase?: string; // Añadimos la propiedad learningPhase como opcional
}
