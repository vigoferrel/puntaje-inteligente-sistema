
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, Target, BookOpen, Activity, Settings,
  Zap, Trophy, Bell, User, Calendar, Calculator,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface UnifiedHeaderProps {
  currentTool: string;
  totalProgress: number;
  activeSubject: string;
  onToolChange: (tool: string) => void;
  onSubjectChange: (subject: string) => void;
  systemMetrics: {
    completedNodes: number;
    totalNodes: number;
    todayStudyTime: number;
    streakDays: number;
  };
}

const TOOLS = [
  { id: 'dashboard', label: 'Dashboard', icon: Activity },
  { id: 'lectoguia', label: 'LectoGuía', icon: Brain },
  { id: 'diagnostic', label: 'Diagnóstico', icon: Target },
  { id: 'exercises', label: 'Ejercicios', icon: BookOpen },
  { id: 'plan', label: 'Plan', icon: Trophy },
  { id: 'calendar', label: 'Calendario', icon: Calendar },
  { id: 'calculator', label: 'Calculadora', icon: Calculator },
  { id: 'financial', label: 'Becas', icon: DollarSign }
];

const SUBJECTS = [
  { code: 'COMPETENCIA_LECTORA', name: 'Competencia Lectora', color: 'bg-blue-500' },
  { code: 'MATEMATICA_1', name: 'Matemática M1', color: 'bg-green-500' },
  { code: 'MATEMATICA_2', name: 'Matemática M2', color: 'bg-purple-500' },
  { code: 'CIENCIAS', name: 'Ciencias', color: 'bg-orange-500' },
  { code: 'HISTORIA', name: 'Historia', color: 'bg-red-500' }
];

export const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
  currentTool,
  totalProgress,
  activeSubject,
  onToolChange,
  onSubjectChange,
  systemMetrics
}) => {
  const { profile, user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleToolNavigation = (toolId: string) => {
    if (toolId === 'calendar') {
      window.location.href = '/calendario';
      return;
    }
    if (toolId === 'financial') {
      window.location.href = '/financial';
      return;
    }
    onToolChange(toolId);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 border-b border-white/10 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Top Row - Brand and User */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">EduPAES Pro</h1>
              <p className="text-blue-200 text-sm">Sistema Educativo Integrado</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Metrics */}
            <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-center">
                <div className="text-sm font-medium text-white">{systemMetrics.completedNodes}</div>
                <div className="text-xs text-blue-200">Nodos</div>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <div className="text-sm font-medium text-white">{systemMetrics.todayStudyTime}min</div>
                <div className="text-xs text-blue-200">Hoy</div>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <div className="text-sm font-medium text-white">{systemMetrics.streakDays}</div>
                <div className="text-xs text-blue-200">Racha</div>
              </div>
            </div>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-white hover:bg-white/10 relative"
            >
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-red-500"></Badge>
            </Button>

            {/* User Profile */}
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20"
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {profile?.name || user?.email || 'Usuario'}
                </span>
              </Button>
              
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{profile?.name || 'Usuario'}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={logout}
                    className="w-full justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cerrar Sesión
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle Row - Tools Navigation */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2 overflow-x-auto">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              const isActive = currentTool === tool.id;
              
              return (
                <Button
                  key={tool.id}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => handleToolNavigation(tool.id)}
                  className={`flex items-center gap-2 whitespace-nowrap ${
                    isActive 
                      ? 'bg-white text-slate-900 hover:bg-white/90' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tool.label}
                </Button>
              );
            })}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configuración
          </Button>
        </div>

        {/* Bottom Row - Subject Selection and Progress */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-white text-sm font-medium">Prueba:</span>
            <div className="flex gap-2 overflow-x-auto">
              {SUBJECTS.map((subject) => (
                <Button
                  key={subject.code}
                  variant={activeSubject === subject.code ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSubjectChange(subject.code)}
                  className={`text-xs whitespace-nowrap ${
                    activeSubject === subject.code
                      ? 'bg-white text-slate-900'
                      : 'border-white/30 text-white hover:bg-white/10'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${subject.color} mr-2`}></div>
                  {subject.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Global Progress */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium text-white">Progreso Global</div>
              <div className="text-xs text-blue-200">{Math.round(totalProgress)}% completado</div>
            </div>
            <div className="w-32">
              <Progress value={totalProgress} className="h-2" />
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-medium">
                {totalProgress > 80 ? 'Excelente' : totalProgress > 60 ? 'Bien' : 'Necesita refuerzo'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
