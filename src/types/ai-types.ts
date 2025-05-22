/**
 * Types related to AI-generated content, specifically exercises
 */

export interface Exercise {
  id?: string;
  question: string;
  text?: string; 
  context?: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  skill: string;
  prueba?: string;
  difficulty?: string;
  imageUrl?: string;
  graphData?: any;
  visualType?: string;
  hasVisualContent?: boolean;
  nodeId?: string;
  nodeName?: string;
}
