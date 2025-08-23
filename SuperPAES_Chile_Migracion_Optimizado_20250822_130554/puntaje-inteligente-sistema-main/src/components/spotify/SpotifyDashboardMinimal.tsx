/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, Brain, Target, Activity } from 'lucide-react';
import { useSpotifyPAES } from '../../hooks/useSpotifyPAES';
import type { SpotifyPlaylist, SpotifyTrack } from '../../hooks/useSpotifyPAES';
import { PredictiveScoreWidget } from './neural/PredictiveScoreWidget';
import { NeuralVelocityMeter } from './neural/NeuralVelocityMeter';

/**
 * SPOTIFY DASHBOARD MINIMAL - RENACIMIENTO 2D
 * 
 * Interfaz ultra-minimalista que mantiene toda la potencia neural
 * Transformacion de 15+ elementos a 5 elementos esenciales
 * Enfoque educativo premium con funcionalidad completa
 */
export const SpotifyDashboardMinimal: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    playlists,
    setCurrentTrack,
    setIsPlaying,
    playNextOptimalTrack
  } = useSpotifyPAES();

  // Estado minimalista - solo lo esencial
  const [featuredPlaylist, setFeaturedPlaylist] = useState<SpotifyPlaylist | null>(null);

  // Seleccionar playlist destacada automaticamente
  useEffect(() => {
    const featured = playlists[0];
    if (featured && !featuredPlaylist) {
      setFeaturedPlaylist(featured);
    }
  }, [playlists, featuredPlaylist]);

  // Handlers simplificados
  const handlePlayTrack = (track: SpotifyTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Obtener materia del track
  const getTrackSubject = (track: SpotifyTrack): string => {
    return track.metadata?.prueba || track.artist || 'general';
  };

  // Renderizar contenido educativo adaptativo
  const renderEducationalContent = () => {
    if (!currentTrack) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
          <div className="text-center">
            <Brain className="w-16 h-16 text-green-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-bold text-white mb-2">Sistema Neural Activo</h3>
            <p className="text-gray-400">Selecciona un ejercicio para comenzar</p>
          </div>
        </div>
      );
    }

    const subject = getTrackSubject(currentTrack);

    // Contenido adaptativo segun tipo de ejercicio
    const getContentRenderer = () => {
      switch (subject.toLowerCase()) {
        case 'matematica_1':
        case 'matematica_2':
        case 'matematicas':
          return (
            <div className="bg-white rounded-lg p-6">
              <div className="h-64 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <Target className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                  <p className="text-gray-600">Contenido Gráfico: {currentTrack.title}</p>
                  <p className="text-sm text-gray-500">Canvas interactivo para matemáticas</p>
                </div>
              </div>
            </div>
          );
        
        case 'competencia_lectora':
        case 'lenguaje':
          return (
            <div className="bg-white rounded-lg p-6">
              <div className="prose prose-lg max-w-none">
                <h3 className="text-xl font-bold mb-4">{currentTrack.title}</h3>
                <div className="h-48 bg-gray-50 rounded p-4 border">
                  <p className="text-gray-700 leading-relaxed">
                    Contenido de comprensión lectora y análisis textual.
                    El sistema neural adapta automáticamente la dificultad
                    basado en el rendimiento del estudiante.
                  </p>
                </div>
              </div>
            </div>
          );
        
        case 'historia':
          return (
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">{currentTrack.title}</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2">Período</th>
                      <th className="border border-gray-300 p-2">Evento</th>
                      <th className="border border-gray-300 p-2">Impacto</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">1810-1818</td>
                      <td className="border border-gray-300 p-2">Independencia</td>
                      <td className="border border-gray-300 p-2">Formación nacional</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          );
        
        default:
          return (
            <div className="bg-white rounded-lg p-6">
              <div className="text-center">
                <Activity className="w-12 h-12 text-purple-500 mx-auto mb-2" />
                <h3 className="text-xl font-bold mb-2">{currentTrack.title}</h3>
                <p className="text-gray-600">Contenido educativo adaptativo</p>
              </div>
            </div>
          );
      }
    };

    return getContentRenderer();
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      {/* Header Ultra-Compacto - Elemento 1 */}
      <header className="h-16 bg-gray-900 flex items-center justify-between px-6 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-green-400">PAES Neural</h1>
          <div className="px-2 py-1 bg-green-600 rounded text-xs font-bold">ACTIVO</div>
        </div>
        
        <div className="flex items-center space-x-4">
          <NeuralVelocityMeter userId="00000000-0000-0000-0000-000000000001" className="scale-75" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Area Principal - Elemento 2 */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Predicción Neural PROMINENTE - Elemento 3 */}
          <div className="mb-8">
            <PredictiveScoreWidget 
              userId="00000000-0000-0000-0000-000000000001" 
              className="w-full transform hover:scale-105 transition-transform duration-300" 
            />
          </div>

          {/* Contenido Educativo Adaptativo */}
          <div className="mb-6">
            {renderEducationalContent()}
          </div>
        </main>

        {/* Panel Neural Lateral - Elemento 4 */}
        <aside className="w-80 bg-gray-900 p-4 border-l border-gray-800 overflow-y-auto">
          {featuredPlaylist && (
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <Brain className="w-5 h-5 text-green-400" />
                <h3 className="text-white font-bold">{featuredPlaylist.name}</h3>
                <div className="px-2 py-1 bg-blue-600 rounded text-xs">AUTO</div>
              </div>
              
              <div className="space-y-2">
                {featuredPlaylist.tracks.slice(0, 8).map((track, index) => (
                  <div
                    key={track.id}
                    onClick={() => handlePlayTrack(track)}
                    className="p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-800"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 text-center text-sm text-gray-400">
                        {currentTrack?.id === track.id && isPlaying ? (
                          <div className="flex space-x-1 justify-center">
                            <div className="w-1 h-4 bg-green-400 animate-pulse"></div>
                            <div className="w-1 h-4 bg-green-400 animate-pulse delay-100"></div>
                            <div className="w-1 h-4 bg-green-400 animate-pulse delay-200"></div>
                          </div>
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate">{track.title}</h4>
                        <p className="text-xs text-gray-400 truncate">{getTrackSubject(track)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Métricas Neural en Tiempo Real */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-white font-bold mb-3 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-cyan-400" />
              Métricas Neural
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Eficiencia:</span>
                <span className="text-green-400 font-bold">85%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Velocidad:</span>
                <span className="text-blue-400 font-bold">92%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Precisión:</span>
                <span className="text-purple-400 font-bold">88%</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Player Educativo Minimalista - Elemento 5 */}
      {currentTrack && (
        <footer className="h-20 bg-gray-900 border-t border-gray-800 flex items-center px-6">
          <div className="flex items-center space-x-4 flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded flex items-center justify-center text-white font-bold">
              {getTrackSubject(currentTrack).includes('matematica') ? '??' :
               getTrackSubject(currentTrack).includes('ciencias') ? '??' :
               getTrackSubject(currentTrack).includes('lectora') ? '??' :
               getTrackSubject(currentTrack).includes('historia') ? '???' : '??'}
            </div>
            <div>
              <h4 className="text-white font-medium">{currentTrack.title}</h4>
              <p className="text-gray-400 text-sm capitalize">{getTrackSubject(currentTrack)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handlePlayPause}
              className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              aria-label={isPlaying ? "Pausar" : "Reproducir"}
            >
              {isPlaying ? (
                <Pause size={20} className="text-black" />
              ) : (
                <Play size={20} className="text-black ml-1" />
              )}
            </button>
            <button
              onClick={playNextOptimalTrack}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Siguiente ejercicio"
            >
              <SkipForward size={20} />
            </button>
          </div>

          <div className="flex-1 flex justify-end">
            <div className="text-right">
              <div className="text-xs text-gray-400">Neural Score</div>
              <div className="text-sm font-bold text-green-400">
                {featuredPlaylist?.neuralScore || 85}%
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default SpotifyDashboardMinimal;


