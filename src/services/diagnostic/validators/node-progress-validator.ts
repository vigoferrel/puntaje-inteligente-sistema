
import { supabase } from "@/integrations/supabase/client";
import { DiagnosticQuestion } from "@/types/diagnostic";
import { TPAESPrueba } from "@/types/system-types";

export interface NodeProgressData {
  nodeId: string;
  progress: number;
  masteryLevel: number;
  isCompleted: boolean;
}

export class NodeProgressValidator {
  static async validateProgressByNodes(userId: string, prueba: TPAESPrueba): Promise<NodeProgressData[]> {
    try {
      const { data: nodeProgress } = await supabase
        .from('user_node_progress')
        .select(`
          node_id,
          progress,
          mastery_level,
          status,
          learning_nodes!inner(
            title,
            subject_area,
            test_id
          )
        `)
        .eq('user_id', userId)
        .eq('learning_nodes.subject_area', prueba);

      return (nodeProgress || []).map(np => ({
        nodeId: np.node_id,
        progress: np.progress || 0,
        masteryLevel: np.mastery_level || 0,
        isCompleted: np.status === 'completed'
      }));
    } catch (error) {
      console.error('Error validating node progress:', error);
      return [];
    }
  }

  static async mapQuestionsToNodes(questions: DiagnosticQuestion[], prueba: TPAESPrueba): Promise<DiagnosticQuestion[]> {
    try {
      const { data: questionMappings } = await supabase
        .from('question_node_mapping')
        .select('question_number, node_id, skill_type')
        .in('question_number', questions.map((_, index) => index + 1));

      return questions.map((question, index) => {
        const mapping = questionMappings?.find(m => m.question_number === index + 1);
        return {
          ...question,
          nodeId: mapping?.node_id || undefined
        };
      });
    } catch (error) {
      console.warn('Error mapping questions to nodes:', error);
      return questions;
    }
  }
}
