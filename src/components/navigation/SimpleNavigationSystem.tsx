import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '@/contexts/SidebarContext';
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

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
  isNew?: boolean;
  submenu?: NavigationItem[];
  category: 'core' | 'advanced' | 'ecosystem' | 'admin';
}

const navigationConfig: NavigationItem[] = [
  // Core System
  {
    id: 'unified-hub',
    label: 'Hub Unificado',
    icon: Compass,
    href: '/',
    category: 'core'
  },
  {
    id: 'paes-universe',
    label: 'PAES Universe',
    icon: GraduationCap,
    href: '/paes-universe',
    category: 'core'
  },
  {
    id: 'diagnostic',
    label: 'Diagnóstico IA',
    icon: Brain,
    href: '/diagnostic',
    category: 'core',
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
    isNew: true
  },
  {
    id: 'gamification',
    label: 'Gamificación',
    icon: Trophy,
    href: '/gamification',
    category: 'advanced'
  },
  {
    id: 'real-time-analytics',
    label: 'Analytics Predictivos',
    icon: BarChart3,
    href: '/analytics',
    category: 'advanced',
    isNew: true
  },

  // Ecosystem
  {
    id: 'spotify-integration',
    label: 'Música de Estudio',
    icon: Headphones,
    href: '/spotify-integration',
    category: 'ecosystem'
  },
  {
    id: '3d-dashboard',
    label: 'Dashboard 3D',
    icon: Eye,
    href: '/3d-dashboard',
    category: 'ecosystem',
    isNew: true
  },

  // Educational Content
  {
    id: 'lectoguia',
    label: 'LectoGuía',
    icon: BookOpen,
    href: '/lectoguia',
    category: 'core'
  },
  {
    id: 'financial',
    label: 'Centro Financiero',
    icon: Target,
    href: '/financial',
    category: 'core'
  },

  // Admin & Settings
  {
    id: 'settings',
    label: 'Configuración',
    icon: Settings,
    href: '/settings',
    category: 'admin'
  }
];

const SimpleNavigationSystem: React.FC = () => {
  const location = useLocation();
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [activeCategory, setActiveCategory] = useState<'core' | 'advanced' | 'ecosystem' | 'admin'>('core');

  const filteredItems = navigationConfig.filter(item => item.category === activeCategory);

  const isActiveRoute = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Menu Button - Visible en móvil y desktop */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 text-white hover:bg-white/20 transition-colors"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -320 }}
        animate={{ x: isSidebarOpen ? 0 : -320 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-80 transform transition-transform duration-300 ease-in-out",
          "bg-gradient-to-b from-slate-900 via-purple-900 to-indigo-900 border-r border-white/10 backdrop-blur-xl"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">PAES Pro</h1>
                <p className="text-xs text-white/60">Sistema Inteligente</p>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex border-b border-white/10">
            {(['core', 'advanced', 'ecosystem', 'admin'] as const).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                  activeCategory === category
                    ? "text-white bg-white/10 border-b-2 border-blue-500"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                {category === 'core' && 'Core'}
                {category === 'advanced' && 'IA'}
                {category === 'ecosystem' && 'Eco'}
                {category === 'admin' && 'Admin'}
              </button>
            ))}
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              
              return (
                <div key={item.id}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                      isActive
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    )}
                    onClick={toggleSidebar}
                  >
                    <Icon className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-blue-400" : "text-white/60 group-hover:text-white"
                    )} />
                    <span className="font-medium">{item.label}</span>
                    {item.isNew && (
                      <span className="ml-auto px-2 py-1 text-xs bg-green-500 text-white rounded-full">
                        Nuevo
                      </span>
                    )}
                    {item.badge && (
                      <span className="ml-auto px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                  
                  {/* Submenu */}
                  {item.submenu && isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="ml-8 mt-2 space-y-1"
                    >
                      {item.submenu.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isSubActive = isActiveRoute(subItem.href);
                        
                        return (
                          <Link
                            key={subItem.id}
                            to={subItem.href}
                            className={cn(
                              "flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors",
                              isSubActive
                                ? "bg-blue-500/20 text-blue-300"
                                : "text-white/50 hover:text-white hover:bg-white/5"
                            )}
                            onClick={toggleSidebar}
                          >
                            <SubIcon className="w-4 h-4" />
                            <span className="text-sm">{subItem.label}</span>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center justify-between text-white/60 text-sm">
              <span>Sistema Operativo</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Online</span>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Margin */}
      <div className="lg:ml-80" />
    </>
  );
};

export default SimpleNavigationSystem;
