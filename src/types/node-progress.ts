
/**
 * Types related to learning node progress tracking
 */

export interface NodeProgress {
  nodeId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  timeSpentMinutes: number;
  // Removido learningPhase ya que no existe en la base de datos
}
