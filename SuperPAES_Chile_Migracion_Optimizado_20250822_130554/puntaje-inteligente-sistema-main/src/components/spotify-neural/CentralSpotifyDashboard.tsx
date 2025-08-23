/* eslint-disable react-refresh/only-export-components */
/**
 * ðŸŽµ CentralSpotifyDashboard - Context7 + Pensamiento Secuencial
 * Pantalla central tipo Spotify que muestra quÃ© estudiar basado en expectativas
 * FilosofÃ­a: Menos es MÃ¡s - Una sola vista con todo lo esencial
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Play, Clock, Target, Star, TrendingUp } from 'lucide-react';
import { useAuth } from './../../hooks/useAuth';
import { ExpectationGap, useExpectationGaps } from '../../services/spotify-neural/ExpectationGapCalculator';
import { PlaylistTrack, DailyPlaylist, useDailyPlaylist } from '../../services/spotify-neural/SpotifyEducationalPlaylist';

interface CentralSpotifyDashboardProps {
  onExerciseStart?: (track: PlaylistTrack) => void;
  className?: string;
}

/**
 * Header con progreso hacia carrera objetivo
 */
const CareerProgressHeader: React.FC<{
  targetCareer: string;
  progress: number;
  criticalCount: number;
}> = ({ targetCareer, progress, criticalCount }) => (
  <Card className="bg-black/20 border-white/10 text-white">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Target className="h-8 w-8 text-green-400" />
          <div>
            <CardTitle className="text-2xl font-bold">
              ðŸŽ¯ Mi Camino a {targetCareer}
            </CardTitle>
            <p className="text-white/70">Tu progreso hacia el sueÃ±o</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-green-400">{progress}%</div>
          <div className="text-sm text-white/70">completado</div>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <Progress value={progress} className="h-3 bg-white/10" />
      {criticalCount > 0 && (
        <div className="mt-3 flex items-center space-x-2">
          <Badge variant="destructive" className="bg-red-500/20 text-red-300 border-red-500/30">
            ðŸ”´ {criticalCount} Ã¡rea{criticalCount > 1 ? 's' : ''} crÃ­tica{criticalCount > 1 ? 's' : ''}
          </Badge>
        </div>
      )}
    </CardContent>
  </Card>
);

/**
 * Card con visualizaciÃ³n de gaps
 */
