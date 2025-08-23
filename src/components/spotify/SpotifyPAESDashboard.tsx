import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  FastForward, 
  SkipBackward, 
  Volume2, 
  Heart,
  Clock,
  Users
} from 'lucide-react';

interface SpotifyTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  isPlaying: boolean;
  isLiked: boolean;
  coverUrl: string;
}

interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  trackCount: number;
  duration: number;
  coverUrl: string;
  isActive: boolean;
}

interface SpotifyStats {
  totalListeningTime: number;
  favoriteGenre: string;
  topTracks: SpotifyTrack[];
  activePlaylists: SpotifyPlaylist[];
  currentSession: {
    track: SpotifyTrack | null;
    isPlaying: boolean;
    progress: number;
    volume: number;
  };
}

const SpotifyPAESDashboard: React.FC = () => {
  const [stats, setStats] = useState<SpotifyStats>({
    totalListeningTime: 0,
    favoriteGenre: '',
    topTracks: [],
    activePlaylists: [],
    currentSession: {
      track: null,
      isPlaying: false,
      progress: 0,
      volume: 50
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular datos de Spotify
    const loadSpotifyData = async () => {
      try {
        const mockStats: SpotifyStats = {
          totalListeningTime: 2840, // minutos
          favoriteGenre: 'Lo-Fi Study',
          topTracks: [
            {
              id: '1',
              title: 'Study Session - Lo-Fi Beats',
              artist: 'Study Music Collective',
              album: 'PAES Focus',
              duration: 180,
              isPlaying: false,
              isLiked: true,
              coverUrl: 'https://via.placeholder.com/60x60/3B82F6/FFFFFF?text=🎵'
            },
            {
              id: '2',
              title: 'Math Concentration',
              artist: 'Academic Vibes',
              album: 'Study Essentials',
              duration: 240,
              isPlaying: false,
              isLiked: true,
              coverUrl: 'https://via.placeholder.com/60x60/10B981/FFFFFF?text=📐'
            },
            {
              id: '3',
              title: 'Science Flow',
              artist: 'Lab Beats',
              album: 'Scientific Mindset',
              duration: 200,
              isPlaying: false,
              isLiked: false,
              coverUrl: 'https://via.placeholder.com/60x60/F59E0B/FFFFFF?text=🧪'
            }
          ],
          activePlaylists: [
            {
              id: '1',
              name: 'PAES Study Session',
              description: 'Música para concentración durante el estudio',
              trackCount: 45,
              duration: 180,
              coverUrl: 'https://via.placeholder.com/80x80/3B82F6/FFFFFF?text=📚',
              isActive: true
            },
            {
              id: '2',
              name: 'Matemáticas Focus',
              description: 'Beats para resolver problemas matemáticos',
              trackCount: 32,
              duration: 120,
              coverUrl: 'https://via.placeholder.com/80x80/10B981/FFFFFF?text=🔢',
              isActive: false
            },
            {
              id: '3',
              name: 'Ciencias Relajadas',
              description: 'Ambiente para estudiar ciencias',
              trackCount: 28,
              duration: 90,
              coverUrl: 'https://via.placeholder.com/80x80/F59E0B/FFFFFF?text=🔬',
              isActive: false
            }
          ],
          currentSession: {
            track: {
              id: '1',
              title: 'Study Session - Lo-Fi Beats',
              artist: 'Study Music Collective',
              album: 'PAES Focus',
              duration: 180,
              isPlaying: true,
              isLiked: true,
              coverUrl: 'https://via.placeholder.com/60x60/3B82F6/FFFFFF?text=🎵'
            },
            isPlaying: true,
            progress: 45,
            volume: 50
          }
        };

        setStats(mockStats);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading Spotify data:', error);
        setIsLoading(false);
      }
    };

    loadSpotifyData();
  }, []);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const togglePlay = () => {
    setStats(prev => ({
      ...prev,
      currentSession: {
        ...prev.currentSession,
        isPlaying: !prev.currentSession.isPlaying
      }
    }));
  };

  const toggleLike = (trackId: string) => {
    setStats(prev => ({
      ...prev,
      topTracks: prev.topTracks.map(track =>
        track.id === trackId ? { ...track, isLiked: !track.isLiked } : track
      )
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Spotify PAES</h2>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Conectado
        </Badge>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Total</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(stats.totalListeningTime)}</div>
            <p className="text-xs text-muted-foreground">
              De escucha este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Género Favorito</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.favoriteGenre}</div>
            <p className="text-xs text-muted-foreground">
              Más escuchado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Playlists Activas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePlaylists.length}</div>
            <p className="text-xs text-muted-foreground">
              Para estudio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reproductor Actual */}
      {stats.currentSession.track && (
        <Card>
          <CardHeader>
            <CardTitle>Reproduciendo Ahora</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <img
                src={stats.currentSession.track.coverUrl}
                alt={stats.currentSession.track.title}
                className="w-16 h-16 rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{stats.currentSession.track.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {stats.currentSession.track.artist} • {stats.currentSession.track.album}
                </p>
                <div className="mt-2">
                  <Progress value={stats.currentSession.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{Math.floor(stats.currentSession.progress * stats.currentSession.track.duration / 100)}s</span>
                    <span>{stats.currentSession.track.duration}s</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={togglePlay}
                  className="w-10 h-10 p-0"
                >
                  {stats.currentSession.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleLike(stats.currentSession.track!.id)}
                  className={`w-10 h-10 p-0 ${stats.currentSession.track.isLiked ? 'text-red-500' : ''}`}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Playlists Activas */}
      <Card>
        <CardHeader>
          <CardTitle>Playlists de Estudio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.activePlaylists.map((playlist) => (
              <div
                key={playlist.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  playlist.isActive
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={playlist.coverUrl}
                    alt={playlist.name}
                    className="w-12 h-12 rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{playlist.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {playlist.trackCount} canciones • {formatTime(playlist.duration)}
                    </p>
                    {playlist.isActive && (
                      <Badge variant="outline" className="bg-green-100 text-green-700 mt-1">
                        Activa
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Tracks */}
      <Card>
        <CardHeader>
          <CardTitle>Top Tracks de Estudio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.topTracks.map((track, index) => (
              <div key={track.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                <span className="text-sm font-medium text-muted-foreground w-6">
                  {index + 1}
                </span>
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-10 h-10 rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{track.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {track.artist} • {formatTime(track.duration)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleLike(track.id)}
                  className={`p-2 ${track.isLiked ? 'text-red-500' : ''}`}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpotifyPAESDashboard;
