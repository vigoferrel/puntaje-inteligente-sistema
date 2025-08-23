import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './use-auth';

export interface SpotifyPAESConfig {
  userId: string;
  musicPreferences: {
    genres: string[];
    energy: 'low' | 'medium' | 'high' | 'adaptive';
    tempo: 'slow' | 'moderate' | 'fast' | 'study_rhythm';
    instrumentalPreference: boolean;
    moodAlignment: boolean;
  };
  studySettings: {
    sessionDuration: number;
    breakInterval: number;
    focusMode: boolean;
    backgroundVolume: number;
    adaptivePlaylist: boolean;
  };
  isActive: boolean;
}

export interface EducationalDJSession {
  id: string;
  userId: string;
  mood: 'focused' | 'energetic' | 'relaxed' | 'creative' | 'balanced';
  durationMinutes: number;
  currentTrack?: {
    name: string;
    artist: string;
    energy: number;
    valence: number;
    danceability: number;
    tempo: number;
  };
  playlist: {
    id: string;
    name: string;
    tracks: Array<{
      name: string;
      artist: string;
      duration: number;
      educationalMetadata: {
        focusBoost: number;
        memoryEnhancement: number;
        creativityStimulation: number;
        stressReduction: number;
      };
    }>;
  };
  sessionMetrics: {
    focusScore: number;
    productivityIndex: number;
    stressLevel: number;
    motivationBoost: number;
  };
  status: 'active' | 'paused' | 'completed' | 'stopped';
  startedAt: string;
  endedAt?: string;
}

