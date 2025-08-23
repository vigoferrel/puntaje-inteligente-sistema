/* eslint-disable react-refresh/only-export-components */
// ðŸŽµ SpotifyEducativo.tsx - Agente Neural de Playlists Educativas
// Context7 + Pensamiento Secuencial + Spotify Integration

import React, { useState, useEffect, useCallback } from 'react';
import { useQuantumEducationalArsenal } from '../../hooks/useQuantumEducationalArsenal';
import styles from './CuboFrontal.module.css';

// =====================================================================================
// ðŸŽ¯ INTERFACES TYPESCRIPT
// =====================================================================================

interface EducationalPlaylist {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: 'bÃ¡sico' | 'intermedio' | 'avanzado';
  duration: number;
  tracks: EducationalTrack[];
  bloomLevel: number;
}

interface EducationalTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  educationalValue: number;
  concepts: string[];
}

interface SpotifyEducativoProps {
  onPlaylistSelect?: (playlist: EducationalPlaylist) => void;
  subject?: string;
  bloomLevel?: number;
  className?: string;
}

// =====================================================================================
// ðŸŽµ PLAYLISTS EDUCATIVAS PREDEFINIDAS
// =====================================================================================

const EDUCATIONAL_PLAYLISTS: EducationalPlaylist[] = [
  {
    id: 'math-focus',
    title: 'MatemÃ¡ticas CuÃ¡nticas',
    description: 'MÃºsica para concentraciÃ³n matemÃ¡tica profunda',
    subject: 'MatemÃ¡ticas',
    difficulty: 'avanzado',
    duration: 3600,
    bloomLevel: 5,
    tracks: [
      {
        id: 'track1',
        title: 'Fibonacci Frequencies',
        artist: 'Neural Harmonics',
        duration: 240,
        educationalValue: 95,
        concepts: ['Secuencias', 'Patrones', 'ConcentraciÃ³n']
      },
      {
        id: 'track2',
        title: 'Calculus Dreams',
        artist: 'Mathematical Minds',
        duration: 300,
        educationalValue: 90,
        concepts: ['Derivadas', 'Integrales', 'LÃ­mites']
      }
    ]
  },
  {
    id: 'science-discovery',
    title: 'Ciencias Naturales',
    description: 'Sonidos de la naturaleza para estudiar ciencias',
    subject: 'Ciencias',
    difficulty: 'intermedio',
    duration: 2700,
    bloomLevel: 4,
    tracks: [
      {
        id: 'track3',
        title: 'Molecular Symphony',
        artist: 'Science Sounds',
        duration: 280,
        educationalValue: 88,
        concepts: ['QuÃ­mica', 'MolÃ©culas', 'Reacciones']
      }
    ]
  },
  {
    id: 'language-flow',
    title: 'ComprensiÃ³n Lectora',
    description: 'MÃºsica clÃ¡sica para mejorar la comprensiÃ³n',
    subject: 'Lenguaje',
    difficulty: 'bÃ¡sico',
    duration: 3000,
    bloomLevel: 3,
    tracks: [
      {
        id: 'track4',
        title: 'Literary Landscapes',
        artist: 'Word Weavers',
        duration: 320,
        educationalValue: 85,
        concepts: ['ComprensiÃ³n', 'Vocabulario', 'AnÃ¡lisis']
      }
    ]
  }
];

// =====================================================================================
// ðŸŽµ COMPONENTE PRINCIPAL
// =====================================================================================

