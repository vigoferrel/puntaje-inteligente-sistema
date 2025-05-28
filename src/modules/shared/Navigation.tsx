
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home,
  BookOpen,
  Target,
  Calendar,
  User
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const routes = [
    { path: '/', name: 'Hub', icon: Home },
    { path: '/lectoguia', name: 'LectoGuía', icon: BookOpen },
    { path: '/diagnostic', name: 'Diagnóstico', icon: Target },
    { path: '/planning', name: 'Planificación', icon: Calendar },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-black/80 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20">
        <div className="flex items-center gap-2">
          {routes.map((route) => {
            const Icon = route.icon;
            const isActive = location.pathname === route.path;
            
            return (
              <motion.div key={route.path} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  onClick={() => navigate(route.path)}
                  variant="ghost"
                  size="sm"
                  className={`
                    relative px-3 py-2 rounded-full transition-colors
                    ${isActive 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full"
                      initial={false}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
