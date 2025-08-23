import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Trophy,
  BarChart3,
  Headphones,
  BookOpen,
  Users,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  Sparkles,
  Zap,
  Target,
  Compass,
  Star,
  GraduationCap,
  Music,
  Eye,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGamification } from '@/hooks/use-gamification';
import { useAIRecommendations } from '@/hooks/use-ai-recommendations';
import { useRealTimeAnalytics } from '@/hooks/use-real-time-analytics';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
  isNew?: boolean;
  submenu?: NavigationItem[];
  category: 'core' | 'advanced' | 'ecosystem' | 'admin';
  aiRelevance?: number;
  requiredLevel?: number;
}

const navigationConfig: NavigationItem[] = [
  // Core System
  {
    id: 'unified-hub',
    label: 'Hub Unificado',
    icon: Compass,
    href: '/',
    category: 'core',
    aiRelevance: 10
  },
  {
    id: 'paes-universe',
    label: 'PAES Universe',
    icon: GraduationCap,
    href: '/paes-universe',
    category: 'core',
    aiRelevance: 9
  },
  {
    id: 'diagnostic',
    label: 'Diagnóstico IA',
    icon: Brain,
    href: '/diagnostic',
    category: 'core',
    aiRelevance: 9,
    submenu: [
      { id: 'diagnostic-intelligence', label: 'Centro de Inteligencia', icon: Eye, href: '/diagnostic/intelligence', category: 'advanced' },
      { id: 'diagnostic-combat', label: 'Arena de Combate', icon: Zap, href: '/diagnostic/combat', category: 'advanced' }
    ]
  },

  // Advanced AI Systems
  {
    id: 'ai-recommendations',
    label: 'Recomendaciones IA',
    icon: Sparkles,
    href: '/ai-recommendations',
    category: 'advanced',
    isNew: true,
    aiRelevance: 10
  },
  {
    id: 'gamification',
    label: 'Gamificación',
    icon: Trophy,
    href: '/gamification',
    category: 'advanced',
    aiRelevance: 8
  },
  {
    id: 'real-time-analytics',
    label: 'Analytics Predictivos',
    icon: BarChart3,
    href: '/analytics',
    category: 'advanced',
    isNew: true,
    aiRelevance: 9
  },
  {
    id: 'holographic-dashboard',
    label: 'Dashboard 3D',
    icon: Eye,
    href: '/3d-dashboard',
    category: 'advanced',
    isNew: true,
    aiRelevance: 7,
    requiredLevel: 5
  },

  // Ecosystem Integration
  {
    id: 'spotify-paes',
    label: 'Spotify PAES',
    icon: Music,
    href: '/spotify-integration',
    category: 'ecosystem',
    isNew: true,
    aiRelevance: 6,
    submenu: [
      { id: 'music-sessions', label: 'Sesiones Musicales', icon: Headphones, href: '/spotify/sessions', category: 'ecosystem' },
      { id: 'adaptive-playlists', label: 'Listas Adaptativas', icon: Activity, href: '/spotify/playlists', category: 'ecosystem' }
    ]
  },
  {
    id: 'evaluations',
    label: 'Evaluaciones',
    icon: Target,
    href: '/evaluations',
    category: 'core',
    aiRelevance: 8
  },

  // Subject Areas
  {
    id: 'subjects',
    label: 'Materias',
    icon: BookOpen,
    href: '/subjects',
    category: 'core',
    aiRelevance: 7,
    submenu: [
      { id: 'mathematics', label: 'Matemáticas', icon: Target, href: '/mathematics', category: 'core' },
      { id: 'sciences', label: 'Ciencias', icon: Target, href: '/sciences', category: 'core' },
      { id: 'history', label: 'Historia', icon: Target, href: '/history', category: 'core' },
      { id: 'lectoguia', label: 'LectoGuía', icon: BookOpen, href: '/lectoguia', category: 'core' }
    ]
  }
];