export const SpotifyEducativo: React.FC<SpotifyEducativoProps> = ({
  onPlaylistSelect,
  subject,
  bloomLevel = 3,
  className = ''
}) => {
  // ðŸ”— Hooks
  const {
    arsenalStatus,
    createPlaylist,
    trackMetric,
    isLoading
  } = useQuantumEducationalArsenal();

  // ðŸŽ¯ Estados
  const [selectedPlaylist, setSelectedPlaylist] = useState<EducationalPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<EducationalTrack | null>(null);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [filteredPlaylists, setFilteredPlaylists] = useState<EducationalPlaylist[]>(EDUCATIONAL_PLAYLISTS);

  // ðŸŽ® Manejadores
  const handlePlaylistSelect = useCallback(async (playlist: EducationalPlaylist) => {
    setSelectedPlaylist(playlist);
    setCurrentTrack(playlist.tracks[0] || null);
    
    // Registrar mÃ©trica
    await trackMetric('playlist_selected', playlist.bloomLevel, {
      playlistId: playlist.id,
      subject: playlist.subject,
      difficulty: playlist.difficulty
    });

    // Callback externo
    onPlaylistSelect?.(playlist);
  }, [trackMetric, onPlaylistSelect]);

  const handlePlayPause = useCallback(async () => {
    if (!selectedPlaylist) return;

    setIsPlaying(!isPlaying);
    
    // Registrar mÃ©trica
    await trackMetric('playback_toggle', isPlaying ? 0 : 1, {
      playlistId: selectedPlaylist.id,
      trackId: currentTrack?.id
    });
  }, [selectedPlaylist, isPlaying, currentTrack, trackMetric]);

  const handleCreateCustomPlaylist = useCallback(async () => {
    if (!subject) return;

    const title = `${subject} - SesiÃ³n Personalizada`;
    const description = `Playlist generada para ${subject} nivel Bloom ${bloomLevel}`;
    
    const result = await createPlaylist(title, description);
    
    if (result.success) {
      // Simular nueva playlist creada
      const newPlaylist: EducationalPlaylist = {
        id: `custom-${Date.now()}`,
        title,
        description,
        subject,
        difficulty: bloomLevel > 4 ? 'avanzado' : bloomLevel > 2 ? 'intermedio' : 'bÃ¡sico',
        duration: 3600,
        bloomLevel,
        tracks: []
      };
      
      setFilteredPlaylists(prev => [newPlaylist, ...prev]);
      await handlePlaylistSelect(newPlaylist);
    }
  }, [subject, bloomLevel, createPlaylist, handlePlaylistSelect]);

  // ðŸ”„ Efectos
  useEffect(() => {
    // Filtrar playlists por materia y nivel Bloom
    let filtered = EDUCATIONAL_PLAYLISTS;
    
    if (subject) {
      filtered = filtered.filter(p => 
        p.subject.toLowerCase().includes(subject.toLowerCase())
      );
    }
    
    filtered = filtered.filter(p => Math.abs(p.bloomLevel - bloomLevel) <= 1);
    
    setFilteredPlaylists(filtered);
  }, [subject, bloomLevel]);

  useEffect(() => {
    // Simular progreso de reproducciÃ³n
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        setPlaybackTime(prev => {
          if (prev >= currentTrack.duration) {
            // Cambiar a siguiente track
            if (selectedPlaylist) {
              const currentIndex = selectedPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
              const nextTrack = selectedPlaylist.tracks[currentIndex + 1];
              if (nextTrack) {
                setCurrentTrack(nextTrack);
                return 0;
              } else {
                setIsPlaying(false);
                return 0;
              }
            }
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentTrack, selectedPlaylist]);

  // ðŸŽ¨ Clases CSS
  const containerClasses = [
    styles.spotifyContainer,
    className
  ].filter(Boolean).join(' ');

  // ðŸ“Š Formatear tiempo
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // =====================================================================================
  // ðŸŽ¨ RENDERIZADO
  // =====================================================================================

  return (
    <div className={containerClasses}>
      <div className={styles.faceIcon}>ðŸŽµ</div>
      <div className={styles.faceName}>Spotify Educativo</div>
      
      {/* ðŸ“Š Estado del Arsenal */}
      <div className={styles.faceData}>
        Playlists: {arsenalStatus.playlists_count}
      </div>

      {/* ðŸŽµ Lista de Playlists */}
      <div className={styles.playlistList}>
        {filteredPlaylists.map((playlist) => (
          <div
            key={playlist.id}
            onClick={() => handlePlaylistSelect(playlist)}
            className={`${styles.playlistItem} ${
              selectedPlaylist?.id === playlist.id ? styles.playlistItemSelected : ''
            }`}
          >
            <div className={styles.playlistTitle}>{playlist.title}</div>
            <div className={styles.playlistMeta}>
              {playlist.subject} â€¢ {playlist.difficulty} â€¢ Bloom {playlist.bloomLevel}
            </div>
          </div>
        ))}
      </div>

      {/* ðŸŽ® Controles de ReproducciÃ³n */}
      {selectedPlaylist && (
        <div className={styles.playerControls}>
          {currentTrack && (
            <div className={styles.trackInfo}>
              <div className={styles.trackTitle}>{currentTrack.title}</div>
              <div className={styles.trackArtist}>{currentTrack.artist}</div>
              <div className={styles.trackTime}>
                {formatTime(playbackTime)} / {formatTime(currentTrack.duration)}
              </div>
            </div>
          )}
          
          <div className={styles.controlsContainer}>
            <button
              onClick={handlePlayPause}
              disabled={isLoading}
              className={styles.playButton}
            >
              {isPlaying ? 'â¸ï¸' : 'â–¶ï¸'}
            </button>
          </div>
        </div>
      )}

      {/* âž• Crear Playlist Personalizada */}
      {subject && (
        <button
          onClick={handleCreateCustomPlaylist}
          disabled={isLoading}
          className={styles.createPlaylistButton}
        >
          âž• Crear Playlist para {subject}
        </button>
      )}

      {/* ðŸ“Š MÃ©trica Visual */}
      <div className={styles.faceMetric}>
        <div className={`${styles.metricBar} ${styles.metricWidth95}`} />
      </div>
    </div>
  );
};

export default SpotifyEducativo;
