import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpotifyPAESEcosystem, CuratedPlaylist, EducationalDJSession } from '../../hooks/use-spotify-paes-ecosystem';
import { 
  Music, Play, Pause, FastForward, Volume2, Brain, Headphones,
  Zap, Heart, TrendingUp, Settings, Disc, Radio, Waves,
  Sparkles, Activity, Target, Clock, BarChart3, Shuffle
} from 'lucide-react';

const SpotifyPAESDashboard = () => {
  const {
    config,
    currentSession,
    curatedPlaylists,
    metrics,
    isLoading,
    error,
    startEducationalDJ,
    getLeonardoCuratedPlaylists,
    toggleSession,
    stopSession,
    isSessionActive,
    getSessionProgress,
    getOptimalMood,
    getRecommendedPlaylist,
    refreshData
  } = useSpotifyPAESEcosystem();

  const [selectedMood, setSelectedMood] = useState<string>('balanced');
  const [sessionDuration, setSessionDuration] = useState(60);
  const [showPlaylistDetails, setShowPlaylistDetails] = useState<string | null>(null);

  const moods = [
    { id: 'focused', label: 'Enfocado', icon: '🎯', color: 'from-blue-500 to-blue-600', description: 'Para concentración profunda' },
    { id: 'energetic', label: 'Energético', icon: '⚡', color: 'from-orange-500 to-red-500', description: 'Para sesiones dinámicas' },
    { id: 'relaxed', label: 'Relajado', icon: '🌿', color: 'from-green-500 to-teal-500', description: 'Para aprendizaje calmado' },
    { id: 'creative', label: 'Creativo', icon: '🎨', color: 'from-purple-500 to-pink-500', description: 'Para proyectos innovadores' },
    { id: 'balanced', label: 'Equilibrado', icon: '⚖️', color: 'from-indigo-500 to-purple-500', description: 'Perfecto para todo' }
  ];

  const genres = ['lo-fi', 'classical', 'ambient', 'jazz', 'electronic', 'instrumental', 'nature'];

  const PlaylistCard = ({ playlist }: { playlist: CuratedPlaylist }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg cursor-pointer"
      onClick={() => setShowPlaylistDetails(showPlaylistDetails === playlist.id ? null : playlist.id)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-spotify-green to-green-500 rounded-lg">
            <Music className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{playlist.name}</h3>
            <p className="text-sm text-gray-400">{playlist.subject} • {playlist.difficulty}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1 text-sm text-green-400">
            <Sparkles className="h-4 w-4" />
            <span>{Math.round(playlist.leonardoRecommendationScore * 100)}%</span>
          </div>
          <div className="text-xs text-gray-500">{playlist.trackCount} tracks</div>
        </div>
      </div>

      <p className="text-gray-300 text-sm mb-4">{playlist.description}</p>

      {/* Neural Alignment Bars */}
      <div className="space-y-2">
        {Object.entries(playlist.neuralAlignment).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-2 text-xs">
            <span className="w-20 text-gray-400 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}:
            </span>
            <div className="flex-1 bg-gray-700 rounded-full h-1.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value * 100}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-gradient-to-r from-green-400 to-blue-500 h-1.5 rounded-full"
              />
            </div>
            <span className="text-gray-400 w-8">{Math.round(value * 100)}%</span>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showPlaylistDetails === playlist.id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-gray-700"
          >
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-lg font-bold text-purple-400">{playlist.duration}min</div>
                <div className="text-xs text-gray-400">Duración</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-lg font-bold text-yellow-400">{playlist.quantumResonance.toFixed(2)}</div>
                <div className="text-xs text-gray-400">Resonancia Quantum</div>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="text-sm font-semibold text-white mb-2">Objetivos de Aprendizaje:</h5>
              <div className="space-y-1">
                {playlist.learningObjectives.slice(0, 3).map((objective, index) => (
                  <div key={index} className="flex items-center space-x-2 text-xs text-gray-300">
                    <Target className="h-3 w-3 text-green-400" />
                    <span>{objective}</span>
                  </div>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-2 bg-spotify-green text-black font-medium rounded-lg hover:bg-green-400 transition-colors"
            >
              Reproducir Playlist
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const SessionControls = () => (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-spotify-green to-green-500 rounded-full">
                            <Disc className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">DJ Educativo</h3>
            <p className="text-gray-400">Música inteligente para estudiar</p>
          </div>
        </div>
        
        {currentSession && (
          <div className="text-right">
            <div className="text-sm text-gray-400">Progreso</div>
            <div className="text-lg font-bold text-spotify-green">{Math.round(getSessionProgress())}%</div>
          </div>
        )}
      </div>

      {currentSession ? (
        <div className="space-y-4">
          {/* Current Track Info */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-spotify-green to-green-600 rounded-lg flex items-center justify-center">
                <Music className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white">
                  {currentSession.currentTrack?.name || 'Track Educativo'}
                </h4>
                <p className="text-sm text-gray-400">
                  {currentSession.currentTrack?.artist || 'Artista Curado'}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span>Energía: {Math.round((currentSession.currentTrack?.energy || 0.7) * 100)}%</span>
                  <span>Tempo: {currentSession.currentTrack?.tempo || 120} BPM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Session Progress Bar */}
          <div className="bg-gray-800 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getSessionProgress()}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-spotify-green to-green-400 h-2 rounded-full"
            />
          </div>

          {/* Session Metrics */}
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(currentSession.sessionMetrics).map(([key, value]) => (
              <div key={key} className="text-center p-3 bg-gray-800/30 rounded-lg">
                <div className="text-lg font-bold text-spotify-green">
                  {typeof value === 'number' ? Math.round(value * 100) : value}%
                </div>
                <div className="text-xs text-gray-400 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </div>
            ))}
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleSession}
              className="p-3 bg-spotify-green text-black rounded-full hover:bg-green-400 transition-colors"
            >
              {currentSession.status === 'active' ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors"
            >
                              <FastForward className="h-5 w-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={stopSession}
              className="p-3 bg-red-600 text-white rounded-full hover:bg-red-500 transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <rect x="6" y="6" width="8" height="8" />
              </svg>
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Mood Selection */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Selecciona tu estado de ánimo:</h4>
            <div className="grid grid-cols-5 gap-3">
              {moods.map((mood) => (
                <motion.button
                  key={mood.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`p-3 rounded-lg text-center transition-all ${
                    selectedMood === mood.id
                      ? `bg-gradient-to-r ${mood.color} text-white shadow-lg`
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-1">{mood.icon}</div>
                  <div className="text-xs font-medium">{mood.label}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Duration Selection */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Duración de la sesión:</h4>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="15"
                max="180"
                step="15"
                value={sessionDuration}
                onChange={(e) => setSessionDuration(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-white font-medium w-16">{sessionDuration}min</span>
            </div>
          </div>

          {/* Start Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => startEducationalDJ(selectedMood, sessionDuration)}
            className="w-full py-4 bg-gradient-to-r from-spotify-green to-green-500 text-black font-bold rounded-lg hover:from-green-400 hover:to-green-600 transition-all shadow-lg"
          >
            <div className="flex items-center justify-center space-x-2">
              <Play className="h-5 w-5" />
              <span>Iniciar Sesión DJ</span>
            </div>
          </motion.button>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="text-center"
        >
          <div className="p-6 bg-gradient-to-r from-spotify-green to-green-500 rounded-full mb-4">
            <Headphones className="h-12 w-12 text-black" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Inicializando Ecosistema Spotify-PAES...
          </h3>
          <p className="text-gray-400">
            Preparando experiencia musical educativa personalizada
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center p-8 bg-red-900/20 border border-red-500 rounded-xl">
          <h3 className="text-xl font-bold text-red-300 mb-4">
            Error en Ecosistema Spotify-PAES
          </h3>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="px-6 py-3 bg-spotify-green text-black rounded-lg hover:bg-green-400 transition-colors font-medium"
          >
            Reintentar Conexión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-spotify-green to-green-500 rounded-xl">
              <div className="flex items-center space-x-2">
                <Music className="h-8 w-8 text-black" />
                <Zap className="h-6 w-6 text-black" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-spotify-green to-green-400 bg-clip-text text-transparent">
                Ecosistema Spotify-PAES
              </h1>
              <p className="text-gray-400">Música inteligente que potencia tu aprendizaje</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {metrics && (
              <div className="text-right">
                <div className="text-2xl font-bold text-spotify-green">{metrics.totalSessionsCompleted}</div>
                <div className="text-sm text-gray-400">Sesiones Completadas</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Session Controls */}
        <div className="lg:col-span-1">
          <SessionControls />
          
          {/* Metrics Summary */}
          {metrics && (
            <div className="mt-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-spotify-green" />
                Métricas Musicales
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Tiempo Total:</span>
                  <span className="text-white font-medium">{metrics.totalListeningTime}min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Estado Óptimo:</span>
                  <span className="text-spotify-green font-medium capitalize">{getOptimalMood()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Sincronización Neural:</span>
                  <span className="text-purple-400 font-medium">
                    {Math.round(metrics.neuralSynchronization * 100)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Aceleración de Aprendizaje:</span>
                  <span className="text-yellow-400 font-medium">
                    {Math.round(metrics.learningAcceleration * 100)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Playlists */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Playlists Curadas por Leonardo IA</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => getLeonardoCuratedPlaylists()}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
            >
              <Shuffle className="h-4 w-4" />
              <span>Actualizar</span>
            </motion.button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {curatedPlaylists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>

          {curatedPlaylists.length === 0 && (
            <div className="text-center py-16">
              <div className="p-6 bg-gray-800/50 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Music className="h-12 w-12 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No hay playlists disponibles
              </h3>
              <p className="text-gray-500 mb-4">
                Leonardo IA está preparando tus playlists personalizadas
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => getLeonardoCuratedPlaylists()}
                className="px-6 py-3 bg-spotify-green text-black rounded-lg hover:bg-green-400 transition-colors font-medium"
              >
                Generar Playlists
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Playlist Highlight */}
      {getRecommendedPlaylist() && (
        <div className="mt-8 bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-green-900/50 rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center space-x-3 mb-4">
            <Sparkles className="h-6 w-6 text-yellow-400" />
            <h3 className="text-xl font-bold text-white">Recomendación Leonardo IA</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div>
              <h4 className="text-lg font-semibold text-spotify-green mb-2">
                {getRecommendedPlaylist()?.name}
              </h4>
              <p className="text-gray-300 mb-4">
                {getRecommendedPlaylist()?.description}
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-purple-400">
                  🧠 Resonancia: {getRecommendedPlaylist()?.quantumResonance.toFixed(2)}
                </span>
                <span className="text-yellow-400">
                  ⭐ Score: {Math.round((getRecommendedPlaylist()?.leonardoRecommendationScore || 0) * 100)}%
                </span>
              </div>
            </div>
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-spotify-green to-green-400 text-black font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Reproducir Ahora
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpotifyPAESDashboard;
