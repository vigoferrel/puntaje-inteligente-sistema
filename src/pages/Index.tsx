
import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useAuth } from '@/contexts/AuthContext';
import { SimpleLoadingScreen } from '@/components/SimpleLoadingScreen';
import { Brain, Target, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
  const { user, isLoading, error } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return <SimpleLoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3 mb-4">
              <Brain className="w-10 h-10 text-cyan-400" />
              PAES Master
            </h1>
            <p className="text-white/80 text-xl">
              Sistema Inteligente de Preparación PAES
            </p>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Estudiantes Activos</p>
                    <p className="text-2xl font-bold text-white">1,250</p>
                  </div>
                  <div className="p-3 rounded-full bg-gradient-to-r from-blue-400 to-indigo-600">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Promedio de Mejora</p>
                    <p className="text-2xl font-bold text-white">+125pts</p>
                  </div>
                  <div className="p-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-600">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Ejercicios Resueltos</p>
                    <p className="text-2xl font-bold text-white">50,000+</p>
                  </div>
                  <div className="p-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-600">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Tasa de Éxito</p>
                    <p className="text-2xl font-bold text-white">94%</p>
                  </div>
                  <div className="p-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-600">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Acciones Principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Sistema Unificado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-4">
                  Accede al sistema completo de preparación PAES con IA avanzada.
                </p>
                <Button 
                  onClick={() => navigate('/unified')}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                >
                  Ir al Sistema Unificado
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Dashboard PAES</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-4">
                  Visualiza tu progreso y resultados de evaluaciones PAES.
                </p>
                <Button 
                  onClick={() => navigate('/paes')}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  Ver Dashboard PAES
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Status */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm">
                Sistema PAES Activo • {user ? 'Usuario: ' + (user.email?.split('@')[0] || 'Anónimo') : 'Visitante'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Index;
