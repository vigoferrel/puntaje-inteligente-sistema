
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Calculator, 
  FlaskConical, 
  Scroll, 
  Brain,
  Target,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react';

// Importar los módulos de integración
import { MathematicsIntegration } from '@/components/paes-mathematics/MathematicsIntegration';
import { SciencesIntegration } from '@/components/paes-sciences/SciencesIntegration';
import { HistoryIntegration } from '@/components/paes-history/HistoryIntegration';
import { PAESCompetenciaLectoraIntegration } from '@/components/paes-unified/PAESCompetenciaLectoraIntegration';
import { QuickNavigationWidget } from './QuickNavigationWidget';

interface PAESModule {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  progress: number;
  color: string;
  priority: 'high' | 'medium' | 'low';
  projectedScore: number;
  criticalAreas: number;
  strengths: number;
}

const paesModules: PAESModule[] = [
  {
    id: 'competencia-lectora',
    name: 'Competencia Lectora',
    description: 'Comprensión y análisis textual',
    icon: BookOpen,
    progress: 78,
    color: 'from-blue-500 to-blue-600',
    priority: 'high',
    projectedScore: 680,
    criticalAreas: 2,
    strengths: 8
  },
  {
    id: 'matematica-1',
    name: 'Matemática M1',
    description: '7° básico a 2° medio',
    icon: Calculator,
    progress: 67,
    color: 'from-purple-500 to-purple-600',
    priority: 'high',
    projectedScore: 645,
    criticalAreas: 4,
    strengths: 6
  },
  {
    id: 'matematica-2',
    name: 'Matemática M2',
    description: '3° y 4° medio',
    icon: Calculator,
    progress: 54,
    color: 'from-indigo-500 to-indigo-600',
    priority: 'medium',
    projectedScore: 590,
    criticalAreas: 6,
    strengths: 4
  },
  {
    id: 'ciencias',
    name: 'Ciencias',
    description: 'Física, Química y Biología',
    icon: FlaskConical,
    progress: 72,
    color: 'from-green-500 to-green-600',
    priority: 'high',
    projectedScore: 670,
    criticalAreas: 3,
    strengths: 7
  },
  {
    id: 'historia',
    name: 'Historia y Ciencias Sociales',
    description: 'Pensamiento crítico e histórico',
    icon: Scroll,
    progress: 61,
    color: 'from-amber-500 to-amber-600',
    priority: 'medium',
    projectedScore: 615,
    criticalAreas: 5,
    strengths: 5
  }
];

export const BalancedPAESHub: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string>('overview');
  const [selectedModule, setSelectedModule] = useState<PAESModule | null>(null);

  const handleModuleSelect = (module: PAESModule) => {
    setSelectedModule(module);
    setActiveModule(module.id);
  };

  const renderModuleContent = () => {
    if (activeModule === 'overview') {
      return (
        <div className="space-y-8">
          {/* Métricas Generales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-cyan-400">68%</div>
                <div className="text-white/70 text-sm">Progreso General</div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400">640</div>
                <div className="text-white/70 text-sm">Puntaje Proyectado</div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-400">20</div>
                <div className="text-white/70 text-sm">Áreas Críticas</div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">30</div>
                <div className="text-white/70 text-sm">Fortalezas</div>
              </CardContent>
            </Card>
          </div>

          {/* Grid de Módulos PAES Balanceado */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paesModules.map((module) => {
              const Icon = module.icon;
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                  onClick={() => handleModuleSelect(module)}
                >
                  <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${module.color} text-white`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-white text-lg">{module.name}</CardTitle>
                            <p className="text-white/70 text-sm">{module.description}</p>
                          </div>
                        </div>
                        <Badge className={
                          module.priority === 'high' ? 'bg-red-600/20 text-red-400' :
                          module.priority === 'medium' ? 'bg-yellow-600/20 text-yellow-400' :
                          'bg-green-600/20 text-green-400'
                        }>
                          {module.priority === 'high' ? 'Alta' : module.priority === 'medium' ? 'Media' : 'Baja'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Progreso */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-white">Progreso</span>
                          <span className="text-white font-semibold">{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-2" />
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <div className="text-lg font-bold text-cyan-400">{module.projectedScore}</div>
                          <div className="text-xs text-white/60">Puntaje</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-400">{module.strengths}</div>
                          <div className="text-xs text-white/60">Fortalezas</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-red-400">{module.criticalAreas}</div>
                          <div className="text-xs text-white/60">Críticas</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Widget de Navegación */}
          <QuickNavigationWidget />
        </div>
      );
    }

    // Renderizar contenido específico del módulo
    switch (activeModule) {
      case 'competencia-lectora':
        return <PAESCompetenciaLectoraIntegration />;
      case 'matematica-1':
      case 'matematica-2':
        return <MathematicsIntegration />;
      case 'ciencias':
        return <SciencesIntegration />;
      case 'historia':
        return <HistoryIntegration />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Balanceado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Brain className="w-8 h-8 text-cyan-400" />
            Hub PAES 2025
          </h1>
          <p className="text-white/70 text-lg">
            Preparación integral para las 5 pruebas PAES
          </p>
        </motion.div>

        {/* Navegación de módulos */}
        {activeModule !== 'overview' && (
          <div className="mb-6">
            <Button
              onClick={() => setActiveModule('overview')}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              ← Volver al Hub
            </Button>
          </div>
        )}

        {/* Contenido del módulo activo */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderModuleContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