export interface CuratedPlaylist {
  id: string;
  name: string;
  description: string;
  subject: string;
  bloomLevel: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  duration: number;
  trackCount: number;
  averageEnergy: number;
  targetMood: string;
  learningObjectives: string[];
  neuralAlignment: {
    focusEnhancement: number;
    memoryConsolidation: number;
    creativityBoost: number;
    stressReduction: number;
    motivationIncrease: number;
  };
  quantumResonance: number;
  leonardoRecommendationScore: number;
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SpotifyPAESMetrics {
  totalSessionsCompleted: number;
  totalListeningTime: number;
  averageFocusScore: number;
  mostEffectiveMood: string;
  preferredGenres: string[];
  productivityCorrelation: number;
  stressReductionIndex: number;
  learningAcceleration: number;
  neuralSynchronization: number;
  lastActiveSession?: string;
}

export const useSpotifyPAESEcosystem = () => {
  const { user } = useAuth();
  const [config, setConfig] = useState<SpotifyPAESConfig | null>(null);
  const [currentSession, setCurrentSession] = useState<EducationalDJSession | null>(null);
  const [curatedPlaylists, setCuratedPlaylists] = useState<CuratedPlaylist[]>([]);
  const [metrics, setMetrics] = useState<SpotifyPAESMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar ecosistema Spotify-PAES
  const initializeEcosystem = useCallback(async () => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase.rpc('initialize_spotify_paes_ecosystem');
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error initializing Spotify-PAES ecosystem:', err);
      return null;
    }
  }, [user?.id]);

  // Orquestador principal Spotify-PAES
  const spotifyPAESOrchestrator = useCallback(async () => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase.rpc('spotify_paes_orchestrator', {
        p_user_id: user.id
      });

      if (error) throw error;

      if (data) {
        // Procesar datos del orquestador
        return {
          orchestrationId: data.orchestration_id,
          recommendedPlaylists: data.recommended_playlists || [],
          optimalSession: data.optimal_session || null,
          neuralAlignment: data.neural_alignment || {},
          quantumResonance: data.quantum_resonance || 0,
          adaptiveSettings: data.adaptive_settings || {}
        };
      }

      return null;
    } catch (err) {
      console.error('Error in Spotify-PAES orchestrator:', err);
      return null;
    }
  }, [user?.id]);

  // Iniciar sesión de DJ educativo
  const startEducationalDJ = useCallback(async (
    mood: string = 'balanced',
    durationMinutes: number = 60
  ) => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase.rpc('educational_dj', {
        p_user_id: user.id,
        p_mood: mood,
        p_duration_minutes: durationMinutes
      });

      if (error) throw error;

      if (data) {
        const session: EducationalDJSession = {
          id: data.session_id || Math.random().toString(36),
          userId: user.id,
          mood: mood as any,
          durationMinutes,
          currentTrack: data.current_track || null,
          playlist: {
            id: data.playlist?.id || '',
            name: data.playlist?.name || 'DJ Session Playlist',
            tracks: data.playlist?.tracks || []
          },
          sessionMetrics: {
            focusScore: data.session_metrics?.focus_score || 0,
            productivityIndex: data.session_metrics?.productivity_index || 0,
            stressLevel: data.session_metrics?.stress_level || 0,
            motivationBoost: data.session_metrics?.motivation_boost || 0
          },
          status: 'active',
          startedAt: new Date().toISOString()
        };

        setCurrentSession(session);
        return session;
      }

      return null;
    } catch (err) {
      console.error('Error starting educational DJ:', err);
      return null;
    }
  }, [user?.id]);

  // Obtener playlists curadas por Leonardo
  const getLeonardoCuratedPlaylists = useCallback(async (
    subjects?: string[],
    difficultyPreference: string = 'mixed',
    quantumAlignmentThreshold: number = 0.8
  ) => {
    try {
      const { data, error } = await supabase.rpc('get_leonardo_curated_playlists', {
        user_subjects: subjects || null,
        difficulty_preference: difficultyPreference,
        quantum_alignment_threshold: quantumAlignmentThreshold
      });

      if (error) throw error;

      if (data) {
        const playlists: CuratedPlaylist[] = data.playlists?.map((playlist: any) => ({
          id: playlist.id,
          name: playlist.name,
          description: playlist.description,
          subject: playlist.subject,
          bloomLevel: playlist.bloom_level,
          difficulty: playlist.difficulty,
          duration: playlist.duration,
          trackCount: playlist.track_count,
          averageEnergy: playlist.average_energy,
          targetMood: playlist.target_mood,
          learningObjectives: playlist.learning_objectives || [],
          neuralAlignment: {
            focusEnhancement: playlist.neural_alignment?.focus_enhancement || 0,
            memoryConsolidation: playlist.neural_alignment?.memory_consolidation || 0,
            creativityBoost: playlist.neural_alignment?.creativity_boost || 0,
            stressReduction: playlist.neural_alignment?.stress_reduction || 0,
            motivationIncrease: playlist.neural_alignment?.motivation_increase || 0
          },
          quantumResonance: playlist.quantum_resonance || 0,
          leonardoRecommendationScore: playlist.leonardo_score || 0,
          tags: playlist.tags || [],
          isPublic: playlist.is_public || false,
          createdAt: playlist.created_at || new Date().toISOString(),
          updatedAt: playlist.updated_at || new Date().toISOString()
        })) || [];

        setCuratedPlaylists(playlists);
        return {
          playlists,
          leonardoInsights: data.leonardo_insights || {},
          quantumAlignment: data.quantum_alignment || 0,
          personalizedScore: data.personalized_score || 0
        };
      }

      return null;
    } catch (err) {
      console.error('Error getting Leonardo curated playlists:', err);
      return null;
    }
  }, []);

  // Orquestador de evolución PAES
  const paesEvolutionOrchestrator = useCallback(async () => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase.rpc('paes_evolution_orchestrator', {
        p_user_id: user.id
      });

      if (error) throw error;

      if (data) {
        return {
          evolutionPlan: data.evolution_plan || {},
          musicTherapyRecommendations: data.music_therapy || [],
          neuroplasticityEnhancement: data.neuroplasticity_enhancement || {},
          quantumLearningAlignment: data.quantum_alignment || 0,
          predictedGrowth: data.predicted_growth || {}
        };
      }

      return null;
    } catch (err) {
      console.error('Error in PAES evolution orchestrator:', err);
      return null;
    }
  }, [user?.id]);

  // Cargar configuración y datos iniciales
  const loadSpotifyPAESData = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      // Inicializar ecosistema si es necesario
      await initializeEcosystem();

      // Ejecutar orquestador principal
      const orchestrationResult = await spotifyPAESOrchestrator();
      
      // Obtener playlists curadas
      await getLeonardoCuratedPlaylists(['matematica', 'ciencias', 'competencia_lectora']);

      // Configurar datos por defecto si es la primera vez
      if (!config) {
        const defaultConfig: SpotifyPAESConfig = {
          userId: user.id,
          musicPreferences: {
            genres: ['lo-fi', 'classical', 'ambient', 'instrumental'],
            energy: 'adaptive',
            tempo: 'study_rhythm',
            instrumentalPreference: true,
            moodAlignment: true
          },
          studySettings: {
            sessionDuration: 60,
            breakInterval: 15,
            focusMode: true,
            backgroundVolume: 65,
            adaptivePlaylist: true
          },
          isActive: false
        };
        
        setConfig(defaultConfig);
      }

      // Obtener métricas
      const defaultMetrics: SpotifyPAESMetrics = {
        totalSessionsCompleted: 0,
        totalListeningTime: 0,
        averageFocusScore: 0,
        mostEffectiveMood: 'balanced',
        preferredGenres: ['lo-fi', 'classical'],
        productivityCorrelation: 0,
        stressReductionIndex: 0,
        learningAcceleration: 0,
        neuralSynchronization: 0
      };

      setMetrics(defaultMetrics);

    } catch (err) {
      console.error('Error loading Spotify-PAES data:', err);
      setError('Error al cargar ecosistema Spotify-PAES');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, config, initializeEcosystem, spotifyPAESOrchestrator, getLeonardoCuratedPlaylists]);

  // Pausar/reanudar sesión actual
  const toggleSession = useCallback(async () => {
    if (!currentSession) return;

    const newStatus = currentSession.status === 'active' ? 'paused' : 'active';
    setCurrentSession(prev => prev ? { ...prev, status: newStatus } : null);
  }, [currentSession]);

  // Finalizar sesión actual
  const stopSession = useCallback(async () => {
    if (!currentSession) return;

    setCurrentSession(prev => prev ? {
      ...prev,
      status: 'completed',
      endedAt: new Date().toISOString()
    } : null);

    // Actualizar métricas
    if (metrics) {
      setMetrics(prev => prev ? {
        ...prev,
        totalSessionsCompleted: prev.totalSessionsCompleted + 1,
        totalListeningTime: prev.totalListeningTime + (currentSession.durationMinutes || 0),
        lastActiveSession: new Date().toISOString()
      } : null);
    }
  }, [currentSession, metrics]);

  // Efecto inicial
  useEffect(() => {
    if (user?.id) {
      loadSpotifyPAESData();
    }
  }, [user?.id, loadSpotifyPAESData]);

  return {
    // Estados
    config,
    currentSession,
    curatedPlaylists,
    metrics,
    isLoading,
    error,

    // Acciones principales
    initializeEcosystem,
    spotifyPAESOrchestrator,
    startEducationalDJ,
    getLeonardoCuratedPlaylists,
    paesEvolutionOrchestrator,

    // Control de sesión
    toggleSession,
    stopSession,

    // Configuración
    updateConfig: setConfig,
    refreshData: loadSpotifyPAESData,

    // Utilidades
    isSessionActive: () => currentSession?.status === 'active',
    getSessionProgress: () => {
      if (!currentSession) return 0;
      const elapsed = Date.now() - new Date(currentSession.startedAt).getTime();
      const duration = currentSession.durationMinutes * 60 * 1000;
      return Math.min((elapsed / duration) * 100, 100);
    },
    getOptimalMood: () => metrics?.mostEffectiveMood || 'balanced',
    getRecommendedPlaylist: () => {
      if (!curatedPlaylists.length) return null;
      return curatedPlaylists.sort((a, b) => 
        b.leonardoRecommendationScore - a.leonardoRecommendationScore
      )[0];
    }
  };
};
