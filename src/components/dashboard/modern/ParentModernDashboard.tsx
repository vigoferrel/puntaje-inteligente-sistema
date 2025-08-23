
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  AlertTriangle,
  BookOpen,
  Award,
  Clock
} from 'lucide-react';
import { useUserRelationships } from '@/hooks/useUserRelationships';
import { useRealProgressData } from '@/hooks/useRealProgressData';

const ParentModernDashboard: React.FC = () => {
  const { children, isLoading: relationshipsLoading, error } = useUserRelationships();
  const { metrics, isLoading: metricsLoading } = useRealProgressData();

  if (relationshipsLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-red-800 mb-1">Error de Conexión</h3>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Panel de Padre/Tutor</h3>
            <p className="text-gray-600 mb-4">
              No tienes estudiantes vinculados a tu cuenta. 
            </p>
            <Button variant="outline">
              Vincular Estudiante
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Panel de Familia</h1>
          <p className="text-gray-600">
            Supervisa el progreso de {children.length} estudiante{children.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          <Users className="w-4 h-4 mr-2" />
          {children.length} Estudiante{children.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progreso Promedio</p>
                <p className="text-2xl font-bold">
                  {children.length > 0 ? Math.round(children.length * 45) : 0}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Horas de Estudio</p>
                <p className="text-2xl font-bold">
                  {metrics?.totalStudyTime || 0}h
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Evaluaciones</p>
                <p className="text-2xl font-bold">
                  {metrics?.totalSessions || 0}
                </p>
              </div>
              <Award className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de estudiantes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {children.map((child) => (
          <Card key={child.id} className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {child.child_profile?.name || 'Estudiante'}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {child.child_profile?.target_career || 'Sin carrera definida'}
                  </p>
                </div>
                <Badge variant="secondary">
                  {child.child_profile?.learning_phase || 'DIAGNOSIS'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progreso del estudiante */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progreso General</span>
                  <span>{metrics?.overallProgress || 0}%</span>
                </div>
                <Progress value={metrics?.overallProgress || 0} className="h-2" />
              </div>

              {/* Métricas rápidas */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {metrics?.completedNodes || 0}
                  </div>
                  <div className="text-xs text-gray-600">Nodos</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    {metrics?.streakDays || 0}
                  </div>
                  <div className="text-xs text-gray-600">Racha</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-600">
                    {metrics?.learningVelocity || 0}%
                  </div>
                  <div className="text-xs text-gray-600">Velocidad</div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Ver Detalle
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  Programar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recomendaciones para padres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Recomendaciones de Seguimiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {children.map((child, index) => (
              <div key={child.id} className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-amber-800">
                      {child.child_profile?.name || `Estudiante ${index + 1}`}
                    </p>
                    <p className="text-sm text-amber-700">
                      {metrics?.overallProgress && metrics.overallProgress < 30
                        ? "Necesita más tiempo de estudio diario"
                        : metrics?.streakDays === 0
                        ? "Motivar para mantener constancia en el estudio"
                        : "Progreso satisfactorio, continuar con el plan actual"}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-amber-700 border-amber-300">
                    {metrics?.overallProgress && metrics.overallProgress < 30 ? "Atención" : "Normal"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParentModernDashboard;
