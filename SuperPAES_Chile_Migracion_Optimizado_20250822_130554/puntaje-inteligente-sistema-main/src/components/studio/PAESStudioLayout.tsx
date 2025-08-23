/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearningPathEngine } from '../../hooks/useLearningPathEngine';
import { useIntelligentNotifications } from '../../hooks/useIntelligentNotifications';
import { useAuth } from '../../hooks/useAuth';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  Search, 
  Bell, 
  Trophy, 
  Calendar,
  BookOpen,
  Target,
  Zap,
  Brain,
  Star,
  Home,
  User,
  Settings
} from 'lucide-react';

interface PAESStudioLayoutProps {
  children: React.ReactNode;
}

export const PAESStudioLayout: React.FC<PAESStudioLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const { currentSession, startSession, endSession } = useLearningPathEngine(user?.id || '');
  const { notifications, unreadCount, markAsRead } = useIntelligentNotifications();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('MatemÃƒÂ¡ticas - ÃƒÂlgebra BÃƒÂ¡sica');
  const [progress, setProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const sidebarItems = [
    { icon: Home, label: 'Inicio', path: '/', isActive: true },
    { icon: Search, label: 'Buscar', path: '/search' },
    { icon: Target, label: 'Mi Progreso', path: '/progress' },
    { icon: Calendar, label: 'Calendario', path: '/calendar' },
    { icon: Trophy, label: 'Logros', path: '/achievements' },
    { icon: Brain, label: 'DiagnÃƒÂ³sticos', path: '/diagnostics' },
    { icon: Zap, label: 'Competencias', path: '/competitions' }
  ];

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (!currentSession) {
        startSession('MAT', 'algebra-basica');
      }
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (currentSession && isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 1;
          return newProgress;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentSession, isPlaying]);

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white flex overflow-hidden">
      {/* Sidebar */}
      <motion.div 
        className="w-64 bg-black/20 backdrop-blur-xl border-r border-white/10 flex flex-col"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            PAES Studio
          </h1>
          <p className="text-sm text-gray-400 mt-1">Tu ecosistema de aprendizaje</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarItems.map((item, index) => (
            <motion.a
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 group ${
                item.isActive 
                  ? 'bg-white/20 text-white' 
                  : 'hover:bg-white/10 text-gray-300 hover:text-white'
              }`}
              whileHover={{ x: 5 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <item.icon className={`w-5 h-5 transition-colors ${
                item.isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
              }`} />
              <span className="transition-colors">
                {item.label}
              </span>
            </motion.a>
          ))}

          {/* Playlists Section */}
          <div className="pt-6 border-t border-white/10 mt-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-3 px-3">MIS MATERIAS</h3>
            <div className="space-y-1">
              {['MatemÃƒÂ¡ticas', 'Lenguaje', 'Historia', 'Ciencias'].map((subject, index) => (
                <motion.a
                  key={subject}
                  href={`/subject/${subject.toLowerCase()}`}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-all duration-200 group text-gray-400 hover:text-white"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm">{subject}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">{user?.email?.[0]?.toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.email}</p>
              <p className="text-xs text-gray-400">Estudiante Premium</p>
            </div>
            <Settings className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <motion.header 
          className="h-16 bg-black/20 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 flex-shrink-0"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Navigation Arrows */}
          <div className="flex items-center space-x-2">
            <button
              aria-label="Ir atrÃƒÂ¡s"
              className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              aria-label="Ir adelante"
              className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar materias, temas, ejercicios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <motion.button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </motion.button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    className="absolute right-0 top-12 w-80 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="p-4 border-b border-white/10">
                      <h3 className="font-semibold">Notificaciones</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 5).map((notification) => (
                          <div
                            key={notification.id}
                            className="p-3 border-b border-white/5 hover:bg-white/5 cursor-pointer"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                notification.isRead ? 'bg-gray-500' : 'bg-purple-500'
                              }`} />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{notification.title}</p>
                                <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-400">
                          No hay notificaciones
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
              <User className="w-4 h-4" />
            </div>
          </div>
        </motion.header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>

        {/* Now Learning Bar (Similar to Spotify's Now Playing) */}
        <AnimatePresence>
          {currentSession && (
            <motion.div
              className="h-20 bg-gradient-to-r from-purple-600 to-pink-600 border-t border-white/10 flex items-center justify-between px-6 flex-shrink-0"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Current Learning Info */}
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate">{currentTrack}</p>
                  <p className="text-sm text-white/70">
                    SesiÃƒÂ³n Activa Ã¢â‚¬Â¢ {Math.floor(progress / 60)}:{(progress % 60).toString().padStart(2, '0')}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-4 flex-shrink-0">
                <motion.button
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SkipBack className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  onClick={handlePlayPause}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-purple-600 hover:scale-105 transition-transform"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isPlaying ? <Pause className="w-5 h-5 ml-0.5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </motion.button>
                
                <motion.button
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SkipForward className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Progress and Volume */}
              <div className="flex items-center space-x-4 flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{Math.floor(progress / 60)}:{(progress % 60).toString().padStart(2, '0')}</span>
                  <div className="w-32 h-1 bg-white/30 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(progress / 1800) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className="text-sm">30:00</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4" />
                  <div className="w-16 h-1 bg-white/30 rounded-full">
                    <div className="w-3/4 h-full bg-white rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

