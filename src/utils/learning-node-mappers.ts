
import { NodeProgress } from "@/types/node-progress";

/**
 * Maps user node progress database entries to NodeProgress objects
 */
export const mapUserNodeProgress = (progressEntries: any[]): NodeProgress[] => {
  if (!progressEntries || progressEntries.length === 0) {
    return [];
  }
  
  return progressEntries.map(entry => ({
    nodeId: entry.node_id,
    status: entry.status,
    progress: entry.progress || 0,
    timeSpentMinutes: entry.time_spent_minutes || 0
  }));
};