const ExpectationGapsCard: React.FC<{
  gaps: ExpectationGap[];
}> = ({ gaps }) => (
  <Card className="bg-black/20 border-white/10 text-white">
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <TrendingUp className="h-5 w-5" />
        <span>ðŸ“Š GAPS VS EXPECTATIVAS</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {gaps.slice(0, 5).map((gap) => (
          <div key={gap.subjectKey} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{gap.emoji}</span>
              <div>
                <div className="font-semibold">{gap.subject}</div>
                <div className="text-sm text-white/70">
                  {gap.current}/{gap.target} puntos
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg">
                {gap.gap > 0 ? `-${gap.gap}` : 'âœ…'}
              </div>
              <div className="text-sm text-white/70">
                {gap.percentage}% logrado
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

/**
 * Card con playlist diaria
 */
const DailyPlaylistCard: React.FC<{
  playlist: DailyPlaylist | null;
  onStartExercise: (track: PlaylistTrack) => void;
  onCompleteExercise: (trackId: string) => void;
}> = ({ playlist, onStartExercise }) => {
  if (!playlist) return null;

  return (
    <Card className="bg-black/20 border-white/10 text-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Play className="h-5 w-5 text-green-400" />
          <span>ðŸŽµ QUÃ‰ ESTUDIAR HOY</span>
        </CardTitle>
        <p className="text-white/70">{playlist.focusArea}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {playlist.tracks.map((track: PlaylistTrack, index: number) => {
            const isCompleted = playlist.completedTracks.includes(track.id);
            
            return (
              <div 
                key={track.id} 
                className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                  isCompleted 
                    ? 'bg-green-500/10 border border-green-500/30' 
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-sm font-bold">
                    {isCompleted ? 'âœ…' : index + 1}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{track.emoji}</span>
                    <div>
                      <div className="font-semibold">{track.title}</div>
                      <div className="text-sm text-white/70 flex items-center space-x-3">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{track.estimatedTime} min</span>
                        </span>
                        <Badge 
                          variant="outline" 
                          className="text-xs border-white/20 text-white/80"
                        >
                          {track.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {isCompleted ? (
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      Completado
                    </Badge>
                  ) : (
                    <Button
                      onClick={() => onStartExercise(track)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Empezar
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Card con progreso del dÃ­a
 */
const TodayProgressCard: React.FC<{
  progress: number;
  completedTracks: number;
  totalTracks: number;
  motivationalMessage: string;
}> = ({ progress, completedTracks, totalTracks, motivationalMessage }) => (
  <Card className="bg-black/20 border-white/10 text-white">
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <Star className="h-5 w-5 text-yellow-400" />
        <span>ðŸ† PROGRESO HOY</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {/* Barra de progreso */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/70">
              {completedTracks}/{totalTracks} ejercicios completados
            </span>
            <span className="font-bold text-lg">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3 bg-white/10" />
        </div>

        {/* Estrellas visuales */}
        <div className="flex items-center space-x-2">
          <span className="text-white/70">Progreso:</span>
          <div className="flex space-x-1">
            {Array.from({ length: totalTracks }, (_, i) => (
              <span key={i} className="text-2xl">
                {i < completedTracks ? 'â­' : 'âšª'}
              </span>
            ))}
          </div>
        </div>

        {/* Mensaje motivacional */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-white/10">
          <p className="text-center font-medium">{motivationalMessage}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

/**
 * Componente principal del Dashboard Central Spotify
 */
export const CentralSpotifyDashboard: React.FC<CentralSpotifyDashboardProps> = ({
  onExerciseStart,
  className = ''
}) => {
  const { user } = useAuth();
  const userId = user?.id || 'userId';
  
  // Estados principales
  const { gaps, isLoading: gapsLoading } = useExpectationGaps(userId);
  const { playlist, loading: playlistLoading, markTrackCompleted } = useDailyPlaylist(
    userId, 
    gaps?.gaps || []
  );

  const [selectedTrack, setSelectedTrack] = useState<PlaylistTrack | null>(null);

  // Datos para mostrar
  const isLoading = gapsLoading || playlistLoading;
  const careerProgress = gaps?.overallProgress || 0;
  const targetCareer = 'Medicina'; // Esto vendrÃ­a de user_goals
  const todayProgress = playlist?.progress || 0;

  /**
   * Maneja el inicio de un ejercicio
   */
  const handleStartExercise = (track: PlaylistTrack) => {
    setSelectedTrack(track);
    if (onExerciseStart) {
      onExerciseStart(track);
    }
    // AquÃ­ se conectarÃ­a con el Centro de Ejercicios
    console.log('ðŸŽµ Iniciando ejercicio:', track.title);
  };

  /**
   * Maneja la finalizaciÃ³n de un ejercicio
   */
  const handleCompleteExercise = (trackId: string) => {
    markTrackCompleted(trackId);
    setSelectedTrack(null);
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 ${className}`}>
        <div className="text-white text-xl">ðŸŽµ Preparando tu playlist educativa...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 ${className}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header - Progreso hacia carrera */}
        <CareerProgressHeader 
          targetCareer={targetCareer}
          progress={careerProgress}
          criticalCount={gaps?.criticalCount || 0}
        />

        {/* Gaps Visualization */}
        <ExpectationGapsCard gaps={gaps?.gaps || []} />

        {/* Daily Playlist */}
        <DailyPlaylistCard 
          playlist={playlist}
          onStartExercise={handleStartExercise}
          onCompleteExercise={handleCompleteExercise}
        />

        {/* Today's Progress */}
        <TodayProgressCard 
          progress={todayProgress}
          completedTracks={playlist?.completedTracks.length || 0}
          totalTracks={playlist?.tracks.length || 0}
          motivationalMessage={playlist?.motivationalMessage || 'ðŸŽ¯ Â¡Dale play a tu Ã©xito!'}
        />

      </div>
    </div>
  );
};

export default CentralSpotifyDashboard;
