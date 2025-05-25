
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LayoutDashboard, 
  Brain, 
  Stethoscope, 
  Dumbbell, 
  ClipboardList,
  ArrowLeft,
  ExternalLink,
  Calendar,
  Calculator
} from 'lucide-react';

interface UnifiedHeaderProps {
  currentTool: string;
  totalProgress: number;
  activeSubject: string;
  onToolChange: (tool: string, context?: any) => void;
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

export const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
  currentTool,
  totalProgress,
  activeSubject,
  onToolChange,
  onSubjectChange,
  systemMetrics,
  navigationHistory = [],
  onGoBack
}) => {
  const tools = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, color: 'bg-blue-500' },
    { id: 'lectoguia', name: 'LectoGuía IA', icon: Brain, color: 'bg-purple-500' },
    { id: 'diagnostic', name: 'Diagnóstico', icon: Stethoscope, color: 'bg-green-500' },
    { id: 'exercises', name: 'Ejercicios', icon: Dumbbell, color: 'bg-orange-500' },
    { id: 'plan', name: 'Plan de Estudio', icon: ClipboardList, color: 'bg-red-500' }
  ];

  const externalTools = [
    { id: 'calendar', name: 'Calendario', icon: Calendar, url: '/calendario' },
    { id: 'financial', name: 'Centro Financiero', icon: Calculator, url: '/financial' }
  ];

  const subjects = [
    { code: 'COMPETENCIA_LECTORA', name: 'Comprensión Lectora', short: 'CL' },
    { code: 'MATEMATICA_1', name: 'Matemática M1', short: 'M1' },
    { code: 'MATEMATICA_2', name: 'Matemática M2', short: 'M2' },
    { code: 'CIENCIAS', name: 'Ciencias', short: 'CI' },
    { code: 'HISTORIA', name: 'Historia', short: 'HI' }
  ];

  const handleExternalTool = (url: string) => {
    window.open(url, '_blank');
  };

  const getToolDisplayName = (toolId: string) => {
    const tool = tools.find(t => t.id === toolId);
    return tool?.name || toolId;
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y Navegación Principal */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">PAES Pro</h1>
              <Badge variant="secondary" className="ml-2">v2.0</Badge>
            </div>
            
            {/* Botón de regreso */}
            {navigationHistory.length > 1 && onGoBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onGoBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {getToolDisplayName(navigationHistory[navigationHistory.length - 2])}
              </Button>
            )}
            
            {/* Navegación de herramientas */}
            <nav className="hidden md:flex space-x-2">
              {tools.map((tool) => {
                const Icon = tool.icon;
                const isActive = currentTool === tool.id;
                
                return (
                  <Button
                    key={tool.id}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onToolChange(tool.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {tool.name}
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* Información del Sistema y Herramientas Externas */}
          <div className="flex items-center space-x-4">
            {/* Selector de Materia */}
            <div className="hidden lg:flex items-center space-x-2">
              <span className="text-sm text-gray-600">Materia:</span>
              <select
                value={activeSubject}
                onChange={(e) => onSubjectChange(e.target.value)}
                className="text-sm border rounded px-2 py-1 bg-white"
              >
                {subjects.map((subject) => (
                  <option key={subject.code} value={subject.code}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Progreso Total */}
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-sm text-gray-600">Progreso:</span>
              <Progress value={totalProgress} className="w-20" />
              <span className="text-sm font-medium">{Math.round(totalProgress)}%</span>
            </div>

            {/* Métricas Rápidas */}
            <div className="hidden lg:flex items-center space-x-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-gray-600">Nodos:</span>
                <span className="font-medium">{systemMetrics.completedNodes}/{systemMetrics.totalNodes}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-600">Racha:</span>
                <span className="font-medium text-orange-600">{systemMetrics.streakDays}d</span>
              </div>
            </div>

            {/* Herramientas Externas */}
            <div className="flex items-center space-x-2">
              {externalTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Button
                    key={tool.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleExternalTool(tool.url)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden xl:inline">{tool.name}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Barra de contexto */}
        {currentTool !== 'dashboard' && (
          <div className="py-2 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                  Herramienta actual: <span className="font-medium">{getToolDisplayName(currentTool)}</span>
                </span>
                <span className="text-gray-600">
                  Materia: <span className="font-medium">{subjects.find(s => s.code === activeSubject)?.name}</span>
                </span>
              </div>
              
              {/* Rutas de navegación */}
              {navigationHistory.length > 1 && (
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>Ruta:</span>
                  {navigationHistory.slice(-3).map((tool, index, arr) => (
                    <span key={tool}>
                      {getToolDisplayName(tool)}
                      {index < arr.length - 1 && ' → '}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
