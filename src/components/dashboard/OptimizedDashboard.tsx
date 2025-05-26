
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Target, 
  BookOpen,
  Calendar,
  BarChart3,
  Sparkles,
  Users,
  Settings
} from 'lucide-react';

export const OptimizedDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const tools = [
    {
      id: 'lectoguia',
      title: 'LectoGuía IA',
      description: 'Sistema de comprensión lectora con IA',
      icon: Brain,
      path: '/lectoguia',
      color: 'from-blue-600 to-blue-700',
      badge: 'IA Avanzada'
    },
    {
      id: 'diagnostico',
      title: 'Diagnóstico Inteligente',
      description: 'Sistema de evaluación adaptativa',
      icon: Target,
      path: '/diagnostico',
      color: 'from-green-600 to-green-700',
      badge: 'Adaptativo'
    },
    {
      id: 'calendario',
      title: 'Calendario Cinematográfico',
      description: 'Planificación de estudios inteligente',
      icon: Calendar,
      path: '/calendario',
      color: 'from-purple-600 to-purple-700',
      badge: 'Planificación'
    },
    {
      id: 'superpaes',
      title: 'SuperPAES',
      description: 'Sistema completo de preparación PAES',
      icon: Sparkles,
      path: '/superpaes',
      color: 'from-yellow-600 to-orange-600',
      badge: 'Completo'
    },
    {
      id: 'backend',
      title: 'Backend Dashboard',
      description: 'Exploración de datos y métricas',
      icon: BarChart3,
      path: '/backend',
      color: 'from-gray-600 to-gray-700',
      badge: 'Datos'
    },
    {
      id: 'admin',
      title: 'Panel Administrativo',
      description: 'Gestión y control de costos OpenRouter',
      icon: Settings,
      path: '/admin',
      color: 'from-red-600 to-red-700',
      badge: 'Admin'
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Brain className="w-12 h-12 text-cyan-400" />
              <div>
                <CardTitle className="text-white text-4xl">Sistema PAES</CardTitle>
                <p className="text-cyan-300 text-lg">Plataforma Integrada de Aprendizaje</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <Badge variant="outline" className="text-green-400 border-green-400">
                <Users className="w-4 h-4 mr-1" />
                Usuario: {user?.email || 'Invitado'}
              </Badge>
              <Badge variant="outline" className="text-purple-400 border-purple-400">
                <Sparkles className="w-4 h-4 mr-1" />
                Sistema Activo
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group"
            >
              <Card className="bg-black/40 backdrop-blur-xl border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${tool.color}`}>
                      <tool.icon className="w-8 h-8 text-white" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {tool.badge}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    {tool.description}
                  </p>
                  
                  <Button
                    onClick={() => handleNavigation(tool.path)}
                    className={`w-full bg-gradient-to-r ${tool.color} hover:opacity-90 transition-all duration-200`}
                  >
                    Acceder
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats */}
        <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Estado del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">Activo</div>
                <div className="text-sm text-gray-300">Sistema</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">6</div>
                <div className="text-sm text-gray-300">Herramientas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">24/7</div>
                <div className="text-sm text-gray-300">Disponibilidad</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">IA</div>
                <div className="text-sm text-gray-300">Potenciado</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
