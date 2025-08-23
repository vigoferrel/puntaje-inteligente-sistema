import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';

export interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: number;
  preview_url?: string;
  energy: number;
  valence: number;
  tempo: number;
  acousticness: number;
  instrumentalness: number;
}

export interface StudySession {
  id: string;
  userId: string;
  subject: string;
  mood: 'focus' | 'energetic' | 'calm' | 'motivated';
  duration: number;
  startedAt: string;
  endedAt?: string;
  currentPlaylist: string;
  tracksPlayed: SpotifyTrack[];
  effectiveness: number;
  userRating?: number;
}

export interface AdaptivePlaylist {
  id: string;
  name: string;
  description: string;
  subject: string;
  mood: string;
  tracks: SpotifyTrack[];
  totalDuration: number;
  averageEnergy: number;
  adaptationLevel: number;
  aiGenerated: boolean;
  userRating: number;
  usageCount: number;
}

export interface MusicPreferences {
  preferredGenres: string[];
  energyLevel: 'low' | 'medium' | 'high';
  instrumentalOnly: boolean;
  excludeVocals: boolean;
  tempo: {
    min: number;
    max: number;
  };
  subjectPreferences: Record<string, {
    energy: number;
    instrumental: boolean;
    tempo: number;
  }>;
}

export const useSpotifyPAES = () => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlists, setPlaylists] = useState<AdaptivePlaylist[]>([]);
  const [preferences, setPreferences] = useState<MusicPreferences>({
    preferredGenres: ['ambient', 'classical', 'lo-fi'],
    energyLevel: 'medium',
    instrumentalOnly: false,
    excludeVocals: false,
    tempo: { min: 80, max: 120 },
    subjectPreferences: {
      matematica: { energy: 0.6, instrumental: true, tempo: 90 },
      ciencias: { energy: 0.7, instrumental: false, tempo: 100 },
      lectura: { energy: 0.4, instrumental: true, tempo: 70 },
      historia: { energy: 0.5, instrumental: false, tempo: 85 }
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar conexión con Spotify
  const checkSpotifyConnection = useCallback(async () => {
    try {
      const spotifyToken = localStorage.getItem(`spotify-token-${user?.id}`);
      setIsConnected(!!spotifyToken);
      return !!spotifyToken;
    } catch (err) {
      console.error('Error checking Spotify connection:', err);
      return false;
    }
  }, [user?.id]);

  // Conectar con Spotify
  const connectSpotify = useCallback(async () => {
    try {
      // Simular proceso de autenticación OAuth
      const mockToken = `mock-spotify-token-${user?.id}-${Date.now()}`;
      localStorage.setItem(`spotify-token-${user?.id}`, mockToken);
      setIsConnected(true);
      return true;
    } catch (err) {
      console.error('Error connecting to Spotify:', err);
      setError('Error al conectar con Spotify');
      return false;
    }
  }, [user?.id]);

  // Iniciar sesión de estudio musical
  const startStudySession = useCallback(async (
    subject: string,
    mood: StudySession['mood'] = 'focus',
    duration = 60
  ) => {
    if (!user?.id || !isConnected) return null;

    try {
      setIsLoading(true);

      // Generar playlist adaptativa
      const adaptivePlaylist = await generateAdaptivePlaylist(subject, mood);
      
      const session: StudySession = {
        id: `session-${Date.now()}`,
        userId: user.id,
        subject,
        mood,
        duration,
        startedAt: new Date().toISOString(),
        currentPlaylist: adaptivePlaylist.id,
        tracksPlayed: [],
        effectiveness: 0,
      };

      setCurrentSession(session);
      
      // Iniciar reproducción del primer track
      if (adaptivePlaylist.tracks.length > 0) {
        setCurrentTrack(adaptivePlaylist.tracks[0]);
        setIsPlaying(true);
      }

      return session;
    } catch (err) {
      console.error('Error starting study session:', err);
      setError('Error al iniciar sesión de estudio');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, isConnected]);

  // Generar playlist adaptativa con IA
  const generateAdaptivePlaylist = useCallback(async (
    subject: string,
    mood: string,
    customization?: Partial<MusicPreferences>
  ): Promise<AdaptivePlaylist> => {
    // Combinar preferencias del usuario con customización específica
    const effectivePrefs = { ...preferences, ...customization };
    const subjectPref = effectivePrefs.subjectPreferences[subject] || 
                      { energy: 0.6, instrumental: true, tempo: 90 };

    // Generar tracks adaptativos (simulado)
    const adaptiveTracks: SpotifyTrack[] = Array.from({ length: 15 }, (_, i) => ({
      id: `track-${subject}-${mood}-${i}`,
      name: `${subject} Study Track ${i + 1}`,
      artist: `AI Generated Artist ${i % 3 + 1}`,
      album: `Adaptive Study Music - ${subject}`,
      duration: 180 + Math.random() * 120, // 3-5 minutos
      energy: subjectPref.energy + (Math.random() - 0.5) * 0.2,
      valence: mood === 'calm' ? 0.3 : mood === 'energetic' ? 0.8 : 0.5,
      tempo: subjectPref.tempo + (Math.random() - 0.5) * 20,
      acousticness: subjectPref.instrumental ? 0.8 : 0.4,
      instrumentalness: subjectPref.instrumental ? 0.9 : 0.1
    }));

    const playlist: AdaptivePlaylist = {
      id: `playlist-${subject}-${Date.now()}`,
      name: `${subject} - ${mood} Session`,
      description: `Playlist generada por IA para estudiar ${subject} en modo ${mood}`,
      subject,
      mood,
      tracks: adaptiveTracks,
      totalDuration: adaptiveTracks.reduce((acc, track) => acc + track.duration, 0),
      averageEnergy: adaptiveTracks.reduce((acc, track) => acc + track.energy, 0) / adaptiveTracks.length,
      adaptationLevel: 0.85,
      aiGenerated: true,
      userRating: 0,
      usageCount: 1
    };

    setPlaylists(prev => [playlist, ...prev.slice(0, 9)]); // Mantener últimas 10
    return playlist;
  }, [preferences]);

  // Controlar reproducción
  const togglePlayback = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const nextTrack = useCallback(() => {
    if (currentSession && playlists.length > 0) {
      const currentPlaylist = playlists.find(p => p.id === currentSession.currentPlaylist);
      if (currentPlaylist && currentTrack) {
        const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
        const nextIndex = (currentIndex + 1) % currentPlaylist.tracks.length;
        setCurrentTrack(currentPlaylist.tracks[nextIndex]);
      }
    }
  }, [currentSession, playlists, currentTrack]);

  const previousTrack = useCallback(() => {
    if (currentSession && playlists.length > 0) {
      const currentPlaylist = playlists.find(p => p.id === currentSession.currentPlaylist);
      if (currentPlaylist && currentTrack) {
        const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
        const prevIndex = currentIndex === 0 ? currentPlaylist.tracks.length - 1 : currentIndex - 1;
        setCurrentTrack(currentPlaylist.tracks[prevIndex]);
      }
    }
  }, [currentSession, playlists, currentTrack]);

  // Finalizar sesión
  const endStudySession = useCallback(async (effectiveness?: number, userRating?: number) => {
    if (!currentSession) return;

    const endedSession = {
      ...currentSession,
      endedAt: new Date().toISOString(),
      effectiveness: effectiveness || 0.8,
      userRating
    };

    setCurrentSession(null);
    setIsPlaying(false);
    setCurrentTrack(null);

    return endedSession;
  }, [currentSession]);

  // Adaptación automática basada en performance
  const adaptMusicToPerformance = useCallback(async (performanceData: {
    focusLevel: number;
    engagementScore: number;
    errorRate: number;
  }) => {
    if (!currentSession || !currentTrack) return;

    // Lógica de adaptación
    let newEnergy = currentTrack.energy;
    
    if (performanceData.focusLevel < 0.5) {
      // Bajo focus - música más energética
      newEnergy = Math.min(0.9, newEnergy + 0.1);
    } else if (performanceData.focusLevel > 0.9) {
      // Alto focus - mantener o reducir ligeramente
      newEnergy = Math.max(0.3, newEnergy - 0.05);
    }

    if (performanceData.errorRate > 0.3) {
      // Muchos errores - música más relajante
      newEnergy = Math.max(0.2, newEnergy - 0.15);
    }

    // Generar nueva playlist adaptada si es necesario
    const energyDifference = Math.abs(newEnergy - currentTrack.energy);
    if (energyDifference > 0.2) {
      const newPlaylist = await generateAdaptivePlaylist(
        currentSession.subject,
        currentSession.mood,
        { energyLevel: newEnergy > 0.6 ? 'high' : newEnergy > 0.4 ? 'medium' : 'low' }
      );
      
      if (newPlaylist.tracks.length > 0) {
        setCurrentTrack(newPlaylist.tracks[0]);
      }
    }
  }, [currentSession, currentTrack, generateAdaptivePlaylist]);

  // Inicialización
  useEffect(() => {
    if (user?.id) {
      checkSpotifyConnection();
    }
  }, [user?.id, checkSpotifyConnection]);

  return {
    // Estados
    isConnected,
    currentSession,
    currentTrack,
    isPlaying,
    playlists,
    preferences,
    isLoading,
    error,

    // Acciones
    connectSpotify,
    startStudySession,
    endStudySession,
    togglePlayback,
    nextTrack,
    previousTrack,
    generateAdaptivePlaylist,
    adaptMusicToPerformance,

    // Configuración
    updatePreferences: (newPrefs: Partial<MusicPreferences>) => 
      setPreferences(prev => ({ ...prev, ...newPrefs })),
    
    // Utilidades
    getCurrentPlaylist: () => 
      playlists.find(p => p.id === currentSession?.currentPlaylist),
    getRecommendedMood: (subject: string) => {
      const moodMapping: Record<string, StudySession['mood']> = {
        matematica: 'focus',
        ciencias: 'energetic',
        lectura: 'calm',
        historia: 'motivated'
      };
      return moodMapping[subject] || 'focus';
    },
    getSessionDuration: () => 
      currentSession ? 
        Date.now() - new Date(currentSession.startedAt).getTime() : 0
  };
};
