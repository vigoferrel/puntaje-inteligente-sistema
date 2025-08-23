// ========================================
// SUPERPAES CHILE - DATOS OFICIALES PAES
// ========================================

export interface PAESGoal {
  subject: string;
  currentScore: number;
  targetScore: number;
  progress: number;
  status: 'on-track' | 'behind' | 'ahead';
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  subject: string;
  duration: string;
  progress: number;
  status: 'active' | 'completed' | 'pending';
}

export interface AgentStatus {
  name: string;
  status: 'online' | 'offline' | 'busy';
  specialty: string;
  lastActivity: string;
}

export interface LearningMetrics {
  totalExercises: number;
  completedExercises: number;
  averageScore: number;
  studyTime: string;
  streak: number;
}

export interface UserProfile {
  name: string;
  avatar: string;
  level: string;
  points: number;
  rank: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'achievement';
  title: string;
  message: string;
  timestamp: Date;
  time: string;
}

export const officialData = {
  userProfile: {
    name: 'Estudiante SuperPAES',
    avatar: '🎓',
    level: 'Avanzado',
    points: 2847,
    rank: '#1 en tu región'
  } as UserProfile,

  paesGoals: [
    { subject: 'Competencia Lectora', currentScore: 720, targetScore: 850, progress: 85, status: 'on-track' as const },
    { subject: 'Matemática M1', currentScore: 680, targetScore: 800, progress: 85, status: 'on-track' as const },
    { subject: 'Matemática M2', currentScore: 650, targetScore: 750, progress: 87, status: 'ahead' as const },
    { subject: 'Ciencias', currentScore: 690, targetScore: 820, progress: 84, status: 'behind' as const },
    { subject: 'Historia', currentScore: 710, targetScore: 830, progress: 86, status: 'on-track' as const }
  ] as PAESGoal[],

  spotifyPlaylists: [
    { id: '1', name: 'Competencia Lectora Avanzada', subject: 'Lenguaje', duration: '45 min', progress: 75, status: 'active' as const },
    { id: '2', name: 'Matemática M1 - Álgebra', subject: 'Matemática', duration: '60 min', progress: 90, status: 'completed' as const },
    { id: '3', name: 'Ciencias - Biología Celular', subject: 'Ciencias', duration: '30 min', progress: 45, status: 'pending' as const }
  ] as SpotifyPlaylist[],

  agents: [
    { name: 'Leonardo', status: 'online' as const, specialty: 'Análisis Matemático', lastActivity: 'Activo ahora' },
    { name: 'Miguel Ángel', status: 'busy' as const, specialty: 'Comprensión Lectora', lastActivity: 'Hace 5 min' },
    { name: 'Rafael', status: 'online' as const, specialty: 'Ciencias Experimentales', lastActivity: 'Activo ahora' }
  ] as AgentStatus[],

  learningMetrics: {
    totalExercises: 150,
    completedExercises: 127,
    averageScore: 87.5,
    studyTime: '2h 30m',
    streak: 12
  } as LearningMetrics,

  notifications: [
    { id: '1', type: 'success' as const, title: 'Meta Alcanzada', message: '¡Nueva meta alcanzada en Competencia Lectora!', timestamp: new Date(), time: '5 min' },
    { id: '2', type: 'info' as const, title: 'Nueva Playlist', message: 'Playlist "Matemática Avanzada" disponible', timestamp: new Date(), time: '15 min' },
    { id: '3', type: 'warning' as const, title: 'Recordatorio', message: 'Recordatorio: Ejercicio pendiente en Ciencias', timestamp: new Date(), time: '1 hora' }
  ] as Notification[]
}
