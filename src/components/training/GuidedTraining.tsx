
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapPin, CheckCircle, Lock, Play } from 'lucide-react';

export const GuidedTraining: React.FC = () => {
  const guidedPaths = [
    {
      id: 1,
      title: "Fundamentos de Comprensión Lectora",
      description: "Domina las técnicas básicas de análisis textual",
      progress: 75,
      lessons: 12,
      completed: 9,
      difficulty: "Básico",
      isUnlocked: true,
      estimatedTime: "3-4 horas"
    },
    {
      id: 2,
      title: "Resolución de Problemas Matemáticos",
      description: "Estrategias para enfrentar problemas complejos",
      progress: 40,
      lessons: 15,
      completed: 6,
      difficulty: "Intermedio",
      isUnlocked: true,
      estimatedTime: "5-6 horas"
    },
    {
      id: 3,
      title: "Análisis Científico Avanzado",
      description: "Interpretación de datos y gráficos científicos",
      progress: 0,
      lessons: 10,
      completed: 0,
      difficulty: "Avanzado",
      isUnlocked: false,
      estimatedTime: "4-5 horas"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Básico': return 'bg-green-600/20 text-green-300 border-green-500';
      case 'Intermedio': return 'bg-yellow-600/20 text-yellow-300 border-yellow-500';
      case 'Avanzado': return 'bg-red-600/20 text-red-300 border-red-500';
      default: return 'bg-gray-600/20 text-gray-300 border-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Descripción principal */}
      <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <MapPin className="h-6 w-6 text-purple-400" />
            Entrenamiento Dirigido
          </CardTitle>
          <CardDescription className="text-gray-300">
            Sigue rutas de aprendizaje estructuradas con lecciones progresivas
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Rutas de aprendizaje */}
      <div className="space-y-4">
        {guidedPaths.map((path) => (
          <Card 
            key={path.id} 
            className={`bg-gray-800 border-gray-700 ${
              !path.isUnlocked ? 'opacity-60' : 'hover:border-purple-500/50'
            } transition-all`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white flex items-center gap-3">
                    {path.isUnlocked ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <Lock className="h-5 w-5 text-gray-500" />
                    )}
                    {path.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400 mt-1">
                    {path.description}
                  </CardDescription>
                </div>
                <Badge 
                  variant="outline" 
                  className={`${getDifficultyColor(path.difficulty)} text-xs`}
                >
                  {path.difficulty}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Progreso */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progreso</span>
                  <span className="text-white">
                    {path.completed}/{path.lessons} lecciones
                  </span>
                </div>
                <Progress value={path.progress} className="h-2" />
                <div className="text-xs text-gray-400">
                  {path.progress}% completado
                </div>
              </div>

              {/* Detalles */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Tiempo estimado:</span>
                  <div className="text-white font-medium">{path.estimatedTime}</div>
                </div>
                <div>
                  <span className="text-gray-400">Lecciones restantes:</span>
                  <div className="text-white font-medium">
                    {path.lessons - path.completed}
                  </div>
                </div>
              </div>

              {/* Botón de acción */}
              <div className="pt-2">
                {path.isUnlocked ? (
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {path.progress > 0 ? 'Continuar Ruta' : 'Comenzar Ruta'}
                  </Button>
                ) : (
                  <Button 
                    disabled 
                    className="w-full"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Bloqueado
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Información sobre el sistema */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">¿Cómo funcionan las Rutas Dirigidas?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <div className="font-medium text-white">Progresión Estructurada</div>
                  <div className="text-sm text-gray-400">
                    Cada lección se basa en la anterior, construyendo conocimiento sólido
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <div className="font-medium text-white">Desbloqueo por Logros</div>
                  <div className="text-sm text-gray-400">
                    Completa rutas para desbloquear niveles más avanzados
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <div className="font-medium text-white">Evaluación Continua</div>
                  <div className="text-sm text-gray-400">
                    Tu progreso se evalúa constantemente para adaptar el contenido
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <div className="font-medium text-white">Certificación</div>
                  <div className="text-sm text-gray-400">
                    Obtén certificados al completar cada ruta de aprendizaje
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
