
import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useAuth } from '@/contexts/AuthContext';
import { SimpleLoadingScreen } from '@/components/SimpleLoadingScreen';
import { Brain, GraduationCap, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PAESDashboard: React.FC = () => {
  const { user, isLoading, error } = useAuth();

  if (isLoading) {
    return <SimpleLoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Error de Autenticación</h1>
          <p className="text-red-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.href = '/'} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3 mb-4">
              <GraduationCap className="w-10 h-10 text-green-400" />
              Dashboard PAES
            </h1>
            <p className="text-white/80 text-xl">
              Evaluaciones, resultados y preparación PAES
            </p>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Evaluaciones Completadas</p>
                    <p className="text-2xl font-bold text-white">12</p>
                  </div>
                  <div className="p-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-600">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Promedio General</p>
                    <p className="text-2xl font-bold text-white">675</p>
                  </div>
                  <div className="p-3 rounded-full bg-gradient-to-r from-blue-400 to-indigo-600">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Mejor Puntaje</p>
                    <p className="text-2xl font-bold text-white">750</p>
                  </div>
                  <div className="p-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-600">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Tiempo Estudiado</p>
                    <p className="text-2xl font-bold text-white">45h</p>
                  </div>
                  <div className="p-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-600">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contenido principal */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Próximas Evaluaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-white/90 space-y-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="font-semibold">Simulacro PAES Matemática</h3>
                  <p className="text-sm text-white/70">Programado para el próximo viernes</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="font-semibold">Evaluación Comprensión Lectora</h3>
                  <p className="text-sm text-white/70">Disponible desde mañana</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="font-semibold">Test de Ciencias</h3>
                  <p className="text-sm text-white/70">Próxima semana</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm">
                Sistema PAES Activo • {user ? 'Usuario: ' + (user.email || 'Anónimo') : 'Visitante'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default PAESDashboard;
