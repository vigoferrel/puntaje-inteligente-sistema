export type PaesTestType = 
  | 'COMPETENCIA_LECTORA'
  | 'MATEMATICA_M1'
  | 'MATEMATICA_M2'
  | 'CIENCIAS'
  | 'HISTORIA';

export type NodeStatus = 'not-evaluated' | 'in-progress' | 'completed';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  current_scores: {
    competencia_lectora: number;
    matematica_m1: number;
    matematica_m2: number;
    historia: number;
    ciencias: number;
  };
  created_at: string;
  updated_at: string;
}

export interface LearningNode {
  id: string;
  name: string;
  description?: string;
  test_type: PaesTestType;
  skill: string;
  difficulty: 'facil' | 'intermedio' | 'dificil';
  position: number;
  is_active: boolean;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  node_id: string;
  status: NodeStatus;
  progress_percentage: number;
  score: number;
  time_spent_minutes: number;
  last_updated: string;
  node?: LearningNode; // populated in queries
}

export interface PracticeSession {
  id: string;
  user_id: string;
  test_type: PaesTestType;
  total_questions: number;
  correct_answers: number;
  total_score: number;
  time_spent_minutes: number;
  completed_at: string;
}

export interface ProgressStats {
  totalNodes: number;
  completedNodes: number;
  inProgressNodes: number;
  averageScore: number;
  totalTimeSpent: number;
}

export interface GeneratedContent {
  type: 'question' | 'explanation' | 'practice';
  content: string;
  metadata?: Record<string, any>;
}