export const AdvancedNavigationSystem: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const { gameStats } = useGamification();
  const { recommendations } = useAIRecommendations();
  const { metrics } = useRealTimeAnalytics();

  // Calcular items relevantes basado en IA y progreso del usuario
  const getRelevantItems = () => {
    const userLevel = gameStats?.level || 1;
    return navigationConfig
      .filter(item => !item.requiredLevel || userLevel >= item.requiredLevel)
      .sort((a, b) => (b.aiRelevance || 0) - (a.aiRelevance || 0));
  };

  const filteredItems = getRelevantItems().filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Detectar item activo
  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  // Cerrar sidebar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveSubmenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Categorizar items
  const categorizedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, NavigationItem[]>);

  const CategoryHeader = ({ category }: { category: string }) => {
    const titles = {
      core: 'Sistema Principal',
      advanced: 'IA Avanzada',
      ecosystem: 'Ecosistema',
      admin: 'Administración'
    };

    const colors = {
      core: 'text-blue-400',
      advanced: 'text-purple-400',
      ecosystem: 'text-green-400',
      admin: 'text-orange-400'
    };

    return (
      <div className="px-3 py-2">
        <h3 className={`text-xs font-semibold uppercase tracking-wider ${colors[category as keyof typeof colors]}`}>
          {titles[category as keyof typeof titles]}
        </h3>
      </div>
    );
  };

  const NavigationLink = ({ item }: { item: NavigationItem }) => {
    const handleClick = (e: React.MouseEvent) => {
      if (item.submenu) {
        e.preventDefault();
        setActiveSubmenu(activeSubmenu === item.id ? null : item.id);
      } else {
        setIsOpen(false);
        navigate(item.href);
      }
    };

    const isItemActive = isActive(item.href);
    const hasActiveSubmenu = item.submenu?.some(sub => isActive(sub.href));

    return (
      <div className="relative">
        <Link
          to={item.href}
          onClick={handleClick}
          className={cn(
            'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            'hover:bg-white/10 hover:text-white group relative',
            isItemActive || hasActiveSubmenu
              ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white shadow-lg'
              : 'text-gray-300'
          )}
        >
          <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
          <span className="flex-1">{item.label}</span>
          
          {/* Badges e indicadores */}
          <div className="flex items-center space-x-1">
            {item.isNew && (
              <span className="px-1.5 py-0.5 text-xs bg-green-500 text-white rounded-full">
                Nuevo
              </span>
            )}
            {item.badge && item.badge > 0 && (
              <span className="px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                {item.badge}
              </span>
            )}
            {item.aiRelevance && item.aiRelevance >= 9 && (
              <Star className="h-3 w-3 text-yellow-400" />
            )}
          </div>

          {/* Efecto de brillo para elementos activos */}
          {(isItemActive || hasActiveSubmenu) && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </Link>

        {/* Submenu */}
        <AnimatePresence>
          {item.submenu && activeSubmenu === item.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="ml-6 mt-2 space-y-1"
            >
              {item.submenu.map((subItem) => (
                <Link
                  key={subItem.id}
                  to={subItem.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-lg text-sm transition-colors',
                    'hover:bg-white/10 hover:text-white',
                    isActive(subItem.href)
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400'
                  )}
                >
                  <subItem.icon className="mr-3 h-4 w-4" />
                  {subItem.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-black/20 backdrop-blur-sm rounded-lg text-white hover:bg-black/30 transition-colors lg:hidden"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        <motion.div
          ref={sidebarRef}
          initial={{ x: -300 }}
          animate={{ x: isOpen ? 0 : -300 }}
          exit={{ x: -300 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className={cn(
            'fixed left-0 top-0 h-full w-80 z-50',
            'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900',
            'border-r border-white/10 shadow-2xl',
            'lg:translate-x-0 lg:static lg:z-auto'
          )}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-white text-lg">PAES AI</h1>
                  <p className="text-xs text-gray-400">Sistema Inteligente</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors relative">
                  <Bell className="h-5 w-5 text-gray-300" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* User Stats Quick View */}
            {gameStats && (
              <div className="mt-4 p-3 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Nivel {gameStats.level}</span>
                  <span className="text-yellow-400">{gameStats.totalPoints} pts</span>
                </div>
                <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                    style={{ width: `${gameStats.nextLevelProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar funcionalidad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <nav className="space-y-1">
              {Object.entries(categorizedItems).map(([category, items]) => (
                <div key={category} className="space-y-1">
                  <CategoryHeader category={category} />
                  {items.map((item) => (
                    <NavigationLink key={item.id} item={item} />
                  ))}
                </div>
              ))}
            </nav>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <Link
              to="/settings"
              className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="mr-3 h-5 w-5" />
              Configuración
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};
