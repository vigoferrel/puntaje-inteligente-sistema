
import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UnifiedButton } from '@/components/ui/unified-button';
import { useNeuralIntegration } from '@/hooks/use-neural-integration';
import { 
  Brain, 
  Target, 
  BookOpen, 
  Calculator,
  FlaskConical,
  Scroll,
  DollarSign,
  Calendar,
  TrendingUp,
  Zap,
  ArrowRight,
  Globe
} from 'lucide-react';

interface UnifiedEducationalHubProps {
  userId: string;
  onNavigateToTool?: (tool: string) => void;
}

interface EducationalTool {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  route: string;
  color: string;
  progress?: number;
  isRecommended?: boolean;
  category: 'core' | 'support' | 'analysis';
}

export const UnifiedEducationalHub: React.FC<UnifiedEducationalHubProps> = ({
  userId
}) => {
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const neural = useNeuralIntegration('dashboard', ['navigation', 'tool_selection'], {
    userId,
    selectedTool,
    hubVersion: 'v2.0'
  });

  const educationalTools: EducationalTool[] = useMemo(() => [
    {
      id: 'diagnostic',
      name: 'Diagnóstico PAES',
      description: 'Evaluación integral de tu nivel actual',
      icon: Target,
      route: '/diagnostic',
      color: 'from-blue-500 to-cyan-500',
      progress: 0,
      isRecommended: true,
      category: 'analysis'
    },
    {
      id: 'lectoguia',
      name: 'Competencia Lectora',
      description: 'Mejora tu comprensión textual',
      icon: BookOpen,
      route: '/lectoguia',
      color: 'from-purple-500 to-indigo-500',
      progress: 35,
      category: 'core'
    },
    {
      id: 'mathematics',
      name: 'Matemáticas',
      description: 'M1 y M2 con ejercicios adaptativos',
      icon: Calculator,
      route: '/mathematics',
      color: 'from-green-500 to-emerald-500',
      progress: 28,
      category: 'core'
    },
    {
      id: 'sciences',
      name: 'Ciencias',
      description: 'Física, Química y Biología',
      icon: FlaskConical,
      route: '/sciences',
      color: 'from-violet-500 to-purple-500',
      progress: 12,
      category: 'core'
    },
    {
      id: 'history',
      name: 'Historia',
      description: 'Ciencias Sociales y análisis crítico',
      icon: Scroll,
      route: '/history',
      color: 'from-orange-500 to-red-500',
      progress: 8,
      category: 'core'
    },
    {
      id: 'financial',
      name: 'Centro Financiero',
      description: 'Planificación financiera y becas',
      icon: DollarSign,
      route: '/financial',
      color: 'from-cyan-500 to-teal-500',
      progress: 0,
      category: 'support'
    }
  ], []);

  const handleToolNavigation = useCallback((tool: string) => {
    const selectedToolData = educationalTools.find(t => t.id === tool);
    if (!selectedToolData) return;

    setIsTransitioning(true);
    setSelectedTool(tool);
    
    // Navegación real usando React Router
    setTimeout(() => {
      navigate(selectedToolData.route);
      neural.broadcastUserAction('NAVIGATE_TO_TOOL', { 
        tool, 
        route: selectedToolData.route,
        userId 
      });
    }, 300);
  }, [navigate, neural, educationalTools, userId]);

  const recommendedTools = useMemo(() => 
    educationalTools.filter(tool => tool.isRecommended)
  , [educationalTools]);

  const coreTools = useMemo(() => 
    educationalTools.filter(tool => tool.category === 'core')
  , [educationalTools]);

  const supportTools = useMemo(() => 
    educationalTools.filter(tool => tool.category === 'support')
  , [educationalTools]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              Hub Educativo PAES
            </h1>
          </div>
          <p className="text-white/80 text-xl max-w-3xl mx-auto">
            Plataforma integral de preparación para las Pruebas de Acceso a la Educación Superior
          </p>
        </motion.div>

        {/* Herramientas Recomendadas */}
        {recommendedTools.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Recomendado para Ti
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendedTools.map((tool, index) => {
                    const Icon = tool.icon;
                    return (
                      <motion.div
                        key={tool.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <UnifiedButton
                          onClick={() => handleToolNavigation(tool.id)}
                          className={`w-full h-32 bg-gradient-to-r ${tool.color} hover:opacity-90 transition-all p-6 flex flex-col items-center justify-center gap-3 relative overflow-hidden`}
                          cinematicEffect
                        >
                          <Badge className="absolute top-2 right-2 bg-yellow-400 text-black text-xs">
                            Recomendado
                          </Badge>
                          <Icon className="w-8 h-8 text-white" />
                          <div className="text-center">
                            <div className="text-white font-bold text-lg">{tool.name}</div>
                            <div className="text-white/80 text-sm">{tool.description}</div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-white" />
                        </UnifiedButton>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Pruebas PAES Core */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Pruebas PAES Obligatorias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {coreTools.map((tool, index) => {
                  const Icon = tool.icon;
                  return (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <UnifiedButton
                        onClick={() => handleToolNavigation(tool.id)}
                        className={`w-full h-28 bg-gradient-to-r ${tool.color} hover:opacity-90 transition-all p-4 flex items-center gap-4 relative`}
                        cinematicEffect
                      >
                        <Icon className="w-6 h-6 text-white flex-shrink-0" />
                        <div className="flex-1 text-left">
                          <div className="text-white font-bold">{tool.name}</div>
                          <div className="text-white/80 text-sm">{tool.description}</div>
                          {tool.progress !== undefined && (
                            <div className="mt-2">
                              <div className="w-full bg-white/20 rounded-full h-2">
                                <div 
                                  className="bg-white rounded-full h-2 transition-all"
                                  style={{ width: `${tool.progress}%` }}
                                />
                              </div>
                              <div className="text-white/60 text-xs mt-1">{tool.progress}% completado</div>
                            </div>
                          )}
                        </div>
                        <ArrowRight className="w-5 h-5 text-white" />
                      </UnifiedButton>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Herramientas de Apoyo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Herramientas de Apoyo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {supportTools.map((tool, index) => {
                  const Icon = tool.icon;
                  return (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <UnifiedButton
                        onClick={() => handleToolNavigation(tool.id)}
                        className={`w-full h-24 bg-gradient-to-r ${tool.color} hover:opacity-90 transition-all p-4 flex items-center gap-4`}
                        cinematicEffect
                      >
                        <Icon className="w-6 h-6 text-white" />
                        <div className="flex-1 text-left">
                          <div className="text-white font-bold">{tool.name}</div>
                          <div className="text-white/80 text-sm">{tool.description}</div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-white" />
                      </UnifiedButton>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Acceso Rápido al Universo PAES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <UnifiedButton
                onClick={() => navigate('/paes-universe')}
                className="w-full h-20 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:opacity-90 transition-all p-6 flex items-center justify-center gap-4"
                cinematicEffect
              >
                <Globe className="w-8 h-8 text-white" />
                <div className="text-center">
                  <div className="text-white font-bold text-xl">Universo PAES 3D</div>
                  <div className="text-white/80">Experiencia inmersiva de aprendizaje</div>
                </div>
                <ArrowRight className="w-6 h-6 text-white" />
              </UnifiedButton>
            </CardContent>
          </Card>
        </motion.div>

        {/* Transición visual */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <div className="text-white text-center">
                <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
                <div>Navegando...</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
