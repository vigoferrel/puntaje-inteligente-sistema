
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/app-layout';
import { AppInitializer } from '@/components/AppInitializer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, BookOpen, Target, Clock, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const SubjectDetail = () => {
  const { subject } = useParams();
  const navigate = useNavigate();

  // Mock data de la materia
  const subjectData = {
    'competencia-lectora': {
      name: 'Competencia Lectora',
      description: 'Desarrollo de habilidades de comprensión lectora para la PAES',
      totalNodes: 30,
      completedNodes: 18,
      tier1: { total: 14, completed: 10 },
      tier2: { total: 13, completed: 6 },
      tier3: { total: 3, completed: 2 },
      estimatedTime: '45 horas',
      lastActivity: 'Hace 2 días'
    }
  };

  const data = subjectData[subject as keyof typeof subjectData];

  if (!data) {
    return (
      <AppInitializer>
        <AppLayout>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold">Materia no encontrada</h1>
            <Button onClick={() => navigate('/')} className="mt-4">
              Volver al inicio
            </Button>
          </div>
        </AppLayout>
      </AppInitializer>
    );
  }

  const overallProgress = (data.completedNodes / data.totalNodes) * 100;

  return (
    <AppInitializer>
      <AppLayout>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-3xl font-bold">{data.name}</h1>
                <p className="text-muted-foreground">{data.description}</p>
              </div>
            </div>
            
            <Button
              onClick={() => navigate(`/ejercicios/${subject}`)}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Generar Ejercicios
            </Button>
          </div>

          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Progreso General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progreso Total</span>
                    <span className="font-semibold">{Math.round(overallProgress)}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-3" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{data.completedNodes}</div>
                    <div className="text-sm text-muted-foreground">Nodos Completados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{data.totalNodes}</div>
                    <div className="text-sm text-muted-foreground">Nodos Totales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{data.estimatedTime}</div>
                    <div className="text-sm text-muted-foreground">Tiempo Estimado</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{data.lastActivity}</div>
                    <div className="text-sm text-muted-foreground">Última Actividad</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tier Progress */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-red-600" />
                  Tier 1 - Críticos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Progreso</span>
                    <span className="text-sm font-semibold">
                      {data.tier1.completed}/{data.tier1.total}
                    </span>
                  </div>
                  <Progress 
                    value={(data.tier1.completed / data.tier1.total) * 100} 
                    className="h-2"
                  />
                  <Badge variant="destructive" className="w-full justify-center">
                    Alta Prioridad
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-yellow-600" />
                  Tier 2 - Importantes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Progreso</span>
                    <span className="text-sm font-semibold">
                      {data.tier2.completed}/{data.tier2.total}
                    </span>
                  </div>
                  <Progress 
                    value={(data.tier2.completed / data.tier2.total) * 100} 
                    className="h-2"
                  />
                  <Badge className="w-full justify-center bg-yellow-100 text-yellow-800">
                    Media Prioridad
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  Tier 3 - Complementarios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Progreso</span>
                    <span className="text-sm font-semibold">
                      {data.tier3.completed}/{data.tier3.total}
                    </span>
                  </div>
                  <Progress 
                    value={(data.tier3.completed / data.tier3.total) * 100} 
                    className="h-2"
                  />
                  <Badge className="w-full justify-center bg-green-100 text-green-800">
                    Baja Prioridad
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/ejercicios/${subject}`)}
                  className="h-16 flex flex-col items-center justify-center gap-2"
                >
                  <Play className="h-6 w-6" />
                  <span>Generar Ejercicios</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/diagnostico')}
                  className="h-16 flex flex-col items-center justify-center gap-2"
                >
                  <Target className="h-6 w-6" />
                  <span>Diagnóstico</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/lectoguia')}
                  className="h-16 flex flex-col items-center justify-center gap-2"
                >
                  <BookOpen className="h-6 w-6" />
                  <span>LectoGuía</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AppLayout>
    </AppInitializer>
  );
};

export default SubjectDetail;
