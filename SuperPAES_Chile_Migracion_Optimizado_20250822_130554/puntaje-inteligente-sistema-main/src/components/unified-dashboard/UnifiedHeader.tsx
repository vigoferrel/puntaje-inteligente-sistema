/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../../types/core';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { 
  LayoutDashboard, 
  Brain, 
  Stethoscope, 
  Dumbbell, 
  ClipboardList,
  ArrowLeft,
  ExternalLink,
  Calendar,
  Calculator,
  Sparkles,
  Zap
} from 'lucide-react';

interface UnifiedHeaderProps {
  currentTool: string;
  totalProgress: number;
  activeSubject: string;
  onToolChange: (tool: string, context?: unknown) => void;
  onSubjectChange: (subject: string) => void;
  systemMetrics: {
    completedNodes: number;
    totalNodes: number;
    todayStudyTime: number;
    streakDays: number;
  };
  navigationHistory?: string[];
  onGoBack?: () => void;
}

export const UnifiedHeader: FC<UnifiedHeaderProps> = ({
  currentTool,
  totalProgress,
  activeSubject,
  onToolChange,
  onSubjectChange,
  systemMetrics,
  navigationHistory = [],
  onGoBack
}) => {
  const navigate = useNavigate();
  const tools = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-cyan-500' },
    { id: 'lectoguia', name: 'LectoGuÃ­a IA', icon: Brain, color: 'from-purple-500 to-pink-500' },
    { id: 'diagnostic', name: 'DiagnÃ³stico', icon: Stethoscope, color: 'from-green-500 to-emerald-500' },
    { id: 'exercises', name: 'Ejercicios', icon: Dumbbell, color: 'from-orange-500 to-red-500' },
    { id: 'plan', name: 'Plan de Estudio', icon: ClipboardList, color: 'from-indigo-500 to-purple-500' }
  ];

  const externalTools = [
    { id: 'calendar', name: 'Calendario', icon: Calendar, route: '/calendario' },
    { id: 'financial', name: 'Centro Financiero', icon: Calculator, route: '/financial' }
  ];

  const subjects = [
    { code: 'COMPETENCIA_LECTORA', name: 'ComprensiÃ³n Lectora', short: 'CL', color: 'from-blue-400 to-cyan-400' },
    { code: 'MATEMATICA_1', name: 'MatemÃ¡tica M1', short: 'M1', color: 'from-green-400 to-emerald-400' },
    { code: 'MATEMATICA_2', name: 'MatemÃ¡tica M2', short: 'M2', color: 'from-purple-400 to-violet-400' },
    { code: 'CIENCIAS', name: 'Ciencias', short: 'CI', color: 'from-orange-400 to-red-400' },
    { code: 'HISTORIA', name: 'Historia', short: 'HI', color: 'from-pink-400 to-rose-400' }
  ];

  const handleExternalTool = (route: string) => {
    navigate(route);
  };

  const getToolDisplayName = (toolId: string) => {
    const tool = tools.find(t => t.id === toolId);
    return tool?.name || toolId;
  };

  const currentSubject = subjects.find(s => s.code === activeSubject) || subjects[0];

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="cinematic-header relative overflow-hidden"
    >
      {/* PartÃ­culas flotantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="cinematic-particle dynamic-particle"
            data-left={`${Math.random() * 100}%`}
            data-animation-delay={`${Math.random() * 15}s`}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-20">
          {/* Logo y NavegaciÃ³n Principal */}
          <div className="flex items-center space-x-8">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <h1 className="text-2xl font-bold cinematic-gradient-text">PAES Pro</h1>
                <Sparkles className="w-4 h-4 absolute -top-1 -right-6 text-yellow-400 animate-pulse" />
              </div>
              <Badge className="ml-3 bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-400/50">
                v2.0 Elite
              </Badge>
            </motion.div>
            
            {/* BotÃ³n de regreso cinematogrÃ¡fico */}
            {navigationHistory.length > 1 && onGoBack && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onGoBack}
                  className="cinematic-button flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {getToolDisplayName(navigationHistory[navigationHistory.length - 2])}
                </Button>
              </motion.div>
            )}
            
            {/* NavegaciÃ³n de herramientas cinematogrÃ¡fica */}
            <nav className="hidden lg:flex space-x-3">
              {tools.map((tool) => {
                const Icon = tool.icon;
                const isActive = currentTool === tool.id;
                
                return (
                  <motion.div
                    key={tool.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      onClick={() => onToolChange(tool.id)}
                      className={`relative flex items-center gap-2 transition-all duration-300 ${
                        isActive 
                          ? `bg-gradient-to-r ${tool.color} shadow-lg shadow-blue-500/25` 
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tool.name}
                      {isActive && (
                        <motion.div
                          layoutId="activeToolIndicator"
                          className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-md"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Button>
                  </motion.div>
                );
              })}
            </nav>
          </div>

          {/* Panel de Estado y Herramientas */}
          <div className="flex items-center space-x-6">
            {/* Selector de Materia CinematogrÃ¡fico */}
            <motion.div 
              className="hidden xl:flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-sm text-white/70 font-medium">Materia Activa:</span>
              <div className="relative">
                <select
                  value={activeSubject}
                  onChange={(e) => onSubjectChange(e.target.value)}
                  className="cinematic-glass text-sm px-4 py-2 rounded-lg bg-transparent text-white border-0 focus:ring-2 focus:ring-cyan-400/50 appearance-none cursor-pointer min-w-[180px]"
                >
                  {subjects.map((subject) => (
                    <option key={subject.code} value={subject.code} className="bg-slate-800 text-white">
                      {subject.name}
                    </option>
                  ))}
                </select>
                <div className={`absolute left-2 top-2 w-2 h-2 rounded-full bg-gradient-to-r ${currentSubject.color}`} />
              </div>
            </motion.div>

            {/* Progreso CinematogrÃ¡fico */}
            <motion.div 
              className="hidden sm:flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-sm text-white/70 font-medium">Progreso:</span>
              <div className="relative">
                <Progress 
                  value={totalProgress} 
                  className="w-24 h-2 bg-white/10 cinematic-scanner" 
                />
                <span className="text-sm font-bold text-cyan-400 ml-2">
                  {Math.round(totalProgress)}%
                </span>
              </div>
            </motion.div>

            {/* MÃ©tricas de Sistema */}
            <div className="hidden lg:flex items-center space-x-4 text-sm">
              <motion.div 
                className="flex items-center gap-2 cinematic-glass px-3 py-2 rounded-lg"
                whileHover={{ scale: 1.05 }}
              >
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-white/70">Nodos:</span>
                <span className="font-bold text-cyan-400">
                  {systemMetrics.completedNodes}/{systemMetrics.totalNodes}
                </span>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-2 cinematic-glass px-3 py-2 rounded-lg"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-white/70">Racha:</span>
                <span className="font-bold text-orange-400 cinematic-text-glow">
                  {systemMetrics.streakDays}d
                </span>
              </motion.div>
            </div>

            {/* Herramientas Externas CinematogrÃ¡ficas */}
            <div className="flex items-center space-x-2">
              {externalTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <motion.div
                    key={tool.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExternalTool(tool.route)}
                      className="cinematic-button flex items-center gap-2 border-cyan-400/30 hover:border-cyan-400/60"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden xl:inline">{tool.name}</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Barra de contexto cinematogrÃ¡fica */}
        {currentTool !== 'dashboard' && (
          <motion.div 
            className="py-3 border-t border-cyan-400/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <span className="text-white/60">Herramienta actual:</span>
                  <span className="font-semibold text-cyan-400 cinematic-text-glow">
                    {getToolDisplayName(currentTool)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-white/60">Materia:</span>
                  <Badge className={`bg-gradient-to-r ${currentSubject.color} text-white border-0`}>
                    {currentSubject.name}
                  </Badge>
                </div>
              </div>
              
              {/* Rutas de navegaciÃ³n cinematogrÃ¡ficas */}
              {navigationHistory.length > 1 && (
                <motion.div 
                  className="flex items-center space-x-2 text-xs text-white/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="cinematic-text-glow">Ruta:</span>
                  <div className="flex items-center space-x-1">
                    {navigationHistory.slice(-3).map((tool, index, arr) => (
                      <motion.span 
                        key={tool}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center"
                      >
                        <span className="text-cyan-300">{getToolDisplayName(tool)}</span>
                        {index < arr.length - 1 && (
                          <span className="mx-2 text-purple-400">â†’</span>
                        )}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Efecto de escaneo */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />
    </motion.header>
  );
};

