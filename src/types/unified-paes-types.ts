
export interface CinematicState {
  currentScene: 'dashboard' | 'subject' | 'help' | 'loading';
  transitionActive: boolean;
  immersionLevel: 'minimal' | 'standard' | 'full';
  effectsEnabled: boolean;
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  color: string;
  description: string;
}

export interface SubjectProgress {
  subject: string;
  progress: number;
  color: string;
  topics: Array<{
    name: string;
    progress: number;
    exercises: number;
  }>;
}

export interface UserMetrics {
  overallProgress: number;
  projectedScore: number;
  studyStreak: number;
  exercisesCompleted: number;
  neuralLevel: string;
}
